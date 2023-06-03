import {
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from "three";
import MeshObject from "../class/objectSystem/1.MeshObject";
import colorMapJpg from "../assets/imgs/Sand_COLOR.jpg";
import normalMapJpg from "../assets/imgs/Sand_NRM.jpg";
import dispMapJpg from "../assets/imgs/Sand_DISP.jpg";
import aoMapJpg from "../assets/imgs/Sand_OCC.jpg";

let colorMap = "./assets/imgs/Sand_COLOR.jpg";
let normalMap = "./assets/imgs/Sand_NRM.jpg";
let dispMap = "./assets/imgs/Sand_DISP.jpg";
let aoMap = "./assets/imgs/Sand_OCC.jpg";

const Terrain = () => {
  const textureLoader = new TextureLoader();
  const sandBaseColor = textureLoader.load(
    import.meta.env.DEV ? colorMapJpg : colorMap
  );
  const sandNormalMap = textureLoader.load(
    import.meta.env.DEV ? normalMapJpg : normalMap
  );
  const sandDisplaceMap = textureLoader.load(
    import.meta.env.DEV ? dispMapJpg : dispMap
  );
  const sandAO = textureLoader.load(import.meta.env.DEV ? aoMapJpg : aoMap);

  const WIDTH = 100;
  const LENGTH = 100;

  const geometry = new PlaneGeometry(WIDTH, LENGTH, 512, 512);
  const material = new MeshStandardMaterial({
    color: 0xffa0a0a0,
    map: sandBaseColor,
    normalMap: sandNormalMap,
    displacementScale: 0.1,
    displacementMap: sandDisplaceMap,
    aoMap: sandAO,
  });

  wrapAndRepeatTexture(material.map!);
  wrapAndRepeatTexture(material.normalMap!);
  wrapAndRepeatTexture(material.displacementMap!);
  wrapAndRepeatTexture(material.aoMap!);
  // const material = new THREE.MeshPhongMaterial({ map: placeholder})

  const terrain = new MeshObject(geometry, material);
  terrain.receiveShadow = true;
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;

  function wrapAndRepeatTexture(map: Texture) {
    map.wrapS = map.wrapT = RepeatWrapping;
    map.repeat.x = map.repeat.y = 10;
  }

  return terrain;
};

export default Terrain;
