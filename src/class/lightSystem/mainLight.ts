import { ColorRepresentation, PointLight } from "three";
import { scene } from "../../core";

interface LightSettings {
  color?: ColorRepresentation | undefined;
  intensity?: number | undefined;
  distance?: number | undefined;
  decay?: number | undefined;
}

const defaultSettings: LightSettings = {
  color: 0xffffffff,
  intensity: 1,
};

const parameters = Object.values(defaultSettings);

class Gaffer extends PointLight {
  constructor() {
    super(...parameters);
    this.name = "Gaffer";
    this.position.set(1000, 1000, 1000);
    scene.add(this);
  }

  move(): void {}

  dispose(): void {
    scene.remove(this);
  }
}

export default Gaffer;
