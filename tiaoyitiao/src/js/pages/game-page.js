import { scene } from "../scene/index"
import Cuboid from "../block/cuboid"
import Cylinder from "../block/cylinder"
import ground from "../objects/ground"
import bottle from "../objects/bottle"

class GamePage {
    constructor(callbacks) {
        this.callbacks = callbacks
        this.scene = scene
        this.ground = ground
        this.bottle = bottle
        this.targetPosition = {

        }
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
    }

    touchEndCallback = () => {
        this.touchEndTime = Date.now()
        const duration = this.touchEndTime - this.touchStartTime
        this.bottle.velocity.vx = Math.min(duration / 6 , 400)
        this.bottle.velocity.vx = +this.bottle.velocity.vx.toFixed(2)
        this.bottle.velocity.vy = Math.min(150 + duration / 20, 400)
        this.bottle.velocity.vy = +this.bottle.velocity.vy.toFixed(2)
        this.bottle.stop()
        this.bottle.rotate()
        this.bottle.jump()
    }

    setDirection(direction) {
        const currentPosition = {
            x: this.bottle.instance.position.x,
            z: this.bottle.instance.position.z,
        }
        this.axis = new THREE.Vector3(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z)
        this.axis.normalize()
        this.bottle.setDirection(direction, this.axis)
    }

    addInitBlock() {
        const cuboid = new Cuboid(-15, 0, 0)
        const cylinder = new Cylinder(23, 0, 0)
        this.targetPosition = {
            x: 23,
            y: 0,
            z: 0
        }
        const initPosition = 0
        this.scene.instance.add(cuboid.instance)
        this.scene.instance.add(cylinder.instance)
        this.setDirection(initPosition)
    }

    addGround() {
        this.scene.instance.add(this.ground.instance)
    }

    addBottle() {
        this.scene.instance.add(this.bottle.instance)
    }

    render() {
        this.scene.render()

        // 物体开始下落更新 跟下瓶子的状态
        if(this.bottle) {
            this.bottle.update()
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

    traingleShape() {
        let width = window.innerWidth
        let height = window.innerHeight
        var canvas = document.querySelector("#myCanvas")
    
        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        })


        var scene = new THREE.Scene()
        this.scene = scene

        var traingleShape = new THREE.Shape()
        traingleShape.moveTo(0, width/4)
        traingleShape.lineTo(-width/4, -width/4)
        traingleShape.lineTo(width/4, -width/4)
        traingleShape.lineTo(0, width/4)

        var geometry = new THREE.ShapeGeometry(traingleShape)
        var meterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        })

        var mesh = new THREE.Mesh(geometry, meterial)
        this.mesh = mesh

        var axesHelper = new THREE.AxesHelper( 150 )
        scene.add( axesHelper )

        mesh.position.x = 0
        mesh.position.y = 0
        mesh.position.z = 1

        // scene.add(mesh)

        
        var camera = new THREE.OrthographicCamera(-30, 30, 56, -56, -100, 85 )
        camera.position.x = -10
        camera.position.y = 10
        camera.position.z = 10
        camera.lookAt(new THREE.Vector3(0, 0, 0))

        var currentAngle = 0
        var lastTimestamp = Date.now()

        function animate() {
            var now = Date.now()
            var duration = now - lastTimestamp
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