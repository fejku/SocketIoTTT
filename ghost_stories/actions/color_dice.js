const { SixColors } = require('../enums/color');
const Dice = require('./dice');

const questions = require('../utils/questionsUI');

function getColorFromResult(throwResult) {
  const colorValue = 2 ** throwResult;

  const color = SixColors.get(colorValue);

  if (typeof color === 'undefined' || color === null) {
    return null;
  }

  return color.key;
}

module.exports.throwDices = async (socket, diceNumber, isTheGodsFavorite) => {
  const throwResults = [];
  for (let i = 0; i < diceNumber; i++) {
    throwResults.push(getColorFromResult(Dice.getThrowResult()));
  }

  if (isTheGodsFavorite) {
    const isReroll = await questions.askYesNo(socket, 'Do you want to reroll?');
    if (isReroll) {
      console.log('Before reroll diceThrowResult', throwResults);
      for (const [index, color] of throwResults.entries()) {
        const isRerollColor = await questions.askYesNo(socket, `Do you want to reroll ${color} dice?`);
        if (isRerollColor) {
          throwResults[index] = this.throwOneDice();
        }
      }
    }
  }

  console.log('diceThrowResult', throwResults);
  return throwResults;
};

module.exports.throwOneDice = () => getColorFromResult(Dice.getThrowResult());
