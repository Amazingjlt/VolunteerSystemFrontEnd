<template>
  <view class="container">
	  <view class="subtitle">请填写<text class="highlight">适应性考试</text>实际得分</view>
    <form class="score">  
      <view class="input-group">
        <text>语文：</text>
        <input v-model="formData.Chinese" placeholder="满分[120]分" min="0" max="120" required/>
      </view>
	  <view class="input-group">
        <text>数学：</text>
        <input v-model="formData.math" placeholder="满分[100]分" min="0" max="100" required />
      </view>
	  <view class="input-group">
	    <text>物理：</text>
	    <input v-model="formData.physics" placeholder="满分[70]分" min="0" max="70" required />
	  </view>
	  <view class="input-group">
	    <text>英语（含听说）：</text>
	    <input v-model="formData.english" placeholder="满分[100]分" min="0" max="100" required />
	  </view>
	  <view class="input-group">
	    <text>化学：</text>
	    <input v-model="formData.chemistry" placeholder="满分[50]分" min="0" max="50" required />
	  </view>
	  <view class="input-group">
	    <text>历史：</text>
	    <input v-model="formData.history" placeholder="满分[70]分"min="0" max="70" required />
	  </view>
	  <view class="input-group">
	    <text>通法：</text>
	    <input v-model="formData.general" placeholder="满分[50]分"min="0" max="50" required />
	  </view>
	  <view class="input-group">
	    <text>体育：</text>
	    <input v-model="formData.sports" placeholder="满分[50]分" min="0" max="50" required/>
	  </view>
	  </form>
	  <view class="footer">
		  <button class="submit-btn"type="2"@click="submitData">提交</button>
	  </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        Chinese: '',
        math: '',
		physics:'',
		english:'',
		chemistry:'',
		history:'',
		general:'',
		sports:''
      }
    };
  },
  methods: {
    // 提交数据到后端
    submitData() {
	// 显示提交中的 loading 提示
	  uni.showLoading({ title: '提交中...' })
      wx.request({
        url: 'http://127.0.0.1:4523/m1/5818861-5504164-default/submit',  // 后端接口URL
        method: 'POST',
        data: {
			formData:this.formData
		},  // 提交的数据
        success: (res) => {
		  uni.hideLoading()
          if (res.data.success) {
            uni.showToast({
              title: '提交成功',
              icon: 'success'
            })
			
			// 跳转到结果页面
			// uni.navigateTo({
			// 	url: '/pages/result/index'
			// })
          } else {
            uni.showToast({
              title: '提交失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
		  uni.hideLoading()
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
	  position: relative;
	  padding: 20px;
	  height: 100vh;
	  box-sizing: border-box;
	}
	
	.subtitle{
		display:flex;
		margin-bottom: 30px;
		font-size: 38rpx;
		font-weight: 500;
		color:black;
	}
	
	.highlight{
		color:#2eceb4;
		font-weight: 600;
		margin:0 8px;
	}
	
	.input-group {
	  display: flex;
	  margin-top:15px;
	  padding-bottom: 15px;
	  border-bottom:1px solid grey;
	}
	
	.submit-btn{
		background-image: linear-gradient(to right, #4cd38e, #2eceb4);
		color:#ffffff;
		position: absolute;
		border-radius: 30px;
		bottom:20px;
		left:10px;
		right:10px;
	}

</style>
