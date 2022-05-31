import { createUuid } from "../util";
import { TodoItem } from "../defination/todo";

class Todo implements TodoItem {

	key: string;
	level: string;
	date: string;
	content: string;
	progress: number;
	active: number;
	createTime: number;
	description?: string;
	parentKey?: string;

	constructor(obj: Pick<TodoItem, 'level' | 'date' | 'content' | 'description' | 'parentKey'>) {
		const { level, date, content, description, parentKey } = obj;
		this.key = createUuid();
		this.level = level;
		this.date = date;
		this.content = content;
		this.progress = 0;
		this.active = 1;
		this.createTime = new Date().getTime();
		this.description = description;
		this.parentKey = parentKey;
	}
}

export default Todo;