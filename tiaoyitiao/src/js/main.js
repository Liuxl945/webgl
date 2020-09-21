import * as THREE from "three"

class Main {
    constructor(width,height) {
        this.width = width
        this.height = height
        this.init()
    }
    init() {
        let { width, height } = this
        var canvas = document.querySelector("#myCanvas")
    
        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        })


        var scene = new THREE.Scene()

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
        mesh.position.x = 0
        mesh.position.y = 0
        mesh.position.z = 1

        scene.add(mesh)

        var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, -1000, 1000 )
        camera.position.x = 0
        camera.position.y = 0
        camera.position.z = 0
        camera.lookAt(new THREE.Vector3(0, 0, 1))

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
            mesh.rotation.set(currentAngle, 0, 0)
            renderer.render(scene, camera)

            
            requestAnimationFrame(render)
        }
        render()
    }
}

export default Main