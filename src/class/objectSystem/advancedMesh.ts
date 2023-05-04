import { renderer, scene } from "../../core";
import {
  PMREMGenerator,
  CanvasTexture,
  DataTexture,
  Mesh,
  RepeatWrapping,
  BufferGeometry,
  MeshPhysicalMaterial,
  MeshPhongMaterial,
  CubeCamera,
  WebGLCubeRenderTarget,
  LinearMipMapLinearFilter,
  MeshStandardMaterial,
  CubeRefractionMapping,
  CubeReflectionMapping,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";

const textureAssetPath = "/src/assets/textures/";
const REFLECTION = CubeReflectionMapping;
const REFRACTION = CubeRefractionMapping;

type CubeRenderTargetTextureType = typeof REFLECTION | typeof REFRACTION;

type AdvancedMaterial =
  | MeshStandardMaterial
  | MeshPhysicalMaterial
  | MeshPhongMaterial;

class AdvancedMesh extends Mesh<BufferGeometry, AdvancedMaterial> {
  private textureLoader = new RGBELoader();
  private envmapLoader = new PMREMGenerator(renderer);
  private cubeCamera?: CubeCamera;
  private cubeRenderTarget?: WebGLCubeRenderTarget;

  constructor(geometry: BufferGeometry, material: AdvancedMaterial) {
    super(geometry, material);
    this.textureLoader.setPath(textureAssetPath);
  }

  assignCubeRenderTarget(
    size: number = 1000,
    type: CubeRenderTargetTextureType
  ) {
    this.cubeRenderTarget ??= new WebGLCubeRenderTarget(size, {
      generateMipmaps: true,
      minFilter: LinearMipMapLinearFilter,
    });
    this.cubeRenderTarget.texture.mapping = type;
    this.cubeCamera ??= new CubeCamera(1, 1000, this.cubeRenderTarget);
    this.material.setValues({
      envMap: this.cubeRenderTarget.texture,
    });
    this.add(this.cubeCamera);
  }

  /**
   * add `Reflection` texture on Material. must update frame of CubeCamera.
   * @param size
   */
  addRefelctions(size?: number) {
    this.assignCubeRenderTarget(size, REFLECTION);
  }

  /**
   * add `Refraction` texture on Material. must update frame of CubeCamera.
   * @param size
   */
  addRefractions(size: number = 1000) {
    this.assignCubeRenderTarget(size, REFRACTION);
  }

  //TODO : update this to scene and use reflection instead.
  /**
   * Change physic material and Add texture to material with texture asset file
   * @param textureFile
   * @param material
   */
  async addEnvmapTexture(textureFile: string) {
    return new Promise<void>((resolve, reject) => {
      const onLoad = (dataTexture: DataTexture) => {
        const normalMap = new CanvasTexture(new FlakesTexture());
        const envMap = this.envmapLoader.fromCubemap(
          dataTexture as any
        ).texture;

        normalMap.repeat.set(RepeatWrapping, RepeatWrapping);
        this.material.setValues({
          normalMap,
          envMap,
        });
        resolve();
      };

      const onProgress = () => {};

      const onError = (error: ErrorEvent) => {
        reject(error);
      };

      this.textureLoader.load(textureFile, onLoad, onProgress, onError);
    });
  }

  /**
   * update CubeCamera
   */
  updateCubeCamera() {
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
