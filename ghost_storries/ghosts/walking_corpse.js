let Ghost = require('./ghost');
let FiveColors = require('../enums/color').FiveColors;

class WalkingCorpse extends Ghost {
    constructor () {
        super('Walking Corpse', FiveColors.YELLOW, 1);
    }

    immediateEffect() {
        //
    }

    yinPhaseEffect() {
        haunter();
    }

    afterWinningEffect() {
        //
    }
}

module.exports = WalkingCorpse;