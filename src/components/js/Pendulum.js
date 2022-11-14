import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
const gravity = -10
const mu = - 0.3
const delta_t = 0.1
export default class Pendulum extends Mesh {
  constructor(large = 1, theta = 0, theta_dot = 0) {
    super(new SphereGeometry(1, 16, 32), new MeshBasicMaterial())
    this.large = large
    this.theta = theta
    this.theta_dot = theta_dot
  }
  double_theta() {
    return this.theta_dot * mu + gravity / this.large * Math.sin(this.theta)
  }
  move() {
    const double_theta = this.double_theta()
    this.theta += this.theta_dot * delta_t
    this.theta_dot += double_theta * delta_t
    this.position.x = Math.sin(this.theta) * this.large
    this.position.y = - Math.cos(this.theta) * this.large
    return this
  }
}