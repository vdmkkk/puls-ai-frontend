import { defineStore, acceptHMRUpdate } from 'pinia'

export const useErrorStore = defineStore('ErrorStore', {
  state: () => ({
    errors: {
      name: false,
      lastName: false,
      login: false,
      password: false,
      againPassword: false,
      verificationCode: false,
    },
    errorMessage: null as string | null,
    genCounter: 0,
  }),

  getters: {},

  actions: {},
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
