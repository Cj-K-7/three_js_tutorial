import ObjectManager from "./class/objectSystem/2.ObjectManager";
import PathTracer from "./class/particleSystem/pathTracer/pathTracer";
import ReflectingBall from "./components/ballReflector";
import ParticleSurfaceCircle from "./class/particleSystem/particleSurface/particleSurfaceCircle";
import Ball from "./components/ball";

//Rule =========================================================================

// 3D Objects must be declared as @[let]

const objectManager = new ObjectManager();
let ball1 = await Ball(0xff0050a8, 3, 128, 128);
// ball1.position.set(30, 0, 0);
let particleSurface = new ParticleSurfaceCircle({
  min_radius: 7,
  max_radius: 8,
  particleSize: 1,
  numberOfParticle: 10000,
  spread: 1,
  color: 0xfff0a080,
});
let particleSurface1 = new ParticleSurfaceCircle({
  min_radius: 8,
  max_radius: 9,
  particleSize: 1,
  numberOfParticle: 10000,
  spread: 0.8,
  color: 0xff80a0f0,
});

let particleSurface2 = new ParticleSurfaceCircle({
  min_radius: 9,
  max_radius: 10,
  particleSize: 1,
  numberOfParticle: 10000,
  spread: 0.5,
  color: 0xff8faf7f,
});
// let particleSurface = new ParticleSurfaceCircle(10, 20, 10000, 0xff00ffff);
// const pathTracer = new PathTracer(200, 5000);
// const waveSvg = document.getElementById(
//   "wave"
// ) as unknown as SVGGeometryElement;

// pathTracer.setPathFromSVG(waveSvg!);
// pathTracer.activate();

async function initScenario() {
  objectManager.append(ball1);
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

class Scenario {
  public static instance: Scenario;

  private constructor() {}

  public init(): Scenario {
    if (!Scenario.instance) Scenario.instance = new Scenario();
    return Scenario.instance;
  }
}
