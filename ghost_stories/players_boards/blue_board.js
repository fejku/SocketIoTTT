const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

// 1. Heavenly Gust
// You can request aid from villagers and attempt an exorcism, in whatever order you choose.
// 2. Second Wind
// From your current village tile, you can request aid from villagers twice or attempt 2 exorcisms. The 2 exorcisms
// are independent: you can’t keep a partial success from the first and apply it to the second.
class BlueBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.BLUE;
  }

  getPowersNames() {
    return ['Heavenly Gust', 'Second Wind'];
  }
}

module.exports = BlueBoard;
