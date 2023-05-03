import tween from "@tweenjs/tween.js";
import { canvas, renderer, scene } from "../core";
import {
  PerspectiveCamera,
  AxesHelper,
  GridHelper,
  OrthographicCamera,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type DirectorCamera = PerspectiveCamera | OrthographicCamera;

//== Director ==================================================================
class Director {
  private currentCamera: DirectorCamera;
  private controls?: OrbitControls;
  private currentLookPoint: Coordinate3 = [0, 0, 0];
  private perspectiveCamera: PerspectiveCamera = new PerspectiveCamera(
    75,
    innerWidth / innerHeight
  );
  private orthographicCamera: OrthographicCamera = new OrthographicCamera(
    innerWidth / -8,
    innerWidth / 8,
    innerHeight / 8,
    innerHeight / -8,
    1,
    2000
  );

  constructor() {
    this.currentCamera = this.perspectiveCamera;
    this.currentCamera.position.set(50, 50, 50);
    this.currentCamera.lookAt(...this.currentLookPoint);

    const onResize = () => {
      this.perspectiveCamera.aspect = innerWidth / innerHeight;
      this.perspectiveCamera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    onResize();
    addEventListener("resize", onResize, false);

    //on development
    if (import.meta.env.DEV) {
      this.addHelpers(500);
      this.resetControls();
    }

    return this;
  }

  /**
   * Add helpers for debugging
   * @param option
   */
  private addHelpers(size: number) {
    scene.add(new GridHelper(size));
    scene.add(new AxesHelper(size / 2));
  }

  private resetControls() {
    this.controls?.dispose();
    this.controls = undefined;
    this.controls = new OrbitControls(this.currentCamera, canvas);
    this.controls.dampingFactor = 1;
    this.controls.enableDamping = true;
  }

  /**
   * change camera and inherits it's properties
   * @param camera
   */
  private changeCamera(camera: DirectorCamera) {
    const { x, y, z } = this.currentCamera.position;
    camera.position.set(x, y, z);
    this.currentCamera = camera;
    this.resetControls();
  }

  toggelCamear() {
    switch (this.currentCamera) {
      case this.perspectiveCamera:
        return this.changeCamera(this.orthographicCamera);
      case this.orthographicCamera:
        return this.changeCamera(this.perspectiveCamera);
    }
  }

  async move(...[cx, cy, cz, cv = 1]: Coordinate4) {
    return new Promise<void>((resolve) => {
      const { x, y, z } = this.currentCamera.position;
      const animation = new tween.Tween<Coordinate3>([x, y, z])
        .to([cx, cy, cz])
        .duration(cv * 1000)
        .easing(tween.Easing.Linear.None)
        .onUpdate((xyz) => this.currentCamera.position.set(...xyz))
        .onComplete(() => {
          tween.remove(animation);
          resolve();
        });
      animation.start();
    });
  }

  async lookAt(...[cx, cy, cz, cv = 1]: Coordinate4) {
    return new Promise<void>((resolve) => {
      const animation = new tween.Tween<Coordinate3>(this.currentLookPoint)
        .to([cx, cy, cz])
        .duration(cv * 1000)
        .easing(tween.Easing.Linear.None)
        .onUpdate((xyz) => this.currentCamera.lookAt(...xyz))
        .onComplete(() => {
          this.currentLookPoint = [cx, cy, cz];
          tween.remove(animation);
          resolve();
        });
      animation.start();
    });
  }

  /**
   * filming Scene with `current camera`
   */
  updateScene() {
    renderer.render(scene, this.currentCamera);
    // this.controls?.update();
  }

  dispose() {
    this.controls?.dispose();
    renderer.dispose();
  }
}

const director = new Director();

export default director;
