import {
  CanvasTexture,
  DataTexture,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PMREMGenerator,
  RepeatWrapping,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import MeshObject from "./1.MeshObject";
import { renderer } from "../../core";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";
import { instanceError } from "./constant";

class TextureManager {
  static textureAssetPath = "/src/assets/textures/";

  private rgbeLoader: RGBELoader;
  private pmremGenerator: PMREMGenerator;

  constructor() {
    this.rgbeLoader = new RGBELoader();
    this.pmremGenerator = new PMREMGenerator(renderer);
  }

  /**
   * Change physic material and Add texture to material with texture asset file
   * @param textureFile
   * @param material
   */
  public async addEnvmapTexture(components: MeshObject, textureFile: string) {
    this.rgbeLoader.setPath(TextureManager.textureAssetPath);

    return new Promise<void>((resolve, reject) => {
      const onLoad = (dataTexture: DataTexture) => {
        if (
          !(
            components.material instanceof
            (MeshStandardMaterial || MeshPhysicalMaterial || MeshPhongMaterial)
          )
        )
          throw Error(
            `This material is not supported for 'envMap' texture. ${instanceError}`
          );
        //set path of texture
        const flakeTexture = new FlakesTexture();
        const normalMap = new CanvasTexture(flakeTexture);
        const envMap = this.pmremGenerator?.fromCubemap(
          dataTexture as any
        ).texture;

        normalMap.repeat.set(RepeatWrapping, RepeatWrapping);
        components.material.setValues({
          normalMap,
          envMap,
        });

        normalMap.dispose();
        envMap.dispose();

        resolve();
      };

      const onProgress = () => {};

      const onError = (error: ErrorEvent) => {
        reject(error);
      };

      this.rgbeLoader?.load(textureFile, onLoad, onProgress, onError);
    });
  }

  dispose() {
    this.pmremGenerator?.dispose();
  }
}

export default TextureManager;
