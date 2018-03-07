const GreenBoard = require('./green_board');
const YellowBoard = require('./yellow_board');
const RedBoard = require('./red_board');
const BlueBoard = require('./blue_board');

class PlayerBoards {
  constructor(players) {
    this.playersBoards = this.initPlayersBoards(players);
  }

  initPlayersBoards(players) {
    this.playersBoards = [new GreenBoard(),
      new YellowBoard(),
      new RedBoard(),
      new BlueBoard(),
    ];

    return this.setBoardsInPlayersOrder(players);
  }

  setBoardsInPlayersOrder(players) {
    const resultBoards = [];
    for (let i = 0; i < players.getTaoists().length; i++) {
      resultBoards[i] = this.getBoardByColor(players.getTaoist(i).getColor());
    }
    return resultBoards;
  }

  getBoardByColor(color) {
    for (const board of this.playersBoards) {
      if (board.getColor() === color) {
        return board;
      }
    }
    return null;
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

  getEmptyFields(playerBoard) {
    const emptyFields = [];

    if (playerBoard.isBoardFull()) {
      for (const board of this.playersBoards) {
        if (!board.isBoardFull()) {
          emptyFields.push(board.getEmptyFields());
        }
      }

      return emptyFields;
    }
    emptyFields.push(playerBoard.getEmptyFields());

    return emptyFields;
  }

  isAllBoardsFull() {
    for (const board of this.playersBoards) {
      if (!board.isBoardFull()) {
        return false;
      }
    }
    return true;
  }
}

module.exports = PlayerBoards;
