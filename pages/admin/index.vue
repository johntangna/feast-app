<template>
	<div class="flex_r">
		<div class="left">
			<div class="menu-item" :class="activeIndex == index ? 'active' : ''" v-for="(item, index) in menu" :key="index" @click="selectMenu(item, index)">
				<uni-icons :type="item.type" size="20"></uni-icons>
				<span style="margin-left: 10px">{{item.name}}</span>
			</div>
		</div>
		<div class="right">
			<component :is="ComputedComp"></component>
		</div>
	</div>
</template>

<script>
	import UniIcons from "@/components/icon/icon.vue"
	import Order from "./order/index.vue"
	import Catalog from "./catalog/index.vue"
	import Good from "./good/index.vue"
	import Picture from "./picture/index.vue"
	import Invote from "./invote/index.vue"
	export default {
		components: {
			UniIcons,
			Order,
			Catalog,
			Good,
			Picture,
			Invote
		},
		data() {
			return {
				comp: "Order",
				menu: [{
						name: "订单管理",
						type: "peisong",
						url: Order
					},
					{
						name: "类目管理",
						type: "wanchen",
						url: Catalog
					},
					{
						name: "商品管理",
						type: "daifukuan",
						url: Good
					},
					{
						name: "美食排行榜",
						type: "huiyuanlifttime",
						url: Invote
					}
				],
				activeIndex: 0
			}
		},
		computed: {
			ComputedComp() {
				return this.comp
			}
		},
		mounted() {

		},
		methods: {
			selectMenu(menu, index) {
				this.activeIndex = index
				this.comp = menu.url
			}
		}
	}
</script>

<style scoped lang="less">
	html,
	body,
	.uni-page-body,
	.flex_r {
		width: 100%;
		height: 100%;
	}

	.flex_r {
		display: flex;
	}

	.left {
		width: 220px;
		height: 100%;
		padding-top: 10px;
	}

	.menu-item {
		font-size: 16px;
		padding: 10px 20px;
		color: #7a80b4;
		cursor: pointer;
		&:hover {
			background: #fff;
			color: #343434;
		}
		&.active {
			background: #e0ebf6;
			color: #409eff !important;
		}
	}

	.right {
		flex: 1;
		padding: 20px;
		background: #f0f2f5;
		height: 100%;
	}
</style>
