<template>
	<view>
		<button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">唤起授权</button>
	</view>
</template>

<script setup>
	import {
		getOpenID,
		getPhone
	} from '@/api/application.js';
	import {
		onMounted
	} from 'vue';
	onMounted(() => {
		wx.login({
			success: (res) => {
				if (res.code) { // 微信登录成功 已拿到code
					fetchOpenID(res.code); // 注意传入 res.code
				} else {
					console.log('登录失败！' + res.errMsg);
				}
			}
		});
	});
	async function fetchOpenID(code) {
		try {
			const openID = await getOpenID(code);
			console.log(openID);

		} catch (error) {
			console.error('获取openid失败:', error);
			wx.showToast({
				title: '获取openid失败',
				icon: 'none'
			});
		}
	}

	// function getPhoneNumber(e) {
	// 	console.log(e.detail.code) // 动态令牌
	// 	try {
	// 		const phone = getPhone(e.detail.code);
	// 		console.log(phone);

	// 	} catch (error) {
	// 		console.error('获取phone失败:', error);
	// 		wx.showToast({
	// 			title: '获取phone失败',
	// 			icon: 'none'
	// 		});
	// 	}
	// 	// console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
	// 	// console.log(e.detail.errno) // 错误码（失败时返回）
	// }
	function onGetPhoneNumber(e) {
		if (e.detail.errMsg == "getPhoneNumber:fail user deny") { //用户决绝授权  

			//拒绝授权后弹出一些提示  

		} else { //允许授权  
			console.log(e);
			//const phone = getPhone(e.detail.code);
			//console.log(phone);

		}
	}
</script>

<style>

</style>