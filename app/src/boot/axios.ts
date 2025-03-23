// @ts-nocheck //
import { defineBoot } from '#q-app/wrappers'
import axios, { type AxiosInstance } from 'axios'
import { AuthApi, Configuration, CustomizeApi, ContentApi, ProfileApi, PostsApi } from 'src/api'
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
  customizeApi: new CustomizeApi(config),
  profileApi: new ProfileApi(config),
  contentApi: new ContentApi(config),
  postsApi: new PostsApi(config),
}

Object.entries(apiInstances).forEach(([_, apiInstance]) => {
  apiInstance.axios.interceptors.request.use(
    (config) => {
      // config.withCredentials = true
      const token = Cookies.get('refresh_token')
      const atoken = Cookies.get('atoken')
      if (token) {
        config.headers['Access-Control-Allow-Origin'] = 'https://my.pulsai.tech'
        config.headers['atoken'] = Cookies.get('atoken')
        config.headers['rtoken'] = Cookies.get('refresh_token')
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor to handle 401 errors
  // apiInstance.axios.interceptors.response.use(
  //   // бля метод protected но один хуй работает. Люблю TS
  //   (response) => response,
  //   async (error) => {
  //     if (error.response && error.response.status === 401) {
  //       Cookies.remove('refresh_token')
  //       window.location.replace('/login') // через useRouter не работает :)
  //     }

  //     return Promise.reject(error)
  //   },
  // )
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
