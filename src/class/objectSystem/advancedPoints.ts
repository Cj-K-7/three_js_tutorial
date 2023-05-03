import { BufferGeometry, Points, PointsMaterial, ShaderMaterial } from "three";
import { scene } from "../../core";

type ParticleMaterial = PointsMaterial | ShaderMaterial;

class AdvancedPoints extends Points<BufferGeometry, ParticleMaterial> {
  constructor(
    geometry: BufferGeometry,
    material: ParticleMaterial,
    name: string = "default"
  ) {
    super(geometry, material);
    this.name = name;
  }

  /**
   * dispose : clear this geometry, material and all childs, itself from parents
   */
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.clear();
    scene.remove(this);
  }
}

export default AdvancedPoints;
