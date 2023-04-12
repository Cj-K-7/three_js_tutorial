import director from "./class/director";
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
  MeshPhysicalMaterial,
  PointLight,
  CanvasTexture,
  RepeatWrapping,
  MeshPhysicalMaterialParameters,
  Vector2,
  PMREMGenerator,
  WebGLRenderer,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
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

  director.add(particles);
  return particles;
}

export function addLight() {
  const light = new PointLight(0xffffff, 1);
  light.position.set(200, 200, 200);
  director.add(light);
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

  director.add(sphere);
  return sphere;
}

export function createHighQualitySphere(renderer: WebGLRenderer): void {
  const envmapLoader = new PMREMGenerator(renderer);
  new RGBELoader()
    .setPath("/src/assets/textures/")
    .load("blue_photo_studio_4k.hdr", (hdrmap) => {
      const envmap = envmapLoader.fromCubemap(hdrmap as any);
      const texture = new CanvasTexture(new FlakesTexture());
      const geometry = new SphereGeometry(100, 64, 64);
      const materialParams: MeshPhysicalMaterialParameters = {
        color: 0xff8032a0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        metalness: 0.6,
        roughness: 0.6,
        normalMap: texture,
        normalScale: new Vector2(0.15, 0.15),
        envMap: envmap.texture,
      };
      const material = new MeshPhysicalMaterial(materialParams);
      const mesh = new Mesh(geometry, material);
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(10, 10);
      director.add(mesh);

      return mesh;
    });
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

  director.add(line);

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
    director.add(text);
  });
}
