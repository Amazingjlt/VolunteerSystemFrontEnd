<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']//开启转发好友和转发朋友圈按钮
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>


<style lang="scss">/*配置uview-plus */
  @import '@/node_modules/uview-plus/theme.scss';
</style>