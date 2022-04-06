export interface TodoItem {
  key: string;
  level: string;
  date: string;
  content: string;
  progress: number;
  active: boolean;
  description?: string;
  parentKey?: string;
}