import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Points,
  ShaderMaterial,
  Vector4,
} from "three";
import fragmentShader from "../../glsl/particleFragment.glsl?raw";
import vertexShader from "../../glsl/particleVertex.glsl?raw";
import { scene } from "../../core";

const coordCnt: number = 3;

class Path {
  public id: number;
  public count: number;
  public length: number;
  public startPt: number = 0;
  public coordinates: Coordinate[];

  constructor(
    id: number,
    count: number,
    length: number,
    coordinates: Coordinate[]
  ) {
    this.id = id;
    this.count = count;
    this.length = length;
    this.coordinates = coordinates;
  }
}

class PathFinder {
  // Pathfinder Props //=================================================
  private paths: Path[] = [];
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

  constructor() {
    const wavesGeomertyElements = document.getElementsByClassName(
      "wave"
    ) as HTMLCollectionOf<SVGGeometryElement>;
    const waves = Array.from(wavesGeomertyElements);
    this.paths = waves.map<Path>(this.getPathFromSVG);
    this.pathFinderLength = 200;
    this.pathFinderCoords = new Float32Array(this.pathFinderLength * coordCnt);
    this.pathFinderSize = new Float32Array(this.pathFinderLength);
    this.pathFinderOps = new Float32Array(this.pathFinderLength);
    this.setGeometryAttribute();

    const particles = new Points(this.geometry, this.material);
    scene.add(particles);
  }

  getPathFromGeometry(geometry: any) {}

  /**get Path from SVG geometry */
  getPathFromSVG(svg: SVGGeometryElement, index: number): Path {
    const realLength = svg.getTotalLength();
    const pathPointLength = Math.floor(realLength);
    const coodinates: Coordinate[] = [];

    for (let at = 0; at < pathPointLength; at++) {
      const { x, y, z } = svg.getPointAtLength(at);
      coodinates.push([x, z ? z : 0, y]);
    }

    return new Path(index, realLength, pathPointLength, coodinates);
  }

  setPathLength(length: number) {
    this.pathFinderLength = length;
  }

  /**set GeometryAttr */
  setGeometryAttribute(): void {
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

  followPath(path: Path, velocity: number = 5) {
    path.startPt += velocity;
    for (let i = 0; i < this.pathFinderLength; i++) {
      let index = (path.startPt + i) % path.length;
      let p = path.coordinates[index];
      this.pathFinderCoords.set(p, i * 3);
    }
  }

  dispose(): void {}

  animate(): void {
    this.paths.forEach((path) => this.followPath(path));
    this.geometry.attributes.position.needsUpdate = true;
  }
}

export default PathFinder;
