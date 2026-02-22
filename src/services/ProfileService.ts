import { FarmerProfile } from "@/types/farmer";

const STORAGE_KEY = "agrisahay-profile";
const SYNC_KEY = "agrisahay-sync-ts";

export class ProfileService {
  static get(): FarmerProfile | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw) as FarmerProfile;
      return p.name ? p : null;
    } catch {
      return null;
    }
  }

  static getProfile(): FarmerProfile | null {
    return this.get();
  }

  static save(profile: FarmerProfile): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(SYNC_KEY, new Date().toISOString());
  }

  static getLastSyncTime(): string | null {
    return localStorage.getItem(SYNC_KEY);
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SYNC_KEY);
  }

  static getDefault(): FarmerProfile {
    return {
      name: "",
      state: "",
      district: "",
      landSize: 0,
      landType: "rainfed",
      crops: [],
      annualIncome: 0,
      category: "general",
      irrigationAvailable: false,
      bankLinked: false,
    };
  }
}
