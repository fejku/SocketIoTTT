function Board() {
    this.fields = []; 
    fillBoard.call(this); 
}

function fillBoard() {
    for(let i = 0; i < 9; i++) { 
        this.fields.push({
            id: i,
            actual: -1
        });
    }
}

Board.prototype.findById = function(id) {
    for(let field of this.fields) {
        if (field.id = id) {
            return field.actual;
        }
    }
};

exports.Board = Board;