
// dom elements
const inputs = document.getElementsByClassName("input");
const outputs = document.getElementsByClassName("output");

const modeRadios = document.getElementsByName("modeRadio");
const unsignedDecTextbox = document.getElementById("unsignedDecTextbox");
const signedDecTextbox = document.getElementById("signedDecTextbox");
const hexTextbox = document.getElementById("hexTextbox");
const binaryTextbox = document.getElementById("binaryTextbox");
const bitsCheckboxes = document.getElementsByName("bitsCheckbox");

const bits16Checkboxes = document.querySelectorAll(".bits16 input[type='checkbox'][name='bitsCheckbox']");

const incButton = document.getElementById("incButton");
const decButton = document.getElementById("decButton");
const bslButton = document.getElementById("bslButton");
const bsrButton = document.getElementById("bsrButton");
const rolButton = document.getElementById("rolButton");
const rorButton = document.getElementById("rorButton");
const onesCompButton = document.getElementById("onesCompButton");
const twosCompButton = document.getElementById("twosCompButton");
const xbaButton = document.getElementById("xbaButton");

const customView = document.getElementById("custom-view");

const valueSpan = document.getElementById("valueSpan");

// consts
const BIN = 2;
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
    debug: 15,
    trace: 31
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
        if ((this.level & LOG_LEVEL.debug) == LOG_LEVEL.debug) {
            console.log("%c" + msg, "color: grey;");
        }
    }

    trace(msg) {
        if ((this.level & LOG_LEVEL.trace) == LOG_LEVEL.trace) {
            console.log("%c" + msg, "color: white;");
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
        this.value = this.mode & parseInt(newValue, HEX);

        if (callback) callback();
    }

    setFromBinary(newValue, callback) {
        this.value = parseInt(this.mode) & parseInt(newValue, BIN);

        if (callback) callback();
    }

    setFlags(flag, value, callback) {
        if (value) {
            // set flag
            this.value |= flag;
        } else {
            // clear flag
            this.value &= ~flag;
        }
        this.value = this.mode & this.value;
        logger.debug(this.value);

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

    onesComplement(callback) {
        let mask = parseInt(~this.value & this.mode);
        this.value = mask;
        logger.debug(this.value);

        if (callback) callback();
    }

    twosComplement(callback) {
        this.onesComplement();
        this.inc();

        if (callback) callback();
    }

    bsl(callback) {
        this.value = this.value << 1;
        if (this.value >= this.mode) {
            this.value -= parseInt(this.mode) + 1;
        }
        logger.debug(this.value);

        if (callback) callback();
    }

    bsr(callback) {
        this.value = this.value >> 1;
        logger.debug(this.value);

        if (callback) callback();
    }

    rol(callback) {
        this.value = this.value << 1;
        if (this.value > this.mode) {
            this.value -= this.mode;
        }
        logger.debug(this.value);

        if (callback) callback();
    }

    ror(callback) {
        let carry = this.value & 1;
        this.value = this.value >> 1;
        if (carry == 1) {
            this.value  += Math.floor(this.mode / 2) + 1;
        }
        logger.debug(this.value);

        if (callback) callback();
    }

    xba(callback) {
        if (this.mode != MODE._16bit) {
            logger.warning("invalid mode for xba");
            return;
        }
        let high = (0xFF00 & this.value) >> 8;
        let low = (0x00FF & this.value) << 8;
        this.value = high | low;
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
        let modeMaxHex = parseInt(this.mode).toString(HEX);
        return this.zeroPad(this.value.toString(HEX), modeMaxHex.length);
    }

    get binary () {
        let modeMaxBinary = parseInt(this.mode).toString(BIN);
        return this.zeroPad(this.value.toString(BIN), modeMaxBinary.length);
    }

    zeroPad(value, length) {
        while (value.length < length) {
            value = "0" + value;
        }
        return value;
    }
}




// mode callback function
function updateMode(newMode) {
    for (const radio of modeRadios) {
        radio.checked = (radio.value == newMode);
    }

    switch(parseInt(newMode)) {
        case 0xFF:
            xbaButton.disabled = true;
            disableInputs(bits16Checkboxes, true);
            break;
        case 0xFFFF:
            xbaButton.disabled = false;
            disableInputs(bits16Checkboxes, false);
            break;
    }
}

// disable inputs
function disableInputs(inputs, disabled) {
    for (const input of inputs) {
        input.disabled = disabled;
    }
}

// outputs callback function
function updateAll(sender) {
    for (output of outputs) {
        // don't update sender to prevent infinite loop
        if (output != sender) {
            updateControl(output);
        }
    }
}

// update specific control
function updateControl(sender) {
    // by id (textboxes)
    switch (sender.id) {
        case unsignedDecTextbox.id:
            output.value = calc.unsignedDec;
            break; 
        case signedDecTextbox.id:
            sender.value = calc.signedDec;
            break; 
        case hexTextbox.id:
            sender.value = calc.hex;
            break;
        case binaryTextbox.id:
            sender.value = calc.binary;
            break;
        case valueSpan.id:
            sender.innerText = calc.value;
            break;
    }

    // by name (checkboxes)
    switch (sender.name) {
        case "bitsCheckbox":
            sender.checked = ((calc.value & sender.value) == sender.value);
            break;
    }
}


// add mode listeners
for (const radio of modeRadios) {
    radio.addEventListener("change", modeChanged);
}

// add validation listeners
unsignedDecTextbox.addEventListener("keydown", validateUnsignedDec);
signedDecTextbox.addEventListener("keydown", validateSignedDec);
hexTextbox.addEventListener("keydown", validateHex);
binaryTextbox.addEventListener("keydown", validateBinary);

// add value listeners
unsignedDecTextbox.addEventListener("input", inputChanged);
signedDecTextbox.addEventListener("input", inputChanged);
hexTextbox.addEventListener("input", inputChanged);
binaryTextbox.addEventListener("input", inputChanged);

// add bits listeners
for (const check of bitsCheckboxes) {
    check.addEventListener("change", bitChanged);
}

// add button listeners
incButton.addEventListener("click", incClicked);
decButton.addEventListener("click", decClicked);
bslButton.addEventListener("click", bslButtonClicked);
bsrButton.addEventListener("click", bsrButtonClicked);
rolButton.addEventListener("click", rolButtonClicked);
rorButton.addEventListener("click", rorButtonClicked);
onesCompButton.addEventListener("click", onesCompClicked);
twosCompButton.addEventListener("click", twosCompClicked);
xbaButton.addEventListener("click", xbaButtonClicked);

// leave
unsignedDecTextbox.addEventListener("blur", inputLeft);
signedDecTextbox.addEventListener("blur", inputLeft);
hexTextbox.addEventListener("blur", inputLeft);
binaryTextbox.addEventListener("blur", inputLeft);

// right click
unsignedDecTextbox.addEventListener("contextmenu", inputRightClicked);
signedDecTextbox.addEventListener("contextmenu", inputRightClicked);
hexTextbox.addEventListener("contextmenu", inputRightClicked);
binaryTextbox.addEventListener("contextmenu", inputRightClicked);

// events
function modeChanged(event) {
    logger.info("mode changed");

    let selected = event.target;
    calc.setMode(selected.value);

    updateMode(selected.value);
    updateAll(selected);
}

function inputChanged(event) {
    logger.info("input changed");

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
        case binaryTextbox.id:
            calc.setFromBinary(event.target.value);
            break;
    }

    updateAll(event.target);
}

function bitChanged(event) {
    logger.info("bit changed");

    calc.setFlags(event.target.value, event.target.checked, updateAll);
}

function inputLeft(event) {
    logger.info("input left");

    if (event.target.value == "") {
        // fill in blanks on leave
        updateControl(event.target);
    }
}

function inputRightClicked(event) {
    logger.info("right clicked");

    event.preventDefault();
    let copyValue = event.target.value;
    navigator.clipboard.writeText(copyValue);
    logger.debug(copyValue);
}

function incClicked() {
    calc.inc(updateAll);
}

function decClicked() {
    calc.dec(updateAll);
}

function bslButtonClicked() {
    logger.info("bsl clicked");
    calc.bsl(updateAll);
}

function bsrButtonClicked() {
    logger.info("bsr clicked");
    calc.bsr(updateAll);
}

function rolButtonClicked() {
    logger.info("rol clicked");
    calc.rol(updateAll);
}

function rorButtonClicked() {
    logger.info("ror clicked");
    calc.ror(updateAll);
}

function onesCompClicked() {
    logger.info("one's complement");
    calc.onesComplement(updateAll);
}

function twosCompClicked() {
    logger.info("two's complement");
    calc.twosComplement(updateAll);
}

function xbaButtonClicked() {
    logger.info("xba clicked");
    calc.xba(updateAll);
}

function validateUnsignedDec(event) {
    const unsignedDecChars = new RegExp("[0-9]");
    validateFormat(event, unsignedDecChars);
}

function validateSignedDec(event) {
    const signedDecChars = new RegExp("[\-0-9]");
    validateFormat(event, signedDecChars);
}

function validateHex(event) {
    logger.error("not yet implemented");
}

function validateBinary(event) {
    const binaryChars = new RegExp("[01]");
    validateFormat(event, binaryChars);
}

function validateFormat(event, format) {
    if (event.ctrlKey || event.altKey || event.key.length !== 1) return;

    if (!format.test(event.key)) {
        logger.debug(event.key + " prevented");
        event.preventDefault();
    }

    // TODO: figure out this validation
    // if (format.test(event.target.value)) {
    //     logger.trace("whole format mismatch");
    // }
}

function buildCustomView(i) {
    logger.info("build custom view");

    // clear previous views
    customView.innerHTML = "";


    // for loop start
    // give id to custom view inputs
    let name = customViews[i].name;
    let format = customViews[i].format;
    let enabled = customViews[i].enabled;
    let controls = customViews[i].controls;

    for (let j = 0; j < controls.length; ++j) {
        let control = controls[j];
        let id = "custom-input-" + j;

        logger.trace(control.toString())
        let inputDiv = buildInput(j, control);
        let labelDiv = buildLabel(j, control);
        
        customView.appendChild(inputDiv);
        customView.appendChild(labelDiv);
    }

}

function buildInput(id, control) {
    let inputDiv = document.createElement("div");
    inputDiv.className = "col-custom-input";

    switch (control.type.toLowerCase()) {
        case "textbox":
            var input = buildTextbox(id, control.pos, control.size);
            break;
        case "checkbox":
            var input = buildCheckbox(id, control.pos);
            break;
        default:
            logger.error("invalid custom control type");
    }

    inputDiv.appendChild(input);

    return inputDiv;
}

function buildTextbox(id, pos, size) {
    let textbox = document.createElement("input");
    textbox.type = "text";
    textbox.class = "input output";
    textbox.id = id;

    return textbox;
}

function buildCheckbox(id, pos) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.class = "input output";
    checkbox.id = id;

    return checkbox;
}

function buildLabel(id, control) {
    let labelDiv = document.createElement("div");
    labelDiv.className = "col-custom-label";
    
    let label = document.createElement("label");
    label.htmlFor = id;
    label.innerText = control.label;

    labelDiv.appendChild(label);

    return labelDiv;
}


// custom views
var customViews = [
	// sprite
	{
		"name": "OAM Tile properties",
		"format": "YXPPCCCT",
		"enabled": true,
		"controls":
		[
			{
				"label": "Y flip",
				"type": "CheckBox",
				"pos": 7
			},
			{
				"label": "X flip",
				"type": "CheckBox",
				"pos": 6
			},
			{
				"label": "Priority",
				"type": "TextBox",
				"pos": 4,
				"size": 2
			},
			{
				"label": "Palette",
				"type": "TextBox",
				"pos": 1,
				"size": 3
			},
			{
				"label": "Page",
				"type": "TextBox",
				"pos": 0,
				"size": 1
			}
		]
	}
]



// init logger
var logger = new Logger(LOG_LEVEL.trace);

logger.error("errors only");
logger.warning("warnings and errors on");
logger.info("info, warnings, and errors on");
logger.debug("debug on");
logger.trace("trace on");

// set initial mode
// later pull from settings
var calc = new Calc();
updateAll();
calc.setMode(MODE._8bit, updateMode);


buildCustomView(0);