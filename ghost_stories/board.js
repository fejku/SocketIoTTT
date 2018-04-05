const arrayShuffle = require('array-shuffle');
const { FiveColors } = require('./enums/color');

const Villagers = require('./villagers/villagers');
const PlayerBoards = require('./players_boards/players_boards');

const BuddhistTemple = require('./villagers/buddhist_temple');

// Ghosts
// Yellow
const Ghoul = require('./ghosts/color/yellow//ghoul');
const WalkingCorpse = require('./ghosts/color/yellow/walking_corpse');
const CoffinBreakers = require('./ghosts/color/yellow/coffin_breakers');
const RestlessDead = require('./ghosts/color/yellow/restless_dead');
const Zombie = require('./ghosts/color/yellow/zombie');
const HoppingVampire = require('./ghosts/color/yellow/hopping_vampire');
const YellowPlague = require('./ghosts/color/yellow/yellow_plague');
const Lich = require('./ghosts/color/yellow/lich');
// Blue
const DrowendMaiden = require('./ghosts/color/blue/drowned_maiden');
const HoundOfDepth = require('./ghosts/color/blue/hound_of_depth');
const StickyFeet = require('./ghosts/color/blue/sticky_feet');
const Abysmal = require('./ghosts/color/blue/abysmal');
const OozeDevil = require('./ghosts/color/blue/ooze_devil');
const LiquidHorror = require('./ghosts/color/blue/liquid_horror');
const FuryOfDepth = require('./ghosts/color/blue/fury_of_depth');
// Green
const CreepingOne = require('./ghosts/color/green/creeping_one');
const FungusThing = require('./ghosts/color/green/fungus_thing');
const RestlessSpirit = require('./ghosts/color/green/restless_spirit');
const RottenSoul = require('./ghosts/color/green/rotten_soul');
const WickedOne = require('./ghosts/color/green/wicked_one');
const GreenAbomination = require('./ghosts/color/green/green_abomination');
const GreatPutrid = require('./ghosts/color/green/great_putrid');
// Red
const Skinner = require('./ghosts/color/red/skinner');
const Reaper = require('./ghosts/color/red/reaper');
const BleedingEyes = require('./ghosts/color/red/bleeding_eyes');
const BloodDrinker = require('./ghosts/color/red/blood_drinker');
const ScarletEvildoer = require('./ghosts/color/red/scarlet_evildoer');
const FleshDevourer = require('./ghosts/color/red/flesh_devourer');
const RagingOne = require('./ghosts/color/red/raging_one');

const UI = require('./utils/UI');
const questions = require('./utils/questionsUI');

class Board {
  constructor(players) {
    // 0 - top left, 1 - top middle, ...
    this.villagers = new Villagers();
    // 0 - top, 1 - right, 2 - bottom, 3 - left
    this.playersBoards = new PlayerBoards(players);
    this.ghostCards = this.initGhostCards();
    this.activeDices = 3;
  }

  initGhostCards() {
    return arrayShuffle([
      // Yellow
      new Ghoul(),
      new WalkingCorpse(),
      new CoffinBreakers(true),
      new CoffinBreakers(false),
      new RestlessDead(),
      new Zombie(),
      new Zombie(),
      new HoppingVampire(),
      new HoppingVampire(),
      new YellowPlague(),
      new Lich(),
      // Blue
      new DrowendMaiden(),
      new HoundOfDepth(),
      new StickyFeet(),
      new Abysmal(),
      new Abysmal(),
      new OozeDevil(),
      new OozeDevil(),
      new LiquidHorror(),
      new FuryOfDepth(),
      // Green
      new CreepingOne(),
      new FungusThing(),
      new RestlessSpirit(),
      new RottenSoul(),
      new RottenSoul(),
      new WickedOne(),
      new WickedOne(),
      new GreenAbomination(),
      new GreatPutrid(),
      // Red
      new Skinner(),
      new Reaper(),
      new BleedingEyes(),
      new BloodDrinker(),
      new BloodDrinker(),
      new ScarletEvildoer(),
      new ScarletEvildoer(),
      new FleshDevourer(),
      new RagingOne(),
    ]);
  }

  getVillagers() {
    return this.villagers;
  }

  getAllVillagers() {
    return this.villagers.getVillagers();
  }

  getVillager(index) {
    return this.villagers.getVillager(index);
  }

  getVillagerByClass(villagerClass) {
    return this.villagers.getVillagerByClass(villagerClass);
  }

  getPlayersBoards() {
    return this.playersBoards;
  }

  getAllPlayersBoards() {
    return this.playersBoards.getPlayersBoards();
  }

  getPlayerBoardByColor(color) {
    return this.playersBoards.getPlayerBoardByColor(color);
  }

  getPlayerBoardById(index) {
    return this.playersBoards.getPlayerBoardById(index);
  }

  drawCard() {
    return this.ghostCards.pop();
  }

  layCardOnField(socket, pickedField, card, playersBoards) {
    this.getPlayerBoardByColor(pickedField.playerBoardColor).fields[pickedField.fieldIndex] = card;
    card.setPosition(pickedField);
    UI.refreshPlayersBoards(socket, playersBoards);
  }

  async ghostArrival(socket, players, bank) {
    if (this.getPlayersBoards().isAllBoardsFull()) {
      players.getActualPlayer().loseQi(bank);
      bank.updateUI(socket);
    } else {
      // Draw ghost card
      const card = this.drawCard();
      let emptyFields = [];
      // Black card on active player board
      if (card.color.key === FiveColors.BLACK) {
        // Get empty fields from actual player
        emptyFields = this.getPlayersBoards().getEmptyFields(this.getPlayerBoardByColor(players.getActualPlayerColor()));
        // Other than black color
      } else {
        // Get empty fields from player whose color is same as card color
        emptyFields = this.getPlayersBoards().getEmptyFields(this.getPlayerBoardByColor(card.color.key));
      }
      // Pick field for card
      const pickedField = await questions.pickPlayerBoardField(socket, emptyFields);

      if (this.getPlayerBoardById(pickedField.playerBoardIndex).isBuddhaOnField(pickedField.fieldIndex)) {
        // Remove buddha from field
        this.getPlayerBoardById(pickedField.playerBoardIndex).setBuddhaField(pickedField.fieldIndex, false);
        const buddhistTemple = this.villagers.getVillagerByClass(BuddhistTemple);
        // Back buddha into temple
        buddhistTemple.addBuddhaFigure();
        UI.refreshBuddhaFigures(socket, buddhistTemple.getBuddhaFiguresAmount(), this.getAllPlayersBoards());
        if (card.isWuFeng()) {
          this.layCardOnField(socket, pickedField, card, this.getAllPlayersBoards());
          await card.immediateEffect(socket, this, players, bank);
        }
      } else {
        this.layCardOnField(socket, pickedField, card, this.getAllPlayersBoards());
        await card.immediateEffect(socket, this, players, bank);
      }
    }
  }

  getActiveDices() {
    return this.activeDices;
  }
}

module.exports = Board;
