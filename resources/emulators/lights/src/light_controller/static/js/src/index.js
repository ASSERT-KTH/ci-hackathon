const THREE = require("three");
const PointerLockControls = require("./libs/PointerLockControls")
const FirstPersonControls = require("./libs/FirstPersonControls")
const OBJLoader = require("./libs/OBJLoader")
const MTLLoader = require("./libs/MTLLoader")

const roomCanvas = document.getElementById("map")
        const logBox = $("#logs");

        roomCanvas.width = window.innerWidth - logBox.width();
        roomCanvas.height =  window.innerHeight ;

        function setupSize(){

            console.log("Setting up canvas...");

            context.canvas.width  = $("#map").width();
            context.canvas.height = $("#map").height();

            drawCanvas();
        }
 
        const boxSize = [300, 500, 300];


        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 45, roomCanvas.width / roomCanvas.height, 0.1, 1000 );

        camera.position.x = 0;
        camera.position.y = 50;
        camera.position.z = 300;
        camera.lookAt(new THREE.Vector3(0,  100, 0));

        var renderer = new THREE.WebGLRenderer({canvas: roomCanvas});
        renderer.setSize( roomCanvas.width, roomCanvas.height, false );

        function addControls(){
            
            var controls = new THREE.FirstPersonControls(camera, roomCanvas);
            controls.lookSpeed = 0.2;
            controls.movementSpeed = 40;
            controls.noFly = false;
            controls.lookVertical = true;
            controls.constrainVertical = true;
            controls.verticalMin = 1.0;
            controls.verticalMax = 2.0;
            controls.lon = 270;
            controls.lat = 14;


            return controls;
        }

        function addGrid(){
            // Add basic box layout and lights
            var geometry = new THREE.BoxGeometry(...boxSize);
            geometry = new THREE.EdgesGeometry(geometry);
            var material = new THREE.LineBasicMaterial( { color: 0xffffff, lineWidth: true } );

            var cube = new THREE.LineSegments( geometry, material );
            scene.add( cube );
        }


        function addAmbienLigth(){
            //var light = new THREE.AmbientLight( 0xffffff ); // soft white light
            var light = new THREE.AmbientLight( 0x222222 ); // soft white light
            scene.add( light );
        }


        function getRandom(max, min) {
            let a = Math.random() * (max - min) + min;
            return a;
        }

        function addObjects(){
           
            //var mtlLoader = new THREE.MTLLoader();
            //mtlLoader.load("/static/r1.mtl", function(materials){

                //materials.preload();

                var loader = new THREE.OBJLoader();
                //loader.setMaterials(materials);
                // load a resource
                loader.load(
                    // resource URL
                    '/static/r1.obj',
                    // called when resource is loaded
                    function ( object ) {

                        const obj  = object
                        obj.scale.set(0.05, 0.05, 0.05)
                        scene.add( obj );

                    },
                    // called when loading is in progresses
                    function ( xhr ) {

                        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                    },
                    // called when loading has errors
                    function ( error ) {

                        console.log( 'An error happened' );

                    }
                );

            //s})

        }

        var controls = addControls();

        //addGrid();
        addAmbienLigth();
        addObjects();

        addBulbLight(0x777777, [0,300,0])
        // Add dynamic lights

        
        

        function rgbtoHex(rgb){

            function singleToHex(n){
                var hex = Number(n).toString(16);

                if(hex.length < 2)
                    hex = "0" + hex;
                
                    return hex;
            }
            return `0x${singleToHex(rgb[0])}${singleToHex(rgb[1])}${singleToHex(rgb[2])}`;
        }

        function toGlobalPosition(position){
            // Transform relative positions to box coordinate space

            const deltaX = boxSize[0]/2;
            const deltaY = boxSize[1]/2  - 220;
            const deltaZ = boxSize[2]/2 + 150;

            const margin = 5;

            return [
                position[0]*boxSize[0] - deltaX, // x = x*size - deltaX
                position[1]*boxSize[1] - deltaY,
                position[2]*boxSize[2] - deltaZ
            ]
        }

        // R1 lights
        var fontLoader = new THREE.FontLoader();

        const materials = [
            new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
        ];

        fontLoader.load( '/static/roboto_regular.json', function ( font ) {

            for(var ligth in spotLights){

                const obj = spotLights[ligth];
                
                const threeLigth = addLigth( rgbtoHex(obj.color), 
                toGlobalPosition(obj.relativePosition))
                
                spotLights[ligth].obj = threeLigth;
    
                var geometry = new THREE.TextGeometry( ligth, {
                    font: font,
                    size: 10,
                    height: 2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 1,
                    bevelSize: 0.5,
                    bevelOffset: 0,
                    bevelSegments: 5
                } );

                geometry.computeBoundingBox();
                geometry.computeVertexNormals();
                
                textGeo = new THREE.BufferGeometry().fromGeometry( geometry, materials );

                const pos = toGlobalPosition(obj.relativePosition)
                textMesh1 = new THREE.Mesh( textGeo );
				textMesh1.position.x = pos[0];
				textMesh1.position.y = pos[1] + 20;
                textMesh1.position.z = pos[2];
                
                scene.add(textMesh1)
    
                //geometry.position.set(toGlobalPosition(obj.relativePosition))
    
            }

            
        } );
        

        function addBulbLight(color, position){
            var pointLight = new THREE.PointLight(Number(color), 0.3);

            pointLight.position.set(...position);
            scene.add(pointLight)
            
        }

        function addLigth(color, position){
            
            group = new THREE.Group();

            var bulbGeometry = new THREE.SphereGeometry(1, boxSize[1]/4, boxSize[1]/4);
            var spotLight = new THREE.SpotLight(Number(color));
            var bulbLight = new THREE.PointLight(Number(color), 0.1);
            
            bulbLight.power = 0.25;
            bulbLight.decay = 1;
            bulbLight.exposure=0.5
            

            var bulbMat = new THREE.MeshStandardMaterial({
                emissive: color,
                emissiveIntensity: 2,
                color: color,
                //metalness: 0.9,
                roughness: 1
            });

            spotLight.position.set(...position);
            bulbLight.position.set(...position);

            spotLight.castShadow = true;

            spotLight.penumbra = 0.35;
            spotLight.angle=0.44;
            spotLight.intensity = 1;
            //spotLight.distance = 1.77*boxSize[0];
            spotLight.decay=1.3;


            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;

            spotLight.shadow.camera.near = 500;
            spotLight.shadow.camera.far = 4000;
            spotLight.shadow.camera.fov = 30;

            var targetObject = new THREE.Object3D();
            targetObject.position.set(
                position[0], 
                position[1] + 10,
                position[2] - 3)
            spotLight.target  = targetObject;
            spotLight.target.updateMatrixWorld()


            bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
            //bulbLight.position.set(...position);
            spotLight.castShadow = true;
            lightHelper = new THREE.SpotLightHelper( spotLight );
            //scene.add( lightHelper );
            scene.add(spotLight.target)
            scene.add(spotLight)
            group.add(bulbLight)
            scene.add(group);
            group.position.y = 0;
            group.position.z = 0;
            group.position.x = 0;

            return [spotLight, bulbLight];
        }


        renderer.toneMappingExposure = Math.pow(0.7, 2.0);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        var clock = new THREE.Clock();

        function animate() {

            requestAnimationFrame( animate );

            var delta = clock.getDelta(); // seconds.
            //controls.update(delta);
            controls.update(delta)
            // required if controls.enableDamping or controls.autoRotate are set to true

            renderer.render( scene, camera );

            /*console.log(controls.lon, controls.lat);
            console.log(camera.position.x,camera.position.y,camera.position.z);*/
        }
        animate()


        // Setup listener

        var socket = io.connect(`${protocol}://${document.domain}:${location.port}/simulator`, {
            query: sessionName,
            timeout: 120000
        });
        socket.on('connect', function() {
            console.log("Connected")
        });

        socket.on('disconnect', function() {
            console.log("Disconnected")
        });

        socket.on('single', function(msg) {

            let now = new Date();
            console.log(msg)

            $("#logs").append(`<div><label class='dot'>[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] </label><label class='log'>${JSON.stringify(msg)}</label><div>`);
        
            
                spotLights[msg.id].color = msg.color;
                //console.log(spotLights[msg.id])
                spotLights[msg.id].obj[0].color.setHex(rgbtoHex(msg.color));
                spotLights[msg.id].obj[1].color.setHex(rgbtoHex(msg.color));
                //spotLights[msg.id].obj[1].emissive.setHex(rgbtoHex(msg.color));
            

            //enderer.render( scene, camera );
            //renderer.render( scene, camera );
        });