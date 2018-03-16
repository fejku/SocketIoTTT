const arrayShuffle = require('array-shuffle');
const { FiveColors } = require('./enums/color');

const Villagers = require('./villagers/villagers');
const PlayerBoards = require('./players_boards/players_boards');

const Ghoul = require('./ghosts/ghoul');
const WalkingCorpse = require('./ghosts/walking_corpse');

const questions = require('./utils/questionsUI');

class Board {
  constructor(players) {
    // 0 - top left, 1 - top middle, ...
    this.villagers = new Villagers();
    // 0 - top, 1 - right, 2 - bottom, 3 - left
    this.playersBoards = new PlayerBoards(players);
    this.ghostCards = this.initGhostCards();
  }

  initGhostCards() {
    // TEST
    return arrayShuffle([new Ghoul(),
      new Ghoul(),
      new Ghoul(),
      new Ghoul(),
      new Ghoul(),
      new Ghoul(),
      new Ghoul(),
      new Ghoul(),
      new Ghoul(),
      new Ghoul(),
      new WalkingCorpse(),
    ]);
  }

  getVillagers() {
    return this.villagers;
  }

  getAllVillagers() {
    return this.villagers.getVillagers();
  }

  getVillager(index) {
    return this.villagers.getVillager(index);
  }

  getVillagerByClass(villagerClass) {
    return this.villagers.getVillagerByClass(villagerClass);
  }

  getPlayersBoards() {
    return this.playersBoards;
  }

  getAllPlayersBoards() {
    return this.playersBoards.getPlayersBoards();
  }

  getPlayerBoardByColor(color) {
    return this.playersBoards.getPlayerBoardByColor(color);
  }

  drawCard() {
    return this.ghostCards.pop();
  }

  layCardOnField(socket, pickedField, card) {
    this.getPlayerBoardByColor(pickedField.playerBoardColor).fields[pickedField.fieldIndex] = card;
    socket.emit('ghost lay ghost card on picked field', pickedField, card);
  }

  async ghostArrival(socket, players, bank, circleOfPrayer) {
    if (this.getPlayersBoards().isAllBoardsFull()) {
      players.getActualPlayer().loseQi();
      bank.updateTokens(socket, players.getTaoists(), circleOfPrayer);
    } else {
      // Draw ghost card
      const card = this.drawCard();
      let emptyFields = [];
      // Black card on active player board
      if (card.color.key === FiveColors.BLACK) {
        // Get empty fields from actual player
        emptyFields = this.getPlayersBoards().getEmptyFields(this.getPlayerBoardByColor(players.getActualPlayerColor()));
        // Other than black color
      } else {
        // Get empty fields from player whose color is same as card color
        emptyFields = this.getPlayersBoards().getEmptyFields(this.getPlayerBoardByColor(card.color.key));
      }
      // Pick field for card
      const pickedField = await questions.pickPlayerBoardField(socket, emptyFields);// this.pickFieldForCard(socket, emptyFields, card);
      // TODO: if buddha on field and card is not wufeng
      if (buddha on field) && (card is wuFeng) {
        // remove buddha from field
        // back buddha into temple
      } else if (buddha on field) && (card is not wuFeng) {}
        // remove buddha from field
        // back buddha into temple
        // place card 
        // immediateEffect
      } else {
        // Lay card of picked field
        this.layCardOnField(socket, pickedField, card);
        card.immediateEffect();
      }
    }
  }
}

module.exports = Board;
