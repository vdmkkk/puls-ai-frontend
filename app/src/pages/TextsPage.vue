<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <p class="title">Генерация текстов вне контент-плана</p>
      <p class="subtitle">Тема поста</p>
      <InputComponent
        :model-value="prompt"
        label="О чем пост"
        style="font-size: var(--font-size-sm)"
        @update:model-value="prompt = $event"
      />
      <p class="subtitle">Дополнения</p>
      <InputComponent
        :model-value="additions"
        label="Дополнительная информация"
        style="font-size: var(--font-size-sm)"
        has-voice
        @update:model-value="additions = $event"
      />
      <div class="row q-mt-xl justify-between">
        <div class="row">
          <p class="subtitle q-mr-md">Длина</p>
          <q-input
            v-model="length"
            rounded
            standout="standout-class"
            type="text"
            style="font-size: var(--font-size-sm)"
            @update:model-value="length = $event"
          />
        </div>
        <div class="button-container">
          <OptionButton
            label="Фоновый"
            :option-value="type == 'Фоновый'"
            @click="type = 'Фоновый'"
          />
          <OptionButton
            label="Продающий"
            :option-value="type == 'Продающий'"
            @click="type = 'Продающий'"
          />
        </div>
      </div>
    </div>
    <FancyButtonComponent class="submit-btn" label="Создать" @click="onSubmit" />
  </q-page>
</template>

<script setup lang="ts">
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import DefaultButton from 'src/components/DefaultButton.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import InputComponent from 'src/components/InputComponent.vue'
import OptionButton from 'src/components/OptionButton.vue'
import { ref } from 'vue'

const prompt = ref<string>()
const additions = ref<string>()
const length = ref<number>()
const type = ref()

const onSubmit = () => {
  console.log(prompt.value, additions.value)
}
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: 20vw;
  padding-right: 20vw;

  .title {
    font-size: var(--font-size-title);
    font-weight: 600;
    text-align: center;
    margin-top: 100px;
  }

  .subtitle {
    font-size: var(--font-size-md);
    margin-top: 20px;
    padding-left: 5px;
  }

  .submit-btn {
    align-self: flex-end !important;
    margin-bottom: 50px;
    margin-right: 50px;
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
</style>
