import {
  AnimationAction,
  AnimationMixer,
  Camera,
  Group,
  Quaternion,
  Vector3,
} from "three";
import { A, D, DIRECTIONS, S, W, SPACE } from "../../utility/keyBinding";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import tween from "@tweenjs/tween.js";

export class CharacterControls {
  model: Group;
  mixer: AnimationMixer;
  animationsMap: Map<string, AnimationAction> = new Map(); // Walk, Run, Idle
  orbitControl: OrbitControls;
  camera: Camera;

  // state
  toggleRun: boolean = true;
  isJumping: boolean = false;
  currentAction: string;

  // temporary data
  walkDirection = new Vector3();
  rotateAngle = new Vector3(0, 1, 0);
  rotateQuarternion: Quaternion = new Quaternion();
  cameraTarget = new Vector3();

  // constants
  fadeDuration: number = 0.2;
  runVelocity = 5;
  walkVelocity = 2;

  constructor(
    model: Group,
    mixer: AnimationMixer,
    animationsMap: Map<string, AnimationAction>,
    orbitControl: OrbitControls,
    camera: Camera,
    currentAction: string
  ) {
    this.model = model;
    this.mixer = mixer;
    this.animationsMap = animationsMap;
    this.currentAction = currentAction;
    this.animationsMap.forEach((value, key) => {
      if (key == currentAction) {
        value.play();
      }
    });
    this.orbitControl = orbitControl;
    this.camera = camera;
    this.updateCameraTarget(0, 0);
  }

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun;
  }

  public update(delta: number, keysPressed: any) {
    const directionPressed = DIRECTIONS.some((key) => keysPressed[key] == true);
    var play = "";
    if (directionPressed && this.toggleRun) {
      play = "Run";
    } else if (directionPressed) {
      play = "Walk";
    } else {
      play = "Idle";
    }

    if (this.currentAction != play) {
      const toPlay = this.animationsMap.get(play);
      const current = this.animationsMap.get(this.currentAction);

      current!.fadeOut(this.fadeDuration);
      toPlay!.reset().fadeIn(this.fadeDuration).play();

      this.currentAction = play;
    }

    this.mixer.update(delta);

    // run/walk velocity
    const velocity =
      this.currentAction == "Run" ? this.runVelocity : this.walkVelocity;

    if (keysPressed[SPACE] && !this.isJumping) {
      const animation = new tween.Tween<number[]>([0])
        .duration(500)
        .easing(tween.Easing.Linear.None)
        .onStart(() => (this.isJumping = true))
        .onUpdate((_, time) => {
          if (time > 0.666) {
            if (this.model.position.y <= 0) {
              this.model.position.y = 0;
            } else {
              this.model.position.y += -9.8 * delta;
            }
          } else {
            this.model.position.y += velocity * 0.7 * delta;
          }
        })
        .onComplete(() => (this.isJumping = false));
      animation.start();
    }

    if (this.currentAction == "Run" || this.currentAction == "Walk") {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        this.camera.position.x - this.model.position.x,
        this.camera.position.z - this.model.position.z
      );
      // diagonal movement angle offset
      var directionOffset = this.directionOffset(keysPressed);

      // rotate model
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

      // calculate direction
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

      // move model & camera
      const moveX = this.walkDirection.x * velocity * delta;
      const moveZ = this.walkDirection.z * velocity * delta;

      this.model.position.x += moveX;
      this.model.position.z += moveZ;

      this.updateCameraTarget(moveX, moveZ);
    }
  }

  private updateCameraTarget(moveX: number, moveZ: number) {
    // move camera
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;

    // update camera target
    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 1;
    this.cameraTarget.z = this.model.position.z;
    this.orbitControl.target = this.cameraTarget;
  }

  private directionOffset(keysPressed: any) {
    var directionOffset = 0; // w
    if (keysPressed[W]) {
      if (keysPressed[A]) {
        directionOffset = Math.PI / 4; // w+a
      } else if (keysPressed[D]) {
        directionOffset = -Math.PI / 4; // w+d
      }
    } else if (keysPressed[S]) {
      if (keysPressed[A]) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
      } else if (keysPressed[D]) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (keysPressed[A]) {
      directionOffset = Math.PI / 2; // a
    } else if (keysPressed[D]) {
      directionOffset = -Math.PI / 2; // d
    }

    return directionOffset;
  }
}
