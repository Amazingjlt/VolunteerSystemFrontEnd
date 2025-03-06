<template>
  <view class="container">
	  <view class="subtitle">请填写<text class="highlight">适应性考试</text>实际得分</view>
    <form class="score">  
      <view class="input-group">
        <text>语文：</text>
        <input v-model="formData.Chinese" type="number" placeholder="满分[120]分" min="0" max="120" @blur="validateField('Chinese', 120)"/>
      </view>
	  <view class="input-group">
        <text>数学：</text>
        <input v-model="formData.math" type="number" placeholder="满分[120]分" min="0" max="120" @blur="validateField('math', 120)"/>
      </view>
	  <view class="input-group">
	    <text>英语（含听说）：</text>
	    <input v-model="formData.english" type="number" placeholder="满分[120]分" min="0" max="120" @blur="validateField('english', 120)" />
	  </view>	  
	  <view class="input-group">
	    <text>物理：</text>
	    <input v-model="formData.physics"type="number" placeholder="满分[100]分" min="0" max="100" @blur="validateField('physics', 100)"/>
	  </view>
	  <view class="input-group">
	    <text>化学：</text>
	    <input v-model="formData.chemistry" type="number" placeholder="满分[100]分" min="0" max="100" @blur="validateField('chemistry', 100)"/>
	  </view>
	  <view class="input-group">
	    <text>历史：</text>
	    <input v-model="formData.history" type="number" placeholder="满分[60]分"min="0" max="60" @blur="validateField('history', 60)"/>
	  </view>
	  <view class="input-group">
	    <text>政治：</text>
	    <input v-model="formData.general" type="number" placeholder="满分[60]分"min="0" max="60" @blur="validateField('general', 60)"/>
	  </view>
	  <view class="input-group">
	    <text>体育：</text>
	    <input v-model="formData.sports"type="number" placeholder="满分[60]分" min="0" max="60" @blur="validateField('sports', 60)"/>
	  </view>
	  </form>
	  <view class="footer">
		  <button class="submit-btn"type="2"@click="submitData" :disabled="isSubmitting">提交</button>
	  </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
	  selectedArea:'',
	  isSubmitting: false, // 新增提交状态标识
      formData: {
        Chinese: '',
        math: '',
		physics:'',
		english:'',
		chemistry:'',
		history:'',
		general:'',
		sports:''
      },
	  fieldLabels: {
		Chinese: '语文',
		math: '数学',
		english: '英语',
		physics: '物理',
		chemistry: '化学',
		history: '历史',
		general: '政治',
		sports: '体育'
	},
    };
  },
    onLoad(options) {
		const openid = uni.getStorageSync('openid');
					uni.request({
						url: '/login',
						method: 'GET',
						data: {
							openid
						},
						success: (res) => {
							console.log('成功:', res.data);
							const {
								formData
							} = res.data;
							this.formData = formData;
						},
						fail: (err) => {
							console.error('请求失败:', err);
						}
					});
      // 接收上一页传递的参数
      if (options.area) {
        this.selectedArea = options.area;
      }
    },
  methods: {
	validateField(field, max) {
	  if (!this.validateScore(field, max)) {
	    wx.showToast({
	      title: `${this.fieldLabels[field]}需在0-${max}分之间`,
	      icon: 'none'
	    });
	  }
	},
    // 数值范围验证方法
    validateScore(field, max) {
      const value = Number(this.formData[field]);
      if (isNaN(value)) {
        return false;
      }
      return value >= 0 && value <= max;
    },
	calculateTotal() {
      // 添加详细验证
      const subjects = [
        { field: 'Chinese', max: 120 },
        { field: 'math', max: 120 },
        { field: 'english', max: 120 },
        { field: 'physics', max: 100 },
        { field: 'chemistry', max: 100 },
        { field: 'history', max: 60 },
        { field: 'general', max: 60 },
        { field: 'sports', max: 60 }
      ];

      return subjects.reduce((total, sub) => {
        const value = Number(this.formData[sub.field]) || 0;
        return this.validateScore(sub.field, sub.max) ? total + value : total;
      }, 0);
	},
    // 提交数据到后端
    async submitData() {
	  if (this.isSubmitting) return;
      // 校验所有字段已填写
      const requiredFields = [
        { field: 'Chinese', max: 120 },
        { field: 'math', max: 120 },
        { field: 'english', max: 120 },
        { field: 'physics', max: 100 },
        { field: 'chemistry', max: 100 },
        { field: 'history', max: 60 },
        { field: 'general', max: 60 },
        { field: 'sports', max: 60 }
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
      wx.showLoading({ title: '提交中...', mask: true });

      
            try {
              const res = await new Promise((resolve, reject) => {
                wx.request({
                  url: 'http://127.0.0.1:4523/m1/5818861-5504164-default/submit',
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/json' // 添加请求头
                  },
                  data: {
                    area: this.selectedArea,
                    total: this.calculateTotal(),
                    details: this.formData // 添加明细数据
                  },
                  success: resolve,
                  fail: reject
                });
              });
      
              wx.hideLoading();
              this.isSubmitting = false;
      
              if (res.statusCode === 200 && res.data.success) {
                wx.showToast({ title: '提交成功' });
                wx.navigateTo({
                  url: '/pages/ApplicationCase/ApplicationCase'
                });
              } else {
                wx.showToast({ title: res.data.message || '提交失败', icon: 'none' });
              }
            } catch (err) {
              wx.hideLoading();
              this.isSubmitting = false;
              wx.showToast({ title: '请求失败，请检查网络', icon: 'none' });
            }
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
