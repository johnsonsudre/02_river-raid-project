import "./style.css";
import * as THREE from "three";
import { LoadingBar } from "./libs/LoadingBar";

function getAspectRatio() {
  return window.innerWidth / window.innerHeight;
}

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.loadingBar = new LoadingBar();
    this.loadingBar.visible = false;

    this.clock = new THREE.Clock();

    this.assetsPath = "/assets";

    this.camera = new THREE.PerspectiveCamera(60, getAspectRatio(), 0.02, 10);

    window.addEventListener("resize", this.resize.bind(this));

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(this.renderer.domElement);
  }

  resize() {
    this.camera.aspect = getAspectRatio();
    this.camera.updateProjectionMatrix(); // so as not to distort the render
    console.log(window.innerWidth, window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export { App };
