import { FarmerProfile, Language, SchemeRecommendation } from "@/types/farmer";
import { RecommendationService } from "./RecommendationService";
import { TranslationService } from "./TranslationService";
import { schemes } from "@/data/schemes";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  schemes?: SchemeRecommendation[];
}

export class ChatService {
  private static messageHistory: ChatMessage[] = [];
  private static partialProfile: Partial<FarmerProfile> = {};

  // Process user message and generate response
  static async processMessage(
    userMessage: string,
    language: Language,
    currentProfile?: FarmerProfile
  ): Promise<ChatMessage> {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if it's a general question about schemes
    const isGeneralQuestion = this.isGeneralQuestion(lowerMessage, language);
    
    if (isGeneralQuestion) {
      return this.handleGeneralQuestion(userMessage, language);
    }

    // Extract data from user message
    const extractedData = TranslationService.extractFarmerData(userMessage, language);
    
    // Merge with partial profile
    this.partialProfile = { ...this.partialProfile, ...extractedData };

    // Check if we have enough data to make recommendations
    const hasMinimalData = this.partialProfile.landSize !== undefined || 
                          this.partialProfile.category !== undefined ||
                          this.partialProfile.crops !== undefined;

    let responseContent = "";
    let recommendedSchemes: SchemeRecommendation[] = [];

    if (hasMinimalData || currentProfile) {
      // Create a temporary profile for recommendations
      const profileForRecommendation: FarmerProfile = currentProfile || {
        name: "User",
        state: this.partialProfile.state || "Maharashtra",
        district: "Unknown",
        landSize: this.partialProfile.landSize || 2,
        landType: this.partialProfile.landType || "irrigated",
        crops: this.partialProfile.crops || ["rice"],
        annualIncome: this.partialProfile.annualIncome || 200000,
        category: this.partialProfile.category || "general",
        irrigationAvailable: true,
        bankLinked: true,
      };

      // Get recommendations
      recommendedSchemes = RecommendationService.getTop(profileForRecommendation, 3);

      // Generate contextual response based on what was extracted
      const responses = {
        en: {
          foundWithData: `Based on your details (${this.getProfileSummary(language)}), I found ${recommendedSchemes.length} scheme(s) that match your profile:`,
          found: `I found ${recommendedSchemes.length} scheme(s) for you:`,
          noSchemes: "I couldn't find any schemes matching your criteria. Please provide more details about your farming situation.",
        },
        hi: {
          foundWithData: `आपके विवरण (${this.getProfileSummary(language)}) के आधार पर, मुझे ${recommendedSchemes.length} योजना(एं) मिली:`,
          found: `मुझे आपके लिए ${recommendedSchemes.length} योजना(एं) मिली:`,
          noSchemes: "मुझे आपके मानदंडों से मेल खाने वाली कोई योजना नहीं मिली। कृपया अपनी खेती की स्थिति के बारे में अधिक विवरण प्रदान करें।",
        },
        mr: {
          foundWithData: `तुमच्या तपशीलांवर आधारित (${this.getProfileSummary(language)}), मला ${recommendedSchemes.length} योजना सापडल्या:`,
          found: `मला तुमच्यासाठी ${recommendedSchemes.length} योजना सापडल्या:`,
          noSchemes: "मला तुमच्या निकषांशी जुळणारी कोणतीही योजना सापडली नाही. कृपया तुमच्या शेतीच्या परिस्थितीबद्दल अधिक तपशील द्या।",
        },
      };

      if (recommendedSchemes.length === 0) {
        responseContent = responses[language].noSchemes;
      } else {
        // Use contextual response if we extracted new data
        responseContent = Object.keys(extractedData).length > 0 
          ? responses[language].foundWithData 
          : responses[language].found;
        
        responseContent += "\n\n";
        recommendedSchemes.forEach((rec, idx) => {
          const eligibilityText = rec.eligible 
            ? (language === "en" ? "✓ Eligible" : language === "hi" ? "✓ पात्र" : "✓ पात्र")
            : (language === "en" ? "⚠ Partially Eligible" : language === "hi" ? "⚠ आंशिक रूप से पात्र" : "⚠ अंशतः पात्र");
          
          responseContent += `${idx + 1}. ${rec.scheme.name[language]} (${rec.totalScore}% ${language === "en" ? "match" : language === "hi" ? "मेल" : "जुळणी"})\n`;
          responseContent += `   ${eligibilityText}\n`;
          responseContent += `   ${rec.scheme.benefits[language]}\n\n`;
        });
      }
    } else {
      // Ask for more information
      const missingFields = [];
      if (!this.partialProfile.landSize) missingFields.push(
        language === "en" ? "land size (in acres)" : language === "hi" ? "भूमि का आकार (एकड़ में)" : "जमिनीचे क्षेत्रफळ (एकरात)"
      );
      if (!this.partialProfile.crops) missingFields.push(
        language === "en" ? "crops you grow" : language === "hi" ? "आप कौन सी फसलें उगाते हैं" : "तुम्ही कोणती पिके पिकवता"
      );
      if (!this.partialProfile.category) missingFields.push(
        language === "en" ? "your category (General/SC/ST/OBC)" : language === "hi" ? "आपकी श्रेणी (सामान्य/अनुसूचित जाति/अनुसूचित जनजाति/ओबीसी)" : "तुमचा प्रवर्ग (सामान्य/अनुसूचित जाती/अनुसूचित जमाती/ओबीसी)"
      );

      const needMoreText = language === "en" 
        ? "To help you find the best schemes, I need some information:"
        : language === "hi"
        ? "आपको सर्वोत्तम योजनाएं खोजने में मदद करने के लिए, मुझे कुछ जानकारी चाहिए:"
        : "तुम्हाला सर्वोत्तम योजना शोधण्यात मदत करण्यासाठी, मला काही माहिती हवी आहे:";

      responseContent = `${needMoreText}\n${missingFields.map(f => `• ${f}`).join("\n")}`;
    }

    const assistantMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
      schemes: recommendedSchemes.length > 0 ? recommendedSchemes : undefined,
    };

    this.messageHistory.push(assistantMessage);
    return assistantMessage;
  }

  // Get a summary of the current profile data
  private static getProfileSummary(language: Language): string {
    const parts: string[] = [];
    
    if (this.partialProfile.landSize) {
      const text = language === "en" ? `${this.partialProfile.landSize} acres` 
        : language === "hi" ? `${this.partialProfile.landSize} एकड़` 
        : `${this.partialProfile.landSize} एकर`;
      parts.push(text);
    }
    
    if (this.partialProfile.crops && this.partialProfile.crops.length > 0) {
      const cropText = language === "en" ? this.partialProfile.crops.join(", ")
        : language === "hi" ? this.partialProfile.crops.join(", ")
        : this.partialProfile.crops.join(", ");
      parts.push(cropText);
    }
    
    if (this.partialProfile.category) {
      parts.push(this.partialProfile.category.toUpperCase());
    }
    
    if (this.partialProfile.annualIncome) {
      const incomeText = language === "en" ? `₹${(this.partialProfile.annualIncome / 100000).toFixed(1)}L income`
        : language === "hi" ? `₹${(this.partialProfile.annualIncome / 100000).toFixed(1)}L आय`
        : `₹${(this.partialProfile.annualIncome / 100000).toFixed(1)}L उत्पन्न`;
      parts.push(incomeText);
    }
    
    return parts.join(", ");
  }

  // Add user message to history
  static addUserMessage(content: string): ChatMessage {
    const message: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    this.messageHistory.push(message);
    return message;
  }

  // Get message history
  static getHistory(): ChatMessage[] {
    return this.messageHistory;
  }

  // Clear history and partial profile
  static clearHistory(): void {
    this.messageHistory = [];
    this.partialProfile = {};
  }

  // Get partial profile
  static getPartialProfile(): Partial<FarmerProfile> {
    return this.partialProfile;
  }

  // Check if message is a general question
  private static isGeneralQuestion(message: string, language: Language): boolean {
    const generalKeywords = {
      en: ["what schemes", "which schemes", "available schemes", "tell me about", "list schemes", "show schemes", "how many schemes"],
      hi: ["कौन सी योजनाएं", "कितनी योजनाएं", "योजनाओं के बारे", "योजनाएं दिखाएं", "उपलब्ध योजनाएं"],
      mr: ["कोणत्या योजना", "किती योजना", "योजनांबद्दल", "योजना दाखवा", "उपलब्ध योजना"],
    };

    return generalKeywords[language].some(keyword => message.includes(keyword));
  }

  // Handle general questions about schemes
  private static handleGeneralQuestion(userMessage: string, language: Language): ChatMessage {
    const lowerMessage = userMessage.toLowerCase();
    const allSchemes = schemes.filter(s => s.active);
    
    let responseContent = "";
    let filteredSchemes = allSchemes;

    // Check for specific filters in the question
    if (lowerMessage.includes("small") || lowerMessage.includes("छोटे") || lowerMessage.includes("लहान")) {
      filteredSchemes = allSchemes.filter(s => !s.eligibility.landSize || (s.eligibility.landSize.max && s.eligibility.landSize.max <= 5));
      const text = language === "en" ? "Here are schemes for small farmers (up to 5 acres):"
        : language === "hi" ? "यहाँ छोटे किसानों (5 एकड़ तक) के लिए योजनाएं हैं:"
        : "येथे लहान शेतकऱ्यांसाठी (5 एकरापर्यंत) योजना आहेत:";
      responseContent = text;
    } else if (lowerMessage.includes("sc") || lowerMessage.includes("अनुसूचित जाति") || lowerMessage.includes("अनुसूचित जाती")) {
      filteredSchemes = allSchemes.filter(s => !s.eligibility.categories || s.eligibility.categories.includes("sc"));
      const text = language === "en" ? "Here are schemes for SC category farmers:"
        : language === "hi" ? "यहाँ अनुसूचित जाति के किसानों के लिए योजनाएं हैं:"
        : "येथे अनुसूचित जाती शेतकऱ्यांसाठी योजना आहेत:";
      responseContent = text;
    } else if (lowerMessage.includes("st") || lowerMessage.includes("अनुसूचित जनजाति") || lowerMessage.includes("अनुसूचित जमाती")) {
      filteredSchemes = allSchemes.filter(s => !s.eligibility.categories || s.eligibility.categories.includes("st"));
      const text = language === "en" ? "Here are schemes for ST category farmers:"
        : language === "hi" ? "यहाँ अनुसूचित जनजाति के किसानों के लिए योजनाएं हैं:"
        : "येथे अनुसूचित जमाती शेतकऱ्यांसाठी योजना आहेत:";
      responseContent = text;
    } else {
      const text = language === "en" ? `We have ${allSchemes.length} active government schemes available. Here are some popular ones:`
        : language === "hi" ? `हमारे पास ${allSchemes.length} सक्रिय सरकारी योजनाएं उपलब्ध हैं। यहाँ कुछ लोकप्रिय हैं:`
        : `आमच्याकडे ${allSchemes.length} सक्रिय सरकारी योजना उपलब्ध आहेत. येथे काही लोकप्रिय आहेत:`;
      responseContent = text;
      filteredSchemes = allSchemes.slice(0, 5);
    }

    responseContent += "\n\n";
    filteredSchemes.forEach((scheme, idx) => {
      responseContent += `${idx + 1}. ${scheme.name[language]}\n`;
      responseContent += `   ${scheme.description[language]}\n`;
      responseContent += `   ${scheme.benefits[language]}\n\n`;
    });

    const helpText = language === "en" 
      ? "\nTo get personalized recommendations, please tell me about your land size, crops, and category."
      : language === "hi"
      ? "\nव्यक्तिगत सिफारिशें प्राप्त करने के लिए, कृपया मुझे अपनी भूमि के आकार, फसलों और श्रेणी के बारे में बताएं।"
      : "\nवैयक्तिक शिफारशी मिळवण्यासाठी, कृपया मला तुमच्या जमिनीचे क्षेत्रफळ, पिके आणि प्रवर्ग सांगा.";
    
    responseContent += helpText;

    const assistantMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
    };

    this.messageHistory.push(assistantMessage);
    return assistantMessage;
  }
}
