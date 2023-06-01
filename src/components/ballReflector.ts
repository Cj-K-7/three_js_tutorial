import { SphereGeometry, MeshPhysicalMaterial } from "three";
import MeshObject from "../class/objectSystem/1.MeshObject";

const ReflectingBall = async (
  ...geometryParams: SphereGeometryParameters
): Promise<MeshObject> => {
  const geometry = new SphereGeometry(...geometryParams);
  const material = new MeshPhysicalMaterial({
    roughness: 0.12,
    metalness: 1,
  });
  const ball = new MeshObject(geometry, material);

  ball.addRefelctions();

  return ball;
};

export default ReflectingBall;
