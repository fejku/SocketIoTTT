// Validate if picked aswer was in answers array
function validatePickedAnswer(answersArray, pickedAnswer) {
  return answersArray.find(answer => answer === pickedAnswer) !== undefined;
}

function validatePickedBoardField(availableFields, pickedField) {
  return availableFields
    .find(field => ((field.playerBoardIndex === pickedField.playerBoardIndex)
      || (field.playerBoardColor === pickedField.playerBoardColor))
      && (field.fieldIndex === pickedField.fieldIndex)) !== undefined;
}

function validatePickedPlayer(availablePlayers, pickedPlayerColor) {
  return availablePlayers.find(player => player.color.key === pickedPlayerColor) !== undefined;
}

function validatePickedVillagerTile(availableVillagerTiles, pickedVillagerTilePosition) {
  return availableVillagerTiles.includes(pickedVillagerTilePosition);
}

function validatePickedPlayerBoard(availablePlayerBoardIndexes, pickedPlayerBoardIndex) {
  return availablePlayerBoardIndexes.includes(pickedPlayerBoardIndex);
}

/**
 *
 * @param {Socket} socket
 * @param {string} [mainQuestion]
 * @param {string} [additionalText]
 */
module.exports.askYesNo = async (socket, mainQuestion = '', additionalText = null) =>
  new Promise((resolve, reject) => {
    socket.emit('ghost question yes no', mainQuestion, additionalText, (pickedAnswer) => {
      if (pickedAnswer !== undefined) {
        resolve(pickedAnswer === 'true');
      } else {
        reject();
      }
    });
  });

/**
 *
 * @param {Socket} socket
 * @param {string} mainQuestion
 * @param {string[]} answersArray
 * @param {string} [additionalText]
 */
module.exports.ask = async (socket, mainQuestion, answersArray, additionalText = null) =>
  new Promise((resolve, reject) => {
    socket.emit('ghost question', mainQuestion, answersArray, additionalText, (pickedAnswer) => {
      if (validatePickedAnswer(answersArray, pickedAnswer)) {
        resolve(pickedAnswer);
      } else {
        reject();
      }
    });
  });

/**
 * Returns picked field
 *
 * @param {Socket} socket
 * @param {Object[]} availableFields
 * @param {number} availableFields.fieldIndex
 * @param {string} [availableFields.playerBoardIndex]
 * @param {number} [availableFields.playerBoardColor]
 * @returns {Object} {playerBoardIndex, playerBoardColor, fieldIndex}
 */
module.exports.pickPlayerBoardField = async (socket, availableFields) =>
  new Promise((resolve, reject) => {
    console.log('ghost pick player board field availableFields: ', availableFields);
    socket.emit('ghost pick player board field', availableFields, (pickedField) => {
      console.log('ghost pick player board field pickedField: ', pickedField);
      if (validatePickedBoardField(availableFields, pickedField)) {
        resolve(pickedField);
      } else {
        reject();
      }
    });
  });

/**
 *
 * @param {Socket} socket
 * @param {Taoist[]} availablePlayers
 * @returns {Taoist}
 */
module.exports.pickPlayer = async (socket, availablePlayers) =>
  new Promise((resolve, reject) => {
    console.log('ghost pick player availablePlayers: ', availablePlayers);
    socket.emit('ghost pick player', availablePlayers, (pickedPlayerColor) => {
      console.log('ghost pick player pickedPlayerColor: ', pickedPlayerColor);
      if (validatePickedPlayer(availablePlayers, pickedPlayerColor)) {
        const pickedPlayer = availablePlayers.find(player => player.color.key === pickedPlayerColor);
        resolve(pickedPlayer);
      } else {
        reject();
      }
    });
  });

/**
 *
 * @param {Socket} socket
 * @param {number[]} availableVillagerTiles
 * @returns {number} Picked villager tile position
 */
module.exports.pickVillagerTile = async (socket, availableVillagerTiles) =>
  new Promise((resolve, reject) => {
    console.log('ghost pick villager tile availableVillagerTiles: ', availableVillagerTiles);
    socket.emit('ghost pick villager tile', availableVillagerTiles, (pickedVillagerTilePosition) => {
      console.log('ghost pick villager tile pickedVillagerTilePosition: ', pickedVillagerTilePosition);
      if (validatePickedVillagerTile(availableVillagerTiles, pickedVillagerTilePosition)) {
        resolve(pickedVillagerTilePosition);
      } else {
        reject();
      }
    });
  });

/**
 *  Pickinkg player board
 *
 * @param {Socket} socket
 * @param {number[]} availablePlayerBoardIndexes Indexes of players boards
 * @returns {number} Picked player board index
 */
module.exports.pickPlayerBoard = async (socket, availablePlayerBoardIndexes) =>
  new Promise((resolve, reject) => {
    console.log('ghost pick player board availablePlayerBoardIndexes: ', availablePlayerBoardIndexes);
    socket.emit('ghost pick player board', availablePlayerBoardIndexes, (pickedPlayerBoardIndex) => {
      console.log('ghost pick player board pickedPlayerBoardIndex: ', pickedPlayerBoardIndex);
      if (validatePickedPlayerBoard(availablePlayerBoardIndexes, pickedPlayerBoardIndex)) {
        resolve(pickedPlayerBoardIndex);
      } else {
        reject();
      }
    });
  });

module.exports.pickTaoTokenColor = async (socket, bank) => {
  if (bank.isTaoTokenLeft()) {
    const availableColors = bank.getAvailableTaoTokensColors();
    const pickedColor = await this.ask(socket, 'Pick tao token color', availableColors);
    return pickedColor;
  }
  return null;
};

