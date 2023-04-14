/**
 * 3 axis value for [ x , y , z]
 */
type Axes = [number, number, number];

/**
 * interface for a camera settings object
 */
interface CameraSetting {
  position: Axes;
  point: Axes;
}
