$(function () {
    var socket = io();

    //save user id in localStorage, prevent changing id after refresh
    let storage = sessionStorage;

    socket.on('connect', () => {
        let userId = storage.getItem('userId');
        socket.emit('userId', userId);
    });

    socket.on('userId', function(userId) {
        storage.setItem('userId', userId);
    });

    $('#f1').submit(function () {
        let userName = $('#name').val();
        let userId = storage.getItem('userId');
        let user = {
            id: userId,
            name: userName
        };
        socket.emit('userName', user);
        window.location.href = '/waiting_room';
        return false;
    });
});