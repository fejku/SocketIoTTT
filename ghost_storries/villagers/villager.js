class Villager {
    constructor() {
        this.haunted = false;
    }   

    isHaunted() {
        return this.haunted;
    }

    setHaunted(haunted) {
        this.haunted = haunted;
    }
}

module.exports = Villager;