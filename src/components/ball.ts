import {
  SphereGeometry,
  MeshPhysicalMaterial,
  Vector2,
  ColorRepresentation,
} from "three";
import AdvancedMesh from "../class/objectSystem/advancedMesh";

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
  ...[
    radius,
    widthSegments = 64,
    heightSegments = 64,
    phiStart,
    phiLengt,
    thetaStart,
    thetaLength,
  ]: SphereGeometryParameters
): Promise<AdvancedMesh> => {
  const geometry = new SphereGeometry(
    radius,
    widthSegments,
    heightSegments,
    phiStart,
    phiLengt,
    thetaStart,
    thetaLength
  );
  const material = new MeshPhysicalMaterial({
    color,
    metalness: 1,
    roughness: 0.7,
    clearcoat: 1.0,
    clearcoatRoughness: 0,
    normalScale: new Vector2(0.15, 0.15),
  });
  const ball = new AdvancedMesh(geometry, material);

  await ball.addEnvmapTexture("blue_photo_studio_4k.hdr");

  return ball;
};

export default Ball;
