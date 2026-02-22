import { FarmerProfile, Language } from "@/types/farmer";
import { RecommendationService } from "./RecommendationService";
import { ProfileService } from "./ProfileService";
import { indianStates, cropOptions } from "@/data/translations";

// Simple NLP to extract profile fields from natural language input
export class ChatService {
  static extractProfile(text: string, language: Language): Partial<FarmerProfile> {
    const lower = text.toLowerCase();
    const profile: Partial<FarmerProfile> = {};

    // State detection
    for (const state of indianStates) {
      if (lower.includes(state.toLowerCase())) {
        profile.state = state;
        break;
      }
    }

    // Land size - match patterns like "5 acres", "5 एकड़", "५ एकर"
    const landMatch = text.match(/(\d+\.?\d*)\s*(acres?|एकड़|एकर|bigha|बीघा)/i);
    if (landMatch) {
      profile.landSize = parseFloat(landMatch[1]);
    }

    // Income - match patterns like "200000", "2 lakh", "₹200000"
    const incomeMatch = text.match(/(?:income|आय|उत्पन्न|₹)\s*(?:is\s*)?(\d+\.?\d*)\s*(lakh|lac|लाख)?/i)
      || text.match(/(\d+\.?\d*)\s*(lakh|lac|लाख)/i);
    if (incomeMatch) {
      let income = parseFloat(incomeMatch[1]);
      if (incomeMatch[2]) income *= 100000;
      profile.annualIncome = income;
    }

    // Crops
    const matchedCrops = cropOptions.filter(c => lower.includes(c));
    // Hindi/Marathi crop names
    const cropMap: Record<string, string> = {
      "धान": "rice", "चावल": "rice", "गेहूं": "wheat", "गहू": "wheat",
      "मक्का": "maize", "कपास": "cotton", "गन्ना": "sugarcane", "ऊस": "sugarcane",
      "सोयाबीन": "soybean", "दाल": "pulses", "सब्जी": "vegetables", "भाजी": "vegetables",
      "फल": "fruits", "फळ": "fruits", "मसाले": "spices", "तिलहन": "oilseeds",
      "बाजरा": "millets", "ज्वार": "millets", "जूट": "jute", "चाय": "tea", "चहा": "tea",
      "कॉफी": "coffee",
    };
    for (const [hindi, eng] of Object.entries(cropMap)) {
      if (text.includes(hindi) && !matchedCrops.includes(eng)) {
        matchedCrops.push(eng);
      }
    }
    if (matchedCrops.length > 0) profile.crops = matchedCrops;

    // Category
    const catMap: Record<string, FarmerProfile["category"]> = {
      "general": "general", "सामान्य": "general",
      "sc": "sc", "अनुसूचित जाति": "sc", "अनुसूचित जाती": "sc",
      "st": "st", "अनुसूचित जनजाति": "st", "अनुसूचित जमाती": "st",
      "obc": "obc", "अन्य पिछड़ा": "obc", "इतर मागास": "obc",
      "minority": "minority", "अल्पसंख्यक": "minority",
    };
    for (const [key, val] of Object.entries(catMap)) {
      if (lower.includes(key)) { profile.category = val; break; }
    }

    // Land type
    const ltMap: Record<string, FarmerProfile["landType"]> = {
      "irrigated": "irrigated", "सिंचित": "irrigated",
      "rainfed": "rainfed", "वर्षा": "rainfed", "पावसा": "rainfed",
      "dryland": "dryland", "शुष्क": "dryland", "कोरडवाहू": "dryland",
      "wetland": "wetland", "आर्द्र": "wetland", "ओलसर": "wetland",
    };
    for (const [key, val] of Object.entries(ltMap)) {
      if (lower.includes(key)) { profile.landType = val; break; }
    }

    // Boolean flags
    if (lower.includes("bank") || lower.includes("बैंक") || lower.includes("बँक")) {
      profile.bankLinked = true;
    }
    if (lower.includes("irrigation") || lower.includes("सिंचाई") || lower.includes("सिंचन")) {
      profile.irrigationAvailable = true;
    }

    return profile;
  }

  static mergeProfiles(existing: Partial<FarmerProfile>, update: Partial<FarmerProfile>): Partial<FarmerProfile> {
    const merged = { ...existing };
    for (const [key, value] of Object.entries(update)) {
      if (value !== undefined && value !== "" && value !== 0 && (!Array.isArray(value) || value.length > 0)) {
        if (key === "crops" && merged.crops) {
          merged.crops = [...new Set([...merged.crops, ...(value as string[])])];
        } else {
          (merged as any)[key] = value;
        }
      }
    }
    return merged;
  }

  static isProfileComplete(profile: Partial<FarmerProfile>): boolean {
    return !!(profile.state && profile.landSize && profile.landSize > 0 &&
      profile.crops && profile.crops.length > 0 && profile.annualIncome && profile.annualIncome > 0);
  }

  static getMissingFields(profile: Partial<FarmerProfile>, language: Language): string[] {
    const missing: string[] = [];
    const labels: Record<string, Record<Language, string>> = {
      state: { en: "state", hi: "राज्य", mr: "राज्य" },
      landSize: { en: "land size (acres)", hi: "भूमि का आकार (एकड़)", mr: "जमिनीचे क्षेत्रफळ (एकर)" },
      crops: { en: "crops grown", hi: "उगाई जाने वाली फसलें", mr: "पिके" },
      annualIncome: { en: "annual income", hi: "वार्षिक आय", mr: "वार्षिक उत्पन्न" },
    };
    if (!profile.state) missing.push(labels.state[language]);
    if (!profile.landSize || profile.landSize === 0) missing.push(labels.landSize[language]);
    if (!profile.crops || profile.crops.length === 0) missing.push(labels.crops[language]);
    if (!profile.annualIncome || profile.annualIncome === 0) missing.push(labels.annualIncome[language]);
    return missing;
  }

  static getRecommendationsResponse(profile: Partial<FarmerProfile>, language: Language) {
    const full: FarmerProfile = {
      name: profile.name || "",
      state: profile.state || "",
      district: profile.district || "",
      landSize: profile.landSize || 0,
      landType: profile.landType || "rainfed",
      crops: profile.crops || [],
      annualIncome: profile.annualIncome || 0,
      category: profile.category || "general",
      irrigationAvailable: profile.irrigationAvailable || false,
      bankLinked: profile.bankLinked || false,
    };
    return RecommendationService.getTop(full, 3);
  }
}
