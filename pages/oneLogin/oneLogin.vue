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
					fetchUserID(res.code); // 注意传入 res.code
				} else {
					console.log('前端获取登录Code失败！' + res.errMsg);
				}
			}
		});
	});
	async function fetchUserID(code) {
		try {
			const userid = await getOpenID(code);
			console.log("userID:"+userid);
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