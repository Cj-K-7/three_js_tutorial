#ifdef GL_ES
precision mediump float;
#endif

uniform float u_amp;
uniform float u_speed;
uniform float u_time;
uniform vec3 u_mouse;

varying vec2 v_uv;

attribute vec3 particle_center;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

mat3 rotation3dY(float angle){
      float s = sin(angle);
      float c = cos(angle);

      return mat3(
            c,0. , -s,
            0., 1., 0.,
            s, 0.0, c
      );
}

float c_noise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

vec3 fbm_vec3(vec3 p, float frequency, float offset){
      return vec3(
            c_noise((p+vec3(offset))* frequency),
            c_noise((p+vec3(offset+20.0))* frequency),
            c_noise((p+vec3(offset-30.0))* frequency));
}

vec3 getOffset(vec3 p){
      float twist_scale = c_noise(particle_center)*0.5 + 0.5;
      // vec3 temp_pos = rotation3dY(u_time*(0.1 + 0.5*twist_scale) + length(particle_position.xz))*p;
      vec3 offset = fbm_vec3(particle_center, 0.5, twist_scale );
      return offset * u_speed;
}

void main(){
      v_uv = position.xy + vec2(0.5);

      //rotate on particle_size
      float particle_size = c_noise(particle_center) * 0.5 + 0.5;
      float rotateing_angle = u_time * (0.6 * particle_size);

      //rotate particles_position
      vec3 rotated_pos = rotation3dY( rotateing_angle)*particle_center;
      
      //add offset & noise on rotating particles position
      vec3 offset_pos = getOffset(rotated_pos);
      vec3 fbm_noised_pos = fbm_vec3(rotated_pos + offset_pos,0.,0.);
      
      

      //apply to matrix
      vec4 final_scaled_mat = vec4(rotated_pos+fbm_noised_pos+offset_pos,1.);

      //physical position
      vec3 particle_position = (modelMatrix * final_scaled_mat).xyz;

      
      // //apply mouse distance to position
      float distance_mouse =pow(1. - clamp(length(u_mouse.xz - particle_position.xz), 0., 1.),1.);
      vec3 dir = particle_position - u_mouse;

      particle_position = mix(particle_position, u_mouse + normalize(dir),
       distance_mouse);
      // particle_position.y += distance_mouse;

      vec4 viewMat_pos = viewMatrix * vec4(particle_position, 1.);
      viewMat_pos.xyz += position*u_amp*(0.1 * particle_size + 0.01);

      gl_Position = projectionMatrix*viewMat_pos;
}