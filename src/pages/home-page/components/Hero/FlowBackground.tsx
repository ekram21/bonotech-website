import { useEffect, useRef, type CSSProperties } from "react";

type FlowBackgroundProps = {
    className?: string;
    style?: CSSProperties;
    /** When true, freezes the shader clock (manual pause or reduced motion). */
    paused?: boolean;
    /** Cap for devicePixelRatio (template discovery uses 1; hero uses 1.5). */
    maxPixelRatio?: number;
    /** Vertical ring center in shader UV space (template default 0.43). */
    ringCenterY?: number;
    /** Shader time seed so sections can start mid-orbit like the template. */
    initialElapsed?: number;
};

const vertexShaderSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uCenterY;

  float hash(vec2 point) {
    vec3 value = fract(vec3(point.xyx) * 0.1031);
    value += dot(value, value.yzx + 33.33);
    return fract((value.x + value.y) * value.z);
  }

  float gaussian(float value) {
    return exp(-value * value);
  }

  void main() {
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    float time = uTime * 0.62;
    float aspect = uResolution.x / max(uResolution.y, 1.0);

    float spread = mix(
      1.58,
      1.76,
      smoothstep(0.6, 1.8, aspect)
    );

    /* Ring vertical center — hero nudges down under the fixed navbar; discovery keeps template 0.43 */
    vec2 center = vec2(
      0.5 + 0.024 * sin(time * 0.43),
      uCenterY + 0.025 * sin(time * 0.57)
    );

    vec2 point = (uv - center + uPointer * 0.007) * vec2(spread, 3.55);

    point.x += 0.07 * sin(point.y * 1.8 + time * 0.65);
    point.y += 0.075 * sin(point.x * 2.2 - time * 0.72);

    float angle = atan(point.y, point.x);
    float radius = length(point);

    float bend =
      0.062 * sin(angle * 2.0 + time * 0.72) +
      0.038 * cos(angle * 3.0 - time * 0.56);

    float curvedRadius = radius + bend;

    float tube = gaussian((curvedRadius - 1.08) / 0.37);
    float shoulder = gaussian((curvedRadius - 0.92) / 0.16);
    float innerShade = smoothstep(0.56, 1.02, curvedRadius);

    float orbit = 0.5 + 0.5 * cos(angle - time * 0.78);
    float sweep = 0.5 + 0.5 * sin(
      angle * 2.0 + curvedRadius * 2.7 - time * 1.15
    );

    float light = 0.40 + 0.38 * orbit + 0.22 * sweep;
    float tint = 0.5 + 0.5 * sin(
      angle - time * 0.47 + curvedRadius * 1.6
    );

    vec3 violet = mix(
      vec3(0.30, 0.075, 0.66),
      vec3(0.53, 0.29, 0.87),
      tint
    );

    vec3 lavender = mix(
      vec3(0.60, 0.39, 0.94),
      vec3(0.84, 0.73, 1.0),
      orbit
    );

    vec3 color = vec3(0.055, 0.020, 0.105);

    float upperGlow = gaussian((uv.y - 0.09) / 0.29);

    color += mix(
      vec3(0.19, 0.095, 0.31),
      vec3(0.31, 0.22, 0.43),
      orbit
    ) * upperGlow;

    color += violet * tube * innerShade * (0.56 + 0.55 * light);
    color += lavender * shoulder * (0.14 + 0.34 * light);

    float band = gaussian(
      (curvedRadius - (1.12 + 0.13 * sin(time * 0.8 + angle))) / 0.115
    );

    color += vec3(0.28, 0.14, 0.48) * band * (0.12 + 0.24 * sweep);
    color *= 1.0 - 0.63 * exp(-curvedRadius * curvedRadius * 3.2);
    color *= 1.0 - 0.28 * smoothstep(0.46, 0.90, uv.y);

    float grain = hash(gl_FragCoord.xy + floor(uTime * 18.0) * 17.0) - 0.5;
    color += grain * (0.028 + 0.060 * tube);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
): WebGLShader {
    const shader = gl.createShader(type);

    if (!shader) {
        throw new Error("Unable to create WebGL shader");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
        gl.deleteShader(shader);
        throw new Error(error);
    }

    return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram {
    const vertexShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
    );

    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
    );

    const program = gl.createProgram();

    if (!program) {
        throw new Error("Unable to create WebGL program");
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(program) ?? "Unknown program error";
        gl.deleteProgram(program);
        throw new Error(error);
    }

    return program;
}

export default function FlowBackground({
    className,
    style,
    paused = false,
    maxPixelRatio = 1.25,
    ringCenterY = 0.48,
    initialElapsed = 0,
}: FlowBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pausedRef = useRef(paused);
    pausedRef.current = paused;

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        const gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: false,
            powerPreference: "low-power",
        });

        if (!gl) {
            console.warn("WebGL is not supported by this browser");
            return;
        }

        let program: WebGLProgram;

        try {
            program = createProgram(gl);
        } catch (error) {
            console.error("Could not initialize FlowBackground:", error);
            return;
        }

        const positionAttribute = gl.getAttribLocation(program, "aPosition");
        const resolutionUniform = gl.getUniformLocation(program, "uResolution");
        const pointerUniform = gl.getUniformLocation(program, "uPointer");
        const timeUniform = gl.getUniformLocation(program, "uTime");
        const centerYUniform = gl.getUniformLocation(program, "uCenterY");

        const buffer = gl.createBuffer();

        if (!buffer) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,

                -1, 1,
                1, -1,
                1, 1,
            ]),
            gl.STATIC_DRAW
        );

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttribute);
        gl.vertexAttribPointer(
            positionAttribute,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        let width = 0;
        let height = 0;
        let elapsed = initialElapsed;
        let lastTime = 0;
        let animationFrame = 0;
        let isVisible = true;
        let isPaused = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let pointerX = 0;
        let pointerY = 0;
        let targetPointerX = 0;
        let targetPointerY = 0;

        const render = () => {
            if (!width || !height) return;

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.useProgram(program);

            gl.uniform2f(resolutionUniform, width, height);
            gl.uniform2f(pointerUniform, pointerX, pointerY);
            gl.uniform1f(timeUniform, elapsed);
            gl.uniform1f(centerYUniform, ringCenterY);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        const resize = () => {
            const bounds = container.getBoundingClientRect();
            width = bounds.width;
            height = bounds.height;

            const isCoarse = window.matchMedia("(pointer: coarse)").matches;
            const pixelRatio = Math.min(
                window.devicePixelRatio || 1,
                isCoarse ? Math.min(maxPixelRatio, 1) : maxPixelRatio,
            );

            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);

            render();
        };

        const animate = (currentTime: number) => {
            animationFrame = 0;

            if (!lastTime) {
                lastTime = currentTime;
            }

            const delta = Math.min((currentTime - lastTime) / 1000, 0.06);
            lastTime = currentTime;

            if (!isVisible || document.hidden) {
                lastTime = 0;
                return;
            }

            pointerX += (targetPointerX - pointerX) * 0.035;
            pointerY += (targetPointerY - pointerY) * 0.035;

            if (!isPaused && !pausedRef.current) {
                elapsed += delta;
            }

            render();
            animationFrame = requestAnimationFrame(animate);
        };

        const syncAnimation = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = 0;
            lastTime = 0;
            if (isVisible && !document.hidden) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        const resizeObserver = new ResizeObserver(resize);

        // Atmosphere parents often set pointer-events:none — listen on the section/hero instead.
        const pointerRoot =
            container.closest("section, .hero") ?? container.parentElement ?? container;

        const handlePointerMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;

            const bounds = pointerRoot.getBoundingClientRect();

            targetPointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
            targetPointerY =
                ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        };

        const resetPointer = () => {
            targetPointerX = 0;
            targetPointerY = 0;
        };

        const motionQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const handleMotionChange = (event: MediaQueryListEvent) => {
            isPaused = event.matches;
        };

        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                syncAnimation();
            },
            { rootMargin: "12% 0px", threshold: 0.01 },
        );

        const handleDocumentVisibility = () => {
            syncAnimation();
        };

        pointerRoot.addEventListener("pointermove", handlePointerMove as EventListener);
        pointerRoot.addEventListener("pointerleave", resetPointer);

        motionQuery.addEventListener("change", handleMotionChange);
        document.addEventListener("visibilitychange", handleDocumentVisibility);
        visibilityObserver.observe(container);
        resizeObserver.observe(container);

        resize();
        syncAnimation();

        return () => {
            cancelAnimationFrame(animationFrame);

            pointerRoot.removeEventListener("pointermove", handlePointerMove as EventListener);
            pointerRoot.removeEventListener("pointerleave", resetPointer);

            motionQuery.removeEventListener("change", handleMotionChange);
            document.removeEventListener("visibilitychange", handleDocumentVisibility);
            visibilityObserver.disconnect();
            resizeObserver.disconnect();

            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
        };
    }, [initialElapsed, maxPixelRatio, ringCenterY]);

    return (
        <div
            ref={containerRef}
            className={`${className ?? ""} ready`.trim()}
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                background: "transparent",
                pointerEvents: "none",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
}
