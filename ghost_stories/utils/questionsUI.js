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

// Validate if picked aswer was in answers array
function validatePickedAnswer(answersArray, pickedAnswer) {
  return answersArray.find(answer => answer === pickedAnswer) !== undefined;
}

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
