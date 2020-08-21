const app = getApp();
let cloudPath = ((d,type) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}/${Math.random() * 10000}.${type}`);
Page({
  data: {},
  about() {
    wx.showModal({
      title: '盲小鹿',
      content: "一个盲道识别AI小程序，识别率根据盲道图片的积累会越来越高，现阶段为了减少不必要的资源损耗，暂时不开放实时识别。"
    })
  },
  join() {
    wx.showModal({
      title: '关于盲小鹿',
      content: "点击确定去分享盲道实景图片，帮助提升AI识别准确度,开发者审核后将参与盲道识别训练，谢谢。",
      async success(e) {
        if (e.confirm) {
          wx.chooseImage({
            count: 10,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            async success(res) {
              const tempFilePaths = res.tempFilePaths;
              let lo = wx.showLoading({title: '上传中',});
              for (let filePath of tempFilePaths) {
                //上传到数据库
                await wx.cloud.uploadFile({ cloudPath:cloudPath(new Date,filePath.slice(-4)),filePath});
              }
              wx.hideLoading(lo);
              wx.showToast({
                title: '上传完成',
                icon: 'none'
              });
            }
          })
        }
      }
    });
  },
  ...app.share
})
