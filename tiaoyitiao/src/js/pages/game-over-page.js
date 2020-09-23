class GameOverPage {
    constructor(callbacks) {
        this.callbacks = callbacks
    }

    init(options) {
        console.log("game-over-page init")
        this.initGameOverCanvas(options)
    }

    initGameOverCanvas(options) {
        // this.scene = options.scene
        // const aspect = window.innerHeight / window.innerWidth
        // this.canvas = document.createElement("canvas")
        // this.canvas.width = window.innerWidth
        // this.canvas.height = window.innerHeight
        // this.texture = new THREE.Texture(this.canvas)
        // this.material = new THREE.MeshBasicMaterial({
        //     map: this.texture,
        //     transparent: true,
        //     side: THREE.DoubleSide
        // })
        // this.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight)
        // this.object = new THREE.Mesh(this.geometry, this.material)
        // this.object.position.z = 1
        // this.object.rotation.y = Math.PI

        // this.context = this.canvas.getContext("2d")
        // this.context.fillStyle = "#333"

        // let x = (window.innerWidth / 2) - (window.innerHeight - 200) / 4
        // let y = (window.innerHeight / 2) - (window.innerWidth - 200) / 4
        // let w = (window.innerHeight - 200) / 2
        // let h = (window.innerWidth - 200) / 2
        // this.context.fillRect(x, y, w, h)
        // this.context.fillStyle = "#eee"
        // this.context.font = "22px Georgria"
        // this.context.fillText("Game Over", h + 45, w + 105)

        // this.object.visible = false
        // this.texture.needsUpdate = true
        // this.scene.add(this.object)
    }

    show() {
        this.object.visible = true
        console.log("game-over-page show")
    }

    hide() {
        this.object.visible = false
    }
}

export default GameOverPage