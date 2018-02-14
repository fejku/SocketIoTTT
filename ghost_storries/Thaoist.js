let Colors = require('./enums/color-enum');

class Thaoist {
    constructor(color) {
        this.color = color;
        this.chi_markers = this._initChiMarkers;       
    }
    
    _initChiMarkers() {
        let chi_markers = {};
        for (let colorItem of Colors.enums) {
            if (colorItem.key == this.color.key)
                chi_markers[colorItem.key] = 4;
            else
                chi_markers[colorItem.key] = 0;
        }
        return chi_markers;
    }


}

exports.Thaoist = Thaoist;