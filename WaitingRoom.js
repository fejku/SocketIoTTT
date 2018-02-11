class WaitingRoom {
    constructor() {
        this.actualRoomId = 0;
        this.rooms = [];
    }

    getRoomWithPlace() {
        for (let room of this.rooms) {
            if (room.usersId.length < 2)
                return room;
        }
        return null;
    }

    //is it necessary? can the user be in more then one room at a time?
    isUserInRoom() {

    }

    addUserToRoom(userId) {
        let room = this.getRoomWithPlace();
        if (room === null) {
            room = {id: this.actualRoomId, usersId: [userId]};
            this.rooms.push(room);
            this.actualRoomId++;
            return room;
        } else {
            room.usersId.push(userId);
            return room;
        }
    }
}

exports.WaitingRoom = WaitingRoom;