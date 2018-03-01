let Villager = require('./villager');
let dice = require('../actions/curse_dice');

//Pośród porosłych chwastami nagrobków grabarz strzeże drzwi pomiędzy królestwami.
//Przywróć zmarłego Taoistę do rozgrywki. Daj mu 2 Czi, następnie rzuć kością Klątwy. 
class Cemetery extends Villager {
    constructor() {
        super();
        this.name = 'Cemetery'
    }

    
    validateHelp(board, players, bank) {
        //Check if there are enough Qi markers in bank
        if (bank.getQiMarkers() < 2)
            return false;

        //Check if there is any dead taoist
        for (let taoist of players.getTaoists())
            if (!taoist.isAlive())
                return true;
        return false;
    }

    async _pickPlayerToReview(socket, players) {
        return new Promise((resolve, reject) => {
            let deadPlayers = players.getDeadPlayers();
            socket.emit('ghost pick player to review', deadPlayers, pickedPlayerColor => {
                let player = players.getPlayerByColor(pickedPlayerColor);
                resolve(player);
            });
        });
    }

    async action(socket, board, players, bank) {
        let player = await this._pickPlayerToReview(socket, players);
        player.gainQi(2);
        bank.updateMarkers(players.getTaoists());
        dice.throwCurseDiceCemetry(socket, board, players, bank);
    }
}

module.exports = Cemetery;