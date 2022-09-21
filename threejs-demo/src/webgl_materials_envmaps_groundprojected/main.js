import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import {GroundProjectedEnv} from "three/examples/jsm/objects/GroundProjectedEnv"
import Stats from "three/examples/jsm/libs/stats.module"

let scene, renderer, camera, stats, controls

async function init() {

  const container = document.getElementById("container")

  clock = new THREE.Clock()

  scene = new THREE.Scene()

  const hdrLoader = new RGBELoader()
  const envMap = await hdrLoader.loadAsync("textures/equirectangular/blouberg_sunrise_2_1k.hdr")
  envMap.mapping = THREE.EquirectangularReflectionMapping
  
  const env = new GroundProjectedEnv(envMap)
  env.scale.setScalar(100)
  env.radius = 440
  env.height = 20

  scene.add(env)
  scene.environment = envMap


  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(- 20, 7, 20)
  camera.lookAt(0, 4, 0)


  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("gltf/")

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)


  const shadow = new THREE.TextureLoader().load("models/gltf/ferrari_ao.png")
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1.0,
    roughness: 0.5,
    clearcoat:1.0,
    clearcoatRoughness: 0.03,
    sheen: 0.5
  })
  const detailsMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.5,
  })
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.25,
    roughness: 0,
    transmission: 1,
  })

  loader.load("models/gltf/ferrari.glb", gltf => {

    const carModel = gltf.scene.children[0]
    carModel.scale.multiplyScalar(4)
    carModel.rotation.y = Math.PI

    carModel.getObjectByName( 'body' ).material = bodyMaterial
    carModel.getObjectByName( 'rim_fl' ).material = detailsMaterial
    carModel.getObjectByName( 'rim_fr' ).material = detailsMaterial
    carModel.getObjectByName( 'rim_rr' ).material = detailsMaterial
    carModel.getObjectByName( 'rim_rl' ).material = detailsMaterial
    carModel.getObjectByName( 'trim' ).material = detailsMaterial
    carModel.getObjectByName( 'glass' ).material = glassMaterial


    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({
        map: shadow,
        blending: THREE.MultiplyBlending,
        toneMapped: false,
        transparent: true
      })
    )
    mesh.rotation.x = - Math.PI / 2
    mesh.renderOrder = 2

    carModel.add(mesh)

    scene.add(carModel)
  })


  renderer = new THREE.WebGL1Renderer({antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 2, 0)
  controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
  controls.maxDistance = 80
  controls.minDistance = 20
  controls.enablePan = false
  // controls.enableDamping = true
  // controls.maxDistance = 9
  controls.update()

  stats = new Stats()
  container.appendChild(stats.dom)


  container.appendChild(renderer.domElement)

  window.addEventListener("resize", onWindowResize)

  animate()
}

function animate() {
  requestAnimationFrame(animate)

  controls.update()
  stats.update()

  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

init()
