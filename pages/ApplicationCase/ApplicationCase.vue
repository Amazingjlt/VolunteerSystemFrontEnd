<!-- 陈欣悦 -->
<template>
  <view class="container">
    <!-- 绿底白字部分 -->
    <view class="green-header">
      <text class="header-text">XX，您的中考成绩</text>
      <text class="sub-text">本次模拟推荐结果仅供参考，如需要个性化填报指导，请添加志愿填报指导老师微信</text>
    </view>
    <view class="white-container">
      <!-- 使用 canvas 进行进度条绘制 -->
      <canvas class="canvas" type="2d" id="progress"></canvas>
      <view class="status-ctn">
        <view class="desc-text">中考分</view>
        <view class="status-count">{{ score }}分</view>
      </view>
      <!-- 底部内容 -->
      <view class="bottom-content">
        <view class="divider"></view> <!-- 灰色分隔线 -->
        <view class="info-text">
          <view class="info-item">
            <u-icon name="file-text-fill" size="22" class="icon" color="#bbbbbb"></u-icon>
            <text class="subtitle-text">中考成绩：</text>
			<text class="subscore-text">{{ score }}分</text>
          </view>
          <view class="info-item">
            <u-icon name="map-fill" size="22" class="icon" color="#bbbbbb" margin-top="5px"></u-icon>
            <text class="subtitle-text">所在地区：</text>
			<text class="subscore-text">{{ place }}</text>
          </view>
        </view>
      </view>
    </view>
	 <!-- 推荐学校部分 -->
    <view class="recommendation">
      <text class="recommendation-title">根据您的分数与排名推荐学校如下</text>

      <!-- 推荐冲高校 -->
      <view class="recommendation-category chong">
        <view class="recommendation-backchong">
          <view class="category-header">
            <u-icon name="thumb-up-fill" size="40" class="icon" color="#ff8870" ></u-icon> <!-- 橘色图标 -->
            <text class="category-title">推荐冲高校</text>
          </view>
          <text class="school-title">学校名称</text>
          <view class="divider"></view> <!-- 灰色分割线 -->
        </view>
        <view class="category-items">
          <view v-for="(school, index) in recommendedSchools.chong" :key="index" class="school-item">
            <text>{{ school }}</text>
          </view>
        </view>
      </view>

      <!-- 推荐持平校 -->
      <view class="recommendation-category wen">
		  <view class="recommendation-backwen">
            <view class="category-header">
              <u-icon name="thumb-up-fill" size="40" class="icon" color="#00c591"></u-icon> <!-- 蓝色图标 -->
              <text class="category-title">推荐持平校</text>
            </view>
		    <text class="school-title">学校名称</text>
            <view class="divider"></view> <!-- 灰色分割线 -->
		  </view>
        <view class="category-items">
          <view v-for="(school, index) in recommendedSchools.wen" :key="index" class="school-item">
            <text>{{ school }}</text>
          </view>
        </view>
      </view>

      <!-- 推荐保底校 -->
      <view class="recommendation-category bao">
        <view class="recommendation-backbao">
            <view class="category-header">
              <u-icon name="thumb-up-fill" size="40" class="icon" color="#70d7ff"></u-icon> <!-- 浅蓝色图标 -->
              <text class="category-title">推荐保底校</text>
            </view>
            <text class="school-title">学校名称</text>
            <view class="divider"></view> <!-- 灰色分割线 -->
        </view>
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
</template>

<script>
import MpProgress from 'mp-progress';


// 假设您已经在 application.js 中定义了 getRecommendedSchools API
import { getRecommendedSchools } from '@/api/application.js';

export default {
  data() {
    return {
      score: 635.0,  // 用户分数
	  place:"广东省/深圳市/宝安区",
      maxScore: 750, // 满分
      recommendedSchools: {
        chong: [],
        wen: [],
        bao: []
      },
      config: {
        // 设置canvas尺寸
        canvasSize: {
          width: 500,
          height: 500
        },
        // 进度条的百分比
        percent: 50,  // 设为80%显示最大半圆弧
        percentage: 100,
        // 进度条样式：底色和渐变色
        barStyle: [
          { width: 20, fillStyle: '#f0f0f0' },  // 背景色
          { 
            width: 20, 
            animate: true, 
            fillStyle: [
              { position: 0, color: '#00efa7' },  // 起始颜色
              { position: 1, color: '#00c3ac'}   // 结束颜色
            ] 
          }
        ],
        // 是否需要进度点
        needDot: true,
        // 进度点的样式：白色大圆点和绿色小圆点
        dotStyle: [
          { r: 20, fillStyle: '#fff', shadow: 'rgba(0,0,0,.15)' },  // 大圆点阴影
          { r: 10, fillStyle: '#56B37F' }  // 小圆点颜色
        ]
      }
    };
  },
  mounted() {
    // 页面加载时调用 API 获取推荐学校数据
    this.fetchRecommendedSchools();
    
    // 直接计算百分比
    const percentage = (this.score / this.maxScore) * 100;
    this.config.percentage = percentage;  // 动态设置百分比
  
    const mprogress = new MpProgress({
      target: this,  // 页面上下文
      canvasId: 'progress',  // canvas的ID
      canvasSize: this.config.canvasSize,  // 画布尺寸
      percent: this.config.percent,  // 进度百分比
      barStyle: this.config.barStyle,  // 进度条样式
      needDot: this.config.needDot,  // 是否显示进度点
      dotStyle: this.config.dotStyle,  // 进度点样式
      percentage: this.config.percentage  // 绘制多少进度
    });

    mprogress.draw(this.config.percentage, {
      text: `剩余车位: 100/127\n完成进度: ${this.config.percentage}%`,  // 在圆环中间显示文本
      textStyle: { fontSize: 18, fillStyle: '#333', textAlign: 'center', textBaseline: 'middle' }  // 设置文本样式
    });
  },

  methods: {
     // 调用 API 获取推荐学校
     async fetchRecommendedSchools() {
        try {
          // 直接调用 getRecommendedSchools 函数，并传递回调
          getRecommendedSchools(
            (response) => {
              if (response.data.code === 200) {
                // 成功获取数据，更新推荐学校数据
                this.recommendedSchools = response.data.data;
              } else {
                console.error('获取推荐学校失败:', response.data.msg);
              }
            },
            (error) => {
              console.error('请求失败:', error);
            }
          );
        } catch (error) {
          console.error('网络请求失败:', error);
        }
      }
    }
  };
</script>



<style scoped>
/* 设置相关样式 */
/* 绿底白字部分 */
.green-header {
  background-image: linear-gradient(to bottom, #00c58d, #ffffff);  /* 渐变从绿色到白色 */
  padding: 20px;
  text-align: center;
  height: 200px;  /* 设置容器高度为200px，具体数值可以根据需要调整 */
  border-bottom-left-radius: 10px;  /* 圆角边框 */
  border-bottom-right-radius: 10px; /* 圆角边框 */
}

.header-text { 
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: block;  /* 确保该文本单独一行显示 */
  margin-top: 10px;
  margin-bottom: 20px; /* 给上面的文本和下面的文本增加间距 */
  text-align: left; /* 向左对齐 */
  
}

.sub-text {
  font-size: 18px;
  color: white;
  display: block;  /* 确保该文本单独一行显示 */
  text-align: left; /* 向左对齐 */
}

.white-container {
  position: relative; 
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin: -80px 20px 0 20px; /* 上边距为负值，使其部分叠加在green-header上，左右边距小于green-header */
  height: 230px; /* 增加高度以容纳底部内容 */
  display: flex;
  flex-direction: column;  /* 垂直排列子元素 */
  align-items: center;     /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.canvas {
  position: absolute; /* 相对于最近的有定位属性（relative, absolute, fixed）的父元素进行定位,也就是.white-container  */
  margin-top: -150px;
  left: 100;
  width: 500rpx;
  height: 500rpx;
}

.status-ctn {
  margin-top: 0px;
  text-align: center;  /* 让文字居中 */
}

.status-count {
  font-size: 24px;
  font-weight: bold;
}

.desc-text {
  font-weight: bold; /* 字体加粗 */
  font-size: 14px;
  color: white;  /* 字体颜色为白色 */
  background-color: #00c58d;  /* 背景色为绿色 */
  padding: 5px 10px;  /* 内边距，根据需要调整 */
  border-radius: 20px;  /* 圆角矩形 */
  text-align: center;  /* 字体居中 */
}

/* 灰色小字分数*/
.subtitle-text{
	margin-top:4px;
	font-size: 14px;
	color: #646464;  /* 字体颜色为白色 */
}
/* 绿色小字分数*/
.subscore-text{
	margin-top:4px;
	font-size: 14px;
	color: #00c48d;  /* 字体颜色为白色 */
}


/* 底部内容样式 */
.bottom-content {
  position: absolute;
  bottom: 20px; /* 距离底部20px */
  width: 100%; /* 宽度占满父容器 */
  text-align: center; /* 内容居中 */
}

.divider {
  height: 1px; /* 分隔线高度 */
  background-color: #e0e0e0; /* 灰色分隔线 */
  margin-bottom: 10px; /* 分隔线与内容的间距 */
}

.info-text {
  margin-top:10px;
  display: flex; /* 使用flex布局 */
  justify-content: space-between; /* 两个元素并排显示，且有间距 */
  width: 98%; /* 占满宽度 */
  font-size: 14px;
  color: #666; /* 文字颜色 */
}

.info-item {
  display: flex; /* 每项信息用flex布局 */
  align-items: center; /* 垂直居中 */
}

.icon {
  margin-right: 10px; /* 图标与文字之间的间距 */
}

.info-text text {
  display: block; /* 每行单独显示 */
  margin-bottom: 5px; /* 行间距 */
}
/* 推荐部分 */
.recommendation {
  margin-top: 20px;
  padding: 0 20px;
}

.recommendation-title {
  font-size: 22px;
  margin-bottom: 10px;
}

.recommendation-category {
  margin-bottom: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.category-items {
  margin-left: 10px;
}

.school-item {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.submit-btn {
  background-color: #00c58d;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #56B37F;
}
/* 推荐冲高校部分 */
.recommendation-category.chong {
  margin-top: 20px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0; /* 移除外部padding，内部结构中设置padding */
}

/* 上半部分背景渐变 */
.recommendation-backchong {
  background: linear-gradient(to bottom, #ffcec4, #ffffff);  /* 橘色渐变到白色 */
  padding: 10px;
  border-radius: 10px 10px 0 0;  /* 仅上边添加圆角 */
}

/* 标题容器 */
.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* 橘色图标 */
.icon {
  border-radius: 50%;
  margin-right: 10px;

}

/* 推荐高校标题 */
.category-title {
  margin-top: 0px;
  font-size: 22px;
  color: #000000;
}

/* 学校名称标题 */
.school-title {
  font-size: 16px;
  color: #757575;
  margin-top: 5px;
}

/* 分割线 */
.divider {
  height: 1px;
  background-color: #e3e3e3;
  margin: 10px 0 0 0;
}

/* 学校项容器 */
.category-items {
  padding: 15px;
}

/* 每个学校项 */
.school-item {
  padding: 10px 0;
  font-size: 16px;
  color: #333;
}
/* 推荐持平校部分 */
.recommendation-category.wen {
  margin-top: 20px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}

/* 上半部分背景渐变 */
.recommendation-backwen {
  background: linear-gradient(to bottom, #6dddb8, #ffffff);  /* 蓝色渐变到白色 */
  padding: 10px;
  border-radius: 10px 10px 0 0;  /* 仅上边添加圆角 */
}

/* 推荐保底校部分 */
.recommendation-category.bao {
  margin-top: 20px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}

/* 上半部分背景渐变 */
.recommendation-backbao {
  background: linear-gradient(to bottom, #7cdcff, #ffffff);  /* 浅蓝色渐变到白色 */
  padding: 10px;
  border-radius: 10px 10px 0 0;  /* 仅上边添加圆角 */
}
</style>
