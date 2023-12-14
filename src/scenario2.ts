import { scene } from "./core";
import { Color } from "three";
import cameraMan from "./class/cameraMan";
// import ObjectManager from "./class/objectSystem/2.ObjectManager";
import Terrain from "./components/terraim";
import PhysicSystem from "./class/physicSystem/physicSystem";
import Character from "./class/objectSystem/4.Character";
import ParticleSurfaceCircle from "./class/particleSystem/particleSurface/particleSurfaceCircle";

//Rule =========================================================================

// 3D Objects must be declared as @[let]
//== World setup ===============================================================
const physic = new PhysicSystem(scene);
const particleSystem = new ParticleSurfaceCircle({
  min_radius: 10,
  max_radius: 20,
  particleSize: 1,
  numberOfParticle: 100,
  spread: 1,
  color: 0xffffff,
});
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

let character: Character;

async function initScenario() {
  particleSystem.activate();
  scene.background = new Color(0x000000);
}

function updateScenario() {
  particleSystem.update();
}

const scenario = { initScenario, updateScenario };

export default scenario;
