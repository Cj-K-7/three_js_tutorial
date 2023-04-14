import { renderer } from "../core";
import WEBGL from "three/examples/jsm/capabilities/WebGL";

async function checkCapabilityOfDoc() {
  return new Promise<boolean>((resolve) => {
    const isWebGLAvailable = WEBGL.isWebGLAvailable();
    if (!isWebGLAvailable) {
      const errorMessage = WEBGL.getWebGLErrorMessage();
      document.appendChild(errorMessage);
      return resolve(false);
    }
    resolve(true);
  });
}

/**
 * @constructor of Utility
 *
 * 1. Window resize handler
 */
async function useWindowUtils() {
  //decalre
  function addWindowResizHandler(): void {
    const onResize = (): void => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    };
    onResize();
    window.addEventListener("resize", onResize, false);
  }

  //action
  addWindowResizHandler();
}

async function useUtility() {
  await checkCapabilityOfDoc();
  await useWindowUtils();
}

export default useUtility;
