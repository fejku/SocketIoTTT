$(function () {
    var socket = io();

    //save user id in localStorage, prevent changing id after refresh
    let storage = sessionStorage;

    socket.on('connect', () => {
        let userId = storage.getItem('userId');
        if (userId === null)
            window.location.href = '/';
        else 
            socket.emit('userId', userId);
    });
});