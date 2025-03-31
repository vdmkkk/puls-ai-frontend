<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <p class="title">Автопостинг</p>
        <p class="description">
          Чтобы ваш пост моментально появился в социальных сетях, достаточно просто нажать кнопку
          «Опубликовать». Мы создали инструмент, который делает ведение блога быстрым, лёгким и
          вдохновляющим!
        </p>
      </div>
      <div v-if="loading">
        <q-spinner-puff class="loading" size="50px" />
      </div>
      <div v-else class="containers">
        <PostComponent
          v-for="post in posts"
          :topic="post.post_topic"
          :text="post.post_text"
          :image="post.image_urls[0]"
          :posting="post.published_at == ''"
          :date="post.published_at"
          :darken="post.published_at != ''"
          @publish="publishPost(post.post_id)"
          @click="navigateTo(`/posting/posts/${post.post_id}`)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useContent from 'src/api/composables/useContent'
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import PostComponent from 'src/components/PostComponent.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { apiGetPosts, apiPublishPost, apiGetAllPosts } = useContent()
const router = useRouter()
const loading = ref(false)

const navigateTo = (path: string) => {
  router.push(path)
}

const posts = ref([])

const publishPost = (id: number) => {
  apiPublishPost(id).then(() => {
    // posts.value = posts.value.map((post) => {
    //   if (post.post_id === id) {
    //     post.published = true
    //   }
    //   return post
    // })
  })
}

onMounted(() => {
  apiGetAllPosts().then((res) => {
    posts.value = res.sort((a, b) => {
      return new Date(b.marked_at) - new Date(a.marked_at)
    })
  })
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
    color: #4e4571;
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

    .date {
      padding-top: var(--spacing-xs);
      padding-bottom: var(--spacing-xxs);
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 576px) {
  .containers {
    grid-template-columns: 1fr !important;
  }
}
</style>
