import { scene } from "../../core";
import {
  ColorRepresentation,
  DirectionalLight,
  AmbientLight,
  Light,
  PointLight,
} from "three";

interface LightSettings {
  color?: ColorRepresentation | undefined;
  intensity?: number | undefined;
  distance?: number | undefined;
  decay?: number | undefined;
}

const defaultSettings: LightSettings = {
  color: 0xffe8e8e8,
  intensity: 2,
};

const initialParameters = Object.values(defaultSettings);

class LightSystem extends Light {
  private pointLight?: PointLight;
  private ambientLight?: AmbientLight;
  private directionalLight?: DirectionalLight;

  constructor() {
    super(...initialParameters);
    this.name = "Gaffer";
    this.position.set(10, 10, 10);
    scene.add(this);
  }

  addPointLight() {
    this.pointLight = new PointLight(0xffffff, 0.7);
    scene.add(this.pointLight);
    return this.pointLight;
  }

  addAmbientLight() {
    this.ambientLight = new AmbientLight(0xffffff, 0.7);
    scene.add(this.ambientLight);
    return this.ambientLight;
  }

  addDirectionLight() {
    this.directionalLight = new DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(-40, 100, -10);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.top = 50;
    this.directionalLight.shadow.camera.bottom = -50;
    this.directionalLight.shadow.camera.left = -50;
    this.directionalLight.shadow.camera.right = 50;
    this.directionalLight.shadow.camera.near = 0.1;
    this.directionalLight.shadow.camera.far = 200;
    this.directionalLight.shadow.mapSize.width = 4096;
    this.directionalLight.shadow.mapSize.height = 4096;
    scene.add(this.directionalLight);
    return this.directionalLight;
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
