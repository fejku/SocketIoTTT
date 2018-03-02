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
        console.log("afterWinningEffect abstract")
        // throw new Error('afterWinningEffect is Abstract');
    }

    //Effects
    haunter() {

    }

    taoDiceHaveNoEffect() {
        this.taoDiceHaveEffect = false;
    }

    getColor() {
        return this.color.key;
    }

    getResistance() {
        return this.color;
    }
}

module.exports = Ghost;