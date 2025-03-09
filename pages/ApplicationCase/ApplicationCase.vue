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
						<text class="subscore-text">佛山市/{{ area }}</text>
					</view>
				</view>
			</view>
		</view>



		<!-- 历史记录折叠列表 -->
		<view class="history-collapse">
			<view class="collapse-header" @click="toggleHistory">
				<text>查询历史记录</text>
				<u-icon :name="showHistory ? 'arrow-up' : 'arrow-down'" size="20"
					:class="{'rotate-icon': showHistory}" />
			</view>
			<view v-show="showHistory" class="history-list">
				<view v-for="(record, index) in historyRecords" :key="index" class="history-item"
					@click="selectHistory(record)">
					<!-- 格式化显示时间 -->
					<text>{{ formatTime(record.date) }} - {{ record.total }}分 ({{ record.area }})</text>
					<u-icon name="clock" size="18" color="#999" />
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
						<u-icon name="thumb-up-fill" size="40" class="icon" color="#ff8870"></u-icon> <!-- 橘色图标 -->
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
	<view class="button-container">
		<text class="submit-text">成绩分析-专属指导学校-学校优劣对比</text>
		<button class="submit-btn" @click="submit">专家指导</button>
	</view>
	<view v-if="showPopup" class="popup-mask">
	<view class="popup-content">
		<!-- 关闭按钮 -->
		<view class="close-btn" @click="showPopup = false">×</view>
		
		<!-- 弹窗内容 -->
		<view class="popup-body">
		<text class="popup-title">温馨提示</text>
		<view class="popup-text">
			<text>除成绩外还需要参照其他因素，为了保证推荐的学校更准确，请</text>
			<text class="highlight-text">"截图二维码"</text>
			<text>添加老师微信，提供更多信息，获取免费志愿预测服务</text>
		</view>
		
		<!-- 二维码容器 -->
		<image 
			src="" 
			class="qrcode-image"
			mode="aspectFit"
		/>
		
		<text class="tip-text">截图保存后扫码添加</text>
		</view>
	</view>
	</view>

	</view>
</template>

<script>
import MpProgress from 'mp-progress';
import { getHistoryRecord } from '@/api/application.js'; // 引入 getRecord 接口
import { getHistorySchool } from '@/api/application.js';
import { getSchoolRecord} from '@/api/application.js'; // 引入 getSchoolRecord 接口
	// 假设您已经在 application.js 中定义了 getRecommendedSchools API
	// import { getRecommendedSchools } from '@/api/application.js';

	export default {
		data() {
			return {
				//历史列表数据
				showHistory: false,
				historyRecords: [],

				area: '', //从缓存中获取
				total: 0, //从缓存中获取的用户分数
				details: {}, //从缓存中获取
				score: 0, //实际显示的用户分数
				user_id: 2, //用户id
				//place:"广东省/深圳市/宝安区",
				maxScore: 750, // 满分
				recommendedSchools: {
					chong: [],
					wen: [],
					bao: []
				},
				showPopup: false, // 新增弹窗控制变量
				config: {
					// 设置canvas尺寸
					canvasSize: {
						width: 500,
						height: 500
					},
					// 进度条的百分比
					percent: 50, // 设为80%显示最大半圆弧
					percentage: 100,
					// 进度条样式：底色和渐变色
					barStyle: [{
							width: 20,
							fillStyle: '#f0f0f0'
						}, // 背景色
						{
							width: 20,
							animate: true,
							fillStyle: [{
									position: 0,
									color: '#00efa7'
								}, // 起始颜色
								{
									position: 1,
									color: '#00c3ac'
								} // 结束颜色
							]
						}
					],
					// 是否需要进度点
					needDot: true,
					// 进度点的样式：白色大圆点和绿色小圆点
					dotStyle: [{
							r: 20,
							fillStyle: '#fff',
							shadow: 'rgba(0,0,0,.15)'
						}, // 大圆点阴影
						{
							r: 10,
							fillStyle: '#56B37F'
						} // 小圆点颜色
					]
				}
			};
		},
		mounted() {
			this.fetchRecommendedSchools(); // 调用接口获取推荐学校
			this.updateProgress(); // 更新进度条
		},

		methods: {
			// 格式化时间
			formatTime(time) {
				if (!time) return ''; // 如果时间为空，返回空字符串
				const date = new Date(time); // 将时间字符串转换为 Date 对象
				const year = date.getFullYear(); // 年
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月（补零）
				const day = String(date.getDate()).padStart(2, '0'); // 日（补零）
				const hours = String(date.getHours()).padStart(2, '0'); // 时（补零）
				const minutes = String(date.getMinutes()).padStart(2, '0'); // 分（补零）
				const seconds = String(date.getSeconds()).padStart(2, '0'); // 秒（补零）
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回格式化后的时间
			},
			
			submit() {
			  this.showPopup = true; // 提交时显示弹窗
			},
			// 新增方法
			toggleHistory() {
			  this.showHistory = !this.showHistory;
			  if (this.showHistory && this.historyRecords.length === 0) {
				this.fetchHistory();
			  }
			},
			// 获取历史记录
			async fetchHistory() {
			  try {
				const records = await getHistoryRecord(this.user_id); // 调用 getRecord 接口
				this.historyRecords = records.map(item => ({
				  total: item.score,
				  area: item.zone,
				  date: item.time
				}));
			  } catch (error) {
				console.error('获取历史记录失败:', error);
				wx.showToast({
				  title: '获取历史记录失败',
				  icon: 'none'
				});
			  }
			},
			
			//点击选择历史记录后
			selectHistory(record) {
				this.score = record.total;
				this.area = record.area;
				this.details = {};//将传入分数置为空
				this.fetchRecommendedSchools(); // 获取推荐学校
				this.showHistory = false; // 收起列表
				this.updateProgress();//更新进度条
			},

			// 更新进度条
			updateProgress() {
				const percentage = (this.score / this.maxScore) * 100;
				this.config.percentage = percentage;

				const mprogress = new MpProgress({
					target: this,
					canvasId: 'progress',
					canvasSize: this.config.canvasSize,
					percent: this.config.percent,
					barStyle: this.config.barStyle,
					needDot: this.config.needDot,
					dotStyle: this.config.dotStyle,
					percentage: this.config.percentage
				});

				mprogress.draw(this.config.percentage, {
					text: `剩余车位: 100/127\n完成进度: ${this.config.percentage}%`,
					textStyle: {
						fontSize: 18,
						fillStyle: '#333',
						textAlign: 'center',
						textBaseline: 'middle'
					}
				});
			},
			// 调用 API 获取推荐学校
			// 调用 API 获取推荐学校
			async fetchRecommendedSchools() {
			  try {
			    const score = this.score;
			    const zone = this.area;
			    const user_id = this.user_id;
			    const details = this.details;
			    console.log("fetchRecommendedSchools", details);
			
			    if (Object.keys(details).length === 0) {
			      // 如果 details 为空，调用 getHistorySchool 接口
			      console.log("details 为空，调用 getHistorySchool 接口", details);
			      getHistorySchool(score, zone,
			        (response) => {
						console.log("getHistorySchool 返回数据:", response);
			          if (response.code === '200') {
			            // 成功获取数据，更新推荐学校数据
			            this.recommendedSchools = {
			              chong: response.data.chong.map(school => school.schoolName),
			              wen: response.data.wen.map(school => school.schoolName),
			              bao: response.data.bao.map(school => school.schoolName)
			            };
			          } else {
			            console.error('获取推荐学校失败:', response.msg);
			          }
			        },
			        (error) => {
			          console.error('请求失败:', error);
			        }
			      );
			    } else {
			      // 如果 details 不为空，调用 getSchoolRecord 接口
			      console.log("details 不为空，调用 getSchoolRecord 接口", details);
			      getSchoolRecord(score, zone, user_id, details,
			        (response) => {
						console.log("getSchoolRecord 返回数据:", response);
			          if (response.code === '200') {
			            // 成功获取数据，更新推荐学校数据
			            this.recommendedSchools = {
			              chong: response.data.chong.map(school => school.schoolName),
			              wen: response.data.wen.map(school => school.schoolName),
			              bao: response.data.bao.map(school => school.schoolName)
			            };
			          } else {
			            console.error('获取推荐学校失败:', response.msg);
			          }
			        },
			        (error) => {
			          console.error('请求失败:', error);
			        }
			      );
			    }
			  } catch (error) {
			    console.error('网络请求失败:', error);
			  }
			}
		},
		//从缓存中获取
		onLoad() {
			const data = wx.getStorageSync('gradeData');
			if (data) {
				this.area = data.area;
				this.total = data.total;
				this.details = data.details;
				this.score = data.total;
				console.log('接收到的数据:', data);
			} else {
				wx.showToast({
					title: '未接收到数据',
					icon: 'none'
				});
			}
		}
	};
</script>



<style scoped>
	/* 折叠列表样式 */
	.history-collapse {
		margin: 20px;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.collapse-header {
		padding: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #eee;
	}

	.rotate-icon {
		transform: rotate(180deg);
		transition: transform 0.3s;
	}

	.history-list {
		max-height: 300px;
		overflow-y: auto;
	}

	.history-item {
		padding: 12px 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
	}

	.history-item:last-child {
		border-bottom: none;
	}

	.history-item:active {
		background-color: #f8f8f8;
	}


	/* 绿底白字部分 */
	.green-header {
		background-image: linear-gradient(to bottom, #00c58d, #ffffff);
		/* 渐变从绿色到白色 */
		padding: 20px;
		text-align: center;
		height: 200px;
		/* 设置容器高度为200px，具体数值可以根据需要调整 */
		border-bottom-left-radius: 10px;
		/* 圆角边框 */
		border-bottom-right-radius: 10px;
		/* 圆角边框 */
	}

	.header-text {
		font-size: 24px;
		font-weight: bold;
		color: white;
		display: block;
		/* 确保该文本单独一行显示 */
		margin-top: 10px;
		margin-bottom: 20px;
		/* 给上面的文本和下面的文本增加间距 */
		text-align: left;
		/* 向左对齐 */

	}

	.sub-text {
		font-size: 18px;
		color: white;
		display: block;
		/* 确保该文本单独一行显示 */
		text-align: left;
		/* 向左对齐 */
	}

	.white-container {
		position: relative;
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		margin: -80px 20px 0 20px;
		/* 上边距为负值，使其部分叠加在green-header上，左右边距小于green-header */
		height: 230px;
		/* 增加高度以容纳底部内容 */
		display: flex;
		flex-direction: column;
		/* 垂直排列子元素 */
		align-items: center;
		/* 水平居中 */
		justify-content: center;
		/* 垂直居中 */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		/* 添加阴影效果 */
	}

	.canvas {
		position: absolute;
		/* 相对于最近的有定位属性（relative, absolute, fixed）的父元素进行定位,也就是.white-container  */
		margin-top: -150px;
		left: 100;
		width: 500rpx;
		height: 500rpx;
	}

	.status-ctn {
		margin-top: 0px;
		text-align: center;
		/* 让文字居中 */
	}

	.status-count {
		font-size: 24px;
		font-weight: bold;
	}

	.desc-text {
		font-weight: bold;
		/* 字体加粗 */
		font-size: 14px;
		color: white;
		/* 字体颜色为白色 */
		background-color: #00c58d;
		/* 背景色为绿色 */
		padding: 5px 10px;
		/* 内边距，根据需要调整 */
		border-radius: 20px;
		/* 圆角矩形 */
		text-align: center;
		/* 字体居中 */
	}

	/* 灰色小字分数*/
	.subtitle-text {
		margin-top: 4px;
		font-size: 14px;
		color: #646464;
		/* 字体颜色为白色 */
	}

	/* 绿色小字分数*/
	.subscore-text {
		margin-top: 4px;
		font-size: 14px;
		color: #00c48d;
		/* 字体颜色为白色 */
	}


	/* 底部内容样式 */
	.bottom-content {
		position: absolute;
		bottom: 20px;
		/* 距离底部20px */
		width: 100%;
		/* 宽度占满父容器 */
		text-align: center;
		/* 内容居中 */
	}

	.divider {
		height: 1px;
		/* 分隔线高度 */
		background-color: #e0e0e0;
		/* 灰色分隔线 */
		margin-bottom: 10px;
		/* 分隔线与内容的间距 */
	}

	.info-text {
		margin-top: 10px;
		display: flex;
		/* 使用flex布局 */
		justify-content: space-between;
		/* 两个元素并排显示，且有间距 */
		width: 98%;
		/* 占满宽度 */
		font-size: 14px;
		color: #666;
		/* 文字颜色 */
	}

	.info-item {
		display: flex;
		/* 每项信息用flex布局 */
		align-items: center;
		/* 垂直居中 */
	}

	.icon {
		margin-right: 10px;
		/* 图标与文字之间的间距 */
	}

	.info-text text {
		display: block;
		/* 每行单独显示 */
		margin-bottom: 5px;
		/* 行间距 */
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

	/* 推荐冲高校部分 */
	.recommendation-category.chong {
		margin-top: 20px;
		margin-bottom: 10px;
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 0;
		/* 移除外部padding，内部结构中设置padding */
	}

	/* 上半部分背景渐变 */
	.recommendation-backchong {
		background: linear-gradient(to bottom, #ffcec4, #ffffff);
		/* 橘色渐变到白色 */
		padding: 10px;
		border-radius: 10px 10px 0 0;
		/* 仅上边添加圆角 */
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
		background: linear-gradient(to bottom, #6dddb8, #ffffff);
		/* 蓝色渐变到白色 */
		padding: 10px;
		border-radius: 10px 10px 0 0;
		/* 仅上边添加圆角 */
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
		background: linear-gradient(to bottom, #7cdcff, #ffffff);
		/* 浅蓝色渐变到白色 */
		padding: 10px;
		border-radius: 10px 10px 0 0;
		/* 仅上边添加圆角 */
	}
	
	/* 添加/修改样式 */
	.container {
	  padding-bottom: 140px; /* 原100px + 按钮容器高度 */
	}
	.button-container {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  padding: 5px 20px  30px 20px;  /* 下边距更大适配全面屏手机 */
	  background: #ffffff;
	  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08); /* 顶部阴影增加层次感 */
	  border-top-left-radius: 16px;
	  border-top-right-radius: 16px;
	  z-index: 999;
	}
		
	.submit-text{
		color:#d79529;
		font-size:12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom:5px;
		
	}
	.submit-btn {
	  background-image: linear-gradient(to right, #4cd38e, #2eceb4);
	  color: white;
	  border-radius: 30px;
	  font-size: 16px;
	  height: 40px;
	  line-height: 40px;
	  width: 100%;
	  transition: all 0.2s ease;
	  position: relative;
	}
	
	/* 按钮交互效果 */
	.submit-btn::after {
	  content: '';
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  border-radius: 12px;
	  border: 1px solid rgba(0, 0, 0, 0.1);
	}
	
	.submit-btn:active {
	  transform: scale(0.98);
	  opacity: 0.9;
	  background: #00b37d;
	}
	/* 弹窗蒙层 */
	.popup-mask {
	  position: fixed;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  background-color: rgba(0, 0, 0, 0.5);
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  z-index: 999;
	}
	
	/* 弹窗内容 */
	.popup-content {
	  position: relative;
	  width: 600rpx;
	  height: 750rpx; /* 设置弹窗高度 */
	  background-color: #fff;
	  border-radius: 20rpx;
	  padding: 40rpx;
	  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.2);
	}
	
	/* 关闭按钮 */
	.close-btn {
	  position: absolute;
	  right: 20rpx;
	  top: 10rpx;
	  font-size: 50rpx;
	  color: #999;
	  width: 60rpx;
	  height: 60rpx;
	  text-align: center;
	  line-height: 50rpx;
	}
	
	/* 弹窗正文 */
	.popup-title {
	  font-size: 38rpx;
	  font-weight: bold;
	  color: #333;
	  text-align: center;
	  display: block;
	  margin-bottom: 30rpx;
	}
	.popup-body {
	  height: 100%;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	}
	
	.popup-text {
	  font-size: 28rpx;
	  color: #666;
	  line-height: 1.6;
	  text-align: center;
	  margin-bottom: 40rpx;
	}
	
	.highlight-text {
	  color: #00c58d;
	  font-weight: bold;
	}
	
	.qrcode-image {
	  width: 400rpx;
	  height: 400rpx;
	  margin: 20rpx auto;
	  display: block;
	  background-color: #f5f5f5; /* 二维码背景色 */
	  border-radius: 20rpx;
	}
	
	.tip-text {
	  display: block;
	  text-align: center;
	  font-size: 26rpx;
	  color: #999;
	  margin-top: 30rpx;
	}
</style>