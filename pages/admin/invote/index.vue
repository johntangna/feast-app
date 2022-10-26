<template>
	<view>
		<button class="uni-button" size="mini" type="primary" @click="exportOrder">导出美食排行榜</button>
		<button style="margin-left: 20px;" class="uni-button" size="mini" type="warn" @click="search">刷新</button>
		<view class="uni-container">
			<uni-table id="tableId" ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="center">美食快照</uni-th>
					<uni-th align="center">美食名称</uni-th>
					<uni-th align="center">美食价格</uni-th>
					<uni-th align="center">美食票数</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td align="center">
						<image :src="item.invote_pic" style="width: 50px;height:50px;margin: 0 auto;" mode=""></image>
					</uni-td>
					<uni-td align="center">
						<view class="name">{{ item.invote_goods_name }}</view>
					</uni-td>
					<uni-td align="center">{{ item.invote_good_price }}</uni-td>
					<uni-td align="center">{{ item.invote_number }}</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
					@change="change" />
			</view>
		</view>
	</view>
</template>
<script>
	import Request from "../../../static/utils/request.js"
	import Invote from "../../../static/utils/admin/invote.js"
	import FileSaver from "file-saver"
	import {
		rcExcel
	} from "../nodejs/writeExcel.js"
	export default {
		data() {
			return {
				searchVal: '',
				tableData: [],
				// 每页数据量
				pageSize: 100,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				loading: false
			}
		},
		mounted() {
			this.selectedIndexs = []
			this.getData(1)
		},
		methods: {
			formatOrderDetails(orderDetails) {
				let str = ""
				orderDetails.forEach(item => {
					str += item.title + " x" + item.num + "（个） 总价:￥" + item.total + "————"
				})
				return str
			},
			exportOrder() {
				try {
					var revenueData = this.tableData;
					var exportObj = { //构造导出数据对象
						"fileName": "美食排行榜", //导出Excel的文件名字
						"sheets": [{
							titles: ["美食快照", "美食名称", "美食价格", "美食票数"], //列名
							name: "美食排行榜", //sheet页名
							data: [], //sheet页数据
						}]
					};

					var data = this.tableData;
					var revenueObject = null;

					this.tableData.forEach((item, index) => {
						exportObj.sheets[0].data.push({ //注意:这里的顺序要和上面的列名顺序保持一致
							"invote_pic": item.invote_pic,
							"invote_goods_name": item.invote_goods_name,
							"invote_good_price": item.invote_good_price,
							"invote_number": item.invote_number
						});
					})

					rcExcel.ExportToExcel(exportObj); //调用方法实现数据导出到Excel

				} catch (error) {
				}
			},
			deleteCatalog(item) {
				uni.showModal({
					title: "删除确认",
					success(e) {
						if (e.confirm) {
							CataLog.updateCatalog("bigmouth_good", item.goods_id, item.title, 1)
						}
					}
				})
			},
			// 多选处理
			selectedItems() {
				return this.selectedIndexs.map(i => this.tableData[i])
			},
			// 多选
			selectionChange(e) {
				console.log(e.detail.index)
				this.selectedIndexs = e.detail.index
			},
			//批量删除
			delTable() {
				console.log(this.selectedItems())
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.selectedIndexs.length = 0
				this.getData(e.current)
			},
			// 搜索
			search() {
				this.getData(1, this.searchVal)
			},
			// 获取数据
			getData(pageCurrent, value = '') {
				this.loading = true
				this.pageCurrent = pageCurrent
				this.request({
					pageSize: this.pageSize,
					pageCurrent: pageCurrent,
					value: value,
					success: res => {
						// console.log('data', res);
						this.tableData = res.data
						this.total = res.total
						this.loading = false
					}
				})
			},
			// 伪request请求
			async request(options) {
				const {
					pageSize,
					pageCurrent,
					success,
					value
				} = options
				const {
					result
				} = await Invote.getInvote("bigmouth_invote")
				console.info(result)
				let total = result.data.length
				let data = result.data.filter((item, index) => {
					const idx = index - (pageCurrent - 1) * pageSize
					return idx < pageSize && idx >= 0
				})
				if (value) {
					data = []
					result.data.forEach(item => {
						if (item.name.indexOf(value) !== -1) {
							data.push(item)
						}
					})
					total = data.length
				}

				setTimeout(() => {
					typeof success === 'function' &&
						success({
							data: data,
							total: total
						})
				}, 500)
			}
		}
	}
</script>
<style>
	/* #ifndef H5 */
	/* page {
	padding-top: 85px;
} */
	/* #endif */
	.uni-group {
		display: flex;
		align-items: center;
	}

	.details {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
</style>
