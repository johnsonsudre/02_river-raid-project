import { Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class Plane {
  constructor(game) {
    this.game = game;
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.scene = game.scene;
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
      (gltf) => {
        this.scene.add(gltf.scene);
        this.plane = gltf.scene;
        this.velocity = new Vector3(0, 0, 0.1);
        this.propellor = this.plane.getObjectByName("propellor");
        this.ready = true;
      },
      (xhr) => {
        this.loadingBar.update("plane", xhr.loaded, xhr.total);
      },
      (err) => {}
    );
  }

  update(time) {
    if (this.propellor !== undefined) {
      this.propellor.rotateZ(1);
    }
    if (this.plane !== undefined) {
      this.plane.rotation.set(0, 0, Math.sin(time * 3) * 0.05, "XYZ");
      this.plane.position.y = Math.cos(time / 0.25) * 0.05;
    }
  }
}

export { Plane };
