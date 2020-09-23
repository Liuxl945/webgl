import * as THREE from "three"
import TWEEN from "@tweenjs/tween.js"
window.THREE = THREE
window.TWEEN = TWEEN

import game from "./game/game"

class Main {
    constructor(width,height) {
        this.width = width
        this.height = height
        game.init()
    }
}

export default Main