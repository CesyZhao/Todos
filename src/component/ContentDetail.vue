<template>
  <div class="content-detail-wrapper">
    <div class="empty" v-if="!currentTodo.key">
      点击任务查看任务详情
    </div>
    <template v-else>
      <div class="content-detail">
        <input class="content-detail-title" v-model="currentTodo.content" placeholder="请输入任务标题" @input="handleTodoChange" />
	      <div class="content-detail-header">
		      <date-picker :model-value="currentTodo" @update:modelValue="handleDateConfigChange"></date-picker>
		      <priority-picker :model-value="currentTodo.priority" @update:modelValue="handlePriorityChange"></priority-picker>
	      </div>
        <div id="richText"></div>
      </div>
      <div class="fix-button">
        <a-progress :color="color" :percent="currentTodo.progress" class="title-icon" type="circle" />
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
import { computed, nextTick, onMounted, watch } from 'vue-demi';
import {Priority, PriorityColorMap} from '../defination/priority';
import useContentStore from '../store/content';
import { TodoItem } from '../defination/todo';
import {createUuid, generateList, getDisplayDate} from '../util';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'
import PriorityPicker from './PriorityPicker.vue';
import DatePicker from './DatePicker.vue';
import {DateConfig} from "../defination/date";

const store = useContentStore();

const currentTodo = computed({
	get: () => store.currentTodo,
	set: (todo) => store.updateTodo(todo),
})


const color = PriorityColorMap.get(currentTodo.value.level);

const date = computed(() => {
	const { startDate, endDate } = currentTodo.value;
  return getDisplayDate(startDate);
})

const list = computed(() => {
  return store.todoList.value;
})

const addTodo = (parentTodo: TodoItem) => {

  const todo = parentTodo.key ? parentTodo : currentTodo.value;

  const newTodo = {
    key: createUuid(),
    level: todo.level,
    date: todo.date,
    content: '',
    progress: 0,
    parentKey: todo.key,
    active: 1
  }

  store.addTodo(newTodo, currentTodo.value.date);
}

const todoList = computed(() => {
  const newList = generateList(list.value, currentTodo.value.key);
  return newList;
})

const handleTodoChange = () => {
  store.updateTodo(currentTodo.value);
};

const handleDateConfigChange = (dateConfig: DateConfig) => {
	Object.assign(currentTodo.value, dateConfig);
	handleTodoChange();
};

const handlePriorityChange = (priority: Priority) => {
	Object.assign(currentTodo.value, { priority });
	handleTodoChange();
};

let quill;

watch(currentTodo, () => {
  nextTick(() => {
    if (!quill) {
      const container = document.getElementById('richText');
      quill = new Quill(container, {
        modules: {
          toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              ['image', 'code-block']
            ]
          },
        placeholder: '请输入任务描述',
        theme: 'snow'
      })
    }
    quill.setText(currentTodo.value.description || '' + '\n');
  })
})

</script>

<style lang="less">
.content-detail {
  &-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px;
    box-sizing: border-box;
    .empty {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &-header {
    display: flex;
	  justify-content: space-between;
    margin-bottom: 12px;
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
    margin-bottom: 12px;
  }
  &-description {
    &:hover {
      background: transparent;
    }
  }
}
.todo-list {
  flex: 1;
}
.fix-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ql-toolbar {
  // margin: 0  -24px;
  border: none !important;
  border-top: 1px solid #eee !important;
  border-bottom: 1px solid #eee !important;
}
#richText {
  border: none;
}
</style>
