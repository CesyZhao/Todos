import {createUuid} from "../util";
import {TodoItem} from "../defination/todo";
import {RemindTiming, RepeatDuration} from "../defination/date";
import {Priority} from "../defination/priority";

class Todo implements TodoItem {

	key: string;
	priority: Priority;
	startDate: string;
	endDate: string;
	repeatDuration: RepeatDuration;
	remindTiming: RemindTiming;
	content: string;
	progress: number;
	active: number;
	createTime: number;
	description?: string;
	parentKey?: string;

	constructor(obj: Omit<TodoItem, 'key' | 'createTime' | 'progress' | 'active'>) {

		const { priority, startDate, endDate = startDate, repeatDuration, remindTiming,  content, description, parentKey } = obj;

		this.key = createUuid();
		this.priority = priority;
		this.startDate = startDate;
		this.endDate = endDate;
		this.repeatDuration = repeatDuration || RepeatDuration.EveryDay;
		this.remindTiming = remindTiming || RemindTiming.OnDay;
		this.content = content;
		this.progress = 0;
		this.active = 1;
		this.createTime = new Date().getTime();
		this.description = description;
		this.parentKey = parentKey;
	}
}

export default Todo;