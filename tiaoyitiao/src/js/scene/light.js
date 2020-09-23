class Light {
    constructor() {
        this.instances = {}
    }

    init() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        const shadowLight = new THREE.DirectionalLight(0xffffff, 0.3)
        shadowLight.position.set(10, 30, 20)
        shadowLight.castShadow = true //开启阴影
        
        let basicMeterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
        // 平行光方向
        let shadowTarget = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), basicMeterial)
        shadowTarget.visible = false
        shadowTarget.name = "shadowTarget"
        shadowLight.target = shadowTarget
        shadowLight.shadow.camera.near = 0.5
        shadowLight.shadow.camera.far = 500
        shadowLight.shadow.camera.left = -100
        shadowLight.shadow.camera.right = 100
        shadowLight.shadow.camera.top = 100
        shadowLight.shadow.camera.bottom = -100
        shadowLight.shadow.mapSize.width = 1024
        shadowLight.shadow.mapSize.height = 1024

        this.instances.ambientLight = ambientLight
        this.instances.shadowLight = shadowLight
        this.instances.shadowTarget = shadowTarget
    }
}

export default new Light()