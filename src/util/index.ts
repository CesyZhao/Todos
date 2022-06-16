import dayjs from 'dayjs';
import { TodoItem } from '../defination/todo';

export const createUuid = () => {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1);
}

export const getDisplayDate = (date: string) => {
  const today = dayjs();
  const targetDate = dayjs(date).format('YYYY-MM-DD');
  if (targetDate === today.format('YYYY-MM-DD')) {
    return '今天';
  }
  if (targetDate === today.add(1, 'day').format('YYYY-MM-DD')) {
    return '明天';
  }
  if (targetDate === today.add(2, 'day').format('YYYY-MM-DD')) {
    return '后天';
  }
  return dayjs(date).format('MM/DD');
}


export const generateList = (list: TodoItem[], key: string) => {
  const map = new Map();
  for (const item of list) {
    const parentTodo = map.get(item.parentKey);
    // 给当前任务的主任务添加 children
    if (parentTodo) {
      if (!parentTodo.children) parentTodo.children = [];
      parentTodo.children.push(item)
    }
    // 避免影响其他层级的任务
    map.set(item.key, item);
  }
  const newList = map.get(key)?.children || [];
  // 删除掉当前任务的 children，避免污染
  delete map.get(key).children;
  return newList;
}

export const getListOfDay = (list: TodoItem[], day: string) => {
  return list.filter(item => {
    return item.date === day;
  })
}

export const formatDate = (date: string) => {
  return date === dayjs().format('YYYY-MM-DD') ? '今天' : dayjs(date).format('MM-DD');
}