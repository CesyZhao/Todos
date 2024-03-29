<template>
  <div class="content-list-wrapper">
    <h2>{{ activeMenu.title }}</h2>
    <a-input placeholder="回车即可创建任务" allow-clear @keydown.enter="addTodo" v-model="input">
      <template #prefix>
	      <priority-picker v-model="currentPriority"></priority-picker>
      </template>
      <template #suffix>
	      <date-picker v-model="dateConfig"></date-picker>
      </template>
    </a-input>
	  <div class="content-list-container">
		  <a-tree :data="todoList" class="todo-list" :checkable="true" @check="handleTodoStatusChange" :checked-keys="checkedKeys" ref="todoListRef" size="mini" block-node>
			  <template #switcher-icon>
				  <IconDown />
			  </template>
			  <template #title="node">
				  <div class="todo-title-wrapper" :class="getItemStyle(node)" @click="handleTodoClick(node)">
					  <input
							  ref="inputRef"
							  class="todo-title"
							  placeholder="请输入任务标题"
							  :class="{ bold: node.progress === undefined }"
							  :readonly="checkIsReadOnly(node)"
							  v-model="node.content "
							  @keydown.enter="addTodo('')"
							  @input="handleTodoChange(node)" />
					  <div class="todo-info" v-if="node.progress !== undefined">
						  <date-picker
								  :model-value="node"
								  @update:modelValue="handleTodoChange(node)"></date-picker>
						  <IconDelete @click="handleDelete(node)" class="icon-delete" size="16" />
					  </div>
				  </div>
			  </template>
		  </a-tree>
	  </div>
  </div>
</template>

<script lang="ts" setup>
import useContentStore from '../store/content';
import { computed, nextTick, ref, watch } from 'vue';
import { PriorityItem } from '../defination/priority';
import {IS_TODO_FINISHED, TodoItem} from '../defination/todo';
import { createUuid, getDisplayDate } from '../util';
import { Menu } from '../defination/menu';
import { formatDate } from '../util';
import { isString } from 'lodash';
import Todo from '../module/Todo';
import DatePicker from './DatePicker.vue';
import PriorityPicker from './PriorityPicker.vue';
import dayjs from "dayjs";

const store = useContentStore();

const activeMenu = computed(() => store.activeMenu);

const currentPriority = computed({
	get: () => store.chosenPriority,
	set: (priority) => {
		store.setChosenPriority(priority);
	},
});

const dateConfig = computed({
  get: () => store.dateConfig,
  set: (val) => store.setDateConfig(val)
});

const getItemStyle = (todo: TodoItem) => {
	const { progress } = todo;
	return progress === IS_TODO_FINISHED ? 'finished' : '';
};

const input = ref('');
const checkedKeys = ref<string[]>([]);
const todoList = computed(() => {
  const tree = [];
  checkedKeys.value = [];

  const finishedTodo = {
    key: 'finished',
    content: '已完成',
    children: [] as TodoItem[],
    checkable: false,
  }

	const overdueTodo = {
		key: 'overdue',
		content: '已逾期',
		children: [] as TodoItem[],
		checkable: false,
	}

  const todos: TodoItem[] = store.todoList.value || [];

  const tempMap = {} as Record<string, any>;
	const { activeMenu: { key } } = store;
  const isNotMenuDone = key !== Menu.Done;
  const isNotMenuDelete = key !== Menu.Deleted;

  for (const todo of todos) {
    const { endDate } = todo;
    if (todo.parentKey || (!todo.active && isNotMenuDelete)) continue;
    if (todo.progress === IS_TODO_FINISHED && isNotMenuDone) {
      checkedKeys.value.push(todo.key);
      finishedTodo.children.push(todo);
      continue;
    }
		const today = dayjs();
	  if (today.isAfter(dayjs(todo.endDate), 'day') && isNotMenuDone) {
		  overdueTodo.children.push(todo);
		  continue;
	  }
    if (!tempMap[endDate]) {
      tempMap[endDate] = []
    }
    tempMap[endDate].push(todo);
  }

  const entries = Object.entries(tempMap);

  for (const entry of entries) {
    const [date, list] = entry;
    if (list.length) {
      const groupTodo = {
        key: date,
        content: getDisplayDate(date),
        children: list,
        checkable: false,
      }
      tree.push(groupTodo);
    }
  }
	overdueTodo.children.length && tree.push(overdueTodo);
	finishedTodo.children.length && tree.push(finishedTodo);
	console.log(checkedKeys.value, '------')
  return tree;
});

const checkIsReadOnly = (todo: TodoItem) => {
  const { progress, active } = todo;
  return progress === undefined || progress === 100 || active === 0
}


const todoListRef = ref(null);
watch(todoList, () => {
  nextTick(() => {
    todoListRef.value.expandAll();
  })
})

const addTodo = (content: string) => {
	const todo = new Todo({
		priority: currentPriority.value,
		content: isString(content) ? content : input.value,
		...dateConfig.value,
	})
  store.addTodo(todo);
}

const handleTodoClick = (todo: TodoItem) => {
  if (todo.progress === undefined) return 
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

const handleTodoStatusChange = (checkedKeys: string[], event: any) => {
  const { checked, node } = event;
  node.progress = checked ? 100 : 0;
  store.updateTodo(node, node);
}

const handleTodoChange = (todo: TodoItem) => {
  store.updateTodo(todo, todo);
};

const handleDelete = (todo: TodoItem) => {
  store.updateTodo({ ...todo, active: 0  }, todo);
};

const getFormatDate = (date: string) => getDisplayDate(date);
</script>

<style lang="less">
.content-list-wrapper {
	height: calc(100vh - 48px);
  padding: 24px 24px 0;
	display: flex;
	flex-direction: column;
  .input-prefix {
    display: flex;
    align-items: center;
    height: 20px;
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
.todo-list {
  margin-top: 12px;
}
.todo-title-wrapper {
  display: flex;
  height: 28px;
  align-items: center;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
	&:hover {
		.icon-delete {
			display: block;
			margin-left: 8px;
		}
	}
  &.finished, &.deleted{
    color: #aaa;
    * {
      color: #aaa !important;
    }
  }
  .todo-title{
    // line-height: 36px;
    border: none;
    background: transparent;
    outline: none;
    color: #444;
    flex: 1;
  }
  .todo-info{
    height: 100%;
    font-size: 12px;
    display: flex;
    align-items: center;
    div {
      margin-right: 8px;
	    font-size: 11px;
	    color: #aaa;
    }
	  svg{
		  font-size: 11px;
		  display: none;
		  color:  var(--color-danger-light-4);
	  }
  }
  .title-icon {
    margin-right: 4px;
  }
  .bold {
    font-weight: 500;
  }
}
.todo-children {
  .todo-title-wrapper {
    padding-left: 20px;
  }
}
.content-list-container {
	flex: 1;
	overflow-y: auto;
}
</style>
