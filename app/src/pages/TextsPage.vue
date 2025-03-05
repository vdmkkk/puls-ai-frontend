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
          <p class="subtitle">Режим</p>
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
        <div class="column no-wrap" style="margin-left: var(--spacing-sm)">
          <div class="column">
            <CheckComponent
              :modelValue="check"
              style="user-select: none"
              label="Пост без фото"
              @update:modelValue="check = $event"
            />
            <q-btn-toggle
              v-model="imageType"
              class="btn-group"
              :disable="check"
              no-caps
              rounded
              unelevated
              :options="[
                { label: 'Загрузить', value: 'download' },
                { label: 'Из поста', value: 'from_post' },
                { label: 'Промпт', value: 'prompt' },
              ]"
            />
            <div class="image-content">
              <p :class="{ subtitle: true, grey: check }">Изображение к посту</p>
              <div v-if="imageType == 'download'">
                <div class="download-image">
                  <q-item :disable="check" clickable v-ripple class="container">
                    <img :src="pin" />
                    <q-item-section>
                      <q-item-label class="btn-label">Выберите файл</q-item-label>
                    </q-item-section>
                  </q-item>
                  <p class="image-name">Файл не выбран</p>
                  <q-btn :disable="check" class="close" flat round size="sm">
                    <img :src="close" />
                  </q-btn>
                </div>
              </div>
              <div :class="{ 'template-image': true, grey: check }">
                <img class="icon" :src="templateImage" />
              </div>
            </div>
          </div>
          <div class="controls row justify-between" v-if="imageType != 'download'">
            <q-select
              :disable="check"
              class="q-select image-dimensions"
              outlined
              v-model="imageDimensions"
              color="white"
              hide-dropdown-icon
              :options="['9x16', '16x9', '1x1', '4x3', '3x4']"
            />
            <FancyButtonComponent
              :disabled="check"
              class="submit-btn"
              label="Создать"
              @click="onSubmit"
            />
          </div>
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
import CheckComponent from 'src/components/CheckComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import DefaultButton from 'src/components/DefaultButton.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import InputComponent from 'src/components/InputComponent.vue'
import OptionButton from 'src/components/OptionButton.vue'
import PostComponent from 'src/components/PostComponent.vue'
import { onMounted, ref } from 'vue'
import pin from 'src/assets/icons/pin.svg'
import close from 'src/assets/icons/close.svg'
import templateImage from 'src/assets/icons/image.svg'

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
const check = ref(false)
const imageType = ref('download')
const imageDimensions = ref('9x16')

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

  .image-content {
    margin-top: var(--spacing-sm);
    .download-image {
      display: flex;
      flex-direction: row;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      position: relative;

      .container {
        .btn-label {
          padding-left: var(--spacing-xxs);
          font-size: var(--font-size-xs);
          user-select: none;
        }
        background-color: #4e4571;
        border: 1px solid transparent;
        border-right-color: rgba(255, 255, 255, 0.5);
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }

      .image-name {
        padding-left: var(--spacing-sm);
        margin-top: auto;
        user-select: none;
        margin-bottom: auto;
      }

      .close {
        position: absolute;
        right: var(--spacing-xs);
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .template-image {
      margin-top: var(--spacing-xs);
      width: 100%;
      aspect-ratio: 1/0.5625;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .icon {
        width: 20%;
      }
    }

    .template-image.grey {
      background-color: rgba(129, 129, 129, 0.1);
    }

    .controls {
      margin-top: var(--spacing-xs);
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

.image-dimensions ::v-deep .q-field__control {
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);
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

.grey {
  color: #b8b8bb !important;
}
</style>
