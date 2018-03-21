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

  function removeAllTaoTokensFromBank(playersParam, bankParam, circleOfPrayerParam) {
    // Remove all tao tokens from bank
    FiveColors.enums.forEach((color) => {
      const colorsAmount = (color.key === 'BLACK') ? 4 : 3;
      playersParam.getActualPlayer().gainTaoToken(color.key, colorsAmount);
    });

    bankParam.updateTokens(null, playersParam.getTaoists(), circleOfPrayerParam);
  }

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
      assert.equal(tokenAmount, 0);
    });
  });

  describe('removeTaoTokenFromTile', () => {
    it('should return array with 0 tao tokens if there was any token', () => {
      circleOfPrayer.taoTokens.YELLOW = 1;
      circleOfPrayer.removeTaoTokenFromTile();

      const tokenAmount = Object.values(circleOfPrayer.taoTokens).reduce((prev, act) => prev + act, 0);
      assert.equal(tokenAmount, 0);
    });

    it('should return array with 0 tao tokens if there wasn`t any token', () => {
      circleOfPrayer.removeTaoTokenFromTile();

      const tokenAmount = Object.values(circleOfPrayer.taoTokens).reduce((prev, act) => prev + act, 0);
      assert.equal(tokenAmount, 0);
    });
  });

  describe('getAvailableColors', () => {
    it('should return array with all colors', () => {
      const allColorsArray = FiveColors.enums.map(color => color.key);
      const availableColors = circleOfPrayer.getAvailableColors(bank.getTaoTokens(players.getTaoists(), circleOfPrayer));

      assert.deepEqual(allColorsArray, availableColors);
    });

    it('should return empty array', () => {
      removeAllTaoTokensFromBank(players, bank, circleOfPrayer);
      const availableColors = circleOfPrayer.getAvailableColors(bank.getTaoTokens(players.getTaoists(), circleOfPrayer));

      assert.deepEqual(availableColors, []);
    });

    it('should return array with red and black', () => {
      FiveColors.enums.forEach((color) => {
        if (color.key !== 'RED') {
          players.getActualPlayer().gainTaoToken(color.key, 3);
        }
      });
      bank.updateTokens(null, players.getTaoists(), circleOfPrayer);

      const availableColors = circleOfPrayer.getAvailableColors(bank.getTaoTokens(players.getTaoists(), circleOfPrayer));

      assert.deepEqual(availableColors, ['RED', 'BLACK']);
    });
  });

  describe('validateHelp', () => {
    it('should be available when there is any tao token left in bank', () => {
      assert.equal(circleOfPrayer.validateHelp(board, players, bank), true);
    });

    it('shouldn`t be available when there is no tao token left in bank', () => {
      removeAllTaoTokensFromBank(players, bank, circleOfPrayer);

      assert.equal(circleOfPrayer.validateHelp(board, players, bank), false);
    });
  });

  describe('action', () => {
    it('TODO don`t know how to check this function, it waits for user input');
  });
});
