<template>
  <div class="content-detail-wrapper">
    <div class="empty" v-if="!currentTodo.key">
      点击任务查看任务详情
    </div>
    <template v-else>
      <div class="content-detail-header">
        <a-progress :color="color" :percent="currentTodo.progress" size="mini" class="title-icon" />
        <div class="content-detail-date">
          <IconCalendar />
          {{ date }}
        </div>
      </div>
      <div class="content-detail">
        <input class="content-detail-title" v-model="currentTodo.content" placeholder="请输入任务标题" />
        <a-textarea auto-size class="content-detail-description" v-model="currentTodo.description" placeholder="请输入任务描述" />
      </div>
      <todo-list :list="todoList" />
      <div class="fix-button">
        <a-button type="primary" @click="addTodo">
          <template #icon>
            <icon-plus />
          </template>
        </a-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { computed } from 'vue-demi';
import { Level } from '../contants/level';
import useContentStore from '../store/content';
import { generateList } from '../utils';
import TodoList from './TodoList.vue';

const store = useContentStore();

const currentTodo = computed(() => {
  return store.currentTodo;
})

const LevelColorMap = new Map([
  [Level.High, 'var(--color-danger-light-4)'],
  [Level.Medium, 'rgb(var(--orangered-4))'],
  [Level.Normal, 'var(--color-primary-light-4)'],
  [Level.Low, '#888888'],
]);

const color = LevelColorMap.get(currentTodo.value.level);

const date = computed(() => {
  return currentTodo.value.date === dayjs().format('YYYY-MM-DD') ? '今天' : dayjs(currentTodo.value.date).format('MM-DD');
})

const list = computed(() => {
  return store.todoListMap.get(currentTodo.value.date)?.value;
})

const addTodo = () => {
  const { value: todo } = currentTodo;

  const newTodo = {
    key: todo.date + '--' + ((list?.value.length || 0) + 1),
    level: todo.level,
    date: todo.date,
    content: '',
    progress: 0,
    parentKey: todo.key
  }

  store.addTodo(newTodo, currentTodo.value.date);
}

const todoList = computed(() => {
  const newList = generateList(list.value, currentTodo.value.key);
  console.log(newList, 'newList-------');
  return newList;
})

</script>

<style lang="less" scoped>
.content-detail {
  &-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px;
    .empty {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &-header {
    display: flex;
    margin-bottom: 24px;
  }
  &-date {
    margin-left: 16px;
  }
  &-title, &-description {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
  }
  &-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 24px;
  }
  &-description {
    &:hover {
      background: transparent;
    }
  }
}
.fix-button {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
</style>
