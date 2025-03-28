<template>
  <view class="container">
    
    <view class="form-group">
      <text class="subtitle"><text class="highlight">学籍地</text>选择</text>
	  <view class="container">
	    <radio-group class="radio-group" @change="onSelectChange">
	      <label class="radio-item">
	        <radio value="禅城" /> 禅城区
	      </label>
	      <label class="radio-item">
	        <radio value="南海" /> 南海区
	      </label>
	      <label class="radio-item">
	        <radio value="顺德" /> 顺德区
	      </label>
	      <label class="radio-item">
	        <radio value="三水" /> 三水区
	      </label>
	      <label class="radio-item">
	        <radio value="高明" /> 高明区
	      </label>
	    </radio-group>
	  </view>
    </view>
	  <view class="footer">
		  <button class="next-btn" @click="goToNextPage">下一页</button>
	  </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
		selectedArea: ''  // 用于保存选中的学籍地
    };
  },
  methods: {
	// 用户选择学籍地时的回调
    onSelectChange(e) {
      this.selectedArea = e.detail.value;
    },
    // 页面跳转并传递数据
	goToNextPage() {
		const selectedArea = this.selectedArea;

		if (!selectedArea) {
		wx.showToast({
			title: '请选择学籍地',
			icon: 'none'
		});
		return;
		}
	
		// 跳转到下一页，并传递选中的学籍地
		wx.navigateTo({
		url: `/pages/page2/page2?area=${selectedArea}`
		});
	},
	},
	onLoad() {

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



.subtitle{
	display:flex;
	margin-bottom: 30rpx;
	font-size: 45rpx;
	font-weight: 500;
	color:black;
}

.highlight{
	color:#2eceb4;
	font-weight: 600;
	margin:0 8rpx;
}


.radio-group {
  margin-bottom: 20px;
}

.radio-item {
  display: block;
  margin-bottom: 30rpx;
  font-size:40rpx;
  
}

.next-btn {
  background-image: linear-gradient(to right, #4cd38e, #2eceb4);
  position: absolute;
  border-radius: 30px;
  bottom:20px;
  left:10px;
  right:10px;
  color:#ffffff;
}

.container {
  padding: 20px;
}


</style>
