import {
  AdditiveBlending,
  BufferGeometry,
  Clock,
  Color,
  ColorRepresentation,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Raycaster,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
} from "three";
import vertexShader from "./shader/vertext.glsl?raw";
import fragmentShader from "./shader/fragment.glsl?raw";
import particle from "../../../assets/imgs/particle.webp";
import MeshObject from "../../objectSystem/1.MeshObject";
import { lerp } from "three/src/math/MathUtils";
import { scene } from "../../../core";
import cameraMan from "../../cameraMan";

export interface ParticleSurfaceCircleParameters {
  min_radius: number;
  max_radius: number;
  particleSize: number;
  numberOfParticle: number;
  spread: number;
  color: ColorRepresentation;
}

class ParticleSurfaceCircle {
  private clock: Clock;
  private particleGeo: BufferGeometry;
  private particlesPos: Float32Array;
  private raycaster: Raycaster;
  private raycastGeo: BufferGeometry;
  private pointVec2: Vector2;
  private pointVec3: Vector3;
  public surfaceGeo: InstancedBufferGeometry;
  public material: ShaderMaterial;
  public mesh: MeshObject;

  constructor(params: ParticleSurfaceCircleParameters) {
    const particleTexture = new TextureLoader().load(particle);

    this.raycaster = new Raycaster();
    this.raycastGeo = new PlaneGeometry(
      params.max_radius * 2,
      params.max_radius * 2
    ).rotateX(-Math.PI / 2);
    this.pointVec2 = new Vector2();
    this.pointVec3 = new Vector3();
    this.clock = new Clock();
    this.particleGeo = new PlaneGeometry();
    this.surfaceGeo = new InstancedBufferGeometry();
    this.material = new ShaderMaterial({
      uniforms: {
        u_amp: { value: params.particleSize },
        u_time: { value: 0 },
        u_speed: { value: params.spread },
        u_mouse: { value: new Vector3() },
        u_color: { value: new Color(params.color) },
        u_texture: { value: particleTexture },
      },
      side: DoubleSide,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
      // depthTest: false,
      vertexShader,
      fragmentShader,
    });

    //set & sync of buffer geometry's index
    //( particleGeo => every point of surface's Geo ).
    this.surfaceGeo.index = this.particleGeo.index;
    this.surfaceGeo.setAttribute(
      "position",
      this.particleGeo.getAttribute("position")
    );

    //set every point of surface's Position
    this.particlesPos = new Float32Array(params.numberOfParticle * 3);
    for (let i = 0; i < params.numberOfParticle; i++) {
      const t = Math.random() * 2 * Math.PI;
      const r = lerp(params.min_radius, params.max_radius, Math.random());
      const x = r * Math.sin(t);
      const y = (Math.random() - 0.5) * 0.1;
      const z = r * Math.cos(t);

      this.particlesPos.set([x, y, z], i * 3);
    }

    this.surfaceGeo.setAttribute(
      "particle_center",
      new InstancedBufferAttribute(this.particlesPos, 3, false)
    );

    //create mesh
    this.mesh = new MeshObject(this.surfaceGeo, this.material);

    this.mesh.renderOrder = 0;

    particleTexture.dispose();
    this.particleGeo.dispose();
    this.surfaceGeo.dispose();
    this.material.dispose();
  }

  get obejct3D() {
    return this.mesh;
  }

  activate() {
    scene.add(this.mesh);
  }

  addRaycasterEvent() {
    let raycastArea = new Mesh(this.raycastGeo, new MeshBasicMaterial({}));

    raycastArea.material.side = DoubleSide;
    window.addEventListener("pointermove", (event) => {
      this.pointVec2.x = (event.clientX / innerWidth) * 2 - 1;
      this.pointVec2.y = -(event.clientY / innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.pointVec2, cameraMan.currentCamera);

      const intersects = this.raycaster.intersectObjects([raycastArea]);
      if (intersects[0]) {
        this.pointVec3.copy(intersects[0].point);
      }
    });

    raycastArea.material.dispose();
    raycastArea.geometry.dispose();
  }

  update() {
    this.material.uniforms["u_time"].value = this.clock.getElapsedTime() * 0.5;
    this.material.uniforms["u_mouse"].value = this.pointVec3;
  }

  dispose() {
    this.particleGeo.dispose();
    this.surfaceGeo.dispose();
    this.material.dispose();
    this.mesh.dispose();
  }
}

export default ParticleSurfaceCircle;
