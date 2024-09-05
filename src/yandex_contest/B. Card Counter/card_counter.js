/*
    B. Card Counters

    На стол в ряд выложены карточки, на каждой карточке написано натуральное число. За один ход разрешается взять
    карточку либо с левого, либо с правого конца ряда. Всего можно сделать k ходов. Итоговый счет равен сумме чисел
    на выбранных карточках. Определите, какой максимальный счет можно получить по итогам игры.

    https://contest.yandex.ru/contest/36783/problems/B/

    -- ПРИНЦИП РАБОТЫ --

    Реализация методом двух указателей

    Алгоритм:
        - если количество карт равно количеству шагов, обходом считаем сумму всех элементов
        - иначе, считаем сумму элементов от первого до k
        - устанавливаем указатели
            - start индекс k
            - end индекс последнего элемента массива
            - finish количество элементов минус k
        - в цикле, пока end больше или равен finish делаем:
            - вычитаем из суммы элемент с индексом start
            - прибавляем элемент с индексом end
            - сравниваем результат с суммой
                - если результат больше меняем сумму
            - start вычитаем 1 с учетом, что он может стать индексом последнего элемента
            - end вычитаем 1

    Обозначения, используемы при оценке алгоритма:

    k - количество шагов

    -- ВРЕМЕННАЯ СЛОЖНОСТЬ --

    Вычисление суммы элементов           - O(k)
    Цикл обхода всех возможных ходов     - O(2 * k)

    Итого O(k)

    -- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --

    Хранение только входящего массива   - O(n)
    n - количество элементов

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
    let k = 0
    const cards = []

    lineReader.on('line', function (line) {

        if (lineNumber === 0) {
            n = parseInt(line.trim())
        } else if (lineNumber === 1){
            k  = parseInt(line.trim())
        } else {
            const data = line.trim().split(' ').map(item=> cards.push(parseInt(item)))
        }

        lineNumber++
    });

    lineReader.on('close', function () {
        if (cb) {
            cb(solution(n, k, cards, true))
        } else {
            solution(n, k, cards, false)
        }
    });
}

function getCardCount(n, k, cards) {
    if(k === cards.length){
        return cards.reduce((acc, item)=> acc+=item, 0)
    }


    const leftArr = []
    let res = 0

    for(let i = k - 1; i >=0; i--){
        leftArr.push(cards[i]) // [3, 2, 1]
        res += cards[i]    // 3 + 2 + 1 = 6
    }


    let tempMax = res // 6

    for(let i = cards.length - 1, left=0;  left <= k -1; i--, left++){
        tempMax = tempMax - leftArr[left] + cards[i]

        if(tempMax > res){
            res = tempMax
        }
    }

    let maxR = 0

    for(let i = cards.length -1, j=1; j <=k; j++, i--){
        maxR += cards[i]
    }


    return maxR > res ? maxR : res
}


start(pathInputFile)
//
// test(1, 3)


function solution(n, k, cards, isTest) {
    const res =getCardCount(n, k, cards)

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

            if (data === testRes) {
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