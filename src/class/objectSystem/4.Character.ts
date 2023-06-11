import { gltfLoader, scene } from "../../core";
import { AnimationMixer, Camera, Clock, Group } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { KeyDisplay } from "../../utility/keyBinding";
import { CharacterControl } from "./5.CharacterControls";

class Character {
  private controls?: CharacterControl;
  private clock: Clock;
  private keysPressed = {};
  private keyDisplayQueue: KeyDisplay;

  public model!: Group;

  constructor(modelFile: string, orbitControls: OrbitControls, camera: Camera) {
    this.clock = new Clock();
    gltfLoader.load(
      modelFile,
      (gltf) => {
        this.model = gltf.scene;

        this.model.traverse((object) => {
          object.castShadow = true;
        });

        scene.add(this.model);

        const animations = gltf.animations;
        const mixer = new AnimationMixer(this.model);
        const animationsMap = new Map();

        animations
          .filter((ani) => ani.name != "TPose")
          .forEach((ani) => animationsMap.set(ani.name, mixer.clipAction(ani)));

        this.controls = new CharacterControl(
          this.model,
          animationsMap,
          mixer,
          orbitControls,
          camera,
          "Idle"
        );
      },
      () => {},
      (error) => {
        throw error;
      }
    );

    //binding key
    this.keyDisplayQueue = new KeyDisplay();
  }

  addKeyControl() {
    document.addEventListener(
      "keydown",
      (event) => {
        this.keyDisplayQueue.down(event.key);
        if (event.shiftKey && this.controls) {
          this.controls.switchRunToggle();
        } else {
          (this.keysPressed as any)[event.key.toLowerCase()] = true;
        }
      },
      false
    );

    document.addEventListener(
      "keyup",
      (event) => {
        this.keyDisplayQueue.up(event.key);
        (this.keysPressed as any)[event.key.toLowerCase()] = false;
      },
      false
    );
  }

  animate() {
    let delta = this.clock.getDelta();
    if (this.controls) {
      this.controls.update(delta, this.keysPressed);
    }
  }
}

export default Character;
