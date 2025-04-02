varying vec3 vNormal; // Соответствующее объявление во фрагментном шейдере
varying vec3 vPosition;

void main() {
    vec3 lightDir = normalize(vec3(0.5, 0.8, 0.2));
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 color = vec3(0.0, 0.31, 0.02) * (diff + 1.2);
    
    gl_FragColor = vec4(color, 1.0);
}