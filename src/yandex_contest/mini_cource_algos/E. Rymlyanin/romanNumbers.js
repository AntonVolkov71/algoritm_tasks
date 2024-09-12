const path = require("path");
const fs = require("fs");
const readline = require('readline');
const pathInputFile = path.resolve(__dirname, 'input.txt');

// Карта значений римских символов
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
]);

// Проверка на корректность римской записи
function isValidRoman(romanNumbers) {
    let repeatedSymbols = [];
    let singleUseSymbols = {};

    for (let i = 0; i < romanNumbers.length; i++) {
        const currentChar = romanNumbers[i];

        // Проверка одноразовых символов V, L, D
        if (currentChar === 'V' || currentChar === 'L' || currentChar === 'D') {
            if (singleUseSymbols[currentChar]) {
                return false;  // Если символ уже встречался, запись некорректна
            }
            singleUseSymbols[currentChar] = true;
        }

        // Проверка на повторяющиеся символы I, X, C, M
        if (currentChar === 'I' || currentChar === 'X' || currentChar === 'C' || currentChar === 'M') {
            if (repeatedSymbols.length > 0 && repeatedSymbols[repeatedSymbols.length - 1] !== currentChar) {
                repeatedSymbols = [];
            }
            repeatedSymbols.push(currentChar);
            if (repeatedSymbols.length > 3) {
                return false;  // Нельзя использовать символ больше трех раз подряд
            }
        }
    }
    return true;
}

// Конвертация римских чисел в арабские
// function convertToArabic(romanNumbers) {
//     let result = 0;
//     let i = 0;
//
//     while (i < romanNumbers.length) {
//         const currentChar = romanNumbers[i];
//         const nextChar = romanNumbers[i + 1];
//
//         // Обработка пары символов
//         if (nextChar && values.has(currentChar + nextChar)) {
//             result += values.get(currentChar + nextChar);
//             i += 2;
//         } else {
//             result += values.get(currentChar);
//             i++;
//         }
//     }
//
//     return result;
// }
const convertToArabic = (romanNumber) => {
    const map = {
        M: 1000,
        D: 500,
        C: 100,
        L: 50,
        X: 10,
        V: 5,
        I: 1,
    };

    const nums = romanNumber
    let result = 0;
    for (let i = 0; i < nums.length; i += 1) {
        const first = map[nums[i]];
        const second = map[nums[i + 1]] ?? 0;
        if (first < second) {
            result += second - first;
            i += 1;
        } else {
            result += first;
        }
    }
    return result;
};

// Основная функция решения
function solution(romanNumbers, isTest) {
    if (!isValidRoman(romanNumbers)) {
        return -1;  // Некорректная запись римских чисел
    }

    const result = convertToArabic(romanNumbers);

    if (isTest) {
        return result;  // Возвращаем для теста
    }

    process.stdout.write(String(result))
}

// Функция для чтения данных из файла
function start(pathInputFile, cb) {
    const lineReader = readline.createInterface({
        input: fs.createReadStream(pathInputFile)
    });

    let romanNumbers = [];

    lineReader.on('line', function (line) {
        romanNumbers = line.trim().split('');  // Чтение римской записи
    });

    lineReader.on('close', function () {
        if (cb) {
            cb(solution(romanNumbers, true));  // Передача результата для теста
        } else {
            solution(romanNumbers, false);  // Решение задачи
        }
    });
}

// Тестирование решения
function test(startIndex, endIndex) {
    function parseTestResult(pathFileOutPut) {
        const data = fs.readFileSync(pathFileOutPut);
        return data.toString().trim();
    }

    function alertError(indexTest, solution, testRes) {
        console.log(`${indexTest}. Error - solution: ${solution}`);
        console.log(`${indexTest}. Error - expected: ${testRes}`);
    }

    function runTest(pathFileOutPut, indexTest) {
        const testRes = parseTestResult(pathFileOutPut);
        return function (solutionResult) {
            if (String(solutionResult) === testRes) {
                console.log(`${indexTest}. OK - solution: ${solutionResult}`);
            } else {
                alertError(indexTest, solutionResult, testRes);
            }
        };
    }

    for (let i = startIndex; i <= endIndex; i++) {
        const pathFileInput = path.resolve(__dirname, `mockTest/${i}/input.txt`);
        const pathFileOutPut = path.resolve(__dirname, `mockTest/${i}/output.txt`);
        const callback = runTest(pathFileOutPut, i);

        start(pathFileInput, callback);  // Запуск теста
    }
}

// Запуск тестирования (например, для тестов с 1 по 12)
// test(1, 12);
start(pathInputFile)