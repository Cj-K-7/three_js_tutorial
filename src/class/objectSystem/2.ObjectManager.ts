import { scene } from "../../core";
import MeshObject from "./1.MeshObject";

type ObjectModel = MeshObject;

class ObjectManager extends Set<ObjectModel> {
  /**
   * add 'models' to scene & set
   * @param objects
   */
  append(...objects: ObjectModel[]) {
    objects.forEach((obj) => {
      super.add(obj);
      scene.add(obj);
    });
  }

  remove(object: ObjectModel | undefined) {
    if (object) {
      this.delete(object);
      object.dispose();
    }
    object = undefined;
  }

  removeAll() {
    this.forEach((object) => object.dispose());
    this.clear();
  }

  /** dispose all model objects*/
  dispose() {
    this.removeAll();
  }
}

export default ObjectManager;
