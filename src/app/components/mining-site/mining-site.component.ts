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
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(this.assetPath);
      objLoader.load(this.objFile, (object) => {
        const materialCount = 7;

        const geo = new THREE.Geometry().fromBufferGeometry(
          // @ts-ignore
          object.children[0].geometry
        );

        var faces = geo.faces;
        var hFaces = [];
        var vFaces = [];
        var xAxis = new THREE.Vector3(1, 0, 0);

        for (var i = 0; i < faces.length; i++) {
          if (xAxis.angleTo(faces[i].normal) < 1) {
            // Account for 1 radian as delta
            vFaces.push(faces[i]);
          } else {
            hFaces.push(faces[i]);
          }
        }

        var hMaterialBench = new THREE.MeshPhongMaterial({ color: '#b3c7e4' });
        var hMaterialFloor = new THREE.MeshPhongMaterial({ color: '#ee861b' });
        var vMaterial = new THREE.MeshPhongMaterial({ color: '#000000' });

        // @ts-ignore
        object.children[0].material.push(hMaterialBench);
        // @ts-ignore
        object.children[0].material.push(hMaterialFloor);
        //@ts-ignore
        object.children[0].material.push(vMaterial);

        console.log(hFaces, vFaces, faces);

        var hBenchIndex = materialCount;
        var hFloorIndex = materialCount + 1;
        var vIndex = materialCount + 2;

        let maxZ = 0;
        let minZ = Infinity;
        (function () {
          // Find the tallest point in terms of z coordinate so that we estimate height of all horizontal
          // points

          geo.vertices.forEach((vertex) => {
            if (vertex.z > maxZ) {
              maxZ = vertex.z;
            } else if (vertex.z < minZ) {
              minZ = vertex.z;
            }
          });

          return maxZ;
        })();

        console.log(maxZ);

        for (var i = 0; i < hFaces.length; i++) {
          var face = hFaces[i];
          // Get corresponding vertices of face
          var v1 = geo.vertices[face.a];
          var v2 = geo.vertices[face.b];
          var v3 = geo.vertices[face.c];

          // Calculare avg z
          var averageZ = (v1.z + v2.z + v3.z) / 3;

          if (Math.abs(maxZ - averageZ) > Math.abs(averageZ - minZ)) {
            // If average z is closer to maxZ than 0, group it with bench points
            face.materialIndex = hBenchIndex;
          } else {
            face.materialIndex = hFloorIndex;
          }
        }

        for (var i = 0; i < vFaces.length; i++) {
          vFaces[i].materialIndex = vIndex;
        }

        hFaces.concat(vFaces);
        geo.faces = hFaces;

        // @ts-ignore
        object.children[0].geometry = new THREE.BufferGeometry().fromGeometry(
          geo
        );

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
