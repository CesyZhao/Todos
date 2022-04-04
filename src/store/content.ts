import { defineStore } from 'pinia';
import menus, { Menu } from '../contants/menu';
import { MenuItem } from '../types/menu';
import dayjs from 'dayjs';
import levels from '../contants/level';
import { LevelItem } from '../types/level';
import { TodoItem } from '../types/todo';
import { db } from '../utils/db';
import { groupBy, map } from 'lodash';
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";


export default defineStore({
  id: 'contentStore',

  state: () => {
    return {
      activeMenu: menus[0],
      chosenDate: dayjs().format('YYYY-MM-DD'),
      chosenLevel: levels[levels.length - 1],
      currentTodo: {} as TodoItem,
    }
  },

  getters: {
    todoListMap() {
      const { activeMenu } = this;
      const { key } = activeMenu;

      const map = new Map();

      const handlerMap = new Map([
        [Menu.Today, db.getTodayTodos.bind(db)],
        [Menu.Last7Days, db.getLast7daysTodos.bind(db)],
        [Menu.Done, db.getFinishedTodos],
        [Menu.Abandon, db.getDeletedTodos],
        [Menu.Overview, db.getAllTodos],
      ])
      const date = dayjs().format('YYYY-MM-DD');

      const todos = handlerMap.get(key)?.() || [];

      console.log(todos, '+++++++')

      // const groupedList = groupBy(todos, 'date');

      // console.log(groupedList, 'todos++++++++')

      // for (const key in groupedList) {
      //   map.set(key, groupedList[key]);
      // }
      return map;
    }
  },

  actions: {
    changeActiveMenu(menu: MenuItem) {
      this.activeMenu = menu;
    },
    setChosenDate(date: string) {
      this.chosenDate = date
    },
    setChosenLevel(level: LevelItem) {
      this.chosenLevel = level
    },
    updateTodo(todo) {
      db.todos.update(todo.key, todo);
    },
    addTodo(todo: TodoItem, date: string, index?: number) {
      // const list = this.todoListMap.get(date) || [];
      db.todos.add(todo);
      // index ? list.splice(index + 1, 0, todo) : list.push(todo);
      // this.todoListMap.set(date, list);
    },
    setCurrentTodo(todo: TodoItem) {
      this.currentTodo = todo;
    }
  },
})