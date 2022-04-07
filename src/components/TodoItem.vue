<template>
  <div class="todo-item" :class="{ finished: todo.progress === 100, deleted: todo.active === 0 }">
    <div class="todo-title-wrapper" @click.stop="$emit('todoClick', todo)">
      <icon-down v-if="isCategory" class="title-icon" size="16" />
      <template v-else>
        <!-- <a-progress v-if="todo.children?.length" :color="color" :percent="todo.progress" size="mini" class="title-icon" /> -->
        <icon-mind-mapping @click.stop="$emit('addSubTodo', todo)" />
        <a-checkbox class="title-icon" @change="handleTodoChange" :value="100" v-model="todo.progress"></a-checkbox>
      </template>
      <input
        ref="inputRef"
        class="todo-title"
        placeholder="请输入任务标题"
        :class="{ bold: isCategory }"
        :readonly="isCategory"
        v-model="todo.content " 
        @keydown.enter="$emit('addTodo', todo)"
        @input="handleTodoChange" />
      <div class="todo-info" v-if="!isCategory">
        <div>{{ date }}</div>
        <IconDelete @click="handleDelete" />
      </div>
    </div>
    <div class="todo-children" v-if="todo.children?.length">
      <todo-item
        v-for="t in todo.children"
        :key="t.key"
        :todo="t" @todo-click="(todo) => $emit('todoClick', todo)"
        @add-todo="(todo) => $emit('addTodo', todo)"
        @add-sub-todo="(todo) => $emit('addSubTodo', todo)"
        @item-status-change="(e) => $emit('itemStatusChange', e)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Level } from "../contants/level";
import { TodoItem as ITodoItem } from "../types/todo";
import { computed, toRefs, onMounted, ref, defineEmits, watch } from 'vue';
import dayjs from "dayjs";

interface Props {
  todo: ITodoItem;
}

const emit = defineEmits(['itemStatusChange']);

const props = defineProps<Props>();

const { todo } = toRefs(props);

const inputRef = ref(null);

onMounted(() => {
  if (!todo.value.content) {
    inputRef.value.focus();
  }
})

const LevelColorMap = new Map([
  [Level.High, 'var(--color-danger-light-4)'],
  [Level.Medium, 'rgb(var(--orangered-4))'],
  [Level.Normal, 'var(--color-primary-light-4)'],
  [Level.Low, '#888888'],
]);


const color = LevelColorMap.get(todo.value.level);

const isCategory = todo.value.progress === undefined;

const date = computed(() => {
  return todo.value.date === dayjs().format('YYYY-MM-DD') ? '今天' : dayjs(todo.value.date).format('MM-DD');
})

// watch(todo, () => {
//   emit('itemStatusChange', { todo: todo.value })
// }, { deep: true })

const handleTodoChange = () => {
   emit('itemStatusChange', { todo: todo.value })
}

const handleDelete = () => {
  emit('itemStatusChange', { todo: { ...todo.value, active: 0  }})
}

</script>

<style lang="less" scoped>
.todo-item {
  position: relative;
  &.finished, &.deleted{
    color: #aaa;
    .todo-title {
      color: #aaa !important;
    }
  }
  .todo-title-wrapper {
    display: flex;
    height: 28px;
    align-items: center;
    cursor: pointer;
    padding: 0 4px;
    &:hover {
      background: #fff;
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
}
</style>
