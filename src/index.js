import { Leaf } from "./tree.js";
import { collatz } from "./collatz.js";


/**
 * @param {Function} fn
 * @param {string} name
 */
function time(fn, name) {
    console.time(name);
    fn();
    console.timeEnd(name);
}

/**
 * @param {number} max
 * @return {Leaf}
 */
function work(max) {
    if (max < 2) {
        throw new Error(`I really don't want to handle weird negative edge case, the minimum is 2. ;)`);
    }

    const root = new Leaf(1);

    /**
     * @param {Leaf[]} todo
     * @return {Leaf[]}
     */
    function step(todo) {
        const generated = [];

        todo.forEach((current) => {
            const children = collatz(current.value).map(value => new Leaf(value));
            current.add(...children);
            generated.push(...children);
        });

        return generated;
    }

    let todo = [root];

    for (let i = 1; i < max; ++i) {
        todo = step(todo);
    }

    return root;
}

export {
    work,
};
