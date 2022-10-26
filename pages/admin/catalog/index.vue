<template>
	<view>
		<button class="uni-button" size="mini" type="primary" @click="addCatalog">添加</button>
		<button style="margin-left: 20px;" class="uni-button" size="mini" type="warn" @click="search">刷新</button>
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th width="150" align="center">序号</uni-th>
					<uni-th align="center">名称</uni-th>
					<uni-th align="center">设置</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>
						<view class="name">{{ item.goods_id }}</view>
					</uni-td>
					<uni-td align="center">{{ item.title }}</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary"
								@click="updateCatalog(item)">修改</button>
							<button class="uni-button" size="mini" type="warn" @click="deleteCatalog(item)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
					@change="change" />
			</view>
		</view>
		<view class="popup" v-if="popup">
			<view class="popup_header">
				<view class="popup_close" @click="popup = false">
					关闭
				</view>
			</view>
			<view class="popup_content">
				<uni-forms label-width="100" ref="baseForm" :modelValue="baseFormData">
					<uni-forms-item label="类目名称" required>
						<uni-easyinput v-model="baseFormData.popupModel" placeholder="请输入类目名称" />
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="popup_footer">
				<button type="primary" size="mini" @click="save" :disabled="saving" :loading="saving">保存</button>
			</view>
		</view>
		<view class="popup_model" v-if="popup"></view>
	</view>
</template>
<script>
	import tableData from './mock.js'
	import CataLog from "../../../static/utils/catalog.js"
	export default {
		data() {
			return {
				searchVal: '',
				tableData: [],
				// 每页数据量
				pageSize: 50,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				loading: false,
				popup: false,
				baseFormData: {
					popupModel: ""
				},
				popupId: "",
				saving: false
			}
		},
		mounted() {
			this.selectedIndexs = []
			this.getData(1)
		},
		methods: {
			addCatalog() {
				this.popupId = ""
				this.baseFormData.popupModel = ""
				this.popup = true
			},
			updateCatalog(item) {
				this.popupId = item.goods_id
				this.baseFormData.popupModel = item.title
				this.popup = true
			},
			async save() {
				this.saving = true
				this.$refs.baseForm.validate().then(async (res) => {
					if (this.popupId) {
						const {
							result: {
								data,
								errCode
							}
						} = await CataLog.updateCatalog("bigmouth_goods", this.popupId, this.baseFormData
							.popupModel)
						if (errCode == 0) uni.showToast({
							title: "修改成功",
							success: () => {
								this.popup = false
								this.search()
							}
						})
					} else {
						const {
							result: {
								data,
								errCode
							}
						} = await CataLog.addCatalog("bigmouth_goods", Number(this.tableData[this.tableData.length-1].goods_id) + 1, this
							.baseFormData
							.popupModel)
						if (errCode == 0) uni.showToast({
							title: "添加成功",
							success: () => {
								this.popup = false
								this.search()
							}
						})
					}
					this.saving = false
				}).catch((err) => {
					uni.showToast({
						title: "信息为必填哦",
						icon: "error",
						success: () => {
							this.saving = false
						}
					})
				})
			},
			deleteCatalog(item) {
				uni.showModal({
					title: "删除确认",
					success: (e) => {
						if (e.confirm) {
							CataLog.updateCatalog("bigmouth_goods", item.goods_id, item.title, 1)
							this.search()
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
						this.$forceUpdate()
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
				} = await CataLog.queryCatalog("bigmouth_goods")
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
</style>
