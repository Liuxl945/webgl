import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';


let scene, renderer, camera, stats
let model, mixer, clock

let panelSettings
const crossFadeControls = []

const baseActions = {
  idle: { weight: 1 },
  walk: { weight: 0 },
  run: { weight: 0 }
}

function init() {

  const container = document.getElementById( 'container' );

  clock = new THREE.Clock()
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );


  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( 3, 10, 10 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = - 2;
  dirLight.shadow.camera.left = - 2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add( dirLight );

  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xff9999, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );


  const loader = new GLTFLoader();
  loader.load( 'models/gltf/Xbot.glb', function ( gltf ) {

    model = gltf.scene;
    scene.add( model );

    model.traverse( function ( object ) {
      if ( object.isMesh ){
        // 阴影
        object.castShadow = true;
      }
    });


    const animations = gltf.animations
    mixer = new THREE.AnimationMixer( model )

    for ( let i = 0; i !== animations.length; ++ i ) {
      let clip = animations[ i ]
      const name = clip.name

      if ( baseActions[ name ] ) {
        const action = mixer.clipAction( clip )
        console.log(name, action)
        activateAction(action)
        
        baseActions[ name ].action = action
      }

    }


    createPanel()
    animate();

  })



  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.set( - 1, 2, 3 );


  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;


  const controls = new OrbitControls( camera, renderer.domElement );
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.target.set( 0, 1, 0 );
  controls.update();

  stats = new Stats();
  container.appendChild( stats.dom );


  container.appendChild( renderer.domElement );
}


function activateAction( action ) {
  const clip = action.getClip()
  const settings = baseActions[ clip.name ]
  setWeight( action, settings.weight )
  action.play()
}

function setWeight( action, weight ) {
  action.enabled = true
  action.setEffectiveTimeScale( 1 )
  action.setEffectiveWeight( weight )
} 



function createPanel() {
  const panel = new GUI( { width: 310 } );
  const folder1 = panel.addFolder( 'Base Actions' );
  const folder2 = panel.addFolder( 'Additive Action Weights' );
  const folder3 = panel.addFolder( 'General Speed' );

  panelSettings = {
    'modify time scale': 1.0,
    'None': stopActions,
    'idle': idleActions,
    'walk': walkActions,
    'run': runActions,
  };

  const baseNames = [ 'None', ...Object.keys( baseActions ) ];

  for ( let i = 0, l = baseNames.length; i !== l; ++ i ) {
    const name = baseNames[ i ]
    const settings = baseActions[ name ]
    
    // panelSettings[ name ] = () => {
      
    // }

    crossFadeControls.push( folder1.add( panelSettings, name ) )
  }
  
}

function runActions() {
  console.log(baseActions)
}

function walkActions() {

}

function idleActions() {

}

function stopActions() {

}



function animate() {
  requestAnimationFrame( animate );


  const mixerUpdateDelta = clock.getDelta()

  mixer.update( mixerUpdateDelta )

  stats.update();
  renderer.render( scene, camera );

}

init()