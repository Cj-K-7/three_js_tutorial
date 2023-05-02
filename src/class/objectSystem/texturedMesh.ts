import { renderer } from "../../core";
import {
  PMREMGenerator,
  BufferGeometry,
  MeshStandardMaterial,
  CanvasTexture,
  DataTexture,
  Mesh,
  RepeatWrapping,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";

const textureAssetPath = "/src/assets/textures/";
const textureLoader = new RGBELoader();
const envmapLoader = new PMREMGenerator(renderer);
textureLoader.setPath(textureAssetPath);

class TexturedMesh extends Mesh<BufferGeometry, MeshStandardMaterial> {
  /**
   * Add texture to material with texture asset file
   * @param textureFile
   * @param material
   */
  addEnvmapTexture(textureFile: string): void {
    const onLoad = (dataTexture: DataTexture) => {
      const envMap = envmapLoader.fromCubemap(dataTexture as any).texture;
      const normalMap = new CanvasTexture(new FlakesTexture());

      this.material.setValues({ normalMap, envMap });

      normalMap.wrapS = RepeatWrapping;
      normalMap.wrapT = RepeatWrapping;
      normalMap.repeat.set(10, 10);
    };

    // const onProgress = (event: ProgressEvent<EventTarget>) => {
    //   return console.log(event);
    // };
    const onError = (error: ErrorEvent) => {
      return console.error(error);
    };

    textureLoader.load(textureFile, onLoad, () => {}, onError);
  }
}

export default TexturedMesh;
