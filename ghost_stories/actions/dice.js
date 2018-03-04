class Dice {
  static getThrowResult(range = 6, offset = 0) {
    return Math.floor((Math.random() * range) + offset);
  }
}

module.exports = Dice;
