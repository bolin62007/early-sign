//app.js
import urlObj from 'utils/url.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res)
    //     wx.request({
    //       url: /user/login,
    //       method:"POST"
    //     })
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    this.getToken(function(){})
  },
  getToken: function (cb) {
    //调用登录接口获取登录凭证，进而换取用户登录态信息
    var self = this
    if (this.token) {
      //cb ? cb(this.token):true;
      cb(this.token)
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            //获取用户信息，需要用户点击允许
            wx.getUserInfo({
              success: function (res) {
                self.globalData.userInfo = res.userInfo
                console.log(res,"用户信息")
                //发起网络请求
                wx.request({
                  // url: 'https://devapi.bjpio.com/user/login',
                  url: urlObj.url.httpSrc+'/user/login',
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  dataType: "json",
                  data: {
                    code: code,
                    rawData: res.rawData,
                    signature: res.signature,
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  },
                  success: function (res) {
                    console.log(res, "用户登录返回信息")
                    self.token = res.data.data.token
                    //cb ? cb(self.token) : true;
                    cb(self.token)
                  }
                })
              },
              fail: function () {
                //wx.hideLoading()
                self.showAutoModel()
                console.log("获取用户信息失败")
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  //提示授权
  showAutoModel: function () {
    var self = this
    wx.showModal({
      title: '用户未授权',
      content: '如需正常使用早起赚钱，请按确定并在授权管理中选中“用户信息”，仅是获取用户公开的信息。',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function success(res) {
              //我去，默认成功后调用获取数据？？
              var page = getCurrentPages()[0]
              page.onLoad(this.query)
            }
          });
        } else {
          self.showAutoModel()
        }
      }
    })
  },
  sendModel: function (formId) {
    //发送模板消息
    wx.request({
      url: getApp().data.url + "/other/collect_form_id",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        form_id: formId
      },
      dataType: "json",
      success: function (res) {
      }
    })
  },
  globalData: {
    userInfo: null
  }
})