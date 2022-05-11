<script>
  class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    get length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    scale(number) {
      this.x *= number;
      this.y *= number;
      this.z *= number;
      return this;
    }
    add(number) {
      this.x += number;
      this.y += number;
      this.z += number;
      return this;
    }
  }
  const count = 20;
  const range = 0;
  let vectors = [];
  for (let y = count - 1; y >= range; y--) {
    for (let x = range; x < count; x++) {
      const vector = new Vector3(x / count, y / count);
      vectors.push(vector);
    }
  }
  /* vectors = vectors.map((vector) => {
    vector.scale(2).add(-1);
    return vector;
  }); */
  const setColor = (vector = new Vector3()) => {
    const r = parseInt(255 * vector.x);
    const g = parseInt(255 * vector.y);
    const b = parseInt(255 * vector.z);
    return `rgb(${r}, ${g}, ${b})`;
  };
</script>

<div style={`grid-template-columns: repeat(${count}, 1fr);`}>
  {#each vectors as vector}
    <section style={`background-color: ${setColor(vector)}`}>
      [{vector.x.toFixed(1)}, {vector.y.toFixed(1)}]
    </section>
  {/each}
</div>

<style>
  div {
    display: grid;
    width: 45%;
    margin: auto;
  }
  section {
    aspect-ratio: 1;
    font-size: 0.3rem;
  }
</style>
