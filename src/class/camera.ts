import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const initialCameraSetting: CameraSetting = {
  position: [200, 200, 200],
  point: [0, 0, 0],
};

class AppCamera extends PerspectiveCamera {
  constructor() {
    super(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.setPosition();
  }

  /**
   * Setting Camera Position & Point
   * @param position position & point ( vertor 3 )
   */
  public setPosition(position: Axis = initialCameraSetting.position): void {
    const [x, y, z] = position;
    this.position.set(x, y, z);
  }

  /**
   * Setting Camera Point
   * @param point point ( vertor 3 )
   */

  /**
   * Add orbit controls
   */
  public addOrbitControl(domElement: HTMLCanvasElement) {
    new OrbitControls(this, domElement);
  }
}

const camera = new AppCamera();

export default camera;
