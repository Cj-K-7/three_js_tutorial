import ObjectManager from "./class/objectSystem/objectManager";
import PathTracer from "./class/particleSystem/pathTracer/pathTracer";
import ReflectingBall from "./components/ballReflector";
import ParticleSurfaceCircle from "./class/particleSystem/particleSurface/particleSurfaceCircle";
import Ball from "./components/ball";

//Rule =========================================================================

// 3D Objects must be declared as @[let]

const TestManager = new ObjectManager();
// let ball = await ReflectingBall(3, 128, 128);
let ball1 = await Ball(0xff000000, 3, 128, 128);
// ball1.position.set(30, 0, 0);
let particleSurface = new ParticleSurfaceCircle(
  7,
  10,
  1,
  10000,
  0.75,
  0xfff0a080
);
let particleSurface1 = new ParticleSurfaceCircle(
  7,
  10,
  1,
  10000,
  1,
  0xff80a0f0
);
let particleSurface2 = new ParticleSurfaceCircle(
  8,
  10,
  1,
  10000,
  2.5,
  0xff252550
);
// let particleSurface = new ParticleSurfaceCircle(10, 20, 10000, 0xff00ffff);
// const pathTracer = new PathTracer(200, 5000);
// const waveSvg = document.getElementById(
//   "wave"
// ) as unknown as SVGGeometryElement;

// pathTracer.setPathFromSVG(waveSvg!);
// pathTracer.activate();

async function initScenario() {
  TestManager.append(ball1);
  particleSurface.activate();
  particleSurface1.activate();
  particleSurface2.activate();
}

function updateScenario() {
  // ball.update();
  particleSurface.update();
  particleSurface1.update();
  particleSurface2.update();
  // pathTracer.update();
}

const scenario = { initScenario, updateScenario };

export default scenario;
