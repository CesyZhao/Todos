import { LevelItem } from "../types/level";

export enum Level {
  High = 'high',
  Medium = 'medium',
  Normal = 'normal',
  Low = 'low',
}

const LevelMap = new Map([
  [Level.High, '紧急'],
  [Level.Medium, '重要'],
  [Level.Normal, '一般'],
  [Level.Low, '普通'],
]);

const levels: LevelItem[] = [
  Level.High,
  Level.Medium,
  Level.Normal,
  Level.Low,
].map(level => {
  return {
    key: level,
    title: LevelMap.get(level) || '',
  }
});

export default levels;