import ObjectManager from "./class/objectSystem/objectManager";
import Ball from "./components/ball";
import Wall from "./components/wall";
// import PathTracer from "./class/particleSystem/pathTracer/pathTracer";

//Rule =========================================================================

// 3D Objects must be declared as @[let]

const TestManager = new ObjectManager();
let wall = await Wall();
let ball = await Ball(0xff00ffff, 5);
// const pathTracer = new PathTracer(200, 5000);
// const waveSvg = document.getElementById(
//   "wave"
// ) as unknown as SVGGeometryElement;

// pathTracer.setPathFromSVG(waveSvg!);
// pathTracer.activate();

export async function initScenario() {
  TestManager.append(wall);
}

export function updateScenario() {
  wall.update();
  // pathTracer.update();
}
