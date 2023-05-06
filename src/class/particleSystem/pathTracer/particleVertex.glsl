#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying float vOpacity;

attribute float opacity;
attribute float size;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vUv = uv;
  vOpacity = opacity;
  gl_PointSize = size;
  gl_Position = projectionMatrix * mvPosition;
}