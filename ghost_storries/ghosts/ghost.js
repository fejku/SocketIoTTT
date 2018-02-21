class Ghost {
    constructor(name, color, resistance) {
        this.name = name;
        this.color = color;
        this.resistance = resistance;

        this.taoDiceHaveEffect = true;
    }

    immediateEffect() {
        //
        console.log("immediateEffect abstract");
    }

    yinPhaseEffect() {
       //
       console.log("yinPhaseEffect abstract")
    }

    afterWinningEffect() {
        //
    }

    //Effects
    haunter() {

    }

    taoDiceHaveNoEffect() {
        this.taoDiceHaveEffect = false;
    }
}

module.exports = Ghost;