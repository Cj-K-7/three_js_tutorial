/**
 * 3 axis value for [ x , y , z]
 */
type Axis = [number, number, number];

/**
 * interface for a camera settings object
 */
interface CameraSetting {
  position: Axis;
  point: Axis;
}

interface HelperOption {
  axes?: boolean;
  grid?: boolean;
}
