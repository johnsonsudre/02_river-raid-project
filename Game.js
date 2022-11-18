import "./style.css";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { LoadingBar } from "./libs/LoadingBar";
import { Plane } from "./Plane.js";

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
    this.active = false;

    const btn = document.getElementById("playBtn");
    btn.addEventListener("click", this.startGame.bind(this));

    window.addEventListener("resize", this.resize.bind(this));
    container.appendChild(this.renderer.domElement);
    this.render();
  }

  keyDown() {}
  keyUp() {}
  mouseDown() {}
  mouseUp() {}

  startGame() {
    console.log('startGame');
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
    this.plane = new Plane(this);
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
    if (this.plane.plane) {
      this.cameraController.position.copy(this.plane.plane.position);
      this.cameraController.position.y = 0;
      this.cameraTarget.copy(this.plane.plane.position);
      this.cameraTarget.z -= 7;
      this.camera.lookAt(this.cameraTarget);
    }
  }

  render() {
    if (this.loading) {
      if (this.plane.ready) {
        this.loading = false;
        this.loadingBar.visible = false;
      } else {
      }
      return;
    }

    const time = this.clock.getElapsedTime();
    this.plane.update(time);
    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }
}

export { Game };
