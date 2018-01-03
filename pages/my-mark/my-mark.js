// pages/my-mark/my-mark.js
const app= getApp();
import urlObj from '../../utils/url.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    palneIcon: "../../resource/images/plane.png",
    signIcon:"../../resource/images/signIcon.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self =this;
    app.getToken(function(token){
      wx.request({
        url: urlObj.url.httpSrc + "/activity/total_datas",
        method: "GET",
        header: {
          "Content-Type": "application/json",
          'Authorization': 'AppletToken ' + token
        },
        data: {},
        dataType: "json",
        success: function (res) {
          self.setData({
            income: res.data.data.income.toFixed(2),
            recharge: res.data.data.recharge.toFixed(2),
            sign_times: res.data.data.sign_times.toFixed(2)
          })
        }
      })

      wx.request({
        url: urlObj.url.httpSrc + "/activity/join_list",
        method: "GET",
        header: {
          "Content-Type": "application/json",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          page_no:1,
          page_size:10
        },
        dataType: "json",
        success: function (res) {
          self.setData({
            // date:res.data.data.date,
            // money:res.data.data.money,
            // exec_type:res.data.data.exec_type,
            // desc:res.data.data.desc,
            arr:res.data.data
          })
        }
      })

    })
    
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})