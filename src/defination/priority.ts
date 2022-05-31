export interface PriorityItem {
  key: string;
  title: string;
}

export enum Priority {
	High = 'high',
	Medium = 'medium',
	Normal = 'normal',
	Low = 'low',
}

const LevelMap = new Map([
	[Priority.High, '紧急'],
	[Priority.Medium, '重要'],
	[Priority.Normal, '一般'],
	[Priority.Low, '普通'],
]);

const PriorityList: PriorityItem[] = [
	Priority.High,
	Priority.Medium,
	Priority.Normal,
	Priority.Low,
].map(level => {
	return {
		key: level,
		title: LevelMap.get(level) || '',
	}
});

export const PriorityColorMap = new Map([
	[Priority.High, 'var(--color-danger-light-4)'],
	[Priority.Medium, 'rgb(var(--orangered-4))'],
	[Priority.Normal, 'var(--color-primary-light-4)'],
	[Priority.Low, '#888888'],
]);

export default PriorityList;