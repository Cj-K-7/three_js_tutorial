import { renderer, scene } from "../core";
import { AxesHelper, GridHelper } from "three";
import MovieCamera from "./camera";

//== Director ==================================================================
class Director {
  private currentCamera: MovieCamera;
  private mainCamera: MovieCamera;

  constructor() {
    this.mainCamera = new MovieCamera();
    this.currentCamera = this.mainCamera;
    //on development
    if (import.meta.env.DEV) {
      this.addHelpers(1000);
    }

    return this;
  }

  /**
   * Add helpers for debugging
   * @param option
   */
  public addHelpers(size: number): void {
    scene.add(new GridHelper(size));
    scene.add(new AxesHelper(size / 2));
  }

  public changeCamera(camera: MovieCamera = this.mainCamera): void {
    this.currentCamera = camera;
  }
  /**
   * filming Scene with `camera`
   * @param camera
   */
  public filming(): void {
    renderer.render(scene, this.currentCamera);
    this.currentCamera.update();
  }
}

const director = new Director();

export default director;
