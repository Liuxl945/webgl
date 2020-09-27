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
        this.target = new THREE.Vector3(0, 0, 0)
        this.instance.lookAt(this.target)
    }

    updatePosition(newTargetPosition) {
        new TWEEN.Tween(this.instance.position).to({
            x: newTargetPosition.x - 10, 
            y: newTargetPosition.y + 10, 
            z: newTargetPosition.z + 10
        }, 200).start()

        new TWEEN.Tween(this.target).to({
            x: newTargetPosition.x, 
            y: newTargetPosition.y, 
            z: newTargetPosition.z
        }, 200).start()
    }

    reset() {
        this.instance.position.x = -10
        this.instance.position.y = 10
        this.instance.position.z = 10
        this.target = new THREE.Vector3(0, 0, 0)
    }
}

export default new Camera()