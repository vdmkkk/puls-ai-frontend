<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <p class="title">Авторские темы</p>
        <p class="description">
          На этой странице вы можете создать нужный вам текст для поста. Для этого выберите нужный
          режим: фоновый пост или продающий, и подробно сформулируйте тему и дополнительную
          информацию.
        </p>
      </div>
      <div class="row items-start" style="position: relative">
        <div class="inputs">
          <p class="subtitle">Тема поста</p>
          <InputComponent
            :model-value="prompt"
            style="font-size: var(--font-size-sm)"
            @update:model-value="prompt = $event"
          />
          <p class="subtitle">Дополнительная информация</p>
          <InputComponent
            :model-value="additions"
            style="font-size: var(--font-size-sm)"
            has-voice
            @update:model-value="additions = $event"
          />
          <div class="row q-mt-xl justify-between">
            <q-select
              class="q-select"
              outlined
              v-model="length"
              color="white"
              hide-dropdown-icon
              :options="[
                'до 300 символов',
                'до 500 символов',
                'до 750 символов',
                'до 1000 символов',
              ]"
            />
            <FancyButtonComponent class="submit-btn" label="Создать" @click="onSubmit" />
          </div>
        </div>
        <div class="column">
          <p class="subtitle" style="margin-left: var(--spacing-sm)">Режим</p>
          <q-btn-toggle
            v-model="type"
            class="btn-group"
            no-caps
            rounded
            unelevated
            :options="[
              { label: 'Фоновый', value: true },
              { label: 'Продающий', value: false },
            ]"
          />
        </div>
        <q-inner-loading dark :showing="loadingCreation" text-color="white" text="Создание поста">
          <q-spinner-puff color="primary" size="xl" />
        </q-inner-loading>
      </div>
      <div class="posts">
        <p class="title">Все текстовые посты</p>
        <div class="posts-grid">
          <PostComponent
            v-for="post in posts"
            :topic="post.post_topic"
            :text="post.post_text"
            :date="post.created_at"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useContent from 'src/api/composables/useContent'
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import DefaultButton from 'src/components/DefaultButton.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import InputComponent from 'src/components/InputComponent.vue'
import OptionButton from 'src/components/OptionButton.vue'
import PostComponent from 'src/components/PostComponent.vue'
import { onMounted, ref } from 'vue'

const lenghtOptions = {
  'до 300 символов': 300,
  'до 500 символов': 500,
  'до 750 символов': 750,
  'до 1000 символов': 1000,
}

const prompt = ref<string>('')
const additions = ref<string>('')
const length = ref<keyof typeof lenghtOptions>('до 500 символов')
const type = ref(true)

const posts = ref([])
const loadingCreation = ref(false)
const loadingPosts = ref(false)

const { apiGetPosts, apiCreatePost, apiGetContentPlan, apiSavePost } = useContent()

const onSubmit = () => {
  const topic = prompt.value
  loadingCreation.value = true
  apiCreatePost({
    post_topic: topic,
    additions: additions.value,
    length: lenghtOptions[length.value],
    type: type.value ? 'Фоновый' : 'Продающий',
  })
    .then((res) => {
      apiSavePost({
        post_topic: topic,
        text: res.text,
        image_urls: [],
        in_content_plan: false,
      }).then(() => {
        loadPosts()
      })
    })
    .finally(() => {
      loadingCreation.value = false
    })
}

const loadPosts = () => {
  loadingPosts.value = true
  apiGetPosts()
    .then((res) => {
      posts.value = res
    })
    .finally(() => {
      loadingPosts.value = false
    })
}

onMounted(() => {
  loadPosts()
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

  .header {
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    margin-right: var(--spacing-sm);
    .title {
      font-size: var(--font-size-title);
      font-weight: 500;
      margin: 0;
    }
    .description {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: #b8b8b8;
    }
  }

  .posts {
    .title {
      margin-top: var(--spacing-sm);
      font-size: var(--font-size-md);
      font-weight: 600;
    }
    .posts-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: var(--spacing-xs);
      padding-bottom: var(--spacing-md);
    }
  }

  .inputs {
    width: 50%;
  }

  .subtitle {
    margin-bottom: 0;
    margin-top: var(--spacing-xs);
    // padding-left: var(--spacing-xxs);
    font-size: var(--font-size-sm);
    font-weight: 500;
    margin-bottom: 6px;
  }

  .button-container {
    border: solid 2px rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    padding: 20px;
    background-color: rgba(58, 58, 67, 0.5);
    display: flex;
    flex-direction: row;
    gap: 30px;
  }
}

.q-btn-group {
  margin-left: var(--spacing-sm);
}
.q-btn-group ::v-deep .no-outline {
  border: 1px solid #4e4571 !important;
  width: var(--spacing-xl) !important;
  font-size: var(--font-size-xs);
}

.q-btn-group ::v-deep .bg-primary {
  background-color: #4e4571 !important;
  border: 1px solid transparent !important;
  // border-top-left-radius: 10px !important;
  // border-bottom-left-radius: 10px !important;
}

.q-btn-group ::v-deep .q-btn-item:last-child {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

.q-btn-group ::v-deep .q-btn-item:first-child {
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
}

.q-select ::v-deep .q-field__control {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px !important;
}

.q-select ::v-deep .q-field__native {
  color: white;
  font-size: var(--font-size-xs);
}

:global(.q-menu) {
  background-color: rgb(124, 124, 124);
  color: white;
}
</style>
