import {
  ACESFilmicToneMapping,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from "three";

//== Canvas setup ==============================================================

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

//== Scene setup ===============================================================

export const scene = new Scene();

//== Renderer setup ============================================================

export const renderer = new WebGLRenderer({ canvas, antialias: true });

renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.setPixelRatio(devicePixelRatio);
