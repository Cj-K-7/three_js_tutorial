/**
 * Coordination values for [ x , y , z ] standard.
 */
type Coordinate3 = [cx: number, cy: number, cz: number];
type Coordinate4 = [cx: number, cy: number, cz: number, cv?: number];

/**
 * interface for a camera settings object
 */
type CameraSetting = {
  position: Axes;
  point: Axes;
};

type PlaneGeometryParameters = [
  width: number,
  height: number,
  widthSegments?: number,
  heightSegments?: number
];

type BoxGeometryParameters = [
  width: number,
  height: number,
  depth: number,
  widthSegments?: number,
  heightSegments?: number,
  depthSegments?: number
];

type SphereGeometryParameters = [
  radius: number,
  widthSegments: number,
  heightSegments: number,
  phiStart?: number,
  phiLength?: number,
  thetaStart?: number,
  thetaLength?: number
];

//Particel Systems
/**Path */
interface ParticlePath {
  numberOfPoints: number;
  startPoint: number;
  coordinates: Coordinate3[];
}
