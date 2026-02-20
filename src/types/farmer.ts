export interface FarmerProfile {
  name: string;
  state: string;
  district: string;
  landSize: number;
  landType: "irrigated" | "rainfed" | "dryland" | "wetland";
  crops: string[];
  annualIncome: number;
  category: "general" | "sc" | "st" | "obc" | "minority";
  irrigationAvailable: boolean;
  bankLinked: boolean;
}

export interface SchemeEligibility {
  maxIncome?: number;
  minLandSize?: number;
  maxLandSize?: number;
  landTypes?: string[];
  categories?: string[];
  states?: string[];
  crops?: string[];
  requiresIrrigation?: boolean;
  requiresBankAccount?: boolean;
}

export interface Scheme {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  benefits: Record<string, string>;
  ministry: string;
  eligibility: SchemeEligibility;
  documents: string[];
  applicationUrl: string;
}

export interface SchemeRecommendation {
  scheme: Scheme;
  score: number;
  confidence: number;
  reasons: string[];
  missingCriteria: string[];
}

export type Language = "en" | "hi" | "mr";
