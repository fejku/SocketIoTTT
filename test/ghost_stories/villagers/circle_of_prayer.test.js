const { assert } = require('chai');

const CircleOfPrayer = require('../../../ghost_stories/villagers/circle_of_prayer');
const Board = require('../../../ghost_stories/board');
const Players = require('../../../ghost_stories/players/players');
const Bank = require('../../../ghost_stories/bank');
const { FiveColors } = require('../../../ghost_stories/enums/color');

describe('Circle of prayer', () => {
  let players;
  let board;
  let circleOfPrayer;
  let bank;

  beforeEach(() => {
    players = new Players();
    board = new Board(players);
    circleOfPrayer = new CircleOfPrayer();
    bank = new Bank();
  });

  describe('initTaoTokens', () => {
    it('should return object with 0 tao token of all colors', () => {
      circleOfPrayer.initTaoTokens();

      const tokenAmount = Object.values(circleOfPrayer.taoTokens).reduce((prev, act) => prev + act, 0);
      assert.strictEqual(tokenAmount, 0);
    });
  });

  describe('removeTaoTokenFromTile', () => {
    it('should return array with 0 tao tokens if there was any token', () => {
      circleOfPrayer.taoTokens.YELLOW = 1;
      circleOfPrayer.removeTaoTokenFromTile();

      const tokenAmount = Object.values(circleOfPrayer.taoTokens).reduce((prev, act) => prev + act, 0);
      assert.strictEqual(tokenAmount, 0);
    });

    it('should return array with 0 tao tokens if there wasn`t any token', () => {
      circleOfPrayer.removeTaoTokenFromTile();

      const tokenAmount = Object.values(circleOfPrayer.taoTokens).reduce((prev, act) => prev + act, 0);
      assert.strictEqual(tokenAmount, 0);
    });
  });

  describe('validateHelp', () => {
    it('should be available when there is any tao token left in bank', () => {
      assert.strictEqual(circleOfPrayer.validateHelp(board, players, bank), true);
    });

    it('shouldn`t be available when there is no tao token left in bank', () => {
      removeAllTaoTokensFromBank(players, bank, circleOfPrayer);

      assert.strictEqual(circleOfPrayer.validateHelp(board, players, bank), false);
    });
  });

  describe('changeToken', () => {
    it('should return one yellow token when adding first tao token', () => {
      circleOfPrayer.changeToken('YELLOW');

      assert.strictEqual(circleOfPrayer.taoTokens.YELLOW, 1);
    });

    it('should return only one token ', () => {
      circleOfPrayer.changeToken('YELLOW');
      circleOfPrayer.changeToken('YELLOW');
      const sum = Object.values(circleOfPrayer.taoTokens).reduce((prev, curr) => prev + curr, 0);

      assert.strictEqual(sum, 1);
    });

    it('should remove previous tao token', () => {
      circleOfPrayer.changeToken('RED');
      circleOfPrayer.changeToken('YELLOW');

      assert.strictEqual(circleOfPrayer.taoTokens.RED, 0);
    });

    it('should add new tao token', () => {
      circleOfPrayer.changeToken('RED');
      circleOfPrayer.changeToken('YELLOW');

      assert.strictEqual(circleOfPrayer.taoTokens.YELLOW, 1);
    });
  });
});

function removeAllTaoTokensFromBank(playersParam, bankParam, circleOfPrayerParam) {
  // Remove all tao tokens from bank
  FiveColors.enums.forEach((color) => {
    const colorsAmount = (color.key === 'BLACK') ? 4 : 3;
    playersParam.getActualPlayer().gainTaoToken(color.key, colorsAmount);
  });

  bankParam.updateTokens(null, playersParam.getTaoists(), circleOfPrayerParam);
}
