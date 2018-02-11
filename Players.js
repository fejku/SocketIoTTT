function Players(playersList) {
    //rand active player
    this.activePlayer = 0;
    this.playersList = playersList;
};

Players.prototype.getActivePlayer = function() {
    return this.playersList[this.activePlayer];
};

Players.prototype.getUnactivePlayer = function() {
    if (this.activePlayer == 0)
        return this.playersList[1];
    else
        return this.playersList[0];
};

Players.prototype.changePlayer = function() {
    if (this.activePlayer == 0)
        this.activePlayer = 1;
    else
        this.activePlayer = 0;
}

exports.Players = Players;