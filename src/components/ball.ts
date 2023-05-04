import {
  SphereGeometry,
  MeshPhysicalMaterial,
  Vector2,
  ColorRepresentation,
} from "three";
import AdvancedMesh from "../class/objectSystem/advancedMesh";

/**
 * create physic material ball
 * @param materialParams
 * @param geometryParams
 * @returns Ball
 */
const Ball = async (
  color: ColorRepresentation,
  ...geometryParams: SphereGeometryParameters
): Promise<AdvancedMesh> => {
  const geometry = new SphereGeometry(...geometryParams);
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
