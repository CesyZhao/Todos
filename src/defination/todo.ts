export interface TodoItem extends DateConfig{
  key: string;
  level: string;
  content: string;
  progress: number;
  active: number;
  createTime: number;
  description?: string;
  parentKey?: string;
}

export enum DateType {
  Date= 'date',
  Range = 'range',
}

export enum RepeatDuration {
  EveryDay = 'every day',
  EveryWeek = 'every week'
}

export interface DateConfig {
  startDate: string;
  endDate: string;
  repeatDuration: RepeatDuration,
  daysBeforeRemind: number;
}