import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils"
import Stats from "three/examples/jsm/libs/stats.module"

let scene, renderer, camera, stats
let mixers = [], clock

function init() {

  const container = document.getElementById("container")

  clock = new THREE.Clock()

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xa0a0a0)
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(2, 3, -6)
  camera.lookAt(0, 1, 0)


  const dirLight = new THREE.DirectionalLight(0xffffff)
  dirLight.position.set(-3, 10, -10)
  dirLight.castShadow = true
  scene.add(dirLight)

  const dirLight2 = new THREE.DirectionalLight(0xffffff)
  dirLight2.position.set(-10, 10, 10)
  scene.add(dirLight2)

  const dirLight3 = new THREE.DirectionalLight(0xffffff)
  dirLight3.position.set(10, 10, 10)
  scene.add(dirLight3)


  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshPhongMaterial({color: 0x999999, depthWrite: false}))
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  scene.add(mesh)

  const loader = new GLTFLoader()

  loader.load("models/gltf/Soldier.glb", gltf => {
    gltf.scene.traverse(object => {
      if(object.isMesh) object.castShadow = true
    })
    
    const model1 = SkeletonUtils.clone(gltf.scene)
    const model2 = SkeletonUtils.clone(gltf.scene)
    const model3 = SkeletonUtils.clone(gltf.scene)

    const mixer1 = new THREE.AnimationMixer(model1)
    const mixer2 = new THREE.AnimationMixer(model2)
    const mixer3 = new THREE.AnimationMixer(model3)

    mixer1.clipAction(gltf.animations[0]).play()
    mixer2.clipAction(gltf.animations[1]).play()
    mixer3.clipAction(gltf.animations[3]).play()

    model1.position.x = -2
    model2.position.x = 0
    model3.position.x = 2

    scene.add(model1, model2, model3)
    mixers.push(mixer1, mixer2, mixer3)

  })


  renderer = new THREE.WebGL1Renderer({antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableZoom = false
  controls.update()

  stats = new Stats()
  container.appendChild(stats.dom)


  container.appendChild(renderer.domElement)

  window.addEventListener("resize", onWindowResize)

  animate()
}

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()
  for (const mixer of mixers) mixer.update(delta)

  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

init()
