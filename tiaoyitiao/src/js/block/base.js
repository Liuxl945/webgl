import blockConf from "../conf/block-conf"

class BaseBlock {
    constructor(type) {
        this.type = type //cuboid cylinder
        this.height = blockConf.height
        this.width = blockConf.width
        this.status = 'stop'
        this.scale = 1
    }

    shrink() {
        this.status = "shrink"
    }

    _shrink() {
        const DELTA_SCALE = 0.005
        const MIN_SCALE = 0.65
        this.scale -= DELTA_SCALE
        this.scale = Math.max(MIN_SCALE, this.scale)

        if (this.scale <= MIN_SCALE) {
            this.status = 'stop'
            return
        }
        this.instance.scale.y = this.scale
        const deltaY = this.height * DELTA_SCALE / 2
        this.instance.position.y -= deltaY

    }

    stop() {
        this.status = 'stop'
        this.scale = 1

        const position = {
            x: this.instance.scale.y,
            y: this.instance.position.y
        }
        new TWEEN.Tween(position).to({
            x: 1,
            y: 0,
        }, 50).onUpdate(() => {
            this.instance.scale.y = position.x
            this.instance.position.y = position.y
        }).start()
    }

    update() {
        if(this.status === "shrink") {
            this._shrink()
        }
    }

    getVertices () {
        const vertices = []
        const centerPosition = {
          x: this.instance.position.x,
          z: this.instance.position.z
        }
        vertices.push([centerPosition.x + this.width / 2, centerPosition.z + this.width / 2])
        vertices.push([centerPosition.x + this.width / 2, centerPosition.z - this.width / 2])
        vertices.push([centerPosition.x - this.width / 2, centerPosition.z - this.width / 2])
        vertices.push([centerPosition.x + this.width / 2, centerPosition.z - this.width / 2])
        return vertices
    }
}

export default BaseBlock