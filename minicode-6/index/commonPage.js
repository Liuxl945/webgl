import { createScopedThreejs } from "threejs-miniprogram";
import Render3d from "./render3d";

export default (openAntialias) =>
  Page({
    onReady() {
      wx.createSelectorQuery()
        .select("#render")
        .node()
        .exec(res => {
          const canvas = res[0].node;
          // 创建一个与 canvas 绑定的 three.js
          const THREE = createScopedThreejs(canvas);
          // 传递并使用 THREE 变量
          this.init(THREE, canvas);

          this.canvas = canvas;
        });
    },

    onUnload() {
        const { render3d } = this;
        if (render3d) {
            this.canvas.cancelAnimationFrame(render3d.rafHandler);
        }
        clearInterval(this.timer);
    },

    init(THREE, canvas) {
      const render3d = new Render3d(THREE, canvas, openAntialias);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cube = new THREE.Mesh(geometry, material);
      render3d.scene.add(cube);
      cube.onBeforeRender = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      };

      this.render3d = render3d;

      this.timer = setInterval(() => {
        this.readPixels();
      }, 1000);
    },

    readPixels() {
      const { render3d } = this;
      const gl = render3d.renderer.getContext();

      render3d.renderer.render(render3d.scene, render3d.camera);

      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
      const pixels = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      wx.createSelectorQuery().select('#canvas').fields({ node: true, size: true }).exec((res) => {
        const canvas2d = res[0].node
        const ctx = canvas2d.getContext('2d');

        const img = canvas2d.createImageData(pixels, width, height);
        canvas2d.height = img.height;
        canvas2d.width = img.width;

        ctx.putImageData(img, 0, 0);
      })
      
      console.log(
        "All pixels are black and transparent：",
        pixels.some(v => v),
        pixels
      );
    }
  });
