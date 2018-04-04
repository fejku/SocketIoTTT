const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

const Decision = require('../enums/decision');
const questions = require('../utils/questionsUI');

// 1. Heavenly Gust
// You can request aid from villagers and attempt an exorcism, in whatever order you choose.
// 2. Second Wind
// From your current village tile, you can request aid from villagers twice or attempt 2 exorcisms. The 2 exorcisms
// are independent: you can’t keep a partial success from the first and apply it to the second.
class BlueBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.BLUE;
  }

  getPowersNames() {
    return ['Heavenly Gust', 'Second Wind'];
  }

  async exorcism(socket, board, players, bank) {
    // Check if exorcism possible
    const isExorcismAvailable = players.getActualPlayer().validateExorcism(board.getAllPlayersBoards());
    // Ask if exorcism
    if (isExorcismAvailable) {
      const isExorcism = await questions.askYesNo(socket, 'Do you want exorcism ghost?');
      if (isExorcism) {
        // Exorcism
        await players.getActualPlayer().exorcism(socket, board, players, bank);
      }
    }
  }

  async villagerHelp(socket, board, players, bank) {
    // Check if villager help possible
    const isVillagerHelpAvailable = board.getVillager(players.getActualPlayer().getPosition()).validateHelp(board, players, bank);
    // Ask if villager help
    if (isVillagerHelpAvailable) {
      const isVillagerHelp = await questions.askYesNo(socket, 'Do you want villager help?');
      if (isVillagerHelp) {
        // Villager help
        await board.getVillager(players.getActualPlayer().getPosition()).action(socket, board, players, bank);
      }
    }
  }

  async heavenlyGust(socket, board, players, bank, decision) {
    if (decision === Decision.VILLAGER_HELP.key) {
      await this.exorcism(socket, board, players, bank);
    } else if (decision === Decision.EXORCISM.key) {
      await this.villagerHelp(socket, board, players, bank);
    }
  }

  async secondWind(socket, board, players, bank, decision) {
    if (decision === Decision.VILLAGER_HELP.key) {
      await this.villagerHelp(socket, board, players, bank);
    } else if (decision === Decision.EXORCISM.key) {
      await this.exorcism(socket, board, players, bank);
    }
  }

  async boardPower(socket, board, players, bank, situationName, decision) {
    if (!this.validatePowerBoard()) {
      return;
    }

    if (this.powerName === 'Heavenly Gust') {
      if (situationName === 'After exorcism villager help') {
        await this.heavenlyGust(socket, board, players, bank, decision);
      }
    } else if (this.powerName === 'Second Wind') {
      if (situationName === 'After exorcism villager help') {
        await this.secondWind(socket, board, players, bank, decision);
      }
    }
  }
}

module.exports = BlueBoard;
