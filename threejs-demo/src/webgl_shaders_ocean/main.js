import * as THREE from "three"
import {Water} from "three/examples/jsm/objects/Water"
import {Sky} from "three/examples/jsm/objects/Sky"
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols"
import Stats from "three/examples/jsm/libs/stats.module"

let container, camera, scene, renderer, stats
let controls, water, sun, sky, mesh, renderTarget, pmremGenerator

const parameters = {
  elevation: 2,
  azimuth: 180
}


function init() {

  container = document.getElementById("container")

  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000)
  camera.position.set(30, 30, 100)


  const waterGeometry = new THREE.PlaneGeometry(10000, 10000)
  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load("textures/waternormals.jpg", texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  })
  water.rotation.x = - Math.PI / 2
  scene.add(water)


  sun = new THREE.Vector3()
  sky = new Sky()
  sky.scale.setScalar(10000)
  sky.material.uniforms["turbidity"].value = 10
  sky.material.uniforms["rayleigh"].value = 2
  sky.material.uniforms["mieCoefficient"].value = 0.005
  sky.material.uniforms["mieDirectionalG"].value = 0.8
  scene.add(sky)


  pmremGenerator = new THREE.PMREMGenerator(renderer)
  updateSun()


  const geometry = new THREE.BoxGeometry(30, 30, 30)
  const material = new THREE.MeshStandardMaterial({
    roughness: 0
  })
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.maxPolarAngle = Math.PI * 0.495
  controls.target.set(0, 10, 0)
  controls.minDistance = 40.0
  controls.maxDistance = 200.0
  controls.update()


  stats = new Stats()
  container.appendChild(stats.dom)


  container.appendChild(renderer.domElement)

  window.addEventListener("resize", onWindowResize)

  animate()
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function updateSun() {
  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation)
  const theta = THREE.MathUtils.degToRad(parameters.azimuth)
  sun.setFromSphericalCoords(1, phi, theta)
  sky.material.uniforms["sunPosition"].value.copy(sun)
  water.material.uniforms["sunDirection"].value.copy(sun).normalize()

  if ( renderTarget !== undefined ) renderTarget.dispose()
  renderTarget = pmremGenerator.fromScene(sky)
  scene.environment = renderTarget.texture
}

function animate() {
  requestAnimationFrame(animate)

  const time = performance.now() * 0.001
  mesh.position.y = Math.sin( time ) * 20 + 5
  mesh.rotation.x = time * 0.5
  mesh.rotation.z = time * 0.51

  // if(parameters.elevation <= 0) {
  //   parameters.elevation += 0.01
  // }
  // else if(parameters.elevation <= 50) {
  //   parameters.elevation -= 0.01
  // }
  // updateSun()
  


  water.material.uniforms[ 'time' ].value += 1.0 / 60.0

  stats.update()
  renderer.render(scene, camera)
}

init()