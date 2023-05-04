import ObjectManager from "./class/objectSystem/objectManager";
import PathTracer from "./class/particleSystem/pathTracer";

const ballManager = new ObjectManager();
const pathFinder = new PathTracer();
const waveSvg = document.getElementById(
  "wave"
) as unknown as SVGGeometryElement;

pathFinder.addPathFromSVG(waveSvg!);

pathFinder.activatePaths();

export async function initScenario() {
  ballManager.append();
}

export function updateScenario() {
  pathFinder.animate();
}
