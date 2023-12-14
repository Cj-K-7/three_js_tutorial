import { renderer, scene } from "../../core";
import {
  BufferGeometry,
  Material,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  MeshPhongMaterial,
  Mesh,
  CubeCamera,
  WebGLCubeRenderTarget,
  CubeRefractionMapping,
  CubeReflectionMapping,
  LinearMipMapLinearFilter,
} from "three";
import { Body as PhysicBody } from "cannon-es";
import { instanceError } from "./constant";

const REFLECTION = () => CubeReflectionMapping;
const REFRACTION = () => CubeRefractionMapping;

type CubeRenderTargetTextureType = typeof REFLECTION | typeof REFRACTION;

/**
 * # `AdvancedMesh`
 *
 * simply add some **features** to `Mesh` of three.js
 *
 * ### Features
 *   -     Life-cycle handling. ex)  animate(), dispose()
 *   -     can add REFLECTION or REFRACTION
 *
 * ### Parameters
 * @param { BufferGeometry } geometry geometry for Mesh
 * @param { Material } material material for Mesh
 *
 * @author K-CJ-7
 */
class MeshObject<
  G extends BufferGeometry = BufferGeometry,
  M extends Material = Material
> extends Mesh<G, M> {
  private cubeCamera?: CubeCamera;
  private cubeRenderTarget?: WebGLCubeRenderTarget;
  public body?: PhysicBody;

  constructor(geometry: G, material: M) {
    super(geometry, material);
  }

  private updatePhysics() {
    if (!this.body) return;
    this.position.set(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    );
    this.quaternion.set(
      this.body.quaternion.x,
      this.body.quaternion.y,
      this.body.quaternion.z,
      this.body.quaternion.w
    );
  }

  public addPhysicBody(body: PhysicBody) {
    this.body = body;
  }

  //add CubeCamera for reflection & refraction
  private assignCubeRenderTarget(
    size: number = 256,
    type: CubeRenderTargetTextureType
  ) {
    if (
      this.material instanceof
      (MeshStandardMaterial || MeshPhysicalMaterial || MeshPhongMaterial)
    ) {
      this.cubeRenderTarget ??= new WebGLCubeRenderTarget(size, {
        generateMipmaps: true,
        minFilter: LinearMipMapLinearFilter,
      });
      this.cubeRenderTarget.texture.mapping = type();
      this.cubeCamera ??= new CubeCamera(1, 1000, this.cubeRenderTarget);
      this.material.setValues({
        envMap: this.cubeRenderTarget.texture,
      });
      this.add(this.cubeCamera);
    } else {
      throw Error(
        `This material is not supported for "${type.name}". ${instanceError}`
      );
    }
  }

  /**
   * add `Reflection` texture on Material. must update frame of CubeCamera.
   * @param size default 256
   */
  public addRefelctions(size?: number) {
    this.assignCubeRenderTarget(size, REFLECTION);
  }

  /**
   * add `Refraction` texture on Material. must update frame of CubeCamera.
   * @param size default 256
   */
  public addRefractions(size?: number) {
    this.assignCubeRenderTarget(size, REFRACTION);
  }

  /**
   * update : rendering this. you can reassign this method to render new animation or upate values.
   */
  public update() {
    if (this.cubeCamera) {
      this.visible = false;
      this.cubeCamera.update(renderer, scene);
      this.visible = true;
    }
    if (this.body) {
      this.updatePhysics();
    }
  }

  /**
   * dispose : clear this geometry, material and all childs, itself from parents
   */
  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.cubeRenderTarget?.texture.dispose();
    this.cubeRenderTarget?.dispose();
    this.cubeCamera?.remove();
    this.cubeCamera = undefined;
    this.clear();
    scene.remove(this);
  }
}

export default MeshObject;