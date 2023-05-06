#ifdef GL_ES
precision mediump float;
#endif
varying float vOpacity;

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
}