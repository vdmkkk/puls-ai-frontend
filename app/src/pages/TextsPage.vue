<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <p class="title">Генерация текстов вне контент-плана</p>
      <InputComponent
        :model-value="prompt"
        label="О чем пост"
        style="font-size: var(--font-size-md)"
        @update:model-value="prompt = $event"
      />
      <InputComponent
        :model-value="additions"
        label="Дополнительная информация"
        style="font-size: var(--font-size-md)"
        has-voice
        @update:model-value="additions = $event"
      />
      <DefaultButton label="Сохранить" @click="onSubmit" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import DefaultButton from 'src/components/DefaultButton.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import InputComponent from 'src/components/InputComponent.vue'
import { ref } from 'vue'

const prompt = ref<string>()
const additions = ref<string>()

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

  .containers {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 30px;
    .container {
      width: -webkit-fill-available;
    }
  }
}
</style>
