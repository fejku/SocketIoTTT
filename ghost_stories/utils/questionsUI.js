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
   */
module.exports.pickVillagerTile = async (socket, availableVillagerTiles) =>
  new Promise((resolve, reject) => {
    // console.log('ghost pick villager tile availableVillagerTiles: ', availableVillagerTiles);
    // socket.emit('ghost pick player', availablePlayers, (pickedPlayerColor) => {
    //   console.log('ghost pick player pickedPlayerColor: ', pickedPlayerColor);
    //   if (validatePickedPlayer(availablePlayers, pickedPlayerColor)) {
    //     const pickedPlayer = availablePlayers.find(player => player.color.key === pickedPlayerColor);
    //     resolve(pickedPlayer);
    //   } else {
    //     reject();
    //   }
    // });
  });
