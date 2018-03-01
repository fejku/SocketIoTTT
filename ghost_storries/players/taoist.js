let Colors = require('../enums/color').FiveColors;
let playersUtils = require('./players_utils');

class Taoist {
    constructor(color) {
        this.color = color;
        this.qiMarkers = 4;
        this.jinJangMarker = 1;
        this.taoMarkers = this._initTaoMarkers();
        this.position = 4;
    }

    _initTaoMarkers() {
        let taoMarkers = {};
        for (let colorItem of Colors.enums) {
            if (colorItem.key == this.color.key)
                taoMarkers[colorItem.key] = 1;
            else
                taoMarkers[colorItem.key] = 0;
        }
        return taoMarkers;
    }

    getColor() {
        return this.color;
    }

    gainQi(amount) {
        this.qiMarkers += amount;
    }

    loseQi() {
        this.qiMarkers--;
    }

    loseAllTaoMarkers() {
        for (let colorItem of Colors.enums)
            this.taoMarkers[colorItem.key] = 0;
    }

    getPosition() {
        return this.position;
    }

    move(pickedMove) {
        this.position = pickedMove;
    }

    isAlive() {
        return this.qiMarkers > 0;
    }

    validateExorcism(playersBoards) {
        return playersUtils.isGhostInRange(playersBoards, this.position);
    }

    getGhostsInRange(playersBoards) {
        return playersUtils.getGhostsInRange(playersBoards, this.position);
    }
}

module.exports = Taoist;