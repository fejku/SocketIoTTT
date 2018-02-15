let Villager = require('./villager');

class Cemetery extends Villager {
    constructor() {
        super();
        this.name = 'Cemetery'
    }
}

module.exports = Cemetery;