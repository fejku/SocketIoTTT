const { FourColors } = require('../enums/color');
const PlayerBoard = require('./player_board');

// 1. Bezdenne Kieszenie
// Żółtemu Taoiście nigdy nie brakuje mistycznych komponentów.
// Przed ruchem bierze on znacznik Tao dowolnego koloru spośród znaczników dostępnych w banku.
// 2. Mantra Osłabiająca
// Żółty taoista może magicznie osłabić duchy. Przed ruchem umieszcza on lub przemieszcza znacznik
// Mantry Osłabiającej na dowolnego ducha w grze. Duch objęty tym czarem zmniejsza swa odporność
// na egzorcyzmy o 1 (duch o odporności 3 ma odporność 2), niezależnie od tego, który Taoista dokonuje egzorcyzmu.
// Gdy duch będący celem Mantry Osłabiającej zostaje usunięty z gry, należy zwrócić znacznik mantry
// żółtemu Taoiście, który będzie mógł ponownie z niego skorzystać w swojej następnej turze. Jeżeli mnich straci moc,
// należy usunąć z gry znacznik Mantry Osłabiającej.
class YellowBoard extends PlayerBoard {
  constructor() {
    super();
    this.color = FourColors.YELLOW;
  }
}

module.exports = YellowBoard;
