// custom views
var customViews = [{
    "title": "Sprite",
    "formats": [{
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
    }]
}, {
    "title": "Misc",
    "formats": [{
        "name": "Player Blocked status",
        "format": "SxxMUDLR",
        "enabled": true,
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
    }]
}, {
    "title": "Controller",
    "formats": [{
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
    }]
}, {
    "title": "Binary",
    "formats": [{
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
    }]
}, {
    "title": "Processor",
    "formats": [{
        "name": "Processor Flags (Native)",
        "format": "nvmxdizc (e = 0)",
        "enabled": true,
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
        "enabled": true,
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
            "label": "Red",
            "type": "TextBox",
            "pos": 0,
            "size": 5,
            "base": 16,
            "weight": 3
        }, {
            "label": "Green",
            "type": "TextBox",
            "pos": 5,
            "size": 5,
            "base": 16,
            "weight": 3
        }, {
            "label": "Blue",
            "type": "TextBox",
            "pos": 10,
            "size": 5,
            "base": 16,
            "weight": 3
        }, {
            "label": "Red",
            "type": "TextBox",
            "pos": 0,
            "size": 5,
            "weight": 3
        }, {
            "label": "Green",
            "type": "TextBox",
            "pos": 5,
            "size": 5,
            "weight": 3
        }, {
            "label": "Blue",
            "type": "TextBox",
            "pos": 10,
            "size": 5,
            "weight": 3
        }, {
            "label": "Red",
            "type": "TextBox",
            "pos": 0,
            "size": 5
        }, {
            "label": "Green",
            "type": "TextBox",
            "pos": 5,
            "size": 5
        }, {
            "label": "Blue",
            "type": "TextBox",
            "pos": 10,
            "size": 5
        }]
    }]
}];