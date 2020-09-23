import BaskBock from "./base"

class Cuboid extends BaskBock {
    constructor(x, y, z, width) {
        super("cuboid")
        this.x = x
        this.y = y
        this.z = z 

        const size = width || this.width
        const geomery = new THREE.BoxGeometry(size, this.height, size)
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

export default Cuboid