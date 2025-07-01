<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <AutoPostDialog
        :is-open="dialog.isOpen"
        :model-value="answers"
        @close="handlerCloseDialog"
        @save="handlerSaveDialog"
      />
      <div class="column header">
        <p class="title">Автопостинг</p>
        <p class="description">
          Перед началом использования автопостинга подключите ваши соцсети к платформе puls в
          разделе <span style="font-weight: 600">Профиль</span>
        </p>
      </div>
      <!-- <div ref="buttonRef">
        <FancyButtonComponent label="Платформы" @click="isFilterActive = true" />
      </div> -->
      <!-- <Transition name="slide-fade"> </Transition> -->
      <div v-if="loading">
        <q-spinner-puff class="loading" size="50px" />
      </div>
      <div v-else class="containers">
        <PostComponent
          v-for="post in posts"
          :topic="post.post_topic"
          :text="post.post_text"
          :image="post.image_urls[0]"
          :posting="moment(post.published_at).isAfter(currentTime) || post.published_at == ''"
          :date="post.published_at"
          :darken="moment(post.published_at).isBefore(currentTime)"
          @publish="handlerOpenDialog(post.post_id)"
          @click="navigateTo(`/posting/posts/${post.post_id}`)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import moment from 'moment'
import { is, Notify } from 'quasar'
import useContent from 'src/api/composables/useContent'
import useProfile from 'src/api/composables/useProfile'
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import PostComponent from 'src/components/PostComponent.vue'
import AutoPostDialog from 'src/dialogs/AutoPostDialog.vue'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const { apiGetPosts, apiPublishPost, apiGetAllPosts } = useContent()
const { getMe } = useProfile()
const router = useRouter()
const loading = ref(false)

const answers = ref({
  tg: true,
  vk: true,
  inst: true,
  time: null,
  isNow: true,
  tgDisabled: false,
  vkDisabled: false,
  instDisabled: false,
})

const defaultTg = ref(false)
const defaultVk = ref(false)
const defaultInst = ref(false)

const currentPost = ref<number | null>(null)

const navigateTo = (path: string) => {
  router.push(path)
}

const dialog = ref<{
  isOpen: boolean
}>({
  isOpen: false,
})

const posts = ref([])

const handlerOpenDialog = (postId: number): void => {
  // if (!isAuto.value) {
  currentPost.value = postId
  answers.value = {
    tg: defaultTg.value,
    vk: defaultVk.value,
    inst: defaultInst.value,
    time: moment().format('YYYY-MM-DD[T]HH:mm:ssZ'),
    isNow: true,
    tgDisabled: !defaultTg.value,
    vkDisabled: !defaultVk.value,
    instDisabled: !defaultInst.value,
  }
  dialog.value = {
    isOpen: true,
  }
  // }
}

const handlerCloseDialog = () => {
  dialog.value = {
    isOpen: false,
  }
  answers.value = {
    tg: defaultTg.value,
    vk: defaultVk.value,
    inst: defaultInst.value,
    time: null,
    isNow: true,
    tgDisabled: !defaultTg.value,
    vkDisabled: !defaultVk.value,
    instDisabled: !defaultInst.value,
  }
  currentPost.value = null
}

const handlerSaveDialog = (answer: any) => {
  answers.value = answer
  publishPost(currentPost.value as number)
  handlerCloseDialog()
}

const publishPost = (id: number) => {
  const time = answers.value.time
  apiPublishPost(
    id,
    answers.value.time,
    Object.keys(answers.value)
      .filter((k) => answers.value[k] && k !== 'time' && k !== 'isNow')
      .map((k) => (k === 'inst' ? 'instagram' : k)),
  ).then((res) => {
    if (res) {
      Notify.create({
        message: 'Пост отправлен в очередь на публикацию',
        color: 'positive',
        icon: 'check_circle',
        position: 'top',
      })
      posts.value = posts.value.map((post) => {
        if (post.post_id === id) {
          // to YYYY-MM-DD format
          post.published_at = time
        }
        return post
      })
    }
  })
}

const currentTime = ref(moment())

onMounted(() => {
  apiGetAllPosts().then((res) => {
    posts.value = res.sort((a, b) => {
      return new Date(b.marked_at) - new Date(a.marked_at)
    })
  })
  getMe().then((res) => {
    if (res.tg_channel_url) {
      defaultTg.value = true
    }
    if (res.vk_token && res.vk_channel_url) {
      defaultVk.value = true
    }
    if (res.inst_login) {
      defaultInst.value = true
    }
    // if (res.is_auto_posting) {
    //   answers.value.tg = res.auto_post_tg
    //   answers.value.vk = res.auto_post_vk
    //   answers.value.inst = res.auto_post_inst
    // }
  })
  setInterval(() => {
    currentTime.value = moment()
  }, 1000)
})
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);

  .loading {
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    margin-left: 50%;
    transform: translateX(-50%);
    color: #684485;
  }

  .description {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: #b8b8b8;
  }

  .header {
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    margin-right: var(--spacing-sm);
    align-items: start;
    .title {
      font-size: var(--font-size-title);
      font-weight: 500;
      margin: 0;
    }
  }
  .containers {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xs);
    margin-top: var(--spacing-sm);

    .date {
      padding-top: var(--spacing-xs);
      padding-bottom: var(--spacing-xxs);
      margin-bottom: 0;
    }
  }
  .filter {
    background-color: #2a2a32;
    // border: 1px solid #deeaed;
    width: 200px;
    align-self: flex-end;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 16px;
    position: absolute;
    left: var(--spacing-xs);
    top: var(--spacing-xl);

    p {
      margin-bottom: 0;
      font-size: var(--font-size-xs);
      // line-height: 24px;
      font-weight: 600;
    }

    .q-input ::v-deep .q-field__native {
      padding-top: 5px !important;
    }

    .q-input ::v-deep .q-field__control {
      border-radius: 20px !important;
      height: 40px;
    }

    .checks {
      display: flex;
      flex-direction: column;
      gap: 12px;
      // margin-top: 16px;
      img {
        width: 28px;
        height: 28px;
      }
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(40px);
  opacity: 0;
}

@media screen and (max-width: 576px) {
  .containers {
    grid-template-columns: 1fr !important;
  }

  .filter {
    p {
      font-size: var(--spacing-sm) !important;
    }
  }
}
</style>
