import { FarmerProfile, Scheme, SchemeRecommendation } from "@/types/farmer";
import { schemes } from "@/data/schemes";

function evaluateScheme(farmer: FarmerProfile, scheme: Scheme): SchemeRecommendation {
  const reasons: string[] = [];
  const missingCriteria: string[] = [];
  let totalChecks = 0;
  let passedChecks = 0;
  const e = scheme.eligibility;

  // Income check
  if (e.maxIncome !== undefined) {
    totalChecks++;
    if (farmer.annualIncome <= e.maxIncome) {
      passedChecks++;
      reasons.push(`Income ₹${farmer.annualIncome.toLocaleString()} is within limit of ₹${e.maxIncome.toLocaleString()}`);
    } else {
      missingCriteria.push(`Annual income exceeds ₹${e.maxIncome.toLocaleString()} limit`);
    }
  }

  // Land size check
  if (e.minLandSize !== undefined) {
    totalChecks++;
    if (farmer.landSize >= e.minLandSize) {
      passedChecks++;
      reasons.push(`Land size ${farmer.landSize} acres meets minimum ${e.minLandSize} acres`);
    } else {
      missingCriteria.push(`Land size below minimum ${e.minLandSize} acres`);
    }
  }

  if (e.maxLandSize !== undefined) {
    totalChecks++;
    if (farmer.landSize <= e.maxLandSize) {
      passedChecks++;
      reasons.push(`Land size ${farmer.landSize} acres within maximum ${e.maxLandSize} acres`);
    } else {
      missingCriteria.push(`Land size exceeds maximum ${e.maxLandSize} acres`);
    }
  }

  // Land type check
  if (e.landTypes && e.landTypes.length > 0) {
    totalChecks++;
    if (e.landTypes.includes(farmer.landType)) {
      passedChecks++;
      reasons.push(`Land type "${farmer.landType}" is eligible`);
    } else {
      missingCriteria.push(`Land type "${farmer.landType}" not in eligible types: ${e.landTypes.join(", ")}`);
    }
  }

  // Category check
  if (e.categories && e.categories.length > 0) {
    totalChecks++;
    if (e.categories.includes(farmer.category)) {
      passedChecks++;
      reasons.push(`Category "${farmer.category}" is eligible`);
    } else {
      missingCriteria.push(`Category "${farmer.category}" not in eligible categories`);
    }
  }

  // State check
  if (e.states && e.states.length > 0) {
    totalChecks++;
    if (e.states.includes(farmer.state)) {
      passedChecks++;
      reasons.push(`State "${farmer.state}" is covered`);
    } else {
      missingCriteria.push(`State "${farmer.state}" not covered by this scheme`);
    }
  }

  // Crop check
  if (e.crops && e.crops.length > 0) {
    totalChecks++;
    const matchingCrops = farmer.crops.filter(c => e.crops!.includes(c));
    if (matchingCrops.length > 0) {
      passedChecks++;
      reasons.push(`Growing eligible crops: ${matchingCrops.join(", ")}`);
    } else {
      missingCriteria.push(`None of your crops match eligible crops`);
    }
  }

  // Bank account check
  if (e.requiresBankAccount) {
    totalChecks++;
    if (farmer.bankLinked) {
      passedChecks++;
      reasons.push("Bank account is linked");
    } else {
      missingCriteria.push("Bank account linkage required");
    }
  }

  // Irrigation check
  if (e.requiresIrrigation !== undefined) {
    totalChecks++;
    if (farmer.irrigationAvailable === e.requiresIrrigation) {
      passedChecks++;
      reasons.push("Irrigation requirement met");
    } else {
      missingCriteria.push("Irrigation requirement not met");
    }
  }

  // If no specific eligibility criteria, it's universally available
  if (totalChecks === 0) {
    reasons.push("This scheme is available to all farmers");
    return { scheme, score: 85, confidence: 0.85, reasons, missingCriteria };
  }

  const score = Math.round((passedChecks / totalChecks) * 100);
  const confidence = passedChecks / totalChecks;

  return { scheme, score, confidence, reasons, missingCriteria };
}

export function getRecommendations(farmer: FarmerProfile): SchemeRecommendation[] {
  return schemes
    .map(scheme => evaluateScheme(farmer, scheme))
    .sort((a, b) => b.score - a.score);
}

export function getTopRecommendations(farmer: FarmerProfile, count = 3): SchemeRecommendation[] {
  return getRecommendations(farmer).slice(0, count);
}
