class Ground {
    constructor() {
        this.instance = null
    }

    init() {
        const groundGemotry = new THREE.PlaneGeometry(200, 200)
        const meterial = new THREE.ShadowMaterial({
            transparent: true,
            color: 0x000000,
            opacity: 0.3
        })

        this.instance = new THREE.Mesh(groundGemotry, meterial)
        this.instance.receiveShadow = true //开启阴影
        this.instance.rotation.x = Math.PI / -2
        this.instance.position.y = -16 / 3.2
    }
    
}

export default new Ground()