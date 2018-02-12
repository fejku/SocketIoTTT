class SocketManager {
    constructor() {
        this.actualId = 0;
        this.user = [];
    }

    addUser(socketId) {
        this.user[this.actualId] = {socketId: socketId};
        return this.actualId++;
    }

    updateUser(userId, socketId) {
        if (this.user[userId] === undefined)
            this.user[this.actualId] = {socketId: socketId};
        else 
            this.user[userId].socketId = socketId;
    }

    setUserName(userId, userName) {
        this.user[userId].name = userName;
    }
}

exports.SocketManager = SocketManager;