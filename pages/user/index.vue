<template>
	<view class="content">
		<view class="header">
			<view class="bg a" :style="'background-color:'+template.color.color1"></view>
			<view class="bg b" :style="'background-color:'+template.color.color1"></view>
			<view class="bg c" :style="'background-color:'+template.color.color1"></view>
			<view class="infoBox">
				<view class="user" @click="reLogin">
					<view class="avatar">
						<image :src="user_avator ? user_avator : template.overall.licence_list[0].pics" mode=""></image>
					</view>
					<view class="info">
						<view class="name" :style="'color:'+template.color.color2">{{this.user_name ? this.user_name : "欧宝"}}</view>
						<!-- <view v-if="userDetails.level_title" class="score"><text :style="'background-color:'+template.color.color1">{{userDetails.level_title}}</text></view> -->
						<view class="score none"><text :style="'background-color:'+template.color.color5">{{user_number}}</text></view>
					</view>
				</view>
				<!-- <view class="menu" :style="'color:'+template.color.color2">
					<view class="label" @click="getMenuListTap('/pages/user/coupons')">
						<view class="num">{{couponList.length}}</view>
						<view class="text">优惠券</view>
					</view>
					<view class="label">
						<view class="num"><text>¥</text>{{userDetails.moneys}}</view>
						<view class="text">余额</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="menuBox">
			<!-- <view class="label" @click="getMenuListTap('/pages/user/member')">
				<view v-if="template.overall.licence_list[0].pics" class="icons">
					<image :src="template.overall.licence_list[0].pics" lazy-load></image>
				</view>
				<uni-icons v-else class="icons" type="huiyuanlifttime" size="19" :color="template.color.color1"></uni-icons>
				<view class="text" :style="'color:'+template.color.color1">会员中心</view>
				<uni-icons class="left" type="left" size="15" color="#999"></uni-icons>
			</view> -->
			<view class="label" @click="getMenuListTap('/pages/order/list')">
				<uni-icons class="icons" type="aiguifanfile" size="20" :color="template.color.color2"></uni-icons>
				<view class="text" :style="'color:'+template.color.color2">全部预约单 <text v-if="orderStatus.no_payment" :style="'background-color:'+template.color.color1">{{orderStatus.no_payment}}</text></view>
				<uni-icons class="left" type="left" size="15" color="#999"></uni-icons>
			</view>
			<!-- <view class="label" @click="getMenuListTap('/pages/user/paypal')">
				<view v-if="template.user.uicon2" class="icons">
					<image :src="template.user.uicon2" lazy-load></image>
				</view>
				<uni-icons v-else class="icons" type="youhui" size="20" :color="template.color.color2"></uni-icons>
				<view class="text" :style="'color:'+template.color.color2">优惠买单</view>
				<uni-icons class="left" type="left" size="15" color="#999"></uni-icons>
			</view> -->
			<view class="label" @click="getMenuListTap('/pages/user/favorite')">
				<uni-icons class="icons" type="shoucang1" size="20" :color="template.color.color2"></uni-icons>
				<view class="text" :style="'color:'+template.color.color2">我的收藏</view>
				<uni-icons class="left" type="left" size="15" color="#999"></uni-icons>
			</view>
			<!-- <view class="label" @click="getMenuListTap('/pages/user/adslist')">
				<view v-if="template.user.uicon4" class="icons">
					<image :src="template.user.uicon4" lazy-load></image>
				</view>
				<uni-icons v-else class="icons" type="shouhuodizhi" size="20" :color="template.color.color2"></uni-icons>
				<view class="text" :style="'color:'+template.color.color2">我的地址</view>
				<uni-icons class="left" type="left" size="15" color="#999"></uni-icons>
			</view> -->
		</view>
		
		
		<about></about>
	</view>
</template>

<script>
	import UniIcons from "@/components/icon/icon.vue"
	import About from "@/components/about/about.vue"
	const app = getApp()
	export default {
		components: {UniIcons, About},
		data() {
			return {
				template: uni.getStorageSync('__yipinTemplateConfig'),
				userDetails: {
					moneys: 0,
					score: 0
				},
				couponList: [],
				orderStatus: '',
				user_number: "",
				user_name: "",
				user_avator: ""
			}
		},
		onReady() {
			this.getUserDetails();
			this.getOrderStatus();
			this.getCouponsUserList();
		},
		mounted() {
			this.user_number = app.globalData.user_number
			this.user_name = app.globalData.user_name
			this.user_avator = app.globalData.user_avator
		},
		methods: {
			reLogin(){
				uni.navigateTo({
					url: "/pages/user/login"
				})
			},
			getOrderStatus() {
				let self = this;
				self.Get(self.Url.orderStatus, {}).then(res => {
					if(res.code === 0){
						self.orderStatus = res.data;
					}
				})
			},
			getMenuListTap(url) {
				if(app.globalData.user){
					uni.navigateTo({url: url});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			getUserDetails() {
				let self = this;
				if(app.globalData.user){
					self.Get(self.Url.userDetails, {}).then(res => {
						if(res.code === 0){
							self.userDetails = res.data;
						}
					})
				}
			},
			getCouponsUserList() {
				let self = this;
				self.Get(self.Url.couponsUserList, {status: 1}).then(res => {
					if(res.code === 0){
						self.couponList = res.data;
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.header{
		width: 100%;
		height: 350rpx;
		background-color: #fff;
		overflow: hidden;
		position:relative;
		.bg{
			position: absolute;
			width: 200rpx;
			height: 200rpx;
			border-radius: 100%;
			opacity: .1;
			z-index: 1;
		}
		.a{
			top: -50rpx;
			width: 300rpx;
			height: 300rpx;
			left: -50rpx;
		}
		.b{
			width: 120rpx;
			height: 120rpx;
			right: -30rpx;
			top: 100rpx;
		}
		.c{
			bottom: -80rpx;
			right: 130rpx;
		}
		.infoBox{
			position: absolute;
			width: 100%;
			height: 350rpx;
			top: 0;
			left: 0;
			z-index: 2;
			.user{
				display: flex;
				align-items: center;
				width: 90%;
				margin: 0 auto;
				padding: 50rpx 0;
				.avatar{
					display: block;
					overflow: hidden;
					width: 120rpx;
					height: 120rpx;
					border-radius: 100%;
					box-shadow: 0 0 10rpx rgba(0,0,0,.05);
				}
				.info{
					padding-left: 30rpx;
					.name{
						font-weight: bold;
					}
					.score{
						display: flex;
						align-items: center;
						padding-top: 10rpx;
						text{
							font-size: 24rpx;
							padding: 2rpx 16rpx;
							color: #fff;
							border-radius: 100rpx;
						}
					}
				}
			}
			.menu{
				width: 90%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 auto;
				height: 120rpx;
				.label{
					flex: 0 0 38%;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					.num{
						font-weight: bold;
						font-size: 36rpx;
						display: flex;
						align-items: flex-end;
						text{
							font-size: 24rpx;
							padding-bottom: 4rpx;
							padding-right: 4rpx;
						}
					}
					.text{
						font-size: 26rpx;
						padding-top: 2rpx;
					}
				}
			}
		}
	}
	.menuBox{
		background-color: #fff;
		padding: 20rpx 0;
		.label{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90%;
			margin: 0 auto;
			height: 110rpx;
			position: relative;
			.icons{
				flex: 0 0 8%;
				image{
					width: 40rpx;
					height: 40rpx;
				}
			}
			.text{
				flex: 0 0 82%;
				display: flex;
				align-items: center;
				text{
					width: 32rpx;
					height: 32rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 100%;
					font-size: 24rpx;
					color: #fff;
					margin-left: 20rpx;
				}
			}
			.left{
				flex: 0 0 10%;
				display: flex;
				justify-content: flex-end;
			}
		}
	}
</style>
