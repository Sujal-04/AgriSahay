import { Language, FarmerProfile } from "@/types/farmer";
import { schemes } from "@/data/schemes";

export class TranslationService {
  // Extract structured data from natural language input
  static extractFarmerData(text: string, language: Language): Partial<FarmerProfile> {
    const lowerText = text.toLowerCase();
    const extracted: Partial<FarmerProfile> = {};

    // Extract land size
    const landPatterns = {
      en: /(\d+(?:\.\d+)?)\s*(?:acre|acres|hectare|hectares)/i,
      hi: /(\d+(?:\.\d+)?)\s*(?:एकड़|हेक्टेयर)/i,
      mr: /(\d+(?:\.\d+)?)\s*(?:एकर|हेक्टर)/i,
    };
    const landMatch = lowerText.match(landPatterns[language]);
    if (landMatch) {
      extracted.landSize = parseFloat(landMatch[1]);
    }

    // Extract income
    const incomePatterns = {
      en: /(?:income|earn|earning).*?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:rupees|rs|₹|lakh|lakhs|thousand)?/i,
      hi: /(?:आय|कमाई).*?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:रुपये|लाख|हजार)?/i,
      mr: /(?:उत्पन्न|कमाई).*?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:रुपये|लाख|हजार)?/i,
    };
    const incomeMatch = lowerText.match(incomePatterns[language]);
    if (incomeMatch) {
      let income = parseFloat(incomeMatch[1].replace(/,/g, ""));
      if (lowerText.includes("lakh") || lowerText.includes("लाख")) {
        income *= 100000;
      } else if (lowerText.includes("thousand") || lowerText.includes("हजार")) {
        income *= 1000;
      }
      extracted.annualIncome = income;
    }

    // Extract crops
    const cropKeywords = {
      en: ["rice", "wheat", "maize", "cotton", "sugarcane", "soybean", "pulses", "vegetables", "fruits"],
      hi: ["धान", "गेहूं", "मक्का", "कपास", "गन्ना", "सोयाबीन", "दालें", "सब्जियां", "फल"],
      mr: ["तांदूळ", "गहू", "मका", "कापूस", "ऊस", "सोयाबीन", "डाळी", "भाज्या", "फळे"],
    };
    const cropMapping: Record<string, string> = {
      "धान": "rice", "तांदूळ": "rice",
      "गेहूं": "wheat", "गहू": "wheat",
      "मक्का": "maize", "मका": "maize",
      "कपास": "cotton", "कापूस": "cotton",
      "गन्ना": "sugarcane", "ऊस": "sugarcane",
      "सोयाबीन": "soybean",
      "दालें": "pulses", "डाळी": "pulses",
      "सब्जियां": "vegetables", "भाज्या": "vegetables",
      "फल": "fruits", "फळे": "fruits",
    };
    
    const detectedCrops: string[] = [];
    cropKeywords[language].forEach((crop, idx) => {
      if (lowerText.includes(crop)) {
        const englishCrop = language === "en" ? crop : cropMapping[crop] || crop;
        detectedCrops.push(englishCrop);
      }
    });
    if (detectedCrops.length > 0) {
      extracted.crops = detectedCrops;
    }

    // Extract category
    const categoryKeywords = {
      en: { sc: ["sc", "scheduled caste"], st: ["st", "scheduled tribe"], obc: ["obc", "backward"], general: ["general"] },
      hi: { sc: ["अनुसूचित जाति", "एससी"], st: ["अनुसूचित जनजाति", "एसटी"], obc: ["ओबीसी", "पिछड़ा"], general: ["सामान्य"] },
      mr: { sc: ["अनुसूचित जाती", "एससी"], st: ["अनुसूचित जमाती", "एसटी"], obc: ["ओबीसी", "मागासवर्गीय"], general: ["सामान्य"] },
    };
    
    for (const [cat, keywords] of Object.entries(categoryKeywords[language])) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        extracted.category = cat as "general" | "sc" | "st" | "obc" | "minority";
        break;
      }
    }

    // Extract land type
    const landTypeKeywords = {
      en: { irrigated: ["irrigated", "irrigation"], rainfed: ["rainfed", "rain"], dryland: ["dryland", "dry"], wetland: ["wetland", "wet"] },
      hi: { irrigated: ["सिंचित", "सिंचाई"], rainfed: ["वर्षा", "बारिश"], dryland: ["शुष्क"], wetland: ["आर्द्र"] },
      mr: { irrigated: ["सिंचित", "सिंचन"], rainfed: ["पावसावर"], dryland: ["कोरडवाहू"], wetland: ["ओलसर"] },
    };
    
    for (const [type, keywords] of Object.entries(landTypeKeywords[language])) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        extracted.landType = type as "irrigated" | "rainfed" | "dryland" | "wetland";
        break;
      }
    }

    return extracted;
  }

  // Generate response in selected language
  static generateResponse(schemes: any[], language: Language, context: string): string {
    const responses = {
      en: {
        found: `I found ${schemes.length} scheme(s) that match your profile:`,
        noSchemes: "I couldn't find any schemes matching your criteria. Please provide more details about your farming situation.",
        needMore: "I need more information to help you better. Please tell me about:",
      },
      hi: {
        found: `मुझे आपकी प्रोफाइल से मेल खाने वाली ${schemes.length} योजना(एं) मिली:`,
        noSchemes: "मुझे आपके मानदंडों से मेल खाने वाली कोई योजना नहीं मिली। कृपया अपनी खेती की स्थिति के बारे में अधिक विवरण प्रदान करें।",
        needMore: "आपकी बेहतर मदद के लिए मुझे अधिक जानकारी चाहिए। कृपया मुझे बताएं:",
      },
      mr: {
        found: `मला तुमच्या प्रोफाइलशी जुळणाऱ्या ${schemes.length} योजना सापडल्या:`,
        noSchemes: "मला तुमच्या निकषांशी जुळणारी कोणतीही योजना सापडली नाही. कृपया तुमच्या शेतीच्या परिस्थितीबद्दल अधिक तपशील द्या।",
        needMore: "तुम्हाला चांगली मदत करण्यासाठी मला अधिक माहिती हवी आहे. कृपया मला सांगा:",
      },
    };

    if (schemes.length === 0) {
      return responses[language].noSchemes;
    }

    return responses[language].found;
  }

  // Translate scheme details
  static translateSchemeDetails(scheme: any, language: Language): string {
    return `${scheme.name[language]}\n${scheme.description[language]}\n${scheme.benefits[language]}`;
  }
}
