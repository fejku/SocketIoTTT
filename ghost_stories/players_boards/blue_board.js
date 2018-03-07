const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

// 1. Niebiański Podmuch
// Niebieski Taoista może działać błyskawicznie. Może uzyskać pomoc od wieśniaków oraz dokonywać
// egzorcyzmu, w wybranej przez siebie kolejności.
// 2. Drugi Wiatr
// Niebieski Taoista może spowolnić upływ czasu. Może dwukrotnie poprosić o pomoc wieśniaka z żetonu wioski, na którym
// się obecnie znajduje lub dwukrotnie dokonać egzorcyzmu. Dwa egzorcyzmy są niezależne od siebie: nie może zatrzymać
// częściowego sukcesu z pierwszego rzutu i zastosować go przy drugim.
class BlueBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.BLUE;
  }
}

module.exports = BlueBoard;
