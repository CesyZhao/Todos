<template>
	<a-popover trigger="click" position="bl" :arrow-style="{ display: 'none' }" ref="priorityPop">
		<div class="input-prefix">
			<i class="iconfont icon-youxianji icon" :style="getStyle(modelValue)"></i>
		</div>
		<template #content>
			<div class="priority-wrapper">
				<div
						v-for="item in priorityList"
						:key="item.key"
						:style="getStyle(item.key)"
						class="priority-item"
						@click="handleItemClick(item)">
					<i class="iconfont icon-youxianji icon priority-label" />
					{{ item.title }}
				</div>
			</div>
		</template>
	</a-popover>
</template>

<script lang="ts" setup>
import {Priority, PriorityColorMap, PriorityItem} from "../defination/priority";
import {reactive, ref, defineEmits} from "vue";
import PriorityList from "../defination/priority";

interface Props {
	modelValue: Priority
}
const props = defineProps<Props>();
const emits = defineEmits(['update:modelValue']);

const priorityList = reactive(PriorityList);

const priorityPop = ref(null);

const handleItemClick = (priority: PriorityItem) => {
	emits('update:modelValue', priority.key);

	priorityPop.value?.handlePopupVisibleChange(false);
};

const getStyle = (priority: Priority) => {
	// console.log(PriorityColorMap)
	return `color: ${PriorityColorMap.get(priority)}`;
};
</script>

<style lang="less" scoped>
.priority-wrapper {
	display: flex;
}
.priority-item {
	font-size: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	&.high {
		 color: var(--color-danger-light-4);
  }
	&.medium {
		 color: rgb(var(--orangered-4));
  }
	&.normal {
		 color: var(--color-primary-light-4);
  }
}
.priority-label{
	margin:0 16px;
	font-size: 16px;
}

.icon {
	cursor: pointer;
	&.high {
		color: var(--color-danger-light-4);
	}
	&.medium {
		color: rgb(var(--orangered-4));
	}
	&.normal {
		color: var(--color-primary-light-4);
	}
}
</style>