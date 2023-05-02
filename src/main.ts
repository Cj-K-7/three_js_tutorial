import director from "./class/director";
import ModelCreator from "./class/objectSystem/modelCreator";
import LightSystem from "./class/lightSystem/mainLight";
import "./class/particleSystem/particle";
import useUtility from "./utility/utility";
import PathFinder from "./class/particleSystem/particle";

const modelCreator = new ModelCreator();
const gaffer = new LightSystem();
const textureList = [
  "blue_photo_studio_4k.hdr",
  "industrial_sunset_puresky_4k.hdr",
  "syferfontein_18d_clear_puresky_4k.hdr",
];

async function main() {
  //== Models ==================================================================
  const ball = modelCreator.createShpere();
  ball.addEnvmapTexture(textureList[0]);
  const particle = new PathFinder();
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
    particle.animate();
    requestAnimationFrame(animate);
  }

  //== Do Actions ==============================================================
  await init();
  await animate();
}

main();
