<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <p class="title">Генерация изображений</p>
      <FancyButtonComponent class="q-mt-lg" label="Сгенерировать изображение" @click="onSubmit" />
      <p class="subtitle">Текст поста</p>
      <InputComponent
        :model-value="text"
        label="Дополнительная информация"
        style="font-size: var(--font-size-sm)"
        :is-high="true"
        autogrow
        @update:model-value="text = $event"
      />
    </div>
    <FancyButtonComponent
      class="submit-btn"
      label="Отправить в очередь публикаций"
      @click="onSubmit"
    />
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

const text = ref<string>()

const onSubmit = () => {
  // console.log(prompt.value, additions.value)
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
}
</style>
