import { scene } from "../../core";
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
import fragmentShader from "../../glsl/particleFragment.glsl?raw";
import vertexShader from "../../glsl/particleVertex.glsl?raw";

const coordCnt: number = 3;

class PathTracer {
  // Pathfinder Props //=================================================
  public paths: ParticlePath[] = [];
  private pathFinderLength: number;
  private pathFinderCoords: Float32Array;
  private pathFinderSize: Float32Array;
  private pathFinderOps: Float32Array;
  private geometry = new BufferGeometry();
  private material = new ShaderMaterial({
    extensions: {
      derivatives: true,
    },
    side: DoubleSide,
    uniforms: {
      time: { value: 1.0 },
      resolution: { value: new Vector4() },
    },
    transparent: true,
    depthTest: true,
    depthWrite: true,
    blending: AdditiveBlending,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  constructor(length: number = 200) {
    this.pathFinderLength = length;
    this.pathFinderCoords = new Float32Array(this.pathFinderLength * coordCnt);
    this.pathFinderSize = new Float32Array(this.pathFinderLength);
    this.pathFinderOps = new Float32Array(this.pathFinderLength);
  }

  get pathsLength() {
    return this.paths.length;
  }

  addPath(numberOfPoints: number, coordinates: Coordinate3[]) {
    const SVGPath: ParticlePath = {
      id: this.pathsLength,
      numberOfPoints,
      startPoint: 0,
      coordinates,
    };
    this.paths.push(SVGPath);
  }

  addPathFromVector3s(path: Vector3[]) {
    const numberOfPoints = path.length;
    const coordinates: Coordinate3[] = [];

    for (let at = 0; at < numberOfPoints; at++) {
      const { x, y, z } = path.at(at)!;
      coordinates.push([x, y, z ? z : 0]);
    }

    this.addPath(numberOfPoints, coordinates);
  }

  /**add Path from SVG geometry */
  addPathFromSVG(svg: SVGGeometryElement) {
    const realLength = svg.getTotalLength();
    const numberOfPoints = Math.floor(realLength);
    const coordinates: Coordinate3[] = [];

    for (let at = 0; at < numberOfPoints; at++) {
      const { x, y, z } = svg.getPointAtLength(at);
      coordinates.push([x, y, z ? z : 0]);
    }

    this.addPath(numberOfPoints, coordinates);
  }

  /**set GeometryAttr */
  setGeometryAttribute() {
    for (let i = 0; i < this.pathFinderLength; i++) {
      const position = [
        Math.random() * this.pathFinderLength,
        Math.random() * this.pathFinderLength,
        Math.random() * this.pathFinderLength,
      ];
      const size = [10];
      const opacity = [
        1 - Math.max((this.pathFinderLength - i) / this.pathFinderLength, 0.5),
      ];
      this.pathFinderCoords.set(position, i);
      this.pathFinderSize.set(size, i);
      this.pathFinderOps.set(opacity, i);
    }
    this.geometry.setAttribute(
      "position",
      new BufferAttribute(this.pathFinderCoords, coordCnt)
    );
    this.geometry.setAttribute(
      "size",
      new BufferAttribute(this.pathFinderSize, 1)
    );
    this.geometry.setAttribute(
      "opacity",
      new BufferAttribute(this.pathFinderOps, 1)
    );
  }

  activatePaths() {
    const particles = new Points(this.geometry, this.material);
    this.setGeometryAttribute();

    scene.add(particles);
  }

  followPath(path: ParticlePath, velocity: number = 5) {
    path.startPoint += velocity;
    for (let i = 0; i < this.pathFinderLength; i++) {
      let index = (path.startPoint + i) % path.numberOfPoints;
      let p = path.coordinates[index];
      this.pathFinderCoords.set(p, i * 3);
    }
  }

  changeTracerLength(length: number) {
    this.pathFinderLength = length;
  }

  animate() {
    this.paths.forEach((path) => this.followPath(path));
    this.geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default PathTracer;
