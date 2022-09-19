import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';


let scene, renderer, camera, stats
let model, skeleton, mixer, clock

let actions, settings

function init() {

  const container = document.getElementById( 'container' );
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa0a0a0 );
  scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );


  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( - 3, 10, - 10 );
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
  loader.load( 'models/gltf/Soldier.glb', function ( gltf ) {

    clock = new THREE.Clock()
    model = gltf.scene;
    scene.add( model );

    model.traverse( function ( object ) {
      if ( object.isMesh ){
        // 阴影
        object.castShadow = true;
      }
    });
    
    createPanel()


    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer( model );
    idleAction = mixer.clipAction( animations[ 0 ] )
    walkAction = mixer.clipAction( animations[ 3 ] )
    runAction = mixer.clipAction( animations[ 1 ] )

    actions = [ idleAction, walkAction, runAction ]


    skeleton = new THREE.SkeletonHelper( model );
    skeleton.visible = false;
    scene.add( skeleton );

    activateAllActions()
    animate();

  })



  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.set( 1, 2, - 3 );


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

function createPanel() {
  const panel = new GUI( { width: 310 } );
  const folder1 = panel.addFolder( 'Visibility' );
  const folder2 = panel.addFolder( 'Activation/Deactivation' );
  const folder3 = panel.addFolder( 'Pausing/Stepping' );
  const folder4 = panel.addFolder( 'Crossfading' );
  const folder5 = panel.addFolder( 'Blend Weights' );
  const folder6 = panel.addFolder( 'General Speed' );

  settings = {
    'show model': true,
    'show skeleton': false,
    'deactivate all': deactivateAllActions,
    'activate all': activateAllActions,



    'modify idle weight': 0.0,
    'modify walk weight': 1.0,
    'modify run weight': 0.0,


  }

  folder1.add( settings, 'show model' ).onChange( visibility => model.visible = visibility );
  folder1.add( settings, 'show skeleton' ).onChange( visibility => skeleton.visible = visibility );

  folder2.add( settings, 'deactivate all' );
  folder2.add( settings, 'activate all' );
  
}

function setWeight( action, weight ) {
  action.enabled = true
  action.setEffectiveTimeScale( 1 )
  action.setEffectiveWeight( weight )
}


function deactivateAllActions() {
  actions.forEach( function ( action ) {
    action.stop()
  } )
}

function activateAllActions() {
  setWeight( idleAction, settings[ 'modify idle weight' ] )
  setWeight( walkAction, settings[ 'modify walk weight' ] )
  setWeight( runAction, settings[ 'modify run weight' ] )

  actions.forEach( function ( action ) {
    console.log(action)
    action.play()
  } )

}

function updateWeightSliders() {
  settings[ 'modify idle weight' ] = idleWeight
  settings[ 'modify walk weight' ] = walkWeight
  settings[ 'modify run weight' ] = runWeight
}



function animate() {
  requestAnimationFrame( animate )

  idleWeight = idleAction.getEffectiveWeight()
  walkWeight = walkAction.getEffectiveWeight()
  runWeight = runAction.getEffectiveWeight()

  // updateWeightSliders()
  // updateCrossFadeControls()

  let mixerUpdateDelta = clock.getDelta()
  mixer.update( mixerUpdateDelta )


  stats.update();
  renderer.render( scene, camera )

}

init()