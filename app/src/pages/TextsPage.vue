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
      <div class="row items-start no-wrap" style="position: relative; align-items: stretch">
        <div class="column justify-between no-wrap" style="width: 50%">
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
              class="prompt"
              autogrow
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
          </div>
          <div class="row q-mt-xl justify-between" style="align-items: stretch">
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
            <FancyButtonComponent
              :disabled="prompt == '' || (!check && !base64Image)"
              class="submit-btn"
              label="Создать"
              @click="onSubmit"
            />
          </div>
        </div>
        <div class="column no-wrap justify-between" style="margin-left: var(--spacing-sm); flex: 1">
          <div class="column no-wrap" style="flex: 1">
            <CheckComponent
              :modelValue="check"
              style="user-select: none"
              label="Пост без фото"
              :is-disabled="loadingImage"
              @update:modelValue="check = $event"
            />
            <q-btn-toggle
              v-model="imageType"
              class="btn-group"
              :disable="check || loadingImage"
              no-caps
              rounded
              unelevated
              :options="[
                { label: 'Загрузить', value: 'download' },
                { label: 'Из поста', value: 'from_post' },
                { label: 'Промпт', value: 'prompt' },
              ]"
            />
            <div
              class="image-content full-height"
              :style="imageType != 'download' ? { marginBottom: 'var(--spacing-sm)' } : {}"
            >
              <div v-if="loadingImage">
                <q-spinner-puff class="loading" size="50px" />
              </div>
              <div v-else-if="imageType == 'prompt'">
                <p class="subtitle">Промпт</p>
                <InputComponent
                  :model-value="imagePrompt"
                  :is-disabled="check"
                  style="font-size: var(--font-size-sm)"
                  @update:model-value="imagePrompt = $event"
                />
              </div>
              <div v-else-if="imageType == 'download'">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onFileChange"
                />
                <div class="download-image">
                  <q-item :disable="check" clickable v-ripple class="container">
                    <img :src="pin" />
                    <q-item-section @click="openFileExplorer">
                      <q-item-label class="btn-label">Выберите файл</q-item-label>
                    </q-item-section>
                  </q-item>
                  <p class="image-name">{{ !fileName ? 'Файл не выбран' : fileName }}</p>
                  <q-btn
                    v-if="fileName"
                    :disable="check"
                    class="close"
                    flat
                    round
                    size="sm"
                    @click="clearImage"
                  >
                    <img :src="close" />
                  </q-btn>
                </div>
              </div>
              <p :class="{ subtitle: true, grey: check }">Изображение к посту</p>
              <div v-if="!base64Image || check" :class="{ 'template-image': true, grey: check }">
                <img class="icon" :src="templateImage" />
              </div>
              <div
                v-else
                :class="{ 'template-image': true, grey: check }"
                style="background-color: transparent !important; justify-content: start"
              >
                <img :src="computedImageSrc" alt="Selected Image" />
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
              :disabled="
                check ||
                (imageType == 'prompt' && imagePrompt == '') ||
                (imageType == 'from_post' && prompt == '')
              "
              class="submit-btn"
              label="Создать"
              @click="() => (imageType == 'prompt' ? createImagePrompt() : createImagePost())"
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
            @click="navigateTo(`/texts/posts/${post.post_id}`)"
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
import { onMounted, ref, watch } from 'vue'
import pin from 'src/assets/icons/pin.svg'
import close from 'src/assets/icons/close.svg'
import templateImage from 'src/assets/icons/image.svg'
import { useRouter } from 'vue-router'
import { getPresignedUrl } from 'src/boot/aws'
const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const lenghtOptions = {
  'до 300 символов': 300,
  'до 500 символов': 500,
  'до 750 символов': 750,
  'до 1000 символов': 1000,
}
const aspectOptions = {
  '9x16': 'ASPECT_9_16',
  '16x9': 'ASPECT_16_9',
  '1x1': 'ASPECT_1_1',
  '4x3': 'ASPECT_4_3',
  '3x4': 'ASPECT_3_4',
}

const prompt = ref<string>('')
const additions = ref<string>('')
const length = ref<keyof typeof lenghtOptions>('до 500 символов')
const type = ref(true)
const check = ref(false)
const imageType = ref('download')
const imageDimensions = ref<keyof typeof aspectOptions>('9x16')
const imagePrompt = ref<string>('')
const imagePost = ref<string>('')

const posts = ref([])
const loadingCreation = ref(false)
const loadingPosts = ref(false)
const loadingImage = ref(false)

const { apiGetPosts, apiCreatePost, apiSavePost, apiCreateImagePost, apiCreateImagePrompt } =
  useContent()

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

const base64Image = ref<string | null>(null)
const fileName = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const computedImageSrc = ref<string | null>(null)

watch(
  base64Image,
  async (newVal) => {
    console.log('base64Image changed:', newVal)
    if (newVal?.includes('images.s3.amazonaws.com')) {
      // Assume the bucket key is the last segment of the URL
      const key = newVal.split('/').at(-1)
      if (key) {
        computedImageSrc.value = await getPresignedUrl(key)
        console.log('Presigned URL:', computedImageSrc.value)
      }
    } else {
      computedImageSrc.value = newVal
    }
  },
  { deep: true },
)

function openFileExplorer() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Save the file name.
    fileName.value = file.name
    const reader = new FileReader()
    reader.onload = () => {
      base64Image.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  base64Image.value = null
  fileName.value = null
}

const createImagePost = () => {
  loadingImage.value = true
  apiCreateImagePost(prompt.value, aspectOptions[imageDimensions.value])
    .then((res) => {
      base64Image.value = res
    })
    .finally(() => {
      loadingImage.value = false
    })
}

const createImagePrompt = () => {
  loadingImage.value = true
  apiCreateImagePrompt(imagePrompt.value, aspectOptions[imageDimensions.value])
    .then((res) => {
      base64Image.value = res
    })
    .finally(() => {
      loadingImage.value = false
    })
}
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);
  // background-color: #12121b;

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
    // margin-bottom: calc(var(--spacing-md) + var(--spacing-sm));

    .loading {
      margin-top: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      margin-left: 50%;
      transform: translateX(-50%);
      color: #4e4571;
    }
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
      height: calc(var(--spacing-xxl) + var(--spacing-md)); /* Fixed height (e.g., a 16:9 ratio) */
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center; /* Center the image horizontally and vertically */
    }

    /* Ensure that any img inside the container scales proportionally */
    .template-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain; /* Keeps the image aspect ratio while fitting within the container */
    }

    /* This class was previously used for the placeholder icon */
    .icon {
      width: 20%;
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
