
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
    const _false = '[]+![]',      // 'false'
        _true = '[]+!![]',        // 'true'
        _undefined = '[]+[][[]]', // 'undefined'
        _NaN = `[]+(+${_undefined})`,   // 'NaN'
        _objectObject = '[]+{}'   // '[object Object]'
    const char = {
        a: `(${_false})[${fromNumber(1)}]`,
        b: `(${_objectObject})[${fromNumber(2)}]`,
        c: `(${_objectObject})[${fromNumber(5)}]`,
        d: `(${_undefined})[${fromNumber(2)}]`,
        e: `(${_false})[${fromNumber(4)}]`,
        f: `(${_false})[${fromNumber(0)}]`,
        i: `(${_undefined})[${fromNumber(5)}]`,
        j: `(${_objectObject})[${fromNumber(3)}]`,
        l: `(${_false})[${fromNumber(2)}]`,
        n: `(${_undefined})[${fromNumber(1)}]`,
        o: `(${_objectObject})[${fromNumber(1)}]`,
        r: `(${_true})[${fromNumber(1)}]`,
        s: `(${_false})[${fromNumber(3)}]`,
        t: `(${_true})[${fromNumber(0)}]`,
        u: `(${_true})[${fromNumber(2)}]`,
        N: `(${_NaN})[${fromNumber(1)}]`,
        ' ': `(${_objectObject})[${fromNumber(7)}]`,
    };

    function transform(map, code) {
        return code
            .split('')
            .map(c => {
                if (!map.hasOwnProperty(c)) {
                    throw new Error(`fromString not support: '${c}'`)
                }
                return `(${map[c]})`
            })
            .join('+')
    }

    // ''+''['constructor'] => 'function String() { [native code] }'
    const _functionString = `[]+([]+[])[${transform(char, 'constructor')}]`
    char.g = `(${_functionString})[${fromNumber(14)}]`
    char.v = `(${_functionString})[${fromNumber(25)}]`
    char.S = `(${_functionString})[${fromNumber(9)}]`
    char['('] = `(${_functionString})[${fromNumber(15)}]`
    char[')'] = `(${_functionString})[${fromNumber(16)}]`

    // Fill all lowercase char
    for (let i = 10; i < 36; i++) {
        const c = i.toString(36)
        if (!char.hasOwnProperty(c)) {
            // i['toString'](36)
            char[c] = `(${fromNumber(i)})[${transform(char, 'toString')}](${fromNumber(36)})`
        }
    }

    // Fill other with `unescape`
    // There should be an other way because `unescape` is deprecated and will be remove in future
    const allMap = {
        ...char,
        ...'0123456789'.split('').map(i => `[]+(${fromNumber(i)})`),
    }
    for (let i = 32; i < 128; i++) {
        const hexStr = i.toString(16)
        const c = unescape(`%${hexStr}`)
        if (char.hasOwnProperty(c)) {
            continue
        }

        // []['sort']['constructor']('return unescape')()
        char[c] = `[][${transform(char, 'sort')}][${transform(char, 'constructor')}](${transform(allMap, 'return unescape')})()('%'+(${transform(allMap, hexStr)}))`
    }

    return function (str) {
        return transform(char, str)
    }
})()

module.export = {
    fromNumber,
    fromString,
}