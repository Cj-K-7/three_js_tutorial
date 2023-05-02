import { scene } from "../../core";
import { Vector2, SphereGeometry, MeshPhysicalMaterial } from "three";
import TexturedMesh from "./texturedMesh";

class ModelCreator {
  constructor() {}

  createShpere(): TexturedMesh {
    const geometry = new SphereGeometry(100, 64, 64);
    const material = new MeshPhysicalMaterial({
      color: 0x921220,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.8,
      roughness: 1,
      normalScale: new Vector2(0.15, 0.15),
    });
    const mesh = new TexturedMesh(geometry, material);

    scene.add(mesh);
    return mesh;
  }
}

export default ModelCreator;
