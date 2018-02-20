$(function () {
    var socket = io();

    socket.emit('ghost start');

    socket.on('ghost init board', (playersBoards) => {
        console.log('ghost players board', playersBoards);
        for(let i = 0; i < playersBoards.length; i++) {
            for(let j = 0; j < 3; j++) {
                let fieldValue = JSON.stringify({color: playersBoards[i].color, field: j});
                $('.player' + i + '.field' + j).val(fieldValue);
            }
        }
    });

    socket.on('ghost pick field', (emptyFields, fn) => {
        console.log('ghost pick field', emptyFields);
        for(let playerEmptyFields of emptyFields)
            $('.field')
                .filter((i,e) => JSON.parse(e.value).color === playerEmptyFields.color)
                .css('color', 'white')
                .on('click', (e) => {
                    console.log(e.currentTarget.value)
                    fn(JSON.parse(e.currentTarget.value))
                })
    });
});