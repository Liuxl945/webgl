
import bottleConf from "../conf/bottle-conf"
import blockConf from "../conf/block-conf"

import headImage from  "../../assets/images/head.png"
import bottomImage from  "../../assets/images/bottom.png"
import meddleImage from "../../assets/images/bottom.png"

class Bottle {
    constructor() {
        this.instance = null
    }

    init() {
        let loader = new THREE.TextureLoader()
        this.instance = new THREE.Object3D()
        this.instance.name = "bottle"
        let { x, y, z } = bottleConf.initPosition
        // + blockConf.height/2
        this.instance.position.set(x, y + blockConf.height/2, z)

        let bottle = new THREE.Object3D()
        let body = new THREE.Object3D()
        
        const specularTexture = loader.load(headImage)
        console.log(specularTexture)
        let specularMaterial = new THREE.MeshBasicMaterial({
            map: specularTexture
        })

        let headRadius = bottleConf.headRadius

        // 头部
        let head = new THREE.Mesh(
            new THREE.OctahedronGeometry(headRadius),
            specularMaterial
        )
        head.position.y = 3.57143 * headRadius
        head.castShadow = true
        bottle.add(head)
        
        // 中间
        const meddleTexture = loader.load(meddleImage)
        const meddleMaterial = new THREE.MeshBasicMaterial({
            map: meddleTexture
        })

        let meddle = new THREE.Mesh(
            new THREE.CylinderGeometry(headRadius/1.4, headRadius/1.4 * 0.88, headRadius * 1.2, 20),
            meddleMaterial
        )
        meddle.position.y = 1.3857 * headRadius
        meddle.castShadow = true
        body.add(meddle)
        
        // 中间顶部
        let topGeometry = new THREE.SphereGeometry(headRadius/1.4, 20, 20)
        topGeometry.scale(1, 0.54, 1)
        let top = new THREE.Mesh(
            topGeometry,
            specularMaterial
        )
        top.position.y = 1.8143 * headRadius
        body.add(top)
        
        const bottomTexture = loader.load(bottomImage)
        const bottomMaterial = new THREE.MeshBasicMaterial({
            map: bottomTexture
        })
        // 底部
        let bottom = new THREE.Mesh(
            new THREE.CylinderGeometry(0.62857 * headRadius, 0.907143 * headRadius, 1.91423 * headRadius, 20),
            bottomMaterial
        )
        bottom.castShadow = true
        body.add(bottom)
        bottle.position.y = 2.0
        bottle.add(body)
        this.instance.add(bottle)
    }
}

export default new Bottle()