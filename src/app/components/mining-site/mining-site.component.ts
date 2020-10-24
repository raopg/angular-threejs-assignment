import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-mining-site',
  templateUrl: './mining-site.component.html',
  styleUrls: ['./mining-site.component.scss'],
})
export class MiningSiteComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Add scene and camera

    // Make the renderer and add it's dom element to document body
    const canvasElement: HTMLCanvasElement = document.querySelector(
      '#mining-site-canvas'
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasElement });

    //Load obj

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightgrey');
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
  }
}
