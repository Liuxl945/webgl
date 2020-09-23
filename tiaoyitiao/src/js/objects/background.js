import sceneConf from "../conf/scene-conf"

class Background {
    constructor() {
        this.instance = null
    }

    init() {
        const aspect = window.innerHeight / window.innerWidth

        const geometry = new THREE.PlaneGeometry(sceneConf.frustumSize * 2 ,aspect * sceneConf.frustumSize * 2)
        const material = new THREE.MeshBasicMaterial({
            color: 0xd7dbe6,
            transparent: true,
            opacity: 1
        })

        this.instance = new THREE.Mesh(geometry, material)
    }
}

export default new Background