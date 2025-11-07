export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoading: false,
    message: 'Global state',
  }),

  getters: {},

  actions: {
    setLoading(value: boolean) {
      this.isLoading = value;
    },

    setMessage(message: string) {
      this.message = message;
    },
  },
});
