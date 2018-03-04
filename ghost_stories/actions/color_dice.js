const { SixColors } = require('../enums/color');
const Dice = require('./dice');

function getColorFromResult(throwResult) {
  const colorValue = 2 ** throwResult;

  const color = SixColors.get(colorValue);

  if (typeof color === 'undefined' || color === null) {
    return null;
  } else {
    return color.key;
  }
}

module.exports.throwDices = (diceNumber) => {
  const throwResults = [];
  for (let i = 0; i < diceNumber; i++) {
    throwResults.push(getColorFromResult(Dice.getThrowResult()));
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
