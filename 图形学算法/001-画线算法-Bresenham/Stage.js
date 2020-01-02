export class Stage {
  constructor() {
    this.container = ""
    this.cb = null
    this.control = null
    this.camera = null
    this.scene = null
    this.renderer = null
    this.uniforms = null
    this.onWindowResize = this.onWindowResize.bind(this);
    this.animate = this.animate.bind(this);

    this.initStage()
    this.initControls()

    window.addEventListener('resize', this.onWindowResize, false);
  }

  static loadTexture(url) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(url, (res) => {
        resolve(res)
      });
    })
  }

  run(cb) {
    console.error("run...");
    this.cb = cb

    // 增加参考平面
    this.addPlan()
    this.addAxes()
    // 开始渲染
    this.onWindowResize();
    this.animate();
  }

  initStage() {
    // 相机
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.set(0, 320, 0);
    this.camera.rotation.set(-1.75, 0, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.name = "camera"

    // 场景
    this.scene = new THREE.Scene();
    window.scene = this.scene
    this.scene.add(this.camera)

    // 渲染器
    this.container = document.getElementById('container');
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.autoClearColor = false;
    this.container.appendChild(this.renderer.domElement);

    // 光
    let ambientLight = new THREE.AmbientLight(0x333333);
    ambientLight.name = "ambientLight"
    this.scene.add(ambientLight);
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.name = "directionalLight"
    directionalLight.position.set(100, 300, 200);
    this.scene.add(directionalLight);
  }

  initControls() {
    let control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.control = control
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    control.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    control.dampingFactor = 0.35;
    //是否可以缩放
    control.enableZoom = true;
    control.zoomSpeed = 0.35;
    //是否自动旋转
    control.autoRotate = false;
    //设置相机距离原点的最远距离
    // control.minDistance = 22; //1000
    //设置相机距离原点的最远距离
    // control.maxDistance = 50; //3000
    //是否开启右键拖拽
    control.enablePan = false;
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    this.cb && this.cb()
    // this.control && this.control.update()
  }

  /**
   * 绘制参考平面 YOZ
   * 中心是原点坐标,每个格子表示20
   *
   * O
   * |---------------> Y
   * |
   * |
   * |
   * |
   * \/
   * Z
   */
  addPlan() {
    let length = 200
    let geometry = new THREE.Geometry();/* 简单基础几何 */
    let lineMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });/* 基础线材质 */

    geometry.vertices.push(new THREE.Vector3(-length / 2, 0, 0));/* 顶点(-100, 0, 0) */
    geometry.vertices.push(new THREE.Vector3(length / 2, 0, 0)); /* 顶点( 100, 0, 0) */

    /* 循环创建线段 */
    for (let i = 0; i <= length / 10; i++) {
      /* 横向线段 */
      let lineX = new THREE.Line(geometry, lineMaterial);
      lineX.position.z = (i * 10) - length / 2;
      lineX.name = "lineX"
      this.scene.add(lineX);

      /* 纵向线段 */
      let lineY = new THREE.Line(geometry, lineMaterial);
      lineY.rotation.y = 0.5 * Math.PI;
      lineY.position.x = (i * 10) - length / 2;
      lineY.name = "lineY"
      this.scene.add(lineY);
    }
  }

  addAxes() {
    // 红绿蓝(RGB)，R、G、B三种颜色坐标轴是分别表示X、Y、Z轴
    var axesHelper = new THREE.AxesHelper(120);
    axesHelper.name = "axesHelper"
    this.scene.add(axesHelper);
  }
}
