import WEBGL from "three/examples/jsm/capabilities/WebGL";
import { PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  scene,
  createLine,
  createTexts,
  createShere,
  createParticles,
} from "./drawing";

async function main() {
  //Check capabilities of WEBGL=================================================

  const isWebGLAvailable = WEBGL.isWebGLAvailable();
  if (!isWebGLAvailable) {
    const errorMessage = WEBGL.getWebGLErrorMessage();
    document.appendChild(errorMessage);
    return;
  }

  //Variables===================================================================

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  const camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const controls = new OrbitControls(camera, canvas);

  //Settings====================================================================

  camera.position.set(100, 100, 100);
  camera.lookAt(0, 0, 0);

  //Models======================================================================

  createShere({ particle: true });
  createParticles();

  //Functions===================================================================

  function setRenderSize() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  //Callbacks===================================================================

  const onResize = () => {
    setRenderSize();
  };

  //LifeCycles==================================================================

  /**
   * then intialize THREE.js
   **/
  async function init() {
    setRenderSize();
    window.addEventListener("resize", onResize, false);
  }

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
