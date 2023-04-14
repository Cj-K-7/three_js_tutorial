import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Points,
  ShaderMaterial,
  Vector4,
} from "three";
import fragment from "../../glsl/particleFragment.glsl?raw";
import vertex from "../../glsl/particleVertex.glsl?raw";
import { scene } from "../../core";

const coordsNumber: number = 3;

class ParticlePath {
  public id: number;
  public index: number = 0;
  public count: number;
  public length: number;
  public coordinates: Coordinate[];
  public velocity: number = 1;

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

class MovingParticle {
  private paths: ParticlePath[] = [];
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
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  private particlesCoor: Float32Array;
  private particlesOp: Float32Array;
  private progress: number;

  constructor() {
    const wavesGeomertyElements = document.getElementsByClassName(
      "wave"
    ) as HTMLCollectionOf<SVGGeometryElement>;
    const waves = Array.from(wavesGeomertyElements);
    this.paths = waves.map<ParticlePath>((path, index) => {
      const length = path.getTotalLength();
      const count = Math.floor(length / 5);
      const coodinates: Coordinate[] = [];

      for (let i = 0; i < 900; i++) {
        const pointAt = length * (i / count);
        const { x, y, z } = path.getPointAtLength(pointAt);
        coodinates.push([x - 1000, y - 512, 0]);
      }
      return new ParticlePath(index, length, count, coodinates);
    });
    this.progress = this.paths.length * 100;
    this.particlesCoor = new Float32Array(this.progress * coordsNumber);
    this.particlesOp = new Float32Array(this.progress);
  }

  setPathToGeometry(): void {
    for (let i = 0; i < this.progress; i++) {
      this.particlesCoor.set(
        [Math.random() * 100, Math.random() * 1000, 0],
        i * coordsNumber
      );
      this.particlesOp.set([Math.random() / 6], i);
    }

    console.log(this.particlesCoor, this.particlesOp);
    this.geometry.setAttribute(
      "position",
      new BufferAttribute(this.particlesCoor, coordsNumber)
    );
    this.geometry.setAttribute(
      "opacity",
      new BufferAttribute(this.particlesOp, 1)
    );
  }

  render(): void {
    this.setPathToGeometry();
    const particles = new Points(this.geometry, this.material);
    scene.add(particles);
  }

  animate(): void {
    let j = 0;
    this.paths.forEach((path) => {
      path.index += path.velocity;
      path.index = path.index % path.count;
      for (let i = 0; i < 100; i++) {
        let index = (path.index + i) % path.count;
        let p = path.coordinates[index];
        this.particlesCoor.set(p, j * 3);
        this.particlesOp.set([Math.pow(i / 1000, 1.3)], j);
        j++;
      }
    });
    this.geometry.attributes.position.array = this.particlesCoor;
    this.geometry.attributes.position.needsUpdate = true;
  }
}

export default MovingParticle;
