import {
  AxesHelper,
  GridHelper,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const initialCameraSetting: CameraSetting = {
  position: [100, 100, 100],
  point: [0, 0, 0],
};

class Director {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  /**
   * Construct the WEBGL Renderer with base settings
   */
  constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      45, //FOV (angle of view : 45 ~ 80 degree is proper)
      window.innerWidth / window.innerHeight, //aspet ratio of window
      0.1, // near ( minimum distance can see )
      1000 // far ( maximum distance can see )
    );
    this.renderer = new WebGLRenderer({ canvas, antialias: true });

    this.resize();
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(0, 0, 0);

    return this;
  }

  /**
   * Resize the canvas to fit the window.
   */
  public resize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  //====== SCENE ===============================================================

  public add(...objects: Object3D[]): void {
    this.scene.add(...objects);
  }

  //====== CAMERA ==============================================================

  /**
   * Setting Camera Position & Point
   * @param position position & point ( vertor 3 )
   */
  public setCameraPostion(
    position: CameraSetting["position"] = initialCameraSetting.position
  ): void {
    const [x, y, z] = position;
    this.camera.position.set(x, y, z);
  }

  /**
   * Setting Camera Point
   * @param point point ( vertor 3 )
   */
  public setCameraPosition(
    point: CameraSetting["point"] = initialCameraSetting.point
  ) {
    const [x, y, z] = point;
    this.camera.lookAt(x, y, z);
  }

  //====== HELPERS =============================================================

  /**
   * Add orbit controls
   */
  public addOrbitControl() {
    new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * Add helpers for debugging
   * @param option
   */
  public addHelpers(option: HelperOption) {
    const { grid, axes } = option;
    if (grid) this.add(new GridHelper());
    if (axes) this.add(new AxesHelper());
  }

  //====== RENDER ============================================================
  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}

const director = new Director();

export default director;
