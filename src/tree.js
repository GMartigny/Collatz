class Leaf {
    constructor(value) {
        this.children = [];
        this.value = value;
        this.depth = 0;
    }

    /**
     *
     * @param {Leaf} nodes
     * @return {Leaf}
     */
    add(...nodes) {
        nodes.forEach((node) => {
            node.depth = this.depth + 1;
            this.children.push(node);
        });
        return this;
    }
}

export {
    Leaf,
};
