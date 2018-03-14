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
    console.log(players);
    players.taoists.forEach((player, i) => {
      console.log(i);
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

  socket.on('ghost pick field', (emptyFields, card, fn) => {
    console.log('ghost pick field', emptyFields);

    emptyFields.forEach((emptyField) => {
      [...document.getElementsByClassName('player-board')]
        .filter(boardField => (boardField.dataset.boardColor === emptyField.color)
          && (emptyField.fields.indexOf(Number(boardField.dataset.fieldIndex)) !== -1))
        .forEach((boardField) => {
          boardField.classList.add('active');
          boardField.addEventListener('click', function pickGhostField(e) {
            // Remove all click handlers
            [...document.getElementsByClassName('player-board')].forEach((removeBoardField) => {
              removeBoardField.classList.remove('active');
              removeBoardField.removeEventListener('click', pickGhostField);
            });
            // Append ghost params to field
            const clickedField = e.target;
            clickedField.innerHTML = (`<div class="ghost"><div>${card.name}</div><div>(${card.color}: ${card.resistance})</div></div>`);
            // const ghostDiv = document.createElement('div');
            // ghostDiv.className = 'ghost';
            // const ghostName = document.createElement('div');
            // ghostName.innerText = card.name;
            // ghostDiv.appendChild(ghostName);
            // const ghostStats = document.createElement('div');
            // ghostStats.innerText = `(${card.color}: ${card.resistance})`;
            // ghostDiv.appendChild(ghostStats);
            // clickedField.appendChild(ghostDiv);
            const returnFieldValues = {
              color: clickedField.dataset.boardColor,
              field: Number(clickedField.dataset.fieldIndex),
            };
            console.log('ghost pick field picked field: ', returnFieldValues);
            fn(returnFieldValues);
          });
        });
    });
  });

  socket.on('ghost remove ghost from field', (color, fieldIndex) => {
    console.log('ghost remove ghost from field', color, fieldIndex);
    [...document.getElementsByClassName('player-board')]
      .filter(ghostField => (ghostField.dataset.boardColor === color)
        && (Number(ghostField.dataset.fieldIndex) === fieldIndex))
      .forEach((ghostField) => {
        while (ghostField.hasChildNodes) {
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
          console.log('ghost player move picked villager tile: ', e.target.dataset.villagerIndex);
          fn(Number(e.target.dataset.villagerIndex));
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
        .filter(field => ghost.color === field.dataset.boardColor
          && ghost.fields.indexOf(Number(field.dataset.fieldIndex)) !== -1)
        .forEach((field) => {
          field.classList.add('active');
          field.addEventListener('click', function pickGhost(e) {
            [...document.getElementsByClassName('player-board')].forEach((removeField) => {
              removeField.classList.remove('active');
              removeField.removeEventListener('click', pickGhost);
            });
            const result = { color: e.target.dataset.boardColor, field: field.dataset.fieldIndex };
            console.log('ghost sorcerer hut pick ghost pickedGhost: ', result);
            fn(result);
          });
        });
    });

    // for (const ghost of availableGhosts) {
    //   $('.board')
    //     .filter((index, field) => (JSON.parse(field.value).color === ghost.color)
    //       && (ghost.fields.indexOf(JSON.parse(field.value).field) !== -1))
    //     .css('color', 'white')
    //     .on('click', (e) => {
    //       $('.board').off().css('color', '');
    //       console.log('pickedGhost: ', e.currentTarget.value);
    //       fn(e.currentTarget.value);
    //     });
    // }
  });

  socket.on('ghost sorcerer hut remove ghost from board', (boardId, fieldId) => {
    console.log('ghost sorcerer hut remove ghost from board', boardId, fieldId);
    const ghostField = document.querySelector(`.board.player${boardId}.field${fieldId} .ghost`);
    ghostField.remove();
  });

  socket.on('ghost update buddhist temple figures', (buddhaFiguresAmount) => {
    console.log('ghost update buddhist temple figures');

    document.getElementById('buddha-figures-amount').innerHTML = buddhaFiguresAmount;
  });

  socket.on('ghost place buddha figure on field', (field) => {
    console.log('ghost place buddha figure on field');

    document.querySelector(`.player${field.playerBoardIndex}.field${field.fieldIndex}`).innerHTML += '*B*';
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
      const pickedDecision = e.target.dataset.answer;
      while (decisions.hasChildNodes()) {
        decisions.removeChild(decisions.lastChild);
      }
      decisions.removeEventListener('click', decisionYesNo);
      console.log('ghost question yes no picked value:', pickedDecision);
      fn(pickedDecision);
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
      const pickedDecision = e.target.dataset.answerValue;
      while (decisions.hasChildNodes()) {
        decisions.removeChild(decisions.lastChild);
      }
      decisions.removeEventListener('click', questionDecision);
      console.log('ghost question picked value: ', pickedDecision);
      fn(pickedDecision);
    });
  });
});
