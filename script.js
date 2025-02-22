// script.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container').appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

// Load car model
const loader = new GLTFLoader();
let car;
loader.load('car_model.glb', (gltf) => {
    car = gltf.scene;
    scene.add(car);
    car.position.set(0, 0, 0);
});

// Road texture
const roadTexture = new THREE.TextureLoader().load('road_texture.jpg');
const roadGeometry = new THREE.PlaneGeometry(10, 20);
const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);
controls.update();

// Animate wheels (assuming car has wheel objects)
function animateWheels() {
    if (car) {
        car.traverse((child) => {
            if (child.name.includes('wheel')) {
                child.rotation.x += 0.1;
            }
        });
    }
}

// Keyboard interaction for camera movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') camera.position.x -= 0.5;
    if (event.key === 'ArrowRight') camera.position.x += 0.5;
    if (event.key === 'ArrowUp') camera.position.z -= 0.5;
    if (event.key === 'ArrowDown') camera.position.z += 0.5;
});

// Mouse interaction for rotating light
document.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    light.position.set(x * 5, 5, y * 5);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    animateWheels();
    controls.update();
    renderer.render(scene, camera);
}
animate();
