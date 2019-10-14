function off() {

  document.getElementById("overlay").style.display = "none";
}
//creates scene for overlay
let  pivotPoint = new THREE.Object3D();
let camera1, scene1, renderer1;
init();
animate();


function init() {

  camera1 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
  camera1.position.z = 8;
  camera1.position.y = 0.3;
  camera1.position.x = 0;

  scene1 = new THREE.Scene();


  let loader1 = new THREE.FontLoader(); //loader for font
  loader1.load('https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {
    let geometry1 = new THREE.TextGeometry('Enter', {
      font: font,
      size: 0.9,
      height: 0.1,
      curveSegments: 4,
    });
    geometry1.center();


    let material1 = new THREE.MeshBasicMaterial({ //material for font
      color: 0xebe5da,
      // opacity: 0.3
    });

    // material1.map = THREE.ImageUtils.loadTexture('images/skystar.png');

    material1.transparent = true; //this is for opacity to work

    let mesh1 = new THREE.Mesh(geometry1, material1);
   
    mesh1.add(pivotPoint);


    scene1.add(mesh1);
  });


  renderer1 = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer1.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('overlay').appendChild(renderer1.domElement);

}
let createSphere = function () {

  let geometry2 = new THREE.SphereGeometry(1.6, 60, 60);

  let materialSphere = new THREE.MeshPhongMaterial({
    color: 0xebe5da,
    // opacity: 0.55
  });
  // materialSphere.transparent = true;
  materialSphere.map = THREE.ImageUtils.loadTexture('images/plutomap2k.jpg');
  // materialSphere.bumpMap = THREE.ImageUtils.loadTexture('images/plutobump2k.jpg');

  let mesh2 = new THREE.Mesh(geometry2, materialSphere);
  mesh2.position.x = 2;
  mesh2.position.y = 1.4;
  mesh2.position.z = -1;
  mesh2.rotation.y = 0.15;

  pivotPoint.add(mesh2);
  // scene1.add(mesh2);

  let light2 = new THREE.SpotLight(0xebe5da, 0.1, 500)
  light2.position.set(12, 10, 25);
  scene1.add(light2);

  let ambientLight = new THREE.AmbientLight(0xffffff);
  scene1.add(ambientLight)

  let render = function () {
    requestAnimationFrame(render);

    mesh2.rotation.x -= 0.0018;
    pivotPoint.rotation.x += 0.0018;
    mesh2.rotation.y += 0.002;
    // mesh2.rotation.z += 0.001;
    renderer1.render(scene1, camera1);
  }


  render();

};
createSphere();

// legend animation

let isLegendShowing = false;

function animation() {

  let legend = document.getElementById('legend');
  if (isLegendShowing) {
    hideLegend();
  } else {
    showLegend();
  
  } 



  let loader1 = new THREE.FontLoader(); //loader for font
  loader1.load('https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {
    let geometry1 = new THREE.TextGeometry('Enter', {
      font: font,
      size: 0.5,
      height: 0.1,
      curveSegments: 4,
    });
    geometry1.center();




    let material1 = new THREE.MeshBasicMaterial({ //material for font
      color: 0xE5A774
      // opacity: 0.5
    });

    // material1.transparent = true; //this is for opacity to work

    let mesh1 = new THREE.Mesh(geometry1, material1);
    scene1.add(mesh1);
  });




  renderer1 = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer1.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('overlay').appendChild(renderer1.domElement);
  window.addEventListener('resize', onWindowResize, false);


}

// legend animation

// let isLegendShowing = false;

function animation() {

  let legend = document.getElementById('legend');
  if (isLegendShowing) {
    hideLegend();
  } else {
    showLegend();
  }

}

function hideLegend() {

  document.getElementById('legend').style.top = '94vh';
  legend.classList.add('legend-animation-hide');
  setTimeout(function () {
    document.getElementById('legend').classList.remove('legend-animation-show');
  });
  isLegendShowing = false;
}

function showLegend() {

  document.getElementById('legend').style.top = '0vh';
  legend.classList.add('legend-animation-show');
  setTimeout(function () {
    document.getElementById('legend').classList.remove('legend-animation-hide');
  });
  isLegendShowing = true;
}

function animate() {

  requestAnimationFrame(animate);
  renderer1.render(scene1, camera1);

}

function onWindowResize() {
  camera1.aspect = window.innerWidth / window.innerHeight;
  camera1.updateProjectionMatrix();
  renderer1.setSize(window.innerWidth, window.innerHeight);
}

animate();