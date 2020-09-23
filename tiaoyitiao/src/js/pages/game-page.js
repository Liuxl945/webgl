import { scene } from "../scene/index"
import Cuboid from "../block/cuboid"
import Cylinder from "../block/cylinder"
import ground from "../objects/ground"

class GamePage {
    constructor(callbacks) {
        this.callbacks = callbacks
        this.scene = scene
        this.ground = ground
    }

    init() {
        // this.traingleShape()
        this.scene.init()
        this.ground.init()
        this.addInitBlock()
        this.addGround()
        this.render()
    }

    addInitBlock() {
        const cuboid = new Cuboid(-15, 0, 0)
        const cylinder = new Cylinder(23, 0, 0)
        this.scene.instance.add(cuboid.instance)
        this.scene.instance.add(cylinder.instance)
    }

    addGround() {
        this.scene.instance.add(this.ground.instance)
    }

    render() {
        this.scene.render()
        // requestAnimationFrame(this.render.bind(this))
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