import WEBGL from "three/examples/jsm/capabilities/WebGL";
import Director from "./class/director";
import { createSphere, createParticles } from "./drawing";

async function main() {
  //Check capabilities of WEBGL=================================================
  const isWebGLAvailable = WEBGL.isWebGLAvailable();
  if (!isWebGLAvailable) {
    const errorMessage = WEBGL.getWebGLErrorMessage();
    document.appendChild(errorMessage);
    return;
  }

  //Models======================================================================

  createSphere({ particle: true });
  createParticles();

  //Functions===================================================================

  function animate() {
    Director.render();
    requestAnimationFrame(animate);
  }

  //Utills===================================================================

  function windowSizer() {
    Director.resize();
    window.addEventListener("resize", Director.resize, false);
  }

  //LifeCycles==================================================================
  /**
   * intialize WebGL with THREE.js
   **/
  async function init() {
    windowSizer();
    Director.addOrbitControl();
  }

  /**
   * update 3D rendering
   */
  async function update() {
    animate();
    Director.render();
  }

  try {
    await init();
    await update();
  } catch (error) {
    console.error(error);
  }
}

main();
