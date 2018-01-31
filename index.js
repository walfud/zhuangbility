
/**
 * @param n Integer number
 * @returns A string represent the arguments' integer
 */
const getNumber = (function () {
    const meta = {
        0: '+[]',
        1: '+!![]',
    }
    // Gnerate meta number map, 0-9
    ~(function genMeta(n) {
        if (n === 1) {
            return meta[1]
        } else {
            return meta[n] = genMeta(n - 1) + meta[1]
        }
    }
    )(9)

    // 
    return function (n) {
        if (0 <= n && n <= 9) {
            return meta[n]
        } else {
            return `+([]+${('' + n).split('').map(i => `(${meta[i]})`).join('+')})`
        }
    }
})()


console.log(getNumber(1942))