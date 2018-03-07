$(() => {
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

  socket.emit('ghost start');

  socket.on('ghost init board', (playersBoards, villagers, bank) => {
    console.log('ghost players board', playersBoards);
    for (let i = 0; i < playersBoards.length; i++) {
      for (let j = 0; j < 3; j++) {
        const fieldValue = JSON.stringify({
          color: playersBoards[i].color,
          field: j,
        });
        $(`.player${i}.field${j}`).val(fieldValue);
      }
    }
    console.log(villagers);
    for (let i = 0; i < villagers.length; i++) {
      $('.villager')
        .filter((index, e) => Number(e.value) === i)
        .val(JSON.stringify({ id: i, name: villagers[i].name }))
        .text(villagers[i].name);
    }
    // Set Circle of prayer additional div with tao token color
    $('.villager').filter((index, e) => JSON.parse(e.value).name === 'Circle of prayer').append('<div id="circle-tao-token"></div>');

    // Set board colors
    $('button[class*="player"]').each((i, e) => $(e).css('background-color', JSON.parse(e.value).color));

    updateBank(bank);
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

  socket.on('ghost herbalist shop pick token', (availableTaoTokens, fn) => {
    console.log('ghost herbalist shop pick token', availableTaoTokens);
    for (const color of availableTaoTokens) {
      $('#decisions')
        .append(`<button class="herbalist-shop-pick-color-white-dice" value="${color}">${color}</button>`)
        .on('click', '.herbalist-shop-pick-color-white-dice', (e) => {
          $('.herbalist-shop-pick-color-white-dice').remove();
          console.log('ghost herbalist shop pick token picked color: ', e.currentTarget.value);
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
});
