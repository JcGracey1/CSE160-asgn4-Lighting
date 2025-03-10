class Cube{
  constructor(){
      //this.type = 'cube';
      //this.position = [0.0, 0.0,0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5;
      this.matrix = new Matrix4();
      this.textureNum=-2; // default use texture0

      this.vertBuffer = null;
      this.uvBuffer = null;
      this.normBuffer = null;

      this.setVertices();
      this.setUvs();
      this.setNormals();
  }

  setVertices() {
    this.vertices = new Float32Array([
        // FRONT
        0,0,0,  1,1,0,  1,0,0,
        0,0,0,  0,1,0,  1,1,0,

        // BACK
        0,0,-1,  1,1,-1,  1,0,-1,
        0,0,-1,  0,1,-1,  1,1,-1,

        // TOP
        0,1,0,  1,1,-1,  1,1,0,
        0,1,0,  0,1,-1,  1,1,-1,

        // BOTTOM
        0,0,0,  1,0,-1,  1,0,0,
        0,0,0,  0,0,-1,  1,0,-1,

        // LEFT
        0,0,0,  0,1,0,  0,0,-1,
        0,0,-1,  0,1,0,  0,1,-1,

        // RIGHT
        1,0,0,  1,1,0,  1,0,-1,
        1,0,-1,  1,1,0,  1,1,-1
    ]);
  }
  
  setUvs() {
    // prettier-ignore
    this.uvs = new Float32Array([
      // FRONT
      0,0, 1,1, 1,0, 
      0,0, 1,0, 1,1,
  
      // BACK
      0,0, 1,1, 1,0, 
      0,0, 0,1, 1,1,
  
      // TOP
      0,1, 1,0, 1,1, 
      0,1, 0,0, 1,0,
  
      // BOTTOM
      0,1, 1,0, 1,1, 
      0,1, 0,0, 1,0,
  
      // LEFT
      1,1, 1,0, 0,1, 
      0,1, 1,0, 0,0,
  
      // RIGHT
      0,1, 0,0, 1,1, 
      1,1, 0,0, 1,0,
    ]);
  }

  setNormals() {
    this.normals = new Float32Array([
      // FRONT face normals (pointing outwards along +Z)
      0, 0, 1,  0, 0, 1,  0, 0, 1,
      0, 0, 1,  0, 0, 1,  0, 0, 1,
  
      // BACK face normals (pointing outwards along -Z)
      0, 0, -1,  0, 0, -1,  0, 0, -1,
      0, 0, -1,  0, 0, -1,  0, 0, -1,
  
      // TOP face normals (pointing outwards along +Y)
      0, 1, 0,  0, 1, 0,  0, 1, 0,
      0, 1, 0,  0, 1, 0,  0, 1, 0,
  
      // BOTTOM face normals (pointing outwards along -Y)
      0, -1, 0,  0, -1, 0,  0, -1, 0,
      0, -1, 0,  0, -1, 0,  0, -1, 0,
  
      // LEFT face normals (pointing outwards along -X)
      -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
      -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  
      // RIGHT face normals (pointing outwards along +X)
      1, 0, 0,  1, 0, 0,  1, 0, 0,
      1, 0, 0,  1, 0, 0,  1, 0, 0
    ]);
  }
  

  render() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Create buffers:
    if(this.vertBuffer == null) {
      this.vertBuffer = gl.createBuffer();
      if(!this.vertBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    }

    if(this.uvBuffer == null) {
      this.uvBuffer = gl.createBuffer();
      if(!this.uvBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    }

    if(this.normBuffer == null) {
      this.normBuffer = gl.createBuffer();
      if(!this.normBuffer) {
        console.log('Failed to create the buffer object for normals');
        return -1;
      }
    }

    // bind positions:
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // bind uvs:
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    // bind normals:
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }

}
  
