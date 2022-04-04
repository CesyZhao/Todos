<template>
  <a-layout class="content">
    <a-layout-sider :resize-directions="['right']" :width="360">
      <ContentList />
    </a-layout-sider>
    <a-layout-content>
      <ContentDetail />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import ContentList from './ContentList.vue';
import ContentDetail from './ContentDetail.vue';
import useContentStore from '../store/content';
import { computed } from 'vue';

const store = useContentStore();

const activeMenu = computed(() => store.activeMenu);
</script>

<style lang="less" scoped>
.content {
  background: transparent;
  * {
    background: transparent;
  }
}
</style>
