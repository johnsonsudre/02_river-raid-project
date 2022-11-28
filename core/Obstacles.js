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
        this.plant.scale.set(2, 2, 2);
        this.plant.name = "plant";
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
        this.bomb.scale.set(2, 2, 2);
        this.bomb.name = "bomb";
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
    this.obstacles = [];
    const rand = (num) => Math.round(Math.random() * num);
    const genObstacleStr = (amount) => {
      let tmpStr = "";
      while (tmpStr.length < amount) {
        tmpStr += "-";
      }
      const randNum = rand(amount - 1);
      let obsStr =
        tmpStr.substring(0, randNum) + "*" + tmpStr.substring(randNum + 1);
      return obsStr;
    };

    const numObstacles = 7;
    const widthSize = 16;
    const offset = widthSize / (numObstacles - 1);
    let tmpPosX = -widthSize / 2;
    let obstaclesSrt = genObstacleStr(numObstacles);
    console.log(obstaclesSrt);

    let posZ = -10;
    for (let i = 0; i < 6; i++) {
      const obstacle = new Group();
      obstacle.position.z = posZ;
      obstacle.position.x = 0;

      for (let i = 0; i < numObstacles; i++) {
        if (obstaclesSrt[i] === "-") {
          const bomb = this.bomb.clone();
          bomb.position.x = tmpPosX;
          obstacle.add(bomb);
          this.obstacles.push(bomb);
        } else {
          const plant = this.plant.clone();
          plant.position.x = tmpPosX;
          obstacle.add(plant);
          this.obstacles.push(plant);
        }
        tmpPosX += offset;
      }

      this.scene.add(obstacle);
      obstaclesSrt = genObstacleStr(numObstacles);
      tmpPosX = -widthSize / 2;
      posZ -= 10;
    }
  }
  reset() {}
  update(playerPos) {
    // console.log(playerPos)
  }
}
