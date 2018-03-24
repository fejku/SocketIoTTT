class PlayerBoard {
  constructor() {
    this.color = null;
    this.fields = [null, null, null];
    this.buddhaFields = [false, false, false];
  }

  isBoardFull() {
    return this.fields.every(field => field !== null);
  }

  isAnyGhostOnBoard(skipWuFeng = false) {
    if (skipWuFeng) {
      return this.fields.some(field => (field !== null) && (!field.isWuFeng()));
    }
    return this.fields.some(field => field !== null);
  }

  getEmptyFields() {
    return this.fields
      .map((field, fieldIndex) => ({ playerBoardColor: this.color.key, fieldIndex, ghost: field }))
      .filter(field => field.ghost === null);
  }


  getOccupiedFields(skipWuFeng = false) {
    const result = { color: this.color.key, fields: [] };
    for (let i = 0; i < this.fields.length; i++) {
      if (skipWuFeng) {
        if ((this.fields[i] !== null) && (!this.fields[i].isWuFeng())) {
          result.fields.push(i);
        }
      } else if (this.fields[i] !== null) {
        result.fields.push(i);
      }
    }
    return result;
  }

  getGhosts(skipWuFeng = false) {
    const result = [];
    for (let i = 0; i < this.fields.length; i++) {
      if (skipWuFeng) {
        if ((this.fields[i] !== null) && (!this.fields[i].isWuFeng())) {
          result.push(i);
        }
      } else if (this.fields[i] !== null) {
        result.push(i);
      }
    }
    return result;
  }

  getColor() {
    return this.color;
  }

  getFields() {
    return this.fields;
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

  isBuddhaOnField(fieldIndex) {
    return this.buddhaFields[fieldIndex];
  }

  setBuddhaField(fieldIndex, state) {
    this.buddhaFields[fieldIndex] = state;
  }
}

module.exports = PlayerBoard;
