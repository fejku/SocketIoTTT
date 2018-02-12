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

    function setAllFieldDisabled() {
        $('.field').attr('disabled', true);
    };

    function findFieldById(id, fields) {
        for (let field of fields) {
            if (field.id === id) {
                return field.actual;
            }
        }
    }

    function setAllFields(fields) {
        $('.field').each(function (index) {
            if (findFieldById(index, fields) === 0) {
                $(this).css("background-color", "red");
            } else if (findFieldById(index, fields) === 1) {
                $(this).css("background-color", "green");
            } else {
                $(this).attr("disabled", false);
            }
        });
    };

    setAllFieldDisabled();

    $('#f1').submit(function () {
        $('#f1').hide();
        $('#board').css('display', 'flex');

        let userName = $('#name').val();
        let userId = storage.getItem('userId');
        let user = {
            id: userId,
            name: userName
        };
        socket.emit('userName', user);
        return false;
    });

    $('.field').on('click', function () {
        socket.emit('turn', $(this).val());
        return false;
    })

    socket.on('name', function () {
        $('#f1').css('visible', 'false');
    });

    socket.on('message', function (obj) {
        setAllFields(obj.board.fields);
        if (obj.status === 'turn') {
            $('#messages').append($('<li>').text('Moja tura'));
            $('.field').each(function () {
                if (findFieldById(parseInt($(this).val()), obj.board.fields) === 0) {
                    $(this).css("background-color", "red");
                }
                if (findFieldById(parseInt($(this).val()), obj.board.fields) === 1) {
                    $(this).css("background-color", "green");
                } else {
                    $(this).attr("disabled", false);
                }
            });
        } else if (obj.status === 'wait') {
            $('#messages').append($('<li>').text('Czekam'));
            setAllFieldDisabled();
        } else if (obj.status === 'winner') {
            $('#messages').append($('<li>').text('Wygrałeś'));
            setAllFieldDisabled();
        } else if (obj.status === 'loser') {
            $('#messages').append($('<li>').text('Przegrałeś'));
            setAllFieldDisabled();
        }
    });
});