class PlayerBoard {
    constructor() {
        this.color;
        this.cards = [null, null, null];
    }

    isBoardFull() {
        for(let card of this.cards)
            if(card === null)
                return false;
        return true;
    }

    getEmptyPlaces() {
        let result =  {color: this.color.key, places: []};
        for(let i = 0; i < this.cards.length; i++)
            if(this.cards[i] === null)
                result.places.push(i);
        return result;
    }
}

module.exports = PlayerBoard;