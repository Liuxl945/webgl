// index.ts
import { $requestAnimationFrame as requestAnimationFrame, $window as window, Clock, PerspectiveCamera, PLATFORM, Scene, sRGBEncoding, TextureLoader, Vector2, WebGL1Renderer, WebGLRenderingContext } from 'three-platformize'
import { WechatPlatform } from 'three-platformize/src/WechatPlatform'
import { GLTFLoader } from 'three-platformize/examples/jsm/loaders/GLTFLoader'
import { DemoGLTFLoader, DemoDeps, Demo } from 'three-platformize-demo/src/index'
import flip from './flip.js'

// @ts-ignore
Page({
  disposing: false,
  switchingItem: false,
  platform: null as unknown as WechatPlatform,
  demo: null as unknown as Demo,
  screenshotResolve: null as unknown as Function,
  canvas2d: null as unknown as  WechatMiniprogram.Canvas,

  data: {},

  onReady() {
    wx.createSelectorQuery().select('#gl').fields({ node: true, size: true }).exec((res) => {
      if (res[0]) this.initCanvas(res[0].node, res[0].width, res[0].height)
    })

    wx.createSelectorQuery().select('#canvas').fields({ node: true, size: true }).exec((res) => {
      this.canvas2d = res[0].node as WechatMiniprogram.Canvas;
    })
  },

  initCanvas(canvas, w, h) {
    const platform = new WechatPlatform(canvas);
    this.platform = platform;
    PLATFORM.set(platform);

    const renderer = new WebGL1Renderer({ canvas, antialias: true, alpha: true });
    const camera = new PerspectiveCamera(45, w / h, 0.1, 1000);
    const scene = new Scene();
    const clock = new Clock();
    const gltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();

    scene.position.z = -3;
    renderer.outputEncoding = sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);

    const deps: DemoDeps = { renderer, camera, scene, clock, gltfLoader, textureLoader }
    const demo = new DemoGLTFLoader(deps);

    this.demo = demo;
    demo.init()

    const gl = renderer.getContext() as WebGLRenderingContext;
    const frameBuffer = new Vector2();
    renderer.getDrawingBufferSize(frameBuffer);
    const pixelData = new Uint8Array(frameBuffer.x * frameBuffer.y * 4);

    const render = () => {
      if (this.disposing) return
      requestAnimationFrame(render);
      demo.update()
      renderer.render(scene, camera);

      if (this.screenshotResolve) {
        // @ts-ignore 参考 Threejs WebGLRenderer.readRenderTargetPixels
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
          // @ts-ignore
          gl.readPixels(0, 0, frameBuffer.x, frameBuffer.y, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);
          // 翻转Y轴
          flip(pixelData, frameBuffer.x, frameBuffer.y, 4);
          // 确保有像素，微信小程序安卓在进入子页面返回本页面后，再一次readPixels稳定无像素
          if (pixelData.some(i => i !== 0)) {
            this.screenshotResolve([pixelData, frameBuffer.x, frameBuffer.y])
            this.screenshotResolve = null as unknown as Function;
          }
        }
      }
    }

    render()
  },

  onTS(e) {
    this.platform.dispatchTouchEvent(e);
  },

  onTM(e) {
    this.platform.dispatchTouchEvent(e);
  },

  onTE(e) {
    this.platform.dispatchTouchEvent(e);
  },

  onBtnClick() {
    this.screenshot().then(([data, width, height]) => {

      // @ts-ignore
      console.log(11111)



      const canvas = this.canvas2d
      const ctx = canvas.getContext('2d');
      // @ts-ignore
      const img = canvas.createImageData(data, width, height);
      // @ts-ignore
      canvas.height = img.height;
      // @ts-ignore
      canvas.width = img.width;
      
      // @ts-ignore
      ctx.putImageData(img, 0, 0);
    })
  },

  screenshot() {
    return new Promise<[Uint8Array, number, number]>((resolve) => {
      this.screenshotResolve = resolve
    })
  },

  onUnload() {
    this.disposing = true;
    PLATFORM.dispose()
  }
})
