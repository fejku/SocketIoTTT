// Validate if picked aswer was in answers array
function validatePickedAnswer(answersArray, pickedAnswer) {
  return answersArray.find(answer => answer === pickedAnswer) !== undefined;
}

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

module.exports.pickPlayerBoardField = async (socket, availableFields) =>
  new Promise((resolve, reject) => {
    console.log('ghost pick player board field availableFields: ', availableFields);
    socket.emit('ghost pick player board field', availableFields, (pickedField) => {
      console.log('ghost pick player board field pickedField: ', pickedField);
      if (validatePickedAnswer(availableFields, pickedField)) {
        resolve(pickedField);
      } else {
        reject();
      }
    });
  });
