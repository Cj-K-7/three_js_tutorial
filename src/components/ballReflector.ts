import { SphereGeometry, MeshPhysicalMaterial } from "three";
import AdvancedMesh from "../class/objectSystem/advancedMesh";

const ReflectingBall = async (
  ...geometryParams: SphereGeometryParameters
): Promise<AdvancedMesh> => {
  const geometry = new SphereGeometry(...geometryParams);
  const material = new MeshPhysicalMaterial({
    roughness: 0.12,
    metalness: 1,
  });
  const ball = new AdvancedMesh(geometry, material);

  ball.addRefelctions();

  return ball;
};

export default ReflectingBall;
