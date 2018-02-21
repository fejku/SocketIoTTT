let Ghost = require('./ghost');
let FiveColors = require('../enums/color').FiveColors;

class Ghoul extends Ghost {
    constructor () {
        super('Ghoul', FiveColors.YELLOW, 1);
    }

    yinPhaseEffect() {
        haunter();
    }
}

module.exports = Ghoul;