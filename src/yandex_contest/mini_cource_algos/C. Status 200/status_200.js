/*
    C. Status 200

    Вам дан массив натуральных чисел. Найдите число таких пар элементов, где a[i] - a[j] % 200 === 0, где i < j

    https://contest.yandex.ru/contest/36783/problems/C/

    -- ПРИНЦИП РАБОТЫ --

    Используем структуру Map для хранения временного результата деления от остатка каждого элемента

    Алгоритм:
        - если количество элементов равно 1, возвращаем 0
        - циклом по всему массиву, находим остаток от деления от каждого элемента
            - если в Map уже есть такой остаток, добавляем "1" в массив этого элемента Map
            - создаем элемент Map, где ключ остаток, значение пустой массив
        - циклом проходим по всем значениям Map
            - берем длину как длину полученного массива
            - циклом пока длина больше или равна нулю
                - прибавляем длину к результату
                - убавляем на 1 длину

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


    let n = 0

    const cards = []

    lineReader.on('line', function (line) {

        if (lineNumber === 0) {
            n = parseInt(line.trim())
        } else if (lineNumber === 1) {
            const data = line.trim().split(' ').map(item => cards.push(parseInt(item)))
        }

        lineNumber++
    });

    lineReader.on('close', function () {
        if (cb) {
            cb(solution(n, cards, true))
        } else {
            solution(n, cards, false)
        }
    });
}

function getCardCount(n, cards) {
    if (n === 1) {
        return 0
    }


    let res = 0
    const dict = new Map()

    for (let i = 0; i < n; i++) {

        const mod = cards[i] % 200
        if (dict.has(mod)) {
            const el = dict.get(mod)

            el.push(1)
        } else {
            dict.set(mod, [])
        }

    }

    for (const value of dict.values()) {
        let len = value.length

        while (len >=0) {
            res += len
            len--
        }
    }

    return res
}


start(pathInputFile)

// test(1, 4)


function solution(n, cards, isTest) {
    const res = getCardCount(n, cards)

    if (isTest) {
        return res
    } else {
        console.log(res)
    }
}

function parseTestRes(pathFileOutPut) {
    const data = fs.readFileSync(pathFileOutPut)

    return data.toString().trim(" ")
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