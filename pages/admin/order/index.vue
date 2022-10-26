<template>
	<view>
		<button class="uni-button" size="mini" type="primary" @click="exportOrder">导出当天订单详情</button>
		<button style="margin-left: 20px;" class="uni-button" size="mini" type="warn" @click="search">刷新</button>
		<view class="uni-container">
			<uni-table id="tableId" ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th width="150" align="center">订单号</uni-th>
					<uni-th align="center">客户</uni-th>
					<uni-th align="center">订单详情</uni-th>
					<uni-th align="center">订单备注</uni-th>
					<uni-th align="center">创建时间</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>
						<view class="name">{{ item.order_id }}</view>
					</uni-td>
					<uni-td align="center">{{ item.fk_user_number }}</uni-td>
					<uni-td align="center">
						<div class="details" v-for="(details, index) in item.order_details" :key="index">
							<image :src="details.pic" style="width: 30px;height:30px" mode=""></image>
							<span>
								<span style="margin-right: 10px;">{{details.title}}</span>
								<span>x{{details.num}}（个）</span>
							</span>
							<span>（￥）{{details.total}}</span>
						</div>
					</uni-td>
					<uni-td align="center">{{ item.order_remark }}</uni-td>
					<uni-td align="center">{{ item.create_time }}</uni-td>
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
	import tableData from './mock.js'
	import Request from "../../../static/utils/request.js"
	import OrderAdmin from "../../../static/utils/admin/orderAdmin.js"
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
						"fileName": "订单信息", //导出Excel的文件名字
						"sheets": [{
							titles: ["订单号", "客户", "订单详情", "订单备注", "创建时间"], //列名
							name: "订单信息", //sheet页名
							data: [], //sheet页数据
						}]
					};

					var data = this.tableData;
					var revenueObject = null;

					this.tableData.forEach((item, index) => {
						exportObj.sheets[0].data.push({ //注意:这里的顺序要和上面的列名顺序保持一致
							"OrderId": item.order_id,
							"Name": item.fk_user_number,
							"OrderDetails": this.formatOrderDetails(item.order_details),
							"Remark": item.order_remark,
							"Date": item.create_time
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
				} = await OrderAdmin.queryOrder("bigmouth_order", Request.dateFormat("YYYY-mm-dd", new Date()))
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
