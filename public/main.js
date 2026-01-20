import { ARButton } from "https://unpkg.com/three@0.150.1/examples/jsm/webxr/ARButton.js";

let scene, camera, renderer, arrow;
let userLat = null, userLon = null;

// Scene
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera();

// Renderer
renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// AR Button
document.body.appendChild(ARButton.createButton(renderer));

// Arrow
const geometry = new THREE.ConeGeometry(0.12, 0.35, 32);
const material = new THREE.MeshNormalMaterial();
arrow = new THREE.Mesh(geometry, material);
arrow.position.set(0, 0, -1);
arrow.rotation.x = Math.PI / 2;
scene.add(arrow);

// GPS
navigator.geolocation.watchPosition(
  (pos) => {
    userLat = pos.coords.latitude;
    userLon = pos.coords.longitude;
  },
  () => alert("Enable location"),
  { enableHighAccuracy: true }
);

// Destination (example)
const destLat = 13.0213;
const destLon = 80.2231;

// Bearing calculation
function getBearing(lat1, lon1, lat2, lon2) {
  const toRad = d => d * Math.PI / 180;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.cos(toRad(lon2 - lon1));
  return Math.atan2(y, x);
}

// Render loop
renderer.setAnimationLoop(() => {
  if (userLat && userLon) {
    const bearing = getBearing(userLat, userLon, destLat, destLon);
    arrow.rotation.z = -bearing;
  }
  renderer.render(scene, camera);
});
