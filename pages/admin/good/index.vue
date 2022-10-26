<template>
	<view>
		<button class="uni-button" size="mini" type="primary" @click="addGoodDetails">添加</button>
		<button style="margin-left: 20px;" class="uni-button" size="mini" type="warn" @click="search">刷新</button>
		<view class="good_content flex_r">
			<div class="left">
				<div class="menu-item" :class="activeIndex == index ? 'active' : ''"
					v-for="(item, index) in catalogList" :key="index" @click="selectMenu(item, index)">
					<uni-icons type="liwu" size="20"></uni-icons>
					<span style="margin-left: 10px">{{item.title}}</span>
				</div>
			</div>
			<view class="uni-container right">
				<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center">商品图片</uni-th>
						<uni-th align="center">商品名称</uni-th>
						<uni-th align="center">商品简介</uni-th>
						<uni-th align="center">商品价格</uni-th>
						<uni-th width="204" align="center">设置</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td>
							<image :src="item.pic" style="width:50px; height: 50px;margin: 0 auto;" lazy-load></image>
						</uni-td>
						<uni-td align="center">
							<view class="name">{{ item.title }}</view>
						</uni-td>
						<uni-td align="center">{{ item.introduce }}</uni-td>
						<uni-td align="center">{{ item.mini_price }}</uni-td>
						<uni-td>
							<view class="uni-group">
								<button class="uni-button" size="mini" type="primary"
									@click="updateGoodDetailes(item)">修改</button>
								<button class="uni-button" size="mini" type="warn"
									@click="deleteGoodDetailes(item)">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
						@change="change" />
				</view>
			</view>
		</view>
		<view class="popup" v-if="popup">
			<view class="popup_header">
				<view class="popup_close" @click="popup = false">
					关闭
				</view>
			</view>
			<view class="popup_content">
				<uni-forms label-width="120" ref="baseForm" :modelValue="baseFormData">
					<uni-forms-item label="商品图片" required>
						<uni-easyinput v-model="baseFormData.pic" placeholder="请输入商品图片链接" />
					</uni-forms-item>
					<uni-forms-item label="商品名称" required>
						<uni-easyinput v-model="baseFormData.title" placeholder="请输入商品名称" />
					</uni-forms-item>
					<uni-forms-item label="商品简介" required>
						<uni-easyinput v-model="baseFormData.introduce" placeholder="请输入商品简介" />
					</uni-forms-item>
					<uni-forms-item label="商品价格" required>
						<uni-easyinput v-model="baseFormData.mini_price" placeholder="请输入商品价格" />
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="footer">
				<view class="dialog_footer">
					<button type="primary" size="mini" @click="save" :disabled="saving" :loading="saving">保存</button>
				</view>
			</view>
		</view>
		<view class="popup_model" v-if="popup"></view>
	</view>
</template>
<script>
	import Catalog from "../../../static/utils/catalog.js"
	import GoodsDetails from "../../../static/utils/admin/goodsAdmin.js"
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
				loading: false,
				catalogList: [],
				activeIndex: 0,
				popup: false,
				saving: false,
				baseFormData: {
					goods_details_id: "",
					fk_goods_id: "",
					pic: "",
					title: "",
					introduce: "",
					mini_price: ""
				},
				popupId: "",
			}
		},
		mounted() {
			this.selectedIndexs = []
			this.getData(1)
		},
		methods: {
			addGoodDetails() {
				this.popupId = ""
				this.baseFormData = {
					goods_details_id: "",
					fk_goods_id: "",
					pic: "",
					title: "",
					introduce: "",
					mini_price: ""
				}
				this.popup = true
			},
			updateGoodDetailes(item) {
				this.popupId = item.goods_details_id
				this.baseFormData = {
					goods_details_id: item.goods_details_id,
					fk_goods_id: this.catalogList[this.activeIndex].goods_id,
					pic: item.pic,
					title: item.title,
					introduce: item.introduce,
					mini_price: item.mini_price
				}
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
						} = await GoodsDetails.updateGoodsDetails("bigmouth_goods_details", {
							id: this.popupId,
							...this.baseFormData
						})
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
						} = await GoodsDetails.addGoodsDetails("bigmouth_goods_details", {
							...this.baseFormData,
							goods_details_id: new Date().getTime(),
							fk_goods_id: this.catalogList[this.activeIndex].goods_id,
						})
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
							GoodsDetails.updateGoodsDetails("bigmouth_goods_details", {
								id: item.goods_details_id,
								fk_goods_id: this.catalogList[this.activeIndex].goods_id,
								title: item.title,
								introduce: item.introduce,
								mini_price: item.mini_price,
								del: 1
							})
							this.search()
						}
					}
				})
			},
			selectMenu(item, index) {
				this.activeIndex = index
				this.search()
			},
			async getAllCatalog() {
				const {
					result: {
						data
					}
				} = await Catalog.queryCatalog("bigmouth_goods")
				this.catalogList = data
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
			async getData(pageCurrent, value = '') {
				await this.getAllCatalog()
				this.loading = true
				this.pageCurrent = pageCurrent
				this.request({
					pageSize: this.pageSize,
					pageCurrent: pageCurrent,
					value: value,
					success: res => {
						console.log('data', this.catalogList);
						this.baseFormData.fk_goods_id = this.catalogList[this.activeIndex].goods_id
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
				} = await GoodsDetails.queryGoodsDetails("bigmouth_goods_details", this.catalogList[this.activeIndex]
					.goods_id)
				let total = result.data.length
				let data = result.data.filter((item, index) => {
					const idx = index - (pageCurrent - 1) * pageSize
					return idx < pageSize && idx >= 0
				})
				if (value) {
					data = []
					tableData.forEach(item => {
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
<style lang="less">
	/* #ifndef H5 */
	/* page {
	padding-top: 85px;
} */
	/* #endif */
	.flex_r {
		display: flex;
	}

	.uni-group {
		display: flex;
		align-items: center;
	}

	.left {
		width: 220px;
		height: 100%;
		padding-top: 10px;
		background: #ffffff;
	}

	.right {
		flex: 1;
		padding: 0 20px;
		background: #f0f2f5;
		height: 100%;
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

	.footer {
		width: 100%;
		height: 30px;

		.dialog_footer {
			text-align: center;
			position: absolute;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
