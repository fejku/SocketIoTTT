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
}

module.exports = Taoist;