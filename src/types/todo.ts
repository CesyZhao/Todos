export interface TodoItem {
  key: string;
  level: string;
  date: string;
  content: string;
  progress: number;
  description?: string;
  parentKey?: string;
}