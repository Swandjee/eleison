import * as THREE from "three";

import Stats from 'three/addons/libs/stats.module.js';


let renderer, stats, scene, camera, geometry, clock;
const worldWidth = 512, worldDepth = 512;
const gemPosition = [0, 220, 100];

let gem, plane, ring1, ring2, ring3;

const textureLoader = new THREE.TextureLoader();

init();
animate();

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.y = 220;
    camera.position.z = 250;
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    const material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color(0x69F7BE);

    const ringMaterial = new THREE.MeshMatcapMaterial({color: new THREE.Color(0x69F7BE)});

    gem = new THREE.Mesh(new THREE.OctahedronGeometry(10), material);
    gem.position.set(...gemPosition);
    scene.add(gem);
    
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xe3d0a6});
    geometry = new THREE.PlaneGeometry(20000, 20000, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(- Math.PI / 2);

    const position = geometry.attributes.position;
    position.usage = THREE.DynamicDrawUsage;

    for (let i = 0; i < position.count; i++) {
        const offset = 20;
        const y = 35 * Math.sin(i / 2);
        position.setY(i, y+offset);

    }

    plane = new THREE.Mesh(geometry, planeMaterial);
    plane.position.set(0,0,-5000);
    scene.add(plane);


    ring1 = new THREE.Mesh(new THREE.TorusGeometry(15,1,4,16), ringMaterial);
    ring2 = new THREE.Mesh(new THREE.TorusGeometry(35,1.5,4,24), ringMaterial);
    ring3 = new THREE.Mesh(new THREE.TorusGeometry(60,2,4,32), ringMaterial);

    ring1.position.set(...gemPosition);
    ring2.position.set(...gemPosition);
    ring3.position.set(...gemPosition);

    scene.add(ring1, ring2, ring3);


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color('yellow'), 0);

    scene.fog = new THREE.FogExp2(0xe193e0, 0.0007);

    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {

    const timer = Date.now() * 0.0001;

    //camera.position.x = Math.cos(timer) * 800;
    //camera.position.z = Math.sin(timer) * 800;

    camera.lookAt(gem.position);

    gem.rotation.x = timer * 5;
    gem.rotation.y = timer * 2.5;

    ring1.rotation.x = timer * 4;
    ring1.rotation.y = timer * 2;

    ring2.rotation.x = timer * -3;
    ring2.rotation.y = timer * -1;

    ring3.rotation.x = timer * 2;
    ring3.rotation.y = timer * 1;

    const time = clock.getElapsedTime() * 10;

    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {

        const y = 35 * Math.sin(i / 5 + (time + i) / 7);
        position.setY(i, y);

    }

    position.needsUpdate = true;

    renderer.render(scene, camera);

}