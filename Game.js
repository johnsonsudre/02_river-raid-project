import "./style.css";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { LoadingBar } from "./libs/LoadingBar";
import { Plane } from "./core/Plane.js";
import { Obstacles } from "./core/Obstacles";

function getAspectRatio() {
  return window.innerWidth / window.innerHeight;
}

class Game {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.loadingBar = new LoadingBar();
    this.loadingBar.visible = false;

    this.clock = new THREE.Clock(); // to track the time elapsed in the game

    this.assetsPath = "/assets";

    this.camera = new THREE.PerspectiveCamera(70, getAspectRatio(), 0.5, 10000);
    this.camera.position.set(0, 10, 5);
    this.camera.lookAt(0, 0, 0);

    this.cameraController = new THREE.Object3D();
    this.cameraController.add(this.camera);
    this.cameraTarget = new THREE.Vector3(0, 0, 1);

    this.scene = new THREE.Scene();
    this.scene.add(this.cameraController);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z -= 10;
    this.scene.add(cube);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbfff, 1);
    this.scene.add(ambient);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEnconding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);

    this.setEnvironment();

    this.load();

    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));

    document.addEventListener("touchstart", this.mouseDown.bind(this));
    document.addEventListener("touchend", this.mouseUp.bind(this));
    document.addEventListener("mousedown", this.mouseDown.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));

    this.spaceKey = false;
    this.leftKey = false;
    this.rightKey = false;
    this.active = false;

    const btn = document.getElementById("playBtn");
    btn.addEventListener("click", this.startGame.bind(this));

    window.addEventListener("resize", this.resize.bind(this));
    container.appendChild(this.renderer.domElement);
    this.render();
  }

  mouseDown(evt) {
    this.spaceKey = true;
    this.leftKey = evt.clientX <= window.innerWidth / 2;
    this.rightKey = evt.clientX > window.innerWidth / 2;
  }
  f;

  mouseUp(evt) {
    this.spaceKey = false;
    this.leftKey = false;
    this.rightKey = false;
  }

  keyDown(evt) {
    switch (evt.keyCode) {
      case 32:
        this.spaceKey = true;
        break;
      case 37:
        this.leftKey = true;
        break;
      case 39:
        this.rightKey = true;
        break;
    }
  }

  keyUp(evt) {
    switch (evt.keyCode) {
      case 32:
        this.spaceKey = false;
        break;
      case 37:
        this.leftKey = false;
        break;
      case 39:
        this.rightKey = false;
        break;
    }
  }

  startGame() {
    const instructions = document.getElementById("instructions");
    const gameover = document.getElementById("gameover");
    const info = document.getElementById("info");
    const btn = document.getElementById("playBtn");
    instructions.style.display = "none";
    gameover.style.display = "none";
    info.style.display = "block";
    btn.style.display = "none";

    this.lives = 4;
    this.score = 0;

    let elm = document.getElementById("lives");
    elm.innerHTML = this.lives;

    elm = document.getElementById("score");
    elm.innerHTML = this.score;

    this.player.reset();
    this.obstacles.reset();

    this.active = true;
    setTimeout(this.gameOver.bind(this), 2000);
  }

  incScore() {
    this.score++;
    const elm = document.getElementById("score");
    elm.innerHTML = this.score;
  }

  gameOver() {
    this.active = false;

    const instructions = document.getElementById("instructions");
    const gameover = document.getElementById("gameover");
    const btn = document.getElementById("playBtn");

    instructions.style.display = "block";
    gameover.style.display = "block";
    btn.style.display = "block";
    this.player.ready = false;
  }

  setEnvironment() {
    const loader = new RGBELoader().setDataType(THREE.HalfFloatType);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    loader.load(
      this.assetsPath + "/hdr/venice_sunset_1k.hdr",
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        this.scene.environment = envMap;
      },
      undefined,
      (err) => {
        console.error(err.message);
      }
    );
  }

  load() {
    this.loading = true;
    this.loadingBar.visible = true;
    this.loadSkyBox();
    this.player = new Plane(this);
    this.obstacles = new Obstacles(this);
  }

  loadSkyBox() {
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath(`${this.assetsPath}/paintedsky/`)
      .load(
        ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
        () => {
          this.renderer.setAnimationLoop(this.render.bind(this));
        }
      );
  }

  resize() {
    this.camera.aspect = getAspectRatio();
    this.camera.updateProjectionMatrix(); // so as not to distort the render
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateCamera() {
    if (this.player.plane) {
      this.cameraController.position.copy(this.player.plane.position);
      this.cameraController.position.y = 0;
      this.cameraTarget.copy(this.player.plane.position);
      this.cameraTarget.z -= 7;
      this.camera.lookAt(this.cameraTarget);
    }
  }

  render() {
    if (this.loading) {
      if (this.player.ready && this.obstacles.ready) {
        this.loading = false;
        this.loadingBar.visible = false;
      } else {
      }
      return;
    }

    const time = this.clock.getElapsedTime();

    if (this.active) {
      this.obstacles.update(this.player.plane.position);
      this.player.update(time);
    }

    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }
}

export { Game };
