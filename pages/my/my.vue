<!-- 陈欣悦 -->
<!-- /pages/my/my.vue -->
<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <!-- <u-icon name="arrow-left" size="28" @click="goBack"></u-icon>-->
      <text class="navbar-title">历史记录</text>
      <view style="width: 28px;"></view> <!-- 占位保持对称 -->
    </view>
    
    <!-- 历史记录列表 -->
    <view class="history-container">
      <view v-if="historyRecords.length === 0" class="empty-tip">
        <u-icon name="list" size="40" color="#999"></u-icon>
        <text>暂无历史记录</text>
      </view>
      
      <view v-else>
        <view v-for="(record, index) in historyRecords" 
              :key="index" 
              class="history-item"
              @click="selectHistory(record)">
          <view class="item-left">
            <u-icon name="clock" size="20" color="#00c58d"></u-icon>
            <text class="item-time">{{ formatTime(record.date) }}</text>
          </view>
          <view class="item-right">
            <text class="item-score">{{ record.total }}分</text>
            <text class="item-area">{{ record.area }}</text>
            <u-icon name="arrow-right" color="#999"></u-icon>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getHistoryRecord } from '@/api/application.js';

export default {
  data() {
    return {
      historyRecords: [],
      user_id: 2 // 实际项目中从全局状态获取
    };
  },
  onLoad() {
    this.fetchHistory();
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 获取历史记录
    async fetchHistory() {
      try {
        const records = await getHistoryRecord(this.user_id);
        this.historyRecords = records.map(item => ({
          total: item.score,
          area: item.zone,
          date: item.time
        }));
      } catch (error) {
        console.error('获取历史记录失败:', error);
        uni.showToast({
          title: '获取历史记录失败',
          icon: 'none'
        });
      }
    },
    
    // 格式化时间
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    
    // 选择历史记录
    selectHistory(record) {
      // 存储选中的记录
      uni.setStorageSync('selectedHistoryRecord', record);
      // 返回上一页
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
}

.custom-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.navbar-title {
  font-size: 34rpx;
  font-weight: bold;
}

.history-container {
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  color: #999;
  font-size: 28rpx;
}

.empty-tip text {
  margin-top: 20rpx;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.item-left {
  display: flex;
  align-items: center;
}

.item-time {
  margin-left: 20rpx;
  font-size: 30rpx;
  color: #333;
}

.item-right {
  display: flex;
  align-items: center;
}

.item-score {
  font-size: 32rpx;
  font-weight: bold;
  color: #00c58d;
  margin-right: 15rpx;
}

.item-area {
  font-size: 26rpx;
  color: #666;
  margin-right: 15rpx;
}
</style>