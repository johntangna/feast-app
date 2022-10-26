<template>
	<view class="content">
		<view class="login">
			<image class="logo" :src="shopData.shop_logo" />
			<view class="title" :style="'color:'+template.color.color3">{{shopData.shop_name}}</view>
			<view class="text" :style="'color:'+template.color.color5">首次进入需要授权才能使用哦</view>
			<view class="loginBox">
				<button :loading="logining" :disabled="logining" class="userlogin"
					:style="'background-color:'+template.color.color1" @click="userlogin">授权登录</button>
				<button class="userlogin navigateBack" @click="navigateBack()"
					:style="'color:'+template.color.color5">暂不登陆</button>
			</view>

		</view>
	</view>
</template>

<script>
	import Icon from "@/components/icon/icon.vue";
	import Request from "@/static/utils/request.js"
	const app = getApp()
	export default {
		components: {
			Icon
		},
		data() {
			return {
				template: uni.getStorageSync('__yipinTemplateConfig'),
				shopData: uni.getStorageSync('__yipinShopInfo'),
				wxCode: '',
				focus: true,
				logining: false,
			}
		},
		onLoad() {
			let self = this;
			self.getWechatLogin();
		},
		methods: {
			getWechatLogin() {
				let self = this;
				// uni.login({
				// 	provider: 'weixin',
				// 	success: function(wxs) {
				// 		self.wxCode = wxs.code;
				// 	}
				// })
			},
			jsApi(res) {
				app.globalData.user = true;
				app.globalData.user_name = res.data.data.nickname;
				app.globalData.user_avator = res.data.data.avatar;
				app.globalData.user_number = Number(res.data.data.jobNumber)
				uni.showToast({
					title: "授权成功！",
					icon: "success"
				})
				uni.setStorage({
					key: '__yipinUserInfo',
					data: {
						token: res.data.data.jobNumber,
						nikename: res.data.data.jobNumber
					}
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 500);
			},
			userlogin(e) {
				let self = this;
				if (this.logining) return
				this.logining = true
				uni.request({
					url: "http://bigeater.onmouse.cn/api/api/dingtalk/login?code=" +
						this.crpId,
					method: "POST",
					success: async (res) => {
						const info = await Request.saveOrUpdateUser(
							"bigmouth_userinfo",
							Number(res.data.data.jobNumber), "user_number")
						self.jsApi(res)
					},
					fail(err) {
						alert(JSON.stringify(err))
					}
				})
			},
			navigateBack() {
				uni.reLaunch({
					url: "/pages/tabbar"
				});
			},

		}
	}
</script>

<style lang="less">
	page {
		background-color: #FFFFFF;
	}

	.login {
		height: 60vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.logo {
			width: 120rpx;
			height: 120rpx;
			border-radius: 100%;
		}

		.title {
			color: #27323f;
			font-size: 32rpx;
			padding-top: 20rpx;
		}

		.text {
			color: #27323f;
			padding-top: 20rpx;
			font-size: 26rpx;
		}

		.loginBox {
			padding-top: 50rpx;

			.input {
				width: 350rpx;
				height: 70rpx;
				border: 1px solid #f5f5f5;
				border-radius: 6rpx;
				text-align: center;
			}

			.send {
				color: #FFFFFF;
				margin-top: 20rpx;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26rpx;
				border-radius: 6rpx;
			}

			.userlogin {
				background-color: #f59072;
				width: 250rpx;
				height: 70rpx;
				font-size: 28rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0;
				color: #fff;
				border-radius: 6rpx;
				margin-bottom: 30rpx;
			}

			.navigateBack {
				background-color: #f8f8f8;
				color: #979d9f;
				margin-top: 10rpx;
			}

			button::after {
				border: 0;
			}
		}
	}
</style>
