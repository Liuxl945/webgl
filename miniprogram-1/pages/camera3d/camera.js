const cameraBusiness = require('./utils/cameraBusiness.js')
const canvasId = 'canvas1';
// a gltf model url
const modelUrl = '/images/robot.glb';
// localhost url
// const modelUrl = 'http://127.0.0.1/models/robot.glb';
var isDeviceMotion = false;
var isIOS = false;

Page({
  data: {
    devicePosition: 'back',
  },
  onLoad() {
    const system = wx.getSystemInfoSync().system;
    // if iOS
    if (system.indexOf('iOS') !== -1) {
      isIOS = true;
    }
    setTimeout( async() =>{
      await cameraBusiness.initThree(canvasId, modelUrl,isIOS);
      
      // this.onCameraInit()
      cameraBusiness.loadModel(modelUrl)
      setTimeout(() => {
        cameraBusiness.startDeviceMotion();
      }, 200);
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
          
          let ctxImageData = this.context.createImageData(frame.width, frame.height); //#1
          ctxImageData.data.set(new Uint8ClampedArray(frame.data)); //#1
          this.context.putImageData(ctxImageData, 0, 0); //#1
          let dataUrl = this.canvas.toDataURL("image/jpeg", 0.7); //#2

          // console.log(dataUrl)
        });
        this.listener.start();

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
  
});
