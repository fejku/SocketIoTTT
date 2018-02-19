// let ColorEnum = require()
// let Thaoist = require('/ghost_storries/Thaoist').Thaoist;

// let thaoist = new Thaoist();

$(function () {
    var socket = io();

    socket.emit('ghost start');

    socket.on('ghost init board', (playersBoards) => {
        console.log('ghost players board', playersBoards);
        for(let i = 0; i < playersBoards.length; i++) {
            let test = JSON.stringify({color: playersBoards[i].color, field: i});
            $('.player' + (i + 1)).val(test);    
        }
        // for(let i = 0; i < playersBoards.length; i++)
        //     $('.field' + (i + 1)).append(' '+ i);
    });

    socket.on('ghost pick field', (emptyPlaces) => {
        console.log('ghost pick field', emptyPlaces);
        $('.field').each(() => {console.log($(this).val())});
        //$('.field').css('color', 'green').filter(() => {return JSON.parse(this.value).color === emptyPlaces.color}).css('color', 'red');
        // $('.field[value="' + emptyPlaces.color + '"]').on('click', () => {
        //     alert('1');
        //     // let test = $(this).val();
        //     // console.log('test', test);
        // });
    });
});