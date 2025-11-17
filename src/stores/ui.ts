import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    // theme: (localStorage.getItem('theme') || 'accountplus') as string,
      theme: (localStorage.getItem('theme') || 'autumn') as string,
      isCartOpen: false
  }),
  actions: {
    toggleTheme() {
      const next = this.theme === 'accountplus' ? 'light' : (this.theme === 'light' ? 'autumn' : 'accountplus')
      this.theme = next
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('theme', next)
    },
    openCart() { this.isCartOpen = true },
    closeCart() { this.isCartOpen = false },
    init() {
      document.documentElement.setAttribute('data-theme', this.theme)
    }
  }
})
