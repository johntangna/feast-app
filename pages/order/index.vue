<template>
	<view class="content">
		<block v-if="loading">
			<view class="loadingBox">
				<view class="loading">
					<image lazy-load :src="template.overall.loading"></image>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="swiperBpx" :style="'height:'+(WindowHeight-70)+'px'">
				<swiper class="swiper" circular interval="6000" duration="500" @change="swiperChange">
					<swiper-item v-for="(item, index) in invoteGoodsList" :key="index">
						<view class="orderBox" :style="'height:'+(WindowHeight-150)+'px'">
							<!-- <view class="header" v-if="item.order_status==0">
								<view class="title" :style="'color:'+template.color.color2">待付款</view>
								<view class="statusBox">
									<view class="status">
										<icon type="daifukuan" size="30" :color="template.color.color5"></icon>
										<view style="font-size: 24rpx;" :style="'color:'+template.color.color5">请在 <countdown v-if="item.close_time_stamp" @callback="getOrderDetail()" :targetTime="item.close_time_stamp"></countdown> 内完成支付</view>
									</view>
								</view>
								<view class="button" v-if="item.delivery_type==2" :style="'background-color:'+template.color.color1" @click="paypalPrderTap(item.id)">立即支付</view>
							</view> -->
							<view class="header">
								<view class="title" :style="'font-size: 30px;color:'+template.color.color2">
									{{ item.title }}
								</view>
							</view>
							<view class="content" :style="'height:'+(WindowHeight-239)+'px'">
								<view class="storeBox">
									<view :style='"text-align: center;color:" + template.color.color3'>
										请给您满意的餐品投上一票，让其脱颖而出吧
									</view>
								</view>
								<view class="lineBox">
									<view class="left"></view>
									<view class="right"></view>
								</view>
								<view class="goodsBox" :style="'height:'+(WindowHeight-350)+'px'">
									<view class="goods">
										<view class="infoBox">
											<view class="title" :style="'color:'+template.color.color3">
												商品合计<text>(共{{item.goods_number}}件商品)</text></view>
										</view>
										<!-- <view class="number"></view> -->
										<view class="ranger" @click="allRanger">
											<image style="width: 20px;height: 20px;" lazy-load
												src="../../static/images/tabbar/1a - 副本.png"></image>
											<text
												:style="'margin-left: 8px;font-size: 16px;font-weight: 700;color:'+template.color.color2">查看美食榜</text>
										</view>
									</view>
									<view class="goods" v-for="(item, index) in item.goods_details"
										:key="index">
										<view class="goods_pic">
											<image style="width: 60px;height: 60px;" lazy-load :src="item.pic" mode="">
											</image>
										</view>
										<view class="infoBox" style="width: 30%">
											<view class="title"
												:style="'font-weight: 700;color:'+template.color.color2">
												{{item.title}}
											</view>
											<view v-if="item.goods_spec_name" class="label"
												:style="'color:'+template.color.color3">
												<text v-for="(value, name) in item.goods_spec_name"
													:key="name">{{name}}:{{value}}</text>
											</view>
										</view>
										<view class="price" :style="'color:'+template.color.color1">
											¥{{item.mini_price}}</view>
										<view class="number">
											<uni-icons class="icons" type="shoucang1" size="30"
												:style='{"color" : (item.invoteFlag ? "#ff0000" : "#ffbbbb")}'
												@click="voteFor(item, index)">
											</uni-icons>
										</view>
									</view>
									<view class="goods" v-if="item.coupons_money">
										<view class="infoBox">
											<view class="title" :style="'color:'+template.color.color3">优惠抵扣</view>
										</view>
										<view class="number"></view>
										<view class="price" :style="'color:'+template.color.color3">
											-¥{{item.coupons_money}}</view>
									</view>
									<view class="goods" v-if="item.user_money">
										<view class="infoBox">
											<view class="title" :style="'color:'+template.color.color3">
												会员折扣<text>({{item.user_level}}{{item.user_count*10}}折)</text></view>
										</view>
										<view class="number"></view>
										<view class="price" :style="'color:'+template.color.color3">
											-¥{{item.user_money}}</view>
									</view>
									<view class="goods" v-if="item.freight_money">
										<view class="infoBox">
											<view class="title" :style="'color:'+template.color.color3">配送费</view>
										</view>
										<view class="number"></view>
										<view class="price" :style="'color:'+template.color.color3">
											¥{{item.freight_money}}</view>
									</view>
								</view>
								<view class="lineBox">
									<view class="left"></view>
									<view class="right"></view>
								</view>
								<view class="footer">
									<view class="">
										<view class="title">请大家一定要秉公投票哦</view>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item v-if="invoteGoodsList.length===0">
						<view class="orderBox" style="background-color: #FFFFFF;"
							:style="'height:'+(WindowHeight-130)+'px'">
							<view class="noneList">
								<view class="text" :style="'color:'+template.color.color5">
									暂无可{{template.tabbar.qtitle}}餐品</view>
								<view class="text" :style="'color:'+template.color.color5">先快去犒劳一下自己吧！</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				<view class="swiperDots">
					<block v-for="(item, index) in invoteGoodsList" :key="index">
						<view class="dot" :class="index==swiperCurrent?'active':''"></view>
					</block>
				</view>
			</view>
		</block>

		<view class="showContent" :style="qrcodeShow?'bottom:0;':''">
			<view class="bg" @click="qrcodeTap(false)"></view>
			<view class="showBox" style="min-height: 550rpx;">
				<view class="pheader" :style="'color:'+template.color.color2">请向店员出示提货码</view>
				<view class="images">
					<image :src="imageQrPath" />
				</view>
				<view class="qrText" :style="'background-color:'+template.color.color4" @click="copyVerificationCode()">
					{{qrcodeText}}
				</view>
			</view>
		</view>
		<view v-if="rangerModel" class="showPopBox_com">
			<view class="orderBox_com">
				<view class="content_com">
					<view class="bg_com" @click="rangerModel=false"></view>
					<view class="showContent_com goodsBox_com">
						<view class="sub_goodsBox">
							<view class="flex_row" style="margin-bottom: 32rpx;">
								<view class=""
									:style="'text-align:center;font-weight: 600;color:'+template.color.color3 + ';width:' + item.width"
									v-for="item in header">
									{{item.text}}
								</view>
							</view>
							<view class="goods_com" v-for="(item, index) in allInvoteList" :key="index">
								<view class="id" :style="'font-weight: 700;color:'+template.color.color3">
									{{index + 1}}
								</view>
								<view class="goods_pic">
									<image style="width: 60px;height: 60px;" lazy-load :src="item.invote_pic" mode="">
									</image>
								</view>
								<view class="infoBox" style="width: 22%">
									<view class="title" :style="'font-weight: 700;color:'+template.color.color2">
										{{item.invote_goods_name}}
									</view>
								</view>
								<view class="price" :style="'color:'+template.color.color1">
									¥{{item.invote_good_price}}</view>
								<view class="invote_number"
									:style="'font-size: 32rpx;font-weight: 700;color:'+template.color.color7">
									{{item.invote_number}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import QRCode from '@/static/utils/qrcode.js'
	import UniIcons from "@/components/icon/icon.vue"
	import Countdown from "@/components/countdown/countdown.vue"
	import Invote from "static/utils/invote.js"
	const app = getApp()
	export default {
		components: {
			UniIcons,
			Countdown
		},
		data() {
			return {
				loading: false,
				IphoneX: this.IphoneX,
				WindowHeight: this.WindowHeight,
				template: uni.getStorageSync('__yipinTemplateConfig'),
				shopData: uni.getStorageSync('__yipinShopInfo'),
				orderId: 0,
				paypalShow: false,
				imageQrPath: '',
				qrcodeShow: false,
				userData: {
					moneys: 0,
					score: 0
				},
				swiperCurrent: 0,
				invoteGoodsList: [],
				qrcodeText: '',
				rangerModel: false,
				allInvoteList: [],
				header: [{
						text: "排名",
						width: "8%"
					},
					{
						text: " ",
						width: "21%"
					},
					{
						text: "干饭魂",
						width: "22%"
					},
					{
						text: " ",
						width: "25%"
					},
					{
						text: "干饭点数",
						width: "25%"
					}
				]
			}
		},
		mounted() {
			let self = this;
			let postData = {
				order_type: 1,
				status: 1,
				page: 1
			}
			self.loading = false
			self.invoteGoodsList = app.globalData.goodsAllList
			self.invoteGoodsList.forEach(item => {
				item.goods_number = item.goods_details.length;
				item.goods_details.forEach(it => {
					it.invoteFlag = false
				})
			})
			console.info(self.invoteGoodsList)
			self.getUserDetails();
		},
		methods: {
			async allRanger() {
				const {
					result: {
						data
					}
				} = await Invote.allInvote("bigmouth_invote")
				const finalData = data
				// Array.from({
				// 	length: 3
				// }).map(item => {
				// 	return finalData.shift()
				// })
				this.allInvoteList = finalData
				this.rangerModel = true
			},
			async voteFor(item, index) {
				console.info(this.invoteGoodsList)
				if (item.invoteFlag) {
					uni.showToast({
						title: '当次只能投一票哦',
						icon: 'none'
					})
					return
				}
				item.invoteFlag = true
				this.$forceUpdate()
				Invote.addInvote("bigmouth_invote", "invote_goods_details_id", item.goods_details_id, item.title, 1,
					item.mini_price, item.pic)
			},
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
			},
			getUserDetails() {
				let self = this;
				self.Get(self.Url.userDetails, {}).then(res => {
					if (res.code === 0) {
						self.userData = res.data;
					}
				});
			},
			qrcodeTap(index, status) {
				let self = this;
				if (status) {
					let code = self.invoteGoodsList[index].verification_code;
					QRCode.api.draw(code, 'canvas', 200, 200);
					self.qrcodeText = code;
					setTimeout(() => {
						self.canvasToQrTempImage();
					}, 300);
				} else {
					self.qrcodeShow = false;
				}
			},
			canvasToQrTempImage: function() {
				let self = this;
				wx.canvasToTempFilePath({
					canvasId: 'canvas',
					success: function(res) {
						self.imageQrPath = res.tempFilePath;
						self.qrcodeShow = true;
					}
				});
			},
			getPhoneTap(number) {
				uni.makePhoneCall({
					phoneNumber: number
				});
			},
			getLocalTap() {
				let self = this;
				let shop = self.shopData;
				let data = self.template.overall;
				uni.openLocation({
					name: shop.shop_name,
					address: shop.shop_address,
					latitude: data.latitude,
					longitude: data.longitude
				});
			},
			paypalPrderTap(index) {
				if (index != null) {
					this.paypalShow = true;
				} else {
					this.paypalShow = false;
				}
			},
			getPaypalOrder(id) {
				let self = this;
				// 1 微信支付
				// 2 货到付款
				// 3 余额支付
				// 5 积分支付
				let postData = {
					pay_type: id,
					order_id: self.orderDetail.id,
					platform: 1,
				}
				if (id == 3 && self.userData.moneys < self.orderDetail.total_money) {
					uni.showModal({
						title: '余额支付提示',
						content: '您的可用余额不足以支付该订单，请更换其他支付方式',
						showCancel: false
					})
					return
				}
				if (id === 5 && (self.userData.score / number) < self.orderData.total_money) {
					uni.showModal({
						title: '积分支付提示',
						content: '您的可用积分不足以支付该订单，请更换其他支付方式',
						showCancel: false
					})
					return
				}
				self.Get(self.Url.orderPaypal, postData).then(res => {
					if (res.code === 0) {
						if (id === 1) {
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: res.data.wechat.timeStamp,
								nonceStr: res.data.wechat.nonceStr,
								package: res.data.wechat.package,
								signType: res.data.wechat.signType,
								paySign: res.data.wechat.paySign,
								success: function(res) {
									uni.showToast({
										title: '微信支付成功'
									});
									self.getOrderDetail();
									self.paypalShow = false;
								},
								fail: function(err) {
									uni.showModal({
										title: '支付失败',
										content: '订单支付失败，请重新进行支付。如针对订单金额有疑问请联系客服人员',
										showCancel: false
									})
									return
								}
							});
						} else if (id === 2) {
							uni.showModal({
								title: '货到付款提示',
								content: '收货前请检查快递包装有无破损，如果需要拒收请先联系客服人员',
								showCancel: false
							})
							self.paypalShow = false;
							self.getOrderDetail();
							return
						} else if (id === 3) {
							uni.showToast({
								title: '余额支付成功'
							});
							self.paypalShow = false;
							self.getOrderDetail();
						} else if (id === 5) {
							uni.showToast({
								title: '积分支付成功'
							});
							self.paypalShow = false;
							self.getOrderDetail();
						}
					}
				})
			},
			copyVerificationCode() {
				let data = this.orderDetail;
				uni.setClipboardData({
					data: data.verification_code,
					success: function() {}
				});
			},
			confirmOrder() {
				let self = this;
				self.Get(self.Url.orderConfirm, {
					id: self.orderDetail.id
				}).then(res => {
					if (res.code === 0) {
						uni.showToast({
							title: '确认收货成功'
						});
						self.getOrderDetail();
					}
				});
			},
			getMenuListTap(url) {
				if (app.globalData.user) {
					uni.navigateTo({
						url: url
					});
				} else {
					uni.navigateTo({
						url: '/pages/user/login'
					});
				}
			},
			getHomeTap() {
				this.$emit('tabbbar', 0);
			}
		}
	}
</script>

<style lang="less">
	.swiperBpx {
		width: 100%;
		height: 100%;
		position: relative;

		swiper {
			width: 100%;
			height: 100%;

			swiper-item {
				width: 100%;
				height: 85vh !important;
				margin-top: 50rpx;
			}
		}

		.swiperDots {
			width: 85%;
			height: 20rpx;
			position: absolute;
			bottom: 3vh;
			left: 0;
			right: 0;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: center;

			.dot {
				width: 12rpx;
				height: 12rpx;
				background-color: #343434;
				border-radius: 100%;
				opacity: .2;
				margin-left: 8rpx;
				margin-right: 8rpx;
				transition: all 0.6s;
			}

			.active {
				opacity: .6;
			}
		}
	}

	.orderBox {
		width: 85%;
		margin: 0 auto;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;

		.noneList {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			height: 100%;

			.text {
				font-size: 26rpx;
				padding-bottom: 10rpx;
			}

			.button {
				background-color: #D3AA79;
				color: #fff;
				width: 250rpx;
				height: 56rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 100rpx;
				font-size: 26rpx;
				margin: 20rpx 0;
			}
		}

		.lineBox {
			position: relative;
			width: 100%;
			height: 30rpx;
			margin-top: -16rpx;

			.left {
				position: absolute;
				left: -12rpx;
				width: 30rpx;
				height: 30rpx;
				background-color: #e7e7e7;
				border-radius: 100%;
			}

			.right {
				position: absolute;
				right: -12rpx;
				width: 30rpx;
				height: 30rpx;
				background-color: #e7e7e7;
				border-radius: 100%;
			}
		}

		.header {
			width: 100%;
			height: 180rpx;
			background-color: #fff;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.05);
			position: relative;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;

			.title {
				font-size: 30rpx;
				font-weight: bold;
				height: 100rpx;
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: -20rpx;
			}

			.statusBox {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				width: 100%;
				height: 150rpx;

				.status {
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;

					text {
						font-size: 24rpx;
					}
				}

				.line {
					width: 80rpx;
					border-top: 1px dashed #e2e2e2;
					height: 1px;
					margin: 0 12rpx;
					margin-top: -30rpx;
				}
			}

			.button {
				padding: 8rpx 20rpx;
				font-size: 24rpx;
				color: #fff;
				border-radius: 100rpx;
				position: relative;

				button {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}

		.content {
			width: 100%;
			background-color: #f7f7f7;

			.storeBox {
				width: 90%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1px solid #e7e7e7;
				height: 88rpx;

				.store {
					width: 70%;
					display: flex;
					flex-direction: column;
					align-content: center;
					justify-content: center;

					.name {
						color: #343434;
						width: 100%;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}

					.adds {
						color: #999;
						font-size: 26rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}

				.buttonBox {
					width: 30%;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					.button {
						width: 80rpx;
						height: 80rpx;
						border-radius: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-left: 20rpx;
					}
				}
			}

			.goodsBox {
				margin-top: 12rpx;
				height: 320rpx;
				overflow-y: scroll;

				.goods {
					display: flex;
					align-items: center;
					width: 90%;
					margin: 0 auto;
					color: #343434;
					padding-bottom: 30rpx;

					.goods_pic {
						width: 20%;
						margin-right: 10px;
					}

					.infoBox {
						width: 50%;

						.title {
							width: 100%;
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;

							text {
								font-size: 24rpx;
								padding-left: 10rpx;
							}
						}

						.label {
							color: #999;
							font-size: 26rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
					}

					.number {
						width: 25%;
						display: flex;
						justify-content: flex-end;
						padding-right: 10rpx;
					}

					.ranger {
						width: 50%;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						padding-right: 10rpx;
					}

					.price {
						width: 25%;
						display: flex;
						justify-content: flex-end;
					}
				}

				.total {
					width: 90%;
					display: flex;
					margin: 0 auto;
					border-top: 1px dashed #e7e7e7;
					height: 90rpx;
					align-items: center;

					.name {
						width: 50%;
						display: flex;
						justify-content: flex-start;
						color: #343434;
					}

					.price {
						width: 50%;
						display: flex;
						justify-content: flex-end;
						color: #343434;
					}
				}
			}

			.footer {
				border-top: 1px solid #e7e7e7;
				width: 90%;
				margin: 0 auto;
				margin-top: -16rpx;
				color: #999;
				font-size: 26rpx;
				height: 82rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.label {
					display: flex;
					align-items: center;
					height: 70rpx;

					.title {
						flex: 0 0 25%;
					}

					.nums {
						flex: 0 0 75%;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}

	.goodsBox_com {
		margin-top: 12rpx;
		overflow-y: scroll;

		.goods_com {
			display: flex;
			align-items: center;
			width: 90%;
			margin: 0 auto;
			color: #343434;
			padding-bottom: 30rpx;

			.id {
				width: 8%;
				margin-right: 10px;
			}

			.goods_pic {
				width: 20%;
				margin-right: 10px;
			}

			.infoBox {
				width: 50%;

				.title {
					width: 100%;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;

					text {
						font-size: 24rpx;
						padding-left: 10rpx;
					}
				}

				.label {
					color: #999;
					font-size: 26rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.number {
				width: 25%;
				display: flex;
				justify-content: flex-end;
				padding-right: 10rpx;
			}

			.ranger {
				width: 50%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding-right: 10rpx;
			}

			.price {
				width: 25%;
				display: flex;
				justify-content: flex-end;
			}

			.invote_number {
				width: 25%;
				display: flex;
				justify-content: flex-end;
			}
		}

		.total {
			width: 90%;
			display: flex;
			margin: 0 auto;
			border-top: 1px dashed #e7e7e7;
			height: 90rpx;
			align-items: center;

			.name {
				width: 50%;
				display: flex;
				justify-content: flex-start;
				color: #343434;
			}

			.price {
				width: 50%;
				display: flex;
				justify-content: flex-end;
				color: #343434;
			}
		}
	}

	.showContent {
		position: fixed;
		bottom: -2000rpx;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		transition: all .5s;

		.bg {
			position: absolute;
			z-index: 1001;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}

		.showBox {
			position: absolute;
			bottom: 0;
			width: 100%;
			min-height: 600rpx;
			z-index: 1002;
			background-color: #fff;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			box-shadow: 0 0 20rpx rgba(0, 0, 0, .08);

			.pheader {
				font-size: 32rpx;
				text-align: center;

				padding: 20rpx 0 10rpx;
			}

			.qrText {
				background-color: #CAB88F;
				width: 300rpx;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60rpx;
				border-radius: 6rpx;
				color: #fff;

				font-size: 30rpx;
			}

			.images {
				width: 400rpx;
				height: 350rpx;
				margin: 0 auto;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 400rpx;
					height: 400rpx;
				}
			}

			.payTime {
				text-align: center;
				padding: 20rpx 0 0;

			}
		}
	}
</style>
