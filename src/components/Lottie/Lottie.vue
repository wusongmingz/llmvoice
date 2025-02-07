<template>
  <div id="lottieId" :style="styles"></div>
</template>

<script setup lang="ts">
import Lottie, { AnimationConfigWithData, AnimationConfigWithPath, RendererType } from 'lottie-web';
import { onMounted, onUnmounted, ref } from 'vue';
const { animationOptions, styles } = defineProps<{
  animationOptions: AnimationConfigWithPath<RendererType> | AnimationConfigWithData<RendererType>;
  styles?: any;
}>();
const lottie = ref();
onMounted(() => {
  lottie.value = Lottie.loadAnimation({
    renderer: 'svg',
    loop: true,
    autoplay: true,
    ...animationOptions,
    container: document.getElementById('lottieId'),
  });
});
onUnmounted(() => {
  lottie.value.destroy();
});
</script>
<style lang="less"></style>
