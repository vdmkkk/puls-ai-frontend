// @ts-nocheck //
import Cookies from 'js-cookie'
import { apiInstances } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useErrors } from 'src/composables/useErrors'
import { CreatePostRequest, SavePostRequest, UpdatePostRequest } from '../api'
import { useErrorStore } from 'src/stores/error-store'

export default function usePayment() {
  const { setError } = useErrors()
  const { t } = useI18n()
  const store = useErrorStore()
  const apiUsePromocode = async (promocode) => {
    return await apiInstances.paymentApi
      .postPaymentUsePromo({ promocode })
      .then((res) => {
        Notify.create({
          message: 'Промокод успешно активирован',
          position: 'top',
          color: 'positive',
        })
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        Notify.create({
          message: 'Промокода не существет или он уже был использован',
          position: 'top',
          color: 'negative',
        })
      })
  }

  const apiCreatePayment = async (id) => {
    return await apiInstances.paymentApi
      .postPaymentCreatePayment({ tariff_id: id })
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  return { apiUsePromocode, apiCreatePayment }
}
