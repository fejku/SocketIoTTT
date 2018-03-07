const arrayShuffle = require('array-shuffle');
const { FiveColors } = require('./enums/color');

const Villagers = require('./villagers/villagers');

const GreenBoard = require('./players_boards/green_board');
const YellowBoard = require('./players_boards/yellow_board');
const RedBoard = require('./players_boards/red_board');
const BlueBoard = require('./players_boards/blue_board');

const Ghoul = require('./ghosts/ghoul');
const WalkingCorpse = require('./ghosts/walking_corpse');

class Board {
  constructor(players) {
    // 0 - top left, 1 - top middle, ...
    this.villagers = new Villagers();
    // 0 - top, 1 - right, 2 - bottom, 3 - left
    this.playersBoards = this.initPlayersBoards(players);
    this.ghostCards = this.initGhostCards();
  }

  initPlayersBoards(players) {
    const boards = [new GreenBoard(),
      new YellowBoard(),
      new RedBoard(),
      new BlueBoard(),
    ];

    return this.setBoardsInPlayersOrder(players, boards);
  }

  setBoardsInPlayersOrder(players, boards) {
    const resultBoards = [];
    for (let i = 0; i < players.getTaoists().length; i++) {
      resultBoards[i] = this.getBoardByColor(boards, players.getTaoist(i).getColor());
    }
    return resultBoards;
  }

  getBoardByColor(boards, color) {
    for (const board of boards) {
      if (board.getColor() === color) {
        return board;
      }
    }
    return null;
  }

  initGhostCards() {
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

  drawCard() {
    return this.ghostCards.pop();
  }

  isAllBoardsFull() {
    for (const board of this.playersBoards) {
      if (!board.isBoardFull()) {
        return false;
      }
    }
    return true;
  }

  getPlayerBoards() {
    return this.playersBoards;
  }

  getPlayerBoardByColor(color) {
    for (const playerBoard of this.playersBoards) {
      if (playerBoard.color.key === color) {
        return playerBoard;
      }
    }
    return null;
  }

  getPlayerBoardById(id) {
    return this.playersBoards[id];
  }

  getEmptyFields(boards, playerBoard) {
    const emptyFields = [];

    if (playerBoard.isBoardFull()) {
      for (const board of boards) {
        if (!board.isBoardFull()) {
          emptyFields.push(board.getEmptyFields());
        }
      }

      return emptyFields;
    }
    emptyFields.push(playerBoard.getEmptyFields());

    return emptyFields;
  }

  pickFieldForCard(socket, emptyFields, card) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost pick field', emptyFields, card, (pickedField) => {
        if (this.validatePickedField(emptyFields, pickedField)) {
          resolve(pickedField);
        } else {
          reject();
        }
      });
    });
  }

  validatePickedField(emptyFields, pickedField) {
    for (const emptyField of emptyFields) {
      if ((emptyField.color === pickedField.color)
        && (emptyField.fields.indexOf(pickedField.field) !== -1)) {
        return true;
      }
    }
    return false;
  }

  async ghostArrival(socket, players, bank, circleOfPrayer) {
    if (this.isAllBoardsFull()) {
      players.getActualPlayer().loseQi();
      bank.updateTokens(socket, players.getTaoists(), circleOfPrayer);
    } else {
      // Draw ghost card
      const card = this.drawCard();
      let emptyFields = [];
      // Black card on active player board
      if (card.color.key === FiveColors.BLACK) {
        // Get empty fields from actual player
        emptyFields = this.getEmptyFields(
          this.playersBoards,
          this.getPlayerBoardByColor(players.getActualPlayerColor()),
        );
        // Other than black color
      } else {
        // Get empty fields from player whose color is same as card color
        emptyFields = this.getEmptyFields(
          this.playersBoards,
          this.getPlayerBoardByColor(card.color.key),
        );
      }
      // Pick field for card
      const pickedField = await this.pickFieldForCard(socket, emptyFields, card);
      // Lay card of picked field
      this.getPlayerBoardByColor(pickedField.color).fields[pickedField.field] = card;
      console.log(this.getPlayerBoardByColor(pickedField.color));
      card.immediateEffect();
    }
  }
}

module.exports = Board;
