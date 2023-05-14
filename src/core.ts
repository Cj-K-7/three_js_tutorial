import {
  ACESFilmicToneMapping,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//== Canvas setup ==============================================================

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;

//== Scene setup ===============================================================

export const scene = new Scene();

//== Renderer setup ============================================================

export const renderer = new WebGLRenderer({ canvas, antialias: true });

renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(devicePixelRatio);

//== Loaders ===================================================================

export const gltfLoader = new GLTFLoader();
