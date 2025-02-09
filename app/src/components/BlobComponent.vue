<template>
  <div class="blobs">
    <img :src="blobs[0]" class="blob1" />
    <img :src="blobs[1]" class="blob2" />
  </div>
</template>

<script setup lang="ts">
import blob1 from 'src/assets/svg/blob1.png'
import blob2 from 'src/assets/svg/blob2.png'
import blob3 from 'src/assets/svg/blob3.png'
import blob4 from 'src/assets/svg/blob4.png'

const blob1Rotation = Math.random() * 360
const blob2Rotation = Math.random() * 360
const blobs = [blob1, blob2, blob3, blob4].sort(() => 0.5 - Math.random()).slice(0, 2)
</script>

<style lang="scss" scoped>
.blobs {
  position: absolute;
  width: -webkit-fill-available;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  overflow: hidden;
  height: calc(100vh - 80px);

  img {
    width: 45vw;
  }

  .blob1 {
    transform: rotate(calc(v-bind(blob1Rotation) * 1deg));
  }

  .blob2 {
    transform: rotate(calc(v-bind(blob2Rotation) * 1deg));
    margin-top: 20vh;
  }
}
</style>
