"use strict"

function loseQi(players, bank) {
    players.getActualPlayer().loseQi();
    bank.updateMarkers(players.getTaoists());
}

function loseAllTaoTokens(players, bank) {
    players.getActualPlayer().loseAllTaoMarkers();
    bank.updateMarkers(players.getTaoists());
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

function validatePickedTile(availableTilesToHaunt, pickedTile) {
    return availableTilesToHaunt.indexOf(pickedTile) !== -1;
}

function pickTileToHaunt(socket, availableTilesToHaunt) {
    return new Promise((resolve, reject) => {
        socket.emit('ghost pick tile to haunt', availableTilesToHaunt, pickedTile => {
            if (validatePickedTile(availableTilesToHaunt, pickedTile))
                resolve(pickedTile);
            else
                reject();
        });
    });
}

async function hauntTile(socket, position, isCemeteryCall) {
    if (isCemeteryCall) {
        let availableTilesToHaunt = getAvailableTilesToHaunt(position);
        let pickedTile = await pickTileToHaunt(socket, availableTilesToHaunt);
        console.log('pickedTile: ', pickedTile);
    } else {

    }
}

function throwCurseDice(socket, players, bank, isCemeteryCall) {
    let throwResult = 2;//Math.floor(Math.random() * 6);
    switch (throwResult) {
        //(0-1) No effect.
        //The first active village tile in front of the ghost becomes haunted.
        case 2:
            hauntTile(socket, players.getActualPlayer().getPosition(), isCemeteryCall);
            break;
            //The player must bring a ghost into play according to the placement rules.
        case 3:

            break;
            //The player must discard all his Tao tokens.            
        case 4:
            loseAllTaoTokens(players, bank)
            break;
            //The Taoist loses one Qi token.            
        case 5:
            loseQi(players, bank)
            break;
    }
}

module.exports.throwCurseDice = (players, bank) => throwCurseDice(null, players, bank, false);

module.exports.throwCurseDiceCemetry = (socket, players, bank) => throwCurseDice(socket, players, bank, true);