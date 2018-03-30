const CircleOfPrayer = require('../villagers/circle_of_prayer');
const Dice = require('./dice');

const questions = require('../utils/questionsUI');

function loseQi(socket, players, bank) {
  players.getActualPlayer().loseQi(bank);
  bank.updateUI(socket);
}

function loseAllTaoTokens(socket, players, bank, circleOfPrayer) {
  players.getActualPlayer().loseAllTaoTokens();
  bank.updateTokens(socket, players.getTaoists(), circleOfPrayer);
}

function getTilePositionToHaunt(ghostPosition, villagers, step = 0) {
  let tilePosition = -1;

  switch (ghostPosition.boardIndex) {
    case 0:
      tilePosition = ghostPosition.fieldIndex + (3 * step);
      break;
    case 1:
      tilePosition = (3 * ghostPosition.fieldIndex) + (2 - step);
      break;
    case 2:
      tilePosition = (6 + ghostPosition.fieldIndex) - (3 * step);
      break;
    case 3:
      tilePosition = (3 * ghostPosition.fieldIndex) + step;
      break;
    default:
      break;
  }

  if (villagers.getVillager(tilePosition).isHaunted()) {
    getTilePositionToHaunt(ghostPosition, villagers, ++step); // eslint-disable-line no-param-reassign
  }

  return tilePosition;
}

function hauntTile(playerPosition, ghostPosition, villagers, isCemeteryCall) {
  if (isCemeteryCall) {
    villagers.getVillager(playerPosition).setHaunted(true);
  } else {
    const tilePositionToHaunt = getTilePositionToHaunt(ghostPosition, villagers);
    villagers.getVillager(tilePositionToHaunt).setHaunted(true);
  }
}

function getThrowResultName(throwResult) {
  switch (throwResult) {
    case 0 - 1:
      return 'No effect';
    case 2:
      return 'The first active village tile in front of the ghost becomes haunted.';
    case 3:
      return 'Bring a ghost into play according to the placement rules.';
    case 4:
      return 'Discard all your Tao tokens.';
    case 5:
      return 'Lose 1 Qi point.';
    default:
      return null;
  }
}

function getThrowResult(socket, board, players) {
  let throwResult = Dice.getThrowResult();
  console.log('throwCurseDice throwResult: ', throwResult);

  if (board.getPlayerBoardById(players.getActualPlayerId()).getPowerName() === 'The Gods’ Favorite') {
    const isReroll = questions.askYesNo(socket, 'Do you want reroll?', `You rolled: ${getThrowResultName(throwResult)}`);
    if (isReroll) {
      throwResult = Dice.getThrowResult();
      console.log('throwCurseDice throwResult: ', throwResult);
    }
  }
  return throwResult;
}

function checkIfPlayerDontThrow(board, players, isCemeteryCall) {
  if ((!isCemeteryCall) &&
      (board.getPlayerBoardById(players.getActualPlayerId()).getPowerName() === 'Strength of a Mountain')) {
    return true;
  }
  return false;
}

function throwCurseDice(socket, board, players, ghostPosition, bank, isCemeteryCall) {
  if (checkIfPlayerDontThrow(board, players, isCemeteryCall)) {
    return;
  }

  const throwResult = getThrowResult();

  switch (throwResult) {
    // (0-1) No effect.
    // The first active village tile in front of the ghost becomes haunted.
    // Q : When I use the Cemetery, if “Haunt Tile” is rolled on the Curse Die,
    //     which tile becomes haunted?
    // A : The Cemetery itself.
    case 2:
      hauntTile(
        players.getActualPlayer().getPosition(),
        ghostPosition, board.getVillagers(), isCemeteryCall,
      );
      break;
    // The player must bring a ghost into play according to the placement rules.
    case 3:
      board.ghostArrival(socket, players, bank, board.getVillagerByClass(CircleOfPrayer));
      break;
    // The player must discard all his Tao tokens.
    case 4:
      loseAllTaoTokens(socket, players, bank, board.getVillagerByClass(CircleOfPrayer));
      break;
    // The Taoist loses one Qi token.
    case 5:
      loseQi(socket, players, bank);
      break;
    default:
      break;
  }
}

module.exports.throwCurseDice = (socket, board, ghostPosition, players, bank) =>
  throwCurseDice(socket, board, players, ghostPosition, bank, false);

module.exports.throwCurseDiceCemetry = (socket, board, players, bank) =>
  throwCurseDice(socket, board, players, null, bank, true);
