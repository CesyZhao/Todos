<template>
  <div class="content-list-wrapper">
    <h2>{{ activeMenu.title }}</h2>
    <a-input placeholder="回车即可创建任务" allow-clear @keydown.enter="addTodo" v-model="input">
      <template #prefix>
        <a-popover trigger="click" position="bl" :arrow-style="{ display: 'none' }" ref="levelPop">
          <div class="input-prefix">
            <icon-highlight class="icon" :class="currentLevel" />
          </div>
          <template #content>
            <div class="level-wrapper">
              <div v-for="level in levelList" :key="level.key" :class="level.key" class="level-item" @click="handleLevelChange(level)">
                <icon-highlight class="icon level" />
                {{ level.title }}
              </div>
            </div>
          </template>
        </a-popover>
      </template>
      <template #suffix>
        <a-date-picker
          position="tr"
          v-model="date"
        >
          <div class="icon icon-calendar">
            <icon-calendar  size="14" />
            <span>{{ displayDaye }}</span>
          </div> 
        </a-date-picker>
      </template>
    </a-input>
    <!-- {{ todoList1 }} -->
    <todo-list :list="todoList" @todo-click="handleTodoClick" @add-todo="handleAddTodo" @item-status-change="handleTodoStatusChange" />
    <!-- <a-tree :data="todoList" show-line class="todo-list">
      <template #switcher-icon>
        <IconDown />
      </template>
      <template #title="node">
        {{ node.content }}
      </template>
    </a-tree> -->
  </div>
</template>

<script lang="ts" setup>
import useContentStore from '../store/content';
import { computed, reactive, ref, watch } from 'vue';
import levels from '../contants/level';
import dayjs from 'dayjs';
import { LevelItem } from '../types/level';
import { TodoItem } from '../types/todo';
import TodoList from './TodoList.vue';
import { createUuid, getDisplayDate } from '../utils';
import menus, { Menu } from '../contants/menu';

const store = useContentStore();

const activeMenu = computed(() => store.activeMenu);

const levelPop = ref(null);
const levelList = reactive(levels);
const handleLevelChange = (level: LevelItem) => {
  store.setChosenLevel(level);
  levelPop.value?.handlePopupVisibleChange(false);
}
const currentLevel = computed(() => store.chosenLevel.key);

const date = computed({
  get: () => store.chosenDate,
  set: (val) => store.setChosenDate(val)
});
const displayDaye = computed(() => {
  return getDisplayDate(date.value);
})

const input = ref('');
const todoList = computed(() => {
  const tree = [];

  const processingTodo = {
    key: 'processing',
    content: '未完成',
    children: [] as TodoItem[],
  };

  const finishedTodo = {
    key: 'finished',
    content: '已完成',
    children: [] as TodoItem[],
  }

  const todos: TodoItem[] = store.todoList.value || [];

  console.log(todos, 'todos------');

  const tempMap = {} as Record<string, any>;
  const isNotMenuDone = store.activeMenu.key !== Menu.Done;
  const isNotMenuDelete = store.activeMenu.key !== Menu.Deleted;
  for (const todo of todos) {
    if (todo.parentKey || (!todo.active && isNotMenuDelete)) continue;
    if (todo.progress === 100 && isNotMenuDone) {
      finishedTodo.children.push(todo);
      continue;
    }
    if (!tempMap[todo.date]) {
      tempMap[todo.date] = []
    }
    tempMap[todo.date].push(todo);
  }
  const entries = Object.entries(tempMap);
  for (const entry of entries) {
    const [date, list] = entry;
    if (list.length) {
      const groupTodo = {
        key: date,
        content: getDisplayDate(date),
        children: list,
      }
      tree.push(groupTodo);
    }
  }

  finishedTodo.children.length && tree.push(finishedTodo);

  return tree;
});
const addTodo = () => {

  const todo = {
    key: createUuid(),
    level: currentLevel.value,
    date: date.value,
    content: input.value,
    progress: 0,
    active: 1
  }
  store.addTodo(todo, date.value)
}
const handleTodoClick = (todo: TodoItem) => {
  store.setCurrentTodo(todo);
}
const handleAddTodo = (todo: TodoItem) => {
  const newTodo = {
    key: createUuid(),
    level: todo.level,
    date: todo.date,
    content: '',
    progress: 0,
    active: 1
  }
  store.addTodo(newTodo, date.value);
  handleTodoClick(newTodo);
}

const handleTodoStatusChange = ({ todo }) => {
  store.updateTodo(todo);
}
</script>

<style lang="less">
.content-list-wrapper {
  padding: 24px;
  .input-prefix {
    display: flex;
    align-items: center;
    height: 20px;
  }
  .icon {
    cursor: pointer;
    &.high {
      color: var(--color-danger-light-4);
    }
    &.medium {
      color: rgb(var(--orangered-4));
    }
    &.normal {
      color: var(--color-primary-light-4);
    }
  }
  .icon-calendar {
    height: 20px;
    line-height: 24px;
    margin-left: 8px;
    font-size: 10px;
    display: flex;
    align-items: center;
    span {
      margin-left: 4px;
    }
  }
}
.level-wrapper {
  display: flex;
}
.level-item {
  font-size: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &.high {
    color: var(--color-danger-light-4);
  }
  &.medium {
    color: rgb(var(--orangered-4));
  }
  &.normal {
    color: var(--color-primary-light-4);
  }
}
.level{
  margin:0 16px;
  font-size: 16px;
}
.todo-list {
  margin-top: 12px;
}
</style>
