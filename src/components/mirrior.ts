import { PlaneGeometry, MeshPhongMaterial } from "three";
import AdvancedMesh from "../class/objectSystem/advancedMesh";

const Mirror = async (
  ...[width, height, widthSegments, heightSegments]: PlaneGeometryParameters
): Promise<AdvancedMesh> => {
  const geometry = new PlaneGeometry(
    width,
    height,
    widthSegments,
    heightSegments
  );
  const material = new MeshPhongMaterial();
  const ball = new AdvancedMesh(geometry, material);

  ball.addRefelctions();

  return ball;
};

export default Mirror;
