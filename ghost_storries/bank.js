let FourColors = require('./enums/color').FourColors;
let FiveColors = require('./enums/color').FiveColors;

const QI_MARKERS_AMOUNT = 20;
const TAO_MARKERS_AMOUNT = 4;

class Bank {
    constructor() {
        this.qiMarkers;
        this.jinJangMarker = [];
        this.taoMarkers = [];
    }

    _getQiMarkers(taoists) {
        let qiMarkers = QI_MARKERS_AMOUNT;
        for(let taoist of taoists)
            qiMarkers -= taoist.qiMarkers;
        return qiMarkers;
    }

    _getTaoMarkers(taoists) {
        let taoMarkers = [];
        for(let color of FiveColors.enums) 
            taoMarkers[color] = TAO_MARKERS_AMOUNT;
        for(let color of FiveColors.enums)
            for(let taoist of taoists)
                taoMarkers[color] -= taoist.taoMarkers[color];

        return taoMarkers;
    }

    _getJinJangMarkers(taoists) {
        let jinJangMarkers = [];
        for(let taoist of taoists)
            if(taoist.jinJangMarker === 0)
                jinJangMarkers[taoist.color] = 1;
            else
                jinJangMarkers[taoist.color] = 0;
        return jinJangMarkers;
    }

    initBank() {
        this.qiMarkers = 4;
        for(let color of FiveColors.enums)
            if(color.is(FiveColors.BLACK))
                this.taoMarkers[color] = 4;
            else
                this.taoMarkers[color] = 3;

        for(let color of FourColors.enums)
            this.jinJangMarker[color] = 0;
    }

    updateMarkers(taoists) {
        this.qiMarkers = this._getQiMarkers(taoists);
        this.taoMarkers = this._getTaoMarkers(taoists);
        this.jinJangMarker = this._getJinJangMarkers(taoists);
    }
}

module.exports = Bank;