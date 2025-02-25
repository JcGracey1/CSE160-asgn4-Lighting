
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertexPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertexPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform vec3 u_LightPos;
  varying vec4 v_VertexPos;


  uniform int u_whichTexture;
  void main() {

    if(u_whichTexture == -3){
      gl_FragColor = vec4(v_Normal+1.0/2.0, 1.0); // use normal
  
    }else if(u_whichTexture == -2){
      gl_FragColor = u_FragColor; // use color

    } else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV,1.0,1.0);  // use UV debug color

    } else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);   //use texture0

    } else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);

    } else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    
    } else if(u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV);
      
    } else{
      gl_FragColor = vec4(1, .2, .2, 1.0);   // ERROR reddish color
    }

    vec3 lightVector = vec3(v_VertexPos) - u_LightPos;
    float r = length(lightVector);
    if(r<0.0){
      gl_FragColor = vec4(1, 0, 0, 1.0);
    } else if(r<2.0){
      gl_FragColor = vec4(0, 1, 0, 1.0); 
    }
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
//let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture;
let u_LightPos;

function setupWebGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }

	// Get the rendering context for WebGL
	//gl = getWebGLContext(canvas);
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}	

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablestoGLSL() {
	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	console.log('Failed to intialize shaders.');
	return;
	}

	// // Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
	console.log('Failed to get the storage location of a_Position');
	return;
	}

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
	console.log('Failed to get the storage location of u_FragColor');
	return;
	}

  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, "u_Sampler3");
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if(!u_whichTexture){
    console.log('Failed to get the storage location of u_whichTexture');
  }

  u_LightPos = gl.getUniformLocation(gl.program, "u_LightPos");
  if(!u_LightPos){
    console.log('Failed to get the storage location of u_LightPos');
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  // u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  // if (!u_Size){
  //   console.log('Failed to get the storage location of u_Size');
  //   return;    
  // }
	
}


// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];

let g_globalAngle = 0;
let g_normalOn = false;
let g_lightPos = [0,1,-2];

function addActionsForHtmlUI(){

  document.getElementById('normalOn').onclick = function() { g_normalOn = true; };
  document.getElementById('normalOff').onclick = function() { g_normalOn = false; };

  document.getElementById('lightXSlide').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[0]=this.value/100; renderAllShapes();}});
  document.getElementById('lightYSlide').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[1]=this.value/100; renderAllShapes();}});
  document.getElementById('lightZSlide').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[2]=this.value/100; renderAllShapes();}});
  
  document.getElementById('reset').addEventListener('click', function() { map = generateMap(); });

  //angle slider:
  document.getElementById('angleSlide').addEventListener('mousemove', function() {
     g_globalAngle = parseFloat(this.value); 
     startingMouseX = null;
     renderAllShapes();
    });

    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('mousemove', mouseMove);
}

function initTextures(){
  const textures = [
    { src: 'water.jpg', unit: gl.TEXTURE0, uniform: u_Sampler0 },
    { src: 'mossy_stone.jpg', unit: gl.TEXTURE1, uniform: u_Sampler1 },
    { src: 'stone.jpg', unit: gl.TEXTURE2, uniform: u_Sampler2 },
    { src: 'grass.jpg', unit: gl.TEXTURE3, uniform: u_Sampler3 },
  ];

  textures.forEach((textureInfo, index) => {
    const image = new Image();
    if (!image) {
      console.log(`Failed to create image for ${textureInfo.src}`);
      return;
    }

    image.onload = function () {
      sendTextureToUnit(image, textureInfo.unit, textureInfo.uniform);
    };
    image.src = textureInfo.src;
  });

  return true;
}

function sendTextureToUnit(image, textureUnit, samplerUniform) {
  const texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(samplerUniform, textureUnit - gl.TEXTURE0);
}



let g_camera;
function main() {
	setupWebGL();
	connectVariablestoGLSL();

  addActionsForHtmlUI();

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //gl.viewport(0, 0, canvas.width, canvas.height);

  g_camera = new Camera();
  document.onkeydown = keydown;

  // Clear <canvas>
 // requestAnimationFrame(tick);

  renderAllShapes();


}

// change this to be WSAD
function keydown(e) {
  switch (e.key) {
    case 'w':
    case 'W':
      g_camera.forward();
      break;
    case 's':
    case 'S':
      g_camera.backward();
      break;
    case 'a':
    case 'A':
      g_camera.moveLeft();
      break;
    case 'd':
    case 'D':
      g_camera.moveRight();
      break;
    case 'q':
    case 'Q':
      g_camera.panLeft();
      break;
    case 'e':
    case 'E':
      g_camera.panRight();
      break;
    case 'g':
    case 'G':
      g_camera.panUp();
      break;
    case 'b':
    case 'B':
      g_camera.panDown();
      break;
  }

}

let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;
function mouseDown(e) {
  isMouseDown = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function mouseUp() {
  isMouseDown = false;
}

function mouseMove(e) {
  if (!isMouseDown) return;

  let deltaX = e.clientX - lastMouseX;
  let deltaY = e.clientY - lastMouseY;

  // Horizontal movement controls left/right panning.
  if (deltaX !== 0) {
    if (deltaX > 0) {
      g_camera.panLeft(deltaX);
    } else {
      g_camera.panRight(-deltaX);
    }
  }

  // Vertical movement controls up/down panning.
  if (deltaY !== 0) {
    if (deltaY > 0) {
      g_camera.panDown(deltaY);
    } else {
      g_camera.panUp(-deltaY);
    }
  }

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

let redBlock;
function generateMap() {
  const size = 40;
  let map = Array.from({ length: size }, () => Array(size).fill(0));

  // Step 1: Generate Water
  generateWater(map, size);

  // Step 2: Place Mossy Stones
  placeMossyStones(map, size);

  // Step 3: Generate Boulders
  placeBoulders(map, size);

  // Step 4: Adjust Ground Elevation
  smoothGround(map, size);

  redBlock = placeRedBlock(map, size);

  return map;
}

function placeRedBlock(map, size) {
  let attempts = 0;
  let x, z;
  do {
    x = Math.floor(Math.random() * size);
    z = Math.floor(Math.random() * size);
    attempts++;
    if (attempts > 100) break;
  } while (map[x][z] === -1 || map[x][z] >= 10);
  let redBlockHeight = map[x][z] + 1;
  return { x: x, z: z, height: redBlockHeight };
}

// chat gpt used for generate

function generateWater(map, size) {
  const waterBodies = 2 + Math.floor(Math.random() * 3); // 2-4 water bodies
  for (let i = 0; i < waterBodies; i++) {
    let centerX = Math.floor(Math.random() * (size - 6)) + 3;
    let centerZ = Math.floor(Math.random() * (size - 6)) + 3;
    let radius = 2 + Math.floor(Math.random() * 3); // Minimum radius of 2

    for (let x = centerX - radius; x <= centerX + radius; x++) {
      for (let z = centerZ - radius; z <= centerZ + radius; z++) {
        if (x >= 0 && x < size && z >= 0 && z < size) {
          const dist = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
          if (dist <= radius) map[x][z] = -1; // -1 represents water
        }
      }
    }
  }
}

// Place mossy stones near water
function placeMossyStones(map, size) {
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      if (map[x][z] === -1) {
        for (let dx = -2; dx <= 2; dx++) {
          for (let dz = -2; dz <= 2; dz++) {
            let nx = x + dx;
            let nz = z + dz;
            if (
              nx >= 0 &&
              nx < size &&
              nz >= 0 &&
              nz < size &&
              map[nx][nz] === 0
            ) {
              // 50% chance for elevated (value 2) vs. ground-level (value 4)
              if (Math.random() < 0.5) {
                map[nx][nz] = 2; // Elevated mossy stone (draws 2 blocks)
              } else {
                map[nx][nz] = 4; // Ground-level mossy stone (draws only 1 block)
              }
            }
          }
        }
      }
    }
  }
}


// Generate boulders in clusters
function placeBoulders(map, size) {
  // Pick a few clusters to add.
  const clusterCount = 5 + Math.floor(Math.random() * 3); // 5 to 7 clusters
  for (let i = 0; i < clusterCount; i++) {
    // Pick a random center that is not water.
    let centerX = Math.floor(Math.random() * size);
    let centerZ = Math.floor(Math.random() * size);
    if (map[centerX][centerZ] === -1) continue; // skip water

    // Choose a random boulder size between 1 and 3 (core size).
    let boulderWidth = 1 + Math.floor(Math.random() * 3);
    let startX = centerX - Math.floor(boulderWidth / 2);
    let startZ = centerZ - Math.floor(boulderWidth / 2);

    // Choose a random core height between 2 and 5.
    let coreHeight = 2 + Math.floor(Math.random() * 4); // possible values: 2, 3, 4, or 5
    // Set border height to one less than core (but at least 1).
    let borderHeight = (coreHeight > 2) ? coreHeight - 1 : coreHeight;
    
    // We add 10 to flag boulder cells so they don't conflict with ground/mossy stone.
    let boulderCore = 10 + coreHeight;
    let boulderBorder = 10 + borderHeight;
    
    // Place the core blocks of the boulder.
    for (let x = startX; x < startX + boulderWidth; x++) {
      for (let z = startZ; z < startZ + boulderWidth; z++) {
        if (x >= 0 && x < size && z >= 0 && z < size) {
          if (map[x][z] !== -1) { // skip water
            map[x][z] = boulderCore;
          }
        }
      }
    }
    
    // Now add a surrounding border that is 1 unit tall (using boulderBorder).
    // This border will smooth the boulder by extending its appearance a bit.
    for (let x = startX - 1; x <= startX + boulderWidth; x++) {
      for (let z = startZ - 1; z <= startZ + boulderWidth; z++) {
        // Skip the core.
        if (x >= startX && x < startX + boulderWidth && z >= startZ && z < startZ + boulderWidth)
          continue;
        if (x >= 0 && x < size && z >= 0 && z < size) {
          if (map[x][z] !== -1) { // avoid water
            // Set the cell to the border height if it isn't already higher.
            map[x][z] = Math.max(map[x][z], boulderBorder);
          }
        }
      }
    }
  }
}





// Smooth ground elevation
function smoothGround(map, size) {
  for (let x = 1; x < size - 1; x++) {
    for (let z = 1; z < size - 1; z++) {
      if (map[x][z] === 0) { // smooth only ground cells
        let sum = 0;
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dz = -1; dz <= 1; dz++) {
            let nx = x + dx;
            let nz = z + dz;
            if (map[nx][nz] === 0) {
              sum += map[nx][nz];
              count++;
            }
          }
        }
        let avg = Math.round(sum / count);
        map[x][z] = Math.min(avg, map[x][z] + 1);
      }
    }
  }
  // Ensure water stays at height -1.
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      if (map[x][z] === -1) {
        map[x][z] = -1;
      }
    }
  }
}



var cube = new Cube();
function renderMap(map, size) {
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      let rawValue = map[x][z];
      let texture;
      let height;
      
      if (rawValue === -1) {
        texture = 0; // Water
        height = 0;
      } else if (rawValue >= 10) {
        texture = 2; // Stone boulder
        height = rawValue - 10; // actual boulder height (between 2 and 5, or border height)
      } else if (rawValue === 2) {
        texture = 1; // Elevated mossy stone
        height = rawValue;
      } else if (rawValue === 4) {
        texture = 1; // Ground-level mossy stone uses the same texture; draw one cube only.
        height = 0;
      } else {
        texture = 3; // Ground
        height = rawValue;
      }
      
      for (let h = 0; h <= height; h++) {
        cube.textureNum = texture;
        cube.matrix.setIdentity();
        cube.matrix.translate(x - size / 2, h * 0.5, z - size / 2);
        cube.render();
      }
    }
  }
}



// Add and remove blocks:
document.addEventListener("keydown", function (event) {
  // Get the eye and at positions.
  let eye = g_camera.eye.elements;  // [x, y, z]
  let at = g_camera.at.elements;    // [x, y, z]
  
  // Compute the direction vector (normalize it).
  let dir = new Vector3(at);
  dir.sub(new Vector3(eye));
  dir.normalize();
  
  // Compute t such that the ray intersects the ground (y = 0).
  let groundY = 0;
  if (Math.abs(dir.elements[1]) < 0.0001) return; // avoid division by zero
  
  let t = (groundY - eye[1]) / dir.elements[1];
  
  // Compute intersection point on the ground.
  let intersectX = eye[0] + t * dir.elements[0];
  let intersectZ = eye[2] + t * dir.elements[2];
  
  // Convert to map indices.
  // Assuming your map is 40x40 and centered, we add 20.
  let mapSize = 40;
  let targetX = Math.round(intersectX + mapSize / 2);
  let targetZ = Math.round(intersectZ + mapSize / 2);

  // Optional: Log for debugging.
  // console.log("Target cell:", targetX, targetZ, "Block value:", map[targetX] && map[targetX][targetZ]);
  
  // Check bounds and then add/remove block.
  if (targetX >= 0 && targetX < mapSize && targetZ >= 0 && targetZ < mapSize) {
    if (event.key === "t" || event.key === "T") { // Add block
      if (map[targetX][targetZ] < 3) {
        map[targetX][targetZ]++;
        console.log("Added block at:", targetX, targetZ, "New value:", map[targetX][targetZ]);
      }
    }
    if (event.key === "r" || event.key === "R") { // Remove block
      if (map[targetX][targetZ] > 0) {
        map[targetX][targetZ]--;
        console.log("Removed block at:", targetX, targetZ, "New value:", map[targetX][targetZ]);
      }
    }
  } else {
    console.log("Target is out of map bounds:", targetX, targetZ);
  }
});





let map = generateMap();
function renderAllShapes() {
  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //pass light into shader:
  gl.uniform3f(u_LightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  // draw the light in extra bright yellow
  var light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(.1, .1, .1);
  light.matrix.translate(-.5, -.5, -.5);
  light.render();

  var floor = new Cube();
  floor.color = [0,1,0,1];
  floor.textureNum=-2;
  floor.matrix.translate(0,0,0);
  floor.matrix.scale(16,0,16);
  floor.matrix.translate(-.5,0,.5);
  floor.render();

  var sky = new Cube();
  sky.color = [150/255,203/255,1,1];
  if(g_normalOn) sky.textureNum=-3;
  else{
    sky.textureNum=-2;
  }
  sky.matrix.scale(-55,-55,-55);
  sky.matrix.translate(-.5,-.5,.5);
  sky.render();

  renderMap(map, 40);

  if (redBlock) {
    let cubeRed = new Cube();
    cubeRed.textureNum = -2;  // Use solid color
    cubeRed.color = [1, 0, 0, 1]; // red
    cubeRed.matrix.setIdentity();
    cubeRed.matrix.translate(redBlock.x - 20, redBlock.height * 0.5 +.5, redBlock.z - 20);
    // Scale down the cube.
    cubeRed.matrix.scale(0.5, 0.5, 0.5);
    cubeRed.render();
  }


  requestAnimationFrame(renderAllShapes);

  var duration = performance.now() - startTime;
  sendTextToHtml(' fps: ' + Math.floor(1000 / duration)/10, "numdot");
}

function sendTextToHtml(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log('No html element with id=' + htmlID);
    return;
  }
  htmlElm.innerHTML = text;
}