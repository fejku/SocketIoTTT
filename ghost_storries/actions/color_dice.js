const { SixColors } = require('../enums/color');

function throwDice() {
  const throwResult = 2 ** Math.floor(Math.random() * 6);

  return SixColors.get(throwResult).key;
}

module.exports.throwDices = (diceNumber) => {
  const throwResults = [];
  for (let i = 0; i < diceNumber; i++) {
    throwResults.push(throwDice());
  }

  const result = {};
  for (const color of SixColors.enums) {
    result[color.key] = 0;
    for (const diceColor of throwResults) {
      if (diceColor === color.key) {
        result[color.key]++;
      }
    }
  }

  return result;
};
