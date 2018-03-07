const Board = require('./board');
const Players = require('./players/players');
const Bank = require('./bank');
const CircleOfPrayer = require('./villagers/circle_of_prayer');

const Decision = require('./enums/decision');
const { SixColors } = require('./enums/color');

const colorDice = require('./actions/color_dice');

class Game {
  constructor() {
    this.players = new Players();
    this.board = new Board(this.players);
    this.bank = new Bank();
  }

  validateGameEnd() {
    return false;
  }

  async start(io, socket) {
    try {
      socket.emit('ghost init board', this.board.getAllPlayersBoards(), this.board.getAllVillagers(), this.bank);
      // validate is player alive, are 3 villagers haunted, are still ghost cards in deck
      while (!this.validateGameEnd()) {
        await this.turn(io, socket); /* eslint-disable-line no-await-in-loop */
        this.players.nextPlayer();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async turn(io, socket) {
    // Ghost phase
    // Step 1 - Ghosts’ actions
    // Step 2 - Check board overrun
    if (this.board.getPlayerBoardByColor(this.players.getActualPlayerColor()).isBoardFull()) {
      this.players.getActualPlayer().loseQi();
      this.bank.updateTokens(
        socket,
        this.players.getTaoists(),
        this.board.getVillagerByClass(CircleOfPrayer),
      );
    } else {
      // Step 3 - Ghost arrival
      await this.board.ghostArrival(socket, this.players, this.bank, this.board.getVillagerByClass(CircleOfPrayer));
    }

    // Player phase
    // Step 1 - Player move
    const availableMoves = this.players
      .getAvailableMoves(this.players.getActualPlayer().getPosition());
    const pickedMove = await this.players.pickMove(socket, availableMoves);
    console.log('availableMoves', availableMoves);
    console.log('pickedMove', pickedMove);
    this.players.getActualPlayer().move(pickedMove);
    // Step 2 - Help from villager or exorcism
    const availableDecisions = [];
    // Check if villager help is possible
    if (this.board
      .getVillager(this.players.getActualPlayer().getPosition())
      .validateHelp(this.board, this.players, this.bank)) {
      availableDecisions.push(Decision.VILLAGER_HELP.key);
    }
    // Check if exorcism is possible
    if (this.players.getActualPlayer().validateExorcism(this.board.getAllPlayersBoards())) {
      availableDecisions.push(Decision.EXORCISM.key);
    }

    console.log('availableDecisions', availableDecisions);
    if (availableDecisions.length > 0) {
      const decision = await this.players.makeDecision(socket, availableDecisions);
      console.log('decision', decision);
      switch (decision) {
        // Help from villager
        case Decision.VILLAGER_HELP.key:
          await this.board.getVillager(this.players.getActualPlayer().getPosition())
            .action(socket, this.board, this.players, this.bank);
          break;
          // Attempt an exorcism
        case Decision.EXORCISM.key:
          {
            const ghostsInRange = this.players.getActualPlayer()
              .getGhostsInRange(this.board.getAllPlayersBoards());
              // Throw dices
            const diceThrowResult = colorDice.throwDices(3);
            console.log('diceThrowResult', diceThrowResult);
            console.log('ghostsInRange', ghostsInRange);
            if (ghostsInRange.length === 1) {
              const ghost = this.board.getPlayerBoardById(ghostsInRange[0].playerBoardIndex)
                .getField(ghostsInRange[0].fieldIndex);
              console.log('ghost', ghost);
              // If result of throwed dices(taoist tao tokens,
              // circle of prayers) is greater then ghost resistance
              const whiteDiceResult = diceThrowResult[SixColors.WHITE];
              const resultAfterModifications = diceThrowResult[ghost.getColor()] +
                  whiteDiceResult;
                // + circleOfPrayer
                // + taoTokens;
              if (ghost.getResistance() <= resultAfterModifications) {
                console.log('Ghost defeated');
                // Ghost action after winning
                ghost.afterWinningEffect();
                // Remove ghost from field
                this.board.getPlayerBoardById(ghostsInRange[0].playerBoardIndex)
                  .removeGhostFromField(socket, ghostsInRange[0].fieldIndex);
                console.log('board: ', this.board.getPlayerBoardById(ghostsInRange[0].playerBoardIndex));
              } else {
                this.players.getActualPlayer().loseQi();
                this.bank.updateTokens(socket, this.players.getTaoists(), this.board.getVillagerByClass(CircleOfPrayer));
              }
            } else {
              // If player is on corner and result is big enough pick which ghost to exorcism
            }
          }
          break;
        default:
          break;
      }
    }
    // Step 3
  }
}
module.exports = new Game();
