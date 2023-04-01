import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function main() {
  // const app = document.querySelector<HTMLDivElement>("#app")!;

  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(
    75, //fov — Camera frustum vertical field of view. Default value is 50.
    window.innerWidth / window.innerHeight, //aspect — Camera frustum aspect ratio. Default value is 1.
    0.1, //near — Camera frustum near plane. Default value is 0.1.
    1000 //far — Camera frustum far plane. Default value is 2000.
  );

  const renderer = new three.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new three.BoxGeometry(1, 1, 1);
  const material = new three.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new three.Mesh(geometry, material);

  const controls = new OrbitControls(camera, renderer.domElement);

  scene.add(cube);

  camera.position.z = 10;
  controls.update();

  function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
  }

  animate();
}

main();
