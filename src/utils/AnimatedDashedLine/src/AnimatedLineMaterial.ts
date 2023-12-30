import * as THREE from "three";

export class AnimatedLineMaterial extends THREE.ShaderMaterial {
  constructor(color: THREE.ColorRepresentation = "yellow") {
    const lineVertShader = `
      attribute float lineDistance;
      varying float vLineDistance;
      
      void main() {
        vLineDistance = lineDistance;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const lineFragShader = `
      uniform vec3 diffuse;
      uniform float opacity;
      uniform float time;
  
      uniform float dashSize;
      uniform float gapSize;
      uniform float dotSize;
      varying float vLineDistance;
      
      void main() {
        float totalSize = dashSize + gapSize;
        float modulo = mod( vLineDistance + time, totalSize ); // time added to vLineDistance
        float dotDistance = dashSize + (gapSize * .5) - (dotSize * .5);
        
        if ( modulo > dashSize && mod(modulo, dotDistance) > dotSize ) {
          discard;
        }
  
        gl_FragColor = vec4( diffuse, opacity );
      }
    `;
    super({
      uniforms: {
        diffuse: { value: new THREE.Color(color) },
        dashSize: { value: 1 },
        gapSize: { value: 2 },
        dotSize: { value: 1 },
        opacity: { value: 1.0 },
        time: { value: 0 },
      },
      vertexShader: lineVertShader,
      fragmentShader: lineFragShader,
      transparent: true,
    });
  }
}
