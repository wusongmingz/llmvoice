<template>
  <ACard class="card-body">
    <div class="card-box">
      <div class="card-text">
        <IFrame :url="urls" />
      </div>
    </div>
  </ACard>
</template>

<script setup lang="ts">
defineOptions({
  name: '/UsageGuide',
});
import IFrame from '@/layout/IFrame/IFrame.vue';
import { onMounted, ref } from 'vue';
const urls = ref('');
import { useEdit } from '../Home/hook/useEdit';
const { userAndPp } = useEdit();

onMounted(async () => {
  const res = await userAndPp();
  urls.value = res.usage_guide;
});
</script>

<style lang="scss" scoped>
.card-body {
  height: 100%;
  border: none;
  border-radius: 0px;
  .card-box {
    height: 100%;
    overflow: hidden;
    border: 0px;
    .card-text {
      // width: calc(100% + 90px);
      // height: calc(100% + 90px);
      height: 100%;
      margin: -5px 0px 0px -10px;
    }
  }
}
</style>
