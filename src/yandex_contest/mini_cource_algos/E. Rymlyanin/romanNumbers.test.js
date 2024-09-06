const solution = require("./romanNumbers");

const tests = [
    {
        in: 'VIV',
        out: -1
    }, {
        in: 'II',
        out: 2
    }, {
        in: 'MCMLXI',
        out: 1961
    },
]

describe(`Test `, () => {
    for (const i in tests) {
        const parseIn = tests[i].in.split('')
        console.log('parseIn', parseIn  )

        test(`#${i}`, () => {
            expect(solution(parseIn, true)).toBe(tests[i].out)
        })

    }
})


