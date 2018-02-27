$(function () {
    var socket = io();

    socket.emit('ghost start');

    socket.on('ghost init board', (playersBoards, villagers) => {
        console.log('ghost players board', playersBoards);
        for (let i = 0; i < playersBoards.length; i++) {
            for (let j = 0; j < 3; j++) {
                let fieldValue = JSON.stringify({
                    color: playersBoards[i].color,
                    field: j
                });
                $('.player' + i + '.field' + j).val(fieldValue);
            };
        };
        console.log(villagers);
        for (let i = 0; i < villagers.length; i++) {
            $('.villager').filter((index, e) => e.value == i).text(villagers[i].name);
        }
        init();
    });

    socket.on('ghost pick field', (emptyFields, fn) => {
        console.log('ghost pick field', emptyFields);
        for (let playerEmptyFields of emptyFields)
            $('.field')
            .filter((i, e) => ((JSON.parse(e.value).color === playerEmptyFields.color) &&
                (playerEmptyFields.fields.indexOf(JSON.parse(e.value).field) !== -1)))
            .css('color', 'red') //test
            .on('click', e => {
                //Remove all click handlers
                $('.field')
                    .off('click')
                    .css('color', 'black'); //test
                console.log(e.currentTarget.value);
                fn(JSON.parse(e.currentTarget.value));
            });
    });

    socket.on('ghost player move', (availableMoves, fn) => {
        console.log('ghost player move', availableMoves);
        $('.villager')
            .filter((i, e) => availableMoves.indexOf(parseInt(e.value)) !== -1)
            .css('color', 'green')
            .on('click', e => {
                //Remove all click handlers
                $('.villager')
                    .off('click')
                    .css('color', 'black'); //test
                console.log(e.currentTarget.value);
                fn(parseInt(e.currentTarget.value));
            });

    });

    socket.on('ghost player decision', (availableDecisions, fn) => {
        console.log('ghost player decision', availableDecisions);
        $('.decision')
            .filter((i, e) => availableDecisions.indexOf(e.value) !== -1)
            .show()
            .on('click', e => {
                //Remove all click handlers
                $('.decision')
                    .off('click')
                    .hide(); //test
                console.log(e.currentTarget.value);
                fn(e.currentTarget.value);
            });
    });

    socket.on('ghost pick tile to haunt', (availableTilesToHaunt, fn) => {
        console.log('ghost pick tile to haunt', availableTilesToHaunt);
        $('.villager')
            .filter((i, e) => availableTilesToHaunt.indexOf(e.value) !== -1)
            .css('color', 'red')
            .on('click', e => {
                //Remove all click handlers
                $('.villager')
                    .off()
                    .css('color', 'black');
                console.log(e.currentTarget.value);
                fn(e.currentTarget.value);
            });
    });

    socket.on('ghost pick player to review', (deadPlayers, fn) => {
        for (let deadPlayer of deadPlayers)
            console.log(deadPlayer);
            $('#decisions')
            .append('<button class="dead_player" value="' + deadPlayer.color + '">' + deadPlayer.color + "</button>")
            .on('click', '.dead_player', e => {
                $('.dead_player').remove();
                console.log(e.currentTarget.value);
                fn(e.currentTarget.value);
            });
    });

    function init() {
        $('button[class*="player"]').each((i, e) => $(e).css('background-color', JSON.parse(e.value).color));
        // $('')
    }
});