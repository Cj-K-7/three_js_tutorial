import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function main() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, //filed of view
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1, //view frustrum near
    1000 // view frustrum far
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("webgl") as HTMLCanvasElement,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.setZ(50);

  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
  });
  const torus = new THREE.Mesh(geometry, material);

  scene.add(torus);

  const pointLight = new THREE.PointLight(0xffffff);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  const gridHelper = new THREE.GridHelper(1000, 100);
  pointLight.position.set(10, 3, 5);
  scene.add(pointLight, pointLightHelper, ambientLight, gridHelper);

  const controls = new OrbitControls(camera, renderer.domElement);

  function addStar() {
    const geometry = new THREE.SphereGeometry(1, 10, 10);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
      .fill(null)
      .map(() => THREE.MathUtils.randFloatSpread(500));
    star.position.set(x, y, z);
    scene.add(star);
  }

  Array(200).fill(null).forEach(addStar);

  function animate() {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;

    controls.update();

    renderer.render(scene, camera);
  }

  animate();
}

main();
