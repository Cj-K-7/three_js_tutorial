#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_color;
uniform sampler2D u_texture;

varying vec2 v_uv;

//uniform is vaiables read-only
//for GPU recieved from CPU.
// All GPU threads can get same inputs

void main() {
  vec4 particle = texture2D(u_texture,v_uv); 
  vec3 rgb = u_color;

  gl_FragColor = vec4(rgb,particle.r);
}