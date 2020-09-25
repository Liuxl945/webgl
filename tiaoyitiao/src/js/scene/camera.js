import sceneConf from "../conf/scene-conf"

class Camera {
    constructor() {
        this.instance = null
    }

    init() {
        const aspect = window.innerHeight / window.innerWidth
        this.instance = new THREE.OrthographicCamera(-sceneConf.frustumSize, sceneConf.frustumSize, sceneConf.frustumSize * aspect, -sceneConf.frustumSize * aspect, -100, 85)

        this.instance.position.x = -10
        this.instance.position.y = 10
        this.instance.position.z = 10

        this.instance.lookAt(new THREE.Vector3(0, 0, 0))
    }
}

export default new Camera()