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
        socket.emit('kik start');            
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

    $('.field').on('click', function () {
        socket.emit('turn', $(this).val());
        return false;
    })

    socket.on('connect', function() {
        console.log('test' + socket.id);

    });

    socket.on('waiting for player', function() {
        $('#status').append($('<li>').text('Waiting for player...'));
    });

    socket.on('message', function (obj) {
        setAllFields(obj.board.fields);
        if (obj.status === 'turn') {
            $('#status').append($('<li>').text('Moja tura'));
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
            $('#status').append($('<li>').text('Czekam'));
            setAllFieldDisabled();
        } else if (obj.status === 'winner') {
            $('#status').append($('<li>').text('Wygrałeś'));
            setAllFieldDisabled();
        } else if (obj.status === 'loser') {
            $('#status').append($('<li>').text('Przegrałeś'));
            setAllFieldDisabled();
        }
    });
});