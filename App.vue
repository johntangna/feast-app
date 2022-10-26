<script>
	import Vue from 'vue';
	import "static/style/index.css"
	import Links from 'static/utils/links.js';
	import Request from 'static/utils/request.js';
	import jsonP from 'vue-jsonp'
	import * as dd from "dingtalk-jsapi";
	export default {
		onLaunch: function() {
			let self = this;
			Vue.prototype.Url = Links.links;
			Vue.prototype.Get = Request.get;
			Vue.prototype.Post = Request.post;
			Vue.prototype.Config = Request.config;
			Vue.prototype.GetUcDb = Request.getUcDb();
			Vue.prototype.$jsonp = jsonP;
			uni.getSystemInfo({
				success: function(e) {
					console.log(e)
					// "16660679449977420895"
					Vue.prototype.deviceId = e.deviceId;
					Vue.prototype.windowWidth = e.windowWidth;
					Vue.prototype.WindowHeight = e.windowHeight;
					Vue.prototype.IphoneX = e.model.search("iPhone X");
					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.StatusBarHeight = e.statusBarHeight + custom.height;
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.SafeHeight = e.safeArea.height;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif
				}
			});
			self.$options.wechatLogin();
			self.$options.getShopInfo();
			try {
				dd.runtime.permission.requestAuthCode({
					corpId: "dingcb0caf4f1869f7e6", //三方企业ID
					onSuccess(result) {
						Vue.prototype.crpId = result.code
					},
					onFail: function(err) {
						alert(JSON.stringify(err))
					},
				})
			} catch (e) {
				//TODO handle the exception
				alert(e.message)
			}
		},
		wechatLogin() {},
		getShopInfo() {
			let self = this;
			Request.getShopInfo().then(res => {
				console.info(res)
				if (res.result.errCode == 0) {
					uni.setStorage({
						key: '__yipinShopInfo',
						data: res.result.data[0]
					});
				} else {
					uni.removeStorageSync('__yipinShopInfo');
				}
			});
		},
		globalData: {
			user: false
		}
	}
</script>

<style lang="less">
	page {
		font-size: 28rpx;
		height: 100%;

		.content {
			height: 100%;
		}
	}

	image {
		width: 100%;
		height: 100%;
		display: block;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.lineBottom:after {
		position: absolute;
		content: '';
		width: 100%;
		left: 0;
		bottom: 0;
		height: 1px;
		background-color: #f5f5f5;
		transform: scale(1, 0.5);
		transform-origin: center bottom;
	}

	.loadingBox {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;

		.loading {
			width: 80rpx;
			height: 80rpx;
		}
	}
</style>
