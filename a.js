
const vkp = new vkp80ii(device)

vkp.printOneTicket(function(cmd) {
    cmd.println('АВТОМАТИЧЕСКАЯ ПАРКОВКА')
    cmd.println('БИЛЕТ НА ВЫЕЗД', PRINT_MODE.BOLD)
    cmd.println()
    
    cmd.printMode(PRINT_MODE.ITALIC | PRINT_MODE.FONT_B)
    cmd.println('ООО "Проект" производство,')
    cmd.println('обслуживание, ремонт платных')
    cmd.println('автоматических парковок, систем')
    cmd.println('доступа, видеонаблюдения, сигнализаций')
    cmd.println()
    
    cmd.printMode(PRINT_MODE.CLEAR)
    cmd.println('------------------------------')
    
    cmd.printMode(PRINT_MODE.ITALIC | PRINT_MODE.FONT_B)
    cmd.println('Место для рекламы')
    cmd.println()
    
    cmd.printMode(PRINT_MODE.CLEAR)
    cmd.println('------------------------------')
    
    cmd.leftMargin(576)
    cmd.printAreaWidth(90)
    cmd.justify(JUSTIFY_MODE.LEFT)
    cmd.println('Арендатор: ' + arendator.name)
    cmd.println('Время: ' + ticketData.time)
    
    cmd.leftMargin(0)
    cmd.justify(JUSTIFY_MODE.CENTER)
    cmd.println('------------------------------')
    cmd.println()
    
    
    cmd.printMode(PRINT_MODE.ITALIC | PRINT_MODE.FONT_B)
    cmd.println('Внимание!')
    cmd.println('Не мните билет, сохраняйте')
    cmd.println('билет до выезда с парковки')
    cmd.println()
    
    if (printQr)
        cmd.printQrcode(ticketData.barcode)
    else
        cmd.printCode128(ticketData.barcode)
    
    cmd.printMode(PRINT_MODE.ITALIC | PRINT_MODE.FONT_B)
    cmd.printLine()
    cmd.printLine('Спасибо за визит!')
    cmd.printLine()
})








const cmd = {


    sendCommand(arr) {
        device.transferOut(endpoint, new Uint8Array(arr))
    },

    printLine(line) {
        device.transferOut(endpoint, utf8_to_866(line + '\n'))
    },

    printAscii(text) {
        let encoder = new TextEncoder()
        let buffer = encoder.encode(text)
        device.transferOut(endpoint, buffer)
    },

    eject() {
        this.send([0x1d, 0x65, 5])
    },

    printQrcode(barcode) {
        const len = barcode.length + 3
        const storepL = len % 256
        const storepH = len / 256

        this.justifyCenter()

        //Specify encoding scheme of QRcode barcode
        this.sendCommand([0x1D, 0x28, 0x6B, 0x03, 0x00, 49, 65, 0])

        //Specify dot size of the module of the QRcode barcode 0x043?
        this.sendCommand([0x1D, 0x28, 0x6B, 0x03, 0x00, 49, 66, 8]) //менять для смены размера

        //Specify QRcode barcode size
        this.sendCommand([0x1D, 0x28, 0x6B, 0x03, 0x00, 49, 67, 4])

        //Specify the error correction level of the QRcode barcode
        this.sendCommand([0x1D, 0x28, 0x6B, 0x03, 0x00, 49, 69, 1])

        //Store the QRcode barcode data in the barcode save area
        this.sendCommand([0x1D, 0x28, 0x6B, storepL, storepH, 49, 80, 49])

        this.printAscii(barcode)

        this.sendCommand([0x1D, 0x28, 0x6B, 0x03, 0x00, 49, 81, 49])
    },

    printqr1(text) {
        const len = text.length
        const storepL = len % 256
        const storepH = len / 256

        const model = [0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00];
        const size = [0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x03];
        const ecc = [0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31];
        const store = [0x1d, 0x28, 0x6b, storepL, storepH, 0x31, 0x50, 0x30];
        const print = [0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30];

        this.sendCommand([...model, ...size, ...ecc, ...store])
        this.printLine(text)
        this.sendCommand(print);
    },

    printCode128(barcode) {
        this.justifyLeft()
        this.sendCommand([0x1b, 0x21, 0x41]) //italic & bold
        this.sendCommand([0x1d, 0x4c, 90, 0]) //left margin
        this.printLine(barcode)

        this.justifyCenter()
        this.sendCommand([0x1d, 0x4c, 0, 0]) //left margin
        this.sendCommand([0x1d, 0x77, 2]) //barcode width
        this.sendCommand([0x1d, 0x68, 255]) //barcode height
        this.sendCommand([0x1d, 0x48, 0]) //don't print hri
        this.sendCommand([
            0x1d,
            0x6b,
            73,
            barcode.length + 2,
            0x7b,
            0x41, //CODE A
        ])
        this.printAscii(barcode)
    },
}