import dayjs from "dayjs";

enum DatePickerShortcuts {
	Tomorrow,
	DayAfter,
	ThreeDaysAfter,
	WeekLater,
	MonthLater
}

const DatePickerShortcutsMap = new Map(
	[
		[DatePickerShortcuts.Tomorrow, 1],
		[DatePickerShortcuts.DayAfter, 2],
		[DatePickerShortcuts.ThreeDaysAfter, 3],
		[DatePickerShortcuts.WeekLater, 7],
		[DatePickerShortcuts.MonthLater, 30],
	]
);

const DatePickerShortcutsTitleMap = new Map(
	[
		[DatePickerShortcuts.Tomorrow, '明天'],
		[DatePickerShortcuts.DayAfter, '后天'],
		[DatePickerShortcuts.ThreeDaysAfter, '三天后'],
		[DatePickerShortcuts.WeekLater, '一周后'],
		[DatePickerShortcuts.MonthLater, '一个月后'],
	]
);

export const datePickerShortcuts = [
	DatePickerShortcuts.Tomorrow,
	DatePickerShortcuts.DayAfter,
	DatePickerShortcuts.ThreeDaysAfter,
	DatePickerShortcuts.WeekLater,
	DatePickerShortcuts.MonthLater,
].map(shortCut => {
	const now = dayjs();
	return {
		label: DatePickerShortcutsTitleMap.get(shortCut),
		value: () => now.add(DatePickerShortcutsMap.get(shortCut) || 1, 'day')
	}
});

enum RangePickerShortcuts {
	NextTreeDays,
	NextSevenDays,
	NextFifteenDays,
	NextMonth
}

const RangePickerShortcutsMap = new Map(
	[
		[RangePickerShortcuts.NextTreeDays, 2],
		[RangePickerShortcuts.NextSevenDays, 6],
		[RangePickerShortcuts.NextFifteenDays, 14],
		[RangePickerShortcuts.NextMonth, 29],
	]
);

const RangePickerShortcutsTitleMap = new Map(
	[
		[RangePickerShortcuts.NextTreeDays, '接下来 3 天'],
		[RangePickerShortcuts.NextSevenDays, '接下来 7 天'],
		[RangePickerShortcuts.NextFifteenDays, '接下来 15 天'],
		[RangePickerShortcuts.NextMonth, '接下来 30 天'],
	]
);

export const rangePickerShortcuts = [
	RangePickerShortcuts.NextTreeDays,
	RangePickerShortcuts.NextSevenDays,
	RangePickerShortcuts.NextFifteenDays,
	RangePickerShortcuts.NextMonth,
].map(shortCut => {
	const now = dayjs();
	return {
		label: RangePickerShortcutsTitleMap.get(shortCut),
		value: () => [now, now.add(RangePickerShortcutsMap.get(shortCut) || 1, 'day')]
	}
});

export enum DateType {
	Date = 'date',
	Range = 'range',
}

export enum RepeatDuration {
	EveryDay,
	EveryWeek
}

export const repeatDurationTitleMap = new Map([
	[RepeatDuration.EveryDay, '每天'],
	[RepeatDuration.EveryWeek, '每周(周一)'],
]);

export const repeatDurationOptions = [
	RepeatDuration.EveryDay,
	RepeatDuration.EveryWeek,
].map(duration => {
	return {
		label: repeatDurationTitleMap.get(duration),
		value: duration
	}
});

export enum RemindTiming {
	OnDay,
	DayBefore,
	TwoDaysBefore,
	ThreeDaysBefore ,
	WeekBefore
}

export const remindTimingTitleMap = new Map([
	[RemindTiming.OnDay, '当天 9 点'],
	[RemindTiming.DayBefore, '前一天 9 点'],
	[RemindTiming.TwoDaysBefore, '前两天 9 点'],
	[RemindTiming.ThreeDaysBefore, '前三天 9 点'],
	[RemindTiming.WeekBefore, '前一周 9 点'],
]);

export const remindTimingOptions = [
	RemindTiming.OnDay,
	RemindTiming.DayBefore,
	RemindTiming.TwoDaysBefore,
	RemindTiming.ThreeDaysBefore,
	RemindTiming.WeekBefore,
].map(timing => {
	return {
		label: remindTimingTitleMap.get(timing),
		value: timing
	}
});

export interface DateConfig {
	startDate: string;
	endDate: string;
	repeatDuration: RepeatDuration,
	remindTiming: RemindTiming;
}