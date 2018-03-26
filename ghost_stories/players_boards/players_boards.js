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

  getEmptyFieldsAllBoards() {
    const emptyFields = [];
    this.playersBoards.forEach((playerBoard) => {
      emptyFields.push(...playerBoard.getEmptyFields());
    });
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

  /**
   * Returns ghosts from all players boards
   *
   * @param {boolean} [skipWuFeng=false] Is Wu Feng should be returned
   * @returns {Object[]} [{ playerBoardIndex: number, playerBoardColor: string, fieldIndex: number, ghost: Ghost }]
   * @memberof PlayersBoards
   */
  getGhosts(skipWuFeng = false) {
    const ghosts = [];
    this.playersBoards.forEach((playerBoard, playerBoardIndex) => {
      ghosts.push(...playerBoard.getGhosts(skipWuFeng)
        .map(({ fieldIndex, ghost }) => ({
          playerBoardIndex,
          playerBoardColor: playerBoard.color.key,
          fieldIndex,
          ghost,
        })));
    });

    return ghosts;
  }

  /**
   * Replace ghost from one field to another
   *
   * @param {Object} pickedGhostField Actual field where ghost is
   * @param {number} pickedGhostField.playerBoardIndex
   * @param {string} pickedGhostField.playerBoardColor
   * @param {number} pickedGhostField.fieldIndex
   * @param {Object} pickedNewField Field where ghost will be moved
   * @param {number} pickedNewField.playerBoardIndex
   * @param {string} pickedNewField.playerBoardColor
   * @param {number} pickedNewField.fieldIndex
   * @memberof PlayersBoards
   */
  moveGhost(pickedGhostField, pickedNewField) {
    const ghost = this.playersBoards[pickedGhostField.playerBoardIndex].fields[pickedGhostField.fieldIndex];
    // Remove ghost from old field
    this.playersBoards[pickedGhostField.playerBoardIndex].fields[pickedGhostField.fieldIndex] = null;
    // If placed on buddha remove ghost
    const isNoBuddha = !this.playersBoards[pickedNewField.playerBoardIndex].buddhaFields[pickedNewField.fieldIndex];
    if (isNoBuddha) {
      // Place ghost on new field
      this.playersBoards[pickedNewField.playerBoardIndex].fields[pickedNewField.fieldIndex] = ghost;
    }
  }
}

module.exports = PlayersBoards;
