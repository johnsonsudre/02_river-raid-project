import { Vector3, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Obstacles {
  constructor(game) {
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.game = game;
    this.scene = game.scene;
    this.loadPlant();
    this.loadBomb();
    this.load;
    this.ready = true;
    this.tmpPos = new Vector3();
  }

  loadPlant() {
    // console.log(this.loadingBar)
    const loader = new GLTFLoader().setPath(`${this.assetsPath}/obstacles/`);
    this.ready = false;
    loader.load(
      "plant.gltf",
      (gltf) => {
        this.plant = gltf.scene.children[0];
        this.plant.name = "plant";
        console.log(this.bomb);
        if (this.bomb !== undefined) this.initialize();
      },
      (xhr) => {
        this.loadingBar.update("plant", xhr.loaded, xhr.total);
      }
    );
  }

  loadBomb(context) {
    const loader = new GLTFLoader().setPath(`${this.assetsPath}/obstacles/`);
    this.ready = false;
    loader.load(
      "bomb.gltf",
      (gltf) => {
        this.bomb = gltf.scene.children[0];
        this.bomb.name = "bomb";
        console.log(this.plant !== undefined);
        if (this.plant !== undefined) {
          this.initialize(this);
        }
      },
      (xhr) => {
        this.loadingBar.update("bomb", xhr.loaded, xhr.total);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  initialize() {
    console.log(this.plant);
    this.scene.add(this.plant);
    this.scene.add(this.bomb);
  }
  reset() {}
  update(playerPos) {
    // console.log(playerPos)
  }
}
