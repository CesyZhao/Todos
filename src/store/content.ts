import { defineStore } from 'pinia';
import menus, { Menu } from '../defination/menu';
import { MenuItem } from '../defination/menu';
import dayjs from 'dayjs';
import PriorityList, { PriorityItem } from '../defination/priority';
import { TodoItem } from '../defination/todo';
import { db } from '../util/db';
import { groupBy, map, debounce } from 'lodash';
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { Message } from '@arco-design/web-vue';


export default defineStore({
  id: 'contentStore',

  state: () => {
    return {
      activeMenu: menus[0],
      chosenDate: dayjs().format('YYYY-MM-DD'),
      chosenPriority: PriorityList[PriorityList.length - 1],
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
    setChosenPriority(priority: PriorityItem) {
      this.chosenPriority = priority
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
    addTodo(todo: TodoItem, date: string, index?: number) {
      console.log(todo, '--------')
      // const list = this.todoListMap.get(date) || [];
      db.todos.add(todo)
        .then(() => {
          Message.success({
            content: '新建任务成功',
            position: 'bottom'
          })
        })
        .catch((err) => {
          console.log(err);
          Message.error({
            content: '新建任务失败',
            position: 'bottom'
          })
        })
      // index ? list.splice(index + 1, 0, todo) : list.push(todo);
      // this.todoListMap.set(date, list);
    },
    setCurrentTodo(todo: TodoItem) {
      this.currentTodo = todo;
    }
  },
})