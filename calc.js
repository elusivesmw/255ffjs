
// dom elements
const modeRadios = document.getElementsByName("mode");
const signedDecTextbox = document.getElementById("signedDecTextbox");
const unsignedDecTextbox = document.getElementById("unsignedDecTextbox");
const hexTextbox = document.getElementById("hexTextbox");

// enum
const MODE = {
    _8bit: 0xFF,
    _16bit: 0xFFFF
}

// consts
const HEX = 16;

// value
class Calc {
    constructor() {
        this.value = 0;
        this.mode = MODE._8bit;
    }

    setMode (newValue) {
        // truncate extra bits when switching to a lower bit mode
        this.value &= newValue;
        this.mode = newValue;
    }

    setFromUnsignedDec (newValue) {
        this.value = this.mode & newValue;
    }

    setFromSignedDec (newValue) {
        this.value = this.mode & newValue;
    }

    setFromHex (newValue) {
        this.value = parseInt(newValue, HEX);
    }

    
    get unsignedDec() {
        return this.value;
    }

    get signedDec() {
        if (this.value > (math.floor(this.mode / 2))) {
            return this.value - (this.mode + 1);
        }
        return this.value;
    }
    
    get hex() {
        return this.value.toString(HEX);
    }
}

var val = 0;
var form = {};
var calc = new Calc();


Object.defineProperty(form, "mode", {
    get() {
        for (const radio of modeRadios) {
            if (radio.checked) {
                return radio.value;
            }
        } 
    },
    set(newValue) {
        for (const radio of modeRadios) {
            radio.checked = (radio.value == newValue);
        }
    }
});


Object.defineProperty(form, "unsignedDec", {
    get() {
         return unsignedDecTextbox.value;
    },
    set(newValue) {
        unsignedDecTextbox.value = newValue;
    }
});


Object.defineProperty(form, "hex", {
    get() {
         return hexTextbox.value;
    },
    set(newValue) {
        calc.setFromHex(newValue);
        hexTextbox.value = newValue; 
    }
});


// add listeners
for (const radio of modeRadios) {
    radio.addEventListener("change", modeChanged);
}

// events
function modeChanged(event) {
    console.log("mode changed")

    var selected = event.target;
    for (const radio of modeRadios) {
        radio.checked = (radio.id == selected.id);
    }
    calc.mode = selected.value;
}





// Object.defineProperty(calc, "unsignedDecimal", {
//     get() {      
//         return calc._value;
//     }
// });

// Object.defineProperty(calc, "hex", {
//     get() {
//         return calc._value.toString(16);
//     }
// });

 
// calc.


form.mode = 0xFF;