const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

const Dice = require('../actions/dice');
const ColorDice = require('../actions/color_dice');
const CurseDice = require('../actions/curse_dice');
const questions = require('../utils/questionsUI');

// 1. The Gods’ Favorite +
// You can reroll each Tao die involved in a support action or an exorcism (you may keep some of the Tao dice and
// reroll the rest). You may also reroll the Curse die. You must always keep the second result.
// 2. Strength of a Mountain +
// You have a fourth (gray) Tao die when performing exorcisms, and you never roll the Curse die.
class GreenBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.GREEN;
  }

  getPowersNames() {
    return ['The Gods’ Favorite', 'Strength of a Mountain'];
  }

  async theGodsFavoriteColorDice(socket, throwResult) {
    const isReroll = await questions.askYesNo(socket, 'Do you want to reroll?');
    if (isReroll) {
      console.log('Before reroll diceThrowResult', throwResult);
      for (const [index, color] of throwResult.entries()) {
        const isRerollColor = await questions.askYesNo(socket, `Do you want to reroll ${color} dice?`);
        if (isRerollColor) {
          throwResult[index] = ColorDice.throwOneDice();
        }
      }
    }
  }

  async theGodsFavoriteCurseDice(socket, throwResult) {
    const isReroll = await questions
      .askYesNo(socket, `You rolled: ${CurseDice.getThrowResultName(throwResult.result)}. Do you want reroll?`);
    if (isReroll) {
      throwResult.result = Dice.getThrowResult();
    }
  }

  strengthOfAMountainColorDice(throwResult) {
    throwResult.push(ColorDice.throwOneDice());
  }

  strengthOfAMountainCurseDice(throwResult, isCemeteryCall) {
    if (!isCemeteryCall) {
      // No effect
      throwResult.result = 0;
    }
  }

  async boardPower(socket, board, players, bank, situationName, throwResult, isCemeteryCall) {
    if (!this.validatePowerBoard()) {
      return;
    }

    if (this.powerName === 'The Gods’ Favorite') {
      if ((situationName === 'After exorcism color dice throw') || (situationName === 'After color dice throw')) {
        await this.theGodsFavoriteColorDice(socket, throwResult);
      } else if (situationName === 'After curse dice throw') {
        await this.theGodsFavoriteCurseDice(socket, throwResult);
      }
    } else if (this.powerName === 'Strength of a Mountain') {
      if (situationName === 'After exorcism color dice throw') {
        this.strengthOfAMountainColorDice(throwResult);
      } else if (situationName === 'After curse dice throw') {
        this.strengthOfAMountainCurseDice(throwResult, isCemeteryCall);
      }
    }
  }
}

module.exports = GreenBoard;
