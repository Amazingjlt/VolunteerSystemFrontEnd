<!-- <template>
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


</style> -->

<template>
  <view class="container">
    <!-- Area Selection from page1.vue -->
    <view class="form-group">
      <text class="subtitle">1.&nbsp;<text class="highlight">学籍地</text>选择</text>
      <view class="radio-container">
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

    <!-- Score Input from page2.vue -->
    <view class="score-section">
      <view class="subtitle">2.&nbsp;请填写<text class="highlight">二模考试</text>实际得分</view>
      <form class="score">
        <view class="input-group">
          <text>语文：</text>
          <input v-model="formData.chinese" type="number" placeholder="满分[120]分" min="0" max="120" @blur="validateField('chinese', 120)" />
        </view>
        <view class="input-group">
          <text>数学：</text>
          <input v-model="formData.math" type="number" placeholder="满分[120]分" min="0" max="120" @blur="validateField('math', 120)" />
        </view>
        <view class="input-group">
          <text>英语（含听说）：</text>
          <input v-model="formData.english" type="number" placeholder="满分[120]分" min="0" max="120" @blur="validateField('english', 120)" />
        </view>
        <view class="input-group">
          <text>物理：</text>
          <input v-model="formData.physics" type="number" placeholder="满分[100]分" min="0" max="100" @blur="validateField('physics', 100)" />
        </view>
        <view class="input-group">
          <text>化学：</text>
          <input v-model="formData.chemistry" type="number" placeholder="满分[120]分" min="0" max="120" @blur="validateField('chemistry', 100)" />
        </view>
        <view class="input-group">
          <text>历史：</text>
          <input v-model="formData.history" type="number" placeholder="满分[60]分" min="0" max="60" @blur="validateField('history', 60)" />
        </view>
        <view class="input-group">
          <text>政治：</text>
          <input v-model="formData.politics" type="number" placeholder="满分[60]分" min="0" max="60" @blur="validateField('politics', 60)" />
        </view>
        <view class="input-group">
          <text>体育：</text>
          <input v-model="formData.physical" type="number" placeholder="满分[60]分" min="0" max="60" @blur="validateField('physical', 60)" />
        </view>
      </form>
    </view>

    <!-- Footer with Submit Button -->
    <view class="footer">
      <button class="submit-btn" type="2" @click="submitData" :disabled="isSubmitting">提交</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedArea: '', // 保存选中的学籍地
      isSubmitting: false, // 提交状态标识
      formData: {
        chinese: '',
        math: '',
        physics: '',
        english: '',
        chemistry: '',
        history: '',
        politics: '',
        physical: ''
      },
      fieldLabels: {
        chinese: '语文',
        math: '数学',
        english: '英语',
        physics: '物理',
        chemistry: '化学',
        history: '历史',
        politics: '政治',
        physical: '体育'
      }
    };
  },
  methods: {
    // 用户选择学籍地时的回调
    onSelectChange(e) {
      this.selectedArea = e.detail.value;
    },
    // 数值范围验证方法
    validateField(field, max) {
      if (!this.validateScore(field, max)) {
        wx.showToast({
          title: `${this.fieldLabels[field]}需在0-${max}分之间`,
          icon: 'none'
        });
      }
    },
    validateScore(field, max) {
      const value = Number(this.formData[field]);
      if (isNaN(value)) {
        return false;
      }
      return value >= 0 && value <= max;
    },
    // 计算总分
    calculateTotal() {
      const subjects = [
        { field: 'chinese', max: 120 },
        { field: 'math', max: 120 },
        { field: 'english', max: 120 },
        { field: 'physics', max: 100 },
        { field: 'chemistry', max: 100 },
        { field: 'history', max: 60 },
        { field: 'politics', max: 60 },
        { field: 'physical', max: 60 }
      ];

      return subjects.reduce((total, sub) => {
        const value = Number(this.formData[sub.field]) || 0;
        return this.validateScore(sub.field, sub.max) ? total + value : total;
      }, 0);
    },
    // 提交数据
    submitData() {
      if (this.isSubmitting) return;

      // 校验学籍地
      if (!this.selectedArea) {
        wx.showToast({
          title: '请选择学籍地',
          icon: 'none'
        });
        return;
      }

      // 校验所有分数字段
      const requiredFields = [
        { field: 'chinese', max: 120 },
        { field: 'math', max: 120 },
        { field: 'english', max: 120 },
        { field: 'physics', max: 100 },
        { field: 'chemistry', max: 100 },
        { field: 'history', max: 60 },
        { field: 'politics', max: 60 },
        { field: 'physical', max: 60 }
      ];

      const invalidField = requiredFields.find(sub => {
        const value = this.formData[sub.field];
        return !value || !this.validateScore(sub.field, sub.max);
      });

      if (invalidField) {
        wx.showToast({
          title: `${this.fieldLabels[invalidField.field]}分数无效`,
          icon: 'none'
        });
        return;
      }

      this.isSubmitting = true;

      // 准备传递的数据
      const dataToPass = {
        area: this.selectedArea,
        total: this.calculateTotal(),
        details: this.formData
      };

      // 存储数据到本地
      wx.setStorageSync('gradeData', dataToPass);

      // 跳转到展示页面
      wx.navigateTo({
        url: '/pages/ApplicationCase/ApplicationCase',
        success: () => {
          wx.showToast({ title: '提交成功' });
          this.isSubmitting = false;
        },
        fail: () => {
          wx.showToast({ title: '跳转失败', icon: 'none' });
          this.isSubmitting = false;
        }
      });
    }
  },
  onLoad() {
    // 可以保留 onLoad 逻辑，例如获取 openid 或其他初始化
  }
};
</script>

<style scoped>
.container {
  padding: 30rpx;
  box-sizing: border-box;
  min-height: 100vh;
  padding-bottom: 150rpx; /* Increased padding to ensure content doesn't overlap with fixed button */
}

.subtitle {
  display: flex;
  margin-bottom: 30rpx;
  font-size: 40rpx;
  font-weight: 500;
  color: black;
}

.highlight {
  color: #2eceb4;
  font-weight: 600;
  margin: 0 8rpx;
}

.radio-container {
  padding: 20px;
}

.radio-group {
  margin-bottom: 20px;
}

.radio-item {
  display: block;
  margin-bottom: 30rpx;
  font-size: 40rpx;
}

.score-section {
  margin-top: 40rpx;
}

.input-group {
  display: flex;
  margin-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid grey;
}

.input-group text {
  width: 150rpx; /* Fixed width for labels to align inputs */
  font-size: 34rpx;
}

.input-group input {
  flex: 1;
  font-size: 34rpx;
  padding-left: 20rpx;
}

.spacer {
  height: 120rpx; /* Spacer to ensure content doesn't overlap with fixed footer */
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08); /* 顶部阴影增加层次感 */
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background: #fff; /* White background to prevent transparency */
  z-index: 1000; /* Ensure button is above other content */
}

.submit-btn {
  background-image: linear-gradient(to right, #4cd38e, #2eceb4);
  color: #ffffff;
  border-radius: 30px;
  font-size: 34rpx;
  padding: 8rpx 0;
  text-align: center;
}
</style>