let arrayShuffle = require('array-shuffle');

class Villagers {
    constructor() {
        this.villagers;
    }

    _initVillagers() {
        let Cemetery = require('./cemetery');
        let TaoistAltar = require('./taoist_altar');
        let HerbalistShop = require('.//herbalist_shop');
        let SorcererHut = require('./sorcerer_hut');
        let CircleOfPryer = require('./circle_of_prayer');

        return arrayShuffle([new Cemetery(),
            new TaoistAltar(),
            new HerbalistShop(),
            new SorcererHut(),
            new CircleOfPryer()
        ]);
    }

    initVillagers() {
        this.villagers = this._initVillagers();
    }

    getVillagers() {
        return this.villagers;
    }

    getVillager(index) {
        return this.villagers[index];
    }
}

module.exports = Villagers;