import { Vector3, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Obstacles {
  constructor(game) {
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.game = game;
    this.scene = game.scene;
    this.loadPlant();
    this.loadObstacle();
    this.load;
    this.ready = true;
    this.tmpPos = new Vector3();
  }
  loadPlant() {}
  loadObstacle() {}
  reset() {}
  update(playerPos) {
    // console.log(pos)
  }
}
