class Sphere {
  constructor() {
    this.type = 'sphere';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = 0; // default use texture0

    // Create buffers once:
    this.vertBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();
    this.normBuffer = gl.createBuffer();

    // Pre-calculate sphere geometry:
    this.initSphereData();
  }

  initSphereData() {
    const vertices = [];
    const uvs = [];
    const normals = [];
    const d = Math.PI / 10;
    const dd = Math.PI / 10;

    // Loop over latitude (t) and longitude (r)
    for (let t = 0; t < Math.PI; t += d) {
      for (let r = 0; r < 2 * Math.PI; r += dd) {
        // Calculate four points on the sphere:
        const p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
        const p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
        const p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
        const p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];

        // For a sphere the normal at a point is just the normalized position
        // First triangle (p1, p2, p4):
        vertices.push(...p1, ...p2, ...p4);
        normals.push(...p1, ...p2, ...p4);
        // UVs can be mapped from the angles (ranging from 0 to 1)
        uvs.push(r / (2 * Math.PI), t / Math.PI,
                 r / (2 * Math.PI), (t + dd) / Math.PI,
                 (r + dd) / (2 * Math.PI), (t + dd) / Math.PI);

        // Second triangle (p1, p4, p3):
        vertices.push(...p1, ...p4, ...p3);
        normals.push(...p1, ...p4, ...p3);
        uvs.push(r / (2 * Math.PI), t / Math.PI,
                 (r + dd) / (2 * Math.PI), (t + dd) / Math.PI,
                 (r + dd) / (2 * Math.PI), t / Math.PI);
      }
    }
    // Convert arrays to Float32Arrays:
    this.vertices = new Float32Array(vertices);
    this.uvs = new Float32Array(uvs);
    this.normals = new Float32Array(normals);
  }

  render() {
    // Set shader uniforms:
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Bind and send vertex data:
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Bind and send UV data:
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    // Bind and send normals:
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    // Draw the sphere as a collection of triangles:
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }
}
