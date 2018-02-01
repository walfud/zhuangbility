
/**
 * @param n Integer number, such as: 1, 1942, -1942
 * @returns A string represent the arguments' integer
 */
const fromNumber = (function () {
    const num = {
        '-': '([]+~+[])[+[]]',
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
            return num[n] = `+([]+${('' + n)
                .split('')
                .map(i => {
                    if (!num.hasOwnProperty(i)) {
                        throw new Error(`fromNumber not support: '${i}'`)
                    }
                    return `(${num[i]})`
                })
                .join('+')})`
        }
    }
})()

const fromString = (function () {
    // Generate base char map
    const char = {};
    [
        '[]+{}',            // '[object Object]'
        '[]+![]',           // 'false'
        '[]+!![]',          // 'true'
        '[]+[][[]]',        // 'undefined'
        '[]+(+[]+[][[]])',  // 'NaN'
    ].forEach(s =>
        eval(s)
            .split('')
            .map((c, i) => {
                const _ = `(${s})[${fromNumber(i)}]`
                if (!char.hasOwnProperty(c)
                    || char[c].length > _.length) {
                    char[c] = _
                }
            })
        )
    for (let i = 0; i < 10; i++) {
        char[i] = `[]+(${fromNumber(i)})`
    }

    function transform(code) {
        return code
            .split('')
            .map(c => {
                if (!char.hasOwnProperty(c)) {
                    throw new Error(`fromString not support: '${c}'`)
                }
                return `(${char[c]})`
            })
            .join('+')
    }

    // Get character for `toString`
    // ''+''['constructor'] => 'function String() { [native code] }'
    const _functionString = `[]+([]+[])[${transform('constructor')}]`
    char.g = `(${_functionString})[${fromNumber(14)}]`
    char.v = `(${_functionString})[${fromNumber(25)}]`
    char.S = `(${_functionString})[${fromNumber(9)}]`
    char['('] = `(${_functionString})[${fromNumber(15)}]`
    char[')'] = `(${_functionString})[${fromNumber(16)}]`

    // Fill all lowercase char using `(Number).toString`
    for (let i = 10; i < 36; i++) {
        const c = i.toString(36)
        if (!char.hasOwnProperty(c)) {
            // i['toString'](36)
            char[c] = `(${fromNumber(i)})[${transform('toString')}](${fromNumber(36)})`
        }
    }

    // Fill other with `unescape`
    // There should be an other way because `unescape` is deprecated and will be remove in future
    for (let i = 32; i < 128; i++) {
        const hexStr = i.toString(16)
        const c = unescape(`%${hexStr}`)
        if (char.hasOwnProperty(c)) {
            continue
        }

        // []['sort']['constructor']('return unescape')()
        char[c] = `[][${transform('sort')}][${transform('constructor')}](${transform('return unescape')})()('%'+(${transform(hexStr)}))`
    }

    return function (str) {
        return transform(str)
    }
})()

module.exports = {
    fromNumber,
    fromString,
}