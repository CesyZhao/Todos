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
      todos: 'key, date, parentKey, progress, active' // Primary key and indexed props
    });
  }

  getTodayTodos() {
    console.log('called-------');
    const date = dayjs().format('YYYY-MM-DD');
    return liveQuery(() => {
      return this.todos
      .where("date").equals(date)
      .toArray();
    });
  }

  getLast7daysTodos() {
    const endDate = dayjs().format('YYYY-MM-DD');
    const dates = [];

    for (let i = 1; i <7; i++) {
      dates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
    }

    dates.push(endDate);

    return liveQuery(() => {
      return this.todos
      .where("date").anyOf(dates)
      .toArray();
    });
  }

  getFinishedTodos() {
    return liveQuery(() => {
      return this.todos
      .where("progress").equals(100)
      .toArray();
    });
  }

  getDeletedTodos() {
    return liveQuery(() => {
      return this.todos
      .where("active").equals(0)
      .toArray();
    });
  }

  getAllTodos() {
    return liveQuery(() => {
      return this.todos
      .toArray();
    });
  }
}

export const db = new MySubClassedDexie();