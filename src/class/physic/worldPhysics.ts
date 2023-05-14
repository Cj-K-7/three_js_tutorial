import { Body, Plane, Sphere, Vec3, World } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

import { Mesh, Scene } from "three";
import { scene } from "../../core";

class WorldPhysics {
  public world: World;
  public ground: Body;
  private debugger?: {
    update: () => void;
  };

  constructor(scene: Scene) {
    this.world = new World({ gravity: new Vec3(0, -9.82, 0) });

    this.ground = new Body({ type: Body.STATIC, shape: new Plane() });

    this.ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    this.world.addBody(this.ground);

    this.debugger = CannonDebugger(scene, this.world);
    if (import.meta.env.DEV) {
    }
  }

  createBody() {
    const radius = 1;
    const sphereBody = new Body({
      mass: 5,
      shape: new Sphere(radius),
    });
    this.world.addBody(sphereBody);
    return sphereBody;
  }

  animate() {
    this.world.fixedStep();
    this.debugger?.update();
  }
}

export default WorldPhysics;
