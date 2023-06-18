/**
 * Modes with their max values
 */
const MODE = Object.freeze({
    _8bit: 0xFF,
    _16bit: 0xFFFF
});

/**
 * Number bases
 */
const BASE = Object.freeze({
    binary: 2,
    decimal: 10,
    hex: 16
});

/**
 * Number formats
 */
const NUM = Object.freeze({
    unsigned: {
        base: BASE.decimal,
        chars: /\d/,
        format: /\d+/
    },
    signed: {
        base: BASE.decimal,
        chars: /[\-\d]/,
        format: /^-$|^-[1-9]+[\d]*$|^[\d]+$/
    },
    hex: {
        base: BASE.hex,
        chars: /[\da-fA-F]/,
        format: /[\da-fA-F]+/
    },
    binary: {
        base: BASE.binary,
        chars: /[01]/,
        format: /[01]+/
    },
    getNumFromBase(base) {
        switch (base) {
            case "2":
                return this.binary;
            case "16":
                return this.hex;
            default:
                return this.unsigned;
        }
    }
});

/**
 * The calculator class, used to convert between bases.
 */
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

    setMaxValue(callback) {
        this.value = parseInt(this.mode);

        if (callback) callback();
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
        this.value = this.mode & parseInt(newValue, BASE.hex);

        if (callback) callback();
    }

    setFromBinary(newValue, callback) {
        this.value = parseInt(this.mode) & parseInt(newValue, BASE.binary);

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

        if (callback) callback();
    }

    setCustomFlags(value, pos, size, callback) {
        let mask = this.getMask(pos, size);

        // set weight
        let shifted = parseInt(value) << pos;
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

        if (callback) callback();
    }

    dec(callback) {
        this.value--;
        if (this.value < 0) this.value = parseInt(this.mode); 

        if (callback) callback();
    }

    onesComplement(callback) {
        let mask = parseInt(~this.value & this.mode);
        this.value = mask;

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

        if (callback) callback();
    }

    bsr(callback) {
        this.value = this.value >> 1;

        if (callback) callback();
    }

    rol(callback) {
        this.value = this.value << 1;
        if (this.value > this.mode) {
            this.value -= this.mode;
        }

        if (callback) callback();
    }

    ror(callback) {
        let carry = this.value & 1;
        this.value = this.value >> 1;
        if (carry == 1) {
            this.value  += Math.floor(this.mode / 2) + 1;
        }

        if (callback) callback();
    }

    xba(callback) {
        if (this.mode != MODE._16bit) {
            console.warn("invalid mode for xba");
            return;
        }
        let high = (0xFF00 & this.value) >> 8;
        let low = (0x00FF & this.value) << 8;
        this.value = high | low;

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
        let modeMaxHex = parseInt(this.mode).toString(BASE.hex);
        return this.zeroPad(this.value.toString(BASE.hex), modeMaxHex.length);
    }

    get binary () {
        let modeMaxBinary = parseInt(this.mode).toString(BASE.binary);
        return this.zeroPad(this.value.toString(BASE.binary), modeMaxBinary.length);
    }

    zeroPad(value, length) {
        while (value.length < length) {
            value = "0" + value;
        }
        return value;
    }

    modeMaxValue(base) {
        return parseInt(this.mode).toString(base);
    }

    signedMin() {
        let max = parseInt(this.mode) + 1;
        return (max/2) - max;
    }

    signedMax() {
        let max = parseInt(this.mode) + 1;
        return (max/2) - 1;
    }
}
