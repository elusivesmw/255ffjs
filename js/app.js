// dom elements
const html = document.documentElement;

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

const popoutButton = document.getElementById("pop-out");

const lightModeLink = document.getElementById("light-mode");
const darkModeLink = document.getElementById("dark-mode");
const autoModeLink = document.getElementById("auto-mode");

const valueSpan = document.getElementById("valueSpan");


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
    updateTitle();
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
        log.debug("change custom text");
        let pos = sender.dataset.pos;
        let size = sender.dataset.size;
        sender.value = calc.getCustomFlags(pos, size);
    }

    // custom checkboxes
    if (sender.type === "checkbox" && sender.id.startsWith("custom-input")) {
        log.debug("change custom checkbox");
        let pos = sender.dataset.pos;
        sender.checked = calc.getCustomFlags(pos, 1);
    }
}

function updateTitle() {
    document.title = calc.unsignedDec + " - 0x" + calc.hex
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

// popout
popoutButton.addEventListener("click", popOut);

// light mode, dark mode
darkModeLink.addEventListener("click", setDarkMode);
lightModeLink.addEventListener("click", setLightMode);
autoModeLink.addEventListener("click", setAutoMode);


// events
function modeChanged(event) {
    log.info("mode changed");
    log.debug(event.target.value);

    let selected = event.target;
    calc.setMode(selected.value);

    updateMode(selected.value);
    updateAll(selected);
}

function inputChanged(event) {
    log.info("input changed");
    log.debug(event.target.value);

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
    log.info("bit changed");

    calc.setFlags(event.target.checked, event.target.value, updateAll);
}

function inputLeft(event) {
    log.info("input left");

    if (event.target.value == "") {
        // fill in blanks on leave
        updateControl(event.target);
    }
}

function inputRightClicked(event) {
    log.info("right clicked");

    // event.preventDefault();
    // let copyValue = event.target.value;
    // navigator.clipboard.writeText(copyValue);
    // log.debug(copyValue);
}

function incClicked() {
    calc.inc(updateAll);
}

function decClicked() {
    calc.dec(updateAll);
}

function bslButtonClicked() {
    log.info("bsl clicked");
    calc.bsl(updateAll);
}

function bsrButtonClicked() {
    log.info("bsr clicked");
    calc.bsr(updateAll);
}

function rolButtonClicked() {
    log.info("rol clicked");
    calc.rol(updateAll);
}

function rorButtonClicked() {
    log.info("ror clicked");
    calc.ror(updateAll);
}

function onesCompClicked() {
    log.info("one's complement");
    calc.onesComplement(updateAll);
}

function twosCompClicked() {
    log.info("two's complement");
    calc.twosComplement(updateAll);
}

function xbaButtonClicked() {
    log.info("xba clicked");
    calc.xba(updateAll);
}

function validateUnsignedDec(event) {
    validateFormat(event, NUM.unsigned);
}

function validateSignedDec(event) {
    validateFormat(event, NUM.signed);
}

function validateHex(event) {
    validateFormat(event, NUM.hex);
}

function validateBinary(event) {
    validateFormat(event, NUM.binary);
}

function validateFormat(event, num) {
    if (event.ctrlKey || event.altKey || event.key.length !== 1) return;

    if (invalidChar(event, num)) return;

    let newValue = valueAfterKeyPress(event);

    if (invalidFormat(event, num, newValue)) return;

    if (tooManyDigits(event, num, newValue)) return;

    if (signedOutOfRange(event, num, newValue)) return;

    if (valueTooHigh(event, num, newValue)) return;
}

function invalidChar(event, num) {
    // invalid character
    if (!num.chars.test(event.key)) {
        log.debug(event.key + " key prevented");
        event.preventDefault();
        return true;
    }
    return false;
}

function valueAfterKeyPress(event) {
    // mimick what the value will be if we let the keypress through
    // TODO: figure out how to handle insert mode
    if (event.target.selectionStart === event.target.selectionEnd) {
        return event.target.value.insert(event.target.selectionStart, event.key);
    }
    return event.target.value.insertSelection(event.target.selectionStart, event.target.selectionEnd, event.key);
}

function invalidFormat(event, num, newValue) {
    // invalid format
    if (!num.format.test(newValue)) {
        log.debug(event.key + " format prevented");
        event.preventDefault();
        return true;
    }
    return false;
}

function tooManyDigits(event, num, newValue) {
    // too many digits
    let maxLength = calc.modeMaxLength(num.base);
    if (newValue.substring(0,1) == "-") ++maxLength;
    if (newValue.length > maxLength) {
        log.debug(newValue + " too many digits");
        event.preventDefault();
        return true;
    }
    return false;
}

function signedOutOfRange(event, num, newValue) {
    // is signed
    if (num == NUM.signed) {
        if (newValue.length > 1 && newValue.substring(0, 1) == "-") {
            // is negative, handle min value
            let signedMin = calc.signedMin();
            if (newValue < signedMin) {
                log.debug(newValue + " negative signed number too low");
                event.preventDefault();
                calc.setFromSignedDec(signedMin, updateAll);
                return true;
            }
        } else {
            // is positive, handle lower max value
            let signedMax = calc.signedMax();
            if (newValue > signedMax) {
                log.debug(newValue + " positive signed number too high");
                event.preventDefault();
                calc.setFromSignedDec(signedMax, updateAll);
                return true;
            }
        }
    }
    return false;
}

function valueTooHigh(event, num, newValue) {
    // value too high, set to max
    if (parseInt(newValue, num.base) > parseInt(calc.mode)) {
        log.debug(newValue + " value too high");
        event.preventDefault();
        calc.setMaxValue(updateAll);
        return true;
    }
    return false;
}








function buildCustomViewSelect() {
    log.info("build custom view select");

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
        log.info("select option changed");

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
    log.info("build custom view");
    
    let name = customViews[i].name;
    let format = customViews[i].format;
    let enabled = customViews[i].enabled;
    let controls = customViews[i].controls;

    if (enabled) {
        for (let j = 0; j < controls.length; ++j) {
            let control = controls[j];
            // give id to custom view inputs
            let id = "custom-input-" + j;
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
            log.error("invalid custom control type");
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

    textbox.addEventListener("keyup", (event) => {
        log.info("custom textbox key up");

        if (event.ctrlKey || event.altKey || event.key.length !== 1) return;

    });

    textbox.addEventListener("input", (event) => {
        log.info("custom textbox input changed");
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
        log.info("custom checkbox input changed");
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

function popOut() {
    log.info("popout");
    window.open("index.html", "_blank", "popup=true,width=600,height=800");
}

function setDarkMode() {
    log.info("dark mode");
    html.className = "dark";
}

function setLightMode() {
    log.info("light mode");
    html.className = "light";
}

function setAutoMode() {
    log.info("auto mode");
    let date = new Date();
    let daytime = date.getHours() >= 8 && date.getHours() < 18;
    log.debug(date.getHours());

    html.className = daytime ? "light" : "dark";
}

buildCustomViewSelect();

// set initial mode
// later pull from settings
var calc = new Calc();
updateAll();
calc.setMode(MODE._8bit, updateMode);
