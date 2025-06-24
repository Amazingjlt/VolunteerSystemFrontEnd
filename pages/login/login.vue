<template>
	
	<!-- 已经被废弃了，别管 -->
	
	
  <view class="container">
    <!-- 欢迎文字 -->
    <text class="welcome-text">欢迎使用佛山中考志愿填报推荐</text>
    
    <!-- 手机号输入框 -->
    <view class="input-box">
      <input 
        type="number" 
        v-model="phone" 
        placeholder="请输入手机号"
        maxlength="11"
        @input="handlePhoneInput"
      />
      <text 
        v-if="phone" 
        class="clear-icon" 
        @click="phone = ''"
      >×</text>
    </view>

    <!-- 登录按钮 -->
    <button 
      class="login-btn" 
      :disabled="!isValidPhone" 
      @click="handleLogin"
    >一键登录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',       // 绑定的手机号
      isValidPhone: false // 手机号验证状态
    }
  },
  onLoad() {
    const openid = uni.getStorageSync('openid');
    if (openid) {
      uni.redirectTo({ url: '/pages/page1/page1' });
    }
  },
  methods: {
    // 手机号输入实时验证
    handlePhoneInput() {
      const reg = /^1[3-9]\d{9}$/
      this.isValidPhone = reg.test(this.phone)
    },

    // 登录逻辑
    async handleLogin1() {
      if (!this.isValidPhone) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return
      }

      try {
        // 1. 获取微信登录code[1,3](@ref)
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: resolve,
            fail: reject
          })
        })

        if (!loginRes.code) {
          throw new Error('获取code失败: ' + loginRes.errMsg)
        }

        // 2. 发送请求到后端
        const res = await uni.request({
          url: '/login',
          method: 'POST',
          header: {
							"Content-Type": "application/json" // 关键设置
					},
          data: {
            phone: this.phone,
            code: loginRes.code
          }
        })

        // 3. 存储openid[1,7](@ref)
        if (res.data.openid) {
          uni.setStorageSync('openid', res.data.openid)
          uni.setStorageSync('user_id', res.data.user_id)
          uni.showToast({ title: '登录成功' })
          // 跳转到首页
          uni.reLaunch({ url: '/pages/page1/page1' })
        }
      } catch (err) {
        console.error('登录失败:', err)
        uni.showToast({ title: '登录失败，请重试', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
}

.welcome-text {
  display: block;
  font-size: 43rpx;
  color: #357e37;
  text-align: center;
  margin: 120rpx 0 160rpx;
}

.input-box {
  position: relative;
  margin-bottom: 130rpx;
  border-bottom: 1rpx solid #eee;
  padding: 20rpx 70rpx;
}

.clear-icon {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40rpx;
  color: #999;
}

.login-btn {
  background: #00cd96;
  color: #ffffff;
  border-radius: 50rpx;
}

/* 禁用按钮样式 */
button[disabled] {
  background: #ccc;
  color: #fff;
}
</style>
