const Board = require('./board');
const Players = require('./players/players');
const Bank = require('./bank');
const CircleOfPrayer = require('./villagers/circle_of_prayer');

const Decision = require('./enums/decision');
const { SixColors } = require('./enums/color');

const colorDice = require('./actions/color_dice');
const questions = require('./utils/questionsUI');

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
      socket.emit(
        'ghost init board',
        this.board.getAllPlayersBoards(),
        this.board.getAllVillagers(),
        this.players,
        this.bank,
      );
      // validate is player alive, are 3 villagers haunted, are still ghost cards in deck
      while (!this.validateGameEnd()) {
        await this.turn(io, socket); /* eslint-disable-line no-await-in-loop */
        // Set active player buddha figure to active
        this.players.getActualPlayer().setBuddhaFiguresActive();
        this.players.nextPlayer();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async turn(io, socket) {
    const actualPlayer = this.players.getActualPlayer();
    const circleOfPrayer = this.board.getVillagerByClass(CircleOfPrayer);
    const taoists = this.players.getTaoists();

    socket.emit('ghost update players stats', this.players);
    // Ghost phase
    // Step 1 - Ghosts’ actions
    // Step 2 - Check board overrun
    if (this.board.getPlayerBoardByColor(this.players.getActualPlayerColor()).isBoardFull()) {
      actualPlayer.loseQi();
      this.bank.updateTokens(socket, taoists, circleOfPrayer);
    } else {
      // Step 3 - Ghost arrival
      await this.board.ghostArrival(socket, this.players, this.bank, circleOfPrayer);
    }
    socket.emit('ghost update players stats', this.players);

    // Player phase
    // Step 1 - Player move
    const availableMoves = this.players
      .getAvailableMoves(actualPlayer.getPosition());
    const pickedMove = await this.players.pickMove(socket, availableMoves);
    console.log('availableMoves', availableMoves);
    console.log('pickedMove', pickedMove);
    actualPlayer.move(pickedMove);
    // Step 2 - Help from villager or exorcism
    const availableDecisions = [];
    // Check if villager help is possible
    if (this.board
      .getVillager(actualPlayer.getPosition())
      .validateHelp(this.board, this.players, this.bank)) {
      availableDecisions.push(Decision.VILLAGER_HELP.key);
    }
    // Check if exorcism is possible
    if (actualPlayer.validateExorcism(this.board.getAllPlayersBoards())) {
      availableDecisions.push(Decision.EXORCISM.key);
    }

    console.log('availableDecisions', availableDecisions);
    if (availableDecisions.length > 0) {
      const decision = await questions.ask(
        socket,
        'What to do?',
        availableDecisions,
      );
      console.log('decision', decision);
      switch (decision) {
        // Help from villager
        case Decision.VILLAGER_HELP.key:
          await this.board.getVillager(actualPlayer.getPosition())
            .action(socket, this.board, this.players, this.bank);
          break;
          // Attempt an exorcism
        case Decision.EXORCISM.key:
          {
            const ghostsInRange = actualPlayer.getGhostsInRange(this.board.getAllPlayersBoards());
            // Throw dices
            const diceThrowResult = colorDice.throwDices(3);
            console.log('diceThrowResult', diceThrowResult);
            console.log('ghostsInRange', ghostsInRange);
            if (ghostsInRange.length === 1) {
              const ghost = this.board.getPlayersBoards().getPlayerBoardById(ghostsInRange[0].playerBoardIndex)
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
                this.board.getPlayersBoards().getPlayerBoardById(ghostsInRange[0].playerBoardIndex)
                  .removeGhostFromField(socket, ghostsInRange[0].fieldIndex);
                console.log('board: ', this.board.getPlayersBoards().getPlayerBoardById(ghostsInRange[0].playerBoardIndex));
              } else {
                actualPlayer.loseQi();
                this.bank.updateTokens(socket, taoists, circleOfPrayer);
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
    socket.emit('ghost update players stats', this.players);
    // Step 3 Place a Buddha (optional)
    // You may place a Buddha figure on the Buddha symbol of an empty ghost space you are facing
    // (or 2 if you are on the corner tile). A ghost on a space with a Buddha is discarded
    // (and does not apply its curses or rewards), and the Buddha is placed on the Buddhist Temple tile.

    const buddhaFiguresAmount = actualPlayer.getAmountActiveBuddhaFigures();
    const ghostInRange = actualPlayer.getGhostsInRange(this.board.getAllPlayersBoards());
    const ghostInRangeCount = actualPlayer.getGhostsInRange(this.board.getAllPlayersBoards()).length;
    const playerInCorner = actualPlayer.isPlayerInCornerField();
    const playerInMiddleOuter = !actualPlayer.isPlayerInCornerField() && !actualPlayer.isPlayerInMiddleField();
    const nearFields = actualPlayer.getNearFields();

    // If player is in corner field and have two active buddha figures and fields are empty
    if (buddhaFiguresAmount > 0) {
      if (playerInCorner && (ghostInRangeCount === 0)) {
        if (buddhaFiguresAmount === 2) {
          const placeBudddha = await questions.ask(
            socket,
            'Do you want to place buddha figure?',
            ['Place 2', 'Place 1', 'No'],
          );

          if (placeBudddha === 'Place 2') {
            actualPlayer.placeBuddhaFigures(socket, this.board.getPlayersBoards());
          } else if (placeBudddha === 'Place 1') {
            const pickedField = await questions.pickPlayerBoardField(socket, nearFields);
            // Pick one field
            actualPlayer.placeBuddhaFigures(socket, this.board.getPlayersBoards(), pickedField);
          }
        } else if (buddhaFiguresAmount === 1) {
          const placeBudddha = await questions.askYesNo(socket, 'Do you want to place buddha figure?');
          if (placeBudddha) {
            const pickedField = await questions.pickPlayerBoardField(socket, nearFields);
            // Pick one field
            actualPlayer.placeBuddhaFigures(socket, this.board.getPlayersBoards(), pickedField);
          }
        }
      }
      if (playerInCorner && (ghostInRangeCount === 1)) {
        const placeBudddha = await questions.askYesNo(socket, 'Do you want to place buddha figure?');
        if (placeBudddha) {
          const emptyField = nearFields.find(nearField => !((nearField.playerBoardIndex === ghostInRange[0].playerBoardIndex)
            && (nearField.fieldIndex === ghostInRange[0].fieldIndex)));
          actualPlayer.placeBuddhaFigures(socket, this.board.getPlayersBoards(), emptyField);
        }
      }
      if (playerInMiddleOuter && (ghostInRangeCount === 0)) {
        const placeBudddha = await questions.askYesNo(socket, 'Do you want to place buddha figure?');
        if (placeBudddha) {
          actualPlayer.placeBuddhaFigures(socket, this.board.getPlayersBoards());
        }
      }
    }
  }
}
module.exports = new Game();
