const {
    fromNumber,
    fromString,
} = require('./index')

test('fromNumber', () => {
    expect(eval(fromNumber(0))).toBe(0)
    expect(eval(fromNumber(1))).toBe(1)
    expect(eval(fromNumber(-1))).toBe(-1)
    expect(eval(fromNumber(1942))).toBe(1942)
})

test('fromString', () => {
    expect(eval(fromString('`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?\n中文'))).toBe('`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?\n中文')
})