import gamePage from "../pages/game-page"
import gameOverPage from "../pages/game-over-page"

class GameView {
    constructor() {
        this.gamePage = new gamePage()
        this.gameOverPage = new gameOverPage()
    }

    showGameOverPage() {
        this.gamePage.hide()
        this.gameOverPage.show()
    }

    showGamePage() {
        this.gameOverPage.hide()
        this.gamePage.restart()
        this.gamePage.show()
    }

    restartGame() {
        this.gamePage.restart()
    }

    initGamePage(callbacks) {
        this.gamePage = new gamePage(callbacks)
        this.gamePage.init()
    }

    initGameOverPage(callbacks) {
        this.gameOverPage = new gameOverPage(callbacks)
        this.gameOverPage.init({
            scene: this.gamePage.scene.instance,
            camera: this.gamePage.scene.camera.instance
        })
    }

       
}

export default new GameView()