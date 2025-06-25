<template>
  <div :class="{ post: true, darken: darken }">
    <!-- <img v-if="image" :src="computedImageSrc" /> -->
    <div class="column content justify-between">
      <div>
        <p class="topic">{{ topic }}</p>
        <p v-if="text" class="text">{{ text }}</p>
        <div v-else class="space" />
      </div>

      <div>
        <p v-if="date" class="date">{{ moment(date).format('DD-MM-YYYY HH:mm') }}</p>
        <p v-else-if="!posting" class="date" style="text-decoration: underline">Перейти</p>
        <DefaultButton
          v-else
          style="align-self: flex-start; margin-top: var(--spacing-xs)"
          label="Опубликовать"
          @click="emits('publish')"
        />
        <DefaultButton
          v-if="date && posting"
          style="align-self: flex-start; margin-top: var(--spacing-xs)"
          label="Изменить"
          @click="emits('publish')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import DefaultButton from './DefaultButton.vue'
import { getPresignedUrl } from 'src/boot/aws'
import moment from 'moment'

const emits = defineEmits(['publish'])
// @ts-nocheck //

defineProps<{
  topic: string
  text: string
  date?: string
  posting?: boolean
  darken?: boolean
  // image?: string
}>()

// const computedImageSrc = ref()

// onMounted(() => {
//   if (image?.includes('images.s3.amazonaws.com')) {
//     // Assume the bucket key is the last segment of the URL
//     const key = image.split('/').at(-1)
//     console.log(key)
//     if (key) {
//       getPresignedUrl(key).then((res) => {
//         computedImageSrc.value = res
//       })
//     }
//   } else {
//     computedImageSrc.value = image
//   }
// })
</script>

<style lang="scss" scoped>
.post {
  background-color: rgba(255, 255, 255, 0.08);
  user-select: none;
  cursor: pointer;
  border-radius: 10px;

  .content {
    padding: var(--spacing-xs);
    height: 100%;
  }

  // img {
  //   width: 100%;
  //   object-fit: contain;
  //   border-top-right-radius: 10px;
  //   border-top-left-radius: 10px;
  // }

  .topic {
    font-size: var(--font-size-md);
    font-weight: 600;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .text {
    margin-top: var(--spacing-xxs);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: #b8b8b8;
    margin-bottom: 0px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .space {
    height: var(--spacing-md);
  }

  .date {
    margin-top: var(--spacing-xxs);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: #29c2e8;
  }
}

@media screen and (max-width: 576px) {
  .post {
    .topic {
      font-size: var(--font-size-lg);
    }

    .space {
      height: var(--spacing-sm);
    }

    .date {
      font-size: var(--font-size-md);
    }
  }
}

.darken {
  background-color: rgba(156, 156, 156, 0.05);
  color: #6e6e6e;

  .text {
    color: #6e6e6e;
  }
}
</style>
