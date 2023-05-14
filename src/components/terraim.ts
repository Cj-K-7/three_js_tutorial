import {
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from "three";
import AdvancedMesh from "../class/objectSystem/advancedMesh";
import colorMapJpg from "../assets/imgs/Sand_COLOR.jpg";
import normalMapJpg from "../assets/imgs/Sand_NRM.jpg";
import dispMapJpg from "../assets/imgs/Sand_DISP.jpg";
import aoMapJpg from "../assets/imgs/Sand_OCC.jpg";

const Terrain = () => {
  const textureLoader = new TextureLoader();
  const sandBaseColor = textureLoader.load(colorMapJpg);
  const sandNormalMap = textureLoader.load(normalMapJpg);
  const sandDisplaceMap = textureLoader.load(dispMapJpg);
  const sandAO = textureLoader.load(aoMapJpg);

  const WIDTH = 100;
  const LENGTH = 100;

  const geometry = new PlaneGeometry(WIDTH, LENGTH, 512, 512);
  const material = new MeshStandardMaterial({
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

  const terrain = new AdvancedMesh(geometry, material);
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
