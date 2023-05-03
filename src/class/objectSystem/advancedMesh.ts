import { renderer, scene } from "../../core";
import {
  PMREMGenerator,
  CanvasTexture,
  DataTexture,
  Mesh,
  RepeatWrapping,
  BufferGeometry,
  MeshPhysicalMaterial,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";

const textureAssetPath = "/src/assets/textures/";

class AdvancedMesh extends Mesh<BufferGeometry, MeshPhysicalMaterial> {
  private textureLoader = new RGBELoader();
  private envmapLoader = new PMREMGenerator(renderer);

  constructor(
    geometry: BufferGeometry,
    material: MeshPhysicalMaterial,
    name: string = "default"
  ) {
    super(geometry, material);
    this.name = name;
  }

  /**
   * Change physic material and Add texture to material with texture asset file
   * @param textureFile
   * @param material
   */
  async addEnvmapTexture(textureFile: string) {
    return new Promise<void>((resolve, reject) => {
      this.textureLoader.setPath(textureAssetPath);

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

      const onError = (error: ErrorEvent) => reject(error);

      this.textureLoader.load(textureFile, onLoad, onProgress, onError);
    });
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

export default AdvancedMesh;
