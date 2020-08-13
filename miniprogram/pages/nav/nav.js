// pages/nav/nav.js
let autoScan = null;
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.onError((e) => console.log(e))
innerAudioContext.onPlay((e) => console.log(e))
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkTips:'等待检测',
    photo: 'cloud://mangxiaolu001.6d61-mangxiaolu001-1302867071/voice/timg.jpeg',
    isAuto: false,
    isFind: false,
    checkRes: []
  },
  initScan() {
    // if(autoScan){
    //   clearInterval(autoScan);
    //   return;
    // }
    // console.log('自动开始识别！')
    // autoScan = setInterval(()=>{
    //     this.printScan()
    // },5000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sys = wx.getSystemInfoSync();
    this.setData({sys})
    console.log(sys)
  },
  printScan() {
    console.log('手动识别！')
    //take photo
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res)
        this.imgBase64(res.tempImagePath)
        this.setData({
          photo: res.tempImagePath
        })
      }
    })
  },
  userScan() {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        _this.imgBase64(tempFilePaths[0]);
        _this.setData({
          photo: tempFilePaths[0]
        })

      }
    })
  },
  imgBase64(src) {
    let lo = wx.showLoading({ title: '检测中' });
    this.setData({
      checkTips:'检测中',
      checkRes:null
    })
    let _this = this;
    wx.getImageInfo({
      src,
      async success(res) {
        let base64 = wx.getFileSystemManager().readFileSync(src, "base64");
        //上传

        let r = await _this.getImgCheck(base64);
        console.log(r.result)
        if (r.result.status === 200 && !r.result.data.err_code) {
          if (r.result.data.results.length === 0) {
            console.log('未发现盲道')
            wx.showToast({
              title: '未发现！',
              icon: "none"
            });
            _this.setData({ isFind: false,checkTips:'未发现！' })
            innerAudioContext.src = "cloud://mangxiaolu001.6d61-mangxiaolu001-1302867071/voice/notFind.mp3";
            innerAudioContext.play();

          } else {
            wx.showToast({
              title: '发现盲道！！',
              icon: "none"
            });

            console.log('发现盲道')
            innerAudioContext.src = "cloud://mangxiaolu001.6d61-mangxiaolu001-1302867071/voice/find.mp3";
            innerAudioContext.play();
            let score = (r.result.data.results[0].score*100).toFixed(1);
            r.result.data.results[0].score = score; 
            _this.setData({
              photo: src,
              checkRes: r.result.data.results,
              isFind: true,
              checkTips:'发现盲道！'
            });
          }
        } else {
          wx.showModal({
            title: "检测失败！",
            content: JSON.stringify(r.result)
          })

        }
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  async getImgCheck(image) {
    return await wx.cloud.callFunction({
      name: 'check',
      data: {
        api: 'checkImg',
        image
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    autoScan && clearInterval(autoScan)
  },

 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})