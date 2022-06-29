<template>
  <a-menu
  @menuItemClick="onClickMenuItem"
  :default-selected-keys="menuList[0].key"
  >
    <a-menu-item v-for="menu in menuList" :key="menu.key">
      <div class="menu-item-inner">
        <component :is="menu.icon" size="20" class="menu-item-icon" />
        <span>{{ menu.title }}</span>
      </div>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
import menus from '../defination/menu';
import { reactive } from 'vue';
import useContentStore from '../store/content';
import {TodoItem} from "../defination/todo";

const menuList = reactive(menus);

const store = useContentStore();

const onClickMenuItem = (key: string) => {
  const menuItem = menus.find(m => m.key === key) || menus[0];
  store.changeActiveMenu(menuItem);
	store.setCurrentTodo({} as TodoItem);
}

</script>

<style lang="less" scoped>
.menu-item-icon {
  flex-shrink: 0;
  margin-left: 4px;
  margin-right: 12px !important;
}
.menu-item-inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
} 
</style>
