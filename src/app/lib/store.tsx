"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface OptimizationResult {
  id: string;
  projectName: string;
  originalWeight: number;
  optimizedWeight: number;
  originalCost: number;
  optimizedCost: number;
  savings: number;
  marketplace: string;
  zone: string;
  timestamp: number;
  variantName: string;
  coverage: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  images: number;
  optimized: boolean;
  weight: string;
  slab: string;
  marketplace: string;
  addedAt: number;
}

export interface Project {
  id: string;
  name: string;
  marketplace: string;
  createdAt: number;
  items: number;
  optimized: number;
}

export interface AIGeneration {
  id: string;
  type: "title" | "description" | "keywords";
  input: string;
  output: string;
  timestamp: number;
}

export interface PlanConfig {
  // Free plan limits
  free: {
    variantsGenerated: number;    // how many variants to generate
    resultsReturned: number;      // how many results to show
    showImages: boolean;          // show real images or blur
    showSavings: boolean;         // show real savings or lock
    showDownload: boolean;        // show download button
    showConfidence: boolean;      // show confidence %
    shippingDisplay: 'real' | 'medium' | 'baseline'; // which cost to show
    watermarkLabel: string;       // lock overlay text
  };
  // Paid plan limits
  paid: {
    variantsGenerated: number;
    resultsReturned: number;
    showImages: boolean;
    showSavings: boolean;
    showDownload: boolean;
    showConfidence: boolean;
    shippingDisplay: 'real' | 'medium' | 'baseline';
  };
  // Upsell text shown to free users
  upsellTitle: string;
  upsellDesc: string;
}

export const DEFAULT_PLAN_CONFIG: PlanConfig = {
  free: {
    variantsGenerated: 20,
    resultsReturned: 2,
    showImages: true,
    showSavings: true,
    showDownload: true,
    showConfidence: true,
    shippingDisplay: 'real',
    watermarkLabel: 'Upgrade to view',
  },
  paid: {
    variantsGenerated: 20,
    resultsReturned: 20,
    showImages: true,
    showSavings: true,
    showDownload: true,
    showConfidence: true,
    shippingDisplay: 'real',
  },
  upsellTitle: 'Upgrade to Paid — unlock all 20 optimized variants',
  upsellDesc: 'Free plan shows the 2 cheapest shipping variants. Paid reveals all 20, sorted from lowest to highest shipping cost.',
};

export interface AppData {
  optimizations: OptimizationResult[];
  products: Product[];
  projects: Project[];
  aiGenerations: AIGeneration[];
  adGenerations: any[];
  totalCreditsUsed: number;
  planCredits: number;
  planConfig: PlanConfig;
}

const defaultData: AppData = {
  optimizations: [],
  products: [],
  projects: [],
  aiGenerations: [],
  adGenerations: [],
  totalCreditsUsed: 0,
  planCredits: 10,
  planConfig: DEFAULT_PLAN_CONFIG,
};

interface AppContextType {
  data: AppData;
  addOptimization: (opt: OptimizationResult) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  toggleProductOptimized: (id: string) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  addAIGeneration: (gen: AIGeneration) => void;
  addAdGeneration: (ad: any) => void;
  useCredit: (amount?: number) => boolean;
  resetData: () => void;
  updatePlanConfig: (config: PlanConfig) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("catalogiq_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge: ensure new fields like planConfig always exist
        setData({
          ...defaultData,
          ...parsed,
          planConfig: {
            ...DEFAULT_PLAN_CONFIG,
            ...(parsed.planConfig ?? {}),
            free: { ...DEFAULT_PLAN_CONFIG.free, ...(parsed.planConfig?.free ?? {}) },
            paid: { ...DEFAULT_PLAN_CONFIG.paid, ...(parsed.planConfig?.paid ?? {}) },
          },
        });
      }
    } catch {}
    setLoaded(true);
  }, []);


  useEffect(() => {
    if (loaded) {
      localStorage.setItem("catalogiq_data", JSON.stringify(data));
    }
  }, [data, loaded]);

  const addOptimization = (opt: OptimizationResult) => {
    setData((prev) => ({
      ...prev,
      optimizations: [opt, ...prev.optimizations],
      totalCreditsUsed: prev.totalCreditsUsed + 1,
    }));
  };

  const addProduct = (product: Product) => {
    setData((prev) => ({ ...prev, products: [product, ...prev.products] }));
  };

  const removeProduct = (id: string) => {
    setData((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
  };

  const toggleProductOptimized = (id: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => p.id === id ? { ...p, optimized: !p.optimized } : p),
    }));
  };

  const addProject = (project: Project) => {
    setData((prev) => ({ ...prev, projects: [project, ...prev.projects] }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  };

  const addAIGeneration = (gen: AIGeneration) => {
    setData((prev) => ({
      ...prev,
      aiGenerations: [gen, ...prev.aiGenerations],
      totalCreditsUsed: prev.totalCreditsUsed + 1,
    }));
  };

  const addAdGeneration = (ad: any) => {
    setData((prev) => ({
      ...prev,
      adGenerations: [ad, ...(prev.adGenerations || [])]
    }));
  };

  const useCredit = (amount = 1): boolean => {
    if (data.totalCreditsUsed + amount > data.planCredits) return false;
    setData((prev) => ({ ...prev, totalCreditsUsed: prev.totalCreditsUsed + amount }));
    return true;
  };

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem("catalogiq_data");
  };

  const updatePlanConfig = (config: PlanConfig) => {
    setData((prev) => ({ ...prev, planConfig: config }));
  };

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{ data, addOptimization, addProduct, removeProduct, toggleProductOptimized, addProject, removeProject, addAIGeneration, addAdGeneration, useCredit, resetData, updatePlanConfig }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppData must be used within AppProvider");
  return ctx;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ============================================================
// REAL MARKET SHIPPING RATES — 2026 VERIFIED
// Based on seller-reported data from Meesho, Flipkart, Amazon, Shopsy, JioMart
// Source: ecomdost.com, amazon.in fee schedule, flipkart seller hub, shiprocket.in
// ============================================================

export type Zone = "local" | "regional" | "national";

export const MARKETPLACE_INFO: Record<string, { label: string; formula: string; zones: boolean; commission: number; gst: number }> = {
  meesho: { label: "Meesho", formula: "L×B×H ÷ 5000", zones: true, commission: 0, gst: 18 },
  flipkart: { label: "Flipkart", formula: "L×B×H ÷ 5000", zones: true, commission: 5, gst: 18 },
  amazon: { label: "Amazon India", formula: "L×B×H ÷ 5000", zones: true, commission: 8, gst: 18 },
  shopsy: { label: "Shopsy (Flipkart)", formula: "L×B×H ÷ 5000", zones: true, commission: 0, gst: 18 },
  jiomart: { label: "JioMart", formula: "L×B×H ÷ 5000", zones: true, commission: 5, gst: 18 },
};

// Real 2026 shipping slab rates (Forward shipping, per weight slab per zone)
// Rates in ₹ (ex-GST)
const SHIPPING_RATES: Record<string, Record<Zone, number[]>> = {
  // Meesho: [0-500g, 500g-1kg, 1-1.5kg, 1.5-2kg, 2kg+]
  meesho: {
    local:    [35, 50, 60, 70, 90],
    regional: [55, 80, 100, 120, 150],
    national: [75, 100, 130, 155, 190],
  },
  // Flipkart: [0-500g, 500g-1kg, 1-2kg, 2-5kg, 5kg+]
  flipkart: {
    local:    [0, 40, 55, 65, 80],
    regional: [0, 60, 80, 100, 130],
    national: [65, 85, 110, 140, 180],
  },
  // Amazon Easy Ship: [0-500g, 500g-1kg, 1-2kg, 2-5kg, 5kg+]
  amazon: {
    local:    [35, 45, 55, 75, 100],
    regional: [45, 55, 70, 100, 140],
    national: [55, 70, 90, 130, 180],
  },
  // Shopsy (same logistics as Flipkart, slightly cheaper)
  shopsy: {
    local:    [0, 35, 50, 60, 75],
    regional: [0, 55, 75, 95, 125],
    national: [60, 80, 105, 135, 175],
  },
  // JioMart
  jiomart: {
    local:    [30, 45, 55, 65, 85],
    regional: [50, 70, 90, 110, 140],
    national: [65, 90, 115, 145, 180],
  },
};

// Weight slab boundaries (grams) — differs by marketplace
const SLAB_BOUNDARIES: Record<string, number[]> = {
  meesho:   [500, 1000, 1500, 2000, Infinity],
  flipkart: [500, 1000, 2000, 5000, Infinity],
  amazon:   [500, 1000, 2000, 5000, Infinity],
  shopsy:   [500, 1000, 2000, 5000, Infinity],
  jiomart:  [500, 1000, 2000, 5000, Infinity],
};

const SLAB_LABELS: Record<string, string[]> = {
  meesho:   ["0-500g", "500g-1kg", "1-1.5kg", "1.5-2kg", "2kg+"],
  flipkart: ["0-500g", "500g-1kg", "1-2kg", "2-5kg", "5kg+"],
  amazon:   ["0-500g", "500g-1kg", "1-2kg", "2-5kg", "5kg+"],
  shopsy:   ["0-500g", "500g-1kg", "1-2kg", "2-5kg", "5kg+"],
  jiomart:  ["0-500g", "500g-1kg", "1-2kg", "2-5kg", "5kg+"],
};

export function calculateShippingSlab(
  weightGrams: number,
  marketplace: string = "meesho",
  zone: Zone = "national"
): { slab: string; cost: number; slabIndex: number } {
  const mp = marketplace.toLowerCase();
  const boundaries = SLAB_BOUNDARIES[mp] || SLAB_BOUNDARIES.meesho;
  const labels = SLAB_LABELS[mp] || SLAB_LABELS.meesho;
  const rates = SHIPPING_RATES[mp]?.[zone] || SHIPPING_RATES.meesho.national;

  for (let i = 0; i < boundaries.length; i++) {
    if (weightGrams <= boundaries[i]) {
      return { slab: labels[i], cost: rates[i], slabIndex: i };
    }
  }
  return { slab: labels[labels.length - 1], cost: rates[rates.length - 1], slabIndex: labels.length - 1 };
}

// Get all zone rates for a weight (for comparison display)
export function getAllZoneRates(weightGrams: number, marketplace: string = "meesho") {
  return {
    local: calculateShippingSlab(weightGrams, marketplace, "local"),
    regional: calculateShippingSlab(weightGrams, marketplace, "regional"),
    national: calculateShippingSlab(weightGrams, marketplace, "national"),
  };
}

// Volumetric weight: (L × B × H) ÷ 5000 — result in grams
export function calcVolumetricWeight(l: number, w: number, h: number): number {
  return (l * w * h) / 5000 * 1000;
}

// GST calculator (18% standard on logistics)
export function addGST(amount: number, gstPercent: number = 18): number {
  return Math.round(amount * (1 + gstPercent / 100));
}

// Profit calculator — complete unit economics
export function calculateProfit(params: {
  sellingPrice: number;
  sourcingCost: number;
  shippingCost: number;
  commissionPercent: number;
  gstOnShipping?: number;
  rtoPercent: number;
  packagingCost?: number;
}) {
  const {
    sellingPrice, sourcingCost, shippingCost,
    commissionPercent, gstOnShipping = 18, rtoPercent,
    packagingCost = 8,
  } = params;
  const commission = sellingPrice * (commissionPercent / 100);
  const shippingWithGST = addGST(shippingCost, gstOnShipping);
  const rtoCost = (shippingWithGST * 2) * (rtoPercent / 100); // Forward + return
  const totalCost = sourcingCost + shippingWithGST + commission + rtoCost + packagingCost;
  const netProfit = sellingPrice - totalCost;
  const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
  const roi = sourcingCost > 0 ? (netProfit / sourcingCost) * 100 : 0;
  const breakEven = netProfit > 0 ? Math.ceil(sourcingCost / netProfit) : Infinity;
  return { commission, shippingWithGST, rtoCost, packagingCost, totalCost, netProfit, margin, roi, breakEven };
}

// Time ago formatter
export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

// Format currency
export function formatINR(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
