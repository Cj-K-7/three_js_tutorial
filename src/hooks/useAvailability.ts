import WEBGL from "three/examples/jsm/capabilities/WebGL";

async function useWebGLAvailability() {
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

export default useWebGLAvailability;
