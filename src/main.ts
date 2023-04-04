import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function main() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000515);

  const camera = new THREE.PerspectiveCamera(
    75, //filed of view
    window.innerWidth / window.innerHeight, //aspect ratio
    1, //view frustrum near
    1500 // view frustrum far
  );
  camera.position.set(-35, 70, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("webgl") as HTMLCanvasElement,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onWindowResize);

  function createFloor() {
    let pos = { x: 0, y: -1, z: 3 };
    let scale = { x: 1000, y: 2, z: 1000 };

    let blockPlane = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshPhongMaterial({ color: 0x60a090 })
    );
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);

    blockPlane.userData.ground = true;
  }

  createFloor();

  const createSphere = (color: number) => {
    const radius = 4;
    const position = { x: 15, y: radius, z: -15 };
    const geometry = new THREE.SphereGeometry(radius, 256, 256);
    const material = new THREE.MeshStandardMaterial({
      color: color,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position.x, position.y, position.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData.draggable = true;
    sphere.userData.name = `${color} sphere`;
    scene.add(sphere);

    return sphere;
  };

  const sphere1 = createSphere(0xffff3030);
  const sphere2 = createSphere(0xff30ff30);
  const sphere3 = createSphere(0xff3030ff);

  sphere1.position.x = 40;
  sphere2.position.x = 0;
  sphere3.position.x = -40;

  const sun = new THREE.DirectionalLight(0xffffa0, 1);
  // const pointLightHelper = new THREE.PointLightHelper(pointLight);
  // const ambientLight = new THREE.AmbientLight(0xff303030);
  // const gridHelper = new THREE.GridHelper(1000, 100);
  sun.position.set(30, 50, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 20000;
  sun.shadow.mapSize.height = 20000;
  sun.shadow.camera.left = -500;
  sun.shadow.camera.right = 500;
  sun.shadow.camera.top = 500;
  sun.shadow.camera.bottom = -500;
  scene.add(sun);

  const controls = new OrbitControls(camera, renderer.domElement);

  function addStar() {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
      .fill(null)
      .map(() => THREE.MathUtils.randFloatSpread(800));
    star.position.set(x, y + 400, z);
    scene.add(star);
  }

  Array(400).fill(null).forEach(addStar);

  function animate() {
    dragObject();

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
  }

  const raycaster = new THREE.Raycaster();
  const clickMouse = new THREE.Vector2();
  const moveMouse = new THREE.Vector2();

  let draggable: THREE.Object3D | null = null;

  function dragObject() {
    if (draggable !== null) {
      raycaster.setFromCamera(moveMouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        for (let o of intersects) {
          if (!o.object.userData.ground) continue;
          let target = o.point;
          draggable.position.x = target.x;
          draggable.position.z = target.z;
        }
      }
    }
  }

  window.addEventListener("click", (event) => {
    const { clientX, clientY, currentTarget } = event;
    console.log(clientX, clientY, currentTarget);
    if (draggable) {
      draggable = null as any;
      return;
    }

    clickMouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(clickMouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0 && intersects[0].object.userData.draggable) {
      draggable = intersects[0].object;
      console.log(intersects[0].object.userData.name);
    }
  });

  window.addEventListener("mousemove", (event) => {
    moveMouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  });

  animate();
}

main();
