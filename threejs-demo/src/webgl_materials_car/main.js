import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import Stats from "three/examples/jsm/libs/stats.module"

let scene, renderer, camera, stats, controls
let wheels = [], clock, grid

function init() {

  const container = document.getElementById("container")

  clock = new THREE.Clock()

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x333333)
  scene.environment = new RGBELoader().load("textures/equirectangular/venice_sunset_1k.hdr")
  scene.environment.mapping = THREE.EquirectangularReflectionMapping
  scene.fog = new THREE.Fog(0x333333, 10, 15)


  grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff)
  grid.material.opacity = 0.2
  grid.material.depthWrite = false
  grid.material.transparent = true
  scene.add(grid)

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(4.25, 1.4, - 4.5)


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

    carModel.getObjectByName( 'body' ).material = bodyMaterial
    carModel.getObjectByName( 'rim_fl' ).material = detailsMaterial
    carModel.getObjectByName( 'rim_fr' ).material = detailsMaterial
    carModel.getObjectByName( 'rim_rr' ).material = detailsMaterial
    carModel.getObjectByName( 'rim_rl' ).material = detailsMaterial
    carModel.getObjectByName( 'trim' ).material = detailsMaterial
    carModel.getObjectByName( 'glass' ).material = glassMaterial

    wheels.push(
      carModel.getObjectByName('wheel_fl'),
      carModel.getObjectByName('wheel_fr'),
      carModel.getObjectByName('wheel_rl'),
      carModel.getObjectByName('wheel_rr')
    )


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
  renderer.toneMappingExposure = 0.85
  renderer.shadowMap.enabled = true

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.maxDistance = 9
  controls.target.set(0, 0.5, 0)
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
  const time = -performance.now() / 1000

  for(let i = 0; i < wheels.length; i ++){
    wheels[i].rotation.x = time * Math.PI * 2;
  }
  grid.position.z = -(time) % 1


  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

init()
