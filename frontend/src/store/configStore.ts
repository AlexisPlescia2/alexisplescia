import { create } from 'zustand'
import api from '../services/api'

interface ConfigState {
  config: Record<string, string>
  loaded: boolean
  loadConfig: () => Promise<void>
}

export const useConfigStore = create<ConfigState>()((set) => ({
  config: {},
  loaded: false,
  loadConfig: async () => {
    try {
      const { data } = await api.get('/config')
      set({ config: data, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },
}))
