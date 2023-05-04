import director from "./class/director";
import tween from "@tweenjs/tween.js";
import LightSystem from "./class/lightSystem/lightSystem";
import { initScenario, updateScenario } from "./scenario";
import useUtility from "./utility/utility";

async function main() {
  //== Models ==================================================================
  // const gaffer = new LightSystem();
  new LightSystem();

  //== LifeCycles ==============================================================
  /**
   * intialize WebGL with THREE.js
   **/
  async function init() {
    await initScenario();
  }

  /**
   * start update 3D rendering display
   */
  async function animate() {
    director.updateScene();
    updateScenario();
    tween.update();
    requestAnimationFrame(animate);
  }

  //== Do Actions ==============================================================
  await useUtility();
  await init();
  await animate();
}

main();
