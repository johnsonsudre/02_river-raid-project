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
    
    this.clock = new THREE.Clock(); // to track the time elapsed in the game
    
    this.assetsPath = "/assets";
    
    this.camera = new THREE.PerspectiveCamera(70, getAspectRatio(), 0.5, 100);
    this.camera.position.set(-4, 0, 0)
    this.camera.lookAt(8,0,0);
    
    this.cameraController = new THREE.Object3D();
    this.cameraController.add(this.camera);
    this.cameraTarget = new THREE.Vector3(8,0,0);
    
    this.scene = new THREE.Scene();
    this.scene.add(this.cameraController);
    
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbfff, 1);
    this.scene.add(ambient);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    window.addEventListener("resize", this.resize.bind(this));
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
