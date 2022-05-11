<script>
    import { Vector2 } from "three";

    const glass = {
        vector: new Vector2(300, 100),
    };
    const coordinates = [new Vector2(25, 50), new Vector2(25, 50)];

    // [230, 50], [25, 50] = [255 * 50]
    // [100, 100], [50, 30], [25, 50] => [100, 100], [50, 55]
    const sort = (coordinates) => {
        return coordinates.sort((a, b) => {
            return a.length() - b.length();
        });
    };
    const getCombinations = (coordinates = [], threads = []) => {
        coordinates = sort(coordinates);
        if (coordinates.length < 2) return coordinates;
        const first = coordinates[0];
        const second = coordinates[1];
        const vector = search(first, second);
        vector.forEach((c) => {
            threads.push([c, ...coordinates.slice(2, coordinates.length)]);
        });
        return threads;
    };
    const mierda = getCombinations(coordinates);
    console.log(mierda);
    function search(first, second) {
        const axles = ["x", "y"];
        const combinations = [];
        for (let x = 0; x < 2; x++) {
            const uno = axles[x];
            for (let y = 0; y < 2; y++) {
                const dos = axles[y];
                if (first[uno] === second[dos]) {
                    const ga1 = uno === "x" ? "y" : "x";
                    const ga2 = dos === "x" ? "y" : "x";
                    const vector = new Vector2(
                        first[uno],
                        first[ga1] + second[ga2]
                    );
                    vector.vectors = [first, second];
                    combinations.push(vector);
                }
            }
        }
        return combinations;
    }
</script>
