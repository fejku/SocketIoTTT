document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // Bank
  function updateBank(bank) {
    // Qi tokens
    document.getElementById('bank-qi-tokens').innerText = bank.qiTokens;
    // Jin jang tokens
    for (const jinJangColor in bank.jinJangTokens) {
      if ({}.hasOwnProperty.call(bank.jinJangTokens, jinJangColor)) {
        document.getElementById(`bank-${jinJangColor.toLowerCase()}-jin-jang-token`).innerText = bank.jinJangTokens[jinJangColor];
      }
    }
    // Tao tokens
    for (const taoColor in bank.taoTokens) {
      if ({}.hasOwnProperty.call(bank.taoTokens, taoColor)) {
        document.getElementById(`bank-${taoColor.toLowerCase()}-tao-token`).innerText = bank.taoTokens[taoColor];
      }
    }
  }

  // Players stats
  function updatePlayersStats(players) {
    players.taoists.forEach((player, i) => {
      // Color
      const color = document.getElementById(`player${i}-stats-color`);
      color.innerText = player.color;

      // Qi tokens
      const qiTokens = document.getElementById(`player${i}-stats-qi-tokens`);
      qiTokens.innerText = player.qiTokens;

      // Tao tokens
      Object.entries(player.taoTokens).forEach(([taoColor, taoAmount]) => {
        const statsTaoToken = document.getElementById(`player${i}-stats-${taoColor.toLowerCase()}-tao-token`);
        statsTaoToken.innerText = taoAmount;
      });

      // JinJang tokens
      const jinJangToken = document.getElementById(`player${i}-stats-jin-jang-token`);
      jinJangToken.innerText = player.jinJangToken;

      // Buddha figures
      const buddhaPigures = document.getElementById(`player${i}-stats-buddha-figures`);
      buddhaPigures.innerText = player.buddhaFigures.length;
    });

    // Remove border from all players stats and add into actual player
    const playersStats = document.getElementsByClassName('player-stats');
    [...playersStats].forEach((playerStats) => {
      playerStats.classList.remove('border');
    });
    const actualPlayer = document.getElementById(`player${players.actualPlayer}-stats`);
    actualPlayer.classList.add('border');
  }

  function updatePlayers(players) {
    // Remove all players from board
    [...document.querySelectorAll('.player')].forEach((player) => { player.remove(); });
    // Set players
    players.taoists.forEach((player) => {
      // If player is alive
      if (player.qiTokens > 0) {
        // Append player token
        document.querySelector(`.villager[data-villager-index="${player.position}"] .players`)
          .innerHTML += `<div class="player" data-player-color="${player.color}"></div>`;
        // Fill player token with player color
        const addedPlayer = document.querySelector(`.player[data-player-color="${player.color}"]`);
        addedPlayer.style.background = player.color;
      }
    });
  }

  socket.emit('ghost start');

  socket.on('ghost init board', (playersBoards, villagers, players, bank) => {
    console.log('ghost players board', playersBoards);
    [...document.getElementsByClassName('player-board')].forEach((field) => {
      // Set player board value
      field.dataset.boardColor = playersBoards[field.dataset.boardIndex].color;
      // Set board colors
      field.style.backgroundColor = field.dataset.boardColor;
    });

    console.log('villagers: ', villagers);
    // Set villagers value and text
    const villagersTiles = [...document.querySelectorAll('.villager')];
    villagersTiles.forEach((villager) => {
      villager.dataset.name = villagers[villager.dataset.villagerIndex].name;
      // https://stackoverflow.com/questions/35213147/difference-between-text-content-vs-inner-text
      villager.querySelector('.name').textContent = villagers[villager.dataset.villagerIndex].name;
    });

    // Set Circle of prayer additional div with tao token color
    villagersTiles
      .find(villager => villager.dataset.name === 'Circle of prayer')
      .innerHTML += '<div id="circle-tao-token"></div>';

    // Set Buddhist Temple additional div with figures amount
    const buddhistTemple = villagers.find(villager => villager.name === 'Buddhist Temple').buddhaFigure;
    villagersTiles
      .find(villager => villager.dataset.name === 'Buddhist Temple')
      .innerHTML += `<div id="buddha-figures-amount">${buddhistTemple}</div>`;

    updateBank(bank);
    updatePlayersStats(players);
    updatePlayers(players);
  });

  socket.on('ghost update bank', (bank) => {
    updateBank(bank);
  });

  socket.on('ghost update players stats', (players) => {
    updatePlayersStats(players);
  });

  socket.on('ghost pick player board field', (availableFields, fn) => {
    console.log('ghost pick player board field availableFields', availableFields);
    availableFields.forEach((availableField) => {
      let fieldElement;
      if (availableField.playerBoardIndex !== undefined) {
        // Get field by board index
        fieldElement = document.querySelector(`.player-board[data-board-index="${availableField.playerBoardIndex}"]`
          + `[data-field-index="${availableField.fieldIndex}"]`);
      } else {
        // Get field by board color
        fieldElement = document.querySelector(`.player-board[data-board-color="${availableField.playerBoardColor}"]`
          + `[data-field-index="${availableField.fieldIndex}"]`);
      }
      fieldElement.classList.add('active');
      fieldElement.addEventListener('click', function pickPlayerBoardField(e) {
        const pickedField = {
          playerBoardIndex: Number(e.currentTarget.dataset.boardIndex),
          playerBoardColor: e.currentTarget.dataset.boardColor,
          fieldIndex: Number(e.currentTarget.dataset.fieldIndex),
        };
        [...document.getElementsByClassName('player-board')].forEach((removeAvailableField) => {
          removeAvailableField.classList.remove('active');
          removeAvailableField.removeEventListener('click', pickPlayerBoardField);
        });
        console.log('ghost pick player board field pickedField: ', pickedField);
        fn(pickedField);
      });
    });
  });

  /**
   * Picking player
   * @param {Taoist[]} availablePlayers
   * @param {function} fn Callback function
   * @returns {String} Player color
   */
  socket.on('ghost pick player', (availablePlayers, fn) => {
    console.log('ghost pick player availablePlayers', availablePlayers);
    availablePlayers.forEach((player) => {
      const playerToken = document.querySelector(`.player[data-player-color="${player.color}"]`);
      playerToken.classList.add('active');
      playerToken.addEventListener('click', function pickPlayer(e) {
        const pickPlayerColor = e.currentTarget.dataset.playerColor;
        [...document.getElementsByClassName('player')].forEach((removeAvailablePlayer) => {
          removeAvailablePlayer.classList.remove('active');
          removeAvailablePlayer.removeEventListener('click', pickPlayer);
        });
        console.log('ghost pick player pickPlayerColor: ', pickPlayerColor);
        fn(pickPlayerColor);
      });
    });
  });

  /**
   * Picking villager tile position
   * @param {number[]} availableVillagerTiles
   * @param {function} fn Callback function
   * @returns {number} Villager position
   */
  socket.on('ghost pick villager tile', (availableVillagerTiles, fn) => {
    console.log('ghost pick villager tile availableVillagerTiles', availableVillagerTiles);
    availableVillagerTiles.forEach(())
  });

  /**
   * Remove all ghost from player boards and place them all over again
   * @param {Array} playersBoards Array of players boards
   */
  socket.on('ghost refresh player boards', (playersBoards) => {
    console.log('ghost refresh player boards', playersBoards);
    // Remove all ghosts
    [...document.getElementsByClassName('ghost')].forEach((ghost) => {
      ghost.remove();
    });
    // Place ghosts
    playersBoards.forEach((playerBoard, playerBoardIndex) => {
      playerBoard.fields.forEach((field, fieldIndex) => {
        if (field !== null) {
          document.querySelector(`.player-board[data-board-index="${playerBoardIndex}"][data-field-index="${fieldIndex}"]`)
            .innerHTML = `<div class="ghost"><div>${field.name}</div><div>(${field.color}: ${field.resistance})</div></div>`;
        }
      });
    });
  });

  socket.on('ghost refresh players tokens', (players) => {
    console.log('ghost refresh players tokens', players);
    updatePlayers(players);
  });

  socket.on('ghost lay ghost card on picked field', (pickedField, card) => {
    console.log('ghost lay ghost card on picked field', pickedField.playerBoardIndex);
    [...document.getElementsByClassName('player-board')]
      .find(field => (Number(field.dataset.boardIndex) === pickedField.playerBoardIndex)
        && (Number(field.dataset.fieldIndex) === pickedField.fieldIndex))
      .innerHTML = `<div class="ghost"><div>${card.name}</div><div>(${card.color}: ${card.resistance})</div></div>`;
    // const ghostDiv = document.createElement('div');
    // ghostDiv.className = 'ghost';
    // const ghostName = document.createElement('div');
    // ghostName.innerText = card.name;
    // ghostDiv.appendChild(ghostName);
    // const ghostStats = document.createElement('div');
    // ghostStats.innerText = `(${card.color}: ${card.resistance})`;
    // ghostDiv.appendChild(ghostStats);
    // clickedField.appendChild(ghostDiv);
  });

  socket.on('ghost remove ghost from field', (color, fieldIndex) => {
    // TODO: refactor or remove and always use refresh function
    console.log('ghost remove ghost from field', color, fieldIndex);
    [...document.getElementsByClassName('player-board')]
      .filter(ghostField => (ghostField.dataset.boardColor === color)
        && (Number(ghostField.dataset.fieldIndex) === fieldIndex))
      .forEach((ghostField) => {
        while (ghostField.hasChildNodes()) {
          ghostField.removeChild(ghostField.lastChild);
        }
      });
  });

  socket.on('ghost circle of prayer update token color', (pickedColor) => {
    console.log('ghost circle of prayer update token color', pickedColor);
    document.getElementById('circle-tao-token').style.background = pickedColor;
  });

  socket.on('ghost sorcerer hut pick ghost', (availableGhosts, fn) => {
    console.log('ghost sorcerer hut pick ghost availableGhosts', availableGhosts);
    // { color: 'YELLOW', fields: [ 0, 1 ] }
    availableGhosts.forEach((ghost) => {
      [...document.getElementsByClassName('player-board')]
        .filter(field => (ghost.color === field.dataset.boardColor)
          && (ghost.fields.indexOf(Number(field.dataset.fieldIndex)) !== -1))
        .forEach((field) => {
          field.classList.add('active');
          field.addEventListener('click', function pickGhost(e) {
            const pickedField = e.currentTarget.dataset;
            [...document.getElementsByClassName('player-board')].forEach((removeField) => {
              removeField.classList.remove('active');
              removeField.removeEventListener('click', pickGhost);
            });
            const result = JSON.stringify({
              color: pickedField.boardColor,
              field: Number(pickedField.fieldIndex),
            });
            console.log('ghost sorcerer hut pick ghost pickedGhost: ', result);
            fn(result);
          });
        });
    });
  });

  socket.on('ghost sorcerer hut remove ghost from board', (pickedGhost) => {
    // TODO: Use refresh ghosts method??
    console.log('ghost sorcerer hut remove ghost from board', pickedGhost);
    const ghostField = document.querySelector(`.player-board[data-board-color="${pickedGhost.color}"]`
        + `[data-field-index="${pickedGhost.field}"] .ghost`);
    ghostField.remove();
  });

  socket.on('ghost update buddha figures', (buddhaFiguresAmount, playersBoards) => {
    // TODO: Remove all buddha figures and place all??? (prevent missing pigures after refreshing page)
    console.log('ghost update buddha figures', buddhaFiguresAmount, playersBoards);
    // Update buddha temple
    document.getElementById('buddha-figures-amount').innerHTML = buddhaFiguresAmount;
    // Remove non existing buddha figures from players boards
    [...document.querySelectorAll('.player-board .buddha')].forEach((playerBoardElement) => {
      if (playersBoards[playerBoardElement.parentNode.dataset.boardIndex]
        .buddhaFields[playerBoardElement.parentNode.dataset.fieldIndex] === false) {
        playerBoardElement.remove();
      }
    });
    // Place new buddha figures on players boards
    playersBoards.forEach((playerBoard, playerBoardIndex) => {
      playerBoard.buddhaFields.forEach((buddhaField, buddhaFieldIndex) => {
        if (buddhaField) {
          if (document.querySelector(`.player-board[data-board-index="${playerBoardIndex}"]` +
              `[data-field-index="${buddhaFieldIndex}"] .buddha`) === null) {
            document.querySelector(`.player-board[data-board-index="${playerBoardIndex}"]`
              + `[data-field-index="${buddhaFieldIndex}"]`).innerHTML += '<div class="buddha">*B*</div>';
          }
        }
      });
    });
  });

  socket.on('ghost question yes no', (mainQuestion, additionalText, fn) => {
    console.log('ghost question yes no');

    const decisions = document.getElementById('decisions');

    decisions.innerHTML = `<div>${mainQuestion}</div>`;

    if (additionalText !== null) {
      decisions.innerHTML += `<div>${additionalText}</div>`;
    }

    decisions.innerHTML += '<button class="question-yes-no" data-answer="true">Yes</button>';
    decisions.innerHTML += '<button class="question-yes-no" data-answer="false">No</button>';
    decisions.addEventListener('click', function decisionYesNo(e) {
      if (e.target.classList.contains('question-yes-no')) {
        const pickedDecision = e.target.dataset.answer;
        while (decisions.hasChildNodes()) {
          decisions.removeChild(decisions.lastChild);
        }
        decisions.removeEventListener('click', decisionYesNo);
        console.log('ghost question yes no picked value:', pickedDecision);
        fn(pickedDecision);
      }
    });
  });

  socket.on('ghost question', (mainQuestion, answersArray, additionalText, fn) => {
    console.log('ghost question: ', mainQuestion, answersArray);
    const decisions = document.getElementById('decisions');

    decisions.innerHTML = `<div>${mainQuestion}</div>`;

    if (additionalText !== null) {
      decisions.innerHTML += `<div>${additionalText}</div>`;
    }

    answersArray.forEach((answer) => {
      decisions.innerHTML += `<button class="question" data-answer-value="${answer}">${answer}</button>`;
    });

    decisions.addEventListener('click', function questionDecision(e) {
      if (e.target.classList.contains('question')) {
        const pickedDecision = e.target.dataset.answerValue;
        while (decisions.hasChildNodes()) {
          decisions.removeChild(decisions.lastChild);
        }
        decisions.removeEventListener('click', questionDecision);
        console.log('ghost question picked value: ', pickedDecision);
        fn(pickedDecision);
      }
    });
  });
});
