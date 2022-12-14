import { Vector3, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { obstaclesConfig } from "./ObstaclesConfig";

const rand = (num) => Math.round(Math.random() * num);

const genObstacleStr = (amount) => {
  let tmpStr = "";
  while (tmpStr.length < amount) {
    tmpStr += "-";
  }
  let randNum = rand(amount - 1);
  let obstaclesStr =
    tmpStr.substring(0, randNum) + "*" + tmpStr.substring(randNum + 1);
  if (amount > 4) {
    randNum = rand(amount - 1);
    obstaclesStr =
      obstaclesStr.substring(0, randNum) +
      "*" +
      obstaclesStr.substring(randNum + 1);
  }
  return obstaclesStr;
};

export class Obstacles {
  constructor(game) {
    this.config = obstaclesConfig;
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.game = game;
    this.scene = game.scene;
    this.loadPlant();
    this.loadBomb();
    this.load = false;
    this.ready = false;
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
        if (this.bomb !== undefined) this.initialize(this.config);
      },
      (xhr) => {
        this.loadingBar.update("plant", xhr.loaded, xhr.total);
      }
    );
  }

  loadBomb() {
    const loader = new GLTFLoader().setPath(`${this.assetsPath}/obstacles/`);
    this.ready = false;
    loader.load(
      "bomb.gltf",
      (gltf) => {
        this.bomb = gltf.scene.children[0];
        this.bomb.scale.set(2, 2, 2);
        this.bomb.name = "bomb";
        if (this.plant !== undefined) {
          this.initialize(this.config);
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

    let tmpPosX = -this.config.widthSize / 2;
    let obstaclesSrt = genObstacleStr(this.config.numObstacles);

    let posZ = -10; // depth

    for (let i = 0; i < this.config.numRows; i++) {
      const obstacle = new Group();
      obstacle.position.z = posZ;
      obstacle.position.x = 0;

      for (let i = 0; i < this.config.numObstacles; i++) {
        let element;
        if (obstaclesSrt[i] !== "-") {
          element = this.plant.clone();
        } else {
          element = this.bomb.clone();
        }
        element.position.x = tmpPosX;
        element.userData.hit = false;
        console.log(element.children.length);
        element.children.forEach((child) => {
          child.visible = true;
        });
        obstacle.add(element);
        this.obstacles.push(element);

        tmpPosX += this.config.offset;
      }

      this.scene.add(obstacle);
      obstaclesSrt = genObstacleStr(this.config.numObstacles);
      tmpPosX = -this.config.widthSize / 2;
      posZ -= 10;
    }

    this.ready = true;
  }

  reset() {}

  respawnObstacle(obstacle) {}
  update(playerPos) {
    // console.log(playerPos)
  }
}
