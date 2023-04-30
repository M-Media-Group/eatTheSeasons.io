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

    console.log(
        differenceBetweenGoalAndCurrent,
        "differenceBetweenGoalAndCurrent"
    );

    const differencesBetweenGoalAndArr = arr.map((elem) =>
        elem.map((subElem, index) => subElem - target[index])
    );

    console.log(differencesBetweenGoalAndArr, "differencesBetweenGoalAndArr");

    const differencesBetweenGoalAndArrAndCurrent =
        differencesBetweenGoalAndArr.map((elem) =>
            elem.map(
                (subElem, index) => subElem - differenceBetweenGoalAndCurrent[index]
            )
        );

    console.log(
        differencesBetweenGoalAndArrAndCurrent,
        "differencesBetweenGoalAndArrAndCurrent"
    );

    const distancesBetweenGoalAndArrAndCurrent =
        differencesBetweenGoalAndArrAndCurrent.map((elem) =>
            elem.map((subElem) => Math.abs(subElem))
        );

    console.log(
        distancesBetweenGoalAndArrAndCurrent,
        "distancesBetweenGoalAndArrAndCurrent"
    );

    const sumOfDistancesBetweenGoalAndArrAndCurrent =
        distancesBetweenGoalAndArrAndCurrent.map((elem) =>
            elem.reduce((acc, curr) => acc + curr, 0)
        );

    console.log(
        sumOfDistancesBetweenGoalAndArrAndCurrent,
        "sumOfDistancesBetweenGoalAndArrAndCurrent"
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

    console.log(signsOfDifferenceBetweenGoalAndCurrent, signsOfDifferencesBetweenCurrentAndArr, "signsOfDifferencesBetweenCurrentAndArr",
        arr)

    const indexesOfSameSigns = signsOfDifferencesBetweenCurrentAndArr.map(
        (elem, index) =>
            // If all signs are the same, return the index, otherwise return -1
            elem.every((subElem, subIndex) => subElem === signsOfDifferenceBetweenGoalAndCurrent[subIndex])
                ? index
                : -1
    );

    console.log("gsa", indexesOfSameSigns)

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
