// @ts-nocheck //
import { useErrorStore } from 'src/stores/error-store'

export const useErrors = () => {
  const errorsTable = {
    AUTH_INVALID_REFRESH_TOKEN: null,
    AUTH_INVALID_EMAIL_ADDRESS: 'login',
    AUTH_INVALID_PASSWORD_TOKEN: null,
    AUTH_INCORRECT_REGISTER_CODE: 'verificationCode',
    AUTH_USER_WITH_EMAIL_DOES_NOT_EXIST: 'login',
    AUTH_USER_WITH_EMAIL_ALREADY_EXISTS: 'login',
    AUTH_USER_ENTER_INCORRECT_PASSWORD: 'password',
    AUTH_USER_ENTER_EMPTY_PASSWORD: 'password',
    AUTH_USER_ENTER_EMPTY_NAME: 'name',
    AUTH_USER_ENTER_EMPTY_LAST_NAME: 'lastName',
    PAYMENT_PROMOCODE_NOT_EXIST: 'promocode',
    CUSTOMIZE_INVALID_PROFILE_LINK: 'profileLink',
  }

  const defaultErrors = {
    name: false,
    lastName: false,
    login: false,
    password: false,
    againPassword: false,
    verificationCode: false,
  }

  const errorStore = useErrorStore()

  const setError = (e: keyof typeof errorsTable, message: string) => {
    const error = errorsTable[e]
    if (error) {
      errorStore.errors = { ...defaultErrors, [error]: true }
      errorStore.errorMessage = message
      console.log(errorStore.errors)
    }
  }

  return { setError }
}
