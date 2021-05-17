import { OrbitControls } from "./OrbitalControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set( 0, 0, 50 );
controls.autoRotate = true;
controls.update();


const points = [];

function addVector(a, b){
    let out = []
    for(let i = 0; i < a.length; i++){
        out.push([a[i]+b[i]]);
    }
    return out;
}

function divideVector(a, denom){
    return a.map((x) => x/denom);
}

const vertices = [];
function sierpinski3d(a, b, c, d, depth, limit){
    if(depth === limit){
        vertices.push([a,b,c,d]);
    }
    else {
        let ab = divideVector(addVector(a,b),2);
        let bc = divideVector(addVector(b,c),2);
        let ca = divideVector(addVector(c,a),2);

        let ad = divideVector(addVector(a,d),2);
        let bd = divideVector(addVector(b,d),2);
        let cd = divideVector(addVector(c,d),2);

        sierpinski3d(a, ab, ca, ad, depth+1, limit);
        sierpinski3d(b, bc, ab, bd, depth+1, limit);
        sierpinski3d(c, ca, bc, cd, depth+1, limit);
        sierpinski3d(d, ad, bd, cd, depth+1, limit);
    }
}
function centrePoints(points){
    // calculate average
    let avgX = (points[0][0] + points[1][0] + points[2][0] + points[3][0])/4;
    let avgY = (points[0][1] + points[1][1] + points[2][1] + points[3][1])/4;
    let avgZ = (points[0][2] + points[1][2] + points[2][2] + points[3][2])/4;

    return points.map(x => [x[0]-avgX, x[1]-avgY, x[2]-avgZ]);
}

function unpackWireFrame(){
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    let edgeIndices = [
        0, 1,
        1, 2,
        0, 2,

        0, 3,
        1, 3,
        2, 3
    ];

    vertices.forEach(vertex => {
        let vPoints = [];
        edgeIndices.forEach(i => {
            vPoints = vPoints.concat(new THREE.Vector3(vertex[i][0], vertex[i][1], vertex[i][2]));
        } );
        const geometry = new THREE.BufferGeometry().setFromPoints( vPoints );
        const tline = new THREE.Line( geometry, material );
        scene.add( tline );
    });
}
let a = [0, 0, 0];
let b = [50, 0, 0];
let c = [25, 0,  43.3];
let d = [25, 43.3, 14.43];

let p = centrePoints([a,b,c,d]);

sierpinski3d(p[0], p[1], p[2], p[3], 0, 5);
unpackWireFrame();

function render(time) {
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);

console.log("loaded Scene.");
