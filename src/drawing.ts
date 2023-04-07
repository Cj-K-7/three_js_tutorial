import {
  Scene,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  MeshBasicMaterial,
  Mesh,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export function createLine(scene: Scene) {
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

export function createTexts(scene: Scene, value: string) {
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
