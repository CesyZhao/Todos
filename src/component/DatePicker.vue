<template>
	<a-popover trigger="click" position="bottom" :arrow-style="{display: 'none'}">
		<span class="text">
			<icon-calendar></icon-calendar>
			{{ displayText }}
		</span>
		<template #content>
			<div class="content-wrapper">
				<div class="picker-header">
					<a-radio-group type="button" v-model="dateType">
						<a-radio value="date">日期</a-radio>
						<a-radio value="range">区间</a-radio>
					</a-radio-group>
					<div>
						<a-dropdown @select="handleRemindChange">
							<a-button>{{displayRemindTiming}}
								<icon-schedule/>
							</a-button>
							<template #content>
								<a-doption v-for="op in remindOptions" :key="op.value" :value="op.value">{{op.label}}</a-doption>
							</template>
						</a-dropdown>
						<a-dropdown @select="handleRepeatChange">
							<a-button>{{displayRepeatDuration}}
								<icon-sync/>
							</a-button>
							<template #content>
								<a-doption v-for="op in repeatOptions" :key="op.value" :value="op.value">{{op.label}}</a-doption>
							</template>
						</a-dropdown>
					</div>
				</div>
				<component
						:is="componentType"
						:shortcuts="pickerShortcuts"
						:model-value="dateValue"
						shortcuts-position="right"
						class="picker"
						hide-trigger
						@change="handleChange"
				></component>
			</div>
		</template>
	</a-popover>
</template>

<script setup lang="ts">
import {DateConfig, DateType, remindTimingTitleMap, repeatDurationTitleMap} from "../defination/date";
import {computed, reactive, ref} from "vue";
import {DatePicker, RangePicker} from '@arco-design/web-vue'
import dayjs from "dayjs";
import {datePickerShortcuts, rangePickerShortcuts, repeatDurationOptions, remindTimingOptions} from "../defination/date";
import {getDisplayDate} from "../util";

interface Props {
	modelValue: DateConfig;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:modelValue']);

const dateType = ref(DateType.Date);

const componentType = computed(() => {
	return dateType.value === DateType.Date ? DatePicker : RangePicker
});

const dateValue = computed(() => {
	const {startDate, endDate} = props.modelValue || {}
	return dateType.value === DateType.Date ? startDate : [startDate, endDate];
})

const shortcuts = reactive(datePickerShortcuts);
const rangeShortcuts = reactive(rangePickerShortcuts);
const pickerShortcuts = computed(() => {
	return dateType.value === DateType.Date ? shortcuts : rangeShortcuts
});
const repeatOptions = reactive(repeatDurationOptions);
const remindOptions = reactive(remindTimingOptions);

const displayText = computed(() => {
	if (!props.modelValue) return;
	const { startDate, endDate = startDate } = props.modelValue;
	return startDate === endDate ? getDisplayDate(startDate) : `${dayjs(startDate).format('MM/DD')} - ${dayjs(endDate).format('MM/DD')}`;
});

const displayRepeatDuration = computed(() => {
	const { modelValue } = props;
	const { repeatDuration } = modelValue || {}
	if (!repeatDuration) return '提醒';
	return repeatDurationTitleMap.get(repeatDuration);
});

const displayRemindTiming = computed(() => {
	const { modelValue } = props;
	if (!modelValue.remindTiming) return '重复';
	return remindTimingTitleMap.get(modelValue.remindTiming);
});

const handleChange = (value: string | string[]) => {
	const [startDate, endDate] = typeof value === 'string' ? [value, value] : value;
	const dateConfig: DateConfig = Object.assign({}, props.modelValue, {
		startDate,
		endDate,
	});
	emits('update:modelValue', dateConfig);
};

const handleRepeatChange = (value: string) => {
	const dateConfig: DateConfig = Object.assign({}, props.modelValue, {
		repeatDuration: value
	});
	emits('update:modelValue', dateConfig);
};

const handleRemindChange = (value: string) => {
	const dateConfig: DateConfig = Object.assign({}, props.modelValue, {
		remindTiming: value
	});
	emits('update:modelValue', dateConfig);
};

</script>

<style lang="less" scoped>
.content-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.picker-header {
	width: 100%;
	display: flex;
	justify-content: space-between;
}

.picker {
	box-shadow: none !important;
	//border: none !important;
	margin-top: 8px;

	:deep(*) {
		//border: none !important;
	}
}

.text {
	cursor: pointer;
}
</style>