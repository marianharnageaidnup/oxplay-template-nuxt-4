export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoading: false,
    message: 'Global state',
  }),

  getters: {
    // Add your computed properties/getters here
  },

  actions: {
    // Add your methods/actions here
    setLoading(value: boolean) {
      this.isLoading = value;
    },

    setMessage(message: string) {
      this.message = message;
    },
  },
});
