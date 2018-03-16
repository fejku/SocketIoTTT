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

  socket.emit('ghost start');

  socket.on('ghost init board', (playersBoards, villagers, players, bank) => {
    console.log('ghost players board', playersBoards);
    // Set player board value
    [...document.getElementsByClassName('player-board')].forEach((playerBoard) => {
      playerBoard.dataset.boardColor = playersBoards[playerBoard.dataset.boardIndex].color;
    });

    console.log('villagers: ', villagers);
    // Set villagers value and text
    const villagersTiles = [...document.querySelectorAll('.villager')];
    villagersTiles.forEach((villager) => {
      villager.dataset.name = villagers[villager.dataset.villagerIndex].name;
      // https://stackoverflow.com/questions/35213147/difference-between-text-content-vs-inner-text
      villager.textContent = villagers[villager.dataset.villagerIndex].name;
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

    // Set board colors
    [...document.getElementsByClassName('player-board')]
      .forEach((field) => {
        field.style.backgroundColor = field.dataset.boardColor;
      });

    updateBank(bank);
    updatePlayersStats(players);
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
          playerBoardIndex: Number(e.target.dataset.boardIndex),
          playerBoardColor: e.target.dataset.boardColor,
          fieldIndex: Number(e.target.dataset.fieldIndex),
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

  socket.on('ghost player move', (availableMoves, fn) => {
    console.log('ghost player move', availableMoves);
    [...document.getElementsByClassName('villager')]
      .filter(villager => availableMoves.indexOf(Number(villager.dataset.villagerIndex)) !== -1)
      .forEach((villager) => {
        villager.classList.add('active');
        villager.addEventListener('click', function pickVillagerTile(e) {
          [...document.getElementsByClassName('villager')].forEach((villagerRemove) => {
            villagerRemove.classList.remove('active');
            villagerRemove.removeEventListener('click', pickVillagerTile);
          });
          console.log('ghost player move picked villager tile: ', e.currentTarget.dataset.villagerIndex);
          fn(Number(e.currentTarget.dataset.villagerIndex));
        });
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
    console.log('ghost sorcerer hut remove ghost from board', pickedGhost);
    const ghostField = document.querySelector(`.player-board[data-board-color="${pickedGhost.color}"]`
        + `[data-field-index="${pickedGhost.field}"] .ghost`);
    ghostField.remove();
  });

  socket.on('ghost update buddhist temple figures amount', (buddhaFiguresAmount) => {
    console.log('ghost update buddhist temple figures ');
    document.getElementById('buddha-figures-amount').innerHTML = buddhaFiguresAmount;
  });

  socket.on('ghost place buddha figure on field', (field) => {
    console.log('ghost place buddha figure on field', field);
    document.querySelector(`.player-board[data-board-index="${field.playerBoardIndex}"]`
      + `[data-field-index="${field.fieldIndex}"]`).innerHTML += '<div class="buddha">*B*</div>';
  });

  socket.on('ghost remove buddha figure from field', (field) => {
    console.log('ghost remove buddha figure from field', field);
    document.querySelector(`.player-board[data-board-index="${field.playerBoardIndex}"]`
      + `[data-field-index="${field.fieldIndex}"] .buddha`).remove();
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
