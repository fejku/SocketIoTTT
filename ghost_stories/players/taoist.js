const { FiveColors, SixColors } = require('../enums/color');
const playersUtils = require('./players_utils');
const UI = require('../utils/UI');
const questions = require('../utils/questionsUI');
const ColorDice = require('../actions/color_dice');


const BuddhistTemple = require('../villagers/buddhist_temple');

class Taoist {
  constructor(color) {
    this.color = color;
    this.qiTokens = 4;
    this.jinJangToken = 1;
    this.taoTokens = this.initTaoTokens();
    this.position = 4;

    this.buddhaFigures = [];
  }

  initTaoTokens() {
    const taoTokens = {};
    for (const colorItem of FiveColors.enums) {
      if (colorItem.key === this.color.key) {
        taoTokens[colorItem.key] = 1;
      } else {
        taoTokens[colorItem.key] = 0;
      }
    }
    return taoTokens;
  }

  getColor() {
    return this.color;
  }

  getColorKey() {
    return this.color.key;
  }

  gainQi(bank, amount = 1) {
    if (bank.isQiTokenLeft(amount)) {
      bank.loseQi(amount);
      this.qiTokens += amount;
    }
  }

  loseQi(bank, amount = 1) {
    if (this.qiTokens >= amount) {
      this.qiTokens -= amount;
      bank.gainQi(amount);
    }
  }

  getTaoTokensColor(color) {
    return this.taoTokens[color];
  }

  loseAllTaoTokens() {
    for (const colorItem of FiveColors.enums) {
      this.taoTokens[colorItem.key] = 0;
    }
  }

  gainTaoToken(bank, color, amount = 1) {
    if (bank.isTaoTokenColorLeft(color)) {
      bank.loseTaoToken(color);
      this.taoTokens[color] += amount;
    }
  }

  loseTaoToken(bank, color, amount = 1) {
    if (this.taoTokens[color] > 0) {
      this.taoTokens[color] -= amount;
      bank.gainTaoToken(color);
    }
  }

  gainJinJangToken(bank) {
    const color = this.color.key;
    if (bank.isJinJangTokenAvailable(color)) {
      bank.loseJinJangToken(color);
      this.jinJangTokens[color] += 1;
    }
  }

  loseJinJangToken(bank) {
    const color = this.color.key;
    if (this.jinJangTokens[color] > 0) {
      this.jinJangTokens[color] -= 1;
      bank.gainJinJangToken(color);
    }
  }

  getPosition() {
    return this.position;
  }

  move(pickedMove) {
    this.position = pickedMove;
  }

  isAlive() {
    return this.qiTokens > 0;
  }

  validateExorcism(playersBoards) {
    return playersUtils.isGhostInRange(playersBoards, this.position);
  }

  getGhostsInRange(playersBoards) {
    return playersUtils.getGhostsInRange(playersBoards, this.position);
  }

  gainBuddhaFigure() {
    this.buddhaFigures.push({ status: 'inactive' });
  }

  setBuddhaFiguresActive() {
    this.buddhaFigures
      .filter(buddha => buddha.status === 'inactive')
      .forEach((buddha) => {
        buddha.status = 'active';
      });
  }

  isActiveBuddhaFigure() {
    return this.buddhaFigures.find(buddha => buddha.status === 'active') !== undefined;
  }

  getAmountActiveBuddhaFigures() {
    return this.buddhaFigures.filter(buddha => buddha.status === 'active').length;
  }

  isPlayerInCornerField() {
    return playersUtils.isPlayerInCornerField(this.position);
  }

  isPlayerInMiddleOuterField() {
    return playersUtils.isPlayerInMiddleOuterField(this.position);
  }

  getNearFields() {
    return playersUtils.getNearFields(this.position);
  }

  async placeBuddha(socket, board) {
    const buddhistTemple = board.getVillagers().getVillagerByClass(BuddhistTemple);
    const buddhaFiguresAmount = this.getAmountActiveBuddhaFigures();
    const ghostInRange = this.getGhostsInRange(board.getAllPlayersBoards());
    const ghostInRangeCount = this.getGhostsInRange(board.getAllPlayersBoards()).length;
    const playerInCorner = this.isPlayerInCornerField();
    const playerInMiddleOuterField = this.isPlayerInMiddleOuterField();
    const nearFields = this.getNearFields();

    // If player is in corner field and have two active buddha figures and fields are empty
    if (buddhaFiguresAmount > 0) {
      if (playerInCorner && (ghostInRangeCount === 0)) {
        if (buddhaFiguresAmount === 2) {
          const placeBudddha = await questions.ask(
            socket,
            'Do you want to place buddha figure?',
            ['Place 2', 'Place 1', 'No'],
          );

          if (placeBudddha === 'Place 2') {
            this.placeBuddhaFigures(socket, buddhistTemple, board.getPlayersBoards());
          } else if (placeBudddha === 'Place 1') {
            const pickedField = await questions.pickPlayerBoardField(socket, nearFields);
            // Pick one field
            this.placeBuddhaFigures(socket, buddhistTemple, board.getPlayersBoards(), pickedField);
          }
        } else if (buddhaFiguresAmount === 1) {
          const placeBudddha = await questions.askYesNo(socket, 'Do you want to place buddha figure?');
          if (placeBudddha) {
            const pickedField = await questions.pickPlayerBoardField(socket, nearFields);
            // Pick one field
            this.placeBuddhaFigures(socket, buddhistTemple, board.getPlayersBoards(), pickedField);
          }
        }
      }
      if (playerInCorner && (ghostInRangeCount === 1)) {
        const placeBudddha = await questions.askYesNo(socket, 'Do you want to place buddha figure?');
        if (placeBudddha) {
          const emptyField = nearFields.find(nearField => !((nearField.playerBoardIndex === ghostInRange[0].playerBoardIndex)
            && (nearField.fieldIndex === ghostInRange[0].fieldIndex)));
          this.placeBuddhaFigures(socket, buddhistTemple, board.getPlayersBoards(), emptyField);
        }
      }
      if (playerInMiddleOuterField && (ghostInRangeCount === 0)) {
        const placeBudddha = await questions.askYesNo(socket, 'Do you want to place buddha figure?');
        if (placeBudddha) {
          this.placeBuddhaFigures(socket, buddhistTemple, board.getPlayersBoards());
        }
      }
    }
  }

  placeBuddhaFigures(socket, buddhistTemple, playersBoards, pickedField = null) {
    // Place all available buddha figures
    if (pickedField === null) {
      const fields = this.getNearFields();

      fields.forEach((field) => {
        playersBoards.getPlayerBoardById(field.playerBoardIndex).setBuddhaField(field.fieldIndex, true);
      });
    } else {
      playersBoards.getPlayerBoardById(pickedField.playerBoardIndex).setBuddhaField(pickedField.fieldIndex, true);
    }
    UI.refreshBuddhaFigures(socket, buddhistTemple.getBuddhaFiguresAmount(), playersBoards.getPlayersBoards());
  }

  async exorcism(socket, board, players, bank) {
    const ghostsInRange = this.getGhostsInRange(board.getAllPlayersBoards());
    // Throw dices
    const dicesAmount = board.getActiveDices();
    const diceThrowResult = ColorDice.throwDices(dicesAmount);
    // Allow reroll or gray dice if green board
    await board.getPlayerBoardById(players.getActualPlayerId())
      .boardPower(socket, board, players, bank, 'After exorcism color dice throw', diceThrowResult);

    console.log('ghostsInRange', ghostsInRange);
    if (ghostsInRange.length === 1) {
      const ghost = board.getPlayersBoards().getPlayerBoardById(ghostsInRange[0].playerBoardIndex)
        .getField(ghostsInRange[0].fieldIndex);
      console.log('ghost', ghost);
      const ghostColor = ghost.getColor();
      // If result of throwed dices(taoist tao tokens, circle of prayers) is greater then ghost resistance
      const whiteDiceResult = diceThrowResult.filter(result => result === SixColors.WHITE.key).length;
      const ghostColorResult = diceThrowResult.filter(result => result === ghostColor).length;
      const resultAfterModifications = ghostColorResult + whiteDiceResult;
      const circleOfPrayer = board.getVillagerByName('Circle of prayer').getTaoTokenColor() === ghostColor ? 1 : 0;
      const enfeeblementMantra = { result: 0 };
      board.getPlayerBoardById(players.getActualPlayerId())
        .boardPower(socket, board, players, bank, 'Enfeeblement Mantra', enfeeblementMantra, ghost.getPosition());
      const ghostResistance = ghost.getResistance() - circleOfPrayer - enfeeblementMantra.result;
      // Check if its enough to defeat ghost
      const isGhostDefeated = ghostResistance <= resultAfterModifications;
      if (!isGhostDefeated) {
        // Check if with own and other players tao tokens win is possible
        const allTaoTokens = players.getTaoists()
          .filter(taoist => taoist.getPosition() === this.position)
          .reduce((result, curr) => result + curr.getTaoTokensColor(ghostColor));
        // Is win possible
        if (ghostResistance <= resultAfterModifications + allTaoTokens) {
          // const othersTaoToken = players.getTaoists()
          // .filter(taoist => taoist.getPosition() === this.position)
          // .reduce((result, curr) => result + curr.getTaoTokensColor(ghostColor));
        }
        // this.taoTokens[ghostColor] +
        // if player have own tokens
        // add own tokens to array of answens
        // if player stay on same tile as other players and they have tao tokens

        // Check if with tao token win is possible
        // resultAfterModifications;
        // Ask if use tao token
      }

      // TODO: make formula
      // + taoTokens
      if (ghostResistance <= resultAfterModifications) {
        console.log('Ghost defeated');
        // Ghost action after winning
        await ghost.afterWinningEffect(socket, board, players, bank, ghostsInRange[0]);
        // Remove ghost from field
        board.getPlayersBoards().getPlayerBoardById(ghostsInRange[0].playerBoardIndex)
          .removeGhostFromField(socket, board.getAllPlayersBoards(), ghost);
        console.log('board: ', board.getPlayersBoards().getPlayerBoardById(ghostsInRange[0].playerBoardIndex));
      } else {
        this.loseQi(bank);
        UI.refreshBank(socket, bank);
      }
    } else {
      // TODO:
      // If player is on corner and result is big enough pick which ghost to exorcism
    }
  }
}

module.exports = Taoist;
