export function startFluidBG({
                                 canvasId = "fluidBg",
                                 // your channelMenu background: #000626
                                 baseColor = [0.0, 6.0 / 255.0, 38.0 / 255.0],
                                 // cyan (tweak if you want it more green/blue)
                                 fluidColor = [0.0, 0.97, 1.0],
                                 targetFPS = 30,
                             } = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
        powerPreference: "high-performance",
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        alpha: true,
    });

    if (!gl) {
        console.warn("WebGL2 not available; fluid background disabled.");
        return;
    }

    const vertexShaderSrc = `#version 300 es
    layout(location = 0) in vec2 aPosition;
    out vec2 vUV;
    void main() {
      vUV = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }`;

    // Based on the CodePen shader, with color changes:
    // - black base -> baseColor
    // - gold -> fluidColor
    const fragmentShaderSrc = `#version 300 es
    precision mediump float;
    in vec2 vUV;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uBaseColor;
    uniform vec3 uFluidColor;
    out vec4 fragColor;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < 4; ++i) {
        v += a * snoise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 aspect = vec2(1.0, uResolution.y / uResolution.x);
      vec2 p = vUV * 3.0 * aspect;

      float n = fbm(p + uTime * 0.1);
      float d = fbm(p + n + uTime * 0.05);
      n = fbm(p + d);
      n = smoothstep(0.3, 0.8, n);

      vec3 col = mix(uBaseColor, uFluidColor, n);
      fragColor = vec4(col, 1.0);
    }`;

    function compile(type, src) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(sh));
            gl.deleteShader(sh);
            return null;
        }
        return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, vertexShaderSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "uTime");
    const resLoc = gl.getUniformLocation(program, "uResolution");
    const baseLoc = gl.getUniformLocation(program, "uBaseColor");
    const fluidLoc = gl.getUniformLocation(program, "uFluidColor");

    gl.uniform3f(baseLoc, baseColor[0], baseColor[1], baseColor[2]);
    gl.uniform3f(fluidLoc, fluidColor[0], fluidColor[1], fluidColor[2]);

    let width = 0, height = 0;

    function resize() {
        const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
        width = Math.floor(window.innerWidth * dpr);
        height = Math.floor(window.innerHeight * dpr);

        canvas.width = width;
        canvas.height = height;

        // keep CSS size as viewport
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";

        gl.viewport(0, 0, width, height);
        gl.uniform2f(resLoc, width, height);
    }

    let lastTime = performance.now();
    const frameTime = 1000 / targetFPS;
    let rafId;

    function render(now) {
        const dt = now - lastTime;
        if (dt >= frameTime) {
            lastTime = now - (dt % frameTime);
            gl.uniform1f(timeLoc, now * 0.001);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        rafId = requestAnimationFrame(render);
    }

    window.addEventListener("resize", () => {
        cancelAnimationFrame(rafId);
        resize();
        lastTime = performance.now();
        rafId = requestAnimationFrame(render);
    }, { passive: true });

    resize();
    rafId = requestAnimationFrame(render);

    return {
        setColors(nextBaseRGB, nextFluidRGB) {
            gl.uniform3f(baseLoc, nextBaseRGB[0], nextBaseRGB[1], nextBaseRGB[2]);
            gl.uniform3f(fluidLoc, nextFluidRGB[0], nextFluidRGB[1], nextFluidRGB[2]);
        }
    };
}
