import Cookies from 'js-cookie'
import { apiInstances } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'

export default function useAuth() {
  const { t } = useI18n()
  const apiLogin = async (email: string, password: string) => {
    return await apiInstances.authApi
      .postAuthLogin(email, password)
      .then((res) => {
        Cookies.set('jwtToken', res.data.token)
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        return e
      })
  }

  const apiRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    verificationCode: number,
  ) => {
    return await apiInstances.authApi
      .postAuthRegister(firstName, lastName, email, password, verificationCode)
      .then((res) => {
        Cookies.set('jwtToken', res.data.token)
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        return e
      })
  }

  const apiSendLink = async (email: string) => {
    return await apiInstances.authApi.postAuthSendLink(email).catch((e: AxiosError) => {
      console.error('Something went wrong:', e)
      return e
    })
  }

  const apiEmailCode = async (email: string) => {
    return await apiInstances.authApi.postSendEmailCode(email).catch((e: AxiosError) => {
      console.error('Something went wrong:', e)
      return e
    })
  }

  const apiChangePassword = async (token: string, newPassword: string) => {
    return await apiInstances.authApi
      .postAuthChangePassword(token, newPassword)
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        return e
      })
  }

  const apiMe = async () => {
    return await apiInstances.authApi
      .getAuthGetUserId(Cookies.get('jwtToken'), Cookies.get('jwtToken'))
      .then((res) => {
        return res.data.user_id
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        return e
      })
  }

  return { apiChangePassword, apiEmailCode, apiLogin, apiRegister, apiSendLink, apiMe }
}
