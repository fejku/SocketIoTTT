module.exports.getAvailableMoves = position => {
    switch (position) {
        case 0:
            return [0, 1, 3, 4];
        case 1:
            return [0, 1, 2, 3, 4, 5];
        case 2:
            return [1, 2, 4, 5];
        case 3:
            return [0, 1, 3, 4, 6, 7];
        case 4:
            return [0, 1, 2, 3, 4, 5, 6, 7, 8];
        case 5:
            return [1, 2, 4, 5, 7, 8];
        case 6:
            return [3, 4, 6, 7];
        case 7:
            return [3, 4, 5, 6, 7, 8];
        case 8:
            return [4, 5, 7, 8];
    }
};

module.exports.pickMove = (socket, availableMoves) => {
    return new Promise((resolve, reject) => {
        socket.emit('ghost player move', availableMoves, pickedMove => {
            //If picked move was on available moves array
            if (availableMoves.indexOf(pickedMove) !== -1)
                resolve(pickedMove);
            else
                reject();
        });
    });
};

function getGhostsForCoordinates(playersBoards, coordinates) {
    const ghostsInRange = [];

    for (let coordinate of coordinates)
        if (playersBoards[coordinate.playerBoardIndex].fields[coordinate.fieldIndex] !== null)
            ghostsInRange.push(coordinate);

    return ghostsInRange;
}

function getGhostsInRange(playersBoards, position) {
    switch (position) {
        case 0:
            return getGhostsForCoordinates(playersBoards, [{
                playerBoardIndex: 0,
                fieldIndex: 0
            }, {
                playerBoardIndex: 3,
                fieldIndex: 0
            }]);
        case 1:
            return getGhostsForCoordinates(playersBoards, [{
                playerBoardIndex: 0,
                fieldIndex: 1
            }]);
        case 2:
            return getGhostsForCoordinates(playersBoards, [{
                playerBoardIndex: 0,
                fieldIndex: 2
            }, {
                playerBoardIndex: 1,
                fieldIndex: 0
            }]);
        case 3:
            return getGhostsForCoordinates(playersBoards, [{
                playerBoardIndex: 3,
                fieldIndex: 1
            }]);
        case 4:
            return [];
        case 5:
            return getGhostsForCoordinates(playersBoards, [{
                playerBoardIndex: 1,
                fieldIndex: 1
            }]);
        case 6:
            return getGhostsForCoordinates(playersBoards, [{
                playerBoardIndex: 3,
                fieldIndex: 2
            }, {
                playerBoardIndex: 2,
                fieldIndex: 0
            }]);
        case 7:
            return getGhostsForCoordinates(playersBoards, [{
                playerBoardIndex: 2,
                fieldIndex: 1
            }]);
        case 8:
            return getGhostsForCoordinates(playersBoards, [{
                playerBoardIndex: 1,
                fieldIndex: 2
            }, {
                playerBoardIndex: 2,
                fieldIndex: 2
            }]);
    }
}

module.exports.getGhostsInRange = getGhostsInRange;

module.exports.isGhostInRange = (playersBoards, position) => getGhostsInRange(playersBoards, position).length > 0;