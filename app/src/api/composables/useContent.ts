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
        return res.data.image_url
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
        return res.data.image_url
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
        return res.data.post_text
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const apiGetPost = async (post_id: number) => {
    return await apiInstances.contentApi
      .postContentGetPostById({ post_id })
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const savePost = async (post: SavePostRequest) => {
    return await apiInstances.contentApi
      .postContentSavePost(post)
      .then((res) => {
        return res.data.post_id
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  const getUserPosts = async () => {
    return await apiInstances.contentApi
      .getContentGetUsersPosts({
        headers: {
          // access_token: Cookies.get('access_token'),
          // refresh_token: Cookies.get('refresh_token'),
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjMsImV4cCI6MTc0MDQwNjc2MX0.6LWpvcfQwtUIMMtqo8SzthmcFS5xxTqG7OXKcDxZLFg',
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjMsImV4cCI6MTc0Mjk5ODcwMX0.pOm6D0-QbYeGCZUDRYDv0MmUY72dcv1ep7Pc6eOZCTE',
          test: 'test123',
        },
      })
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        return e
      })
  }

  return {
    apiCreateImagePost,
    apiCreateImagePost,
    apiCreateImagePost,
    apiCreatePost,
    apiGetPost,
    savePost,
    getUserPosts,
  }
}
