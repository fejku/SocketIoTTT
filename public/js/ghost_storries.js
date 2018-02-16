// let ColorEnum = require()
// let Thaoist = require('/ghost_storries/Thaoist').Thaoist;

// let thaoist = new Thaoist();

$(function () {
    var socket = io();

    console.log('t1');

    socket.on('test', (test) => {
        // let userId = storage.getItem('userId');
        // if (userId === null)
        //     window.location.href = '/';
        // else 
        //     socket.emit('userId', userId);
        // socket.emit('kik start');    
        console.log('test');
        console.log(test);
    });
});