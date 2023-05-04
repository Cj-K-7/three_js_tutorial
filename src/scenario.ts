import ObjectManager from "./class/objectSystem/objectManager";
// import Ball from "./components/ball";
import BallPoints from "./components/ballPoints";
import ReflectingBall from "./components/ballReflector";

const ballManager = new ObjectManager();
let reflectingBall = await ReflectingBall(15, 128, 128);
let ball2 = await BallPoints(0xff800000, 15, 128, 128);
let ball3 = await BallPoints(0xff808000, 15, 128, 128);
let ball4 = await BallPoints(0xff008000, 15, 128, 128);
let ball5 = await BallPoints(0xff008080, 15, 128, 128);
let ball6 = await BallPoints(0xff000080, 15, 128, 128);
let ball7 = await BallPoints(0xff800080, 15, 128, 128);

export async function initScenario() {
  ballManager.append(reflectingBall, ball2, ball3, ball4, ball5, ball6, ball7);
  ball2.position.set(60, 0, 0);
  ball3.position.set(-60, 0, 0);
  ball4.position.set(0, 60, 0);
  ball5.position.set(0, -60, 0);
  ball6.position.set(0, 0, 60);
  ball7.position.set(0, 0, -60);
}

export function updateScenario() {
  reflectingBall.updateCubeCamera();
}
