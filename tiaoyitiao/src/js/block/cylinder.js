import BaskBock from "./base"

class Cylinder extends BaskBock {
    constructor(x, y, z, width) {
        super("cylinder")
        this.x = x
        this.y = y
        this.z = z 

        const size = width || this.width
        const geomery = new THREE.CylinderGeometry(size / 2, size / 2, this.height, 120)
        const meterial = new THREE.MeshPhongMaterial({
            color: 0xffffff
        })

        this.instance = new THREE.Mesh(geomery, meterial)
        this.instance.name = "block"
        this.instance.receiveShadow = true
        this.instance.castShadow = true
        
        this.instance.position.x = this.x
        this.instance.position.y = this.y
        this.instance.position.z = this.z
    }
}

export default Cylinder