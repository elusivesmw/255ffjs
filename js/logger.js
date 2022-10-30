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
