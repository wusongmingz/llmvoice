<template>
  <el-menu
    router
    :mode="themeStore.menuMode"
    :class="themeStore.menuMode + '-menu'"
    :collapse="isCollapse"
    :defaultActive="defaultActive"
    @select="menuSelect"
    class="vertical-menu"
  >
    <div class="vertical-menu-div">
      <template v-for="menuItem in menuList" :key="menuItem.name">
        <el-menu-item
          v-if="!(menuItem.children && menuItem.children.length > 0) && !menuItem.meta?.hidden && menuItem.meta?.title != '天元语音模型网关'"
          :index="menuItem.path"
        >
          <el-icon style="flex: 1" :size="20" class="icon-color"> <AIcon :icon="menuItem.meta?.icon ?? 'icon-modular'" /> </el-icon>
          <template #title
            ><span style="flex: 2">{{ menuItem.meta?.title }}</span></template
          >
        </el-menu-item>
        <el-menu-item
          v-if="!(menuItem.children && menuItem.children.length > 0) && !menuItem.meta?.hidden && menuItem.meta?.title == '天元语音模型网关'"
          :index="menuItem.path"
          class="vertical-menu-span"
        >
          <!-- <el-icon :size="20" class="icon-color"> <AIcon :icon="menuItem.meta?.icon ?? 'icon-modular'" /> </el-icon> -->
          <template #title
            ><div>{{ menuItem.meta?.title }}</div></template
          >
        </el-menu-item>
        <el-sub-menu v-if="menuItem.children && menuItem.children.length > 0 && !menuItem.meta?.hidden" :index="menuItem.path">
          <template #title>
            <el-icon> <AIcon :icon="menuItem.meta?.icon ?? 'icon-modular'" /> </el-icon>
            <span>{{ menuItem.meta?.title }}</span>
          </template>
          <MenuItem :menuList="menuItem.children" />
        </el-sub-menu>
      </template>
    </div>
    <!-- <div class="vertical-menu-more">
      <div class="vertical-menu-more-text">更多版本</div>
      <img src="@/assets/image/home/mass.png" />
    </div> -->
  </el-menu>
</template>

<script setup lang="ts">
import MenuItem from './MenuItem.vue';
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from '@/store/modules/theme';

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore();

const menuList = computed(() => {
  for (const route of router.getRoutes()) {
    if (route.name === '/views') return route.children || [];
  }
  return [];
});
const defaultActive = computed(() => {
  return route.path;
});
const isCollapse = ref(false);

const menuSelect = () => {
  if (themeStore.isSmallDevice) themeStore.isExpand = false;
};
</script>

<style lang="scss" scoped>
.vertical-menu {
  border-right: none;
  display: flex;
  flex-direction: column;
  width: var(--layout-menu-width);
  height: calc(100% - 10px);
  overflow-y: auto;
  overflow-x: hidden;
  // background: var(--layout-menu-bg-color);
  background: url('@/assets/image/home/menubgi.png');

  background-size: 100% 100%;
  border-radius: 20px;
  // 取消圆角
  // border-radius: 25px;

  transition: background-color var(--el-transition-duration);
  // border: 1px solid #d7d7d7;
  :deep(.el-sub-menu__icon-arrow) {
    right: 20px;
  }
  :deep(.el-menu-item.is-active) {
    position: relative;
    color: #fff;
    background-color: var(--el-menu-active-bg-color);
    &:hover {
      // background-color: var(--el-menu-active-bg-color);
      color: #ffffff;
    }
  }
  :deep(.el-menu-item.vertical-menu-span) {
    margin-top: 15px;
    color: var(--el-menu-text-color);
    font-size: 20px;
    &:hover {
      // color: rgb(89, 87, 87);
      background: transparent;
      font-size: 20px;
    }
  }
  :deep(.el-menu-item.is-active.vertical-menu-span) {
    background-color: var(--layout-menu-item-bg-color);
    color: var(--el-menu-active-bg-color);
    font-size: 20px;
  }
  :deep(.el-menu-item) {
    border-top: 15px solid var(--layout-menu-border-color);
    border-bottom: 15px solid var(--layout-menu-border-color);
    border-left: 5px solid var(--layout-menu-border-color);
    border-right: 5px solid var(--layout-menu-border-color);
    // margin: 15px 5px !important;
    border-top-left-radius: 10px 10px; //左上角
    border-top-right-radius: 10px 10px; //右上角
    border-bottom-left-radius: 10px 10px; //左下角
    border-bottom-right-radius: 10px 10px; //右下角
    margin: 0px 5px;
    // height: 70px;
    height: 40px;
    margin-bottom: 30px;
    :last-child {
      margin-bottom: 0;
    }
    // background-color: var(--layout-menu-item-bg-color);
    // border-radius: 25px;
    transition: border-bottom-color var(--el-transition-duration), background-color var(--el-transition-duration) !important;
    display: flex;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    transition: all 0.2s;
    &:hover {
      // background-color: var(--layout-menu-item-hover-bg-color);
      background: linear-gradient(to right, #fff 0, #c6d7f9 50%, #fff 100%);
      color: #333 !important;
      // color: var(--el-menu-active-color);
    }
  }
  :deep(.el-sub-menu__title) {
    border-bottom: 2px solid var(--layout-menu-border-color) !important;
    background-color: var(--layout-menu-sub-bg-color);
    transition: border-bottom-color var(--el-transition-duration), background-color var(--el-transition-duration) !important;
    &:hover {
      background-color: var(--layout-menu-sub-hover-bg-color);
      color: var(--el-menu-active-color);
    }
  }
}
.vertical-menu::-webkit-scrollbar {
  width: 0px;
}
.vertical-menu-div {
  padding-top: 15px;
  // background-color: #edf1f4;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}
.icon-color {
  color: #409eff;
}
.horizontal-menu {
  width: 100%;
  height: 100%;
  border-bottom: 0;
}
.el-menu--collapse {
  width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2);
}
.vertical-menu-more {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  height: var(--layout-menu-width);
  flex: 1;
  background: url('@/assets/image/home/mass2.png') no-repeat;
  background-size: 100% 150px;
  background-position-y: center;
  bg .vertical-menu-more-text {
    width: 100px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    margin-top: 30px;
    color: #016fa0;
    &:hover {
      color: var(--el-menu-active-bg-color);
      cursor: pointer;
    }
  }
  img {
    height: var(--layout-menu-width);
  }
}
</style>
