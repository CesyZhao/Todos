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

    todoList() {
      const { activeMenu } = this;
      const { key } = activeMenu;

       const handlerMap = new Map([
        [Menu.Today, db.getTodayTodos.bind(db)],
        [Menu.Last7Days, db.getLast7daysTodos.bind(db)],
        [Menu.Done, db.getFinishedTodos.bind(db)],
        [Menu.Deleted, db.getDeletedTodos.bind(db)],
        [Menu.Overview, db.getAllTodos.bind(db)],
      ])

      const result = handlerMap.get(key)?.();

      return useObservable(result);
      
    },
    todoListMap() {
      const { activeMenu } = this;
      const { key } = activeMenu;

      const map = new Map();

      // const handlerMap = new Map([
      //   [Menu.Today, db.getTodayTodos.bind(db)],
      //   [Menu.Last7Days, db.getLast7daysTodos.bind(db)],
      //   [Menu.Done, db.getFinishedTodos],
      //   [Menu.Abandon, db.getDeletedTodos],
      //   [Menu.Overview, db.getAllTodos],
      // ])
      // const date = dayjs().format('YYYY-MM-DD');

      // const todos = handlerMap.get(key)?.() || [];



      const date = dayjs().format('YYYY-MM-DD');
      const result = liveQuery(() => {
        return db.todos
        .where("date").equals(date)
        .toArray();
      });
      const todos = useObservable(result as any);

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
    updateTodo(todo: TodoItem) {
      if (todo.progress === true) { todo.progress = 100 };
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