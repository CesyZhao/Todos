import { defineStore } from 'pinia';
import menus, { Menu } from '../defination/menu';
import { MenuItem } from '../defination/menu';
import dayjs from 'dayjs';
import PriorityList, {Priority, PriorityItem} from '../defination/priority';
import { TodoItem } from '../defination/todo';
import { db } from '../util/db';
import { debounce } from 'lodash';
import { useObservable } from "@vueuse/rxjs";
import { Message } from '@arco-design/web-vue';
import {DateConfig} from "../defination/date";


export default defineStore({
  id: 'contentStore',

  state: () => {
    return {
      activeMenu: menus[0],
      dateConfig: { startDate: dayjs().format('YYYY-MM-DD') } as DateConfig,
      chosenPriority: PriorityList[PriorityList.length - 1].key,
      currentTodo: {} as TodoItem,
    }
  },

  getters: {
    todoList() {
      const { activeMenu } = this;
      const { key } = activeMenu as MenuItem;

       const handlerMap = new Map([
        [Menu.Today, db.getTodayTodos.bind(db)],
        [Menu.All, db.getAllTodos.bind(db)],
        [Menu.Last7Days, db.getLast7daysTodos.bind(db)],
        [Menu.Done, db.getFinishedTodos.bind(db)],
        [Menu.Deleted, db.getDeletedTodos.bind(db)],
        [Menu.Overview, db.getAllTodos.bind(db)],
      ])

      const result = handlerMap.get(key)?.() || db.getAllTodos.bind(db)();

      return useObservable(result as any);
    },
  },

  actions: {
    changeActiveMenu(menu: MenuItem) {
      this.activeMenu = menu;
    },

    setDateConfig(dateConfig: DateConfig) {
      this.dateConfig = dateConfig;
    },

    setChosenPriority(priority: Priority) {
      console.log(priority, '---------');
      this.chosenPriority = priority;
    },

    updateTodo: debounce((todo: TodoItem) => {
      db.todos.update(todo.key, todo)
        .then(() => {
          Message.success({
            content: '任务修改成功',
            position: 'bottom'
          })
        })
        .catch(() => {
          Message.error({
            content: '任务修改失败',
            position: 'bottom'
          })
        })
    }, 500),

    addTodo(todo: TodoItem) {
      // const list = this.todoListMap.get(date) || [];
      db.todos.add(todo)
        .then(() => {
          Message.success({
            content: '新建任务成功',
            position: 'bottom'
          })
        })
        .catch((err) => {
          Message.error({
            content: '新建任务失败',
            position: 'bottom'
          })
        })
    },

    setCurrentTodo(todo: TodoItem) {
      this.currentTodo = todo;
    }
  },
})