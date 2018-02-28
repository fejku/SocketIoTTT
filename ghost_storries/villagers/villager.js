class Villager {
    constructor() {
        this.haunted = false;
    }   

    getHaunted() {
        return this.haunted;
    }

    setHaunted(haunted) {
        this.haunted = haunted;
    }
}

module.exports = Villager;