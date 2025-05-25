<template>
	<view class="container">

		<!-- 顶部区域：雪人 & 欢迎文案 -->
		<view class="header">

			<text class="welcome-text">你好，欢迎使用佛山中考志愿填报推荐</text>
		</view>

		<!-- 一键登录按钮 -->
		<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
			一键登录 开始预测
		</button>
	</view>

	<!-- 两个功能卡片 -->
	<view class="card-container">
		<view class="card-item">
			<text class="card-title">官方分数线数据，精准预测中考志愿</text>
		</view>
		<view class="card-item">
			<text class="card-title">专家免费1v1咨询</text>
		</view>
		<view class="card-item">
			<text class="card-title">学科针对提升建议</text>
		</view>
		<view class="card-item">
			<text class="card-title">中考冲分AI推荐</text>
		</view>
	</view>
</template>

<script setup>
	import {
		getOpenID,
		setPhone
	} from '@/api/application.js';
	import {
		onMounted
	} from 'vue';
	onMounted(() => {
		wx.login({
			success: (res) => {
				if (res.code) { // 微信登录成功 已拿到code
					fetchUserID(res.code); // 注意传入 res.code
				} else {
					console.log('前端获取登录Code失败！' + res.errMsg);
				}
			}
		});

		//只需要获取一次手机号
		let phoneState = uni.getStorageSync("phoneState");
		if (phoneState == 'success') {
			jumpToPage();
		}
	});
	async function fetchUserID(code) {
		try {
			const userid = await getOpenID(code);
			console.log("userID:" + userid);
			uni.setStorageSync('user_id', userid);

		} catch (error) {
			console.error('从后端获取userID失败:', error);
			wx.showToast({
				title: '获取userid失败',
				icon: 'none'
			});
		}
	}

	function onGetPhoneNumber(e) {
		if (typeof e == "undefined") return;
		if (e.detail.errMsg == "getPhoneNumber:fail user deny") { //用户拒绝授权  
			wx.showToast({
				title: '请点击“允许”按钮授予我们相关权限',
				icon: 'none'
			});
		} else if (e.detail.errMsg == "getPhoneNumber:fail no permission") {
			console.log("该APPID没有获取手机号权限");
		} else { //允许授权
			let userid = uni.getStorageSync('user_id');
			setPhone(e.detail.code, userid, jumpToPage);
		}
	}

	function jumpToPage() {
		// 跳转到首页
		uni.reLaunch({
			url: '/pages/page1/page1'
		})
	}
</script>

<style>
	/* 整体背景：可根据需求换为纯色或渐变 */
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		/* 可以使用纯色背景，也可以使用渐变 */
		background: linear-gradient(180deg, #00cd96, #ffffff);
		width: 100%;
		min-height: 30vh;
		/* 保证全屏 */
		box-sizing: border-box;
		padding-bottom: 100rpx;
		/* 预留下方空间 */
	}

	/* 顶部区域样式 */
	.header {
		margin-top: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.welcome-text {
		margin-top: 20rpx;
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
	}

	/* 卡片容器：保证两个卡片分布均匀 */
	.card-container {
		margin-top: 80rpx;
		display: flex;
		flex-direction: column;
		/* 上下排列 */
		align-items: center;
		width: 100%;
	}

	/* 单个卡片：宽高、内边距、背景渐变、圆角、阴影和悬停效果 */
	.card-item {
		width: 1000rpx;
		height: 150rpx;
		background: linear-gradient(135deg, #70e3c4, #f9f9f9);
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		margin-bottom: 20rpx;
		/* 卡片间距 */
	}

	.card-title {
		margin-top: 20rpx;
		font-size: 32rpx;
		color: #797979;
		font-weight: bold;
	}


	/* 登录按钮 */
	.login-btn {
		margin-top: 60rpx;
		width: 600rpx;
		height: 90rpx;
		line-height: 90rpx;
		background-color: #00cd96;
		color: #ffffff;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		border-radius: 45rpx;
	}
</style>
