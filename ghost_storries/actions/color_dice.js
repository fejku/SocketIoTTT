const SixColors = require('../enums/color').SixColors;

function throwDice() {
    const throwResult = Math.pow(2, Math.floor(Math.random() * 6));

    return SixColors.get(throwResult).key; 
}

module.exports.throwDices = function (diceNumber) {
    const throwResults = [];
    for (let i = 0; i < diceNumber; i++)
        throwResults.push(throwDice());

    result = {};
    for (const color of SixColors.enums) {
        result[color.key] = 0;
        for (const diceColor of throwResults)
            if (diceColor === color.key)
                result[color.key]++;
    }

    return result;
}