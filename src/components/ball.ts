import {
  SphereGeometry,
  MeshPhysicalMaterial,
  Vector2,
  ColorRepresentation,
} from "three";
import MeshObject from "../class/objectSystem/1.MeshObject";

/**
 * Create physic material ball
 *
 * @param color
 * @param geometryParams ...arguments
 *
 * @returns Ball
 */
const Ball = async (
  color: ColorRepresentation,
  ...geometryParams: SphereGeometryParameters
): Promise<MeshObject> => {
  const geometry = new SphereGeometry(...geometryParams);
  const material = new MeshPhysicalMaterial({
    color,
    metalness: 1,
    roughness: 0.7,
    clearcoat: 1.0,
    clearcoatRoughness: 0,
    normalScale: new Vector2(0.15, 0.15),
  });
  const ball = new MeshObject(geometry, material);

  return ball;
};

export default Ball;
