
  
  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0020, 8, 15);
  
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);
  
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.body.appendChild(renderer.domElement);
  
  // Enhanced lighting setup
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
  mainLight.position.set(5, 5, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);
  
  const fillLight = new THREE.DirectionalLight(0x8a2be2, 0.4);
  fillLight.position.set(-3, -2, 3);
  scene.add(fillLight);
  
  const rimLight = new THREE.DirectionalLight(0x9370db, 0.3);
  rimLight.position.set(-5, 2, -5);
  scene.add(rimLight);
  
  // Add point lights with purple theme
  const pointLight1 = new THREE.PointLight(0x8a2be2, 0.6, 10);
  pointLight1.position.set(3, 3, 3);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0x9370db, 0.6, 10);
  pointLight2.position.set(-3, -3, 3);
  scene.add(pointLight2);
  
  // Reduced particle count for stellar theme
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 50;
    posArray[i + 1] = (Math.random() - 0.5) * 50;
    posArray[i + 2] = (Math.random() - 0.5) * 50;
    
    // Stellar colors - whites and purples
    const colorChoice = Math.random();
    if (colorChoice < 0.6) {
      colorArray[i] = 1; colorArray[i + 1] = 1; colorArray[i + 2] = 1; // White
    } else if (colorChoice < 0.8) {
      colorArray[i] = 0.8; colorArray[i + 1] = 0.6; colorArray[i + 2] = 1; // Light purple
    } else {
      colorArray[i] = 0.6; colorArray[i + 1] = 0.4; colorArray[i + 2] = 0.9; // Purple
    }
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  // Create rounded cube geometry
  function createRoundedBoxGeometry(width, height, depth, radius, segments) {
    const geometry = new THREE.BoxGeometry(width, height, depth, segments || 12, segments || 12, segments || 12);
    
    const positions = geometry.attributes.position.array;
    const vertices = [];
    
    for (let i = 0; i < positions.length; i += 3) {
      vertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }
    
    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i];
      const x = vertex.x;
      const y = vertex.y;
      const z = vertex.z;
      
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const halfDepth = depth / 2;
      
      const distX = Math.abs(x) - (halfWidth - radius);
      const distY = Math.abs(y) - (halfHeight - radius);
      const distZ = Math.abs(z) - (halfDepth - radius);
      
      if (distX > 0 && distY > 0 && distZ > 0) {
        const cornerDist = Math.sqrt(distX * distX + distY * distY + distZ * distZ);
        if (cornerDist > radius) {
          const scale = radius / cornerDist;
          vertex.x = (halfWidth - radius) * Math.sign(x) + distX * scale * Math.sign(x);
          vertex.y = (halfHeight - radius) * Math.sign(y) + distY * scale * Math.sign(y);
          vertex.z = (halfDepth - radius) * Math.sign(z) + distZ * scale * Math.sign(z);
        }
      } else if (distX > 0 && distY > 0) {
        const edgeDist = Math.sqrt(distX * distX + distY * distY);
        if (edgeDist > radius) {
          const scale = radius / edgeDist;
          vertex.x = (halfWidth - radius) * Math.sign(x) + distX * scale * Math.sign(x);
          vertex.y = (halfHeight - radius) * Math.sign(y) + distY * scale * Math.sign(y);
        }
      } else if (distX > 0 && distZ > 0) {
        const edgeDist = Math.sqrt(distX * distX + distZ * distZ);
        if (edgeDist > radius) {
          const scale = radius / edgeDist;
          vertex.x = (halfWidth - radius) * Math.sign(x) + distX * scale * Math.sign(x);
          vertex.z = (halfDepth - radius) * Math.sign(z) + distZ * scale * Math.sign(z);
        }
      } else if (distY > 0 && distZ > 0) {
        const edgeDist = Math.sqrt(distY * distY + distZ * distZ);
        if (edgeDist > radius) {
          const scale = radius / edgeDist;
          vertex.y = (halfHeight - radius) * Math.sign(y) + distY * scale * Math.sign(y);
          vertex.z = (halfDepth - radius) * Math.sign(z) + distZ * scale * Math.sign(z);
        }
      }
      
      positions[i * 3] = vertex.x;
      positions[i * 3 + 1] = vertex.y;
      positions[i * 3 + 2] = vertex.z;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }
  
  // Create canvas textures
  function createLogoTexture(imagePath, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const img = new Image();
    img.onload = function() {
      const maxSize = canvas.width * 0.9;
      const aspectRatio = img.width / img.height;
      let drawWidth, drawHeight;
      
      if (aspectRatio > 1) {
        drawWidth = maxSize;
        drawHeight = maxSize / aspectRatio;
      } else {
        drawHeight = maxSize;
        drawWidth = maxSize * aspectRatio;
      }
      
      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;
      
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.globalAlpha = 0.9;
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrap;
      texture.wrapT = THREE.ClampToEdgeWrap;
      
      callback(texture);
    };
    img.src = imagePath;
  }
  
  const logoPaths = [
    'logos/html_cube.png',
    'logos/css_cube.png', 
    'logos/js_cube.png',
    'logos/nodejs_cube.png',
    'logos/react_cube.png',
    'logos/mongo_cube.png'
  ];
  
  const geometry = createRoundedBoxGeometry(2.5, 2.5, 2.5, 0.4, 20);
  
  const cubeMaterials = [];
  let materialsLoaded = 0;
  
  const defaultMaterial = new THREE.MeshLambertMaterial({
    color: 0xf8f8f8,
    transparent: false
  });
  
  for (let i = 0; i < 6; i++) {
    cubeMaterials.push(defaultMaterial.clone());
  }
  
  const cube = new THREE.Mesh(geometry, cubeMaterials);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
  
  logoPaths.forEach((path, index) => {
    if (index < 6) {
      createLogoTexture(path, (texture) => {
        cubeMaterials[index] = new THREE.MeshLambertMaterial({
          map: texture,
          transparent: false
        });
        cube.material = cubeMaterials;
        materialsLoaded++;
        console.log(`Loaded texture ${index + 1}/6: ${path}`);
      });
    }
  });
  
  // Subtle ring effects with purple theme
  const ringGeometry1 = new THREE.RingGeometry(3.5, 3.6, 32);
  const ringMaterial1 = new THREE.MeshBasicMaterial({
    color: 0x8a2be2,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  });
  const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
  ring1.rotation.x = Math.PI / 2;
  scene.add(ring1);
  
  const ringGeometry2 = new THREE.RingGeometry(4.0, 4.1, 32);
  const ringMaterial2 = new THREE.MeshBasicMaterial({
    color: 0x9370db,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
  ring2.rotation.x = Math.PI / 2;
  ring2.rotation.z = Math.PI / 4;
  scene.add(ring2);
  
  // Mouse interaction
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotationVelocity = { x: 0, y: 0 };
  
  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });
  
  renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      
      rotationVelocity.y = deltaMove.x * 0.01;
      rotationVelocity.x = deltaMove.y * 0.01;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });
  
  renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  renderer.domElement.addEventListener('wheel', (e) => {
    camera.position.z += e.deltaY * 0.01;
    camera.position.z = Math.max(4, Math.min(camera.position.z, 15));
  });
  
  // Responsive
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Animation
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    
    if (!isDragging) {
      cube.rotation.y += 0.015;
      cube.rotation.x += 0.008;
      rotationVelocity.x *= 0.95;
      rotationVelocity.y *= 0.95;
    } else {
      cube.rotation.x += rotationVelocity.x;
      cube.rotation.y += rotationVelocity.y;
      rotationVelocity.x *= 0.9;
      rotationVelocity.y *= 0.9;
    }
    
    cube.position.y = Math.sin(elapsed * 0.5) * 0.2;
    ring1.rotation.z += 0.008;
    ring1.position.y = Math.sin(elapsed * 0.3) * 0.1;
    ring2.rotation.z -= 0.006;
    ring2.position.y = Math.cos(elapsed * 0.4) * 0.15;
    
    particlesMesh.rotation.y += 0.0008;
    particlesMesh.rotation.x += 0.0004;
    
    mainLight.intensity = 1.5 + Math.sin(elapsed * 0.8) * 0.3;
    fillLight.position.x = Math.cos(elapsed * 0.5) * 4;
    fillLight.position.z = Math.sin(elapsed * 0.5) * 4;
    
    pointLight1.position.x = Math.cos(elapsed * 0.7) * 5;
    pointLight1.position.y = Math.sin(elapsed * 0.7) * 3;
    pointLight2.position.x = Math.sin(elapsed * 0.6) * 5;
    pointLight2.position.z = Math.cos(elapsed * 0.6) * 4;
    
    renderer.render(scene, camera);
  }
  
  animate();
