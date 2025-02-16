// @ts-nocheck //
import Cookies from 'js-cookie'
import { apiInstances } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useErrors } from 'src/composables/useErrors'

export default function useCustomize() {
  const { setError } = useErrors()
  const { t } = useI18n()
  const apiGetUserAnswers = async () => {
    return await apiInstances.customizeApi
      .getCustomizeGetUserAnswers()
      .then((res) => {
        return res
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const apiSaveAnswers = async (answers: any) => {
    return await apiInstances.customizeApi
      .postCustomizeGetProfileFromAnswers({
        q1: answers.answer1,
        q2: answers.answer2,
        q3: answers.answer3,
        q4: answers.answer4,
        q5: answers.answer5,
        q6: answers.answer6,
        post_sample: answers.answer7,
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const apiGenAnswersFromLink = async (link: string) => {
    return await apiInstances.customizeApi
      .postCustomizeGetProfileFromUrl(link)
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  return { apiGenAnswersFromLink, apiGetUserAnswers, apiSaveAnswers }
}
