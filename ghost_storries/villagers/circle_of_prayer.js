const Colors = require('../enums/color').FiveColors;

const Villager = require('./villager');

class CircleOfPrayer extends Villager {
    constructor() {
        super();
        this.name = 'Circle of prayer';
        this.taoMarkers = this._initTaoMarkers();
    }

    _initTaoMarkers() {
        const taoMarkers = {};
        for (const colorItem of Colors.enums)
            taoMarkers[colorItem.key] = 0;

        return taoMarkers;
    }

    action(socket, board, players, bank) {
        
    }
}

module.exports = CircleOfPrayer;