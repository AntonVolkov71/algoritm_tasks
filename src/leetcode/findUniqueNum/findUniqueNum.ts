export function findUnique(numbers: number[]): number {
    if(numbers.length === 1){
        return numbers[0]
    }

    numbers.sort((a, b)=>{
        return a - b
    })

    let isContinue = false

    for (let i = 0; i < numbers.length; i++) {
        if(isContinue) {
            isContinue = false
            continue
        }

        if(numbers[i] === numbers[i + 1]){
            isContinue = true
        } else {
            return numbers[i]
        }
    }
    return 0
}


