let Colors = require('./enums/color-enum').FiveColors;

class Bank {
    constructor() {
        this.qiMarkers = 4;
        this.jinJangMarker = 1;
        this.taoMarkers = this._initTaoMarkers();
    }

    updateMarkers(taoists) {
        this.qiMarkers = 20 - taoists.qiMarkers;
    }
}

module.exports = new Bank();