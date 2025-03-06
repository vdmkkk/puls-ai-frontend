// @ts-nocheck //
import Cookies from 'js-cookie'
import { apiInstances } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useErrors } from 'src/composables/useErrors'
import { CreatePostRequest, SavePostRequest } from '../api'

export default function useContent() {
  const { setError } = useErrors()
  const { t } = useI18n()
  const apiCreateImagePost = async (post, size) => {
    return await apiInstances.contentApi
      .postContentCreateImagePost({ post, size })
      .then((res) => {
        return res.data.link
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const apiCreateImagePrompt = async (post, size) => {
    return await apiInstances.contentApi
      .postContentCreateImagePrompt({ post, size })
      .then((res) => {
        return res.data.link
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const apiCreatePost = async (post: CreatePostRequest) => {
    return await apiInstances.contentApi
      .postContentCreatePost(post)
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiGetPosts = async () => {
    return await apiInstances.contentApi
      .getContentGetPostsNotInContentPlan()
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiGetContentPlan = async () => {
    return await apiInstances.contentApi
      .getContentGetContentPlans()
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiSavePost = async (post: SavePostRequest) => {
    return await apiInstances.contentApi
      .postContentSavePost(post)
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  return {
    apiCreateImagePost,
    apiCreateImagePrompt,
    apiCreatePost,
    apiGetPosts,
    apiGetContentPlan,
    apiSavePost,
  }
}
