document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // Bank
  function updateBank(bank) {
    // Qi tokens
    $('#qi-tokens').empty().append(bank.qiTokens);
    // Jin jang tokens
    for (const jinJangColor in bank.jinJangTokens) {
      if ({}.hasOwnProperty.call(bank.jinJangTokens, jinJangColor)) {
        $(`#${jinJangColor.toLowerCase()}-jin-jang-token`).empty().append(bank.jinJangTokens[jinJangColor]);
      }
    }
    // Tao tokens
    for (const taoColor in bank.taoTokens) {
      if ({}.hasOwnProperty.call(bank.taoTokens, taoColor)) {
        $(`#${taoColor.toLowerCase()}-tao-token`).empty().append(bank.taoTokens[taoColor]);
      }
    }
  }

  // Players stats
  function updatePlayersStats(players) {
    console.log(players);
    players.forEach((player, i) => {
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
  }

  socket.emit('ghost start');

  socket.on('ghost init board', (playersBoards, villagers, players, bank) => {
    console.log('ghost players board', playersBoards);
    // Set player board value
    for (let i = 0; i < playersBoards.length; i++) {
      for (let j = 0; j < 3; j++) {
        const fieldValue = JSON.stringify({
          color: playersBoards[i].color,
          field: j,
        });
        document.querySelector(`.player${i}.field${j}`).value = fieldValue;
      }
    }
    console.log('villagers: ', villagers);
    // Set villagers value and text
    const villagersTiles = Array.from(document.querySelectorAll('.villager'));
    for (let i = 0; i < villagers.length; i++) {
      villagersTiles
        .filter((index, e) => e === i)
        .forEach((villager) => {
          villager.value = JSON.stringify({ id: i, name: villagers[i].name });
          villager.textContent = villagers[i].name;
        });
    }

    // Set Circle of prayer additional div with tao token color
    villagersTiles
      .find(villager => JSON.parse(villager.value).name === 'Circle of prayer')
      .innerHTML += '<div id="circle-tao-token"></div>';

    // Set Buddhist Temple additional div with figures amount
    const buddhistTemple = villagers.find(villager => villager.name === 'Buddhist Temple').buddhaFigure;
    villagersTiles
      .find(villager => JSON.parse(villager.value).name === 'Buddhist Temple')
      .innerHTML += `<div id="buddha-figures-amount">${buddhistTemple}</div>`;

    // Set board colors
    Array.from(document.querySelectorAll('button[class*="player"]'))
      .forEach((field) => {
        field.style.backgroundColor = JSON.parse(field.value).color;
      });

    updateBank(bank);
    updatePlayersStats(players.taoists);
  });

  socket.on('ghost update bank', (bank) => {
    updateBank(bank);
  });

  socket.on('ghost pick field', (emptyFields, card, fn) => {
    console.log('ghost pick field', emptyFields);
    for (const playerEmptyFields of emptyFields) {
      $('.board')
        .filter((i, e) => ((JSON.parse(e.value).color === playerEmptyFields.color)
          && (playerEmptyFields.fields.indexOf(JSON.parse(e.value).field) !== -1)))
        .css('color', 'red')
        .on('click', (e) => {
          // Remove all click handlers
          $('.board')
            .off('click')
            .css('color', '');
          // Append ghost params to field
          $(e.currentTarget).append(` <div>${card.name}</div> <div>(${card.color}: ${card.resistance})</div>`);
          console.log(e.currentTarget.value);
          fn(JSON.parse(e.currentTarget.value));
        });
    }
  });

  socket.on('ghost remove ghost from field', (color, fieldIndex) => {
    console.log('ghost remove ghost from field', color, fieldIndex);
    $('.field')
      .filter((i, e) => ((JSON.parse(e.value).color === color)
        && (JSON.parse(e.value).field === fieldIndex)))
      .children('div')
      .remove();
  });

  socket.on('ghost player move', (availableMoves, fn) => {
    console.log('ghost player move', availableMoves);
    $('.villager')
      .filter((i, e) => availableMoves.indexOf(JSON.parse(e.value).id) !== -1)
      .css('color', 'green')
      .on('click', (e) => {
        // Remove all click handlers
        $('.villager')
          .off('click')
          .css('color', '');
        console.log(JSON.parse(e.currentTarget.value).id);
        fn(Number(JSON.parse(e.currentTarget.value).id));
      });
  });

  socket.on('ghost player decision', (availableDecisions, fn) => {
    console.log('ghost player decision', availableDecisions);
    $('.decision')
      .filter((i, e) => availableDecisions.indexOf(e.value) !== -1)
      .show()
      .on('click', (e) => {
        // Remove all click handlers
        $('.decision')
          .off('click')
          .hide();
        console.log(e.currentTarget.value);
        fn(e.currentTarget.value);
      });
  });

  socket.on('ghost pick tile to haunt', (availableTilesToHaunt, fn) => {
    console.log('ghost pick tile to haunt', availableTilesToHaunt);
    $('.villager')
      .filter((i, e) => availableTilesToHaunt.indexOf(Number(e.value)) !== -1)
      .css('color', 'red')
      .on('click', (e) => {
        // Remove all click handlers
        $('.villager')
          .off()
          .css('color', '');
        console.log(e.currentTarget.value);
        fn(Number(e.currentTarget.value));
      });
  });

  socket.on('ghost pick player to review', (deadPlayers, fn) => {
    console.log('ghost pick player to review', deadPlayers);
    for (const deadPlayer of deadPlayers) {
      console.log(deadPlayer);
      $('#decisions')
        .append(`<button class="dead-player" value="${deadPlayer.color}">${deadPlayer.color}</button>`)
        .on('click', '.dead-player', (e) => {
          $('.dead-player').remove();
          console.log(e.currentTarget.value);
          fn(e.currentTarget.value);
        });
    }
  });

  socket.on('ghost circle of prayer pick color', (availableColors, fn) => {
    console.log('ghost circle of prayer pick color', availableColors);
    for (const color of availableColors) {
      $('#decisions')
        .append(`<button class="available-colors" value="${color}">${color}</button>`)
        .on('click', '.available-colors', (e) => {
          $('.available-colors').remove();
          $('#circle-tao-token').css('background', e.currentTarget.value);
          console.log('ghost circle of prayer pick color picked color: ', e.currentTarget.value);
          fn(e.currentTarget.value);
        });
    }
  });

  socket.on('ghost taoist altar pick tile', (hauntedTiles, fn) => {
    console.log('ghost taoist altar pick tile', hauntedTiles);
    for (const tile of hauntedTiles) {
      $('#decisions')
        .append(`<button class="taoist-altar-pick-tile" value="${tile}">${tile}</button>`)
        .on('click', '.taoist-altar-pick-tile', (e) => {
          $('.taoist-altar-pick-tile').remove();
          console.log('ghost taoist altar pick tile picked value: ', e.currentTarget.value);
          fn(e.currentTarget.value);
        });
    }
  });

  socket.on('ghost villager pick tao token color', (availableTaoTokens, fn) => {
    console.log('ghost villager pick tao token color', availableTaoTokens);
    for (const color of availableTaoTokens) {
      $('#decisions')
        .append(`<button class="villager-pick-tao-token-color" value="${color}">${color}</button>`)
        .on('click', '.villager-pick-tao-token-color', (e) => {
          $('.villager-pick-tao-token-color').remove();
          console.log('villager-pick-tao-token-color picked color: ', e.currentTarget.value);
          fn(e.currentTarget.value);
        });
    }
  });

  socket.on('ghost sorcerer hut pick ghost', (availableGhosts, fn) => {
    console.log('ghost sorcerer hut pick ghost', availableGhosts);
    // { color: 'YELLOW', fields: [ 0, 1 ] }
    for (const ghost of availableGhosts) {
      $('.board')
        .filter((index, field) => (JSON.parse(field.value).color === ghost.color)
          && (ghost.fields.indexOf(JSON.parse(field.value).field) !== -1))
        .css('color', 'white')
        .on('click', (e) => {
          $('.board').off().css('color', '');
          console.log('pickedGhost: ', e.currentTarget.value);
          fn(e.currentTarget.value);
        });
    }
  });

  socket.on('ghost sorcerer hut remove ghost from board', () => {
    $('.board')
      .css('color', 'black');
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

    const decisions = $('#decisions');

    decisions.append(`<div>${mainQuestion}</div>`);

    if (additionalText !== null) {
      decisions.append(`<div>${additionalText}</div>`);
    }

    decisions
      .append('<button class="question-yes-no" value="true">Yes</button>')
      .append('<button class="question-yes-no" value="false">No</button>')
      .on('click', '.question-yes-no', (e) => {
        $('#decisions').empty();
        console.log('ghost question yes no picked value: ', e.currentTarget.value);
        fn(e.currentTarget.value);
      });
  });

  socket.on('ghost question', (mainQuestion, answersArray, additionalText, fn) => {
    console.log('ghost question');

    const decisions = $('#decisions');

    decisions.append(`<div>${mainQuestion}</div>`);

    if (additionalText !== null) {
      decisions.append(`<div>${additionalText}</div>`);
    }

    answersArray.forEach((answer) => {
      decisions.append(`<button class="question" value="${answer}">${answer}</button>`);
    });

    decisions
      .on('click', '.question', (e) => {
        $('#decisions').empty();
        console.log('ghost question picked value: ', e.currentTarget.value);
        fn(e.currentTarget.value);
      });
  });
});
