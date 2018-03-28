const { FiveColors } = require('../enums/color');
const playersUtils = require('./players_utils');
const questions = require('../utils/questionsUI');

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

  loseAllTaoTokens() {
    for (const colorItem of FiveColors.enums) {
      this.taoTokens[colorItem.key] = 0;
    }
  }

  gainTaoToken(color, amount = 1) {
    this.taoTokens[color] += amount;
  }

  loseTaoToken(color, amount = 1) {
    this.taoTokens[color] -= amount;
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

  askIfPlaceBuddha(socket) {
    // TODO: dodać reject
    return new Promise((resolve, reject) => {
      socket.emit('ghost ask if place buddha', (choice) => {
        resolve(choice);
      });
    });
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
    buddhistTemple.refreshBuddhaFiguresUI(socket, playersBoards.getPlayersBoards());
  }
}

module.exports = Taoist;
