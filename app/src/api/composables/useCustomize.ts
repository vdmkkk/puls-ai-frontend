// @ts-nocheck //
import Cookies from 'js-cookie'
import { apiInstances } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useErrors } from 'src/composables/useErrors'
import { Ref } from 'vue'
import { GetProfileFromUrlRequest, SaveAccountRequest } from '../api'

export default function useCustomize(loading: Ref<boolean>) {
  const { setError } = useErrors()
  const { t } = useI18n()
  const apiGetUserAnswers = async () => {
    loading.value = true
    return await apiInstances.customizeApi
      .getCustomizeGetUserAnswers()
      .then((res) => {
        loading.value = false
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const apiSaveAnswers = async (answers: any) => {
    return await apiInstances.customizeApi
      .postCustomizeSaveProfileAnswers({
        q1: answers.answer1,
        q2: answers.answer2,
        q3: answers.answer3,
        q4: answers.answer4,
        q5: answers.answer5,
        q6: answers.answer6,
        post_sample: answers.post_sample,
        use_post_sample: answers.check,
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
      .finally(() => {
        loading.value = false
      })
  }

  const apiGenAnswersFromLink = async (link: GetProfileFromUrlRequest) => {
    loading.value = true
    return await apiInstances.customizeApi
      .postCustomizeGetProfileFromUrl(link)
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const apiSaveAccount = async (obj: SaveAccountRequest) => {
    return await apiInstances.customizeApi
      .postCustomizeSaveAccount(obj)
      .then((res) => {
        Notify.create({
          message: t('Аккаунт успешно привязан'),
          color: 'positive',
        })
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  return { apiGenAnswersFromLink, apiGetUserAnswers, apiSaveAnswers, apiSaveAccount }
}
