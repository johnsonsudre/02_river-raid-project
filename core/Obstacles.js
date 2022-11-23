import { Vector3, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Obstacles {
  constructor(game) {
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.game = game;
    this.scene = game.scene;
    this.loadPlant.bind(this);
    this.loadBomb.bind(this);
    this.load;
    this.ready = true;
    this.tmpPos = new Vector3();
  }

  loadPlant() {
    const loader = new GLTFLoader().setPath(`${this.assetsPath}/obstacles/`);
    this.ready = false;
    loader.load(
      "plant.gltf",
      (gltf) => {
        this.plant = gltf.scene.children[0];
        this.plant.name = "plant";
        if (this.bomb !== undefined) this.initialize();
      },
      (xhr) => {
        this.loadingBar("plant", xhr.loaded, xhr.total);
      }
    );
  }

  loadBomb() {
    const loader = new GLTFLoader().setPath(`${this.assetsPath}/obstacles/`);
    this.ready = false;
    loader.load(
      "bomb.gltf",
      (gltf) => {
        this.plant = gltf.scene.children[0];
        this.plant.name = "bomb";
        if (this.plant !== undefined) this.initialize();
      },
      (xhr) => {
        this.loadingBar("bomb", xhr.loaded, xhr.total);
      },
      (err) => {
        console.error(err);
      }
    );
  }
  initialize() {}
  reset() {}
  update(playerPos) {
    // console.log(playerPos)
  }
}
