const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

// 1. Strzelisty Taniec
// Czerwony Taoista posiada umiejętność latania. Podczas ruchu może przemieścić się na dowolny
// żeton wioski, nie tylko na żetony przylegające do tego, gdzie się akurat znajduje.
// 2. Taniec Bliźniaczych Wiatrów
// Czerwony Taoista może prowadzić swoich towarzyszy. Po swoim ruchu może przemieścić o jedno pole innego Taoistę.
class RedBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.RED;
  }
}

module.exports = RedBoard;
