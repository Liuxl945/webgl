import audioConf from "../conf/audio-conf"
import gameView from "../game/view"

class AudioManager {
    constructor() {
        this.init()
    }

    init() {
        for(let key in audioConf.audioResources) {
            this[key] = new Audio()
            this[key].src = audioConf.audioResources[key]
            document.body.appendChild(this[key]) 
        }

        this.shrink_end.loop = true
        this.shrink.onEnded(() => {
            if(gameView.gamePage.bottle.status === "shrink") {

            }
        })
    }


}

export default new AudioManager()