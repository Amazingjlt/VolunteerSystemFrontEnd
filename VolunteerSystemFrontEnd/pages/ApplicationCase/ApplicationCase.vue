<template>
  <view class="container">
    <!-- 绿底白字部分 -->
    <view class="green-header">
      <text class="header-text">XX，您的中考成绩</text>
      <text class="sub-text">本次模拟推荐结果仅供参考，如需要个性化填报指导，请添加志愿填报指导老师微信</text>
    </view>

    <!-- 渐变为白色底 -->
    <view class="white-container">
      <!-- 白色方形圆角框 -->
      <view class="score-box">
        <view class="score-ring">
          <!-- 半圆环，颜色根据成绩动态填充 -->
          <view class="circle" :style="getRingStyle(score)"></view>
          <text class="score-text">{{ score }}分</text>
        </view>
      </view>

      <view class="recommendation">
        <text class="recommendation-title">根据您的分数与排名推荐学校如下</text>
        <!-- 推荐学校部分 -->
        <view class="recommendation-category">
          <text class="category-title">冲</text>
          <view class="category-items">
            <view v-for="(school, index) in recommendedSchools.chong" :key="index" class="school-item">
              <text>{{ school }}</text>
            </view>
          </view>
        </view>

        <view class="recommendation-category">
          <text class="category-title">稳</text>
          <view class="category-items">
            <view v-for="(school, index) in recommendedSchools.wen" :key="index" class="school-item">
              <text>{{ school }}</text>
            </view>
          </view>
        </view>

        <view class="recommendation-category">
          <text class="category-title">保</text>
          <view class="category-items">
            <view v-for="(school, index) in recommendedSchools.bao" :key="index" class="school-item">
              <text>{{ school }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="submit">提交成绩</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      score: 635.0,
      maxScore: 750, // 满分
      recommendedSchools: {
        chong: ["学校A", "学校B"],
        wen: ["学校C", "学校D"],
        bao: ["学校E", "学校F"]
      }
    };
  },
  methods: {
    getRingStyle(score) {
      const percentage = (score / this.maxScore) * 100;  // 计算分数占满分的百分比
      // 设置半圆环的样式
      const color = this.getRingColor(percentage);
      return {
        background: `conic-gradient(${color} ${percentage}%, #f4f4f4 ${percentage}% 100%)`,
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: '#4caf50', // 设置边框颜色
        borderRadius: '50%',
        width: '150px',
        height: '75px',
        margin: '0 auto'
      };
    },
    getRingColor(percentage) {
      // 根据百分比返回颜色
      if (percentage >= 80) {
        return '#4caf50'; // 绿色，表示优秀
      } else if (percentage >= 60) {
        return '#ff9800'; // 橙色，表示中等
      } else {
        return '#f44336'; // 红色，表示较差
      }
    },
    async submit() {
      try {
        const res = await uni.request({
          url: 'https://your-backend-api.com/recommend', // 替换为实际接口
          method: 'POST',
          data: { score: this.score }
        });

        if (res.data && res.data.recommendedSchools) {
          this.recommendedSchools = res.data.recommendedSchools;
        }
      } catch (error) {
        console.error('请求失败', error);
      }
    }
  }
};
</script>

<style scoped>
/* 绿底白字部分 */
.green-header {
  background-color: #00c58d;
  padding: 20px;
  text-align: center;
}

.header-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: block;  /* 确保该文本单独一行显示 */
  margin-bottom: 10px; /* 给上面的文本和下面的文本增加间距 */
}

.sub-text {
  font-size: 14px;
  color: white;
  display: block;  /* 确保该文本单独一行显示 */
}


/* 渐变为白色底 */
.white-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-top: 10px;
}

/* 白色方形圆角框 */
.score-box {
  text-align: center;
  margin-bottom: 20px;
}

.score-ring {
  position: relative;
  width: 150px;
  height: 75px;
  margin: 0 auto;
}

.circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 22px;
  font-weight: bold;
  color: #00c58d;
}

/* 推荐学校部分 */
.recommendation-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
}

.recommendation-category {
  margin-bottom: 20px;
}

.category-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.category-items {
  margin-bottom: 10px;
}

.school-item {
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 5px;
  margin-bottom: 5px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  background-color:  #00c58d;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
}
</style>
