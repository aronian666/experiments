<script>
    const movements = {
        ArrowRight: [0, 1],
        ArrowLeft: [0, -1],
        ArrowDown: [1, 0],
        ArrowUp: [-1, 0],
    };
    class Snake {
        constructor(size) {
            this.size = size;
            this.body = new Array(size).fill(1);
            this.position = this.body.map((x, index) => [0, this.size - index]);
            this.direction = [0, 1];
            this.movement = null;
        }
    }
    class World {
        constructor(size, snake) {
            this.size = size;
            this.snake = snake;
            this.body = new Array(size).fill(new Array(size).fill(0));
            this.meet = [
                Math.floor(Math.random() * this.size),
                Math.floor(Math.random() * this.size),
            ];
            this.score = 0;
        }
        moveSnake(direction) {
            const first = this.snake.position[0];
            this.snake.position = [
                [first[0] + direction[0], first[1] + direction[1]],
                ...this.snake.position,
            ];
            this.snake.position.pop();
            this.snake.direction = direction;
        }
        eatSnake() {
            const last = this.snake.position[this.snake.size - 1];
            const pLast = this.snake.position[this.snake.size - 2];
            const vector = [pLast[0] - last[0], pLast[1] - last[1]];
            console.log(vector);
            this.snake.position = [
                ...this.snake.position,
                [
                    this.snake.position[0] + vector[0],
                    this.snake.position[1] + vector[1],
                ],
            ];
            this.score += 1;
            this.addMeet();
        }
        addMeet() {
            const x = Math.floor(Math.random() * this.size);
            const y = Math.floor(Math.random() * this.size);

            this.meet = [x, y];
        }
        addMovement(movement) {
            const opositeMovement = movement.map((c) => c * -1);
            if (
                opositeMovement[0] === this.snake.direction[0] &&
                opositeMovement[1] === this.snake.direction[1]
            )
                return;
            this.snake.movement = movement;
        }
    }
    const includesArray = (data, arr) => {
        return data.some(
            (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
        );
    };
    let snake = new Snake(3);
    const worldSize = 30;
    let world = new World(worldSize, snake);
    document.onkeydown = (event) => {
        event = event || window.event;
        world.addMovement(movements[event.key]);
    };
    let lastTime = 0;
    const animate = (time) => {
        requestAnimationFrame(animate);
        const elapsedTime = (time - lastTime) / 1000;
        if (elapsedTime < 1 / 8) return;
        lastTime = time;
        const head = world.snake.position[0];
        const body = [...world.snake.position];
        body.shift();
        if (
            includesArray(body, head) ||
            head[0] < 0 ||
            head[1] < 0 ||
            head[0] > world.size - 1 ||
            head[1] > world.size - 1
        ) {
            alert(`Perdiste perro, score: ${world.score}`);
            resetGame();
            return;
        }
        if (head[0] === world.meet[0] && head[1] === world.meet[1]) {
            world.eatSnake();
        }
        if (world.snake.movement) {
            world.moveSnake(world.snake.movement);
        } else {
            world.moveSnake(world.snake.direction);
        }
        world.snake.movement = null;
        world = world;
    };
    requestAnimationFrame(animate);
    const resetGame = () => {
        snake = new Snake(3);
        world = new World(worldSize, snake);
    };
</script>

<h1>
    <b>Score:</b>
    {world.score}
</h1>
<div class="grid" style={`--size: ${worldSize}`}>
    {#each world.body as x, index1}
        {#each x as y, index2}
            <div
                class={includesArray(
                    [...world.snake.position, world.meet],
                    [index1, index2]
                )
                    ? "gray"
                    : ""}
            />
        {/each}
    {/each}
</div>
<div class="buttons">
    {#each Object.entries(movements) as [name, movement], i}
        <button
            style={`grid-area: ${name}`}
            on:click={() => {
                world.addMovement(movement);
            }}
        >
            {name}
        </button>
    {/each}
</div>

<style>
    .buttons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-areas:
            ". ArrowUp ."
            "ArrowLeft . ArrowRight"
            ". ArrowDown .";
    }
    .buttons > button {
        padding: 2rem 1rem;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--size), 1fr);
        max-width: 800px;
        border: 1px solid red;
    }
    .grid > div {
        aspect-ratio: 1/1;
    }
    .gray {
        background-color: gray;
    }
</style>
