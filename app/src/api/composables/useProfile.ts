// @ts-nocheck //
import Cookies from 'js-cookie'
import { apiInstances } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useErrors } from 'src/composables/useErrors'
import { CreatePostRequest, SavePostRequest, UpdatePostRequest } from '../api'

export default function useProfile() {
  const { setError } = useErrors()
  const { t } = useI18n()
  const getMe = () =>
    apiInstances.profileApi
      .getProfileGetAllUserInfo()
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })

  return { getMe }
}
