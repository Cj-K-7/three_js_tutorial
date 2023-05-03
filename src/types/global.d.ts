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

type SphereGeometryParameters = [
  radius?: number | undefined,
  widthSegments?: number | undefined,
  heightSegments?: number | undefined,
  phiStart?: number | undefined,
  phiLength?: number | undefined,
  thetaStart?: number | undefined,
  thetaLength?: number | undefined
];
