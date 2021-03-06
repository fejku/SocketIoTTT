module.exports.refreshPlayersBoards = (socket, playersBoards) => {
  socket.emit('ghost refresh players boards', playersBoards);
};

module.exports.refreshVillagers = (socket, villagers) => {
  socket.emit('ghost refresh villagers', villagers);
};

module.exports.refreshPlayersTokens = (socket, players) => {
  socket.emit('ghost refresh players tokens', players);
};

module.exports.refreshBuddhaFigures = (socket, buddhaFiguresAmount, playersBoards) => {
  socket.emit('ghost refresh buddha figures', buddhaFiguresAmount, playersBoards);
};

module.exports.refreshBank = (socket, bank) => {
  socket.emit('ghost refresh bank', bank);
};

module.exports.refreshPlayersStats = (socket, players) => {
  socket.emit('ghost refresh players stats', players);
};
