<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <div class="row back items-center" @click="goBack">
          <img :src="backIcon" style="color: #b8b8b8" />
          <p>Назад</p>
        </div>
        <p class="title">Неделя {{ params.id }}</p>
        <p class="description">
          Редактируйте посты, создавайте к ним изображения и отправляйте в очередь на публикацию
          всего за пару кликов!
        </p>
      </div>
      <!-- <p class="title">Контент-план</p>
      <p class="subtitle">
        Здесь вы можете автоматически создать шесть уникальных постов на разные темы в рамках
        единого контент-плана. Каждый пост можно легко отредактировать вручную, дополнить
        изображением или полностью изменить тему по вашему желанию.
      </p> -->

      <div class="posts-grid">
        <PostComponent
          v-for="post in contentPlan"
          :topic="post.post_topic"
          :text="post.post_text"
          @click="navigateTo(`/content-plan/posts/${post.post_id}`)"
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
import { useRoute, useRouter } from 'vue-router'
import backIcon from 'src/assets/icons/arrow_left.svg'

const { apiGetPostsContentPlan } = useContent()
const { params } = useRoute()
const router = useRouter()

const contentPlan = ref([])

const getContentPlan = () => {
  console.log(params.id)
  apiGetPostsContentPlan(params.id).then((res) => {
    contentPlan.value = res.toSorted((a, b) => {
      return a.post_id - b.post_id
    })
  })
}

const navigateTo = (path: string) => {
  router.push(path)
}

const goBack = (path: string) => {
  router.back()
}

onMounted(() => {
  getContentPlan()
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

  .back {
    cursor: pointer;
    user-select: none;
    p {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: #b8b8b8;
      text-decoration: underline;
      margin-bottom: 0;
      margin-left: var(--spacing-xxs);
    }
    img {
      height: var(--font-size-sm);
    }
  }

  .posts-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: var(--spacing-xs);
    padding-bottom: var(--spacing-md);
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
</style>
