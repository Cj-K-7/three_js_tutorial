import ObjectManager from "./class/objectSystem/objectManager";
import PathTracer from "./class/particleSystem/pathTracer/pathTracer";

const ballManager = new ObjectManager();
const pathTracer = new PathTracer(200, 5000);
const waveSvg = document.getElementById(
  "wave"
) as unknown as SVGGeometryElement;

pathTracer.setPathFromSVG(waveSvg!);
pathTracer.activate();

export async function initScenario() {
  ballManager.append();
}

export function updateScenario() {
  pathTracer.update();
}
