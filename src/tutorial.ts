import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CharacterControls } from "./class/physic/characterContorols";
import { KeyDisplay } from "./class/physic/keyBinding";

function main() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000515);

  const camera = new THREE.PerspectiveCamera(
    75, //filed of view
    window.innerWidth / window.innerHeight, //aspect ratio
    1, //view frustrum near
    1500 // view frustrum far
  );
  camera.position.set(5, 5, 0);
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
    // const textureLoader = new THREE.TextureLoader();
    // const sandBaseColor = textureLoader.load("./src/imgs/Sand_COLOR.jpg");
    // const sandNormalMap = textureLoader.load("./src/imgs/Sand_NRM.jpg");
    // const sandHeightMap = textureLoader.load("./src/imgs/Sand_DISP.jpg");
    // const sandAmbientOcclusion = textureLoader.load("./src/imgs/Sand_OCC.jpg");

    let pos = { x: 0, y: -1, z: 3 };
    let scale = { x: 1000, y: 2, z: 1000 };

    let floor = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({
        color: 0x509030,
        // map: sandBaseColor,
        // normalMap: sandNormalMap,
        // displacementMap: sandHeightMap,
        // displacementScale: 0.1,
        // aoMap: sandAmbientOcclusion,
      })
    );
    floor.position.set(pos.x, pos.y, pos.z);
    floor.scale.set(scale.x, scale.y, scale.z);
    floor.castShadow = true;
    floor.receiveShadow = true;
    // floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    floor.userData.ground = true;
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

  // const pointLightHelper = new THREE.PointLightHelper(pointLight);
  const ambientLight = new THREE.AmbientLight(0xff505050);
  scene.add(ambientLight);
  // const gridHelper = new THREE.GridHelper(1000, 100);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
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

  var characterControls: CharacterControls;

  const dracoLoader = new DRACOLoader();
  const gltfLoader = new GLTFLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  dracoLoader.setDecoderConfig({ type: "js" });
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load("/src/model/starter-scene.glb", function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
      if (object.isMesh) object.castShadow = true;
    });
    model.position.set(50, 0, 50);
    scene.add(model);
  });

  gltfLoader.load(
    "/src/model/Soldier.glb",
    function (gltf) {
      const model = gltf.scene;
      model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
      });
      scene.add(model);

      const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap: Map<string, THREE.AnimationAction> = new Map();
      gltfAnimations
        .filter((a) => a.name != "TPose")
        .forEach((a: THREE.AnimationClip) => {
          animationsMap.set(a.name, mixer.clipAction(a));
        });

      characterControls = new CharacterControls(
        model,
        mixer,
        animationsMap,
        controls,
        camera,
        "Idle"
      );
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );

  const keysPressed = {};
  const keyDisplayQueue = new KeyDisplay();
  document.addEventListener(
    "keydown",
    (event) => {
      keyDisplayQueue.down(event.key);
      if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle();
      } else {
        (keysPressed as any)[event.key.toLowerCase()] = true;
      }
    },
    false
  );
  document.addEventListener(
    "keyup",
    (event) => {
      keyDisplayQueue.up(event.key);
      (keysPressed as any)[event.key.toLowerCase()] = false;
    },
    false
  );

  const clock = new THREE.Clock();

  function animate() {
    dragObject();
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
      characterControls.update(mixerUpdateDelta, keysPressed);
    }
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
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
    // const { clientX, clientY, currentTarget } = event;
    // console.log(clientX, clientY, currentTarget);
    if (draggable) {
      draggable = null as any;
      return;
    }

    clickMouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(clickMouse, camera);
    console.log(scene.children);
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
