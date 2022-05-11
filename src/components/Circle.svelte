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
    clone() {
      return new Vector3(this.x, this.y, this.z);
    }
    add(number) {
      this.x += number;
      this.y += number;
      this.z += number;
      return this;
    }
    addVector(vector) {
      this.x += vector.x;
      this.y += vector.y;
      this.z += vector.z;
      return this;
    }
    transform(vectorX, vectorY) {
      return vectorX
        .clone()
        .scale(this.x)
        .addVector(vectorY.clone().scale(this.y));
    }
  }
  const count = 40;
  const range = 0;
  let vectors = [];
  for (let y = count - 1; y >= range; y--) {
    for (let x = range; x < count; x++) {
      const vector = new Vector3(x / count, y / count);
      vectors.push(vector);
    }
  }
  vectors = vectors.map((vector) => {
    vector.scale(2).add(-1);
    return vector;
  });
  const vectorX = new Vector3(1, 0, 0);
  const vectorY = new Vector3(1, 1, 0);
  vectors = vectors.map((vector) => {
    return vector.transform(vectorX, vectorY);
  });
  vectors = vectors.map((vector) => {
    return new Vector3(vector.length, vector.length, vector.length);
  });

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
      {vector.x.toFixed(1)}, {vector.y.toFixed(1)}
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
    font-size: 0.1rem;
  }
</style>