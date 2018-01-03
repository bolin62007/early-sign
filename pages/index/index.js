//index.js
//获取应用实例
const app = getApp();
import urlObj from '../../utils/url.js';
var utils = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markIcon: "../../resource/images/icon.png",
    paySrc: "../../resource/images/pay-bg.png",
    popSrc: "../../resource/images/pop.png",
    closeSrc: "../../resource/images/close.png",
    earlyStar: "../../resource/images/test.jpg",
    luckyStar: "../../resource/images/luckyStar.jpg",
    gutsStar: "../../resource/images/index-bg.png",
    // avatars: ["../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg"],
    earlyId: "id12",
    luckyId: "id162",
    gutsId: "id111",
    earlyTime: "06:00:01",
    luckyMoney: "131",
    gutsTabNum: "12",
    successNum: "835",
    failNum: "506",
    payStatus: false,//支付状态 0未支付，1支付,
    signStatus: false,//打卡状态
    //timeStatus:false,//时间允许打卡状态
    popStatus: false,
    popMsg: false,
    // signNum:"1356",
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
    motto: 'Hello World',
    userInfo: {},
    today: "../../resource/images/today.png",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    // this.setData({
    //   popStatus:true
    // })
    var self = this;
    app.getToken(function(token){
      wx.request({
        url: urlObj.url.httpSrc + "/activity/index",
        method: "GET",
        header: {
          "Content-Type": "application/json",
          'Authorization': 'AppletToken ' + token
        },
        data: {},
        dataType: "json",
        success: function (res) {
          self.setData({
            //avatars: res.data.data.avatars,
            money: res.data.data.money / 100,
            today_datas: res.data.data.today_datas,
            count: res.data.data.count,
          })
        }
      })
    })
    
  },
  onShow: function () {
    var self = this;
    var currSenconds = Date.parse(new Date());
    // if (utils.tomorrowHour58().tomorrowTime5 < currSenconds && currSenconds < utils.tomorrowHour58().tomorrowTime5){
    //   self.setData({

    //   })
    // }
  },
  toMyMark: function () {
    wx.navigateTo({
      url: '../my-mark/my-mark',
    })
  },
  toRule: function () {
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '早起赚钱',
      path: '/page/index?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  close: function () {
    this.setData({
      // popStatus:false
      payStatus: false
    })
  },
  toPay: function () {
    wx.setStorage({
      key: "date",
      data: new Date().getDate()
    })
    wx.getStorage({
      key: 'date',
      success: function (res) {
        console.log(res)
      }
    })
    var self = this;
    var curSecond = Date.parse(new Date());
    if (curSecond > utils.nightTime().nightTime2350 && curSecond < utils.nightTime().nightTime2359) {
      wx.showToast({
        title: '系统结算时间'
      })
    } else {
      app.getToken(function (token) {
        wx.request({
          url: urlObj.url.httpSrc + "/recharge/pre_order/wftpay",
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'AppletToken ' + token
          },
          data: {
            money: 100
          },
          dataType: "json",
          success: function (res) {
            console.log(res, "支付")
            if(res.data.code==0){
              var pay_info = JSON.parse(res.data.data.pay_info);
              wx.requestPayment({
                'timeStamp': pay_info.timeStamp,
                'nonceStr': pay_info.nonceStr,
                'package': pay_info.package,
                'signType': pay_info.signType,
                'paySign': pay_info.paySign,
                'success': function (res) {
                  wx.showToast({
                    title: '充值成功',
                  })
                  var endTimeSencond = utils.endTime("05:00:00");//获取明天具体的时间点传给leftTimer倒计时函数
                  var endTimeSencond2 = utils.endTime("08:00:00");//获取明天具体的时间点传给leftTimer倒计时函数
                  var timeId = setInterval(function () {
                    self.setData({
                      payStatus: true,
                      days: utils.leftTimer(endTimeSencond).days,
                      hours: utils.leftTimer(endTimeSencond).hours,
                      minutes: utils.leftTimer(endTimeSencond).minutes,
                      seconds: utils.leftTimer(endTimeSencond).seconds,
                      timeStatus: utils.leftTimer(endTimeSencond, endTimeSencond2).status,
                    });
                  }, 1000);

                },
                'fail': function (res) {
                  wx.showToast({
                    title: '支付失败',
                  })
                }
              })
            }else{
              wx.showToast({
                title: '请求失败',
              })
            }
          }

        })
      })    
    }
  },
  showMsg: function () {
    var self = this;
    self.setData({
      popMsgStatus: true
    })
    var timeId = setTimeout(function () {
      self.setData({
        popMsgStatus: false
      });

    }, 2000)
  },
  toSign: function () {
    this.setData({
      signStatus:true
    })
    // if(dadf){

    // }
    // wx.getStorageSync('date') == new Data(){
    //   wx.setStorageSync('date', date)
    //   wx.showToast({
    //     title: '',
    //   })
    // }
  },
  endChargeTime: function () {
    var curSecond = Date.parse(new Date());
    if (curSecond > utils.nightTime().nightTime2350 && curSecond < utils.nightTime().nightTime235) {
      wx.showToast({
        title: '系统结算时间'
      })
    } else {
      return true
    }

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
