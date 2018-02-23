let Colors = require('../enums/color').FiveColors;

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

    loseQi() {
        this.qiMarkers--;
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

    validateExorcism(board) {
        switch (this.position) {
            case 0:
                if ((board.playersBoards[0].fields[0] !== null) ||
                    ((board.playersBoards[0].fields[1] !== null)) ||
                    (board.playersBoards[3].fields[0] !== null) ||
                    (board.playersBoards[3].fields[1] !== null))
                    return true
                return false;
            case 1:
                //if ()
            default:
                return false;
        }
    }
}

module.exports = Taoist;