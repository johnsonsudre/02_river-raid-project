import { Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class Plane {
  constructor(context) {
    this.context = context;
    this.assetsPath = context.assetsPath;
    this.loadingBar = context.loadingBar;
    this.scene = context.scene;
    this.load();
    this.tmpPos = new Vector3();
  }

  get possition() {
    if (this.plane !== undefined) this.plane.getWOrldPosition(this.tmpPos);
    return this.tmpPos;
  }

  set visible(mode) {
    this.plane.visible = mode;
  }

  load() {
    const loader = new GLTFLoader().setPath(`${this.assetsPath}/planes/`);
    this.ready = false;
    loader.load(
      "cartoon_plane.glb",
      (plane) => {
        this.scene.add(plane.scene);
        this.mesh = plane.scene;
        this.velocity = new Vector3(0, 0, 0.1);
        this.propellor = this.mesh.getObjectByName('propellor');
        console.log(this.propellor)
        this.ready = true;
      },
      (xhr) => {
        this.loadingBar.update('plane',xhr.loaded, xhr.total);
      },
      (err) => {}
    );
  }

  update(time) {}
}

export { Plane };
