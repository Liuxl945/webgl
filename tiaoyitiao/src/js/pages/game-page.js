import { scene } from "../scene/index"
import Cuboid from "../block/cuboid"
import Cylinder from "../block/cylinder"
import ground from "../objects/ground"
import bottle from "../objects/bottle"
import gameConf from "../conf/game-conf"
import bottleConf from "../conf/bottle-conf"
import blockConf from "../conf/block-conf"
import utils from "../utils/index"

class GamePage {
    constructor(callbacks) {
        this.callbacks = callbacks
        this.scene = scene
        this.ground = ground
        this.bottle = bottle
        this.targetPosition = {

        }
        this.checkingHit = false
        this.state = "stop"
    }

    init() {
        // this.traingleShape()
        this.scene.init()
        this.ground.init()
        this.bottle.init()
        this.addInitBlock()
        this.addGround()
        this.addBottle()
        this.bottle.showUp()
        this.bindTouchEvent()
        this.render()
    }

    bindTouchEvent() {
        this.canvas = document.querySelector("#myCanvas")

        this.canvas.addEventListener("touchstart", this.touchStartCallback)
        this.canvas.addEventListener("touchend", this.touchEndCallback)
    }

    removeTouchEvent() {
        this.canvas.removeEventListener("touchstart", this.touchStartCallback)
        this.canvas.removeEventListener("touchend", this.touchEndCallback)
    }

    touchStartCallback = () => {
        this.touchStartTime = Date.now()
        this.bottle.strink()
        this.currentBlock.shrink()
    }

    touchEndCallback = () => {
        this.touchEndTime = Date.now()
        const duration = this.touchEndTime - this.touchStartTime
        this.bottle.velocity.vx = Math.min(duration / 6 , 400)
        this.bottle.velocity.vx = +this.bottle.velocity.vx.toFixed(2)
        this.bottle.velocity.vy = Math.min(150 + duration / 20, 400)
        this.bottle.velocity.vy = +this.bottle.velocity.vy.toFixed(2)

        this.hit = this.getHitStatus(this.bottle, this.currentBlock, this.nextBlock, blockConf.height / 2 - (1 - this.currentBlock.instance.scale.y) * blockConf.height)
        this.checkingHit = true

        this.bottle.stop()
        this.currentBlock.stop()
        this.bottle.rotate()
        this.bottle.jump()
    }

    setDirection(direction) {
        const currentPosition = {
            x: this.bottle.instance.position.x,
            z: this.bottle.instance.position.z,
        }
        this.axis = new THREE.Vector3(this.targetPosition.x - currentPosition.x, 0, this.targetPosition.z - currentPosition.z)
        this.axis.normalize()
        this.bottle.setDirection(direction, this.axis)
    }

    addInitBlock() {
        this.currentBlock = new Cuboid(-15, 0, 0)
        this.nextBlock = new Cylinder(23, 0, 0)
        this.targetPosition = {
            x: 23,
            y: 0,
            z: 0
        }
        const initPosition = 0
        this.scene.instance.add(this.currentBlock.instance)
        this.scene.instance.add(this.nextBlock.instance)
        this.setDirection(initPosition)
    }

    addGround() {
        this.scene.instance.add(this.ground.instance)
    }

    addBottle() {
        this.scene.instance.add(this.bottle.instance)
    }

    render() {
        this.checkBottleHit()

        this.scene.render()

        // 物体开始下落更新 跟下瓶子的状态
        if(this.bottle) {
            this.bottle.update()
        }

        if(this.currentBlock) {
            this.currentBlock.update()
        }

        // // 瓶子更新
        // if(this.humanTween) {
        //     this.humanTween.update()
        // }
        // if(this.headTween) {
        //     this.headTween.update()
        // }
        // if(this.bodyTween) {
        //     this.bodyTween.update()
        // }

        if(TWEEN) {
            TWEEN.update()
        }
        requestAnimationFrame(this.render.bind(this))
    }

    show() {
        // this.mesh.visible = true
    }

    hide() {
        // this.mesh.visible = false
    }

    restart() {
        console.log("game-page restart")
    }

    checkBottleHit () {
        if (this.checkingHit && this.bottle.instance.position.y <= blockConf.height / 2 + 0.1 && this.bottle.status === 'jump' && this.bottle.flyingTime > 0.3) {
          this.checkingHit = false
          if (this.hit == 1 || this.hit == 7 || this.hit == 2) { // 游戏继续
            this.state = 'stop'
            this.bottle.stop()
            this.bottle.instance.position.y = blockConf.height / 2
            this.bottle.instance.position.x = this.bottle.destination[0]
            this.bottle.instance.position.z = this.bottle.destination[1]
            // this.updateScore(++this.score)
            this.updateNextBlock()
          } else { //游戏结束
            this.state = 'over'
            console.log("over")
            // this.removeTouchEvent()
            // this.callbacks.showGameOverPage()
          }
        }
    }

    updateNextBlock () {
        const seed = Math.round(Math.random())
        const type = seed ? 'cuboid' : 'cylinder'
        const direction = Math.round(Math.random()) // 0 -> x 1 -> z
        const width = Math.round(Math.random() * 12) + 8
        const distance = Math.round(Math.random() * 20) + 20
        this.currentBlock = this.nextBlock
        const targetPosition = this.targetPosition = {}
        if (direction == 0) { // x
          targetPosition.x = this.currentBlock.instance.position.x + distance
          targetPosition.y = this.currentBlock.instance.position.y
          targetPosition.z = this.currentBlock.instance.position.z
        } else if (direction == 1) { // z
          targetPosition.x = this.currentBlock.instance.position.x
          targetPosition.y = this.currentBlock.instance.position.y
          targetPosition.z = this.currentBlock.instance.position.z - distance
        }
        this.setDirection(direction)
        if (type == 'cuboid') {
          this.nextBlock = new Cuboid(targetPosition.x, targetPosition.y, targetPosition.z, width)
        } else if (type == 'cylinder') {
          this.nextBlock = new Cylinder(targetPosition.x, targetPosition.y, targetPosition.z, width)
        }
        // this.nextBlock.instance.position.set(targetPosition.x, targetPosition.y, targetPosition.z)
        this.scene.instance.add(this.nextBlock.instance)
        const cameraTargetPosition = { 
          x: (this.currentBlock.instance.position.x + this.nextBlock.instance.position.x) / 2,
          y: (this.currentBlock.instance.position.y + this.nextBlock.instance.position.y) / 2,
          z: (this.currentBlock.instance.position.z + this.nextBlock.instance.position.z) / 2,
        }
        this.scene.updateCameraPosition(cameraTargetPosition)
        this.ground.updatePosition(cameraTargetPosition)
    }

    getHitStatus (bottle, currentBlock, nextBlock, initY) {
    
        let flyingTime = bottle.velocity.vy / gameConf.gravity * 2
        initY = initY || +bottle.instance.position.y.toFixed(2)
        let destinationY = blockConf.height / 2
    
        let differenceY = destinationY
        let time = +((-bottle.velocity.vy + Math.sqrt(Math.pow(bottle.velocity.vy, 2) - 2 * gameConf.gravity * differenceY)) / -gameConf.gravity).toFixed(2)
        flyingTime -= time
        flyingTime = +flyingTime.toFixed(2)
        let destination = []
        let bottlePosition = new THREE.Vector2(bottle.instance.position.x, bottle.instance.position.z)
        let translate = new THREE.Vector2(this.axis.x, this.axis.z).setLength(bottle.velocity.vx * flyingTime)
        bottlePosition.add(translate)
        bottle.destination = [+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2)]
        destination.push(+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2))
        
        let result1, result2
        if (nextBlock) {
          let nextDiff = Math.pow(destination[0] - nextBlock.instance.position.x, 2) + Math.pow(destination[1] - nextBlock.instance.position.z, 2)
          let nextPolygon = nextBlock.getVertices()
          
          if (utils.pointInPolygon(destination, nextPolygon)) {
            if (Math.abs(nextDiff) < 5) {
              return 1
            } else {
              return 7
            }
          } else if (utils.pointInPolygon([destination[0] - bottleConf.bodyWidth / 2, destination[1]], nextPolygon) || utils.pointInPolygon([destination[0], destination[1] + bottleConf.bodyDepth / 2], nextPolygon)) {
            result1 = 5
          } else if (utils.pointInPolygon([destination[0], destination[1] - bottleConf.bodyDepth / 2], nextPolygon) || utils.pointInPolygon([destination[0] + bottleConf.bodyDepth / 2, destination[1]], nextPolygon)) {
            result1 = 3
          }
        }
    
        let currentPolygon = currentBlock.getVertices()
        
        if (utils.pointInPolygon(destination, currentPolygon)) {
          return 2
        } else if (utils.pointInPolygon([destination[0], destination[1] + bottleConf.bodyDepth / 2], currentPolygon) || utils.pointInPolygon([destination[0] - bottleConf.bodyWidth / 2, destination[1]], currentPolygon)) {
          if (result1) return 6
          return 4
        }
        return result1 || result2 || 0
    }

    traingleShape() {
        let width = window.innerWidth
        let height = window.innerHeight
        let canvas = document.querySelector("#myCanvas")
    
        let renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        })


        let scene = new THREE.Scene()
        this.scene = scene

        let traingleShape = new THREE.Shape()
        traingleShape.moveTo(0, width/4)
        traingleShape.lineTo(-width/4, -width/4)
        traingleShape.lineTo(width/4, -width/4)
        traingleShape.lineTo(0, width/4)

        let geometry = new THREE.ShapeGeometry(traingleShape)
        let meterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        })

        let mesh = new THREE.Mesh(geometry, meterial)
        this.mesh = mesh

        let axesHelper = new THREE.AxesHelper( 150 )
        scene.add( axesHelper )

        mesh.position.x = 0
        mesh.position.y = 0
        mesh.position.z = 1

        // scene.add(mesh)

        
        let camera = new THREE.OrthographicCamera(-30, 30, 56, -56, -100, 85 )
        camera.position.x = -10
        camera.position.y = 10
        camera.position.z = 10
        camera.lookAt(new THREE.Vector3(0, 0, 0))

        let currentAngle = 0
        let lastTimestamp = Date.now()

        function animate() {
            let now = Date.now()
            let duration = now - lastTimestamp
            lastTimestamp = now
            currentAngle += (duration / 1000 * Math.PI)
        }



        renderer.setClearColor(new THREE.Color(0x000000))
        renderer.setSize(width, height)

        function render() {
            animate()
            mesh.rotation.set(0, currentAngle, 0)
            renderer.render(scene, camera)

            
            requestAnimationFrame(render)
        }
        render()
    }

}

export default GamePage