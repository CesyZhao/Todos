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
import { getDisplayDate } from '../utils';

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
  console.log(store.todoListMap, 'map-------');
  const dates = store.todoListMap.keys();

  for (const date of dates) {
    const groupTodo = {
      key: date,
      content: getDisplayDate(date),
      children: [],
    }
    const list = store.todoListMap.get(date)?.value || [];

    console.log(list, '++++++-----');
    for (const todo of list) {
      if (todo.parentKey) continue;
      if (todo.progress === 100) {
        finishedTodo.children.push(todo);
      } else {
        groupTodo.children.push(todo);
      }
    }

    groupTodo.children.length && tree.push(groupTodo);
  }
  if (finishedTodo.children.length) tree.push(finishedTodo);
  return tree;
});
const addTodo = () => {
  const list = store.todoListMap.get(date.value);

  const todo = {
    key: date.value + '--' + ((list?.length || 0) + 1),
    level: currentLevel.value,
    date: date.value,
    content: input.value,
    progress: 0
  }
  store.addTodo(todo, date.value)
}
const handleTodoClick = (todo: TodoItem) => {
  store.setCurrentTodo(todo);
}
const handleAddTodo = (todo: TodoItem) => {
  const list = store.todoListMap.get(date.value);
  const index = list.findIndex((item: TodoItem) => item.key === todo.key);
  const newTodo = {
    key: date.value + '--' + ((list?.length || 0) + 1),
    level: todo.level,
    date: todo.date,
    content: '',
    progress: 0
  }
  store.addTodo(newTodo, date.value, index);
  handleTodoClick(newTodo);
}

const handleTodoStatusChange = ({ todo }) => {
  console.log(todo, '+++++++')
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
