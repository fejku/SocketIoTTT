$(function () {
    var socket = io();

    //save user id in localStorage, prevent changing id after refresh
    let storage = sessionStorage;

    if (storage.getItem('userId') === null) {
        window.location.href = '/';
    }
});