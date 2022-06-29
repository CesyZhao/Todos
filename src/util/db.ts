import { useObservable } from '@vueuse/rxjs';
import dayjs from 'dayjs';
import Dexie, {liveQuery, Observable, Table} from 'dexie';
import { TodoItem } from '../defination/todo';


export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  todos!: Table<TodoItem>; 

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      todos: 'key, startDate, endDate, repeatDuration, remindTiming, parentKey, progress, active, createTime' // Primary key and indexed props
    });
  }

  getTodayTodos(): Observable<TodoItem[]> {
    const date = dayjs().format('YYYY-MM-DD');
    return liveQuery(() => {
      return this.todos
        .where("endDate")
        .equals(date)
        .sortBy('createTime');
    });
  }

  getLast7daysTodos(): Observable<TodoItem[]> {
    const endDate = dayjs().format('YYYY-MM-DD');
    const dates = [endDate];

    for (let i = 1; i <4; i++) {
      dates.unshift(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
      dates.push(dayjs().add(i, 'day').format('YYYY-MM-DD'));
    }

    return liveQuery(() => {
      return this.todos
        .where("startDate")
        .anyOf(dates)
        .sortBy('createTime');
    });
  }

  getFinishedTodos(): Observable<TodoItem[]> {
    return liveQuery(() => {
      return this.todos
        .where("progress")
        .equals(100)
        .sortBy('createTime');
    });
  }

  getDeletedTodos(): Observable<TodoItem[]> {
    return liveQuery(() => {
      return this.todos
        .where("active")
        .equals(0)
        .sortBy('createTime');
    });
  }

  getAllTodos(): Observable<TodoItem[]> {
    return liveQuery(() => {
      return this.todos.orderBy('createTime').toArray();
    });
  }
}

export const db = new MySubClassedDexie();