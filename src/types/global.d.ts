/**
 * 3 axis value for [ x , y , z]
 */
type Coordinate = [x: number, y: number, z: number];

/**
 * interface for a camera settings object
 */
interface CameraSetting {
  position: Axes;
  point: Axes;
}
