import { scene } from "../../core";
import { PointLight, ColorRepresentation } from "three";

interface LightSettings {
  color?: ColorRepresentation | undefined;
  intensity?: number | undefined;
  distance?: number | undefined;
  decay?: number | undefined;
}

const defaultSettings: LightSettings = {
  color: 0xffffffff,
  intensity: 2,
};

const initialParameters = Object.values(defaultSettings);

class LightSystem extends PointLight {
  constructor() {
    super(...initialParameters);
    this.name = "Gaffer";
    this.position.set(50, 50, 50);
    scene.add(this);
  }

  move(...[x, y, z]: Coordinate3) {
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
  }

  dispose() {
    scene.remove(this);
    this.dispose();
  }
}

export default LightSystem;
