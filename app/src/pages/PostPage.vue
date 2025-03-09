<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <p class="title">{{ postTopic }}</p>
        <p class="subtitle">Текст</p>
        <div class="row items-start no-wrap">
          <EditorComponent
            class="editor"
            :model-value="postText"
            @update:model-value="postText = $event"
          />
          <div
            class="column no-wrap justify-between"
            style="margin-left: var(--spacing-sm); flex: 1"
          >
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
                  <img :src="base64Image" alt="Selected Image" />
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
                  (imageType == 'from_post' && imagePost == '')
                "
                class="submit-btn"
                label="Создать"
                @click="() => (imageType == 'prompt' ? createImagePrompt() : createImagePost())"
              />
            </div>
          </div>
        </div>
        <div class="row" style="gap: var(--spacing-xxs)">
          <div class="copy" style="width: min-content">
            <q-btn flat round><img :src="edit" /></q-btn>
          </div>
          <div class="copy" style="width: min-content">
            <q-btn flat round><img :src="copy" /></q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BlobComponent from 'src/components/BlobComponent.vue'
import EditorComponent from 'src/components/EditorComponent.vue'
import copy from 'src/assets/icons/copy.svg'
import edit from 'src/assets/icons/edit.svg'
import { onMounted, ref, watch } from 'vue'
import useContent from 'src/api/composables/useContent'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import InputComponent from 'src/components/InputComponent.vue'
import CheckComponent from 'src/components/CheckComponent.vue'
import pin from 'src/assets/icons/pin.svg'
import close from 'src/assets/icons/close.svg'
import templateImage from 'src/assets/icons/image.svg'
import { useRoute } from 'vue-router'
import { debounce } from 'quasar'

const { params } = useRoute()

const { apiGetPost, apiUpdatePost, apiCreateImagePost, apiCreateImagePrompt } = useContent()

const aspectOptions = {
  '9x16': 'ASPECT_9_16',
  '16x9': 'ASPECT_16_9',
  '1x1': 'ASPECT_1_1',
  '4x3': 'ASPECT_4_3',
  '3x4': 'ASPECT_3_4',
}

const postTopic = ref('')
const postText = ref('')
const base64Image = ref<string | null>(null)
const fileName = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const check = ref(false)
const imageType = ref('download')
const imageDimensions = ref<keyof typeof aspectOptions>('9x16')
const imagePrompt = ref<string>('')
const imagePost = ref<string>('')

const loadingImage = ref(false)

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
  apiCreateImagePost(postText.value, aspectOptions[imageDimensions.value])
    .then((res) => {
      console.log(res)
    })
    .finally(() => {
      loadingImage.value = false
    })
}

const createImagePrompt = () => {
  loadingImage.value = true
  apiCreateImagePrompt(imagePrompt.value, aspectOptions[imageDimensions.value])
    .then((res) => {
      console.log(res)
    })
    .finally(() => {
      loadingImage.value = false
    })
}

const savePost = () => {
  apiUpdatePost({
    post_id: parseInt(params.id),
    post_topic: postTopic.value,
    text: postText.value,
    image_urls: base64Image.value && !check.value ? [base64Image.value] : ['NULL'],
  })
}

const debouncedProcessAnswers = debounce(savePost, 1000)

watch(
  [base64Image, postText, check, imageType],
  () => {
    debouncedProcessAnswers()
  },
  { deep: true },
)

onMounted(() => {
  apiGetPost(parseInt(params.id)).then((res) => {
    postTopic.value = res.post_topic
    postText.value = res.post_text
    if (res.image_urls[0] != 'NULL') {
      base64Image.value = res.image_urls[0]
    }
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

  .editor {
    width: 60%;
  }

  .copy {
    background-color: rgba(255, 255, 255, 0.1);
    // margin-left: var(--spacing-sm);
    border-radius: 10px;
  }

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
    margin-bottom: calc(var(--spacing-md) + var(--spacing-sm));

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
