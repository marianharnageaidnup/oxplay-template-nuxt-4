import type { User } from '~/types/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isLoading: true,
    isInitialized: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => !!state.user,
    balance: (state) => state.user?.balance || '0',
    username: (state) => state.user?.username || '',
    email: (state) => state.user?.email || '',
    fullName: (state) => state.user?.full_name || '',
    currency: (state) => state.user?.currency || '',
  },

  actions: {
    setUser(user: User | null) {
      this.user = user;
      this.isLoading = false;
      this.isInitialized = true;
    },

    clearUser() {
      this.user = null;
      this.isLoading = false;
      this.isInitialized = true;
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    updateBalance(newBalance: string) {
      if (this.user) {
        this.user.balance = newBalance;
      }
    },
  },
});
