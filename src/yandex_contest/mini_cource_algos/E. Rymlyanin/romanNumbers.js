/*
      -- ПРИНЦИП РАБОТЫ --


    Алгоритм:


    -- ВРЕМЕННАЯ СЛОЖНОСТЬ --

    n - количество элементов

    Запись остатков всех элементов                      - O(n)
    Цикл подсчета необходимых длин массива остатка      - O(n)

    Итого O(n)

    -- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --

    Хранение словаря остатков   - O(n)

    Итого O(n)
 */

const path = require("path");
const fs = require("fs");
const readline = require('readline');
const pathInputFile = path.resolve(__dirname, 'input.txt')


function start(pathInputFile, cb) {
    const lineReader = readline.createInterface({
        input: fs.createReadStream(pathInputFile)
    });

    let lineNumber = 0


    const romanNumbers = []

    lineReader.on('line', function (line) {

        if (lineNumber === 0) {
            line.trim().split('').forEach(item => romanNumbers.push(item))
        }

        lineNumber++
    });

    lineReader.on('close', function () {
        if (cb) {
            cb(solution(romanNumbers, true))
        } else {
            solution(romanNumbers, false)
        }
    });
}


// start(pathInputFile)

test(1, 3)

const values = new Map([
    ["I", 1],
    ["IV", 4],
    ['V', 5],
    ['IX', 9],
    ['X', 10],
    ['XL', 40],
    ['L', 50],
    ['XC', 90],
    ['C', 100],
    ['CD', 400],
    ['D', 500],
    ['CM', 900],
    ['M', 1000]
])

const inRowIXCM = []
const oneTimeVLD = {}


function checkInRow(num) {
    const findInRowIndex = inRowIXCM.findIndex(item => item === num)

    if (findInRowIndex === -1 || findInRowIndex < 3) {
        inRowIXCM.push(num)

        return true
    }

    return false
}


function checkOneTimes(num) {
    if (num in oneTimeVLD) {
        return false
    }

    oneTimeVLD[num] = 1

    return oneTimeVLD[num]
}

function check(num) {
    const isInRow = num === 'I' || num === 'X' || num === 'C' || num === 'M'

    if (isInRow) {
        return checkInRow(num)
    }

    const isOneTime = num === 'V' || num === 'L' || num === 'D'

    if (isOneTime) {
        return checkOneTimes(num)
    }


    return true
}

function convertToArabic(romanNumbers) {
    const negativeRes = -1
    let res = 0

    if (romanNumbers.length === 1) {
        return values.get(romanNumbers[0])
    }

    let i = 0

    while (i < romanNumbers.length) {
        const isCheck = check(romanNumbers[i])

        if (!isCheck) {
            return negativeRes
        }


        if (romanNumbers[i] === 'I' && romanNumbers[i + 1] === 'V') {
            res += values.get(romanNumbers[i] + romanNumbers[i + 1])
            i++
        }

        if (romanNumbers[i] === 'I' && romanNumbers[i + 1] === 'X') {
            res += values.get(romanNumbers[i] + romanNumbers[i + 1])
            i++
        } else if (romanNumbers[i] === 'X' && romanNumbers[i + 1] === 'L') {
            res += values.get(romanNumbers[i] + romanNumbers[i + 1])
            i++
        } else if (romanNumbers[i] === 'X' && romanNumbers[i + 1] === 'C') {
            res += values.get(romanNumbers[i] + romanNumbers[i + 1])
            i++
        } else if (romanNumbers[i] === 'C' && romanNumbers[i + 1] === 'D') {
            res += values.get(romanNumbers[i] + romanNumbers[i + 1])
            i++
        } else if (romanNumbers[i] === 'C' && romanNumbers[i + 1] === 'M') {
            res += values.get(romanNumbers[i] + romanNumbers[i + 1])
            i++
        } else {
            res += values.get(romanNumbers[i])
        }

        i++
    }

    // your code goes here
    return res > 0 ? res : negativeRes
}

function solution(romanNumbers, isTest) {
    console.log('in', romanNumbers)
    const res = convertToArabic(romanNumbers)

    if (isTest) {
        return res
    }

    console.log(res)
}

module.exports = solution

function parseTestRes(pathFileOutPut) {
    const data = fs.readFileSync(pathFileOutPut)

    return data.toString().trim()
}

function alertError(indexTest, solution, testRes) {
    console.log(indexTest, '. Error - solution:', solution)
    console.log(indexTest, '. Error -     test:', testRes)
}

function test(startIndex, endIndex) {
    function cb(pathFileOutPut, indexTest) {
        const testRes = parseTestRes(pathFileOutPut)
        return function (data) {

            if (data === parseInt(testRes)) {
                console.log(indexTest, '. OK - solution', data)

            } else {
                alertError(indexTest, data, testRes)
            }
        }
    }

    for (let i = startIndex; i <= endIndex; i++) {
        const pathFileInput = path.resolve(__dirname, `mockTest/${i}/input.txt`)
        const pathFileOutPut = path.resolve(__dirname, `mockTest/${i}/output.txt`)
        const callback = cb(pathFileOutPut, i)

        start(pathFileInput, callback)
    }
}