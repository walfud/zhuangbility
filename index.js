
/**
 * @param n Integer number
 * @returns A string represent the arguments' integer
 */
const getNumber = (function () {
    const num = {
        0: '+[]',
        1: '+!![]',
    }
    // Gnerate number map, 0-9
    ~(function genNum(n) {
        if (n === 1) {
            return num[1]
        } else {
            return num[n] = genNum(n - 1) + num[1]
        }
    }
    )(9)

    // 
    return function (n) {
        if (num.hasOwnProperty(n)) {
            return num[n]
        } else {
            return num[n] = `+([]+${('' + n).split('').map(i => `(${num[i]})`).join('+')})`
        }
    }
})()

console.log(getNumber(3))
console.log(getNumber(1942))