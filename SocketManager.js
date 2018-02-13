class SocketManager {
    constructor() {
        this.actualId = 0;
        this.users = [];
        this.actualRoomId = 0;
        this.rooms = [];
    }

    addUser(socketId) {
        this.users[this.actualId] = {
            socketId: socketId
        };
        return this.actualId++;
    }

    updateUser(userId, socketId) {
        if (this.users[userId] === undefined)
            this.users[this.actualId] = {
                socketId: socketId
            };
        else
            this.users[userId].socketId = socketId;
    }

    setUserName(userId, userName) {
        this.users[userId].name = userName;
    }

    getUsers() {
        return this.users;
    }

    getUserBySocketId(socketId) {
        for (let i = 0; i < this.users.length; i++)
            if (this.users[i].socketId === socketId)
                return i;
        return -1;
    }

    getSocketByUserId(userId) {
        return this.users[userId].socketId;
    }

    getRoomWithPlace() {
        for (let room of this.rooms) {
            if (room.usersId.length < 2)
                return room;
        }
        return null;
    }

    addUserToRoom(userId) {
        let room = this.getRoomWithPlace();
        if (room === null) {
            room = {
                id: this.actualRoomId,
                usersId: [userId]
            };
            this.rooms.push(room);
            this.actualRoomId++;
            return room;
        } else {
            room.usersId.push(userId);
            return room;
        }
    }

    isRoomFull(room) {
        if (room.usersId.length === 2)
            return true;
        return false;
    }
}

exports.SocketManager = SocketManager;