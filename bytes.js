
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

export default Bytes