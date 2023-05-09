// prettier-ignore
/**
 * Given an array of arrays, it will return true if all the arrays have the same length, otherwise it will return false.
 */
export const allArrayElementsAreEqualLength = (arr: any[][]): boolean => {
    const firstElementLength = arr[0].length;
    return arr.every((elem) => elem.length === firstElementLength);
};

// prettier-ignore
/**
 * Given an array of current values, an array of target values, and an array of arrays of values. It will return an array of indexes, representing the order of which the arrays in the array of arrays are most helpful in getting from the current values to the target values.
 */
export const sortIndexesByDistanceFromGoal = (
    current: number[],
    target: number[],
    arr: number[][]
): number[] => {
    // Check that goal and current have the same length
    if (!allArrayElementsAreEqualLength([current, target, ...arr])) {
        throw new Error("All arrays must have the same length");
    }

    const differenceBetweenGoalAndCurrent = target.map(
        (goalElem, index) => goalElem - current[index]
    );

    const differencesBetweenGoalAndArr = arr.map((elem) =>
        elem.map((subElem, index) => subElem - target[index])
    );

    const differencesBetweenGoalAndArrAndCurrent =
        differencesBetweenGoalAndArr.map((elem) =>
            elem.map(
                (subElem, index) => subElem - differenceBetweenGoalAndCurrent[index]
            )
        );

    const distancesBetweenGoalAndArrAndCurrent =
        differencesBetweenGoalAndArrAndCurrent.map((elem) =>
            elem.map((subElem) => Math.abs(subElem))
        );

    const sumOfDistancesBetweenGoalAndArrAndCurrent =
        distancesBetweenGoalAndArrAndCurrent.map((elem) =>
            elem.reduce((acc, curr) => acc + curr, 0)
        );

    const sortedIndexes = sumOfDistancesBetweenGoalAndArrAndCurrent
        .map((elem, index) => [elem, index])
        .sort((a, b) => a[0] - b[0])
        .map((elem) => elem[1]);

    return sortedIndexes;
};

// prettier-ignore
/**
 * Given an array of current values, an array of target values, and an array of arrays of values return an array of indexes. They represent all the indexes of the arrays in the array of arrays that have the same sign as the difference between the current and target values.
 */
export const filterIndexesBySameSigns = (
    current: number[],
    target: number[],
    arr: number[][]
): number[] => {
    // Check that goal and current have the same length
    if (!allArrayElementsAreEqualLength([current, target, ...arr])) {
        throw new Error("All arrays must have the same length");
    }

    const differenceBetweenGoalAndCurrent = target.map(
        (goalElem, index) => goalElem - current[index]
    );

    // Return 0 if element is negative, 1 if element is positive
    const signsOfDifferenceBetweenGoalAndCurrent =
        differenceBetweenGoalAndCurrent.map((elem) => (elem < 0 ? 0 : 1));

    const differencesBetweenCurrentAndArr = arr.map((elem) =>
        elem.map((subElem, index) => subElem - current[index])
    );

    // Return 0 if element is negative, 1 if element is positive
    const signsOfDifferencesBetweenCurrentAndArr = differencesBetweenCurrentAndArr.map(
        (elem) => elem.map((subElem) => (subElem < 0 ? 0 : 1))
    );

    const indexesOfSameSigns = signsOfDifferencesBetweenCurrentAndArr.map(
        (elem, index) =>
            // If all signs are the same, return the index, otherwise return -1
            elem.every((subElem, subIndex) => subElem === signsOfDifferenceBetweenGoalAndCurrent[subIndex])
                ? index
                : -1
    );

    const filteredIndexes = indexesOfSameSigns.filter((elem) => elem !== -1);

    return filteredIndexes;
};

// prettier-ignore
/**
 * Given an array of numbers, it will return an array of numbers representing the percentages of each number in the array (0 - 100).
 */
export const calculatePercentages = (numbers: number[]): number[] => {
    const total = numbers.reduce((acc, val) => acc + val, 0);
    const percentages = numbers.map((num) => (num / total) * 100);
    return percentages;
};

// prettier-ignore
/**
 * Given an array of values and an array of arrays of values return an ordered array of indexes. They should be ordered from most similar to least similar
 */
export const sortIndexesBySimilarity = (
    current: number[],
    arr: number[][]
): number[] => {

    // For each element in each array, calculate the difference from the current
     const differencesBetweenCurrentAndArr = arr.map((elem) =>
        elem.map((subElem, index) => subElem - current[index])
    );

    // Sum the elements
    const differenceScores = differencesBetweenCurrentAndArr.map((elem) =>
            elem.reduce((acc, curr) => acc + Math.abs(curr), 0)
        );

    const orderedScoreIndexes = differenceScores.map((elem, index) => [elem, index])
        .sort((a, b) => a[0] - b[0])
        .map((elem) => elem[1]);

    return orderedScoreIndexes;
}

// prettier-ignore
/**
 * Given an array of values, compute the modes of the array and return them in an array.
 */
export const mode = (arr: number[]): number[] => {
    const counts = arr.reduce((acc, curr) => {
        if (curr in acc) {
            acc[curr]++;
        } else {
            acc[curr] = 1;
        }
        return acc;
    }, {} as Record<number, number>);

    const maxCount = Math.max(...Object.values(counts));

    const modes = Object.entries(counts)
        .filter(([, count]) => count === maxCount)
        .map(([value]) => Number(value));

    return modes;
};
