import sceneConf from "../conf/scene-conf"

class GameOverPage {
    constructor(callbacks) {
        this.callbacks = callbacks
    }

    init(options) {
        console.log("game-over-page init")
        this.initGameOverCanvas(options)
    }

    initGameOverCanvas(options) {
        this.scene = options.scene
        this.camera = options.camera
        
        const aspect = window.innerHeight / window.innerWidth
        this.canvas = document.createElement("canvas")
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.texture = new THREE.Texture(this.canvas)
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            side: THREE.DoubleSide
        })
        this.geometry = new THREE.PlaneGeometry(sceneConf.frustumSize * 2, aspect * sceneConf.frustumSize * 2)
        this.instance = new THREE.Mesh(this.geometry, this.material)
        this.instance.position.z = 10
        this.instance.rotation.y = 2 * Math.PI

        this.context = this.canvas.getContext("2d")
        this.context.fillStyle = "#333"

        let x = (window.innerWidth / 2) - (window.innerHeight - 200) / 4
        let y = (window.innerHeight / 2) - (window.innerWidth - 200) / 4
        let w = (window.innerHeight - 200) / 2
        let h = (window.innerWidth - 200) / 2

        this.region = [x, x + w, y, y + h]

        this.context.fillRect(x, y, w, h)
        this.context.fillStyle = "#eee"
        this.context.font = "22px Georgria"
        this.context.fillText("Game Over", h + 45, w + 105)

        this.instance.visible = false
        this.texture.needsUpdate = true
        this.camera.add(this.instance)
    }

    show() {
        this.instance.visible = true
        this.bindTouchEvent()
    }

    hide() {
        this.instance.visible = false
        this.removeTouchEvent()
    }

    onTouchEnd = (e) => {
        
        const pageX = e.changedTouches[0].pageX
        const pageY = e.changedTouches[0].pageY
        // console.log(this.region,pageX,pageY)
        if (pageX > this.region[0] && pageX < this.region[1] && pageY > this.region[2] && pageY < this.region[3]) { // restart
            this.callbacks.gameRestart()
            
        }
    }

    bindTouchEvent () {
        let canvas = document.querySelector("#myCanvas")
        canvas.addEventListener('touchend', this.onTouchEnd)
    }
    
    removeTouchEvent () {
        let canvas = document.querySelector("#myCanvas")
        canvas.removeEventListener('touchend', this.onTouchEnd)
    }
}

export default GameOverPage