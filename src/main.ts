import director from "./class/director";
import ModelCreator from "./class/objectSystem/modelCreator";
import useUtility from "./utility/utility";
import Gaffer from "./class/lightSystem/mainLight";

const modelCreator = new ModelCreator();
const gaffer = new Gaffer();
const textureList = [
  "blue_photo_studio_4k.hdr",
  "industrial_sunset_puresky_4k.hdr",
  "syferfontein_18d_clear_puresky_4k.hdr",
];

async function main() {
  //== Models ==================================================================
  const ball = modelCreator.createShpere();
  ball.addTexture(textureList[0]);

  //== LifeCycles ==============================================================
  /**
   * intialize WebGL with THREE.js
   **/
  async function init() {
    await useUtility();
  }

  /**
   * start update 3D rendering display
   */
  async function animate() {
    director.filming();
    requestAnimationFrame(animate);
  }

  //== Do Actions ==============================================================
  try {
    await init();
    await animate();
  } catch (error) {
    console.error(error);
  }
}

main();
