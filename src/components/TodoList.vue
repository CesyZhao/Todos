<template>
  <div class="todo-list">
    <todo-item
      v-for="todo in list"
      :todo="todo" :key="todo.key"
      @todo-click="(todo) => $emit('todoClick', todo)"
      @add-todo="(todo) => $emit('addTodo', todo)"
      @item-status-change="(e) => $emit('itemStatusChange', e)" />
  </div>
</template>

<script lang="ts" setup>
import { TodoItem as ITodoItem } from "../types/todo";
import TodoItem from './TodoItem.vue';
import { toRefs, watch } from 'vue';

interface Props {
  list: ITodoItem[]
}

const props = defineProps<Props>();
const { list } = toRefs(props);

watch(list, () => {
  console.log('changed-------');
})

console.log(list, '++++++++---');
</script>

<style lang="less" scoped>

</style>
