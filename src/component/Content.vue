<template>
  <a-layout class="content" v-if="!isOverview">
    <a-layout-sider :resize-directions="['right']" :width="420">
      <ContentList />
    </a-layout-sider>
    <a-layout-content>
      <ContentDetail />
    </a-layout-content>
  </a-layout>
  <!-- <div>11111</div> -->
  <Calendar :todo-list="todoList" v-else-if="todoList" />
</template>

<script lang="ts" setup>
import ContentList from './ContentList.vue';
import ContentDetail from './ContentDetail.vue';
import Calendar from './Calendar.vue';
import useContentStore from '../store/content';
import { computed, ref } from 'vue';
import { Menu } from '../defination/menu';
import { TodoItem } from '../defination/todo';

const store = useContentStore();

const activeMenu = computed(() => store.activeMenu);


const isOverview = computed(() => activeMenu.value.key === Menu.Overview);

const todoList = computed(() => {
  return store.todoList.value?.filter((item: TodoItem) => {
    return !item.parentKey
  })
  .map((item: TodoItem) => {
    const { content, startDate, endDate, key, progress, priority } = item;
    return {
			key,
      title: content,
	    startDate,
	    endDate,
      className: `className-${key}`,
      progress,
	    priority
    }
  });
})

</script>

<style lang="less" scoped>
.content {
  background: transparent;
  * {
    background: transparent;
  }
}
</style>
