import {
  Scene,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  PointsMaterial,
  Points,
  BufferAttribute,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export const scene = new Scene();

export function createParticles() {
  const geometry = new BufferGeometry();
  const material = new PointsMaterial({ size: 0.005 });
  const counts = 1000;

  const positions = new Float32Array(counts * 3);
  const scale = Math.random() * 500;
  for (let i = 0; i < counts * 3; i++) {
    positions[i] = (Math.random() - 0.5) * scale;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  const particles = new Points(geometry, material);

  scene.add(particles);
  return particles;
}

//create the Shere model
export function createShere(options: { particle: boolean }) {
  const geometry = new SphereGeometry(10, 20, 20);
  const material = options.particle
    ? new PointsMaterial({ size: 0.05 })
    : new MeshBasicMaterial({ color: 0x00ff00 });
  const shere = options.particle
    ? new Points(geometry, material)
    : new Mesh(geometry, material);

  scene.add(shere);
  return shere;
}

export function createLine() {
  const points: Vector3[] = [
    new Vector3(-10, -10, -10),
    new Vector3(10, -10, -10),
    new Vector3(10, 10, -10),
    new Vector3(10, 10, 10),
  ];
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color: 0x0000ff });
  const line = new Line(geometry, material);

  scene.add(line);

  return line;
}

export function createTexts(value: string) {
  const fontLoader = new FontLoader();
  fontLoader.load("./fonts/helvetiker_regular.typeface.json", (font) => {
    const geometry = new TextGeometry(value, {
      font: font,
      size: 10,
      height: 1,
      curveSegments: 0.1,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 1,
      bevelEnabled: true,
    });
    const material = new MeshBasicMaterial({ color: 0xffffff });
    const text = new Mesh(geometry, material);
    scene.add(text);
  });
}
