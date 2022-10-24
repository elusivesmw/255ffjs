
// dom elements
const inputs = document.getElementsByClassName("input");
const outputs = document.getElementsByClassName("output");

const modeRadios = document.getElementsByName("modeRadio");
const signedDecTextbox = document.getElementById("signedDecTextbox");
const unsignedDecTextbox = document.getElementById("unsignedDecTextbox");
const hexTextbox = document.getElementById("hexTextbox");

const valueSpan = document.getElementById("valueSpan");

// enum
const MODE = Object.freeze({
    _8bit: 0xFF,
    _16bit: 0xFFFF
});

// consts
const DEC = 10;
const HEX = 16;

// value
class Calc {
    constructor() {
        this.value = 0;
        this.mode = MODE._8bit;
    }

    setMode (newMode, callback) {
        // truncate extra bits when switching to a lower bit mode
        this.value &= newMode;
        this.mode = newMode;

        if (callback) callback(newMode);
    }

    setFromUnsignedDec (newValue, callback) {
        this.value = this.mode & newValue;
        
        if (callback) callback();
    }

    setFromSignedDec (newValue, callback) {
        this.value = this.mode & newValue;

        if (callback) callback();
    }

    setFromHex (newValue, callback) {
        this.value = parseInt(newValue, HEX);

        if (callback) callback();
    }

    
    get unsignedDec() {
        return this.value;
    }

    get signedDec() {
        if (this.value > Math.floor(this.mode / 2)) {
            let max = parseInt(this.mode) + 1;
            return this.value - max;
        }
        return this.value;
    }
    
    get hex() {
        return this.value.toString(HEX);
    }
}




// mode callback function
function updateMode(newMode) {
    for (const radio of modeRadios) {
        radio.checked = (radio.value == newMode);
    }
}


// outputs callback function
function updateAll(sender) {
    for (output of outputs) {
        // don't update sender to prevent infinite loop
        if (output != sender) {
            switch (output.id) {
                case unsignedDecTextbox.id:
                    output.value = calc.unsignedDec;
                    break; 
                case signedDecTextbox.id:
                    output.value = calc.signedDec;
                    break; 
                case hexTextbox.id:
                    output.value = calc.hex;
                    break;
                case valueSpan.id:
                    output.innerText = calc.value;
                    break; 
            }
        }
    }
}




// add mode listeners
for (const radio of modeRadios) {
    radio.addEventListener("change", modeChanged);
}

// add value listeners
unsignedDecTextbox.addEventListener("change", inputChanged);
signedDecTextbox.addEventListener("change", inputChanged);
hexTextbox.addEventListener("change", inputChanged);



// events
function modeChanged(event) {
    console.log("mode changed")

    let selected = event.target;
    calc.setMode(selected.value);

    updateMode(selected.value);
    updateAll(selected);
}

function inputChanged(event) {
    console.log("input changed")

    switch (event.target.id) {
        case unsignedDecTextbox.id:
            calc.setFromUnsignedDec(event.target.value);
            break;
        case signedDecTextbox.id:
            calc.setFromSignedDec(event.target.value);
            break;
        case hexTextbox.id:
            calc.setFromHex(event.target.value);
            break;
    }

    updateAll(event.target);
}


// set initial mode
// later pull from settings
var calc = new Calc();
calc.setMode(MODE._8bit, updateMode);