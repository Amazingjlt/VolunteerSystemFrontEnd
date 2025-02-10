<template>
  <view class="container">
    
    <view class="form-group">
      <text class="subtitle">户籍分类</text>
	  <view class="select">
		  <view class="select-card" :class="{active: formData.type === '深户'}"@click="handleSelect('深户')" >
		      <text class="label">深户</text>
<!-- 		      <view class="check-icon" v-if="formData.type === '深户'">
		          ✓
		      </view> -->
		    </view>
		    
		  <!-- 非深户选项 -->
		    <view class="select-card" :class="{active: formData.type === '非深户'}"@click="handleSelect('非深户')">
		      <text class="label">非深户</text>
<!-- 		      <view class="check-icon" v-if="formData.type === '非深户'">
		          ✓
		      </view> -->
		    </view>
	  </view>
	  
    </view>
	  <view class="footer">
		  <button class="next-btn" type="primary" :disabled="!formData.type" @click="nextPage">下一页</button>
	  </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        type:''
      }
    };
  },
  methods: {
	      handleSelect(type) {
	        this.formData.type = type
	      },
    // 页面跳转并传递数据
    nextPage() {
		 if (!this.formData.type) {
		        uni.showToast({ title: '请选择户籍类型', icon: 'none' })
		        return
		      }
      // 发起请求到后端
      wx.request({
        url: 'http://127.0.0.1:4523/m1/5818861-5504164-default/submit',  // 后端接口URL
        method: 'POST',
        data: { type: this.formData.type },  // 请求体携带的用户数据
        success: (res) => {
          if (res.statusCode === 200&& res.data.success) {
            uni.navigateTo({
              url: '/pages/page2/page2'  // 跳转到第二页
            });
          } else {
            uni.showToast({
              title: '提交失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '请求失败',
            icon: 'none'
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  position:relative;
  height:100vh;
  padding: 30rpx;
  box-sizing: border-box;
}


.subtitle {
  font-size: 35rpx;
  font-weight: 500;
  margin-bottom: 20rpx;
  display: block;
}

.select{
	display:flex;
}


.select-card{
	font-size: 22rpx;
	color:#848484;
	
	display: flex;
	width:30vw;
	height:40px;
	background-color:#f7f7f7;
	border-radius: 30px;
	margin-top: 15px;
	margin-left:10px;
	justify-content: center;
	align-items: center;
}
.select-card.active {
  background-image: linear-gradient(to right, #4cd38e, #2eceb4);
  color:#ffffff;
}

/* .footer{
	box-shadow: 0 -4px 8px rgba(0,0,0,0.2);
} */

.next-btn {
  background-image: linear-gradient(to right, #4cd38e, #2eceb4);
  position: absolute;
  border-radius: 30px;
  bottom:20px;
  left:10px;
  right:10px;
}
</style>
