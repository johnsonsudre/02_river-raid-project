import { Vector3, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Explosion } from "./Explosions";
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
    this.explosions = [];
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

    let posZ = 0; // depth
    let type;

    for (let numRow = 0; numRow < this.config.numRows; numRow++) {
      const obstacle = new Group();
      posZ -= 10;
      for (let item = 0; item < this.config.numObstacles; item++) {
        let element;
        if (obstaclesSrt[item] !== "-") {
          type = "plant";
          element = this.plant.clone();
        } else {
          type = "bomb";
          element = this.bomb.clone();
        }
        element.name = `row${numRow}-item${item}-${type}`;
        element.userData.name = element.name;
        element.userData.type = type;

        element.position.x = tmpPosX;
        element.children.forEach((child) => {
          child.visible = true;
        });
        obstacle.add(element);
        tmpPosX += this.config.offset;
      }
      obstacle.userData.hit = false;
      obstacle.position.z = posZ;
      obstacle.position.x = 0;
      obstacle.name = `obstacles-row${numRow}`;
      this.obstacles.push(obstacle);
      this.scene.add(obstacle);
      obstaclesSrt = genObstacleStr(this.config.numObstacles);
      tmpPosX = -this.config.widthSize / 2;
    }
    this.reset();
    this.ready = true;
  }

  removeExplosion(explosion) {
    const index = this.explosions.indexOf(explosion);
    if (index != -1) this.explosions.splice(index, 1);
  }

  reset() {
    this.obstacleSpwan = { pos: 20, offset: 5 };
    this.obstacles.forEach((obstacle) => this.respawnObstacle(obstacle));
    let count = 0;
    while (this.explosions.length>0 && count<100){
      this.explosions[0].onComplete();
      count++;
    }
  }

  respawnObstacle(obstacle) {
    console.log(obstacle)
    obstacle.userData.hit = false;
    obstacle.children.forEach(child=>child.visible = true);
  }

  update(posPlayer) {
    let collisionObstacle;
    this.obstacles.forEach((obstacle, i) => {
      if (obstacle.userData.type === "bomb") {
        obstacle.rotateY(0.01);
      }
      const relativePosZ = obstacle.position.z - posPlayer.z;
      if (Math.abs(relativePosZ) < 2 && !obstacle.userData.hit) {
        collisionObstacle = obstacle;
        // console.log(obstacle.userData.hit, relativePosZ);
      }
    });
    if (collisionObstacle !== undefined) {
      const playerPos = this.game.player.plane.position;
      collisionObstacle.children.some((child) => {
        child.getWorldPosition(this.tmpPos);
        const dist = this.tmpPos.distanceToSquared(playerPos);
        if (dist < 1) {
          collisionObstacle.userData.hit = true;
          this.hit(child);
          return true;
        }
      });
    }
    // explosions
    this.explosions.forEach(explosion=>{
      let dt = 0;
      explosion.update(dt);
    })
  }

  hit(obstacle) {
    obstacle.visible = false;
    if (obstacle.userData.type === "plant") {
      this.game.incScore();
    } else {
      this.explosions.push(new Explosion(obstacle, this));
      this.game.decLive();
    }
  }
}
