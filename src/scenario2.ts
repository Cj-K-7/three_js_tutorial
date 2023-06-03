import { scene } from "./core";
import { Color } from "three";
import cameraMan from "./class/cameraMan";
// import ObjectManager from "./class/objectSystem/2.ObjectManager";
import Terrain from "./components/terraim";
import Physic from "./class/physic/worldPhysics";
import Character from "./class/loadSystem/Character";

//Rule =========================================================================

// 3D Objects must be declared as @[let]
//== World setup ===============================================================
const physic = new Physic(scene);
// const objectManager = new ObjectManager();

let terrain = Terrain();

// setInterval(async () => {
//   let ball = await Ball(0xff408090, 1);
//   let ballPhysic = physic.createSphereBody();
//   ball.position.set(0, 15, 0);
//   ballPhysic.position.set(Math.random() * 0.5, 15, Math.random() * 0.5);
//   ball.addPhysicBody(ballPhysic);

//   objectManager.append(ball);
//   if (objectManager.size > 10) {
//     const [first] = objectManager;
//     physic.world.removeBody(first.body!);
//     objectManager.remove(first);
//   }
// }, 1000);

let character = new Character(
  "src/assets/model/Soldier.glb",
  cameraMan.controls!,
  cameraMan.currentCamera
);

async function initScenario() {
  scene.add(terrain);
  scene.background = new Color(0xa8def0);
}

function updateScenario() {
  physic.animate();
  // objectManager.forEach((object) => object.update());
  character.animate();
}

const scenario = { initScenario, updateScenario };

export default scenario;
