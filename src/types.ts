export enum Language {
  EN = "en",
  MS = "ms" // Bahasa Melayu
}

export enum FishGrade {
  A = "A",
  B = "B",
  C = "C"
}

export interface FishItem {
  id: string;
  name: string;
  scientificName: string;
  malayName: string;
  image: string;
  farmPrice: number; // RM/kg
  marketPrice: number; // RM/kg
  category: "Freshwater" | "Saltwater" | "Brackish";
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  growthCycleWeeks: number;
}

export interface MarketplaceItem {
  id: string;
  fishId: string;
  fishName: string;
  fishMalayName: string;
  farmName: string;
  farmerName: string;
  location: string;
  pricePerKg: number;
  availableKg: number;
  grade: FishGrade;
  isHalal: boolean;
  image: string;
  rating: number;
  description: string;
  dateListed: string;
}

export interface UserListing {
  id: string;
  fishName: string;
  weightKg: number;
  pricePerKg: number;
  status: "active" | "sold";
  datePosted: string;
  location: string;
  description: string;
  buyerInquiries: number;
  image?: string;
}

export interface ProfitRecord {
  id: string;
  date: string;
  fishName: string;
  weightKg: number;
  purchaseCost: number; // RM
  sellingPrice: number; // RM/kg
  revenue: number; // RM
  profit: number; // RM
  roi: number; // %
}

export interface BuyerProfile {
  id: string;
  name: string;
  tag: string; // "Local Market" | "Restaurant" | "Wholesaler" | "Retail Buyer"
  location: string;
  demandDescription: string;
  weeklyDemandKg: number;
  preferredFish: string[];
  rating: number;
  contactNumber: string;
}

export interface NotificationItem {
  id: string;
  type: "marketplace" | "earnings" | "orders" | "tips";
  titleEn: string;
  titleMs: string;
  bodyEn: string;
  bodyMs: string;
  time: string;
  isRead: boolean;
}

export interface FarmGuideStep {
  id: string;
  titleEn: string;
  titleMs: string;
  descriptionEn: string;
  descriptionMs: string;
  icon: string;
}
