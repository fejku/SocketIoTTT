const { SixColors } = require('../enums/color');
const Dice = require('./dice');

function getColorFromResult(throwResult) {
  const colorValue = 2 ** throwResult;

  const color = SixColors.get(colorValue);

  if (typeof color === 'undefined' || color === null) {
    return null;
  }

  return color.key;
}

module.exports.throwDices = (diceNumber) => {
  const throwResults = [];
  for (let i = 0; i < diceNumber; i++) {
    throwResults.push(getColorFromResult(Dice.getThrowResult()));
  }

  console.log('diceThrowResult', throwResults);
  return throwResults;
};

module.exports.throwOneDice = () => getColorFromResult(Dice.getThrowResult());
