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

class vkp80ii extends EscPos {
    endpoint = 2

    constructor(device) {
        super(device)
    }

    print(text = '', mode = false) {//0x1B 0x64
        const line = utf8_to_866(text + '\n')
        if (mode) {
            this.send(...SET_PRINT_MODE, mode, ...line)
        } else {
            this.send(line)
        }
    }

    println(text = '', mode = false) {
        this.print(text + '\n', mode)
    }

    printCode128(barcode) {
        this.justify(JUSTIFY_MODE.LEFT)
        this.printMode(PRINT_MODE.ITALIC | PRINT_MODE.FONT_B)
        this.println(barcode)

        this.justify(JUSTIFY_MODE.CENTER)
        this.leftMargin(0)

        this.barcodeWidth(2)
        this.barcodeHeight(255)
        this.hriPos(HRI_NONE)

        this.barcodePrint(barcode, CODE128, CODE128_CHARS.CODE_A)
    }

    printOneTicket(cb) {
        this.eject()
        cb(this)
        this.totalCut()
    }
}

class EscPos {
    constructor(device) {
        this.device = device
    }

    send(...arr) {
        this.device.transferOut(this.endpoint, new Uint8Array(arr))
        return this
    }

    ascii(text) {//?
        let encoder = new TextEncoder()
        this.send(encoder.encode(text))
    }

    printMode(mode) {
        this.send(...SET_PRINT_MODE, mode)
    }

    justify(to) {
        this.send(...JUSTIFY, to)
    }

    leftMargin(n) {
        this.send(...LEFT_MARGIN, ...Bytes.short2ba(n))
    }

    printAreaWidth(n) {
        this.send(...PRINTING_AREA_WIDTH, ...Bytes.short2ba(n))
    }

    eject() {
        this.send(...EJECTOR, EJECTOR_EJECT)
    }

    retract() {
        this.send(...EJECTOR, EJECTOR_RETRACT)
    }

    totalCut() {
        this.send(...TOTAL_CUT)
    }

    /**
     * n MODULE WIDTH ( mm )
     * 1 0.125
     * 2 0.25
     * 3 0.375
     * 4 0.5
     * 5 0.625
     * 6 0.75
     */
    barcodeWidth(n = 3) {
        this.send(...BARCODE_WIDTH, Math.min(Math.max(n, 1), 6))
    }

    barcodeHeight(n = 162) {
        this.send(...BARCODE_HEIGHT, Math.min(Math.max(n, 1), 255))
    }

    barcodePrint(text, type = CODE128, charset = CODE128_CHARS.CODE_A) {
        let encoder = new TextEncoder()
        this.send(
            ...BARCODE_PRINT,
            type,
            text.length + charset.length,
            ...charset,
            ...encoder.encode(text)
        )
    }

    hriPos(pos) {
        this.send(...HRI_POSITION, pos)
    }
}

const Bytes = {
    short2ba: (num) => Bytes.num2ba(num, 2),
    int2ba: (num) => Bytes.num2ba(num, 4),
    long2ba: (num) => Bytes.num2ba(num, 8),

    num2ba(num, length = false) {
        if (!length) length = Math.log2(num + 1) / 2
        let arr = Array(length)

        for (let i = 0; i < arr.length; i++) {
            const byte = num & 0xFF;
            arr[i] = byte;
            num = (num - byte) / 256;
        }

        return arr;
    },

    ba2num(arr) {
        let value = 0;
        for (let i = arr.length - 1; i >= 0; i--) {
            value = (value * 256) + arr[i];
        }

        return value;
    }
}


