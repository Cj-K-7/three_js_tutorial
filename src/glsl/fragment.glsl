#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;

varying vec2 v_uv;

//uniform is vaiables read-only
//for GPU recieved from CPU.
// All GPU threads can get same inputs

void main() {
  vec4 particle = texture2D(u_texture,v_uv); 
  vec3 rgb = vec3(.9,.7,.1);

  gl_FragColor = vec4(rgb,particle.r);
}