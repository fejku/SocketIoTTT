const CircleOfPrayer = require('../villagers/circle_of_prayer');

function loseQi(players, bank, circleOfPrayer) {
  players.getActualPlayer().loseQi();
  bank.updateMarkers(players.getTaoists(), circleOfPrayer);
}

function loseAllTaoTokens(players, bank, circleOfPrayer) {
  players.getActualPlayer().loseAllTaoMarkers();
  bank.updateMarkers(players.getTaoists(), circleOfPrayer);
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
    getTilePositionToHaunt(ghostPosition, villagers, ++step); // eslint-disable-line no-param-reassign, max-len
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

function throwCurseDice(socket, board, players, ghostPosition, bank, isCemeteryCall) {
  const throwResult = Math.floor(Math.random() * 6);
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
      loseAllTaoTokens(players, bank, board.getVillagerByClass(CircleOfPrayer));
      break;
      // The Taoist loses one Qi token.
    case 5:
      loseQi(players, bank, board.getVillagerByClass(CircleOfPrayer));
      break;
    default:
      break;
  }
}

module.exports.throwCurseDice = (socket, board, ghostPosition, players, bank) =>
  throwCurseDice(socket, board, players, ghostPosition, bank, false);

module.exports.throwCurseDiceCemetry = (socket, board, players, bank) =>
  throwCurseDice(socket, board, players, null, bank, true);
