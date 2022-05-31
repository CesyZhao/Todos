<template>
	<a-popover trigger="click" position="bottom" :arrow-style="{display: 'none'}">
		<span>时间</span>
		<template #content>
			<div class="content-wrapper">
				<div class="picker-header">
					<a-radio-group type="button" v-model="dateType">
						<a-radio value="date">日期</a-radio>
						<a-radio value="range">区间</a-radio>
					</a-radio-group>
					<div>
						<a-dropdown>
							<a-button>提醒 <icon-schedule /> </a-button>
							<template #content>
								<a-doption>Option 1</a-doption>
								<a-doption>Option 2</a-doption>
								<a-doption>Option 3</a-doption>
							</template>
						</a-dropdown>
						<a-dropdown>
							<a-button>重复 <icon-sync /> </a-button>
							<template #content>
								<a-doption>Option 1</a-doption>
								<a-doption>Option 2</a-doption>
								<a-doption>Option 3</a-doption>
							</template>
						</a-dropdown>
					</div>
				</div>
				<component
						:is="componentType"
						:shortcuts="pickerShortcuts"
						shortcuts-position="right"
						class="picker"
						hide-trigger
						></component>
			</div>
		</template>
	</a-popover>
</template>

<script setup lang="ts">
import { DateConfig, DateType } from "../defination/todo";
import {computed, reactive, ref} from "vue";
import { DatePicker, RangePicker } from '@arco-design/web-vue'
import dayjs from "dayjs";

interface Props {
	dateConfig: DateConfig
}
const props = defineProps<Props>();

const dateType = ref(DateType.Date);

const componentType = computed(() => {
	return dateType.value === DateType.Date ? DatePicker : RangePicker
})

const shortcuts = reactive([
	{
		label: '明天',
		value: () => dayjs().add(1, 'day')
	},
	{
		label: '后天',
		value: () => dayjs().add(2, 'day')
	},
	{
		label: '三天后',
		value: () => dayjs().add(3, 'day')
	},
	{
		label: '一周后',
		value: () => dayjs().add(1, 'week'),
	},
	{
		label: '一月后',
		value: () => dayjs().add(1, 'month'),
	}
]);

const rangeShortcuts = reactive([
	{
		label: '接下来 3 天',
		value: () => [dayjs(), dayjs().add(2, 'day')],
	},
	{
		label: '接下来 7 天',
		value: () => [dayjs(), dayjs().add(1, 'month')],
	},
	{
		label: '接下来 15 天',
		value: () => [dayjs(), dayjs().add(1, 'month')],
	},
	{
		label: '接下来 30 天',
		value: () => [dayjs(), dayjs().add(1, 'month')],
	},
])

const pickerShortcuts = computed(() => {
	return dateType.value === DateType.Date ? shortcuts : rangeShortcuts
})

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
</style>