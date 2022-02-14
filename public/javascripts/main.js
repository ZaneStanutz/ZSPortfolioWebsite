/*
// quick way to connect during production..
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
*/

import * as THREE from 'three';
import * as orbitcontrols  from 'orbitcontrols';
import * as fontloader from 'fontloader';
import * as textGeometry from 'textgeometry'

/*
ES6 syntax is not working with Express for some reason.
import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
*/
let scene, camera, renderer;
let initials,dev, dodeca,line,torus;
let controls;
let mousePressed = false;
let mouse = new THREE.Vector2();
let stars;
let explore = false;
let exploreBtn = document.querySelector('#exploreBtn');
exploreBtn.addEventListener('click', function(){
    if(!explore){
        document.getElementById('toggleCss').setAttribute("href", "stylesheets/explore.css");
        explore = true;
        console.log("exploreMode: " + explore);
        let main = document.getElementById('explore');
        main.hidden = true;
        exploreBtn.innerHTML = "restore";
    }
    else{
        let main = document.getElementById('explore')
        main.hidden = false;
        document.getElementById('toggleCss').setAttribute("href", "stylesheets/main.css");
        explore = false;
        console.log("exploreMode: " + explore);
        exploreBtn.innerHTML = "explore";
        window.scroll(0,0);
    }
});

function init(){

    scene = new THREE.Scene(); //place objects lights and cameras

    // renderer
    renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'), alpha: false, antialiasing: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // camrera
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1, 
        10000 ); // takes fov,aspect nearPlane and farPlane 

    camera.position.z = 5;

    scene.add(camera);

    const geometryTorus = new THREE.TorusGeometry(4,1);
    const material = new THREE.MeshNormalMaterial();
    torus = new THREE.Mesh(geometryTorus, material);
    scene.add(torus);
    
    const geometryDodeca = new THREE.IcosahedronBufferGeometry(2,0);
    const materialDodeca = new THREE.MeshStandardMaterial( 
        { color: 0x006c70, metalness: '0.6', roughness: '0', shading: THREE.FlatShading} );
    dodeca = new THREE.Mesh( geometryDodeca, materialDodeca );
    scene.add(dodeca);

    const geometryRing = new THREE.SphereGeometry(6,11,10);
    const edges = new THREE.EdgesGeometry(geometryRing);
    line = new THREE.LineSegments(edges, new THREE.LineDashedMaterial(
        {color: 0xffffff}));
    scene.add(line);    

    // Massive ZS initials
    const fLoader = new fontloader.FontLoader();
    fLoader.load('javascripts/roboto.json',function ( font ) {
		console.log( font );
        const geometryInitals = new textGeometry.TextGeometry('ZS', {
            font: font,
            size: 50,
            height: 10,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const materialInitials = new THREE.MeshStandardMaterial( 
            { color: 0xffffff, metalness: '0.6', roughness: '0', shading: THREE.FlatShading} );
        initials = new THREE.Mesh(geometryInitals, materialInitials);
        initials.position.set(-100,50,0);
        scene.add(initials);
    });
    fLoader.load('javascripts/roboto.json',function ( font ) {
		console.log( font );
        const geometryInitals = new textGeometry.TextGeometry('DEV', {
            font: font,
            size: 50,
            height: 10,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const materialInitials = new THREE.MeshStandardMaterial( 
            { color: 0xffffff, metalness: '0.6', roughness: '0', shading: THREE.FlatShading} );
        dev = new THREE.Mesh(geometryInitals, materialInitials);
        dev.position.set(0,-100,0);
        scene.add(dev);
    });
    
    const pointLight = new THREE.PointLight(0xffffff, 1.7);
    const pointLightTwo = new THREE.PointLight(0xfffff, 1.7);
    const pointLightThree = new THREE.PointLight(0xffffff, 0.6);
    const helper = new THREE.PointLightHelper(pointLightThree);
    pointLight.position.set(300,200,100);
    pointLightTwo.position.set(-500,-100,-100);
    pointLightThree.position.set(3, -20, 30); 

    const ambientLight = new THREE.AmbientLight(0x0000ff,1);
    scene.add(pointLight);
    scene.add(pointLightTwo);
    scene.add(ambientLight);
    scene.add(pointLightThree);

    //orbit
    controls = new orbitcontrols.OrbitControls(camera, renderer.domElement);
    

    // mouse event listeners
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );    
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    


    function populateTheVoid(){

        let hex = Math.ceil(Math.random() * 999999);
        if(hex < 19999){
            hex = hex * 10;
        }
        if(hex < 19999){
            hex = hex*10;
        }

        let index = Math.floor(Math.random()*3);

        const voidGeometry = findShapeType(index); // this is where we use 
       
        const voidMaterial = new THREE.MeshStandardMaterial({color:  hex, });
        const star = new THREE.Mesh(voidGeometry, voidMaterial);
        
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)); 
        star.position.set(x, y, z);
        scene.add(star);

    }
    stars = Array(200).fill().forEach(populateTheVoid);

    function findShapeType(index){
        let geoGen
        switch(index){
            case 0: 
                 geoGen = new THREE.IcosahedronBufferGeometry(1, 0);
                 break;
            case 1:
                 geoGen = new THREE.SphereGeometry(0.5, 11, 10);
                 break;
            case 2:
                 geoGen = new THREE.BoxGeometry();
                 break;
            default:
                 geoGen = new THREE.OctahedronGeometry();
        }
        return geoGen;
    }
       
} // init()

// mouse control
function onDocumentMouseDown(){ mousePressed = true;}
function onDocumentMouseUp(){
    mousePressed = false;
    
}
function onDocumentMouseMove( event ){
    mouse.x = (event.clientX/ window.innerWidth) *2 + 1;
    mouse.y = -(event.clientY/ window.innerHeight)*2 - 1;

}
function animate(){
    requestAnimationFrame(animate);
    if(!mousePressed){
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        torus.rotation.z += 0.01;

        dodeca.rotation.x -= 0.01;
        dodeca.rotation.y -= 0.01;
        dodeca.rotation.z -= 0.001;
        line.rotation.x += 0.001;
        line.rotation.y += 0.001;
        line.rotation.z = mouse.x; 
    }
    if(!explore){
        moveCamera();
    }
    // get button to toggle boolean on this control this method call base on onclick
    controls.update();
    renderer.render(scene, camera);
} // animate()
function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}
function moveCamera() {
    
    const t = document.body.getBoundingClientRect().top; 
    camera.position.z = t * -0.02;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;

    let zxy = new Array(3);
    zxy.push(camera.position.z); 
    zxy.push(camera.position.x);
    zxy.push(camera.position.y);
  
}
window.addEventListener('resize', onWindowResize, false);
init();
animate();

/* mapping modes
THREE.UVMapping
THREE.CubeReflectionMapping
THREE.CubeRefractionMapping
THREE.EquirectangularReflectionMapping
THREE.EquirectangularRefractionMapping
THREE.CubeUVReflectionMapping
THREE.CubeUVRefractionMapping
*/