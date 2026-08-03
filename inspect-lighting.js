/**
 * Shared Inspect studio lighting for Active-ESL concept pages.
 */
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const INSPECT_LIGHTING = {
  envBlur: 0.04,
  toneMappingExposure: 1.2,
  ambient: { color: 0xc8d4e6, intensity: 2.1 },
  hemi: { sky: 0xe8eef8, ground: 0x243044, intensity: 0 },
  key: { color: 0xfff1e0, intensity: 4.87 },
  fill: { color: 0xd4e4ff, intensity: 1.73 },
  rim: { color: 0xeef3ff, intensity: 3.77, position: [-0.2, 0.4, -0.85] },
  top: { color: 0xffffff, intensity: 1.41, position: [0.1, 1.1, 0.15] },
  worldKey: { color: 0xfff6ee, intensity: 2.98, position: [0.5, 0.75, 0.85] },
  keyOffset: [0.35, 0.5, 1.0],
  fillOffset: [-0.7, 0.1, 0.5],
};

export function applyInspectEnvironment(THREE, scene, renderer) {
  const L = INSPECT_LIGHTING;
  renderer.toneMappingExposure = L.toneMappingExposure;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), L.envBlur).texture;
  return pmrem;
}

export function createInspectLights(THREE, scene) {
  const L = INSPECT_LIGHTING;
  scene.add(new THREE.AmbientLight(L.ambient.color, L.ambient.intensity));
  // hemi intensity 0 = omitted (matches last-known-good)
  const key = new THREE.DirectionalLight(L.key.color, L.key.intensity);
  scene.add(key); scene.add(key.target);
  const fill = new THREE.DirectionalLight(L.fill.color, L.fill.intensity);
  scene.add(fill); scene.add(fill.target);
  const rim = new THREE.DirectionalLight(L.rim.color, L.rim.intensity);
  rim.position.set(...L.rim.position); scene.add(rim);
  const top = new THREE.DirectionalLight(L.top.color, L.top.intensity);
  top.position.set(...L.top.position); scene.add(top);
  const worldKey = new THREE.DirectionalLight(L.worldKey.color, L.worldKey.intensity);
  worldKey.position.set(...L.worldKey.position); scene.add(worldKey);
  const _keyOff = new THREE.Vector3();
  const _fillOff = new THREE.Vector3();
  function updateCameraLights(camera, target) {
    _keyOff.set(...L.keyOffset).normalize().multiplyScalar(1.0);
    _keyOff.applyQuaternion(camera.quaternion);
    key.position.copy(camera.position).add(_keyOff);
    key.target.position.copy(target);
    key.target.updateMatrixWorld();
    _fillOff.set(...L.fillOffset).normalize().multiplyScalar(0.95);
    _fillOff.applyQuaternion(camera.quaternion);
    fill.position.copy(camera.position).add(_fillOff);
    fill.target.position.copy(target);
    fill.target.updateMatrixWorld();
  }
  return { key, fill, rim, top, worldKey, hemi: null, updateCameraLights };
}
