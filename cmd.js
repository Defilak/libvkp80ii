
const EJECTOR = [0x1D, 0x65]
const EJECTOR_RETRACT = 0x02 
const EJECTOR_EJECT = 0x05 

const TOTAL_CUT = [0x1B, 0x69]

const SET_PRINT_MODE = [0x1B, 0x21]

const PRINT_MODE = {
    CLEAR: 0,
    FONT_B: 0x01,
    DOUBLE_HEIGHT_ON: 0x10,
    DOUBLE_WIDTH_ON: 0x20,
    BOLD: 0x08,
    ITALIC: 0x40,
    UNDERLINE: 0x80
}

const JUSTIFY = [0x1B, 0x61]
const JUSTIFY_MODE = {
    LEFT: 0,
    CENTER: 1,
    RIGHT: 2
}

const LEFT_MARGIN = [0x1D, 0x4C]
const PRINTING_AREA_WIDTH = [0x1D, 0x57]

const BARCODE_WIDTH = [0x1d, 0x77]
const BARCODE_HEIGHT = [0x1D, 0x68]

const BARCODE_PRINT = [0x1D, 0x6B]
const CODE128 = 70
const CODE128_CHARS = {
    CODE_A: [0x7B, 0x41],
    CODE_B: [0x7B, 0x42],
    CODE_С: [0x7B, 0x43],
}

const HRI_POSITION = [0x1D, 0x48]
const HRI_NONE = 0;
const HRI_ABOVE = 1;
const HRI_BELOW = 2;