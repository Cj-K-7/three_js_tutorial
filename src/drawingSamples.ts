import {
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
  PointLight,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export function createParticles() {
  const geometry = new BufferGeometry();
  const material = new PointsMaterial({ size: 0.005 });
  const counts = 500;

  const positions = new Float32Array(counts * 3);
  const scale = Math.random() * 150;
  for (let i = 0; i < counts * 3; i++) {
    positions[i] = (Math.random() - 0.5) * scale;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  const particles = new Points(geometry, material);

  return particles;
}

export function addLight() {
  const light = new PointLight(0xffffff, 1);
  light.position.set(200, 200, 200);
  return light;
}

//create the Sphere model
export function createSphere(options: { particle: boolean }) {
  const geometry = new SphereGeometry(100, 64, 64);
  const material = options.particle
    ? new PointsMaterial({ size: 0.01 })
    : new MeshBasicMaterial({ color: 0xff303030 });
  const sphere = options.particle
    ? new Points(geometry, material)
    : new Mesh(geometry, material);

  return sphere;
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

    return text;
  });
}
