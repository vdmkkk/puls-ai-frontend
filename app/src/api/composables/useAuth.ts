// @ts-nocheck //
import Cookies from 'js-cookie'
import { apiInstances } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useErrors } from 'src/composables/useErrors'

export default function useAuth() {
  const { setError } = useErrors()
  const { t } = useI18n()
  const apiLogin = async (email: string, password: string) => {
    return await apiInstances.authApi
      .postAuthLogin({ email, password })
      .then((res) => {
        Cookies.set('refresh_token', res.data.Refresh_token)
        Cookies.set('access_token', res.data.Access_token)
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
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
      .postAuthRegister({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        verification_code: verificationCode,
      })
      .then((res) => {
        Cookies.set('access_token', res.data.Access_token)
        Cookies.set('refresh_token', res.data.Refresh_token)
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const apiSendLink = async (email: string) => {
    return await apiInstances.authApi.postAuthSendLink({ email }).catch((e: AxiosError) => {
      console.error('Something went wrong:', e)
      setError(e?.response?.data?.error, e?.response?.data?.user_message)
      return e
    })
  }

  const apiEmailCode = async (email: string) => {
    return await apiInstances.authApi.postSendEmailCode({ email }).catch((e: AxiosError) => {
      console.error('Something went wrong:', e)
      setError(e?.response?.data?.error, e?.response?.data?.user_message)
      return e
    })
  }

  const apiChangePassword = async (token: string, newPassword: string) => {
    return await apiInstances.authApi
      .postAuthChangePassword({ token, password: newPassword })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const apiMe = async () => {
    return await apiInstances.authApi
      .getAuthGetUserId()
      .then((res) => {
        return res.data.user_id
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  return { apiChangePassword, apiEmailCode, apiLogin, apiRegister, apiSendLink, apiMe }
}
