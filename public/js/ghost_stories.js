$(() => {
  const socket = io();

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
      $('.villager').filter((index, e) => Number(e.value) === i).text(villagers[i].name);
      // Set Circle of prayer additional div with tao token color
      if (villagers[i].name === 'Circle of prayer') {
        $('.villager').filter((index, e) => Number(e.value) === i).append('<div id="#circle-tao-token"></div>');
      }
    }

    // Set board colors
    $('button[class*="player"]').each((i, e) => $(e).css('background-color', JSON.parse(e.value).color));

    // Bank
    // Qi tokens
    $('#qi-tokens').append(bank.qiTokens);
    // Jin jang tokens
    for (const jinJangColor in bank.jinJangTokens) {
      if ({}.hasOwnProperty.call(bank.jinJangTokens, jinJangColor)) {
        $(`#${jinJangColor.toLowerCase()}-jin-jang-token`).append(bank.jinJangTokens[jinJangColor]);
      }
    }
    // Tao tokens
    for (const taoColor in bank.taoTokens) {
      if ({}.hasOwnProperty.call(bank.taoTokens, taoColor)) {
        $(`#${taoColor.toLowerCase()}-tao-token`).append(bank.taoTokens[taoColor]);
      }
    }
  });

  socket.on('ghost pick field', (emptyFields, card, fn) => {
    console.log('ghost pick field', emptyFields);
    for (const playerEmptyFields of emptyFields) {
      $('.field')
        .filter((i, e) => ((JSON.parse(e.value).color === playerEmptyFields.color)
          && (playerEmptyFields.fields.indexOf(JSON.parse(e.value).field) !== -1)))
        .css('color', 'red')
        .on('click', (e) => {
          // Remove all click handlers
          $('.field')
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
      .filter((i, e) => availableMoves.indexOf(Number(e.value)) !== -1)
      .css('color', 'green')
      .on('click', (e) => {
        // Remove all click handlers
        $('.villager')
          .off('click')
          .css('color', '');
        console.log(e.currentTarget.value);
        fn(Number(e.currentTarget.value));
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
        .append(`<button class="dead_player" value="${deadPlayer.color}">${deadPlayer.color}</button>`)
        .on('click', '.dead_player', (e) => {
          $('.dead_player').remove();
          console.log(e.currentTarget.value);
          fn(e.currentTarget.value);
        });
    }
  });

  socket.on('ghost circle of prayer pick color', (availableColors, fn) => {
    console.log('ghost circle of prayer pick color', availableColors);
    for (const color of availableColors) {
      $('#decisions')
        .append(`<button class="availableColors" value="${color}">${color}</button>`)
        .on('click', '.availableColors', (e) => {
          $('.availableColors').remove();
          $('#circle-tao-token').css('background', e.currentTarget.value);
          console.log(e.currentTarget.value);
          fn(e.currentTarget.value);
        });
    }
  });
});
