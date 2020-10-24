import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-mining-site',
  templateUrl: './mining-site.component.html',
  styleUrls: ['./mining-site.component.scss'],
})
export class MiningSiteComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Add scene and camera

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 350;

    // Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    //Enable lighting
    var keyLight = new THREE.DirectionalLight(
      new THREE.Color('hsl(30, 100%, 75%)'),
      1.0
    );
    keyLight.position.set(-100, 0, 100);

    var fillLight = new THREE.DirectionalLight(
      new THREE.Color('hsl(240, 100%, 75%)'),
      0.75
    );
    fillLight.position.set(100, 0, 100);

    var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);

    // TODO: Load textures

    // Load material and obj
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('../../../assets/threejs-assets/');
    mtlLoader.load('geomodel.mtl', (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('../../../assets/threejs-assets/');
      objLoader.load('geomodel.obj', (object) => {
        // Retrieve the mesh
        const mesh = object.children[0];
        // @ts-ignore-next-line
        //Create geometry object
        const geo = new THREE.Geometry().fromBufferGeometry(mesh.geometry);

        console.log(geo.faces);

        scene.add(object);
      });
    });

    // Create basic animation function

    var animate = () => {
      requestAnimationFrame(animate);

      controls.update();

      renderer.render(scene, camera);
    };

    animate();
  }
}
