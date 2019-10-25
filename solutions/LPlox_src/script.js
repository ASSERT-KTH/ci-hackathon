/*
Resources:
Made with the help of: https://codepen.io/b29/pen/vQwrNZ
Textures from: https://www.gsmlondon.ac.uk/global-oil-map/#1995-importers-392
*/
//===================================================== Travis data
let host = 'localhost';
let protocol = "ws";
let commitArray = [];
let arrCount = 0;
const arrMax = 200; //Max amount before lag
let oddOrEven = 1;
let our_data_Count = 0;
let tzM10, tzM9, tzM8, tzM7, tzM6, tzM5, tzM4, tzM3, tzM2, tzM1, tz0, tzP1, tzP2, tzP3, tzP4, tzP5, tzP6, tzP7, tzP8, tzP9, tzP10, tzP11, tzP12;

addDataPoint = [{
  origin: {
    name: "0",
    latitude: 0,
    longitude: 0,
    radius: 0
  },
  destination: {
    name: "",
    latitude: 0,
    longitude: 0,
    radius: 0
  }
}];
//===================================================== Timezone calculation
var tzM11 = new Date().toLocaleString("en-US", {
  timeZone: "America/Vancouver"
});
tzM11 = new Date(tzM11);
tzM11.setHours(tzM11.getHours() + -4);

const timeZoneCount = 1;
let timeCount = 0;

let timeZones = [
{
  name: 'timeZoneMinus11',
  hour: 0,
  startLongitude: -171,
}, {
  name: 'timeZoneMinus10',
  hour: 0,
  startLongitude: -156,
}, {
  name: 'timeZoneMinus9',
  hour: 0,
  startLongitude: -141,
}, {
  name: 'timeZoneMinus8',
  hour: 0,
  startLongitude: -126,
}, {
  name: 'timeZoneMinus7',
  hour: 0,
  startLongitude: -111,
}, {
  name: 'timeZoneMinus6',
  hour: 0,
  startLongitude: -96,
}, {
  name: 'timeZoneMinus5',
  hour: 0,
  startLongitude: -81,
}, {
  name: 'timeZoneMinus4',
  hour: 0,
  startLongitude: -66,
}, {
  name: 'timeZoneMinus3',
  hour: 0,
  startLongitude: -51,
}, {
  name: 'timeZoneMinus2',
  hour: 0,
  startLongitude: -37.5,
}, {
  name: 'timeZoneMinus1',
  hour: 0,
  startLongitude: -22.5,
}, {
  name: 'timeZone0',
  hour: 0,
  startLongitude: -7.5,
}, {
  name: 'timeZone1',
  hour: 0,
  startLongitude: 7.5,
}, {
  name: 'timeZone2',
  hour: 0,
  startLongitude: 22.5,
}, {
  name: 'timeZone3',
  hour: 0,
  startLongitude: 37.5,
}, {
  name: 'timeZone4',
  hour: 0,
  startLongitude: 52.5,
}, {
  name: 'timeZone5',
  hour: 0,
  startLongitude: 67.5,
}, {
  name: 'timeZone6',
  hour: 0,
  startLongitude: 82.5,
}, {
  name: 'timeZone7',
  hour: 0,
  startLongitude: 97.5,
}, {
  name: 'timeZone8',
  hour: 0,
  startLongitude: 112.5,
}, {
  name: 'timeZone9',
  hour: 0,
  startLongitude: 127.5,
}, {
  name: 'timeZone10',
  hour: 0,
  startLongitude: 142.5,
}, {
  name: 'timeZon11',
  hour: 0,
  startLongitude: 157.5,
}, {
  name: 'timeZone12',
  hour: 0,
  startLongitude: 172.5,
}];

for (let i = 0; i < timeZones.length; i++) {
  let time = timeZones[i].hour;
  time = tzM11.setHours(tzM11.getHours() + timeZoneCount);
  timeZones[i].hour = new Date(time);
  timeZones[i].hour = timeZones[i].hour.getHours();
  time = 0;
}

//===================================================== Travis code
if (window.location.protocol == "https:") {
  protocol = "wss";
}

function startWS() {
  ws = new WebSocket("wss://travis.durieux.me");
  if (onmessage != null) {
    ws.onmessage = onmessage;
  }
  ws.onclose = function() {
    // Try to reconnect in 5 seconds
    setTimeout(function() {
      startWS()
    }, 5000);
  };
}

//===================================================== Tarvis data loop
let newRadius = 140;
let ws = null;
let newObject = [{
  name: "",
  date: 0,
  hour: 0,
  lati: 0,
  long: 0
}];
let notDrawn = false;
let onmessage = function(e) {

  if (e.data[0] != '{') return;
  let data = JSON.parse(e.data);
  // console.log(data);
  //Saving the json data so it's easier to get
  let user = data.data.commit.author_name;
  let commitTime = data.data.commit.committed_at;

  //if the commit time is not null then do the calculations
  if (commitTime != null) {
    let commitHour = commitTime.substring(11, 13); //Writes the time as hour only
    let findTime = timeZones.findIndex((time) => {
      return time.hour == commitHour;
    });
    let commitYear = commitTime.substring(0, 4);

    let timeLati = generateLatitude();
    let timeLong = generateLongitude(timeZones[findTime].startLongitude);
    if(commitYear == 2019){ newRadius = 140; }
    if(commitYear == 2018){ newRadius = 200; }
    if(commitYear == 2017){ newRadius = 260; }
    console.log(commitYear, newRadius);

    newObject = {
      name: user,
      date: commitTime,
      hour: commitHour,
      lati: timeLati,
      long: timeLong,
      radi: newRadius
    }
    //Create the new object
    //If the user and time is unique, put it in the main array. (commitArray)
    if (userExists(user) === false && arrCount < arrMax) {
      // console.log(arrCount);
      commitArray.push(newObject);
      arrCount++;

      if (commitArray.length % 2 == 0) {
        newDataPoint = {
          origin: {
            name: commitArray[arrCount - 2].name,
            latitude: commitArray[arrCount - 2].lati,
            longitude: commitArray[arrCount - 2].long,
            radius: commitArray[arrCount - 2].radi,
          },
          destination: {
            name: commitArray[arrCount - 1].name,
            latitude: commitArray[arrCount - 1].lati,
            longitude: commitArray[arrCount - 1].long,
            radius: commitArray[arrCount - 1].radi,
          }
        };
        our_data.push(newDataPoint);
        // console.log(our_data);
        notDrawn = true;
      }

      if (oddOrEven === 1) {
        oddOrEven++;
        our_data_Count = 0;
      } else {
        oddOrEven--;
        our_data_Count = 1;
      }
    }
  }
};

//===================================================== functions that the travis code calls
//Checks if user is already in the array (CommitArray)
function userExists(username) {
  return commitArray.some((arr) => {
    return arr.name === username;
  });
}

function checkYear(year){
  return yearArray.indexOf(year);
}

//===================================================== Different time zones

//Returns a random latitude number
function generateLatitude() {
  return Math.floor(Math.random() * 180) - 90;
}

//Returns a random Longitude number from the minimum value
function generateLongitude(min) {
  return Math.floor(Math.random() * 15) - min;
}

//===================================================== add Scene
var scene = new THREE.Scene();
// scene.background = new THREE.Color(0xdddddd);
//===================================================== add Camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 275;

//===================================================== add front & back lighting

var light = new THREE.AmbientLight(new THREE.Color("white"), 0.3); //soft white light
scene.add(light);

var light = new THREE.DirectionalLight(new THREE.Color("white"), 1.2);
light.position.set(1, 3, 2).normalize();
scene.add(light);

var light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
light.position.set(-1, -3, -2).normalize();
scene.add(light);

//===================================================== add canvas
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.LinearToneMapping;
document.body.appendChild(renderer.domElement);

//===================================================== add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

//===================================================== add GLow
var renderScene = new THREE.RenderPass(scene, camera);
var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);
var copyShader = new THREE.ShaderPass(THREE.CopyShader);
copyShader.renderToScreen = true;

var bloomStrength = 2;
var bloomRadius = 0;
var bloomThreshold = 0.5;
var bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomStrength,
  bloomRadius,
  bloomThreshold
);

var composer = new THREE.EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(bloomPass);
composer.addPass(copyShader);

//===================================================== resize
window.addEventListener("resize", function() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//===================================================== putting data into array
function pushData(obj1, obj2) {
  our_data.push({
    obj1,
    obj2
  })
}
//===================================================== data
const our_data = [];

//===================================================== helper functions
const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num);

const DEGREE_TO_RADIAN = Math.PI / 180;

function coordinateToPosition(lat, lng, radius) {
  const phi = (90 - lat) * DEGREE_TO_RADIAN;
  const theta = (lng + 180) * DEGREE_TO_RADIAN;

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

//===================================================== d3.json
d3.json(
  "https://raw.githubusercontent.com/baronwatts/data/master/world.json",
  function(err, data) {
    //===================================================== crate canvas texturefor the globe
    var projection = d3.geo
      .equirectangular()
      .translate([1024, 512])
      .scale(326);

    var countries = topojson.feature(data, data.objects.countries);

    var canvas = d3
      .select("body")
      .append("canvas")
      .style("display", "none")
      .attr("width", "2048px")
      .attr("height", "1024px");

    var context = canvas.node().getContext("2d");

    var path = d3.geo
      .path()
      .projection(projection)
      .context(context);

    context.strokeStyle = "white";
    context.lineWidth = 0.25;
    context.fillStyle = "#000";

    context.beginPath();

    path(countries);

    context.fill();
    context.stroke();

    var mapTexture = new THREE.Texture(canvas.node());
    mapTexture.needsUpdate = true;

    //===================================================== add globe
    var group = new THREE.Group();
    scene.add(group);
    group.rotateX(Math.PI / 8);

    var RADIUS = 140;

    var sphereGeometry = new THREE.SphereGeometry(RADIUS, 60, 60);

    // var sphereMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x0000ff,
    //   transparent: false,
    //   wireframe: true,
    //   wireframeLinewidth: 5,
    //   wireframeLinejoin: 'round',
    //   wireframeLinecap: 'round',
    // })

    var sphereMaterial = new THREE.MeshPhongMaterial({
      opacity: 1,
      shininess: 5,
      specular: 0x1d1d1d,
      color: new THREE.Color("white"),
      map: new THREE.TextureLoader().load('assets/earth.jpg'),
      bumpMap: new THREE.TextureLoader().load('assets/earth-bump.jpg'),
    });

    // var sphereMaterial = new THREE.MeshPhongMaterial({
    //   map: mapTexture,
    //   transparent: true,
    //   opacity: 1,
    //   color: new THREE.Color("white")
    // });
    var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = "earth";
    group.add(earthMesh);

    //===================================================== lng & lat
    function Destination(array) {
      array.map((d, i) => {
        //convert lng & lat coordinates to 3d space
        var startLat = d.origin.latitude;
        var startLng = d.origin.longitude;

        var endLat = d.destination.latitude;
        var endLng = d.destination.longitude;

        var startRadius = d.origin.radius;
        var endRadius = d.destination.radius;

        var x = -(
          startRadius *
          Math.sin((90 - startLat) * (Math.PI / 180)) *
          Math.cos((startLng + 180) * (Math.PI / 180))
        );
        var z =
          startRadius *
          Math.sin((90 - startLat) * (Math.PI / 180)) *
          Math.sin((startLng + 180) * (Math.PI / 180));
        var y = startRadius * Math.cos((90 - startLat) * (Math.PI / 180));

        var x2 = -(
          startRadius *
          Math.sin((90 - endLat) * (Math.PI / 180)) *
          Math.cos((endLng + 180) * (Math.PI / 180))
        );
        var z2 =
          endRadius *
          Math.sin((90 - endLat) * (Math.PI / 180)) *
          Math.sin((endLng + 180) * (Math.PI / 180));
        var y2 = endRadius * Math.cos((90 - endLat) * (Math.PI / 180));

        //store the starting and ending positions of each location
        var start = new THREE.Vector3(x, y, z);
        var end = new THREE.Vector3(x2, y2, z2);

        //points
        var colorOne = "white";
        var colorTwo = "white";
        if(startRadius === 140){
          colorOne = "white";
        }
        if(startRadius === 200){
          colorOne = "yellow";
        }
        if(startRadius === 260){
          colorOne = "red";
        }
        if(endRadius === 140){
          colorTwo = "white";
        }
        if(endRadius === 200){
          colorTwo = "yellow";
        }
        if(endRadius === 260){
          colorTwo = "red";
        }

        var pointGeom = new THREE.SphereGeometry(1, 15, 15);
        var point = new THREE.Mesh(
          pointGeom,
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(colorOne)
          })
        );
        var point2 = new THREE.Mesh(
          pointGeom,
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(colorTwo)
          })
        );

        //spaces out the points
        point.position.set(x, y, z);
        point2.position.set(x2, y2, z2);
        point.lookAt(new THREE.Vector3(0, 0, 0));
        point2.lookAt(new THREE.Vector3(0, 0, 0));
        group.add(point);
        group.add(point2);

        //https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
        const CURVE_MIN_ALTITUDE = 20;
        const CURVE_MAX_ALTITUDE = 100;
        const altitude = clamp(
          start.distanceTo(end) * 0.75,
          CURVE_MIN_ALTITUDE,
          CURVE_MAX_ALTITUDE
        );

        //get the middle position of each location
        var lat = [startLng, startLat];
        var lng = [endLng, endLat];
        var geoInterpolator = d3.geoInterpolate(lat, lng);

        const midCoord1 = geoInterpolator(0.25);
        const midCoord2 = geoInterpolator(0.75);

        const mid1 = coordinateToPosition(
          midCoord1[1],
          midCoord1[0],
          startRadius + altitude
        );
        const mid2 = coordinateToPosition(
          midCoord2[1],
          midCoord2[0],
          endRadius + altitude
        );
      });
    } //end Destination()

    Destination(our_data);
    //===================================================== add Animation
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
      composer.render();
      if (notDrawn) {
        Destination(our_data);
        notDrawn = false;
      }
      document.getElementById('commits').innerHTML = commitArray.length;
    }
    animate();
  }
); //end d3.json

startWS(); //Starts the travis data
