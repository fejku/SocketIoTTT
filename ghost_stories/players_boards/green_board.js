const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

// 1. Ulubieniec Bogów
// Bogowie przodków towarzyszą zielonemu Taoiście. Może przerzucić każda kość Tao związaną z akcją pomocniczą lub
// egzorcyzmem (może zatrzymać niektóre z kości i przerzucić resztę). Może także przerzucić kość Klątwy.
// Musi zawsze zatrzymać nowy wynik rzutu.
// 2. Siła Góry
// Zielony Taoista ma nadzwyczajną moc - dysponuje czwartą kością Tao podczas wykonywania egzorcyzmów.
// Ponadto nigdy nie rzuca kością Klątwy.
class GreenBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.GREEN;
  }
}

module.exports = GreenBoard;
