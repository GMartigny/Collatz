/**
 * @param {number} nb
 * @return {boolean}
 */
function isOdd(nb) {
    return nb % 2;
}

/**
 * @param {number} nb
 * @return {boolean}
 */
function isInteger(nb) {
    return (nb % 1) === 0;
}

/**
 * @param {number} seed
 * @return {Array<number>}
 */
function collatz(seed) {
    const results = [seed * 2];

    const potential = (seed - 1) / 3;
    if (potential !== 1 && isInteger(potential) && isOdd(potential)) {
        results.push(potential);
    }

    return results;
}

export {
    collatz,
};
