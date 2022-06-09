import Bytes from './bytes.js'

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
