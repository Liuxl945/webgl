// threejs库
const {
	createScopedThreejs
} = require('threejs-miniprogram');
// 加载gltf库
const {
	registerGLTFLoader
} = require('../../utils/gltf-loader.js');

let THREE
let renderer
let canvas
let camera
let scene
let clock
// 模型的默认缩放大小
const modelScale = 0.05;

// 创建threejs场景
function initTHREE(canvasDom) {

	canvas = canvasDom

	THREE = createScopedThreejs(canvas)
	registerGLTFLoader(THREE)

	// 相机
	camera = new THREE.Camera()
	// 场景
	scene = new THREE.Scene()

	// 半球光
	const light1 = new THREE.HemisphereLight(0xffffff, 0x444444)
	light1.position.set(0, 0.2, 0)
	scene.add(light1)

	// 平行光
	const light2 = new THREE.DirectionalLight(0xffffff)
	light2.position.set(0, 0.2, 0.1)
	scene.add(light2)

	// 渲染层
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	})

	// gamma色彩空间校正，以适应人眼对亮度的感觉。
	renderer.gammaOutput = true
	renderer.gammaFactor = 2.2

	// 时间跟踪器用作3D模型动画的更新
    clock = new THREE.Clock()

	// 时间跟踪器用作3D模型动画的更新
	render()
}

function render() {
	canvas.requestAnimationFrame(render);

	// 更新光标模型的位置
    // updateReticle()
    // 更新3D模型的动画
	updateAnimation()
	
	// controls.update();
	renderer.render(scene, camera);
}


// 加载3D模型
function loadModel(modelUrl, callback) {

	var loader = new THREE.GLTFLoader();
	wx.showLoading({
		title: 'Loading Model...',
	});
	loader.load(modelUrl,
		function (gltf) {
			console.log('loadModel', 'success');
			wx.hideLoading();
			var model = gltf.scene;
			model.scale.set(modelScale, modelScale, modelScale)
			mainModel = model;
			var animations = gltf.animations;

			scene.add(model)

			if (callback) {
				callback(model, animations);
			}
		},
		null,
		function (error) {
			console.log('loadModel', error);
			wx.hideLoading();
			wx.showToast({
				title: 'Loading model failed.',
				icon: 'none',
				duration: 3000,
			});
		});
}


// 加载3D模型的动画
function createAnimation(model, animations, clipName) {
	if (!model || !animations) {
		return
	}

	// 动画混合器
	const mixer = new THREE.AnimationMixer(model)
	for (let i = 0; i < animations.length; i++) {
		const clip = animations[i]
		if (clip.name === clipName) {
			const action = mixer.clipAction(clip)
			action.play()
		}
	}

	mixers.push(mixer)
}

// 更新3D模型的动画
function updateAnimation() {
	const dt = clock.getDelta()
	if (mixers) {
		mixers.forEach(function (mixer) {
			mixer.update(dt)
		})
	}
}

module.exports = {
	initTHREE,
	loadModel,
	createAnimation
}