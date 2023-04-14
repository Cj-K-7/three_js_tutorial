import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class MovieCamera extends PerspectiveCamera {
  private orbitControls?: OrbitControls;
  private initialSettings: CameraSetting = {
    position: [200, 250, 200],
    point: [0, 0, 0],
  };

  constructor() {
    super(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.setPosition(...this.initialSettings.position);

    //on development
    if (import.meta.env.DEV) {
      this.orbitControls = new OrbitControls(
        this,
        document.getElementById("canvas")!
      );
      this.orbitControls.dampingFactor = 1;
      this.orbitControls.enableDamping = true;
    }
  }

  public update(): void {
    if (this.orbitControls) {
      this.orbitControls.update();
    }
  }

  /**
   * Setting Camera Position
   * @param position position ( vertor 3 )
   */
  public setPosition(...position: Axes): void {
    this.position.set(...position);
  }

  /**
   * Setting Camera Point
   * @param point point ( vertor 3 )
   */
  public setPoint(...position: Axes): void {
    this.position.set(...position);
  }
}

export default MovieCamera;
