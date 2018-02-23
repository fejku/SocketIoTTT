let Villager = require('./villager');

let dice = require('../actions/curse_dice');

//Pośród porosłych chwastami nagrobków grabarz strzeże drzwi pomiędzy królestwami.
//Przywróć zmarłego Taoistę do rozgrywki. Daj mu 2 Czi, następnie rzuć kością Klątwy. 
class Cemetery extends Villager {
    constructor() {
        super();
        this.name = 'Cemetery'
    }

    //Check if there is any dead taoist
    validateHelp(board, players, bank) {
        for (let taoist of players.taoists)
            if (!taoist.isAlive())
                return true;
        return false;        
    }

    action(socket, board, players, bank) {
        let player; //TODO: pick player who you want to revivew
        //If there are two Qi markers in bank
        player.gainQi(2);
        bank.updateMarkers();
        dice.throwCurseDice(socket, players.getActualPlayer(), bank);
    }
}

module.exports = Cemetery;