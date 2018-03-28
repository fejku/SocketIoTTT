const { assert } = require('chai');

const Players = require('../../../ghost_stories/players/players');

const players = new Players();

describe('Players', () => {
  describe('nextMove', () => {
    it('should set only alive players as active', () => {
      players.getTaoist(1).qiTokens = 0;
      players.nextPlayer();

      assert.equal(players.getActualPlayerId(), 2);
    });

    it('should set player 0 after player 3', () => {
      players.actualPlayer = 3;
      players.nextPlayer();

      assert.equal(players.getActualPlayerId(), 0);
    });
  });
});
