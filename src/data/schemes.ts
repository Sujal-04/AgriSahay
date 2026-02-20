import { Scheme } from "@/types/farmer";

export const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: {
      en: "PM-KISAN Samman Nidhi",
      hi: "पीएम-किसान सम्मान निधि",
      mr: "पीएम-किसान सन्मान निधी",
    },
    description: {
      en: "Direct income support of ₹6,000 per year to farmer families in three equal installments.",
      hi: "किसान परिवारों को तीन समान किस्तों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।",
      mr: "शेतकरी कुटुंबांना तीन समान हप्त्यांमध्ये दरवर्षी ₹6,000 थेट उत्पन्न सहाय्य.",
    },
    benefits: {
      en: "₹6,000/year in 3 installments of ₹2,000 each",
      hi: "₹2,000 की 3 किस्तों में ₹6,000/वर्ष",
      mr: "प्रत्येकी ₹2,000 च्या 3 हप्त्यांमध्ये ₹6,000/वर्ष",
    },
    ministry: "Ministry of Agriculture",
    eligibility: {
      maxLandSize: 5,
      requiresBankAccount: true,
    },
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records"],
    applicationUrl: "https://pmkisan.gov.in",
  },
  {
    id: "pmfby",
    name: {
      en: "Pradhan Mantri Fasal Bima Yojana",
      hi: "प्रधानमंत्री फसल बीमा योजना",
      mr: "प्रधानमंत्री पीक विमा योजना",
    },
    description: {
      en: "Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities.",
      hi: "प्राकृतिक आपदाओं से फसल हानि से पीड़ित किसानों को वित्तीय सहायता प्रदान करने वाली फसल बीमा योजना।",
      mr: "नैसर्गिक आपत्तींमुळे पीक नुकसान झालेल्या शेतकऱ्यांना आर्थिक सहाय्य देणारी पीक विमा योजना.",
    },
    benefits: {
      en: "Premium subsidy up to 98% for food crops, full coverage for crop loss",
      hi: "खाद्य फसलों के लिए 98% तक प्रीमियम सब्सिडी, फसल हानि के लिए पूर्ण कवरेज",
      mr: "अन्नधान्य पिकांसाठी 98% पर्यंत प्रीमियम अनुदान, पीक नुकसानासाठी पूर्ण कव्हरेज",
    },
    ministry: "Ministry of Agriculture",
    eligibility: {
      requiresBankAccount: true,
      crops: ["rice", "wheat", "maize", "cotton", "sugarcane", "soybean", "pulses"],
    },
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records", "Sowing Certificate"],
    applicationUrl: "https://pmfby.gov.in",
  },
  {
    id: "soil-health",
    name: {
      en: "Soil Health Card Scheme",
      hi: "मृदा स्वास्थ्य कार्ड योजना",
      mr: "मृदा आरोग्य कार्ड योजना",
    },
    description: {
      en: "Provides soil health cards with crop-wise recommendations for nutrients and fertilizers.",
      hi: "पोषक तत्वों और उर्वरकों के लिए फसलवार सिफारिशों के साथ मृदा स्वास्थ्य कार्ड प्रदान करता है।",
      mr: "पोषक आणि खतांसाठी पीकनिहाय शिफारशींसह मृदा आरोग्य कार्ड प्रदान करते.",
    },
    benefits: {
      en: "Free soil testing and recommendations for better crop yield",
      hi: "बेहतर फसल उपज के लिए मुफ्त मिट्टी परीक्षण और सिफारिशें",
      mr: "चांगल्या पीक उत्पादनासाठी मोफत माती चाचणी आणि शिफारशी",
    },
    ministry: "Ministry of Agriculture",
    eligibility: {},
    documents: ["Aadhaar Card", "Land Records"],
    applicationUrl: "https://soilhealth.dac.gov.in",
  },
  {
    id: "kcc",
    name: {
      en: "Kisan Credit Card",
      hi: "किसान क्रेडिट कार्ड",
      mr: "किसान क्रेडिट कार्ड",
    },
    description: {
      en: "Provides affordable credit to farmers for agricultural needs at subsidized interest rates.",
      hi: "किसानों को सब्सिडी वाली ब्याज दरों पर कृषि आवश्यकताओं के लिए सस्ता ऋण प्रदान करता है।",
      mr: "शेतकऱ्यांना अनुदानित व्याजदरावर कृषी गरजांसाठी परवडणारे कर्ज प्रदान करते.",
    },
    benefits: {
      en: "Credit up to ₹3 lakh at 4% interest rate, crop loan facility",
      hi: "4% ब्याज दर पर ₹3 लाख तक का क्रेडिट, फसल ऋण सुविधा",
      mr: "4% व्याजदरावर ₹3 लाखांपर्यंत क्रेडिट, पीक कर्ज सुविधा",
    },
    ministry: "Ministry of Finance",
    eligibility: {
      requiresBankAccount: true,
      minLandSize: 0.5,
    },
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records", "Passport Photo"],
    applicationUrl: "https://www.nabard.org",
  },
  {
    id: "pmksy",
    name: {
      en: "Pradhan Mantri Krishi Sinchayee Yojana",
      hi: "प्रधानमंत्री कृषि सिंचाई योजना",
      mr: "प्रधानमंत्री कृषी सिंचन योजना",
    },
    description: {
      en: "Ensures access to protective irrigation for every farm with 'Per Drop More Crop' approach.",
      hi: "'प्रति बूंद अधिक फसल' दृष्टिकोण के साथ हर खेत को सुरक्षात्मक सिंचाई तक पहुंच सुनिश्चित करता है।",
      mr: "'प्रत्येक थेंबातून अधिक पीक' दृष्टिकोनासह प्रत्येक शेताला संरक्षणात्मक सिंचनाची खात्री करते.",
    },
    benefits: {
      en: "55-100% subsidy on micro-irrigation systems like drip and sprinkler",
      hi: "ड्रिप और स्प्रिंकलर जैसी सूक्ष्म सिंचाई प्रणालियों पर 55-100% सब्सिडी",
      mr: "ठिबक आणि तुषार सिंचनासारख्या सूक्ष्म सिंचन प्रणालींवर 55-100% अनुदान",
    },
    ministry: "Ministry of Agriculture",
    eligibility: {
      landTypes: ["rainfed", "dryland"],
      categories: ["general", "sc", "st", "obc", "minority"],
    },
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook", "Quotation for Equipment"],
    applicationUrl: "https://pmksy.gov.in",
  },
  {
    id: "nmsa",
    name: {
      en: "National Mission for Sustainable Agriculture",
      hi: "राष्ट्रीय सतत कृषि मिशन",
      mr: "राष्ट्रीय शाश्वत कृषी अभियान",
    },
    description: {
      en: "Promotes sustainable agriculture through climate change adaptation, soil health management, and water use efficiency.",
      hi: "जलवायु परिवर्तन अनुकूलन, मृदा स्वास्थ्य प्रबंधन और जल उपयोग दक्षता के माध्यम से सतत कृषि को बढ़ावा देता है।",
      mr: "हवामान बदल अनुकूलन, मृदा आरोग्य व्यवस्थापन आणि जल वापर कार्यक्षमतेद्वारे शाश्वत कृषीला प्रोत्साहन देते.",
    },
    benefits: {
      en: "Training, demonstration, and financial assistance for sustainable farming practices",
      hi: "सतत कृषि प्रथाओं के लिए प्रशिक्षण, प्रदर्शन और वित्तीय सहायता",
      mr: "शाश्वत शेती पद्धतींसाठी प्रशिक्षण, प्रात्यक्षिक आणि आर्थिक सहाय्य",
    },
    ministry: "Ministry of Agriculture",
    eligibility: {
      maxIncome: 500000,
      categories: ["sc", "st", "obc", "minority"],
    },
    documents: ["Aadhaar Card", "Income Certificate", "Land Records", "Caste Certificate"],
    applicationUrl: "https://nmsa.dac.gov.in",
  },
  {
    id: "enam",
    name: {
      en: "e-NAM (National Agriculture Market)",
      hi: "ई-नाम (राष्ट्रीय कृषि बाजार)",
      mr: "ई-नाम (राष्ट्रीय कृषी बाजार)",
    },
    description: {
      en: "Online trading platform for agricultural commodities enabling farmers to sell produce at better prices.",
      hi: "कृषि वस्तुओं के लिए ऑनलाइन ट्रेडिंग प्लेटफॉर्म जो किसानों को बेहतर कीमतों पर उपज बेचने में सक्षम बनाता है।",
      mr: "कृषी वस्तूंसाठी ऑनलाइन ट्रेडिंग प्लॅटफॉर्म जे शेतकऱ्यांना चांगल्या किमतीत उत्पादन विकू शकतात.",
    },
    benefits: {
      en: "Better price discovery, reduced intermediaries, transparent bidding",
      hi: "बेहतर मूल्य खोज, कम बिचौलिये, पारदर्शी बोली",
      mr: "चांगली किंमत शोध, कमी मध्यस्थ, पारदर्शक बोली",
    },
    ministry: "Ministry of Agriculture",
    eligibility: {
      requiresBankAccount: true,
    },
    documents: ["Aadhaar Card", "Bank Passbook", "Mandi Registration"],
    applicationUrl: "https://enam.gov.in",
  },
  {
    id: "organic-farming",
    name: {
      en: "Paramparagat Krishi Vikas Yojana",
      hi: "परम्परागत कृषि विकास योजना",
      mr: "परंपरागत कृषी विकास योजना",
    },
    description: {
      en: "Promotes organic farming through cluster approach with financial assistance for certification and marketing.",
      hi: "प्रमाणन और विपणन के लिए वित्तीय सहायता के साथ क्लस्टर दृष्टिकोण के माध्यम से जैविक खेती को बढ़ावा देता है।",
      mr: "प्रमाणन आणि विपणनासाठी आर्थिक सहाय्यासह क्लस्टर दृष्टिकोनाद्वारे सेंद्रिय शेतीला प्रोत्साहन देते.",
    },
    benefits: {
      en: "₹50,000/hectare over 3 years for organic farming inputs and certification",
      hi: "जैविक खेती इनपुट और प्रमाणन के लिए 3 वर्षों में ₹50,000/हेक्टेयर",
      mr: "सेंद्रिय शेती निविष्ठा आणि प्रमाणनासाठी 3 वर्षांत ₹50,000/हेक्टर",
    },
    ministry: "Ministry of Agriculture",
    eligibility: {
      minLandSize: 1,
      maxLandSize: 10,
    },
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook", "Cluster Registration"],
    applicationUrl: "https://pgsindia-ncof.gov.in",
  },
];
