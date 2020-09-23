
import bottleConf from "../conf/bottle-conf"
import blockConf from "../conf/block-conf"

class Bottle {
    constructor() {
        this.instance = null
    }

    init() {
        this.instance = new THREE.Object3D()
        this.instance.name = "bottle"
        let { x, y, z } = bottleConf.initPosition
        // + blockConf.height/2
        this.instance.position.set(x, y + blockConf.height/2, z)

        let bottle = new THREE.Object3D()
        let body = new THREE.Object3D()

        let basicMaterial = new THREE.MeshPhongMaterial({
            color: 0x800080
        })

        let headRadius = bottleConf.headRadius

        let head = new THREE.Mesh(
            new THREE.OctahedronGeometry(headRadius),
            basicMaterial
        )
        head.position.y = 3.57143 * headRadius
        head.castShadow = true
        bottle.add(head)
        
        let meddle = new THREE.Mesh(
            new THREE.CylinderGeometry(headRadius/1.4, headRadius/1.4 * 0.88, headRadius * 1.2, 20),
            basicMaterial
        )
        meddle.position.y = 1.3857 * headRadius
        meddle.castShadow = true
        body.add(meddle)

        let topGeometry = new THREE.SphereGeometry(headRadius/1.4, 20, 20)
        topGeometry.scale(1, 0.54, 1)
        let top = new THREE.Mesh(
            topGeometry,
            basicMaterial
        )
        top.position.y = 1.8143 * headRadius
        body.add(top)


        let bottom = new THREE.Mesh(
            new THREE.CylinderGeometry(0.62857 * headRadius, 0.907143 * headRadius, 1.91423 * headRadius, 20),
            basicMaterial
        )
        bottom.castShadow = true
        body.add(bottom)
        bottle.position.y = 2.0
        bottle.add(body)
        this.instance.add(bottle)
    }
}

export default new Bottle()