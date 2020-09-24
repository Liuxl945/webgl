
import bottleConf from "../conf/bottle-conf"
import blockConf from "../conf/block-conf"

import headImage from  "../../assets/images/head.png"
import bottomImage from  "../../assets/images/bottom.png"
import meddleImage from "../../assets/images/bottom.png"
import TWEEN from "@tweenjs/tween.js"

class Bottle {
    constructor() {
        this.instance = null
        this.direction = 0
        this.axis = null
    }

    init() {
        this.loader = new THREE.TextureLoader()
        this.instance = new THREE.Object3D()
        this.instance.name = "bottle"
        let { x, y, z } = bottleConf.initPosition
        // + blockConf.height/2
        this.instance.position.set(x, y + blockConf.height/2, z)

        this.bottle = new THREE.Object3D()
        this.human = new THREE.Object3D()
        this.body = new THREE.Object3D()
        
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
        this.human.add(head)
        
        // 中间
        

        let meddle = new THREE.Mesh(
            new THREE.CylinderGeometry(headRadius/1.4, headRadius/1.4 * 0.88, headRadius * 1.2, 20),
            bottomMaterial
        )
        meddle.position.y = 1.3857 * headRadius
        meddle.castShadow = true
        this.body.add(meddle)
        
        // 中间顶部
        let topGeometry = new THREE.SphereGeometry(headRadius/1.4, 20, 20)
        topGeometry.scale(1, 0.54, 1)
        let top = new THREE.Mesh(
            topGeometry,
            bottomMaterial
        )
        top.position.y = 1.9143 * headRadius
        this.body.add(top)
        
        // 底部
        let bottom = new THREE.Mesh(
            new THREE.CylinderGeometry(0.62857 * headRadius, 0.907143 * headRadius, 1.91423 * headRadius, 20),
            bottomMaterial
        )
        bottom.castShadow = true
        this.body.add(bottom)
        this.bottle.position.y = 2.0
        this.human.add(this.body)
        this.bottle.add(this.human)
        this.instance.add(this.bottle)
    }

    rotate() {
        const scale = 1.4
        if(this.direction === 0) {
            this.humanTween = new TWEEN.Tween(this.human.rotation).to({
                z: this.human.rotation.z - Math.PI
            }, 140).start()
            this.humanTween2 = new TWEEN.Tween(this.human.rotation).to({
                z: this.human.rotation.z - 2 * Math.PI
            }, 180).delay(140).start() 
            this.humanTween.chain(this.humanTween2) //在执行完humanTween之后执行humanTween2



            this.headTween = new TWEEN.Tween(this.head.position).to({
                x: this.head.position.x + 0.45 * scale,
                y: this.head.position.y + 0.9 * scale,
            }, 100).start()
            this.headTween2 = new TWEEN.Tween(this.head.position).to({
                x: this.head.position.x - 0.45 * scale,
                y: this.head.position.y - 0.9 * scale,
            }, 100).delay(100).start()
            this.headTween3 = new TWEEN.Tween(this.head.position).to({
                x: 0,
                y: 3.57143 * bottleConf.headRadius,
            }, 150).delay(250).start()
            this.headTween.chain(this.headTween2) //在执行完humanTween之后执行humanTween2
            this.headTween2.chain(this.headTween3)//在执行完humanTween2之后执行humanTween3



            this.bodyTween = new TWEEN.Tween(this.body.scale).to({
                x: Math.max(Math.min(1 / scale, 1), 0.7),
                y: Math.max(scale, 1),
                z: Math.max(Math.min(1 / scale, 1), 0.7)
            }, 100).start()
            this.bodyTween2 = new TWEEN.Tween(this.body.scale).to({
                x: Math.max(scale, 1.2),
                y: Math.min(0.9 / scale, 0.7),
                z: Math.max(scale, 1.2)
            }, 100).delay(100).start()
            this.bodyTween3 = new TWEEN.Tween(this.body.scale).to({
                x: 1,
                y: 1,
                z: 1
            }, 300).delay(200).start()
            this.bodyTween.chain(this.bodyTween2) //在执行完humanTween之后执行humanTween2
            this.bodyTween2.chain(this.bodyTween3)//在执行完humanTween2之后执行humanTween3

        }else{
            this.humanTween = new TWEEN.Tween(this.human.rotation).to({
                x: this.human.rotation.x - Math.PI
            }, 140).start()
            this.humanTween2 = new TWEEN.Tween(this.human.rotation).to({
                x: this.human.rotation.x - 2 * Math.PI
            }, 180).delay(140).start() 
            this.humanTween.chain(this.humanTween2) //在执行完humanTween之后执行humanTween2



            this.headTween = new TWEEN.Tween(this.head.position).to({
                z: this.head.position.x + 0.45 * scale,
                y: this.head.position.y + 0.9 * scale,
            }, 100).start()
            this.headTween2 = new TWEEN.Tween(this.head.position).to({
                z: this.head.position.x - 0.45 * scale,
                y: this.head.position.y - 0.9 * scale,
            }, 100).delay(100).start()
            this.headTween3 = new TWEEN.Tween(this.head.position).to({
                z: 0,
                y: 3.57143 * bottleConf.headRadius,
            }, 150).delay(200).start()
            this.headTween.chain(this.headTween2) //在执行完humanTween之后执行humanTween2
            this.headTween2.chain(this.headTween3)//在执行完humanTween2之后执行humanTween3



            this.bodyTween = new TWEEN.Tween(this.body.scale).to({
                x: Math.max(Math.min(1 / scale, 1), 0.7),
                y: Math.max(scale, 1),
                z: Math.max(Math.min(1 / scale, 1), 0.7)
            }, 50).start()
            this.bodyTween2 = new TWEEN.Tween(this.body.scale).to({
                x: Math.max(scale, 1.2),
                y: Math.min(0.9 / scale, 0.7),
                z: Math.max(scale, 1.2)
            }, 50).delay(50).start()
            this.bodyTween3 = new TWEEN.Tween(this.body.scale).to({
                x: 1,
                y: 1,
                z: 1
            }, 200).delay(100).start()
            this.bodyTween.chain(this.bodyTween2) //在执行完humanTween之后执行humanTween2
            this.bodyTween2.chain(this.bodyTween3)//在执行完humanTween2之后执行humanTween3
        }
    }

    setDirection(direction, axis) {
        this.direction = direction
        this.axis = axis
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