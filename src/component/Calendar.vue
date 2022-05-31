<template>
  <div class="calander-wrapper">
    <FullCalendar :options="opts" />
  </div>
</template>

<script lang="ts" setup>
import '@fullcalendar/core/vdom'; // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import cnLocale from '@fullcalendar/core/locales/zh-cn'
import interactionPlugin from '@fullcalendar/interaction';
import { ref, watch, nextTick, computed } from 'vue';
import { TodoItem } from '../defination/todo';
import { PriorityColorMap } from '../defination/priority';

interface Props {
  todoList: TodoItem[];
}

const props = defineProps<Props>();

const opts = computed(() => {
  return {
    height: '100%',
    plugins: [ dayGridPlugin, interactionPlugin ],
    locale: cnLocale,
    initialView: 'dayGridMonth',
    eventBackgroundColor: '#aaa',
    eventBorderColor: 'transparent',
    dayMaxEventRows: 3,
    events: props.todoList,
    moreLinkClick: handleMoreClick,
    eventsSet: rendeEventsBackground
  }
})

const handleMoreClick = () => {
  setTimeout(() => rendeEventsBackground(document.querySelector('.fc-popover-body')));
}

const rendeEventsBackground = (wrapper: any) => {
  wrapper = Array.isArray(wrapper) ? document : wrapper;
  nextTick(() => {
    for (const item of props.todoList) {
      const dom = wrapper.querySelector(`.${item.className}`);
      const div = document.createElement('div');
      div.style = `position: absolute; left: 0; top: 0; width: ${item.progress}%; height: 100%; background: ${PriorityColorMap.get(item.level)}`
      dom?.appendChild(div);
    }
  })
}

// const handleDayCellMount = ({ el }) => {

// }

// watch(() => props.todoList, (newList) => {
//   renderBackground(document);
// })

</script>

<style lang="less">
.calander-wrapper {
  padding: 24px;
  height: 100%;
  flex: 1;
}
.fc-event {
  border: none !important;
  border-radius: 2px !important;
  overflow: hidden !important;
}
</style>