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

export interface EligibilityCriteria {
  landSize?: { min?: number; max?: number };
  income?: { max: number };
  categories?: string[];
  states?: string[];
  crops?: string[];
  landTypes?: string[];
  requiresIrrigation?: boolean;
  requiresBankAccount?: boolean;
}

export interface Scheme {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  benefits: Record<string, string>;
  ministry: string;
  eligibility: EligibilityCriteria;
  documents: string[];
  applicationUrl: string;
  active: boolean;
}

export interface ScoringBreakdown {
  criterion: string;
  weight: number;
  score: number; // 0-1
  weightedScore: number;
  reason: string;
  met: boolean;
}

export interface SchemeRecommendation {
  scheme: Scheme;
  totalScore: number; // 0-100
  confidenceScore: number; // 0-100
  scoring: ScoringBreakdown[];
  reasons: string[];
  missingCriteria: string[];
  eligible: boolean;
}

export type Language = "en" | "hi" | "mr";
