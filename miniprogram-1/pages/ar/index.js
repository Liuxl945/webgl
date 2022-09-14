import { CrsClient } from "../../utils/crsClient";
import { CryptoJS } from "../../utils/CryptoJS";



const cameraBusiness = require('./utils/cameraBusiness.js')
// 画布id
const canvasId = 'canvas1';
// 机器人模型，带动画。
const robotUrl = '/images/robot.glb';
// webgl画面录制器的帧数
const recorderFPS = 30
// 画布组件
var canvas1;
// webgl画面录制器
var recorder;

var listener; //相机录制


//CRS配置
const config = {
  apiKey: 'c3b41fdaa87f0d5ab404410ae2ceb5e1', // EasyAR开发中心 - API KEY - API Key
  apiSecret: 'd7aabce759e4c04de095351946a57bdd358b1fc7cd72e99b6cf04c869157b179', // EasyAR开发中心 - API KEY - API Secret
  crsAppId: '323406ab2e2ab79ccce8bdf2f99fcdd4', // EasyAR开发中心 - 云服务 - 云识别管理 - 云识别库信息 - CRS AppId
  token: 'uDzN0fMAmKYbwY12Tyh3Vmn86cm9hNKJ24W0mo30AETAhq2PMHrVQ7nSf6QKRcoFLMELzpE/XbN1nbIN2vxDEoKZEjbm4JAXDcfItB9WoBYFEykbovML5K1UcUa294cR07GefkgBadvT52WWQTfYMHMNjWSuBoSoogiz2i4mIpnDoic9u4F+XmLbA0jVzhl6htb+S3aDs8suQfvv7RnZt6fZZCszrNjEV2zrTtEZKwXzIYQU7ADubnwTrPMlfahyk/nfHTl3tCW5dBoHrfL/yajeaMcwmk6QWZKnxPOJZe/ex4KL+XH5eUnLrk4dPUgyUPyEATPEHAQkvHAyv3RBjGIdijN15OPmYe1oh5Sp/S9Inu06/p16ta8ecPOF1r/k3MPxJS4EKPLvQVeiaAHlQREwwQIWE4j20TUDCWw1//DuJP6xqK16LQ/EqAgwYjp4Y70DZVTWQr8X+wo2KJ676A==',
  clientHost: 'https://cn1-crs.easyar.com:8443', //服务器一般不变
  jpegQuality: 0.7, //JPEG压缩质量，建议不低于70%
  minInterval: 1000, //最短的两次CRS请求间隔
}


Page({
  data: {
    menuButtonTop: 32,
    menuButtonHeight: 33,
  },
  onReady() {
    // 获取token
    this.queryToken().then(msg => {
      config.token = msg.result.token;
    }).catch(err => {
        console.info(err);
    });
  },

  init3DAr() {

    listener.stop();
    
    // 获取画布组件
    wx.createSelectorQuery()
      .select('#' + canvasId)
      .fields({ node: true, size: true })
      .exec(res => {
        // 画布组件
        canvas1 = res[0].node
        // 启动AR会话
        cameraBusiness.initEnvironment(canvas1)
        // 加载3D模型
        // cameraBusiness.loadModel(robotUrl, function (model, animations) {
        //   // 创建AR的坐标系
        //   cameraBusiness.initWorldTrack(model)
        //   // 加载3D模型的动画
        //   cameraBusiness.createAnimation(model, animations, 'Dance')
        // })
        // webgl画面录制器
      })
  },


  onCameraInit() {
    this.runningCrs = true
    console.log(111)

    wx.createSelectorQuery()
      .select('#capture')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;

        this.crsClient = new CrsClient(config, canvas);

        const cameraContext = wx.createCameraContext();
        listener = cameraContext.onCameraFrame(frame => {
          this.queryImage(frame);
        });
        listener.start();

      })
    
  },

  onUnload() {
    console.log('onUnload')
    // 将对象回收
    cameraBusiness.dispose()
    if (recorder) {
      recorder.destroy()
      recorder = null
    }
    isRecording = false
  },
  bindtouchend_callback(event) {
    console.log('bindtouchend_callback')
    // 在手指点击的位置放置3D模型 
    cameraBusiness.addModelByHitTest(event, false, false)
  },

  queryImage: function (frame) {
    if (!this.runningCrs || this.busy || !this.crsClient) return;

    //最短的两次CRS请求间隔
    let now = new Date().getTime();
    if (this.last && (now - this.last < config.minInterval)) return;
    this.last = now;

    this.busy = true; //如果正在进行CRS请求，就不允许再次请求

    this.crsClient.queryImage(frame).then(res => {

      this.number = this.number ? (++this.number) : 1
      
      if (!this.runningCrs) return; //避免在停止后仍然触发
      let result = res && res.result;
      if (!result) return;
      
      console.log(this.number)

      if (result.target || this.number > 5) {

        this.init3DAr()

        console.log("识别成功", result.target.targetId);
        this.runningCrs = false;
        this.hideLoading();

        // todo: 解析meta中的信息，触发业务逻辑

        //如果待触发的id列表中存在识别到的这个id，就触发
        if (this.data.targetIds.find(targetId => targetId === result.target.targetId)) {
          this.onResult(result.target);
        }
      } else {
        console.log("识别失败", result.message);
      }
      this.busy = false;
    }).catch(e => {
      this.busy = false;
      console.log(e);
    }); //小程序iOS端不支持finally，所以在then和catch里分别设置busy = false
  },

  onResult: function (target) {
    console.log("触发内容!");
    if (target.meta) {
      console.log("meta base64:", target.meta);
    }
    this.setData({
      showOverlay: false,
      showContent: true,
      selectType: SELECT_TYPE.IMAGE,
    });
  },

  /**
   * 生成token
   */
  queryToken: function() {
    const obj = {
        'apiKey': config.apiKey,
        'expires': 86400,
        'timestamp': Date.now(),
        'acl': `[{"service":"ecs:crs","effect":"Allow","resource":["${config.crsAppId}"],"permission":["READ","WRITE"]}]`
    };

    const str = Object.keys(obj).sort().map(k => k + obj[k]).join('');
    obj.signature = CryptoJS.SHA256(str + config.apiSecret, '').toString();

    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://uac.easyar.com/token/v2',
            method: 'post',
            data: obj,
            header: {
                'content-type': 'application/json'
            },
            success: res => resolve(res.data),
            fail: err => reject(err),
        });
    });
  },


});