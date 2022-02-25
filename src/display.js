/**
 * @param {Object} Pencil
 * @param {Function?} createCanvas
 */
function inject(Pencil, createCanvas) {
    const plugin = {
        name: "Collatz",

        install(Pencil) {
            const { Ellipse, Text, Color } = Pencil;
            class Node extends Ellipse {
                /**
                 * @param {*} value
                 */
                constructor(value) {
                    const text = new Text(undefined, value, {
                        origin: "center",
                    });
                    super(undefined, (text.width + 16) * 0.5, 18);
                    this.value = value;
                    text.setOptions({
                        fill: this.options.stroke,
                    });
                    this.add(text);
                }

                setColor() {
                    const { log } = Math;
                    this.setOptions({
                        fill: new Color(Node.colors[0]).lerp(Node.colors[1], log(this.value) / log(Node.maxValue)),
                    });
                }

                static get defaultOptions () {
                    return {
                        ...super.defaultOptions,
                        fill: "#3f3f3f",
                        stroke: "#fff",
                        strokeWidth: 1,
                        zIndex: 10,
                    }
                }
            }
            Node.maxValue = 0;
            Node.colors = ["#1e0188", "#d28906"];
            Pencil.Node = Node;

            if (createCanvas) {
                Pencil.OffScreenCanvas.getDrawingContext = (width, height) => createCanvas(width, height).getContext("2d");
            }
        }
    }
    Pencil.use(plugin);

    /**
     * @param {Leaf} root
     * @param {{ width, height }} size
     * @return {string}
     */
    function draw(root, { width, height }) {
        const { OffScreenCanvas, LinearGradient, Line, Spline, Node } = Pencil;

        const depths = {};

        const lines = [];
        const lineOptions = {
            stroke: Node.defaultOptions.stroke,
            strokeWidth: 4,
            absolute: true,
        };
        let max = 0;
        /**
         * @param {Leaf} current
         * @param {Node?} parent
         */
        function makeNodes(current, parent) {
            const node = new Node(current.value);
            max = Math.max(max, current.value);
            if (!depths[current.depth]) {
                depths[current.depth] = []
            }
            depths[current.depth].push(node);
            current.children.forEach((child) => {
                const target = makeNodes(child, node);
                lines.push(new Line(node.position, [target.position], lineOptions));
            });
            return node;
        }

        const scene = new OffScreenCanvas(width, height);
        scene.setOptions({
            fill: new LinearGradient([0, 0], [0, height], {
                0: "#08214d",
                1: "#030d1f",
            }),
        });

        makeNodes(root);
        Node.maxValue = max;

        const nodes = [];
        Object.keys(depths).forEach((depth, iDepth, { length: nbDepth }) => {
            depths[depth].forEach((node, index, { length }) => {
                node.setColor();
                node.position.set((width / length) * (index + 0.5), height - ((height / nbDepth) * (iDepth + 0.5)));
                nodes.push(node);
            });
        });

        const firstNodePos = nodes[0].position;
        scene
            .add(
                ...lines,
                new Spline(firstNodePos, [nodes[1].position.clone().subtract(firstNodePos).add(80, 0), nodes[2].position.clone().subtract(firstNodePos)], 0.5, lineOptions),
                ...nodes,
            )
            .render();

        return scene.ctx.canvas.toDataURL();
    }

    return draw;
}

export {
    inject,
};
