import { DateConfig } from "./date";
import { Priority } from "./priority";

export interface TodoItem extends DateConfig{
  key: string;
  priority: Priority;
  content: string;
  progress: number;
  active: number;
  createTime: number;
  description?: string;
  parentKey?: string;
}

export const IS_TODO_FINISHED = 100;