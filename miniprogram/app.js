//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'mangxiaolu001',
      })
    }
  },

  share: {
    onAddToFavorites(){return this.shareConfig;},
    onShareAppMessage(){return {...this.shareConfig,path: '/pages/index/index'}},
    onShareTimeline(){return this.shareConfig;},
    shareConfig: {
      title: '盲小鹿，AI实时识别盲道位置。',
      query: '/pages/index/index',
      imageUrl:'cloud://mangxiaolu001.6d61-mangxiaolu001-1302867071/voice/timg.jpeg'
    },
  }
})
