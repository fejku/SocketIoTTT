class Ghost {
    constructor(name, color, resistance) {
        this.name;
        this.color;
        this.resistance;
        //- zdolności na lewym kamieniu należy stosować gdy duch wchodzi do rozgrywki
        //- zdolności na środkowym kamieniu należy stosować w każdej turze (w fazie Jin)
        //- zdolności na prawym kamieniu należy stosować po wyegzorcyzmowaniu ducha (patrz Klątwa i Nagroda).
        //Jeżeli duch ma kilka zdolności, stosuje się je od lewej do prawej.
        this.ability;
        this.reward;
    }
}

module.exports = Ghost;