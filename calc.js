
// dom elements
const inputs = document.getElementsByClassName("input");
const outputs = document.getElementsByClassName("output");

const modeRadios = document.getElementsByName("modeRadio");
const signedDecTextbox = document.getElementById("signedDecTextbox");
const unsignedDecTextbox = document.getElementById("unsignedDecTextbox");
const hexTextbox = document.getElementById("hexTextbox");

const incButton = document.getElementById("incButton");
const decButton = document.getElementById("decButton");

const valueSpan = document.getElementById("valueSpan");

// consts
const DEC = 10;
const HEX = 16;

// enum
const MODE = Object.freeze({
    _8bit: 0xFF,
    _16bit: 0xFFFF
});

const LOG_LEVEL = Object.freeze({
    none: 0,
    error: 1,
    warning: 3,
    info: 7,
    verbose: 15
});

class Logger {
    constructor(level) {
        this.level = level;
    }

    announceLevel() {
        if (this.level) {
            // TODO: implement 
        }
    }

    error(msg) {
        if ((this.level & LOG_LEVEL.error) == LOG_LEVEL.error) {
            console.log("%c" + msg, "color: red;");
        }
    }

    warning(msg) {
        if ((this.level & LOG_LEVEL.warning) == LOG_LEVEL.warning) {
            console.log("%c" + msg, "color: orange;");
        }
    }

    info(msg) {
        if ((this.level & LOG_LEVEL.info) == LOG_LEVEL.info) {
            console.log("%c" + msg, "color: green;");
        }
    }

    debug(msg) {
        if ((this.level & LOG_LEVEL.verbose) == LOG_LEVEL.verbose) {
            console.log("%c" + msg, "color: grey;");
        }
    }
}

// value
class Calc {
    constructor() {
        this.value = 0;
        this.mode = MODE._8bit;
    }

    setMode(newMode, callback) {
        // truncate extra bits when switching to a lower bit mode
        this.value &= newMode;
        this.mode = newMode;

        if (callback) callback(newMode);
    }

    setFromUnsignedDec(newValue, callback) {
        this.value = parseInt(this.mode & newValue);
        
        if (callback) callback();
    }

    setFromSignedDec(newValue, callback) {
        this.value = parseInt(this.mode & newValue);

        if (callback) callback();
    }

    setFromHex(newValue, callback) {
        this.value = parseInt(this.mode & newValue, HEX);

        if (callback) callback();
    }

    inc(callback) {
        this.value++;
        if (this.value > this.mode) this.value = 0; 
        logger.debug(this.value);

        if (callback) callback();
    }

    dec(callback) {
        this.value--;
        if (this.value < 0) this.value = parseInt(this.mode); 
        logger.debug(this.value);

        if (callback) callback();
    }

    
    get unsignedDec() {
        return parseInt(this.value);
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

// add validation listeners
unsignedDecTextbox.addEventListener("keydown", validateUnsignedDec);

// add value listeners
unsignedDecTextbox.addEventListener("input", inputChanged);
signedDecTextbox.addEventListener("input", inputChanged);
hexTextbox.addEventListener("input", inputChanged);

// add button listeners
incButton.addEventListener("click", incClicked)
decButton.addEventListener("click", decClicked)

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

function incClicked() {
    calc.inc(updateAll);
}

function decClicked() {
    calc.dec(updateAll);
}


function validateUnsignedDec(event) {
    const unsignedDecFormat = new RegExp("[0-9]");
    
    if (event.ctrlKey || event.altKey || event.key.length !== 1) return;


    if (!unsignedDecFormat.test(event.key)) {
        logger.debug(event.key + " prevented");
        event.preventDefault();
    }
}

function validateFormat(input, format) {

}

var logger = new Logger(LOG_LEVEL.verbose)

logger.error("errors only");
logger.warning("warnings and errors on");
logger.info("info, warnings, and errors on");
logger.debug("verbose on");

// set initial mode
// later pull from settings
var calc = new Calc();
calc.setMode(MODE._8bit, updateMode);