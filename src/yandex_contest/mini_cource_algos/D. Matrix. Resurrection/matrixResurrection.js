/*
    D. Matrix. Resurrection

    Вам дана матрица из n строк и m столбцов, заполненная натуральными числами. По матрице можно перемещаться, из
    клетки можно уходить только в соседнюю по стороне клетку, переходы по диагонали, а также выход за границу
    матрицы запрещены.
    Ваша задача — найти наиболее длинный возрастающий путь в матрице. Путь возрастающий, если значения в посещаемых
    клетках строго возрастают от начала пути к его концу.

    https://contest.yandex.ru/contest/36783/problems/D/

    -- ПРИНЦИП РАБОТЫ --

        Используется динамическое программирование

    Алгоритм:
        - заполняем dp массив матрицы нулями, для дальнейшего вычисления доступных шагов из каждого элемента этого массива
        - обходим каждый элемент матрицы и заполняем аналогичную позицию из двумерного массива
            - если значение dp больше чем соседние обновляем значение dp
        - результат длина самого длинного пути из dp

    n - количество строк
    m - количество столбцов

    -- ВРЕМЕННАЯ СЛОЖНОСТЬ --

    Заполнение двумерного массива           - O( n * m)
    Проход по матрице и dp                  - O( n * m)
    Просеивание до большего элемента dp     - O( n * m)

    Итого O( n * m)

    -- ПРОСТРАНСТВЕННАЯ СЛОЖНОСТЬ --

    Массив dp                               - O( n * m)

    Итого O( n * m)
 */
const path = require("path");
const fs = require("fs");
const readline = require('readline');
const pathInputFile = path.resolve(__dirname, 'input.txt');

function start(pathInputFile, cb) {
    const lineReader = readline.createInterface({
        input: fs.createReadStream(pathInputFile)
    });

    let lineNumber = 0;
    let n = 0;
    let m = 0;
    const matrix = [];

    lineReader.on('line', function (line) {
        if (lineNumber === 0) {
            [n, m] = line.trim().split(' ').map(Number);
        } else {
            const data = line.trim().split(' ').map(Number);
            matrix.push(data);
        }
        lineNumber++;
    });

    lineReader.on('close', function () {
        if (cb) {
            cb(solution(n, m, matrix, true));
        } else {
            solution(n, m, matrix, false);
        }
    });
}

start(pathInputFile);

function matrixResurrection(n, m, matrix) {
    if (!matrix || matrix.length === 0) return 0;

    const dp = Array.from({length: n}, () => Array(m).fill(1));

    let result = 1;

    // просеивание вниз
    function shiftDown(i, j) {
        let mM = j
        for (let l = i; l >= 0; l--) {
            for (let k = mM; k >= 0; k--) {
                // Проверка правого соседа
                if (k > 0 && matrix[l][k] <  matrix[l][k + 1]) {
                    dp[l][k] = dp[l][k] + 1
                }

            }

            mM = m - 1
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const cur = matrix[i][j];
            let left = 0, right = 0, top = 0, bottom = 0;

            // Проверка левого соседа
            if (j > 0 && matrix[i][j - 1] > cur) {
                left = dp[i][j - 1];
            }


            // Проверка правого соседа
            if (j < m - 1 && matrix[i][j + 1] > cur) {
                right = dp[i][j + 1];
            }


            // Проверка верхнего соседа
            if (i > 0 && matrix[i - 1][j] > cur) {
                top = dp[i - 1][j];
            }


            // Проверка нижнего соседа
            if (i < n - 1 && matrix[i + 1][j] > cur) {
                bottom = dp[i + 1][j];
            }


            // Находим максимальную длину пути
            const maxValue = Math.max(left, right, top, bottom);


            dp[i][j] = maxValue + 1;
            result = Math.max(result, dp[i][j]);

            if(j > 0) {
                shiftDown(i, j - 1)
            } else if (i > 0) {
                shiftDown(i -1, m - 1)
            }
            console.log('dpdpdpd', dp)

        }
    }

    return result;
}

function solution(n, m, matrix, isTest) {
    const res = matrixResurrection(n, m, matrix);

    if (isTest) {
        return res;
    } else {
        console.log(res);
    }
}

function parseTestRes(pathFileOutPut) {
    const data = fs.readFileSync(pathFileOutPut);
    return data.toString().trim(" ");
}

function alertError(indexTest, solution, testRes) {
    console.log(indexTest, '. Error - solution:', solution);
    console.log(indexTest, '. Error -     test:', testRes);
}

function test(startIndex, endIndex) {
    function cb(pathFileOutPut, indexTest) {
        const testRes = parseTestRes(pathFileOutPut);
        return function (data) {
            if (data === parseInt(testRes)) {
                console.log(indexTest, '. OK - solution', data);
            } else {
                alertError(indexTest, data, testRes);
            }
        };

    }

    for (let i = startIndex; i <= endIndex; i++) {
        const pathFileInput = path.resolve(__dirname, `mockTest/${i}/input.txt`);
        const pathFileOutPut = path.resolve(__dirname, `mockTest/${i}/output.txt`);
        const callback = cb(pathFileOutPut, i);

        start(pathFileInput, callback);
    }
}
