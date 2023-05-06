import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  Vector3,
} from "three";
import vertexShader from "../glsl/vertex.glsl?raw";
import fragmentShader from "../glsl/fragment.glsl?raw";
import AdvancedPoints from "../class/objectSystem/advancedPoints";

const Wall = async (): Promise<AdvancedPoints> => {
  const geoBoundary = new BoxGeometry(100, 100, 100);
  const geometry = new BufferGeometry();
  const material = new ShaderMaterial({
    blending: AdditiveBlending,
    transparent: true,
    // depthTest: false,
    depthWrite: false,
    vertexShader,
    fragmentShader,
  });

  const boundary = geoBoundary.getAttribute("position") as BufferAttribute;
  console.log(boundary);
  const particlesCount = Math.ceil(boundary.count);
  const particlesPosition = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const z = Math.random() * 100;
    particlesPosition.set([x, y, z], i * 3);
  }
  geometry.setAttribute("position", new BufferAttribute(particlesPosition, 3));
  const wall = new AdvancedPoints(geometry, material);

  wall.update = () => {
    wall.rotateOnWorldAxis(new Vector3(0.5, 0.5, 1), 0.01);
  };

  return wall;
};

export default Wall;
