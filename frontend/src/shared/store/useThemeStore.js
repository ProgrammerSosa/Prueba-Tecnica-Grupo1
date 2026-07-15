import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggle: () =>
        set((state) => {
          const next = !state.isDark
          document.documentElement.classList.toggle('dark', next)
          return { isDark: next }
        }),
      init: () =>
        set((state) => {
          document.documentElement.classList.toggle('dark', state.isDark)
          return {}
        }),
    }),
    { name: 'theme' }
  )
)
