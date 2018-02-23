let Villager = require('./villager');

//Pośród porosłych chwastami nagrobków grabarz strzeże drzwi pomiędzy królestwami.
//Przywróć zmarłego Taoistę do rozgrywki. Daj mu 2 Czi, następnie rzuć kością Klątwy. 
class Cemetery extends Villager {
    constructor() {
        super();
        this.name = 'Cemetery'
    }

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
        players.getActualPlayer()
    }
}

module.exports = Cemetery;