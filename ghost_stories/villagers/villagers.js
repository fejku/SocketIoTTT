const arrayShuffle = require('array-shuffle');

const Cemetery = require('./cemetery');
const TaoistAltar = require('./taoist_altar');
const HerbalistShop = require('.//herbalist_shop');
const SorcererHut = require('./sorcerer_hut');
const CircleOfPryer = require('./circle_of_prayer');
const TeaHouse = require('./tea_house');

class Villagers {
  constructor() {
    this.villagers = this.initVillagers();
  }

  initVillagers() {
    return arrayShuffle([new Cemetery(),
      new TaoistAltar(),
      new HerbalistShop(),
      new SorcererHut(),
      new CircleOfPryer(),
      new TeaHouse(),
    ]);
  }

  getVillagers() {
    return this.villagers;
  }

  getVillager(index) {
    return this.villagers[index];
  }

  getVillagerByClass(villagerClass) {
    for (const villager of this.villagers) {
      if (villager instanceof villagerClass) {
        return villager;
      }
    }
    return null;
  }

  getVillagerByName(name) {
    return this.villagers.find(item => item.name === name);
  }
}

module.exports = Villagers;
