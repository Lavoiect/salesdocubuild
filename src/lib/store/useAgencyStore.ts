// stores/useAgencyStore.ts
import { create } from "zustand";

type SubscriptionTier = "free" | "pro" | "enterprise" | null;

interface AgencyState {
  agencyId: string | null;
  subscription: SubscriptionTier;
  setAgencyData: (data: { agencyId: string; subscription: SubscriptionTier }) => void;
  resetAgency: () => void;
}

export const useAgencyStore = create<AgencyState>((set) => ({
  agencyId: null,
  subscription: null,
  setAgencyData: ({ agencyId, subscription }) => set({ agencyId, subscription }),
  resetAgency: () => set({ agencyId: null, subscription: null }),
}));
