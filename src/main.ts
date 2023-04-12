import WEBGL from "three/examples/jsm/capabilities/WebGL";
import director from "./class/director";
import camera from "./class/camera";
import { createHighQualitySphere, addLight } from "./drawing";

async function main() {
  //Check capabilities of WEBGL=================================================
  const isWebGLAvailable = WEBGL.isWebGLAvailable();
  if (!isWebGLAvailable) {
    const errorMessage = WEBGL.getWebGLErrorMessage();
    document.appendChild(errorMessage);
    return;
  }

  //Models======================================================================
  addLight();
  createHighQualitySphere(director.renderer);

  //Functions===================================================================

  function animate() {
    director.render(camera);
    requestAnimationFrame(animate);
  }

  //Utills===================================================================

  function addWindowSizer() {
    director.resize();
    window.addEventListener("resize", director.resize, false);
  }

  //LifeCycles==================================================================
  /**
   * intialize WebGL with THREE.js
   **/
  async function init() {
    addWindowSizer();
    director.addHelpers({});
    camera.addOrbitControl(director.canvas);
  }

  /**
   * update 3D rendering
   */
  async function update() {
    animate();
  }

  try {
    await init();
    await update();
  } catch (error) {
    console.error(error);
  }
}

main();
