let THREE;

export default class Render3d {
  constructor(three, canvas, openAntialias = true) {
    THREE = three;
    const { width, height } = canvas;

    this._newScene();
    this._addCamera(width, height);
    this._addLight();
    this._addRender(openAntialias);
    const { pixelRatio } = wx.getSystemInfoSync();
    canvas.width *= pixelRatio;
    canvas.height *= pixelRatio;
    this.renderer.setPixelRatio(pixelRatio);

    this.render(canvas);
  }

  _newScene() {
    this.scene = new THREE.Scene();
  }

  _addDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    this.scene.add(directionalLight.target);
    directionalLight.position.set(0, 0, 1);
    this.scene.add(directionalLight);

    this.directionalLight = directionalLight;
  }

  _addAmbientLight() {
    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);
  }

  _addLight() {
    this._addAmbientLight();
    this._addDirectionalLight();
  }

  _addCamera(width, height) {
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }

  _addRender(openAntialias) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: openAntialias
    });
    this.renderer.setClearColor(0xffffff);
  }

  render(canvas) {
    this.renderer.render(this.scene, this.camera);
    this.rafHandler = canvas.requestAnimationFrame(() => this.render(canvas));
  }
}
