<template>
	<view>
		<button class="btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">一键登录</button>
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
		let phoneState=uni.getStorageSync("phoneState");
		if (phoneState=='success'){
			jumpToPage();
		}
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
				title: '请点击“允许”按钮授予我们相关权限',
				icon: 'none'
			}); 
		} else if(e.detail.errMsg == "getPhoneNumber:fail no permission"){
			console.log("该APPID没有获取手机号权限");
		}
		else{ //允许授权
			let userid = uni.getStorageSync('user_id');
			setPhone(e.detail.code,userid,jumpToPage);
		}
	}
	
	function jumpToPage() {
        // 跳转到首页
        uni.reLaunch({ url: '/pages/page1/page1' })
	}
	
</script>

<style>
	.btn{
		background-image: linear-gradient(to right, #4cd38e, #2eceb4);
		color:#ffffff;
		position: absolute;
		border-radius: 30px;
		top:50px;
		left:10px;
		right:10px;
	}
</style>