import blockConf from "../conf/block-conf"

class BaseBlock {
    constructor(type) {
        this.type = type //cuboid cylinder
        this.height = blockConf.height
        this.width = blockConf.width
    }
}

export default BaseBlock