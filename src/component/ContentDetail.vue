<template>
  <div class="content-detail-wrapper">
    <div class="empty" v-if="!currentTodo.key">
      点击任务查看任务详情
    </div>
    <template v-else>
      <div class="content-detail">
	      <div class="title-container">
		      <a-checkbox class="todo-checkbox" :indeterminate="indeterminate"></a-checkbox>
		      <input class="content-detail-title" v-model="currentTodo.content" placeholder="请输入任务标题" @input="handleTodoChange" />
	      </div>
	      <div class="content-detail-header">
		      <date-picker :model-value="currentTodo" @update:modelValue="handleDateConfigChange"></date-picker>
		      <priority-picker :model-value="currentTodo.priority" @update:modelValue="handlePriorityChange"></priority-picker>
	      </div>
      </div>
	    <div class="content">
		    <div id="richText"></div>
		    <a-tree
				    class="todo-list"
				    :data="todoList"
				    :checkable="true"
				    :checked-keys="checkedKeys"
				    @check="handleSubTodoCheck"
				    ref="todoListRef" size="mini" block-node>
			    <template #title="node">
				    <div class="todo-title-wrapper">
					    <input
							    ref="inputRef"
							    class="todo-title"
							    placeholder="请输入任务标题"
							    :class="{ bold: node.progress === undefined }"
							    v-model="node.content "
							    @keydown.enter="addTodo('')"
							    @input="handleSubTodoChange(node)" />
					    <div class="todo-info" v-if="node.progress !== undefined">
						    <IconDelete @click="handleDelete(node)" class="icon-delete" size="16" />
					    </div>
				    </div>
			    </template>
		    </a-tree>
	    </div>
      <div class="fix-button">
        <a-progress :color="color" size="mini" :percent="currentTodo.progress" class="title-icon" type="circle" />
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
import { computed, nextTick, watch } from 'vue-demi';
import {Priority, PriorityColorMap} from '../defination/priority';
import useContentStore from '../store/content';
import { TodoItem } from '../defination/todo';
import {getDisplayDate} from '../util';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'
import PriorityPicker from './PriorityPicker.vue';
import DatePicker from './DatePicker.vue';
import {DateConfig} from "../defination/date";
import Todo from "../module/Todo";

const store = useContentStore();

const currentTodo = computed({
	get: () => store.currentTodo,
	set: (todo) => store.updateTodo(todo),
})


const color = computed(() => PriorityColorMap.get(currentTodo.value.priority));

const date = computed(() => {
	const { startDate } = currentTodo.value;
  return getDisplayDate(startDate);
});

const list = computed(() => {
  return store.todoList.value;
});

const addTodo = (parentTodo: TodoItem) => {

  const todo = parentTodo.key ? parentTodo : currentTodo.value;

	const subTodo = new Todo({...todo, content: '',  parentKey: todo.key});

  store.addTodo(subTodo);
};

const todoList = computed(() => {
  return list.value.filter((todo: TodoItem) => {
		return todo.parentKey === currentTodo.value.key;
  });
});
const checkedKeys = computed(() => {
	const keys = todoList.value
			.filter((todo: TodoItem) => todo.progress === 1)
			.map((todo: TodoItem) => {
				return todo.key;
			});
	return keys;
});
const indeterminate = computed(() => {
	return checkedKeys.value.length && checkedKeys.value.length !== todoList.value.length;
});

const handleTodoChange = () => {
  store.updateTodo(currentTodo.value, currentTodo.value);
};

const handleSubTodoChange = (todo: TodoItem) => {
	store.updateTodo(todo, todo);
};
const handleSubTodoCheck = (keys: Array<string>, data: any) => {
	const { node } = data;
	store.updateTodo({ ...node, progress: +data.checked }, node);
	store.updateTodo({ ...currentTodo.value, progress: keys.length / todoList.value.length }, currentTodo.value);
};

const handleDateConfigChange = (dateConfig: DateConfig) => {
	store.updateTodo({ ...currentTodo.value, ...dateConfig }, currentTodo.value);
};

const handlePriorityChange = (priority: Priority) => {
	store.updateTodo({ ...currentTodo.value, priority }, currentTodo.value);
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
      });
			quill.on('text-change', (delta: any, oldContent: any, source: string) => {
				source === 'user' && store.updateTodo({ ...currentTodo.value, description: JSON.stringify(quill.getContents()) }, currentTodo.value );
			})
    }
    quill.setContents(JSON.parse(currentTodo.value.description));
  })
})

</script>

<style lang="less">
.content-detail {
  &-wrapper {
    height: 100vh;
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
	.title-container {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
	}
	.todo-checkbox {
		margin-left: 0;
		padding-left: 0;
		margin-right: 8px;
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
    //margin-bottom: 12px;
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
.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
}
</style>
