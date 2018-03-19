const GreenBoard = require('./green_board');
const YellowBoard = require('./yellow_board');
const RedBoard = require('./red_board');
const BlueBoard = require('./blue_board');

class PlayersBoards {
  constructor(players) {
    this.playersBoards = this.initPlayersBoards(players);
  }

  initPlayersBoards(players) {
    const boards = [new GreenBoard(),
      new YellowBoard(),
      new RedBoard(),
      new BlueBoard(),
    ];

    return this.setBoardsInPlayersOrder(boards, players);
  }

  setBoardsInPlayersOrder(boards, players) {
    const resultBoards = [];
    for (let i = 0; i < players.getTaoists().length; i++) {
      resultBoards[i] = this.getPlayerBoardByColor(players.getTaoist(i).getColor().key, boards);
    }
    return resultBoards;
  }

  getPlayerBoardByColor(color, boards = null) {
    let boardsArray;

    if (boards === null) {
      boardsArray = this.playersBoards;
    } else {
      boardsArray = boards;
    }

    for (const board of boardsArray) {
      if (board.getColor().key === color) {
        return board;
      }
    }

    return null;
  }

  getPlayersBoards() {
    return this.playersBoards;
  }

  getPlayerBoardById(id) {
    return this.playersBoards[id];
  }

  getPlayerBoardIdByColor(color) {
    return this.playersBoards.findIndex(playerBoard => playerBoard.color.key === color);
  }

  getEmptyFields(playerBoard) {
    if (playerBoard.isBoardFull()) {
      let emptyFields = [];
      for (const board of this.playersBoards) {
        if (!board.isBoardFull()) {
          emptyFields = emptyFields.concat(board.getEmptyFields());
        }
      }

      return emptyFields;
    }
    return playerBoard.getEmptyFields();
  }

  isAllBoardsFull() {
    for (const board of this.playersBoards) {
      if (!board.isBoardFull()) {
        return false;
      }
    }
    return true;
  }

  getGhosts(skipWuFeng = false) {
    const ghosts = [];
    this.playersBoards.forEach((playerBoard, playerBoardIndex) => {
      ghosts.push(...playerBoard.getGhosts(skipWuFeng)
        .map(fieldIndex => ({
          playerBoardIndex,
          playerBoardColor: playerBoard.color.key,
          fieldIndex,
        })));
    });

    return ghosts; // Result (array[playerBoardIndex, playerBoardColor, fieldIndex])
  }
}

module.exports = PlayersBoards;
