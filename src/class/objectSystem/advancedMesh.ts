import { renderer, scene } from "../../core";
import {
  CanvasTexture,
  DataTexture,
  BufferGeometry,
  Material,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  MeshPhongMaterial,
  Mesh,
  CubeCamera,
  WebGLCubeRenderTarget,
  PMREMGenerator,
  RepeatWrapping,
  CubeRefractionMapping,
  CubeReflectionMapping,
  LinearMipMapLinearFilter,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";

const cubeCameraAvailables = [
  "\n\tMeshStandardMaterial",
  "\n\tMeshPhysicalMaterial",
  "\n\tMeshPhongMaterial",
];
const instanceError = `\nit must be one of these Class instance \n\n [ ${cubeCameraAvailables} \n ]\n`;

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
class AdvancedMesh<
  G extends BufferGeometry = BufferGeometry,
  M extends Material = Material
> extends Mesh<G, M> {
  private cubeCamera?: CubeCamera;
  private cubeRenderTarget?: WebGLCubeRenderTarget;

  constructor(geometry: G, material: M) {
    super(geometry, material);
  }

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
  addRefelctions(size?: number) {
    this.assignCubeRenderTarget(size, REFLECTION);
  }

  /**
   * add `Refraction` texture on Material. must update frame of CubeCamera.
   * @param size default 256
   */
  addRefractions(size?: number) {
    this.assignCubeRenderTarget(size, REFRACTION);
  }

  //TODO : update this to scene and use reflection instead.
  /**
   * Change physic material and Add texture to material with texture asset file
   * @param textureFile
   * @param material
   */
  async addEnvmapTexture(textureFile: string) {
    const textureAssetPath = "/src/assets/textures/";
    const textureLoader = new RGBELoader();
    const envmapLoader = new PMREMGenerator(renderer);
    textureLoader.setPath(textureAssetPath);

    return new Promise<void>((resolve, reject) => {
      const onLoad = (dataTexture: DataTexture) => {
        if (
          !(
            this.material instanceof
            (MeshStandardMaterial || MeshPhysicalMaterial || MeshPhongMaterial)
          )
        )
          throw Error(
            `This material is not supported for 'envMap' texture. ${instanceError}`
          );
        const normalMap = new CanvasTexture(new FlakesTexture());
        const envMap = envmapLoader.fromCubemap(dataTexture as any).texture;
        const material = this.material;
        normalMap.repeat.set(RepeatWrapping, RepeatWrapping);
        material.setValues({
          normalMap,
          envMap,
        });
        resolve();
      };

      const onProgress = () => {};

      const onError = (error: ErrorEvent) => {
        reject(error);
      };

      textureLoader.load(textureFile, onLoad, onProgress, onError);
    });
  }

  /**
   * update : rendering this. you can reassign this method to render new animation or upate values.
   */
  update() {
    if (this.cubeCamera) {
      this.visible = false;
      this.cubeCamera.update(renderer, scene);
      this.visible = true;
    }
  }

  /**
   * dispose : clear this geometry, material and all childs, itself from parents
   */
  dispose() {
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

export default AdvancedMesh;
