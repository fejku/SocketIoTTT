const Villager = require('./villager');
const CircleOfPrayer = require('./circle_of_prayer');

// W głębi swej chaty wioskowy czarownik zawsze gotów jest do pomocy. Jego czarna magia jest potężna, ale słono kosztuje...
// Wyślij dowolnego ducha w grze na stos kart odrzuconych, nie stosując jego zdolności, ale też nie biorąc za niego nagrody.
// Tracisz jeden punkt Czi.
class SorcererHut extends Villager {
  constructor() {
    super();
    this.name = 'Sorcerer Hut';
  }

  validateHelp(board, players, bank) {
    // If there is any ghost in play (beside Wu Feng)
    return board.getAllPlayersBoards().some(playerBoard => playerBoard.isAnyGhostOnBoard(true));
  }

  getAvailableGhosts(board) {
    const result = [];
    board.getAllPlayersBoards().forEach((playerBoard) => {
      result.push(playerBoard.getOccupiedFields(true));
    });
    return result;
  }

  validatePickedGhost(availableGhosts, pickedGhost) {
    return availableGhosts
      .find(ghost => ghost.color === pickedGhost.color
        && ghost.fields.indexOf(pickedGhost.field) !== -1) !== undefined;
  }

  pickGhost(socket, availableGhosts) {
    return new Promise((resolve, reject) => {
      socket.emit('ghost sorcerer hut pick ghost', availableGhosts, (pickedGhost) => {
        if (this.validatePickedGhost(availableGhosts, JSON.parse(pickedGhost))) {
          resolve(JSON.parse(pickedGhost));
        } else {
          reject();
        }
      });
    });
  }

  async action(socket, board, players, bank) {
    // Get available Ghosts (skip Wu Feng)
    const availableGhosts = this.getAvailableGhosts(board);
    console.log('availableGhosts: ', availableGhosts);
    // Pick ghost
    const pickedGhost = await this.pickGhost(socket, availableGhosts);
    console.log('pickedGhost: ', pickedGhost);
    // Remove ghost from board (don't trigger afterWinningEffect)
    board.getPlayerBoardByColor(pickedGhost.color).setField(pickedGhost.field, null);
    // Update UI

    // Player lose Qi
    players.getActualPlayer().loseQi();
    // Update bank
    bank.updateTokens(socket, players.getTaoists(), board.getVillagerByClass(CircleOfPrayer));
  }
}

module.exports = SorcererHut;
