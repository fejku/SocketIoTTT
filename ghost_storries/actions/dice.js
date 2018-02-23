//Curse Die and apply the effect:
//(a) : No effect.
//(b) : The first active village tile in front of the ghost becomes haunted.
//(c) : The player must bring a ghost into play according to the placement rules.
//(d) : The player must discard all his Tao tokens.
//(e) : The Taoist loses one Qi token.
module.exports.throwCurseDice = () => {
    let throwResult = Math.floor(Math.random() * 6);
    switch (throwResult) {
        case 0:
        case 1:
            break;
        case 2: 
    }
}