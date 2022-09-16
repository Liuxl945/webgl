const cameraBusiness = require('./utils/cameraBusiness.js')
import { CryptoJS } from "../../utils/CryptoJS";

const canvasId = 'canvas1';
// a gltf model url
const modelUrl = '/images/robot.glb';
// localhost url
// const modelUrl = 'http://127.0.0.1/models/robot.glb';
var isDeviceMotion = false;
var isIOS = false;

Page({

  runningCrs: false,

  data: {
    devicePosition: 'back',
    showOverlay: true,
    showLoading: false,
    showLoadingText: "",

    //CRS配置
    config: {
      apiKey: 'c3b41fdaa87f0d5ab404410ae2ceb5e1', // EasyAR开发中心 - API KEY - API Key
      apiSecret: 'd7aabce759e4c04de095351946a57bdd358b1fc7cd72e99b6cf04c869157b179', // EasyAR开发中心 - API KEY - API Secret
      crsAppId: '323406ab2e2ab79ccce8bdf2f99fcdd4', // EasyAR开发中心 - 云服务 - 云识别管理 - 云识别库信息 - CRS AppId
      token: '8MeMrvOA0vJ45c/OKEPpPRwyATsb5bIKD3MmM5SK+uvqG585YzFU2b4nCOum7I+y2aoLXBo9G0vxut4FQ4Y8edPnOlVAaeQRxueUIJe0/q+omtSDbuJ3OduJUhVhM1b8ymrSLUQWaNK/QW8pXn/zi3kKbvWNSdwNZg8OmeCfKtdvKkqO+d0FsH1ZVI32VszjguK+sqCBO8+VUFJOWzgPm8z+5stNpSUUJNb0uxpaKqgEEVVhUzpv9rIro3JVOqteHava00ueqb2s8fjDkwg0t89VjDmOuJn42L/o32u/4CVm3FYfzLl2f+Ctli/CClknSby21DbiTKeJkXZ2atv5f8vItx/LD7CVqAhUa+ugKLz5Ddwfmj0zDph1m6PLK9wb2SPJs6qIY+S1nS77+wfYfLS8zofIV1hAv1glORAFEarjER2h7M9eR3O+llGAy9UJ9a8aDJgU9nnUPKZq8kZUjw==',
      clientHost: 'https://cn1-crs.easyar.com:8443', //服务器一般不变
      jpegQuality: 0.7, //JPEG压缩质量，建议不低于70%
      minInterval: 1500, //最短的两次CRS请求间隔
    },
    //识别到这个数组中的ID就触发内容
    targetIds: [
      // "e5f4d839-c47a-41ca-88f3-2c37861782e8",
      "5ef67339-5f08-4f78-908e-aa7df0221f9f"
    ],

  },
  onLoad() {
    const system = wx.getSystemInfoSync().system;
    // if iOS
    if (system.indexOf('iOS') !== -1) {
      isIOS = true;
    }

    // 获取token
    this.queryToken().then(msg => {
      this.data.config.token = msg.result.token;
    }).catch(err => {
      console.info(err);
    });



    setTimeout( async() =>{
      await cameraBusiness.initThree(canvasId, modelUrl,isIOS);
    },150);
   
  },
  onUnload() {
    cameraBusiness.stopAnimate();
    cameraBusiness.stopDeviceMotion();
  },
  onError_callback(){
    wx.showToast({
      title: 'The camera does not open.',
    });
  },

  onCameraInit() {

    wx.createSelectorQuery()
      .select('#capture')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node;

        //设置canvas内部尺寸为480*640，frame-size="medium"的设置下相机帧大多是480*640
        canvas.width = 480;
        canvas.height = 640;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');


        let cameraContext = wx.createCameraContext();
        this.listener = cameraContext.onCameraFrame(frame => {

          

          this.runningCrs && this.queryImage(frame)
        });
        this.listener.start();

      })
  },



  queryImage(frame) {
    if (!this.runningCrs || this.busy) return;
    //最短的两次CRS请求间隔
    let now = new Date().getTime();
    if (this.last && (now - this.last < this.data.config.minInterval)) return;
    this.last = now;
    this.busy = true; //如果正在进行CRS请求，就不允许再次请求

    let ctxImageData = this.context.createImageData(frame.width, frame.height); //#1
    ctxImageData.data.set(new Uint8ClampedArray(frame.data)); //#1
    this.context.putImageData(ctxImageData, 0, 0); //#1
    let dataUrl = this.canvas.toDataURL("image/jpeg", 0.7); //#2
    let base64 = dataUrl.substr(23); //#2 去除dataURL头，留下文件内容

    const params = { //#3 添加cloudKey参数
        image: base64,
        notracking: "true",
        appId: this.data.config.crsAppId,
    };

    wx.request({
      url: `https://cn1-crs.easyar.com:8443/search/`,
      method: 'post',
      data: params,
      header: {
          'Authorization': this.data.config.token,
          'content-type': 'application/json'
      },
      success: res => {
        
        let result = res.data && res.data.result;
        if (!result){
          this.busy = false;
          return
        };

        if (result.target) {
          if (this.data.targetIds.find(targetId => targetId === result.target.targetId)) {
            wx.showToast({
              title: '识别成功',
              icon: "success"
            })
            
            this.setData({
              showLoadingText: "识别成功啦！！！"
            })

            this.experience()

            this.runningCrs = false
          }
          
        }
        
        this.busy = false;
      },
      fail: err => {
        wx.showToast({
          title: err.errMsg,
          icon: "none"
        })
        
        this.busy = false;
      },
    });

  },

  async experience() {
    this.setData({
      showOverlay: false,
    })
    await cameraBusiness.loadModel(modelUrl)
    cameraBusiness.startDeviceMotion();
    
    setTimeout(() => {
      this.setData({
        showLoading: false,
      })
    }, 1000);

  },

  scan() {
    this.runningCrs = true //开始识别图片

    this.setData({
      showOverlay: false,
      showLoading: true,
      showLoadingText: "识别中",
    })
  },

  bindtouchstart_callback(event) {
    // stop the Device Motion
    if (isDeviceMotion) {
      cameraBusiness.stopDeviceMotion();
    }
    cameraBusiness.onTouchstart(event);
  },
  bindtouchmove_callback(event) {
    cameraBusiness.onTouchmove(event);
  },

  queryToken() {
    const obj = {
      'apiKey': this.data.config.apiKey,
      'expires': 86400,
      'timestamp': Date.now(),
      'acl': `[{"service":"ecs:crs","effect":"Allow","resource":["${this.data.config.crsAppId}"],"permission":["READ","WRITE"]}]`
    };

    const str = Object.keys(obj).sort().map(k => k + obj[k]).join('');
    obj.signature = CryptoJS.SHA256(str + this.data.config.apiSecret, '').toString();

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
