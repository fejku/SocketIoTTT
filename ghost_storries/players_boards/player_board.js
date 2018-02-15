class PlayerBoard {
    constructor() {
        this.color;
        this.cards = [];
    }

    isBoardFull() {
        return this.cards.length == 3;
    }
}

module.exports = PlayerBoard;