import { FarmerProfile, Scheme, SchemeRecommendation, ScoringBreakdown } from "@/types/farmer";
import { schemes } from "@/data/schemes";

// Weights for each criterion (must sum to 1.0)
const WEIGHTS = {
  landSize: 0.20,
  income: 0.20,
  category: 0.15,
  crops: 0.15,
  landType: 0.10,
  bankAccount: 0.10,
  irrigation: 0.05,
  universalBonus: 0.05,
};

function scoreLandSize(farmer: FarmerProfile, scheme: Scheme): ScoringBreakdown {
  const criteria = scheme.eligibility.landSize;
  if (!criteria) {
    return { criterion: "Land Size", weight: WEIGHTS.landSize, score: 1, weightedScore: WEIGHTS.landSize, reason: "No land size restriction", met: true };
  }

  let score = 1;
  let met = true;
  let reason = "";

  if (criteria.min !== undefined && farmer.landSize < criteria.min) {
    // Partial: how close are they?
    score = Math.max(0, farmer.landSize / criteria.min);
    met = false;
    reason = `Land ${farmer.landSize} acres below minimum ${criteria.min} acres (${Math.round(score * 100)}% match)`;
  } else if (criteria.max !== undefined && farmer.landSize > criteria.max) {
    score = Math.max(0, 1 - (farmer.landSize - criteria.max) / criteria.max);
    score = Math.max(score, 0);
    met = false;
    reason = `Land ${farmer.landSize} acres exceeds maximum ${criteria.max} acres`;
  } else {
    reason = `Land ${farmer.landSize} acres within eligible range${criteria.min ? ` (${criteria.min}` : "(0"}–${criteria.max ?? "∞"} acres)`;
  }

  return { criterion: "Land Size", weight: WEIGHTS.landSize, score, weightedScore: score * WEIGHTS.landSize, reason, met };
}

function scoreIncome(farmer: FarmerProfile, scheme: Scheme): ScoringBreakdown {
  const criteria = scheme.eligibility.income;
  if (!criteria) {
    return { criterion: "Annual Income", weight: WEIGHTS.income, score: 1, weightedScore: WEIGHTS.income, reason: "No income restriction", met: true };
  }

  if (farmer.annualIncome <= criteria.max) {
    return { criterion: "Annual Income", weight: WEIGHTS.income, score: 1, weightedScore: WEIGHTS.income, reason: `Income ₹${farmer.annualIncome.toLocaleString()} within ₹${criteria.max.toLocaleString()} limit`, met: true };
  }

  const overshoot = (farmer.annualIncome - criteria.max) / criteria.max;
  const score = Math.max(0, 1 - overshoot);
  return { criterion: "Annual Income", weight: WEIGHTS.income, score, weightedScore: score * WEIGHTS.income, reason: `Income ₹${farmer.annualIncome.toLocaleString()} exceeds ₹${criteria.max.toLocaleString()} limit`, met: false };
}

function scoreCategory(farmer: FarmerProfile, scheme: Scheme): ScoringBreakdown {
  const cats = scheme.eligibility.categories;
  if (!cats || cats.length === 0) {
    return { criterion: "Category", weight: WEIGHTS.category, score: 1, weightedScore: WEIGHTS.category, reason: "Open to all categories", met: true };
  }

  if (cats.includes(farmer.category)) {
    return { criterion: "Category", weight: WEIGHTS.category, score: 1, weightedScore: WEIGHTS.category, reason: `Category "${farmer.category.toUpperCase()}" is eligible`, met: true };
  }

  return { criterion: "Category", weight: WEIGHTS.category, score: 0.1, weightedScore: 0.1 * WEIGHTS.category, reason: `Category "${farmer.category.toUpperCase()}" not in eligible list: ${cats.map(c => c.toUpperCase()).join(", ")}`, met: false };
}

function scoreCrops(farmer: FarmerProfile, scheme: Scheme): ScoringBreakdown {
  const eligible = scheme.eligibility.crops;
  if (!eligible || eligible.length === 0) {
    return { criterion: "Crop Match", weight: WEIGHTS.crops, score: 1, weightedScore: WEIGHTS.crops, reason: "No specific crop requirement", met: true };
  }

  const matched = farmer.crops.filter(c => eligible.includes(c));
  if (matched.length === 0) {
    return { criterion: "Crop Match", weight: WEIGHTS.crops, score: 0.15, weightedScore: 0.15 * WEIGHTS.crops, reason: `None of your crops match eligible list`, met: false };
  }

  const score = Math.min(1, matched.length / Math.min(farmer.crops.length, eligible.length));
  return { criterion: "Crop Match", weight: WEIGHTS.crops, score, weightedScore: score * WEIGHTS.crops, reason: `${matched.length} crop(s) matched: ${matched.join(", ")}`, met: true };
}

function scoreLandType(farmer: FarmerProfile, scheme: Scheme): ScoringBreakdown {
  const types = scheme.eligibility.landTypes;
  if (!types || types.length === 0) {
    return { criterion: "Land Type", weight: WEIGHTS.landType, score: 1, weightedScore: WEIGHTS.landType, reason: "No land type restriction", met: true };
  }

  if (types.includes(farmer.landType)) {
    return { criterion: "Land Type", weight: WEIGHTS.landType, score: 1, weightedScore: WEIGHTS.landType, reason: `Land type "${farmer.landType}" is eligible`, met: true };
  }

  return { criterion: "Land Type", weight: WEIGHTS.landType, score: 0, weightedScore: 0, reason: `Land type "${farmer.landType}" not eligible (needs: ${types.join(", ")})`, met: false };
}

function scoreBankAccount(farmer: FarmerProfile, scheme: Scheme): ScoringBreakdown {
  if (!scheme.eligibility.requiresBankAccount) {
    return { criterion: "Bank Account", weight: WEIGHTS.bankAccount, score: 1, weightedScore: WEIGHTS.bankAccount, reason: "Bank account not required", met: true };
  }

  if (farmer.bankLinked) {
    return { criterion: "Bank Account", weight: WEIGHTS.bankAccount, score: 1, weightedScore: WEIGHTS.bankAccount, reason: "Bank account linked ✓", met: true };
  }

  return { criterion: "Bank Account", weight: WEIGHTS.bankAccount, score: 0, weightedScore: 0, reason: "Bank account linkage required but not linked", met: false };
}

function scoreIrrigation(farmer: FarmerProfile, scheme: Scheme): ScoringBreakdown {
  if (scheme.eligibility.requiresIrrigation === undefined) {
    return { criterion: "Irrigation", weight: WEIGHTS.irrigation, score: 1, weightedScore: WEIGHTS.irrigation, reason: "No irrigation requirement", met: true };
  }

  if (farmer.irrigationAvailable === scheme.eligibility.requiresIrrigation) {
    return { criterion: "Irrigation", weight: WEIGHTS.irrigation, score: 1, weightedScore: WEIGHTS.irrigation, reason: "Irrigation requirement met", met: true };
  }

  return { criterion: "Irrigation", weight: WEIGHTS.irrigation, score: 0, weightedScore: 0, reason: "Irrigation requirement not met", met: false };
}

function evaluateScheme(farmer: FarmerProfile, scheme: Scheme): SchemeRecommendation {
  const scoring: ScoringBreakdown[] = [
    scoreLandSize(farmer, scheme),
    scoreIncome(farmer, scheme),
    scoreCategory(farmer, scheme),
    scoreCrops(farmer, scheme),
    scoreLandType(farmer, scheme),
    scoreBankAccount(farmer, scheme),
    scoreIrrigation(farmer, scheme),
    { criterion: "Availability", weight: WEIGHTS.universalBonus, score: 1, weightedScore: WEIGHTS.universalBonus, reason: "Scheme is currently active", met: true },
  ];

  const totalScore = Math.round(scoring.reduce((sum, s) => sum + s.weightedScore, 0) * 100);
  const reasons = scoring.filter(s => s.met).map(s => s.reason);
  const missingCriteria = scoring.filter(s => !s.met).map(s => s.reason);

  // Confidence: high if we have enough data points checked
  const activeCriteria = scoring.filter(s => s.weight > 0);
  const metCount = activeCriteria.filter(s => s.met).length;
  const confidenceScore = Math.round((metCount / activeCriteria.length) * 100);

  const eligible = missingCriteria.length === 0;

  return { scheme, totalScore, confidenceScore, scoring, reasons, missingCriteria, eligible };
}

export class RecommendationService {
  static getAll(farmer: FarmerProfile): SchemeRecommendation[] {
    return schemes
      .filter(s => s.active)
      .map(scheme => evaluateScheme(farmer, scheme))
      .sort((a, b) => b.totalScore - a.totalScore);
  }

  static getTop(farmer: FarmerProfile, count = 3): SchemeRecommendation[] {
    return this.getAll(farmer).slice(0, count);
  }

  static getRejected(farmer: FarmerProfile): SchemeRecommendation[] {
    return this.getAll(farmer).filter(r => !r.eligible);
  }

  static getEligible(farmer: FarmerProfile): SchemeRecommendation[] {
    return this.getAll(farmer).filter(r => r.eligible);
  }
}
