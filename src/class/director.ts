import {
  WebGLRenderer,
  sRGBEncoding,
  Scene,
  Camera,
  Object3D,
  AxesHelper,
  GridHelper,
  ACESFilmicToneMapping,
} from "three";

class AppDirector {
  public canvas: HTMLCanvasElement;
  public scene: Scene;
  public renderer: WebGLRenderer;

  /**
   * Construct the WEBGL Renderer with base settings
   *
   * you can use the canvas you create.
   *
   * with no parameter,
   * constructor will automatically find canvas that has id = 'canvas' , or it doesn't exist,
   * create one.
   * @param canvas
   */
  constructor(
    canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement
  ) {
    this.canvas = canvas || document.createElement("canvas");
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });

    this.resize();
    return this;
  }

  /**
   * Resize the canvas to fit the window.
   */
  public resize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  //====== ENCODING ============================================================

  public setEncodingQuality(): void {
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
  }

  //====== SCENE ===============================================================

  public add(...objects: Object3D[]): void {
    this.scene.add(...objects);
  }

  //====== HELPERS =============================================================

  /**
   * Add helpers for debugging
   * @param option
   */
  public addHelpers(option: HelperOption): void {
    const { grid, axes } = option;
    if (grid) this.add(new GridHelper());
    if (axes) this.add(new AxesHelper());
  }

  //====== RENDER ============================================================
  public render(camera: Camera): void {
    this.renderer.render(this.scene, camera);
  }
}

const director = new AppDirector();

export default director;
