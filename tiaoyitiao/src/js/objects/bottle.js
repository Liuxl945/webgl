
import bottleConf from "../conf/bottle-conf"
import blockConf from "../conf/block-conf"

import headImage from  "../../assets/images/head.png"
import bottomImage from  "../../assets/images/bottom.png"
import meddleImage from "../../assets/images/bottom.png"
import TWEEN from "@tweenjs/tween.js"

class Bottle {
    constructor() {
        this.instance = null
    }

    init() {
        this.loader = new THREE.TextureLoader()
        this.instance = new THREE.Object3D()
        this.instance.name = "bottle"
        let { x, y, z } = bottleConf.initPosition
        // + blockConf.height/2
        this.instance.position.set(x, y + blockConf.height/2, z)

        let bottle = new THREE.Object3D()
        let body = new THREE.Object3D()
        
        const { headTMaterial, meddleMaterial, bottomMaterial } = this.loadTexture()
        const headRadius = bottleConf.headRadius

        // 头部
        let head = new THREE.Mesh(
            new THREE.OctahedronGeometry(headRadius),
            bottomMaterial
        )
        head.position.y = 3.57143 * headRadius
        head.castShadow = true
        this.head = head
        bottle.add(head)
        
        // 中间
        

        let meddle = new THREE.Mesh(
            new THREE.CylinderGeometry(headRadius/1.4, headRadius/1.4 * 0.88, headRadius * 1.2, 20),
            bottomMaterial
        )
        meddle.position.y = 1.3857 * headRadius
        meddle.castShadow = true
        body.add(meddle)
        
        // 中间顶部
        let topGeometry = new THREE.SphereGeometry(headRadius/1.4, 20, 20)
        topGeometry.scale(1, 0.54, 1)
        let top = new THREE.Mesh(
            topGeometry,
            bottomMaterial
        )
        top.position.y = 1.9143 * headRadius
        body.add(top)
        
        // 底部
        let bottom = new THREE.Mesh(
            new THREE.CylinderGeometry(0.62857 * headRadius, 0.907143 * headRadius, 1.91423 * headRadius, 20),
            bottomMaterial
        )
        bottom.castShadow = true
        body.add(bottom)
        bottle.position.y = 2.0
        bottle.add(body)
        this.bottle = bottle
        this.instance.add(bottle)
    }

    loadTexture() {
        const headTexture = this.loader.load(headImage)
        const headTMaterial = new THREE.MeshBasicMaterial({
            map: headTexture
        })

        const meddleTexture = this.loader.load(meddleImage)
        const meddleMaterial = new THREE.MeshBasicMaterial({
            map: meddleTexture
        })

        const bottomTexture = this.loader.load(bottomImage)
        const bottomMaterial = new THREE.MeshBasicMaterial({
            map: bottomTexture
        })

        return { headTMaterial, meddleMaterial, bottomMaterial }
    }

    update() {
        this.head.rotation.y += 0.02
    }

    showUp() {
        console.log(TWEEN)
        const coords = { y: 10 }
        this.Tween = new TWEEN.Tween(coords).to({
            y: 2
        }, 1000)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(() => {
            this.bottle.position.y = coords.y
        })
        .start() 
    }
}

export default new Bottle()