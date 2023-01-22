const LOG_LEVEL = Object.freeze({
    none: 0,
    assert: 1,
    error: 2,
    warning: 3,
    info: 4,
    debug: 5,
    trace: 6
});

var log = {
    set level(level) {
        if (level >= LOG_LEVEL.assert) this.assert = console.assert.bind(window.console);
        else this.assert = function() {};

        if (level >= LOG_LEVEL.error) this.error = console.error.bind(window.console);
        else this.error = function() {};

        if (level >= LOG_LEVEL.warning) this.warning = console.warn.bind(window.console);
        else this.warning = function() {};

        if (level >= LOG_LEVEL.info) this.info = console.info.bind(window.console);
        else this.info = function() {};

        if (level >= LOG_LEVEL.debug) this.debug = console.debug.bind(window.console);
        else this.debug = function() {};

        if (level >= LOG_LEVEL.trace) this.trace = console.log.bind(window.console);
        else this.trace = function() {};

        this.logLevel = level;
    },
    get level() { 
        return this.logLevel;
    }
};

log.level = LOG_LEVEL.warning;
