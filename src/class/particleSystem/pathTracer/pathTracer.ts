import { scene } from "../../../core";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Points,
  ShaderMaterial,
  Vector3,
  Vector4,
} from "three";
import fragmentShader from "./particleFragment.glsl?raw";
import vertexShader from "./particleVertex.glsl?raw";
import { getVelocity } from "../../../utility/velocity";

const coordCnt: number = 3;

class PathTracer {
  // PathTracer Props //=================================================
  /**Path. `PathTracer` will follow this path's positions */
  public path?: ParticlePath;
  /**Duration. How many time will take one cycle of fiven `path`  */
  public duration: number;
  /**`PathTracer`'s `number` of particles = `PathTracer`'s length*/
  private particlesNumber: number;
  /**`PathTracer`'s `coodinate3` of particles  */
  private particlesCoord3: Float32Array;
  /**`PathTracer`'s `size` of particles */
  private paticlesSize: Float32Array;
  /**`PathTracer`'s `opacity` of particles */
  private paticlesOpacity: Float32Array;

  public geometry = new BufferGeometry();
  public material = new ShaderMaterial({
    extensions: {
      derivatives: true,
    },
    side: DoubleSide,
    uniforms: {
      time: { value: 1.0 },
      resolution: { value: new Vector4() },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  /**
   * `PathTracer` is tracer of path. using particle.
   * paticles will follow the path of geometry consist of `path` coordinates(x, y, z)
   *
   *  * can have only a `Path`.
   *  * set `Path` by using `setPathFromVector3s()`  or `setPathFromSVG()`
   *  * then `activate()`. this will appear on `scene`
   *  * should be updated(use `update()`) for trace animation rendering.
   *
   * @param length `INT` number of particles = `length` of PathTracer. it should be lower than path's number of position.
   * @param duration `milliseconds` it't will decide speed of `PathTracer`. How many time will take one cycle of fiven `path`
   */
  constructor(length: number, duration: number) {
    const isLengthInt = length % 1 === 0;
    if (!isLengthInt) throw Error("PathTracer : 'length' must be integer");
    this.duration = duration;
    this.particlesNumber = length;
    this.particlesCoord3 = new Float32Array(this.particlesNumber * coordCnt);
    this.paticlesSize = new Float32Array(this.particlesNumber);
    this.paticlesOpacity = new Float32Array(this.particlesNumber);
  }

  get velocity() {
    return getVelocity(this.duration, this.path!.numberOfPoints);
  }

  private setPath(numberOfPoints: number, coordinates: Coordinate3[]) {
    const path: ParticlePath = {
      numberOfPoints,
      startPoint: 0,
      coordinates,
    };
    this.path = path;
  }

  /**
   * add Path from Vector3 List. it same as making 3D line objects in THREE.js
   *
   * `PathTracer` can have only one Path. if there is a Path. this will throw Error
   *
   * @param vector3s List(Array) of `Vector3`
   * @param scale `number` scaling `position coordinates`( not `number of particles` )
   * @param divider `INT` give interval of skip positions of `vectors`'s points
   */
  setPathFromVector3s(
    vector3s: Vector3[],
    scale: number = 1,
    divider: number = 1
  ) {
    if (this.path) {
      throw Error("PathTracer : Path is already set");
    } else if (divider % 1 !== 0) {
      throw Error("PathTracer : divider must be integer");
    } else {
      const numberOfPoints = Math.floor(vector3s.length / divider);
      const coordinates: Coordinate3[] = [];
      for (let i = 0; i < numberOfPoints; i++) {
        const { x, y, z } = vector3s.at(i * divider)!;
        coordinates.push([x * scale, y * scale, z ? z * scale : 0]);
      }

      return this.setPath(numberOfPoints, coordinates);
    }
  }

  /**
   * add Path from SVG geometry
   *
   * `PathTracer` can have only one Path. if there is a Path. this will throw Error
   *
   * @param svg `SVGGeometryElement`
   * @param scale `number` scaling `position coordinates`( not `number of particles` )
   * @param divider `INT` give interval of skip positions of `svg`'s points
   */
  setPathFromSVG(
    svg: SVGGeometryElement,
    scale: number = 1,
    divider: number = 1
  ) {
    if (this.path) {
      throw Error("PathTracer : Path is already set");
    } else if (divider % 1 !== 0) {
      throw Error("PathTracer : divider must be integer");
    } else {
      const realLength = svg.getTotalLength() / divider;
      const numberOfPoints = Math.floor(realLength);
      const coordinates: Coordinate3[] = [];

      for (let i = 0; i < numberOfPoints; i++) {
        const { x, y, z } = svg.getPointAtLength(i * divider);
        coordinates.push([x * scale, y * scale, z ? z * scale : 0]);
      }

      return this.setPath(numberOfPoints, coordinates);
    }
  }

  private setGeoAtr(
    name: string,
    arrayLike: ArrayLike<number>,
    itemSize: number = 1
  ) {
    this.geometry.setAttribute(name, new BufferAttribute(arrayLike, itemSize));
  }

  /**set GeometryAttr */
  private initGeoAtrs() {
    const maxParticleSize = 20;
    for (let i = 0; i < this.particlesNumber; i++) {
      const size = [
        maxParticleSize -
          ((this.particlesNumber - i) / this.particlesNumber) * maxParticleSize,
      ];
      const opacity = [1 - (this.particlesNumber - i) / this.particlesNumber];
      this.paticlesSize.set(size, i);
      this.paticlesOpacity.set(opacity, i);
    }
    this.setGeoAtr("position", this.particlesCoord3, coordCnt);
    this.setGeoAtr("size", this.paticlesSize);
    this.setGeoAtr("opacity", this.paticlesOpacity);
  }

  /**
   * Activate `PathTracer`.
   * add this to `scene`
   *
   * declare this function is start of lifecycle of `PathTracer`
   */
  activate() {
    if (this.path) {
      const particles = new Points(this.geometry, this.material);
      this.initGeoAtrs();
      scene.add(particles);
    } else {
      throw Error("PathTracer : There is no `path` to trace. Please Add Path.");
    }
  }

  private followPath(path: ParticlePath) {
    for (let i = 0; i < this.particlesNumber; i++) {
      const index = (path.startPoint + i) % path.numberOfPoints;
      const p = path.coordinates[index];
      this.particlesCoord3.set(p, i * 3);
    }

    path.startPoint =
      path.startPoint >= path.numberOfPoints
        ? 0
        : path.startPoint + this.velocity;
  }

  stop(path: ParticlePath) {
    path.startPoint = 0;
  }

  /**set `particlesNumber` (`PathTracer`'s length) */
  setTracerLength(length: number) {
    this.particlesNumber = length;
  }

  /**update current `PathTracer` */
  update() {
    if (this.path) {
      this.followPath(this.path);
      this.geometry.attributes.position.needsUpdate = true;
    }
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default PathTracer;
