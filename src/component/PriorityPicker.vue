<template>
	<a-popover trigger="click" position="bl" :arrow-style="{ display: 'none' }" ref="priorityPop">
		<div class="input-prefix">
			<i class="iconfont icon-youxianji icon" :class="currentPriority"></i>
		</div>
		<template #content>
			<div class="priority-wrapper">
				<div
						v-for="priority in priorityList"
						:key="priority.key"
						:class="priority.key"
						class="priority-item"
						@click="handleItemClick(priority)">
					<i class="iconfont icon-youxianji icon priority-label" />
					{{ priority.title }}
				</div>
			</div>
		</template>
	</a-popover>
</template>

<script lang="ts" setup>
import { PriorityItem } from "../defination/priority";
import {computed, reactive, ref, defineEmits} from "vue";
import PriorityList from "../defination/priority";

interface Props {
	priority: PriorityItem
}

const props = defineProps<Props>();
const currentPriority = computed(() => props.priority?.key);
const priorityList = reactive(PriorityList);

const priorityPop = ref(null);

const emit = defineEmits(['change']);
const handleItemClick = (priority: PriorityItem) => {
	emit('change', priority);
	priorityPop.value?.handlePopupVisibleChange(false);
}
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