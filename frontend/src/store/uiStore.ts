import { create } from 'zustand'

interface UIState {
  isLoading: boolean
  setLoading: (v: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),
}))
