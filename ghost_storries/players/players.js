let arrayShuffle = require('array-shuffle');
let playersUtils = require('./players_utils');

let Colors = require('../enums/color').FourColors;
let Taoist = require('./taoist');

class Players {
    constructor() {
        this.actualPlayer = 0;
        this.taoists;
    }

    _initTaoist() {
        return arrayShuffle([new Taoist(Colors.GREEN),
            new Taoist(Colors.YELLOW),
            new Taoist(Colors.RED),
            new Taoist(Colors.BLUE)
        ]);
    }

    initPlayers() {
        this.taoists = this._initTaoist();
    }

    getActualPlayerId() {
        return this.actualPlayer;
    }

    getActualPlayerColor() {
        return this.taoists[this.actualPlayer].color.key;
    }

    getActualPlayer() {
        return this.taoists[this.actualPlayer];
    }

    getPlayerByColor(color) {
        for(let player of this.taoists)
            if(player.color === color)
                return player;
    }

    getAvailableMoves(actualField) {
        return playersUtils.getAvailableMoves(actualField);
    }

    pickMove(socket, availableMoves) {
        return playersUtils.pickMove(socket, availableMoves);
    }

    makeDecision(socket) {
        return new Promise((resolve, reject) => {
            socket.emit('ghost player decision', decision => {
                resolve(decision);
            })
        });
    }
}

module.exports = Players;