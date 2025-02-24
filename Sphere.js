class Cube{
    constructor(){
        this.type = 'shere';
        //this.position = [0.0, 0.0,0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5;
        this.matrix = new Matrix4();
        this.textureNum=0; // default use texture0
  
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

      var d = Math.PI/10;
      var dd = Math.PI/10;

      // t and r can be u and v just scale back into range of 0 and 1
      // don't worry about adding texture right now, hence why they are 0
      for(var t=0; t<Math.PI; t+=d) {
        for (r = 0; r < (2 * Math.PI); r += dd) {
           var p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];//[sin(t)*cos(r), cos(t), sin(t)*sin(r)];
        
           var p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];//[sin(t+dd)*cos(r), cos(t+dd), sin(t+dd)*sin(r)];
           var p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];//[sin(t+dd)*cos(r+dd), cos(t+dd), sin(t+dd)*sin(r+dd)];
           var p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];

           // first set of triangles
           var v = [];
           var uv = [];
           v = v.concat(p1);uv = uv.concat([0,0]);
           v = v.concat(p2);uv = uv.concat([0,0]);
           //v = v.concat(p3);uv = uv.concat([1,1]);
           v = v.concat(p4);uv = uv.concat([0,0]);

           gl.uniform4f(u_FragColor, 1,1,1,1);
           // in a shere position is the normal, not true for other shapes
           //drawTriangle3DUV(v,uv,v)

           // second set of triangles
           v=[];uv=[];
           v = v.concat(p1);uv = uv.concat([0,0]);
           v = v.concat(p4);uv = uv.concat([0,0]);
           v = v.concat(p3);uv = uv.concat([0,0]);
           gl.uniform4f(u_FragColor, 1,1,1,1);
           //drawTriangle3DUV()

           //v = v.concat(p2);uv = uv.concat([0,0]);
        }

    }

  
      //cube stuff:
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
    
  