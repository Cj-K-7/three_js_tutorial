import { scene } from "../../core";
import AdvancedPoints from "./advancedPoints";
import AdvancedMesh from "./advancedMesh";

type ObjectModel = AdvancedMesh | AdvancedPoints;

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
    this.forEach(this.remove);
    this.clear();
  }

  /** dispose all model objects*/
  dispose() {
    this.removeAll();
  }
}

export default ObjectManager;
