const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');
const questions = require('../utils/questionsUI');
const playersUtils = require('../players/players_utils');

class RedBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.RED;
  }

  getPowersNames() {
    return ['Dance of the Spires', 'Dance of the Twin Winds'];
  }

  // During your move, you can fly to any village tile.
  danceOfTheSpires(players) {
    // Move red player into center tile so he can move anywhere
    players.getActualPlayer().move(4);
  }

  // Before your move, you can move 1 other Taoist 1 space.
  async danceOfTheTwinWinds(socket, players) {
    const moveOtherTaoist = await questions.askYesNo(socket, 'Do you want to move other player?');
    if (moveOtherTaoist) {
      const pickedTaoist = await questions.pickPlayer(socket, players.getAlivePlayers(true));
      const availableMoves = playersUtils.getAvailableMoves(pickedTaoist.getPosition());
      const pickedMove = await questions.pickVillagerTile(socket, availableMoves);
      pickedTaoist.move(pickedMove);
      socket.emit('ghost refresh players tokens', players);
    }
  }

  async boardPower(socket, board, players, bank, situationName) {
    if (this.powerName === 'Dance of the Spires') {
      if (situationName === 'Before move') {
        this.danceOfTheSpires(players);
      }
    } else if (this.powerName === 'Dance of the Twin Winds') {
      if (situationName === 'Before move') {
        await this.danceOfTheTwinWinds(socket, players);
      }
    }
  }
}

module.exports = RedBoard;
