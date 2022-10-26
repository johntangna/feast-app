<template>
	<view>
		<button class="uni-button" size="mini" type="primary" @click="addCatalog">添加</button>
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据" @selection-change="selectionChange">
				<uni-tr>
					<uni-th width="150" align="center">序号</uni-th>
					<uni-th align="center">名称</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>
						<view class="name">{{ item.goods_id }}</view>
					</uni-td>
					<uni-td align="center">{{ item.title }}</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary" @click="updateCatalog(item)">修改</button>
							<button class="uni-button" size="mini" type="warn" @click="deleteCatalog(item)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view>
		</view>
	</view>
</template>
<script>
import tableData from './mock.js'
import Picture from "../../../static/utils/admin/picture.js"
export default {
	data() {
		return {
			searchVal: '',
			tableData: [],
			// 每页数据量
			pageSize: 10,
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
			const { pageSize, pageCurrent, success, value } = options
			const {result} = await Picture.getAllFileList()
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

