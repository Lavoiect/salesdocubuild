// lib/store/useUserStore.ts
import { create } from "zustand";

type UserStore = {
  role: string | null;
  setRole: (role: string) => void;
  reset: () => void;

};

export const useUserStore = create<UserStore>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  reset: () => set({ role: null }), // <--- RESET method

}));
