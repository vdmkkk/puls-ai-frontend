<script setup lang="ts">
import DefaultButton from 'src/components/DefaultButton.vue'
import InputComponent from 'src/components/InputComponent.vue'
import { computed, ref, watch } from 'vue'
import close from '../assets/icons/close.svg'
import EditorComponent from 'src/components/EditorComponent.vue'
import CheckComponent from 'src/components/CheckComponent.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import moment from 'moment'
import { Notify } from 'quasar'

const answer = defineModel<{
  tg: boolean
  vk: boolean
  inst: boolean
  time: string
  isNow: boolean
  tgDisabled?: boolean
  vkDisabled?: boolean
  instDisabled?: boolean
}>()
const props = defineProps<{
  isOpen: boolean
}>()

const isOpenRef = ref(props.isOpen)

const emits = defineEmits(['close', 'save'])

watch(
  () => props.isOpen,
  (value) => {
    isOpenRef.value = value
  },
)

watch(isOpenRef, (value) => {
  if (!value) {
    emits('close')
  }
})

const onSave = () => {
  if (!answer.value.time) {
    Notify.create({
      message: 'Выберите время публикации',
      position: 'top',
      color: 'negative',
    })
    return
  }
  if (!answer.value.tg && !answer.value.vk && !answer.value.inst) {
    Notify.create({
      message: 'Выберите хотя бы одну соцсеть',
      position: 'top',
      color: 'negative',
    })
    return
  }
  if (answer.value.isNow) {
    answer.value.time = moment().add(5, 'seconds').format('YYYY-MM-DD[T]HH:mm:ssZ')
  }
  if (moment(answer.value.time).isBefore(moment().startOf('minute'))) {
    Notify.create({
      message: 'Нельзя выбрать время в прошлом',
      position: 'top',
      color: 'negative',
    })
    return
  }
  emits('save', answer.value)
}

const handleNow = () => {
  answer.value.time = moment().format('YYYY-MM-DD[T]HH:mm:ssZ')
  answer.value.isNow = true
}

const shownTime = computed(() => {
  return moment(answer.value.time).format('DD-MM-YYYY HH:mm')
})
</script>

<template>
  <q-dialog v-model="isOpenRef">
    <div class="dialog-container" :style="{ height: 'auto' }">
      <q-btn class="close" flat round @click="emits('close')">
        <img :src="close" />
      </q-btn>
      <div ref="filterRef" class="filter">
        <div class="row justify-between">
          <InputComponent style="width: 60% !important" type="text" v-model="shownTime">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    :model-value="shownTime"
                    mask="YYYY-MM-DD[T]HH:mm:ssZ"
                    @update:model-value="
                      (e) => {
                        answer.time = e
                        answer.isNow = false
                      }
                    "
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time
                    :model-value="shownTime"
                    mask="YYYY-MM-DD[T]HH:mm:ssZ"
                    @update:model-value="
                      (e) => {
                        answer.time = e
                        answer.isNow = false
                      }
                    "
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </InputComponent>
          <FancyButtonComponent label="Сейчас" style="width: 30% !important" @click="handleNow" />
        </div>
        <div class="checks">
          <CheckComponent
            :model-value="answer.tg"
            label="Telegram"
            :disable="answer.tgDisabled"
            @update:model-value="(e) => (answer.tg = e)"
          />
          <CheckComponent
            :model-value="answer.vk"
            label="VK"
            :disable="answer.vkDisabled"
            @update:model-value="(e) => (answer.vk = e)"
          />
          <CheckComponent
            :model-value="answer.inst"
            label="Instagram"
            :disable="answer.instDisabled"
            @update:model-value="(e) => (answer.inst = e)"
          >
            <q-tooltip v-if="answer?.instDisabled"
              ><a
                >Для публикации в Instagram нужно подключить аккаунт. Поддерживаются только
                публикации, содержащие изображение</a
              ></q-tooltip
            >
          </CheckComponent>
          <!-- <q-checkbox v-model="answer.tg" size="xs" color="primary">
            <div class="row no-wrap items-center" style="gap: 12px; margin-left: 6px">
              <img :src="wbIcon" alt="wb" />
              <p>Telegram</p>
            </div>
          </q-checkbox> -->
          <!-- <q-checkbox v-model="answer.vk" size="xs" color="primary">
            <div class="row no-wrap items-center" style="gap: 12px; margin-left: 6px">
              <img :src="ozonIcon" alt="ozon" />
              <p>VK</p>
            </div>
          </q-checkbox>
          <q-checkbox v-model="answer.inst" size="xs" color="primary">
            <div class="row no-wrap items-center" style="gap: 12px; margin-left: 6px">
              <img :src="yamarketIcon" alt="yamarket" />
              <p>Instagram</p>
            </div>
          </q-checkbox> -->
        </div>
      </div>
      <!-- <EditorComponent
        :model-value="answer"
        :is-high="!!isHigh"
        @update:model-value="answer = $event"
      /> -->
      <DefaultButton label="Опубликовать" @click="onSave" class="save" />
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
.q-checkbox ::v-deep .text-teal {
  //   color: #2a2a32 !important;
}

.q-input ::v-deep .q-field__control-container {
  margin-top: auto;
  margin-bottom: auto;
}

.dialog-container {
  width: 90vw;
  background-color: #2a2a32;
  border-radius: 10px;
  padding: var(--spacing-sm);
  padding-top: 30px;
  color: white;
  height: max-content;
  display: flex;
  flex-direction: column;
  position: relative;

  .title {
    font-size: var(--font-size-md);
    font-weight: 600;
    margin: 0px;
  }

  .close {
    position: absolute;
    right: var(--spacing-xs);
    top: var(--spacing-xs);
    width: var(--spacing-xs) !important;
    height: var(--spacing-xs) !important;
  }

  .subtitle {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: #b8b8bb;
    margin-top: var(--spacing-xs);
  }

  .save {
    margin-top: var(--spacing-sm);
    align-self: center;
  }

  .filter {
    // background-color: #2a2a32;
    // border: 1px solid #deeaed;
    // width: 200px;
    // align-self: flex-end;
    // border-radius: 20px;
    padding: 20px;
    // margin-bottom: 16px;
    // position: absolute;
    // left: var(--spacing-xs);
    // top: var(--spacing-xl);

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
      margin-top: var(--spacing-sm);
      img {
        width: 28px;
        height: 28px;
      }
    }
  }
}
</style>
