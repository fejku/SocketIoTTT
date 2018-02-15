let arrayShuffle = require('array-shuffle');

class Players {
    constructor() {
        this.taoists;
    }

    _initTaoist() {
        let Colors = require('./enums/color-enum');
        let Taoist = require('./taoist');
        return arrayShuffle([new Taoist(Colors.GREEN),
            new Taoist(Colors.YELLOW),
            new Taoist(Colors.RED),
            new Taoist(Colors.BLUE)
        ]);
    }

    initPlayers() {
        this.taoists = this._initTaoist();
    }
}

module.exports = Players;