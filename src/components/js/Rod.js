import { Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial } from "three";

const material = new ShaderMaterial({
  vertexShader: `
    varying vec3 vPosition;
    
    void main(){
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.z = sin(modelPosition.x);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
      vPosition = position;
    }
  `,
  fragmentShader: `
    precision mediump float;
    varying vec3 vPosition;  
    void main(){
      float color = sin(vPosition.x);
      gl_FragColor = vec4(vPosition, 1.0);
    }
  `
})
export default class Rod extends Mesh {
  constructor(large = 1) {
    super(new PlaneGeometry(large, large, large * 20, large * 20), material)
    this.large = large
  }
}

