import { WebGLEngine, Camera, Color, DirectLight, Vector3, Animator, MeshRenderer, PrimitiveMesh, BlinnPhongMaterial, GLTFResource } from 'oasis-engine'
import { OrbitControl } from 'oasis-engine-toolkit'


console.log(OrbitControl)

// Init Engine
const engine = new WebGLEngine("canvas")
engine.canvas.resizeByClientSize()

// Get root entity of current scene
const scene = engine.sceneManager.activeScene
const rootEntity = scene.createRootEntity("root")

// Init Camera
let cameraEntity = rootEntity.createChild("camera_entity")
cameraEntity.transform.position = new Vector3(10, 5, 10)
// 
cameraEntity.addComponent(Camera)
cameraEntity.addComponent(OrbitControl)

const crbitControl = cameraEntity.getComponent(OrbitControl)

crbitControl.target = new Vector3(0, 0, 0)


// scene.background.solidColor = new Color(1, 1, 1, 1)

// Create a entity to add light component
let lightEntity = rootEntity.createChild("light")

// Create light component
let directLight = lightEntity.addComponent(DirectLight)
directLight.color = new Color(1.0, 1.0, 1.0, 1)
directLight.intensity = 0.5


lightEntity.transform.rotation = new Vector3(45, 45, 45)

// Create Cube
// let cubeEntity = rootEntity.createChild("cube")
// let cube = cubeEntity.addComponent(MeshRenderer)
// cube.mesh = PrimitiveMesh.createCuboid(engine, 2, 2, 2)
// cube.setMaterial(new BlinnPhongMaterial(engine))

engine.resourceManager.load("https://gw.alipayobjects.com/os/bmw-prod/f40ef8dd-4c94-41d4-8fac-c1d2301b6e47.glb").then(gltf => {
  const {defaultSceneRoot, materials, animations} = gltf
  rootEntity.addChild(defaultSceneRoot)

  defaultSceneRoot.transform.scale = new Vector3(0.05, 0.05, 0.05)

  const animator = defaultSceneRoot.getComponent(Animator)
  
  animator.play(animations[2].name)
})


engine.run()