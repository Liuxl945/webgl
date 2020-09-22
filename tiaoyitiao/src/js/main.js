import * as THREE from "three"
window.THREE = THREE

import game from "./game/game"

class Main {
    constructor(width,height) {
        this.width = width
        this.height = height
        game.init()
    }
}

export default Main