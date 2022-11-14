import { Matrix3, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three'
const delta_t = 0.05
export default class Love extends Mesh {
  #matrix = new Matrix3()
  constructor(position = new Vector3()) {
    super(new SphereGeometry(), new MeshBasicMaterial())
    this.initialPosition = position
    this.#matrix.set(0, -1, 0, 1, 0, 0, 0, 0, 0);
  }
  #velocity() {
    return this.position.clone().applyMatrix3(this.#matrix).multiplyScalar(delta_t)
  }
  #romeo(t) {
    return Math.cos(t) * this.initialPosition.x - Math.sin(t) * this.initialPosition.y
  }
  #juliet(t) {
    return Math.sin(t) * this.initialPosition.x + Math.cos(t) * this.initialPosition.y
  }
  moveDiferencial() {
    const velocity = this.#velocity()
    this.position.x += velocity.x
    this.position.y += velocity.y
  }
  moveTime(t) {
    this.position.x = this.#romeo(t)
    this.position.y = this.#juliet(t)
    return this
  }
}