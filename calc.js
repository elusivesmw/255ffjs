
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

const customViewSelect = document.getElementById("custom-view-select");
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

    setFlags(value, flag, callback) {
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

    setCustomFlags(value, pos, size, callback) {
        let mask = this.getMask(pos, size);

        // set weight
        let shifted = value << pos;
        shifted &= this.mode;

        // clear flag(s)
        this.value &= ~mask;
        // set flag(s)
        this.value |= shifted;

        if (callback) callback();
    }

    getCustomFlags(pos, size) {
        let mask = this.getMask(pos, size);
        
        // set weight
        let val = this.value & mask;
        let shifted = val >> pos;

        shifted &= this.mode;

        return shifted;
    }

    /**
    * Gets a mask for a range of adjacent bits.
    * e.g. getMask(4, 2) will return 48 (00110000)
    * 
    * @param pos The least significant position the mask
    * @param size The number of bits
    */ 
    getMask(pos, size) {
        let max = Math.pow(2, size) - 1;
        let mask = max << pos;
        return mask;
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

function updateCustom(sender) {
    // need to regrab these each time
    let customOutputs = document.querySelectorAll("#custom-view .output");
    for (output of customOutputs) {
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

    // custom textboxes
    if (sender.type === "text" && sender.id.startsWith("custom-input")) {
        logger.trace("change custom text");
        let pos = sender.dataset.pos;
        let size = sender.dataset.size;
        sender.value = calc.getCustomFlags(pos, size);
    }

    // custom checkboxes
    if (sender.type === "checkbox" && sender.id.startsWith("custom-input")) {
        logger.trace("change custom checkbox");
        let pos = sender.dataset.pos;
        sender.checked = calc.getCustomFlags(pos, 1);
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

    calc.setFlags(event.target.checked, event.target.value, updateAll);
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

function buildCustomViewSelect() {
    logger.info("build custom view select");

    let select = document.createElement("select");
    select.className = "";
    let option =  document.createElement("option");
    option.value = -1;
    option.innerText = "None";
    select.appendChild(option);
    
    for (let i = 0; i < customViews.length; ++i) {
        let view = customViews[i];
        if (view.enabled) {
            option = document.createElement("option");
            option.value = i;
            option.innerText = view.name;
    
            select.appendChild(option);
        }
    }

    select.addEventListener("change", (event) => {
        logger.info("select option changed");

         // clear previous views
        customView.innerHTML = "";
        let val = event.target.value;
        
        if (val >= 0) {
            customView.classList.remove("inactive");
            buildCustomView(val);
        } else {
            customView.classList.add("inactive");
        }
    });

    customViewSelect.appendChild(select);
}

function buildCustomView(i) {
    logger.info("build custom view");

    
    let name = customViews[i].name;
    let format = customViews[i].format;
    let enabled = customViews[i].enabled;
    let controls = customViews[i].controls;

    if (enabled) {
        for (let j = 0; j < controls.length; ++j) {
            let control = controls[j];
            // give id to custom view inputs
            let id = "custom-input-" + j;
    
            logger.trace(control.toString())
            let inputDiv = buildInput(id, control);
            let labelDiv = buildLabel(id, control);
            
            customView.appendChild(inputDiv);
            customView.appendChild(labelDiv);
        }
    } 

    updateCustom();
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
    textbox.className = "input output";
    textbox.id = id;
    textbox.dataset.pos = pos;
    textbox.dataset.size = size;

    textbox.addEventListener("input", (event) => {
        logger.info("custom textbox input changed");
        // TODO: set max if out of range
        let val = event.target.value;
        let pos = event.target.dataset.pos;
        let size = event.target.dataset.size;

        calc.setCustomFlags(val, pos, size, updateAll);

        // TODO: remove event listener when custom view changes
    });

    return textbox;
}

function buildCheckbox(id, pos) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "input output";
    checkbox.id = id;
    checkbox.dataset.pos = pos;

    checkbox.addEventListener("change", (event) => {
        logger.info("custom checkbox input changed");
        let val = event.target.checked;
        calc.setCustomFlags(val, pos, 1, updateAll);

        // TODO: remove event listener when custom view changes
    });

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
    {
        "name": "OAM Tile properties",
        "format": "YXPPCCCT",
        "enabled": true,
        "controls": [{
            "label": "Y flip",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "X flip",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Priority",
            "type": "TextBox",
            "pos": 4,
            "size": 2
        }, {
            "label": "Palette",
            "type": "TextBox",
            "pos": 1,
            "size": 3
        }, {
            "label": "Page",
            "type": "TextBox",
            "pos": 0,
            "size": 1
        }]
    }, {
        "name": "Sprite properties 1",
        "format": "sSjJcccc",
        "enabled": true,
        "controls": [{
            "label": "Disappear in cloud of smoke",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Hop in/kick shells",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Dies when jumped on",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Can be jumped on",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Object clipping",
            "type": "TextBox",
            "pos": 0,
            "size": 4
        }]
    }, {
        "name": "Sprite properties 2",
        "format": "dscccccc",
        "enabled": true,
        "controls": [{
            "label": "Falls straight down when killed",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Use shell as death frame",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Sprite clipping",
            "type": "TextBox",
            "pos": 0,
            "size": 6
        }]
    }, {
        "name": "Sprite properties 3",
        "format": "lwcfpppg",
        "enabled": true,
        "controls": [{
            "label": "Don't interact with layer 2",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Disable water splash",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Disable cape killing",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Disable fireball killing",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Palette",
            "type": "TextBox",
            "pos": 1,
            "size": 3
        }, {
            "label": "Page",
            "type": "TextBox",
            "pos": 0,
            "size": 1
        }]
    }, {
        "name": "Sprite properties 4",
        "format": "dpmksPiS",
        "enabled": true,
        "controls": [{
            "label": "Don't use default interaction",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Gives powerup when eaten",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Process interaction every frame",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Can't be kicked like a shell",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Don't change into shell when stunned",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "Process while offscreen",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Invincible to star/cape/fire/etc",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Don't disabled clipping when star killed",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Sprite properties 5",
        "format": "dnctswye",
        "enabled": true,
        "controls": [{
            "label": "Don't interact with objects",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Spawns a new sprite",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Don't turn into coin at goal",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Don't change direction if touched",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Don't interact with other sprites",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "Weird ground behavior",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Stay in Yoshi's mouth",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Inedible",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Sprite properties 6",
        "format": "wcdj5sDp",
        "enabled": true,
        "controls": [{
            "label": "Don't get stuck in walls",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Don't turn into coin with silver POW",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Death frame 2 tiles high",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Can be jumped on with upward Y speed",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Takes 5 fireballs to kill",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "Can't be killed by sliding",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Don't erase at goal",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Make platform passable from below",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Player Blocked status",
        "format": "SxxMUDLR",
        //"enabled": true,
        "controls": [{
            "label": "Side of screen contact",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "-",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "-",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Middle of block",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Up contact",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "Down contact",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Left contact",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Right contact",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Sprite Blocked status",
        "format": "asb?udlr",
        "enabled": true,
        "controls": [{
            "label": "Touching layer 2 from above",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Touching layer 2 from the side",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Touching layer 2 from below",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "?",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Up contact",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "Down contact",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Left contact",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Right contact",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Tilemap properties",
        "format": "YXPCCCTT",
        "enabled": true,
        "controls": [{
            "label": "Y flip",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "X flip",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Priority",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Palette",
            "type": "TextBox",
            "pos": 2,
            "size": 3
        }, {
            "label": "Tile bits 8 and 9",
            "type": "TextBox",
            "pos": 0,
            "size": 2
        }]
    }, {
        "name": "Overworld Level settings",
        "format": "bmesudlr",
        "enabled": true,
        "controls": [{
            "label": "Level beaten",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Midway passed",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "No entry if passed",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Save prompt",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Enable walking up",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "Enable walking down",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Enable walking left",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Enable walking right",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Controller data 1",
        "format": "byetUDLR",
        "enabled": true,
        "controls": [{
            "label": "A or B",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "X or Y",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Select",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Start",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Up",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "Down",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Left",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Right",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Controller data 2",
        "format": "axlr----",
        "enabled": true,
        "controls": [{
            "label": "A",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "X",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "L",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "R",
            "type": "CheckBox",
            "pos": 4
        }]
    }, {
        "name": "Bit value",
        "enabled": true,
        "controls": [{
            "label": "2^15 = 32768",
            "type": "CheckBox",
            "pos": 15
        }, {
            "label": "2^14 = 16384",
            "type": "CheckBox",
            "pos": 14
        }, {
            "label": "2^13 = 8192",
            "type": "CheckBox",
            "pos": 13
        }, {
            "label": "2^12 = 4096",
            "type": "CheckBox",
            "pos": 12
        }, {
            "label": "2^11 = 2048",
            "type": "CheckBox",
            "pos": 11
        }, {
            "label": "2^10 = 1024",
            "type": "CheckBox",
            "pos": 10
        }, {
            "label": "2^9 = 512",
            "type": "CheckBox",
            "pos": 9
        }, {
            "label": "2^8 = 256",
            "type": "CheckBox",
            "pos": 8
        }, {
            "label": "2^7 = 128",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "2^6 = 64",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "2^5 = 32",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "2^4 = 16",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "2^3 = 8",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "2^2 = 4",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "2^1 = 2",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "2^0 = 1",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Nibble",
        "enabled": true,
        "controls": [{
            "label": "Nibble 3",
            "type": "TextBox",
            "pos": 12,
            "size": 4
        }, {
            "label": "Nibble 2",
            "type": "TextBox",
            "pos": 8,
            "size": 4
        }, {
            "label": "Nibble 1",
            "type": "TextBox",
            "pos": 4,
            "size": 4
        }, {
            "label": "Nibble 0",
            "type": "TextBox",
            "pos": 0,
            "size": 4
        }]
    }, {
        "name": "Byte",
        "enabled": true,
        "controls": [{
            "label": "Byte 1",
            "type": "TextBox",
            "pos": 8,
            "size": 8
        }, {
            "label": "Byte 0",
            "type": "TextBox",
            "pos": 0,
            "size": 8
        }]
    }, {
        "name": "Processor Flags (Native)",
        "format": "nvmxdizc (e = 0)",
        "enabled": false,
        "controls": [{
            "label": "Negative",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Overflow",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "Accumulator (1 = 8-bit, 0 = 16-bit)",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "Index Register (1 = 8-bit, 0 = 16-bit)",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Decimal Mode (1 = Decimal, 0 = Binary)",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "IRQ Disable",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Zero",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Carry",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "Processor Flags (Emulation)",
        "format": "nv-xdizc (e = 1)",
        "enabled": false,
        "controls": [{
            "label": "Negative",
            "type": "CheckBox",
            "pos": 7
        }, {
            "label": "Overflow",
            "type": "CheckBox",
            "pos": 6
        }, {
            "label": "-",
            "type": "CheckBox",
            "pos": 5
        }, {
            "label": "BRK caused interrupt",
            "type": "CheckBox",
            "pos": 4
        }, {
            "label": "Decimal Mode (1 = Decimal, 0 = Binary)",
            "type": "CheckBox",
            "pos": 3
        }, {
            "label": "IRQ Disable",
            "type": "CheckBox",
            "pos": 2
        }, {
            "label": "Zero",
            "type": "CheckBox",
            "pos": 1
        }, {
            "label": "Carry",
            "type": "CheckBox",
            "pos": 0
        }]
    }, {
        "name": "SNES Color",
        "format": "xBBBGGGRRR",
        "enabled": true,
        "controls": [{
            "label": "Unused",
            "type": "CheckBox",
            "pos": 15
        }, {
            "label": "Blue",
            "type": "TextBox",
            "pos": 10,
            "size": 5
        }, {
            "label": "Green",
            "type": "TextBox",
            "pos": 5,
            "size": 5
        }, {
            "label": "Red",
            "type": "TextBox",
            "pos": 0,
            "size": 5
        }]
    }, 
]



// init logger
var logger = new Logger(LOG_LEVEL.trace);

logger.error("errors only");
logger.warning("warnings and errors on");
logger.info("info, warnings, and errors on");
logger.debug("debug on");
logger.trace("trace on");

buildCustomViewSelect();

// set initial mode
// later pull from settings
var calc = new Calc();
updateAll();
calc.setMode(MODE._8bit, updateMode);
