/**
 * User Store
 * Synced with nuxt-auth-utils session via app.vue
 * Provides convenient getters for user data
 */

import type { User } from '~/types/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    // isLoading removed - nuxt-auth-utils handles session loading
    // isInitialized removed - session is always initialized with nuxt-auth-utils
  }),

  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => !!state.user,
    isLoading: () => false, // Always false with nuxt-auth-utils
    isInitialized: () => true, // Always true with nuxt-auth-utils
    balance: (state) => state.user?.balance || '0',
    username: (state) => state.user?.username || '',
    email: (state) => state.user?.email || '',
    fullName: (state) => state.user?.full_name || '',
    currency: (state) => state.user?.currency || '',
  },

  actions: {
    /**
     * Set user data
     * Called automatically by app.vue when session changes
     */
    setUser(user: User | null) {
      this.user = user;
    },

    /**
     * Clear user data
     * Called automatically by app.vue when session is cleared
     */
    clearUser() {
      this.user = null;
    },

    /**
     * Update user balance
     * Useful for real-time balance updates from WebSocket, etc.
     */
    updateBalance(newBalance: string) {
      if (this.user) {
        this.user.balance = newBalance;
      }
    },
  },
});
