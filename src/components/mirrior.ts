import { PlaneGeometry, MeshPhongMaterial } from "three";
import AdvancedMesh from "../class/objectSystem/advancedMesh";

const Mirror = async (
  ...geometryParams: PlaneGeometryParameters
): Promise<AdvancedMesh> => {
  const geometry = new PlaneGeometry(...geometryParams);
  const material = new MeshPhongMaterial();
  const ball = new AdvancedMesh(geometry, material);

  await ball.addRefelctions();

  return ball;
};

export default Mirror;
