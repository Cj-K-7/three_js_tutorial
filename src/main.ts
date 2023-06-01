import useWebGLAvailability from "./hooks/useAvailability";
import cameraMan from "./class/cameraMan";
import LightSystem from "./class/lightSystem/lightSystem";
import Tween from "@tweenjs/tween.js";
import scenario1 from "./scenario";
import scenario2 from "./scenario2";

const scenarios = [scenario1, scenario2];
const index = 0;
const currentScenarios = scenarios[index];

async function main() {
  //== Models ==================================================================
  const gaffer = new LightSystem();

  gaffer.addAmbientLight();
  gaffer.addDirectionLight();
  //== LifeCycles ==============================================================
  /**
   * intialize WebGL with THREE.js
   **/
  async function init() {
    await currentScenarios.initScenario();
  }

  /**
   * start update 3D rendering display
   */
  async function animate() {
    cameraMan.updateScene();
    currentScenarios.updateScenario();
    Tween.update();
    requestAnimationFrame(animate);
  }

  //== Do Actions ==============================================================
  await useWebGLAvailability();
  await init();
  await animate();
}

main();
