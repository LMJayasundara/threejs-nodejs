var socket = io();

var scene, camera, renderer;
var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;
var SPEED = 0.01;

function init() {
    scene = new THREE.Scene();
    initCube();
    initCamera();
    initRenderer();
    document.body.appendChild(renderer.domElement);
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
    camera.position.set(0, 2, 8);
    camera.lookAt(scene.position);
}
function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
}
function initCube() {
    cube = new THREE.Mesh(new THREE.CubeGeometry(3, 3, 3), new THREE.MeshNormalMaterial());
    scene.add(cube);
    const axesHelper = new THREE.AxesHelper( 5 );  // The X axis is red. The Y axis is green. The Z axis is blue.
    scene.add( axesHelper );
}
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

init();
render();

socket.on('outputData', function(data){
    //  console.log("Yaw :"+ data.yaw + " Pitch :" + data.pitch + " Roll " + data.roll);
    rotateCube(Number(data.roll), Number(data.pitch), Number(data.yaw));
});

function rotateCube(yaw, pitch, roll) {
    cube.rotation.x = roll * (Math.PI/180);
    cube.rotation.y = pitch * (Math.PI/180);
    cube.rotation.z = yaw * (Math.PI/180);
}