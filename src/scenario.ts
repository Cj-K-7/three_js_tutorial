import ObjectManager from "./class/objectSystem/objectManager";
import Ball from "./components/ball";
import BallParticle from "./components/ballParticle";

export async function initScenario() {
  const objManager = new ObjectManager();
  let ball = await Ball(0xff009080, 15, 128, 128);
  ball.position.set(50, 0, 0);
  let ball2 = await Ball(0xff003080, 15, 128, 128);
  ball2.position.set(-50, 0, 0);
  let ball3 = await BallParticle(0xffff0000, 15, 64, 64);
  objManager.append(ball, ball2, ball3);
}
