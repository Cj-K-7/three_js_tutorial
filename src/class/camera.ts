import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class MovieCamera extends PerspectiveCamera {
  private orbitControls?: OrbitControls;

  constructor() {
    super(75, window.innerWidth / window.innerHeight, 0.1, 2000);

    this.setPosition(100, 100, 100);

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
  public setPosition(...position: Coordinate): void {
    this.position.set(...position);
  }

  /**
   * Setting Camera Point
   * @param point point ( vertor 3 )
   */
  public setPoint(...position: Coordinate): void {
    this.position.set(...position);
  }
}

export default MovieCamera;
