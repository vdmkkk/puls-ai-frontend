// @ts-nocheck //
import { defineBoot } from '#q-app/wrappers'
import axios, { type AxiosInstance } from 'axios'
import {
  AuthApi,
  Configuration,
  CustomizeApi,
  ContentApi,
  ProfileApi,
  PostsApi,
  FilesApi,
  TariffsApi,
} from 'src/api'
import { PaymentApi } from 'src/api'
import Cookies from 'js-cookie'
import { Notify } from 'quasar'
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
  filesApi: new FilesApi(config),
  tariffsApi: new TariffsApi(config),
}

apiInstances.authApi.axios.interceptors.request.use(
  (config) => {
    // config.headers['Access-Control-Allow-Origin'] = 'https://my.pulsai.tech'
    return config
  },
  (error) => Promise.reject(error),
)

Object.entries(apiInstances).forEach(([key, apiInstance]) => {
  // console.log(key)
  apiInstance.axios.interceptors.request.use(
    (config) => {
      console.log(key == 'authApi')
      if (key == 'authApi') {
        console.log(config)
        // config.headers['Access-Control-Allow-Origin'] = 'https://my.pulsai.tech'
      }
      // config.withCredentials = true
      const token = Cookies.get('refresh_token')
      const atoken = Cookies.get('atoken')
      if (token) {
        // config.headers['Access-Control-Allow-Origin'] = 'https://my.pulsai.tech'
        config.headers['atoken'] = Cookies.get('atoken')
        config.headers['rtoken'] = Cookies.get('refresh_token')
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  const errors = {
    'unsupported platform': 'Выбрана платформа, которая не поддерживается',
  }

  apiInstance.axios.interceptors.response.use(
    // бля метод protected один хуй работает. Люблю TS
    (response) => response,
    async (error) => {
      if (
        error.response &&
        error.response.status != 401 &&
        error.response.data.Message != 'sql: no rows in result set'
      ) {
        Notify.create({
          type: 'negative',
          position: 'top',
          timeout: 5000,
          badgeStyle: { display: 'none' },
          message: error.response.data.user_message || 'Что-то пошло не так',
        })
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
