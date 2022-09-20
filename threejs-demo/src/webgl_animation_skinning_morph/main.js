import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'


let scene, renderer, camera, stats
let model, mixer, clock, actions
let activeAction, previousAction

const api = { state: 'Walking' }

function init() {

  const container = document.getElementById( 'container' )

  clock = new THREE.Clock()
  
  scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xe0e0e0 )
  scene.fog = new THREE.Fog( 0xe0e0e0, 10, 50 )


  const dirLight = new THREE.DirectionalLight( 0xffffff )
  dirLight.position.set( 20, 20, 20 )
  dirLight.castShadow = true
  console.log(dirLight.shadow.camera)
  scene.add( dirLight )


  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  hemiLight.position.set( 0, 20, 0 );
  scene.add( hemiLight );


  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) )
  mesh.rotation.x = - Math.PI / 2
  mesh.receiveShadow = true
  scene.add( mesh )

  const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 )
  grid.material.opacity = 0.2
  grid.material.transparent = true
  scene.add( grid )


  const loader = new GLTFLoader()
  loader.load( 'models/gltf/RobotExpressive/RobotExpressive.glb', function ( gltf ) {

    model = gltf.scene
    scene.add( model )


    mixer = new THREE.AnimationMixer( model )

    model.traverse( function ( object ) {
      if ( object.isMesh ){
        // 阴影
        object.castShadow = true
      }
    })

    window.addEventListener( 'resize', onWindowResize )

    createPanel(gltf.animations)
    animate()

  }, undefined, function ( e ) {
    console.error( e )
  })



  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 )
  camera.position.set( - 5, 3, 10 )
  camera.lookAt( new THREE.Vector3( 0, 2, 0 ) )


  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true


  const controls = new OrbitControls( camera, renderer.domElement )
  controls.enablePan = false
  controls.enableZoom = false
  controls.target.set( 0, 1, 0 )
  controls.update()

  stats = new Stats()
  container.appendChild( stats.dom )


  container.appendChild( renderer.domElement )
}

function createPanel(animations) {
  const panel = new GUI( { width: 310 } )
  
  const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ]
  const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ]

  actions = {}

  for ( let i = 0; i < animations.length; i ++ ) {
    const clip = animations[ i ]
    const action = mixer.clipAction( clip )

    actions[ clip.name ] = action

    if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {
      action.clampWhenFinished = true
      action.loop = THREE.LoopOnce
    }
  }

  const statesFolder = panel.addFolder( 'States' )

  const clipCtrl = statesFolder.add( api, 'state' ).options( states )


  clipCtrl.onChange( function () {

    fadeToAction( api.state, 0.5 );

  } )


  statesFolder.open()

  const emoteFolder = panel.addFolder( 'Emotes' )

  for ( let i = 0; i < emotes.length; i ++ ) {

    createEmoteCallback( emoteFolder, emotes[ i ] )

  }

  emoteFolder.open()


  const face = model.getObjectByName( 'Head_4' )
  const expressions = Object.keys( face.morphTargetDictionary )
  const expressionFolder = panel.addFolder( 'Expressions' )

  for ( let i = 0; i < expressions.length; i ++ ) {

    expressionFolder.add( face.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] )

  }

  expressionFolder.open()


  activeAction = actions[ 'Walking' ]
  activeAction.play()
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function restoreState() {

  mixer.removeEventListener( 'finished', restoreState );

  fadeToAction( api.state, 0.2 );
}


function createEmoteCallback(emoteFolder, name) {
  api[ name ] = function () {

    fadeToAction( name, 0.2 );

    mixer.addEventListener( 'finished', restoreState );

  };

  emoteFolder.add( api, name );
}


function fadeToAction( name, duration ) {

  previousAction = activeAction;
  activeAction = actions[ name ];

  if ( previousAction !== activeAction ) {

    previousAction.fadeOut( duration );

  }

  activeAction
    .reset()
    .setEffectiveTimeScale( 1 )
    .setEffectiveWeight( 1 )
    .fadeIn( duration )
    .play();

}


function animate() {
  requestAnimationFrame( animate )

  const dt = clock.getDelta()
  if ( mixer ) mixer.update( dt )

  stats.update()
  renderer.render( scene, camera )

}

init()