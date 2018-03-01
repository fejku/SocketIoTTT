'use strict'

function loseQi(players, bank) {
    players.getActualPlayer().loseQi();
    bank.updateMarkers(players.getTaoists());
}

function loseAllTaoTokens(players, bank) {
    players.getActualPlayer().loseAllTaoMarkers();
    bank.updateMarkers(players.getTaoists());
}

function getTilePositionToHaunt(ghostPosition, villagers, step = 0) {
    switch(ghostPosition.boardIndex) {
        case 0:
            const tilePosition = ghostPosition.fieldIndex + 3 * step;
            break;
        case 1:
            const tilePosition = 3 * ghostPosition.fieldIndex + 2 - step;
            break;
        case 2:
            const tilePosition = 6 + ghostPosition.fieldIndex - 3 * step;
            break;
        case 3:
            const tilePosition = 3 * ghostPosition.fieldIndex + step;
            break;      
    }
    if (villagers[tilePosition].isHaunted())
        getTilePositionToHaunt(ghostPosition, villagers, ++step)
    else
        return tilePosition;
}

function hauntTile(playerPosition, ghostPosition, villagers, isCemeteryCall) {
    if (isCemeteryCall) {
        villagers[playerPosition].setHaunted(true);
    } else {
        let tilePositionToHaunt = getTilePositionToHaunt(ghostPosition, villagers);
        villagers[tilePositionToHaunt].setHaunted(true);
    }
}

function throwCurseDice(players, ghostPosition, villagers, bank, isCemeteryCall) {
    let throwResult = 2;//Math.floor(Math.random() * 6);
    switch (throwResult) {
        //(0-1) No effect.
        //The first active village tile in front of the ghost becomes haunted.
        //Q : When I use the Cemetery, if “Haunt Tile” is rolled on the Curse Die, which tile becomes haunted?
        //A : The Cemetery itself.
        case 2:
            hauntTile(players.getActualPlayer().getPosition(), ghostPosition, villagers, isCemeteryCall);
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

module.exports.throwCurseDice = (ghostPosition, players, villagers, bank) => throwCurseDice(players, ghostPosition, villagers, bank, false);

module.exports.throwCurseDiceCemetry = (players, villagers, bank) => throwCurseDice(players, null, villagers, bank, true);