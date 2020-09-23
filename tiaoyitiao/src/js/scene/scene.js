import camera from "./camera"
import light from "./light"
import background from "../objects/background"

class Scene {
    constructor() {
        this.instance = null
        this.camera = camera
        this.light = light
        this.background = background
    }

    init() {
        this.instance = new THREE.Scene()
        let canvas = document.querySelector("#myCanvas")
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            preserveDrawingBuffer: true, //开启缓冲区
            antialias: true //抗锯齿
        })

        // 设置大小   很重要不然图像出不来
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.shadowMap.enabled = true //开启阴影
        renderer.shadowMap.type = THREE.PCFShadowMap

        this.renderer = renderer
        
        this.camera.init()
        this.light.init()
        this.background.init()

        // 加入XYZ轴
        this.axesHelper = new THREE.AxesHelper(150)

        this.instance.add(this.axesHelper)
        this.instance.add(this.camera.instance)
        for(let lightType in this.light.instances) {
            this.instance.add(this.light.instances[lightType])
        }

        this.background.instance.position.z = -84
        this.camera.instance.add(this.background.instance)
    }

    render() {
        this.renderer.render(this.instance, this.camera.instance)
    }
}

export default new Scene()