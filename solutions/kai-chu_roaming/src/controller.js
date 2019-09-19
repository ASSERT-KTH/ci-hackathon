import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import {  MapControls} from 'three/examples/jsm/controls/MapControls';
//OrbitControls,
import * as THREE from 'three';

export function createController(camera) {
    var controls = new FirstPersonControls(camera);

    controls.movementSpeed = 1;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;
    return controls;
}

export function createOrbitController(camera) {
    var controls = new MapControls(camera);
    //controls.autoRotate = false; // turn this guy to true for a spinning camera
    // I prefer to swap the mouse controls, but most examples out there don't:
    // Orbit Controls >
// I prefer to swap the mouse controls, but most examples out there don't:
/*
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
	MIDDLE: THREE.MOUSE.DOLLY,
	RIGHT: THREE.MOUSE.PAN
  };*/
  controls.keys = {
	LEFT: 37, //left arrow
	UP: 38, // up arrow
	RIGHT: 39, // right arrow
	BOTTOM: 40 // down arrow
}
controls.enablePan = true;
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.autoRotate = false;
controls.maxPolarAngle = Math.PI/2; // Don't let to go below the ground*/
controls.screenSpacePanning = false;
				controls.minDistance = 100;
				controls.maxDistance = 500;
/*
controls.enablePan = true;
controls.enableDamping = true; // For that slippery Feeling
controls.dampingFactor = 0.12; // Needs to call update on render loop 
controls.rotateSpeed = 0.08; // Rotate speed
controls.autoRotate = false; // turn this guy to true for a spinning camera
controls.autoRotateSpeed = 0.08; // 30*/
// < Orbit Controls


    return controls;
}

