import { ColorRepresentation, PointsMaterial, SphereGeometry } from "three";
import AdvancedPoints from "../class/objectSystem/advancedPoints";

/**
 * create vertex particle ball
 * @param materialParams
 * @param geometryParams
 * @returns BallParticle
 */
const BallParticle = async (
  color: ColorRepresentation,
  ...geometryParams: SphereGeometryParameters
): Promise<AdvancedPoints> => {
  const geometry = new SphereGeometry(...geometryParams);
  const material = new PointsMaterial({ color, size: 0.1 });
  const ball = new AdvancedPoints(geometry, material);

  return ball;
};

export default BallParticle;
