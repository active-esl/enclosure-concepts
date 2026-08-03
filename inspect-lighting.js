/**
 * Shared Inspect studio lighting for Active-ESL concept pages.
 * One SoT — imported by handheld-eth and handheld (slim) assembly.html.
 *
 * Diffuse-first (Alex 2026-08-03): soft IBL + ambient/hemi wrap, muted key/rim
 * so translucent shells don't read as hard specular wireframe rims.
 */
export const INSPECT_LIGHTING = {
  /**
   * RoomEnvironment PMREM blur. Prior sharp studio used 0.04 (hard specular).
   * Keep ≤~0.12 — larger sigmaRadians clips the PMREM sample budget and darkens IBL.
   */
  roomEnvBlur: 0.06,
  toneMappingExposure: 1.3,
  ambient: { color: 0xc8d4e6, intensity: 3.4 },
  hemi: { sky: 0xe8eef8, ground: 0x243044, intensity: 2.0 },
  // Softer than prior key 4.87 / rim 3.77 — still enough to read translucent shells.
  key: { color: 0xfff1e0, intensity: 2.9 },
  fill: { color: 0xd4e4ff, intensity: 2.9 },
  rim: { color: 0xeef3ff, intensity: 1.4, position: [-0.2, 0.4, -0.85] },
  top: { color: 0xffffff, intensity: 1.8, position: [0.1, 1.1, 0.15] },
  worldKey: { color: 0xfff6ee, intensity: 1.9, position: [0.5, 0.75, 0.85] },
  keyOffset: [0.35, 0.5, 1.0],
  fillOffset: [-0.7, 0.25, 0.55],
};

/**
 * Soft IBL + exposure. Call once after creating the renderer/scene.
 * @returns {THREE.PMREMGenerator}
 */
export function applyInspectEnvironment(THREE, scene, renderer, RoomEnvironment) {
  const L = INSPECT_LIGHTING;
  renderer.toneMappingExposure = L.toneMappingExposure;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(
    new RoomEnvironment(),
    L.roomEnvBlur,
  ).texture;
  return pmrem;
}

/**
 * Diffuse studio rig. Camera-follow key/fill; fixed rim/top/worldKey.
 * @returns {{ key, fill, rim, top, worldKey, hemi, updateCameraLights }}
 */
export function createInspectLights(THREE, scene) {
  const L = INSPECT_LIGHTING;

  scene.add(new THREE.AmbientLight(L.ambient.color, L.ambient.intensity));
  const hemi = new THREE.HemisphereLight(L.hemi.sky, L.hemi.ground, L.hemi.intensity);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(L.key.color, L.key.intensity);
  scene.add(key);
  scene.add(key.target);

  const fill = new THREE.DirectionalLight(L.fill.color, L.fill.intensity);
  scene.add(fill);
  scene.add(fill.target);

  const rim = new THREE.DirectionalLight(L.rim.color, L.rim.intensity);
  rim.position.set(...L.rim.position);
  scene.add(rim);

  const top = new THREE.DirectionalLight(L.top.color, L.top.intensity);
  top.position.set(...L.top.position);
  scene.add(top);

  const worldKey = new THREE.DirectionalLight(L.worldKey.color, L.worldKey.intensity);
  worldKey.position.set(...L.worldKey.position);
  scene.add(worldKey);

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

  return { key, fill, rim, top, worldKey, hemi, updateCameraLights };
}
