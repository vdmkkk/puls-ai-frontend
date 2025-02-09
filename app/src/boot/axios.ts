// @ts-nocheck //
import { defineBoot } from '#q-app/wrappers'
import axios, { type AxiosInstance } from 'axios'
import { AuthApi, Configuration } from 'src/api'
import { PaymentApi } from 'src/api'
import Cookies from 'js-cookie'
declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const config = new Configuration({
  basePath: import.meta.env.VITE_APP_API_BASE_URL,
})

const apiInstances = {
  authApi: new AuthApi(config),
  paymentApi: new PaymentApi(config),
}

Object.entries(apiInstances).forEach(([_, apiInstance]) => {
  apiInstance.axios.interceptors.request.use(
    (config) => {
      const token = Cookies.get('jwtToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor to handle 401 errors
  apiInstance.axios.interceptors.response.use(
    // бля метод protected но один хуй работает. Люблю TS
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        Cookies.remove('jwtToken')
        window.location.replace('/login') // через useRouter не работает :)
      }

      return Promise.reject(error)
    },
  )
})

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = apiInstances
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { apiInstances }
