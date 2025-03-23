<template>
  <BlobComponent />
  <QuestionDialog
    :is-open="dialog.isOpen"
    question="Тема поста"
    :model-value="postTopic"
    @close="handlerCloseDialog"
    @save="handlerSaveDialog"
  />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <div class="row back items-center" @click="goBack">
          <img :src="backIcon" style="color: #b8b8b8" />
          <p>Назад</p>
        </div>
        <div class="row no-wrap items-center" style="gap: var(--spacing-sm)">
          <p class="title">{{ postTopic }}</p>
          <q-btn class="edit" flat round size="md" @click="handlerOpenDialog">
            <img :src="edit" />
          </q-btn>
        </div>
        <div class="main-grid row items-start no-wrap">
          <div class="inputs-container column left-side" v-if="postText.length != 0">
            <p class="subtitle">Текст</p>
            <EditorComponent
              class="editor"
              :model-value="postText"
              @update:model-value="postText = $event"
            />
            <FancyButtonComponent
              label="Переписать текст"
              style="align-self: flex-start; margin-top: var(--spacing-sm)"
              @click="clearText"
            />
          </div>
          <div class="inputs-container column left-side" v-else>
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
            <p class="subtitle">Дополнительная информация</p>
            <q-spinner-puff
              style="margin: var(--spacing-sm) auto"
              color="primary"
              size="50px"
              v-if="loadingCreation"
            />
            <InputComponent
              v-else
              :model-value="additions"
              style="font-size: var(--font-size-sm)"
              has-voice
              @update:model-value="additions = $event"
            />
            <div class="row justify-between buttons">
              <q-select
                class="q-select"
                outlined
                v-model="length"
                color="white"
                hide-dropdown-icon
                :options="[
                  'Короткий — 500 символов',
                  'Средний — 1500 символов',
                  'Лонгрид — 2200 символов',
                ]"
              />
              <FancyButtonComponent label="Создать" style="margin: auto 0" @click="createText" />
            </div>
          </div>
          <div
            class="images-container column no-wrap justify-between"
            style="margin-left: var(--spacing-sm); flex: 1"
          >
            <div class="column no-wrap" style="flex: 1">
              <div class="row justify-between" style="margin-bottom: var(--spacing-xxs)">
                <CheckComponent
                  :modelValue="check"
                  style="user-select: none"
                  label="Пост без фото"
                  :is-disabled="loadingImage"
                  @update:modelValue="check = $event"
                />
                <q-btn class="download" round :disable="!computedImageSrc" @click="downloadImage">
                  <q-tooltip>
                    <p style="margin-bottom: 0">Скачать изображение</p>
                  </q-tooltip>
                  <img :src="downloadIcon" />
                </q-btn>
              </div>
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
                :options="['9x16', '16x9', '1x1']"
              />
              <FancyButtonComponent
                :disabled="
                  check ||
                  (imageType == 'prompt' && imagePrompt == '') ||
                  (imageType == 'from_post' && postTopic == '')
                "
                class="submit-btn"
                label="Создать"
                @click="() => (imageType == 'prompt' ? createImagePrompt() : createImagePost())"
              />
            </div>
          </div>
        </div>
        <DefaultButton
          v-if="!ready"
          style="align-self: flex-start; margin-top: var(--spacing-sm)"
          label="Отправить в очередь на публикацию"
          :icon="arrowRight"
          @click="readyToPublish"
        />
        <DefaultButton
          v-else
          style="align-self: flex-start; margin-top: var(--spacing-sm)"
          label="В очереди на публикацию"
          :icon="checkIcon"
          disabled
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BlobComponent from 'src/components/BlobComponent.vue'
import EditorComponent from 'src/components/EditorComponent.vue'
import edit from 'src/assets/icons/edit.svg'
import { computed, onMounted, ref, watch } from 'vue'
import useContent from 'src/api/composables/useContent'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import InputComponent from 'src/components/InputComponent.vue'
import CheckComponent from 'src/components/CheckComponent.vue'
import pin from 'src/assets/icons/pin.svg'
import close from 'src/assets/icons/close.svg'
import templateImage from 'src/assets/icons/image.svg'
import { useRoute } from 'vue-router'
import { debounce } from 'quasar'
import { getPresignedUrl } from 'src/boot/aws'
import backIcon from 'src/assets/icons/arrow_left.svg'
import { useRouter } from 'vue-router'
import QuestionDialog from 'src/dialogs/QuestionDialog.vue'
import DefaultButton from 'src/components/DefaultButton.vue'
import arrowRight from 'src/assets/icons/arrow_right.svg'
import checkIcon from 'src/assets/icons/check.svg'
import { SavePostRequest } from 'src/api'
import downloadIcon from 'src/assets/icons/download.svg'

const dialog = ref<{
  isOpen: boolean
}>({
  isOpen: false,
})

const handlerOpenDialog = (): void => {
  dialog.value = {
    isOpen: true,
  }
}

const handlerCloseDialog = () => {
  dialog.value = {
    isOpen: false,
  }
}

const handlerSaveDialog = (answer: string) => {
  postTopic.value = answer
  handlerCloseDialog()
}

const { params } = useRoute()
const router = useRouter()

const {
  apiGetPost,
  apiUpdatePost,
  apiCreateImagePost,
  apiCreateImagePrompt,
  apiCreatePost,
  apiReadyToPublish,
  apiUploadImage,
} = useContent()

const aspectOptions = {
  '9x16': 'ASPECT_9_16',
  '16x9': 'ASPECT_16_9',
  '1x1': 'ASPECT_1_1',
}

const lenghtOptions = {
  'Короткий — 500 символов': 500,
  'Средний — 1500 символов': 1500,
  'Лонгрид — 2200 символов': 2200,
}

const post = ref<SavePostRequest>()
const postTopic = ref('')
const postText = ref('')
const additions = ref<string>('')
// const base64Image = ref<string | null>(null)
const base64Image = ref<string | null>()

const fileName = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const check = ref(false)
const imageType = ref('download')
const imageDimensions = ref<keyof typeof aspectOptions>('9x16')
const imagePrompt = ref<string>('')
const loadingCreation = ref<boolean>(false)
const postType = ref(null)
const length = ref<keyof typeof lenghtOptions>('Короткий — 500 символов')
const type = ref(true)
const ready = ref(false)

const computedImageSrc = ref<string | null>(null)

const readyToPublish = () => {
  apiReadyToPublish(post.value.post_id).then((res) => {
    if (res == 200) {
      ready.value = true
    }
  })
}
async function downloadImage() {
  try {
    let url = computedImageSrc.value
    console.log('Original URL:', url)

    // Ensure the URL is decoded (replace HTML entities)
    url = url.replace(/&amp;/g, '&')

    // Optionally, add a tiny delay to ensure the URL is ready
    await new Promise((resolve) => setTimeout(resolve, 50))

    console.log('Decoded URL:', url)
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    const objectUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = objectUrl
    link.download = 'puls.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Delay revocation to ensure the download has started
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl)
    }, 1000)
  } catch (error) {
    console.error('Error downloading the image:', error)
  }
}

function base64ToBlob(base64, mimeType = 'image/png') {
  // Remove any data URL prefix if present
  if (base64.startsWith('data:')) {
    base64 = base64.split(',')[1]
  }

  // Decode the base64 string
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  // Create a Blob with the binary data and MIME type
  return new Blob([byteArray], { type: mimeType })
}
// Watch for changes to base64Image
watch(
  base64Image,
  async (newVal) => {
    console.log(newVal)
    if (newVal?.includes('images.s3.amazonaws.com')) {
      // Assume the bucket key is the last segment of the URL
      console.log(base64Image.value)
      const key = newVal.split('/').at(-1)
      if (key) {
        computedImageSrc.value = await getPresignedUrl(key)
        console.log('Presigned URL:', computedImageSrc.value)
      }
    } else {
      if (newVal) {
        apiUploadImage(base64ToBlob(newVal)).then((res) => {
          base64Image.value = res.link
        })
      }
      computedImageSrc.value = newVal
    }
  },
  { deep: true },
)

const goBack = (path: string) => {
  router.back()
}

const clearText = () => {
  postText.value = ''
}

const createText = () => {
  loadingCreation.value = true
  apiCreatePost({
    post_topic: postTopic.value,
    additions: additions.value,
    length: lenghtOptions[length.value],
    type: postType.value,
  })
    .then((res) => {
      postText.value = res.text
      additions.value = ''
    })
    .finally(() => {
      loadingCreation.value = false
    })
}

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
  apiCreateImagePost(postTopic.value, aspectOptions[imageDimensions.value])
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
  [base64Image, postText, check, imageType, postTopic],
  () => {
    debouncedProcessAnswers()
  },
  { deep: true },
)

onMounted(() => {
  // getPresignedUrl('images', '2-9a7352c9-5d6f-4c03-a12c-292148cd69f6').then((res) => {
  //   console.log(res)
  // })
  apiGetPost(parseInt(params.id)).then((res) => {
    post.value = res
    postTopic.value = res.post_topic
    postText.value = res.post_text
    postType.value = res.type
    ready.value = res.ready_to_publish
    if (res.image_urls[0] != 'NULL') {
      base64Image.value = res.image_urls[0]
    } else {
      check.value = true
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

  .left-side {
    // margin-top: var(--spacing-sm);
    width: 60%;

    .buttons {
      margin-top: var(--spacing-sm);
    }
  }
  .editor {
    // width: 60%;
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

.download {
  // background-color: rgba(255, 255, 255, 0.1);
  // border-radius: 15px;
}

@media screen and (max-width: 576px) {
  .posts-grid {
    grid-template-columns: 1fr !important;
    gap: var(--spacing-sm) !important;
  }

  .main-grid {
    flex-direction: column-reverse !important;

    .inputs-container {
      width: 100% !important;

      .buttons {
        margin-top: var(--spacing-sm) !important;
      }
    }

    .image-content {
      margin-bottom: var(--spacing-md);
    }

    .images-container {
      margin-left: 0 !important;
      width: 100%;
      margin-top: var(--spacing-sm);
      .download-image {
        margin: var(--spacing-xs) 0 !important;
        .btn-label {
          padding-left: var(--spacing-xxs);
          font-size: var(--font-size-sm) !important;
          user-select: none;
        }
      }
    }
  }

  .q-btn-group ::v-deep .no-outline {
    width: calc(var(--spacing-xl) + var(--spacing-sm)) !important;
    font-size: var(--font-size-sm);
  }

  .q-select ::v-deep .q-field__native {
    color: white;
    font-size: var(--font-size-sm);
  }

  .fancy-btn {
    width: calc(var(--spacing-xxl) + var(--spacing-md)) !important;
  }

  .subtitle {
    margin-bottom: 0;
    margin-top: var(--spacing-xs);
    // padding-left: var(--spacing-xxs);
    font-size: var(--font-size-md) !important;
    font-weight: 500;
    margin-bottom: 6px;
  }
}
</style>
