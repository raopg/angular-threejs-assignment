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
  objFile: string = 'geomodel.obj';
  mtlFile: string = 'geomodel.mtl';
  assetPath: string = '../../../assets/threejs-assets/';

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

    // Load material and obj
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(this.assetPath);
    mtlLoader.load(this.mtlFile, (materials) => {
      // Pre-load materials and add it to the object loader
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(this.assetPath);

      objLoader.load(this.objFile, (object) => {
        // Hard coded, this is the number of texture files we have
        const materialCount = 7;
        const mesh = object.children[0]; // Only one mesh

        // Get a Geometry object for Face3 and Vector3 level calculations
        const geo = new THREE.Geometry().fromBufferGeometry(
          // @ts-ignore
          mesh.geometry
        );

        var faces = geo.faces;
        var hFaces = [];
        var vFaces = [];
        var xAxis = new THREE.Vector3(1, 0, 0);

        for (var i = 0; i < faces.length; i++) {
          // Check angle between face's normal vector and x-axis
          if (xAxis.angleTo(faces[i].normal) < 1) {
            // Account for 1 radian as delta
            vFaces.push(faces[i]);
          } else {
            hFaces.push(faces[i]);
          }
        }

        // New textures for bench, floor and vertical points
        var hMaterialBench = new THREE.MeshPhongMaterial({ color: '#b3c7e4' });
        var hMaterialFloor = new THREE.MeshPhongMaterial({ color: '#ee861b' });
        var vMaterial = new THREE.MeshPhongMaterial({ color: '#000000' });

        // @ts-ignore
        mesh.material.push(hMaterialBench);
        // @ts-ignore
        mesh.material.push(hMaterialFloor);
        //@ts-ignore
        mesh.material.push(vMaterial);

        // Set up indices for assignment to different face3 objects
        var hBenchIndex = materialCount;
        var hFloorIndex = materialCount + 1;
        var vIndex = materialCount + 2;

        let maxZ = 0;
        let minZ = Infinity;
        (function () {
          // Find the tallest and shortest point
          // in terms of z coordinate so that we can estimate height of all horizontal
          // points.

          geo.vertices.forEach((vertex) => {
            if (vertex.z > maxZ) {
              maxZ = vertex.z;
            } else if (vertex.z < minZ) {
              minZ = vertex.z;
            }
          });
        })();

        // Set horizontal vectors with correct color
        for (var i = 0; i < hFaces.length; i++) {
          var face = hFaces[i];
          // Get corresponding vertices of face
          var v1 = geo.vertices[face.a];
          var v2 = geo.vertices[face.b];
          var v3 = geo.vertices[face.c];

          // Calculare avg z
          var averageZ = (v1.z + v2.z + v3.z) / 3;

          if (Math.abs(maxZ - averageZ) > Math.abs(averageZ - minZ)) {
            // If average z is closer to maxZ than minZ, group it with bench points
            face.materialIndex = hBenchIndex;
          } else {
            face.materialIndex = hFloorIndex;
          }
        }
        // Set vertical faces to the new vertical material
        for (var i = 0; i < vFaces.length; i++) {
          vFaces[i].materialIndex = vIndex;
        }

        hFaces.concat(vFaces);
        geo.faces = hFaces;

        // @ts-ignore
        // Convert Geometry obj back into BufferGeometry
        mesh.geometry = new THREE.BufferGeometry().fromGeometry(geo);

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
