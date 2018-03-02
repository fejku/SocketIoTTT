let Villager = require('./villager');

class CircleOfPrayer extends Villager {
    constructor() {
        super();
        this.name = 'Circle of prayer'
    }

    action(socket, board, players, bank) {

    }
}

module.exports = CircleOfPrayer;