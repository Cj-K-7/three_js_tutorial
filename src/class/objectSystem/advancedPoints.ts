import {
  BufferGeometry,
  Material,
  Points,
  PointsMaterial,
  ShaderMaterial,
} from "three";
import { scene } from "../../core";

type AdvancedParticleMaterial = PointsMaterial | ShaderMaterial;

class AdvancedPoints<
  G extends BufferGeometry = BufferGeometry,
  M extends Material = Material
> extends Points<G, M> {
  constructor(geometry: G, material: M) {
    super(geometry, material);
  }

  /**
   * update : rendering this. you can reassign this method to render new animation or upate values.
   */
  update() {}

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
