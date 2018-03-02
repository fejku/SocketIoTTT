const arrayShuffle = require('array-shuffle');

class Villagers {
    constructor() {
        this.villagers;
    }

    _initVillagers() {
        const Cemetery = require('./cemetery');
        const TaoistAltar = require('./taoist_altar');
        const HerbalistShop = require('.//herbalist_shop');
        const SorcererHut = require('./sorcerer_hut');
        const CircleOfPryer = require('./circle_of_prayer');

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

    getVillagerByClass(villagerClass) {
        for (const villager of this.villagers)
            if (villager instanceof villagerClass)
                return villager;
    }
}

module.exports = Villagers;