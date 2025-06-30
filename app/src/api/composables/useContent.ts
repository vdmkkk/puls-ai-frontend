// @ts-nocheck //
import Cookies from 'js-cookie'
import { apiInstances } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'
import { useErrors } from 'src/composables/useErrors'
import { CreatePostRequest, SavePostRequest, UpdatePostRequest } from '../api'
import { useErrorStore } from 'src/stores/error-store'

export default function useContent() {
  const { setError } = useErrors()
  const { t } = useI18n()
  const store = useErrorStore()
  const apiCreateImagePost = async (post, size) => {
    return await apiInstances.contentApi
      .postContentCreateImagePost({ post, size })
      .then((res) => {
        store.genCounter += 1
        return res.data.link
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiCreateImagePrompt = async (post, size) => {
    return await apiInstances.contentApi
      .postContentCreateImagePrompt({ prompt: post, size })
      .then((res) => {
        store.genCounter += 1
        return res.data.link
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiCreatePost = async (post: CreatePostRequest) => {
    return await apiInstances.contentApi
      .postContentCreatePost(post)
      .then((res) => {
        store.genCounter += 1
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
        if (
          e.response?.data.Message ==
          'Get User Answers: could not get customize answers: sql: no rows in result set'
        ) {
          console.log('caught')
          Notify.create({
            message: 'Пожалуйста, заполните данные о себе в профиле',
            position: 'top',
            color: 'negative',
          })
        }
      })
  }

  const apiCreateContentPlan = async () => {
    return await apiInstances.contentApi
      .postContentCreateContentPlan()
      .then((res) => {
        store.genCounter += 1
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiGetPostsContentPlan = async (weekId) => {
    return await apiInstances.contentApi
      .getContentGetDetailContentPlan(weekId)
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

  const apiGetPost = async (id: number) => {
    return await apiInstances.contentApi
      .postContentGetPostById({ post_id: id })
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

  const apiUpdatePost = async (post: UpdatePostRequest) => {
    return await apiInstances.contentApi
      .patchContentUpdatePost(post)
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiReadyToPublish = async (id: number) => {
    return await apiInstances.contentApi
      .postContentMarkReadyToPublish({ post_id: id })
      .then((res) => {
        Notify.create({
          message: t(
            'Пост готов к публикации. Вы можете настроить время и место публикации в разделе Автопостинг',
          ),
          color: 'positive',
          position: 'top',
          timeout: 3000,
        })
        return 200
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiPublishPost = async (post: number, time: string, platforms: ['tg' | 'vk' | 'inst']) => {
    return await apiInstances.postsApi
      .postPostsPublishPost({ post_id: post, time, platforms })
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiUploadImage = async (file: Blob) => {
    return await apiInstances.filesApi
      .postFilesSaveImage(file)
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiGetAllPosts = async () => {
    return await apiInstances.contentApi
      .getContentGetPostsReadyToPublish()
      .then((res) => {
        return res.data
      })
      .catch((e: AxiosError) => {
        console.error('Something went wrong:', e)
        setError(e?.response?.data?.error, e?.response?.data?.user_message)
      })
  }

  const apiTranscribe = async (file: File) => {
    return await apiInstances.contentApi
      .postContentTranscribe(file)
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
    apiGetPost,
    apiUpdatePost,
    apiGetPostsContentPlan,
    apiCreateContentPlan,
    apiReadyToPublish,
    apiPublishPost,
    apiUploadImage,
    apiGetAllPosts,
    apiTranscribe,
  }
}
