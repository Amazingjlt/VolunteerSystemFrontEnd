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
					console.log("获取登录Code成功"+ res.code)
				} else {
					console.log('前端获取登录Code失败！' + res.errMsg);
				}
			}
		});
	});
	async function fetchOpenID(code) {
		try {
			const openID = await getOpenID(code);
			console.log("openID:"+openID);

		} catch (error) {
			console.error('从后端获取openid失败:', error);
			wx.showToast({
				title: '获取openid失败',
				icon: 'none'
			});
		}
	}

	function onGetPhoneNumber(e) {
		if(typeof e == "undefined")	return;
		if (e.detail.errMsg == "getPhoneNumber:fail user deny") { //用户拒绝授权  
			wx.showToast({
				title: '请授权',
				icon: 'none'
			}); 
		} else if(e.detail.errMsg == "getPhoneNumber:fail no permission"){
			console.log("该APPID没有获取手机号权限（我们得等郑总完成小程序认证）");
		}
		else{ //允许授权  
			console.log(e);
			//const phone = getPhone(e.detail.code);
			//console.log(phone);

		}
	}
</script>

<style>

</style>