import React, { useEffect, useRef, useState, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { 
  X, Calendar, MapPin, Clock, Trophy, ChevronRight, Globe, 
  Maximize2, Flag, Activity, Wind, Zap, AlertTriangle 
} from 'lucide-react';

// --- Types ---

interface RaceData {
  id: number;
  round: number;
  circuitName: string;
  grandPrixName: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  date: string;
  fullDate: string;
  lapRecord: string;
  trackLength: string;
  laps: number;
  lastWinner: { driver: string; team: string; year: number };
  flagEmoji: string;
}

// --- Data ---

const RACES: RaceData[] = [
  { id: 1, round: 1, circuitName: "Bahrain International Circuit", grandPrixName: "Bahrain GP", location: "Sakhir", country: "Bahrain", lat: 26.0325, lng: 50.5106, date: "Mar 06", fullDate: "2026-03-06", lapRecord: "1:31.447", trackLength: "5.412 km", laps: 57, lastWinner: { driver: "Max Verstappen", team: "Red Bull", year: 2025 }, flagEmoji: "🇧🇭" },
  { id: 2, round: 2, circuitName: "Jeddah Corniche Circuit", grandPrixName: "Saudi Arabian GP", location: "Jeddah", country: "Saudi Arabia", lat: 21.6319, lng: 39.1044, date: "Mar 13", fullDate: "2026-03-13", lapRecord: "1:27.472", trackLength: "6.174 km", laps: 50, lastWinner: { driver: "Lewis Hamilton", team: "Ferrari", year: 2025 }, flagEmoji: "🇸🇦" },
  { id: 3, round: 3, circuitName: "Albert Park Circuit", grandPrixName: "Australian GP", location: "Melbourne", country: "Australia", lat: -37.8497, lng: 144.968, date: "Apr 03", fullDate: "2026-04-03", lapRecord: "1:19.813", trackLength: "5.278 km", laps: 58, lastWinner: { driver: "Oscar Piastri", team: "McLaren", year: 2025 }, flagEmoji: "🇦🇺" },
  { id: 4, round: 4, circuitName: "Suzuka Circuit", grandPrixName: "Japanese GP", location: "Suzuka", country: "Japan", lat: 34.8431, lng: 136.541, date: "Apr 10", fullDate: "2026-04-10", lapRecord: "1:30.983", trackLength: "5.807 km", laps: 53, lastWinner: { driver: "Max Verstappen", team: "Red Bull", year: 2025 }, flagEmoji: "🇯🇵" },
  { id: 5, round: 5, circuitName: "Shanghai International Circuit", grandPrixName: "Chinese GP", location: "Shanghai", country: "China", lat: 31.3389, lng: 121.22, date: "May 01", fullDate: "2026-05-01", lapRecord: "1:32.238", trackLength: "5.451 km", laps: 56, lastWinner: { driver: "Lando Norris", team: "McLaren", year: 2025 }, flagEmoji: "🇨🇳" },
  { id: 6, round: 6, circuitName: "Miami International Autodrome", grandPrixName: "Miami GP", location: "Miami", country: "USA", lat: 25.958, lng: -80.2389, date: "May 08", fullDate: "2026-05-08", lapRecord: "1:29.708", trackLength: "5.412 km", laps: 57, lastWinner: { driver: "Lando Norris", team: "McLaren", year: 2025 }, flagEmoji: "🇺🇸" },
  { id: 7, round: 7, circuitName: "Circuit de Monaco", grandPrixName: "Monaco GP", location: "Monte Carlo", country: "Monaco", lat: 43.7347, lng: 7.4206, date: "May 22", fullDate: "2026-05-22", lapRecord: "1:12.909", trackLength: "3.337 km", laps: 78, lastWinner: { driver: "Charles Leclerc", team: "Ferrari", year: 2025 }, flagEmoji: "🇲🇨" },
  { id: 8, round: 8, circuitName: "Circuit de Barcelona-Catalunya", grandPrixName: "Spanish GP", location: "Barcelona", country: "Spain", lat: 41.57, lng: 2.2611, date: "May 29", fullDate: "2026-05-29", lapRecord: "1:16.330", trackLength: "4.657 km", laps: 66, lastWinner: { driver: "Max Verstappen", team: "Red Bull", year: 2025 }, flagEmoji: "🇪🇸" },
  { id: 9, round: 9, circuitName: "Circuit Gilles Villeneuve", grandPrixName: "Canadian GP", location: "Montreal", country: "Canada", lat: 45.5048, lng: -73.5267, date: "Jun 12", fullDate: "2026-06-12", lapRecord: "1:13.078", trackLength: "4.361 km", laps: 70, lastWinner: { driver: "Max Verstappen", team: "Red Bull", year: 2025 }, flagEmoji: "🇨🇦" },
  { id: 10, round: 10, circuitName: "Red Bull Ring", grandPrixName: "Austrian GP", location: "Spielberg", country: "Austria", lat: 47.2197, lng: 14.7647, date: "Jun 26", fullDate: "2026-06-26", lapRecord: "1:05.619", trackLength: "4.318 km", laps: 71, lastWinner: { driver: "George Russell", team: "Mercedes", year: 2025 }, flagEmoji: "🇦🇹" },
  { id: 11, round: 11, circuitName: "Silverstone Circuit", grandPrixName: "British GP", location: "Silverstone", country: "UK", lat: 52.0786, lng: -1.0169, date: "Jul 03", fullDate: "2026-07-03", lapRecord: "1:27.097", trackLength: "5.891 km", laps: 52, lastWinner: { driver: "Lewis Hamilton", team: "Ferrari", year: 2025 }, flagEmoji: "🇬🇧" },
  { id: 12, round: 12, circuitName: "Hungaroring", grandPrixName: "Hungarian GP", location: "Budapest", country: "Hungary", lat: 47.5789, lng: 19.2486, date: "Jul 17", fullDate: "2026-07-17", lapRecord: "1:16.627", trackLength: "4.381 km", laps: 70, lastWinner: { driver: "Oscar Piastri", team: "McLaren", year: 2025 }, flagEmoji: "🇭🇺" },
  { id: 13, round: 13, circuitName: "Spa-Francorchamps", grandPrixName: "Belgian GP", location: "Spa", country: "Belgium", lat: 50.4372, lng: 5.9714, date: "Jul 31", fullDate: "2026-07-31", lapRecord: "1:46.286", trackLength: "7.004 km", laps: 44, lastWinner: { driver: "Lewis Hamilton", team: "Ferrari", year: 2025 }, flagEmoji: "🇧🇪" },
  { id: 14, round: 14, circuitName: "Zandvoort", grandPrixName: "Dutch GP", location: "Zandvoort", country: "Netherlands", lat: 52.3888, lng: 4.5409, date: "Aug 21", fullDate: "2026-08-21", lapRecord: "1:11.097", trackLength: "4.259 km", laps: 72, lastWinner: { driver: "Lando Norris", team: "McLaren", year: 2025 }, flagEmoji: "🇳🇱" },
  { id: 15, round: 15, circuitName: "Monza", grandPrixName: "Italian GP", location: "Monza", country: "Italy", lat: 45.6156, lng: 9.2811, date: "Sep 04", fullDate: "2026-09-04", lapRecord: "1:21.046", trackLength: "5.793 km", laps: 53, lastWinner: { driver: "Charles Leclerc", team: "Ferrari", year: 2025 }, flagEmoji: "🇮🇹" },
  { id: 16, round: 16, circuitName: "Marina Bay", grandPrixName: "Singapore GP", location: "Singapore", country: "Singapore", lat: 1.2914, lng: 103.864, date: "Sep 18", fullDate: "2026-09-18", lapRecord: "1:35.867", trackLength: "4.940 km", laps: 62, lastWinner: { driver: "Lando Norris", team: "McLaren", year: 2025 }, flagEmoji: "🇸🇬" },
  { id: 17, round: 17, circuitName: "Baku City Circuit", grandPrixName: "Azerbaijan GP", location: "Baku", country: "Azerbaijan", lat: 40.3725, lng: 49.8533, date: "Sep 25", fullDate: "2026-09-25", lapRecord: "1:43.009", trackLength: "6.003 km", laps: 51, lastWinner: { driver: "Oscar Piastri", team: "McLaren", year: 2025 }, flagEmoji: "🇦🇿" },
  { id: 18, round: 18, circuitName: "COTA", grandPrixName: "United States GP", location: "Austin", country: "USA", lat: 30.1328, lng: -97.6411, date: "Oct 16", fullDate: "2026-10-16", lapRecord: "1:36.169", trackLength: "5.513 km", laps: 56, lastWinner: { driver: "Charles Leclerc", team: "Ferrari", year: 2025 }, flagEmoji: "🇺🇸" },
  { id: 19, round: 19, circuitName: "Hermanos Rodríguez", grandPrixName: "Mexico City GP", location: "Mexico City", country: "Mexico", lat: 19.4042, lng: -99.0907, date: "Oct 23", fullDate: "2026-10-23", lapRecord: "1:17.774", trackLength: "4.304 km", laps: 71, lastWinner: { driver: "Carlos Sainz", team: "Williams", year: 2025 }, flagEmoji: "🇲🇽" },
  { id: 20, round: 20, circuitName: "Interlagos", grandPrixName: "São Paulo GP", location: "São Paulo", country: "Brazil", lat: -23.7036, lng: -46.6997, date: "Nov 06", fullDate: "2026-11-06", lapRecord: "1:10.540", trackLength: "4.309 km", laps: 71, lastWinner: { driver: "Max Verstappen", team: "Red Bull", year: 2025 }, flagEmoji: "🇧🇷" },
  { id: 21, round: 21, circuitName: "Las Vegas Strip", grandPrixName: "Las Vegas GP", location: "Las Vegas", country: "USA", lat: 36.1147, lng: -115.173, date: "Nov 19", fullDate: "2026-11-19", lapRecord: "1:35.490", trackLength: "6.201 km", laps: 50, lastWinner: { driver: "George Russell", team: "Mercedes", year: 2025 }, flagEmoji: "🇺🇸" },
  { id: 22, round: 22, circuitName: "Lusail", grandPrixName: "Qatar GP", location: "Lusail", country: "Qatar", lat: 25.4888, lng: 51.4542, date: "Nov 27", fullDate: "2026-11-27", lapRecord: "1:24.319", trackLength: "5.419 km", laps: 57, lastWinner: { driver: "Max Verstappen", team: "Red Bull", year: 2025 }, flagEmoji: "🇶🇦" },
  { id: 23, round: 23, circuitName: "Yas Marina", grandPrixName: "Abu Dhabi GP", location: "Abu Dhabi", country: "UAE", lat: 24.4672, lng: 54.6031, date: "Dec 04", fullDate: "2026-12-04", lapRecord: "1:26.103", trackLength: "5.281 km", laps: 58, lastWinner: { driver: "Lando Norris", team: "McLaren", year: 2025 }, flagEmoji: "🇦🇪" }
];

// --- Shaders ---

const ATMOSPHERE_VERTEX = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ATMOSPHERE_FRAGMENT = `
varying vec3 vNormal;
void main() {
  float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
  gl_FragColor = vec4(0.0, 1.0, 0.53, 1.0) * intensity * 1.5;
}
`;

const MARKER_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const MARKER_FRAGMENT = `
varying vec2 vUv;
uniform float time;
uniform vec3 color;
uniform float isSelected;
uniform float isHovered;

void main() {
  float dist = distance(vUv, vec2(0.5));
  float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  
  // 1. Orbiting Ring (Dashed)
  float ringBase = smoothstep(0.28, 0.3, dist) - smoothstep(0.33, 0.35, dist);
  
  // Dash pattern: 12 segments for a proper dashed look
  float dashVal = sin(angle * 12.0 + time * 2.0);
  float dash = smoothstep(0.0, 0.1, dashVal); 
  
  float ring = ringBase * dash;
  
  // 2. Inner Pulse (Core)
  float coreDist = 1.0 - smoothstep(0.0, 0.15, dist);
  
  // 3. Logic
  float activeState = max(isSelected, isHovered);
  
  // Color logic
  vec3 finalColor = color;
  if (isSelected > 0.5) finalColor = vec3(1.0, 0.2, 0.2); // Red
  else if (isHovered > 0.5) finalColor = vec3(1.0, 1.0, 0.5); // Yellow/Gold
  
  // Intensity
  float boost = activeState > 0.5 ? 1.5 : 1.0;
  
  // Ring visibility increases on hover
  float ringAlpha = ring * (0.3 + (activeState * 0.7)); // 0.3 base, 1.0 active

  gl_FragColor = vec4(finalColor * boost, (coreDist * 0.8) + ringAlpha);
}
`;

const CONNECTION_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const CONNECTION_FRAGMENT = `
varying vec2 vUv;
uniform float time;
void main() {
  float dash = sin(vUv.x * 50.0 - time * 5.0);
  float alpha = smoothstep(0.0, 0.5, dash);
  gl_FragColor = vec4(0.0, 1.0, 0.53, alpha * 0.5);
}
`;

// --- Utilities ---

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
}

// --- Main Component ---

export default function F1GlobeVisualization() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedRace, setSelectedRace] = useState<RaceData | null>(null);
  const [hoveredRace, setHoveredRace] = useState<RaceData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState("");

  // Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const markersRef = useRef<THREE.Group | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const isDragging = useRef(false);
  const lastInteractionTime = useRef(Date.now());
  const markerUniforms = useRef<any[]>([]);
  const connectionUniforms = useRef<any>({ time: { value: 0 } });

  // --- Clock & Countdown ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Find next race
      const nextRace = RACES.find(r => new Date(r.fullDate) > now) || RACES[0];
      const diff = new Date(nextRace.fullDate).getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown(`${days}d ${hours}h ${mins}m`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Three.js Setup ---
  useLayoutEffect(() => {
    if (!mountRef.current) return;

    // Reset uniforms array to prevent duplication in Strict Mode
    markerUniforms.current = [];

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#050816');
    scene.fog = new THREE.FogExp2(0x050816, 0.0012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 60, 240);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 120;
    controls.maxDistance = 500;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controlsRef.current = controls;

    controls.addEventListener('start', () => { isDragging.current = true; lastInteractionTime.current = Date.now(); });
    controls.addEventListener('end', () => { isDragging.current = false; lastInteractionTime.current = Date.now(); });

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(150, 50, 150);
    scene.add(sunLight);
    const blueLight = new THREE.PointLight(0x0088ff, 1.5, 300);
    blueLight.position.set(-100, 100, -100);
    scene.add(blueLight);

    // 6. Globe
    const globeRadius = 80;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const earthSpec = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
    const earthNormal = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      specularMap: earthSpec,
      normalMap: earthNormal,
      specular: new THREE.Color(0x333333),
      shininess: 15
    });
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globe);
    globeRef.current = globe;

    // Atmosphere
    const atmoGeo = new THREE.SphereGeometry(globeRadius + 2, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: ATMOSPHERE_VERTEX,
      fragmentShader: ATMOSPHERE_FRAGMENT,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmosphere);

    // 7. Markers & Connections
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersRef.current = markersGroup;

    // Connection Lines (Calendar Path)
    const points: THREE.Vector3[] = [];
    RACES.forEach(race => {
      points.push(latLngToVector3(race.lat, race.lng, globeRadius + 0.2));
    });
    
    // Create curve from points
    const curve = new THREE.CatmullRomCurve3(points, true); // Closed loop for calendar year? Or open? Let's do open.
    const curvePoints = curve.getPoints(200);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    
    // Custom shader for flowing electricity line
    const lineMat = new THREE.ShaderMaterial({
      vertexShader: CONNECTION_VERTEX,
      fragmentShader: CONNECTION_FRAGMENT,
      uniforms: connectionUniforms.current,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    // We need UVs for the line shader to animate flow
    // BufferGeometry from points doesn't have UVs by default for lines in the way we need for flow along length
    // Simpler approach for line flow: Dashed line with offset animation?
    // Or TubeGeometry? Tube is better for UVs.
    const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.3, 8, false);
    const connectionLine = new THREE.Mesh(tubeGeo, lineMat);
    globeGroup.add(connectionLine);

    // Markers
    RACES.forEach((race, index) => {
      const pos = latLngToVector3(race.lat, race.lng, globeRadius);
      
      const markerWrapper = new THREE.Group();
      markerWrapper.position.copy(pos);
      markerWrapper.lookAt(new THREE.Vector3(0,0,0));
      markerWrapper.userData = { raceId: race.id };
      
      // Shader Plane for Pulse/Ring
      const planeGeo = new THREE.PlaneGeometry(8, 8);
      const uniform = { 
        time: { value: Math.random() * 10 }, 
        color: { value: new THREE.Color(0x00FF88) },
        isSelected: { value: 0.0 },
        isHovered: { value: 0.0 }
      };
      markerUniforms.current.push(uniform);
      
      const planeMat = new THREE.ShaderMaterial({
        vertexShader: MARKER_VERTEX,
        fragmentShader: MARKER_FRAGMENT,
        uniforms: uniform,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.position.z = 0.5;
      markerWrapper.add(plane);

      // Core Dot
      const coreGeo = new THREE.SphereGeometry(0.5, 8, 8);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      markerWrapper.add(core);

      markersGroup.add(markerWrapper);
    });

    // 8. Hover Particles (Removed)
    // const particlesGeo = new THREE.BufferGeometry();
    // ...
    // scene.add(particles);
    // particlesRef.current = particles;

    // 9. Starfield
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 4000;
    const sPos = new Float32Array(starsCount * 3);
    const sSizes = new Float32Array(starsCount);
    for(let i=0; i<starsCount; i++) {
      const r = 300 + Math.random() * 600;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      sPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      sPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      sPos[i*3+2] = r * Math.cos(phi);
      sSizes[i] = Math.random() * 2;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starsGeo.setAttribute('size', new THREE.BufferAttribute(sSizes, 1));
    const starsMat = new THREE.PointsMaterial({ size: 1, color: 0xffffff, transparent: true, opacity: 0.6, sizeAttenuation: true });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 10. Animation Loop
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Update Uniforms
      markerUniforms.current.forEach((u, i) => {
        u.time.value = elapsed + i * 0.1;
      });
      connectionUniforms.current.time.value = elapsed;

      // Particles Orbit (Removed)
      // if (particlesRef.current && particlesRef.current.visible) {
      //   particlesRef.current.rotation.y = elapsed * 0.5;
      //   particlesRef.current.rotation.z = elapsed * 0.2;
      // }

      // Auto Rotate
      if (!isDragging.current && !selectedRace && Date.now() - lastInteractionTime.current > 3000) {
        controls.autoRotate = true;
      } else {
        controls.autoRotate = false;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Intro Sequence
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(camera.position, { y: 600, z: 600, duration: 3, ease: "power4.out" })
        .from(globe.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "back.out(1.2)" }, "-=2.5")
        .from(markersGroup.children.map(c => c.scale), { x: 0, y: 0, z: 0, duration: 0.5, stagger: 0.02, ease: "back.out(2)" }, "-=1")
        .to(connectionLine.material, { opacity: 1, duration: 1 }, "-=0.5");
    });

    setIsLoading(false);

    // Event Listeners
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(markersGroup.children, true);
      
      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== markersGroup) obj = obj.parent;
        const race = RACES.find(r => r.id === obj.userData.raceId);
        
        if (race) {
          if (hoveredRace?.id !== race.id) {
            setHoveredRace(race);
            
            // Update Uniforms
            const index = RACES.findIndex(r => r.id === race.id);
            if (index !== -1) {
              markerUniforms.current.forEach((u, i) => {
                u.isHovered.value = i === index ? 1.0 : 0.0;
              });
            }
          }
        }
      } else {
        document.body.style.cursor = 'default';
        if (hoveredRace) {
          setHoveredRace(null);
          // Reset Uniforms
          markerUniforms.current.forEach(u => u.isHovered.value = 0.0);
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      if (isDragging.current) return;
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(markersGroup.children, true);
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== markersGroup) obj = obj.parent;
        const race = RACES.find(r => r.id === obj.userData.raceId);
        if (race) handleRaceSelect(race);
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      ctx.revert();
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // --- Handlers ---

  const handleRaceSelect = (race: RaceData) => {
    setSelectedRace(race);
    setIsPanelOpen(true);
    lastInteractionTime.current = Date.now();
    
    // Update Uniforms for Selection
    markerUniforms.current.forEach((u, i) => {
      u.isSelected.value = RACES[i].id === race.id ? 1.0 : 0.0;
    });

    // Animate Camera
    if (cameraRef.current && controlsRef.current) {
      const targetPos = latLngToVector3(race.lat, race.lng, 200);
      gsap.to(cameraRef.current.position, {
        x: targetPos.x, y: targetPos.y, z: targetPos.z,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => controlsRef.current?.update()
      });
    }
  };

  const handleClose = () => {
    setIsPanelOpen(false);
    setSelectedRace(null);
    markerUniforms.current.forEach(u => u.isSelected.value = 0.0);
    
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, { x: 0, y: 60, z: 240, duration: 1.5, ease: "power2.inOut" });
    }
  };

  // --- Render ---

  return (
    <div className="relative w-full h-screen bg-[#050816] overflow-hidden font-sans text-white">
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* Noise & Scanlines */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}} />
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{backgroundSize: "100% 2px, 3px 100%"}} />

      {/* Header HUD */}
      <div className="absolute top-0 w-full p-6 z-20 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-5xl font-bold tracking-tighter flex items-center gap-3">
            F1 <span className="text-[#00FF88] drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">2026</span>
          </h1>
          <div className="flex items-center gap-3 text-xs font-mono text-[#00FF88] opacity-80 mt-2 tracking-[0.2em]">
            <Activity size={14} className="animate-pulse" />
            <span>GLOBAL TELEMETRY ACTIVE</span>
          </div>
        </div>
        <div className="text-right pointer-events-auto flex flex-col items-end">
          <div className="text-3xl font-mono font-bold tabular-nums tracking-tight">
            {currentTime.toLocaleTimeString('en-US', {hour12:false})}
          </div>
          <div className="text-xs text-gray-400 font-mono mb-2">UTC SYSTEM TIME</div>
          <div className="flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/30 px-3 py-1 rounded-full">
            <Clock size={12} className="text-[#00FF88]" />
            <span className="text-xs font-mono text-[#00FF88]">NEXT RACE: {countdown}</span>
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredRace && !isPanelOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 z-30 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-xl border border-[#00FF88]/50 p-4 rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.15)] text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-[#00FF88] text-xs font-mono font-bold uppercase mb-1 tracking-widest">{hoveredRace.flagEmoji} {hoveredRace.country}</div>
            <div className="text-white font-bold text-xl whitespace-nowrap">{hoveredRace.circuitName}</div>
            <div className="text-gray-400 text-xs font-mono mt-1">{hoveredRace.date}</div>
          </div>
        </div>
      )}

      {/* Side Panel */}
      <div className={`absolute top-0 right-0 h-full w-full md:w-[500px] bg-[#050816]/95 backdrop-blur-2xl border-l border-[#00FF88]/20 z-40 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} shadow-[-20px_0_50px_rgba(0,0,0,0.5)]`}>
        {selectedRace && (
          <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar relative">
            {/* Background Grid for Panel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'linear-gradient(#00FF88 1px, transparent 1px), linear-gradient(90deg, #00FF88 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

            <button onClick={handleClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-50 group">
              <X size={24} className="text-gray-400 group-hover:text-[#FF1744] transition-colors" />
            </button>
            
            <div className="mt-12 mb-8 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl filter drop-shadow-lg">{selectedRace.flagEmoji}</span>
                <div className="flex flex-col">
                  <span className="text-[#00FF88] font-mono text-sm font-bold tracking-widest border border-[#00FF88]/30 px-2 py-0.5 rounded bg-[#00FF88]/5 w-fit mb-1">ROUND {selectedRace.round}</span>
                  <span className="text-white text-lg font-bold">{selectedRace.fullDate}</span>
                </div>
              </div>
              <h2 className="text-5xl font-bold leading-none mb-2 tracking-tight">{selectedRace.location.toUpperCase()}</h2>
              <h3 className="text-2xl text-gray-400 font-light">{selectedRace.grandPrixName}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              {[
                { icon: MapPin, label: "LENGTH", value: selectedRace.trackLength },
                { icon: Clock, label: "RECORD", value: selectedRace.lapRecord },
                { icon: Wind, label: "LAPS", value: selectedRace.laps },
                { icon: Zap, label: "ZONES", value: "2 DRS" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#00FF88]/30 transition-colors group">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-2 group-hover:text-[#00FF88] transition-colors">
                    <stat.icon size={12}/> {stat.label}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="mb-8 relative z-10">
              <div className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-widest">Previous Winner (2025)</div>
              <div className="flex items-center justify-between bg-gradient-to-r from-[#00FF88]/10 to-transparent p-5 rounded-xl border-l-4 border-[#00FF88]">
                <div>
                  <div className="font-bold text-xl">{selectedRace.lastWinner.driver}</div>
                  <div className="text-sm text-gray-400">{selectedRace.lastWinner.team}</div>
                </div>
                <Trophy className="text-[#00FF88] drop-shadow-[0_0_10px_rgba(0,255,136,0.6)]" size={32} />
              </div>
            </div>

            <button className="mt-auto w-full py-5 bg-[#00FF88] text-[#050816] font-bold font-mono uppercase tracking-widest hover:bg-[#00CC6A] transition-all flex items-center justify-center gap-2 group relative overflow-hidden rounded-lg">
              <span className="relative z-10 flex items-center gap-2">View Full Analysis <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/></span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Timeline */}
      <div className="absolute bottom-0 left-0 w-full z-30 p-6 pointer-events-none">
        <div className="flex gap-4 overflow-x-auto pb-6 pointer-events-auto no-scrollbar mask-gradient-right snap-x px-[50vw]">
          {RACES.map(race => (
            <button 
              key={race.id}
              onClick={() => handleRaceSelect(race)}
              className={`flex-shrink-0 w-64 p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 snap-center text-left group relative overflow-hidden
                ${selectedRace?.id === race.id 
                  ? 'bg-[#00FF88]/10 border-[#00FF88] shadow-[0_0_30px_rgba(0,255,136,0.15)] scale-105' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 hover:scale-105'}
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-3xl">{race.flagEmoji}</span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${selectedRace?.id === race.id ? 'bg-[#00FF88] text-black' : 'bg-white/10 text-gray-400'}`}>R{race.round}</span>
              </div>
              <div className={`font-bold text-lg truncate ${selectedRace?.id === race.id ? 'text-[#00FF88]' : 'text-white group-hover:text-[#00FF88] transition-colors'}`}>
                {race.location}
              </div>
              <div className="text-xs text-gray-500 font-mono mt-1">{race.date}</div>
              
              {/* Active Indicator Line */}
              {selectedRace?.id === race.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00FF88] animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
