precision highp float;

uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;

varying vec2 vUv;
varying vec3 vPosition;
varying float vOpacity;
float PI = 3.141592653589793238;

void main(){
    vec2 uv = vec2(gl_PointCoord.x,1. - gl_PointCoord.y);
    vec2 cUV = 2.*uv - 1.;
    vec3 originalColor = vec3(2./255.,30./255.,30./255.);
    vec4 color = vec4(0.05/length(cUV));

    color.rgb = min(vec3(10.),color.rgb);
    color.rgb *= originalColor*100.;
    color *= vOpacity;
    color.a = min(0.3,color.a)*3.;

    float disc = length(cUV);

    gl_FragColor = vec4(color.r - disc,color.g - disc,color.b - disc,color.a);
    // gl_FragColor = vec4(color.rgb,color.a);
}