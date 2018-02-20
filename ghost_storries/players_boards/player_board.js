class PlayerBoard {
    constructor() {
        this.color;
        this.fields = [null, null, null];
    }

    isBoardFull() {
        for(let card of this.fields)
            if(card === null)
                return false;
        return true;
    }

    getEmptyFields() {
        let result =  {color: this.color.key, fields: []};
        for(let i = 0; i < this.fields.length; i++)
            if(this.fields[i] === null)
                result.fields.push(i);
        return result;
    }
}

module.exports = PlayerBoard;