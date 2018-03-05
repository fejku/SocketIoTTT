class PlayerBoard {
  constructor() {
    this.color = null;
    this.fields = [null, null, null];
  }

  isBoardFull() {
    for (const card of this.fields) {
      if (card === null) {
        return false;
      }
    }
    return true;
  }

  getEmptyFields() {
    const result = { color: this.color.key, fields: [] };
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i] === null) {
        result.fields.push(i);
      }
    }
    return result;
  }

  getColor() {
    return this.color;
  }

  getField(index) {
    return this.fields[index];
  }

  setField(index, value) {
    this.fields[index] = value;
  }

  removeGhostFromField(socket, fieldIndex) {
    // Send information to UI that ghost sohuld be removed from field
    this.removeGhostFromFieldUI(socket, fieldIndex);
    // Remove ghost from field
    this.setField(fieldIndex, null);
  }

  removeGhostFromFieldUI(socket, fieldIndex) {
    socket.emit('ghost remove ghost from field', this.getColor(), fieldIndex);
  }
}

module.exports = PlayerBoard;
