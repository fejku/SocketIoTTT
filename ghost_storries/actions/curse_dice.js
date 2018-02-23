function loseQi(activePlayer, bank) {
    activePlayer.loseQi();
    bank.updateMarkers();
}

function loseAllTaoTokens(activePlayer, bank) {
    activePlayer.loseAllTaoMarkers();
    bank.updateMarkers();
}

function hauntTile(socket, isCemeteryCall) {
    if (isCemeteryCall) {
        let availableTilesToHaunt = test;
    } else {
        
    }
}

module.exports.throwCurseDice = (socket, activePlayer, bank, isCemeteryCall) => {
    let throwResult = Math.floor(Math.random() * 6);
    switch (throwResult) {
        //(0-1) No effect.
        //The first active village tile in front of the ghost becomes haunted.
        case 2:
            hauntTile(socket, isCemeteryCall);
            break;
            //The player must bring a ghost into play according to the placement rules.
        case 3:

            break;
            //The player must discard all his Tao tokens.            
        case 4:
            loseAllTaoTokens(activePlayer, bank)
            break;
            //The Taoist loses one Qi token.            
        case 5:
            loseQi(activePlayer, bank)
            break;
    }
}