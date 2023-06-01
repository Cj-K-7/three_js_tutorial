import { Color, Mesh } from "three";
import { Body } from "cannon-es";
import cameraMan from "./class/cameraMan";
import Character from "./class/loadSystem/Character";
import ObjectManager from "./class/objectSystem/2.ObjectManager";
import Terrain from "./components/terraim";
import WorldPhysics from "./class/physic/worldPhysics";
import { scene } from "./core";
import Ball from "./components/ball";

//Rule =========================================================================

// 3D Objects must be declared as @[let]
//== World setup ===============================================================
const worldPhysics = new WorldPhysics(scene);
const TestManager = new ObjectManager();

let terrain = Terrain();
let ball = await Ball(0xff00ff00, 1);
let ballPhysic = worldPhysics.createBody();
let ball1 = await Ball(0xffff0000, 1);
let ballPhysic1 = worldPhysics.createBody();
let ball2 = await Ball(0xff000000, 1);
let ballPhysic2 = worldPhysics.createBody();

ballPhysic.position.set(0.5, 10, 0);
ballPhysic1.position.set(0, 12, 0.5);
ballPhysic2.position.set(0, 14, 0);

let character = new Character(
  "src/assets/model/Soldier.glb",
  cameraMan.controls!,
  cameraMan.currentCamera
);

function addPhysics(mesh: Mesh, body: Body) {
  mesh.position.set(body.position.x, body.position.y, body.position.z);
  mesh.quaternion.set(
    body.quaternion.x,
    body.quaternion.y,
    body.quaternion.z,
    body.quaternion.w
  );
}

// let particleSurface = new ParticleSurfaceCircle(10, 20, 10000, 0xff00ffff);
// const pathTracer = new PathTracer(200, 5000);
// const waveSvg = document.getElementById(
//   "wave"
// ) as unknown as SVGGeometryElement;

// pathTracer.setPathFromSVG(waveSvg!);
// pathTracer.activate();

async function initScenario() {
  TestManager.append(terrain, ball, ball1, ball2);
  cameraMan.move(0, 5, 5);
  cameraMan.lookAt(0, 0, 0);
  scene.background = new Color(0xa8def0);
}

function updateScenario() {
  worldPhysics.animate();
  character.animate();
  addPhysics(ball, ballPhysic);
  addPhysics(ball1, ballPhysic1);
  addPhysics(ball2, ballPhysic2);
  // ball.update();
  // pathTracer.update();
}

const scenario = { initScenario, updateScenario };

export default scenario;
