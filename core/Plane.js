import { Vector3, AxesHelper } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const SPEED = 0.05;

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
        const axesHelper = new AxesHelper(2);
        this.plane.add(axesHelper);
        this.speed = 0.1;
        this.velocity = new Vector3(0, 0, 0);
        this.propellor = this.plane.getObjectByName("propellor");
        this.ready = true;
      },
      (xhr) => {
        this.loadingBar.update("plane", xhr.loaded, xhr.total);
      },
      (err) => {}
    );
  }


  reset(){
    this.plane.position.set(0,0,0);
    this.velocity.set(0,0,0.001);
  }

  update(time) {
    if (this.propellor !== undefined) {
      this.propellor.rotateZ(10);
    }
    
    this.plane.rotation.set(0, 0, Math.sin(time) * 0.05, "XYZ");
    this.plane.position.y = Math.cos(time / 0.5) * 0.15;
    
    if (this.game.active) {
      if (this.game.leftKey) {
        this.speed = SPEED;
      }

      if (this.game.rightKey) {
        this.speed = -SPEED;
      }

      this.velocity.z -= 0.001;
      this.plane.translateZ(this.velocity.z);
      
      if (this.game.leftKey || this.game.rightKey) {
        this.plane.position.x += this.speed;
      }
    
    }
  }
}

export { Plane };
