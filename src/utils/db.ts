import { useObservable } from '@vueuse/rxjs';
import dayjs from 'dayjs';
import Dexie, { liveQuery, Table } from 'dexie';
import { TodoItem } from '../types/todo';


export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  todos!: Table<TodoItem>; 

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      todos: 'key, date, parentKey' // Primary key and indexed props
    });
  }

  getTodayTodos() {
    const date = dayjs().format('YYYY-MM-DD');
    const todos = useObservable(liveQuery(() => {
      return this.todos
      .where("date").equals(date)
      .toArray();
    }));
    return todos;
  }

  getLast7daysTodos() {
    const endDate = dayjs().format('YYYY-MM-DD');
    const dates = [];

    for (let i = 1; i <=7; i++) {
      dates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
    }

    const todos = useObservable(liveQuery(() => {
      return this.todos
      .where("date").anyOf(dates)
      .toArray();
    }));
    return todos;
  }

  getFinishedTodos() {

  }

  getDeletedTodos() {

  }

  getAllTodos() {

  }
}

export const db = new MySubClassedDexie();