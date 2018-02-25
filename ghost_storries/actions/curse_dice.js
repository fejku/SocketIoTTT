function loseQi(activePlayer, bank) {
    activePlayer.loseQi();
    bank.updateMarkers();
}

function loseAllTaoTokens(activePlayer, bank) {
    activePlayer.loseAllTaoMarkers();
    bank.updateMarkers();
}

function getAvailableTilesToHaunt(position) {
    switch (position) {
        case 0:
            return [1, 3];
        case 1:
            return [0, 2, 4];
        case 2:
            return [1, 5];
        case 3:
            return [0, 4, 6];
        case 4:
            return [1, 3, 5, 7];
        case 5:
            return [2, 4, 8];
        case 6:
            return [3, 7];
        case 7:
            return [4, 6, 8];
        case 8:
            return [5, 7];
    }
}

function pickTileToHaunt(socket, availableTilesToHaunt) {
    return new Promise((resolve, reject) => {
        socket.emit('ghost pick tile to haunt', availableTilesToHaunt, pickedTile => {
            if (this.validatePickedTile(availableTilesToHaunt, pickedTile))
                resolve(pickedTile);
            else
                reject();
        });
    });
}

async function hauntTile(socket, position, isCemeteryCall) {
    if (isCemeteryCall) {
        let availableTilesToHaunt = getAvailableTilesToHaunt();
        let pickedTile = await pickTileToHaunt(socket, availableTilesToHaunt);
    } else {

    }
}

function throwCurseDice(socket, activePlayer, bank, isCemeteryCall) {
    let throwResult = Math.floor(Math.random() * 6);
    switch (throwResult) {
        //(0-1) No effect.
        //The first active village tile in front of the ghost becomes haunted.
        case 2:
            hauntTile(socket, activePlayer.getPosition(), isCemeteryCall);
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

module.exports.throwCurseDice = (activePlayer, bank) => throwCurseDice(null, activePlayer, bank, false);

module.exports.throwCurseDiceCemetry = (socket, activePlayer, bank) => throwCurseDice(socket, activePlayer, bank, true);