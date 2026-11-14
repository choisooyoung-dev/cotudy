// The logistics center floor: walls, areas, furniture, signs and collision boxes.
// Coordinates: x = left→right, z = back→front, 1 unit ≈ 1 m. Back walls are at z = Z0 and x = X0.
import * as THREE from 'three';
import { box, cyl, textPlane, floorMaterial, carton, canvasTexture, drawText } from './builders.js';
import { tr } from '../i18n.js';

export const X0 = -32, X1 = 32, Z0 = -22, Z1 = 22;

/** Areas. `rect` = [x0, z0, x1, z1]. Locked areas get tape + a collider over `lockRect`. */
export const ZONES = {
  office:    { name: tr('사무실', 'Office'),            rect: [X0, 9, -14, Z1] },
  receiving: { name: tr('화장품 입고장', 'Cosmetics receiving'),      rect: [X0, Z0, -12, -6], lockRect: [X0, Z0, -11.9, -5.6] },
  printing:  { name: tr('주문 출력실', 'Order printing'),        rect: [X0, -4, -15, 5], lockRect: [X0, -4.3, -14.7, 5.3] },
  picking:   { name: tr('피킹', 'Picking'),              rect: [-10, Z0, 10, -6.2], lockRect: [-10.2, Z0, 10, -6] },
  packing:   { name: tr('패킹', 'Packing'),              rect: [12, -6, X1, 5.8], lockRect: [11.8, Z0, X1, 6] },
  shipping:  { name: tr('출고장 · 택배 상차장', 'Shipping · Courier loading'), rect: [12, Z0, X1, -6], lockRect: [11.8, Z0, X1, 6] },
  rest:      { name: tr('휴게실', 'Break room'),            rect: [13, 9, X1, Z1] },
};

export function buildCenter(scene) {
  const colliders = [];
  const solid = (x0, z0, x1, z1) => colliders.push({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1) });
  const S = scene;
  // places where people can sit down for a while: { x, z, rot } (rot = which way they face)
  const seats = [];

  // ---- shell ----
  const floor = (kind, x0, z0, x1, z1, y = 0) => {
    const w = x1 - x0, d = z1 - z0;
    box(S, w, 0.2, d, null, (x0 + x1) / 2, -0.1 + y, (z0 + z1) / 2, { mat: floorMaterial(kind, w, d), cast: false });
  };
  floor('concrete', X0, Z0, X1, Z1);
  box(S, X1 - X0 + 0.6, 6, 0.6, '#d7dce2', 0, 3, Z0 - 0.3);
  box(S, 0.6, 6, Z1 - Z0, '#d7dce2', X0 - 0.3, 3, 0);
  for (let y = 1; y < 6; y += 1.2) {
    box(S, X1 - X0, 0.05, 0.02, '#bcc3cb', 0, y, Z0 + 0.01, { cast: false });
    box(S, 0.02, 0.05, Z1 - Z0, '#bcc3cb', X0 + 0.01, y, 0, { cast: false });
  }
  box(S, X1 - X0 + 0.6, 0.5, 0.7, '#5b6472', 0, 6.1, Z0 - 0.3);
  box(S, 0.7, 0.5, Z1 - Z0, '#5b6472', X0 - 0.3, 6.1, 0);
  // outer bounds (front/right edges are open to the camera but you can't walk off)
  solid(X0 - 5, Z0 - 5, X1 + 5, Z0 + 0.2); solid(X0 - 5, Z0, X0 + 0.2, Z1 + 5);
  solid(X1 - 0.2, Z0, X1 + 5, Z1 + 5); solid(X0, Z1 - 0.2, X1, Z1 + 5);
  // windows (left wall, office)
  for (const z of [12, 17]) { box(S, 0.1, 1.6, 3, '#a9d6f0', X0 + 0.02, 3.6, z, { cast: false }); box(S, 0.12, 0.12, 3.1, '#7b8794', X0 + 0.03, 3.6, z, { cast: false }); }

  // shutters on the back wall (open ones show a delivery truck)
  const shutter = (x, open) => {
    if (open) {
      box(S, 5, 4.2, 0.1, '#2a2e36', x, 2.1, Z0 + 0.05, { cast: false });
      box(S, 4.4, 3.6, 0.4, '#f4f4f4', x, 2, Z0 + 0.3);
      textPlane(S, tr('번개택배', 'LIGHTNING'), 3.6, 0.8, '#f4f4f4', '#e2523f').position.set(x, 3, Z0 + 0.52);
    } else {
      box(S, 5, 4.2, 0.12, '#a3adb8', x, 2.1, Z0 + 0.06);
      for (let y = 0.3; y < 4.2; y += 0.3) box(S, 5, 0.04, 0.14, '#8b96a2', x, y, Z0 + 0.07, { cast: false });
    }
    box(S, 5.6, 0.4, 0.3, '#f2c230', x, 4.4, Z0 + 0.15);
    box(S, 5.8, 0.3, 1.4, '#333a44', x, 0.15, Z0 + 0.7, { cast: false });
    solid(x - 2.9, Z0, x + 2.9, Z0 + 1.4);
  };
  shutter(-26, true); shutter(-19, false); shutter(19, false); shutter(26, true);

  const wallSign = (text, w, h, bg, fg, pos, onLeft, o = {}) => {
    const p = textPlane(S, text, w, h, bg, fg, o);
    if (onLeft) { p.position.set(X0 + 0.03, pos[1], pos[0]); p.rotation.y = Math.PI / 2; }
    else p.position.set(pos[0], pos[1], Z0 + 0.03);
  };
  wallSign(tr('안전제일', 'SAFETY FIRST'), 3.2, 1.1, '#1f8a4c', '#fff', [-10, 4.4], false, { fs: 44, border: '#fff' });
  wallSign(tr('지게차 통행 주의', 'FORKLIFT CROSSING'), 4.4, 0.9, '#ffcc00', '#222', [-22.5, 5.2], false, { fs: 34, border: '#222' });
  wallSign(tr('입고 IN', 'INBOUND'), 2.6, 0.8, '#2f6fd6', '#fff', [-26, 5.25], false, { fs: 36 });
  wallSign(tr('출고 OUT', 'OUTBOUND'), 2.8, 0.8, '#e2523f', '#fff', [26, 5.25], false, { fs: 36 });
  wallSign(tr('적재 높이 1.5m 이하', 'MAX STACK 1.5m'), 4.2, 0.8, '#fff', '#c0392b', [4, 4.6], false, { fs: 30, border: '#c0392b' });
  wallSign(tr('보행자 통로', 'WALKWAY'), 3, 0.8, '#2c3e50', '#fff', [7, 4.6], true, { fs: 32 });

  // wall clock: real current time, redrawn every minute
  const clockCanvas = document.createElement('canvas');
  clockCanvas.width = 160; clockCanvas.height = 72;
  const clockTex = new THREE.CanvasTexture(clockCanvas);
  clockTex.colorSpace = THREE.SRGBColorSpace;
  const clock = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.1), new THREE.MeshBasicMaterial({ map: clockTex }));
  clock.position.set(12, 4.6, Z0 + 0.03);
  S.add(clock);
  const drawClock = () => {
    const g = clockCanvas.getContext('2d');
    g.fillStyle = '#1b1f27'; g.fillRect(0, 0, 160, 72);
    g.strokeStyle = '#555'; g.lineWidth = 6; g.strokeRect(3, 3, 154, 66);
    const d = new Date();
    drawText(g, `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`, 160, 72, '#ff5a4f', 44);
    clockTex.needsUpdate = true;
  };
  drawClock();
  setInterval(drawClock, 15000);

  // ---- floor markings ----
  const line = (x0, z0, x1, z1, c = '#f2c230', wd = 0.18) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const m = box(S, len, 0.03, wd, c, (x0 + x1) / 2, 0.04, (z0 + z1) / 2, { cast: false });
    m.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
  };
  line(X0, 6.5, X1, 6.5); line(X0, 8.5, X1, 8.5);
  line(-12, Z0, -12, 6.5); line(-10, Z0, -10, 6.5); line(10, Z0, 10, 6.5); line(12, Z0, 12, 6.5);
  for (let x = X0 + 1; x < X1; x += 2.4) box(S, 0.9, 0.03, 1.6, '#f4f4f4', x, 0.05, 7.5, { cast: false });
  const floorLabel = (text, x, z, w = 6, c = '#f2c230') => {
    const p = textPlane(S, text, w, 1, null, c, { fs: 40 });
    p.rotation.x = -Math.PI / 2; p.position.set(x, 0.06, z);
  };
  floorLabel(tr('① 화장품 입고장', '① Cosmetics receiving'), -21, -7.2, 7);
  floorLabel(tr('③ 피킹', '③ Picking'), 0, -7.4, 5);
  floorLabel(tr('⑥ 출고장 · 택배 상차장', '⑥ Shipping · Loading'), 21, -7.4, 9);
  floorLabel(tr('④ 패킹', '④ Packing'), 18, 4.8, 5);
  floorLabel(tr('⑦ 휴게실', '⑦ Break room'), 25, 10, 5, '#5b6472');

  // ---- 입고장 ----
  const pallet = (x, z, lv = 2) => {
    box(S, 2.2, 0.25, 2.2, '#b08455', x, 0.125, z);
    for (let l = 0; l < lv; l++) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) carton(S, x - 0.5 + i, 0.25 + l * 0.62, z - 0.5 + j, 0.8);
    solid(x - 1.2, z - 1.2, x + 1.2, z + 1.2);
  };
  pallet(-27, -16.5, 2); pallet(-24, -16.5, 3); pallet(-27, -12.5, 1); pallet(-20.5, -12.5, 2); pallet(-16, -17, 2);
  box(S, 0.6, 1, 0.6, '#555', -17, 0.5, -10); box(S, 0.8, 0.4, 0.6, '#2d3436', -17, 1.2, -10); solid(-17.4, -10.4, -16.6, -9.6);

  // ---- 피킹 racks ----
  const rack = (x, z, len = 8) => {
    for (let k = 0; k <= len; k += len / 4) { box(S, 0.15, 4, 0.15, '#2f6fd6', x + k - len / 2, 2, z - 0.7); box(S, 0.15, 4, 0.15, '#2f6fd6', x + k - len / 2, 2, z + 0.7); }
    for (let l = 0; l < 4; l++) {
      box(S, len, 0.1, 1.5, '#f28c28', x, 0.3 + l * 1.15, z);
      for (let i = 0; i < len / 0.9 - 1; i++) if ((i * 3 + l * 5 + Math.round(z)) % 4 !== 0) carton(S, x - len / 2 + 0.6 + i * 0.9, 0.35 + l * 1.15, z, 0.65);
    }
    solid(x - len / 2 - 0.1, z - 0.8, x + len / 2 + 0.1, z + 0.8);
  };
  rack(0, -18.5); rack(0, -14.5); rack(0, -10.5);

  // ---- 출고장 ----
  const rolltainer = (x, z) => {
    box(S, 1.2, 0.12, 0.9, '#888', x, 0.2, z);
    box(S, 0.05, 1.8, 0.9, '#aab', x - 0.6, 1.1, z); box(S, 0.05, 1.8, 0.9, '#aab', x + 0.6, 1.1, z);
    box(S, 1.2, 1.8, 0.05, '#aab', x, 1.1, z - 0.45);
    for (let l = 0; l < 2; l++) for (let i = 0; i < 2; i++) carton(S, x - 0.3 + i * 0.6, 0.26 + l * 0.6, z, 0.55);
    solid(x - 0.7, z - 0.5, x + 0.7, z + 0.5);
  };
  rolltainer(16, -16); rolltainer(18, -16); rolltainer(16, -12); rolltainer(21, -12);
  box(S, 0.9, 0.7, 13, '#4b5563', 28, 0.35, -1);
  for (let z = -7; z < 5.5; z += 0.5) box(S, 0.95, 0.06, 0.3, '#6b7280', 28, 0.72, z, { cast: false });
  [-5, -1.5, 2].forEach((z) => carton(S, 28, 0.75, z, 0.6));
  solid(27.5, -7.5, 28.5, 5.5);

  // ---- 패킹 ----
  const packTable = (x, z) => {
    box(S, 3, 0.12, 1.4, '#e9e4d8', x, 1, z);
    [[-1.4, -0.6], [1.4, -0.6], [-1.4, 0.6], [1.4, 0.6]].forEach(([a, b]) => box(S, 0.1, 1, 0.1, '#666', x + a, 0.5, z + b));
    carton(S, x - 0.8, 1.06, z, 0.6);
    cyl(S, 0.18, 0.18, 0.12, '#c8a46a', x + 0.4, 1.12, z + 0.3);
    cyl(S, 0.35, 0.35, 0.9, '#dff3ff', x + 1.1, 1.5, z - 0.2, { rz: Math.PI / 2 });
    solid(x - 1.5, z - 0.7, x + 1.5, z + 0.7);
  };
  packTable(16, 1); packTable(21, 1); packTable(16, -3.5); packTable(21, -3.5);

  // ---- glass rooms ----
  // Glass walls are only for looks: they have no collider, so you can walk through them
  // (they were hard to see and got in the way, 2026-11-12).
  const glassMat = new THREE.MeshLambertMaterial({ color: '#bfe3ff', transparent: true, opacity: 0.22 });
  /** wall from (a,b) to (c,d), axis aligned, with optional door gap [from, to] along the wall. */
  const glassWall = (a, b, c, d, door) => {
    const horiz = b === d;
    const lo = horiz ? Math.min(a, c) : Math.min(b, d);
    const hi = horiz ? Math.max(a, c) : Math.max(b, d);
    const segs = door ? [[lo, door[0]], [door[1], hi]] : [[lo, hi]];
    for (const [s0, s1] of segs) {
      if (s1 - s0 < 0.05) continue;
      const len = s1 - s0, mid = (s0 + s1) / 2;
      const m = new THREE.Mesh(new THREE.BoxGeometry(horiz ? len : 0.08, 2.6, horiz ? 0.08 : len), glassMat);
      m.position.set(horiz ? mid : a, 1.3, horiz ? b : mid);
      S.add(m);
      box(S, horiz ? len : 0.12, 0.1, horiz ? 0.12 : len, '#7b8794', horiz ? mid : a, 2.6, horiz ? b : mid, { cast: false });
    }
  };
  // 주문 출력실
  floor('epoxy', X0, -4, -15, 5, 0.02);
  glassWall(X0, -4, -15, -4); glassWall(-15, -4, -15, 5, [0, 2.2]); glassWall(X0, 5, -15, 5);
  const printer = (x, z) => { box(S, 1, 0.9, 0.8, '#eceff1', x, 0.45, z); box(S, 1, 0.2, 0.6, '#cfd8dc', x, 1, z); box(S, 0.7, 0.02, 0.5, '#fff', x, 1.12, z + 0.1, { cast: false }); solid(x - 0.5, z - 0.4, x + 0.5, z + 0.4); };
  printer(-30, -2.8); printer(-28.4, -2.8); printer(-26.8, -2.8);
  const desk = (x, z, mon = 2) => {
    box(S, 2.2, 0.1, 1.1, '#d9b98c', x, 0.95, z);
    box(S, 0.08, 0.9, 1, '#b9986b', x - 1.05, 0.45, z); box(S, 0.08, 0.9, 1, '#b9986b', x + 1.05, 0.45, z);
    for (let i = 0; i < mon; i++) { box(S, 0.8, 0.5, 0.06, '#20242c', x + (i - (mon - 1) / 2) * 0.85, 1.4, z - 0.35); box(S, 0.08, 0.3, 0.08, '#555', x + (i - (mon - 1) / 2) * 0.85, 1.1, z - 0.35); }
    box(S, 0.7, 0.03, 0.25, '#ddd', x, 1.02, z + 0.1);
    box(S, 0.6, 0.08, 0.6, '#e17055', x, 0.55, z + 0.85); box(S, 0.6, 0.6, 0.08, '#e17055', x, 0.85, z + 1.15);
    seats.push({ x, z: z + 0.85, rot: Math.PI });
    solid(x - 1.1, z - 0.55, x + 1.1, z + 0.55);
  };
  desk(-22, -1.5); desk(-22, 2.5);
  const wb = textPlane(S, tr('오늘 출고 마감\n15:00', 'Shipping cutoff\n15:00'), 2.4, 1.4, '#ffffff', '#2c3e50', { fs: 30, border: '#95a5a6' });
  wb.position.set(X0 + 0.05, 1.9, 1.5); wb.rotation.y = Math.PI / 2;

  // 사무실
  floor('wood', X0, 9, -14, Z1, 0.02);
  glassWall(X0, 9, -14, 9, [-21, -18.6]); glassWall(-14, 9, -14, Z1, [12, 14.4]);
  desk(-28, 12.5); desk(-24, 12.5); desk(-28, 17.5); desk(-20, 17.5);
  const plant = (x, z, s = 1) => {
    cyl(S, 0.3 * s, 0.25 * s, 0.5 * s, '#c97b4a', x, 0.25 * s, z);
    for (let i = 0; i < 5; i++) { const m = box(S, 0.12 * s, 1 * s, 0.3 * s, '#3f9b4b', x, 0.9 * s, z); m.rotation.y = i * 1.2; m.rotation.z = 0.3; }
    solid(x - 0.35 * s, z - 0.35 * s, x + 0.35 * s, z + 0.35 * s);
  };
  plant(-15.2, 10.2); plant(-31, 21); plant(-15.5, 21);
  box(S, 0.4, 1.4, 0.3, '#34495e', -16.5, 0.7, 10); solid(-16.7, 9.85, -16.3, 10.15);
  textPlane(S, tr('출근 09:00', 'IN 09:00'), 0.36, 0.2, '#2ecc71', '#fff', { fs: 9 }).position.set(-16.5, 1.15, 10.16);

  // 휴게실
  floor('tile', 13, 9, X1, Z1, 0.02);
  box(S, 4, 0.6, 1.4, '#e7837a', 26, 0.3, 20); box(S, 4, 0.9, 0.4, '#e7837a', 26, 0.75, 20.9);
  box(S, 0.4, 0.8, 1.4, '#e7837a', 24, 0.4, 20); box(S, 0.4, 0.8, 1.4, '#e7837a', 28, 0.4, 20);
  seats.push({ x: 25, z: 19.9, rot: Math.PI }, { x: 27, z: 19.9, rot: Math.PI });
  solid(23.8, 19.3, 28.2, 21.2);
  box(S, 1.6, 0.4, 0.9, '#c4966a', 26, 0.4, 17.8); solid(25.2, 17.35, 26.8, 18.25);
  box(S, 1.4, 2.4, 1, '#c0392b', X1 - 1, 1.2, 11);
  textPlane(S, tr('믹스커피\n☕ 300원', 'Coffee mix\n☕ 300 won'), 1.1, 0.9, '#fff3e0', '#8e2b20', { fs: 20 }).position.set(X1 - 1, 1.6, 11.52);
  solid(X1 - 1.7, 10.5, X1, 11.5);
  box(S, 0.7, 1.4, 0.7, '#ecf0f1', X1 - 1, 0.7, 13.5); cyl(S, 0.25, 0.25, 0.6, '#a9d6f0', X1 - 1, 1.7, 13.5); solid(X1 - 1.35, 13.15, X1, 13.85);
  box(S, 2.4, 0.1, 1.4, '#d9b98c', 18, 0.9, 13);
  [[-1.1, -0.6], [1.1, -0.6], [-1.1, 0.6], [1.1, 0.6]].forEach(([a, b]) => box(S, 0.08, 0.9, 0.08, '#666', 18 + a, 0.45, 13 + b));
  cyl(S, 0.2, 0.15, 0.25, '#e74c3c', 17.5, 1.07, 13); cyl(S, 0.2, 0.15, 0.25, '#f1c40f', 18.5, 1.07, 13.2);
  solid(16.8, 12.3, 19.2, 13.7);
  box(S, 3, 1.8, 0.1, '#cfd8dc', 16, 0.9, 9.05, { cast: false });
  textPlane(S, tr('이번 주 식단표\n월 제육 · 화 돈까스\n수 비빔밥 · 목 짜장', 'Lunch this week\nMon pork · Tue cutlet\nWed bibimbap · Thu noodles'), 2.2, 1.4, '#fffef6', '#333', { fs: 17, border: '#b08455' }).position.set(16, 1.9, 9.12);
  solid(14.5, 8.9, 17.5, 9.2);
  // 재도전 게시판 (retry board): HQ coding tests you didn't pass get pinned here (spot at RETRY_SPOT)
  box(S, 2.6, 1.7, 0.12, '#8d5a2b', 22, 1.25, 9.05, { cast: false });
  box(S, 2.4, 1.5, 0.04, '#d9a066', 22, 1.25, 9.13, { cast: false });
  [[-0.8, 1.45, '#fff8b0'], [-0.1, 1.15, '#ffffff'], [0.65, 1.5, '#ffd1dc'], [0.5, 0.9, '#d6f5ff']].forEach(([dx, y, c]) => box(S, 0.45, 0.4, 0.02, c, 22 + dx, y, 9.16, { cast: false }));
  textPlane(S, tr('재도전 게시판', 'Retry board'), 2.2, 0.36, '#5d3a1a', '#fff', { fs: 20 }).position.set(22, 2.25, 9.13);
  box(S, 0.08, 0.6, 0.08, '#5d3a1a', 21, 0.3, 9.1); box(S, 0.08, 0.6, 0.08, '#5d3a1a', 23, 0.3, 9.1);
  solid(20.7, 8.9, 23.3, 9.25);

  // 센터장실 (director's office) in the break room corner: a glass room with a door toward the break room.
  // The guest sofa is for later (HQ staff visits).
  floor('wood', 13, 14.5, 21.5, Z1, 0.03);
  glassWall(13, 14.5, 21.5, 14.5, [16.2, 18.4]); glassWall(21.5, 14.5, 21.5, Z1);
  textPlane(S, tr('센터장실', 'DIRECTOR'), 2, 0.5, '#2c3e50', '#fff', { fs: 24 }).position.set(17.3, 2.35, 14.56);
  box(S, 2.6, 0.1, 1.1, '#8d6e63', 17.6, 0.85, 19.6); // desk
  [[-1.2, -0.45], [1.2, -0.45], [-1.2, 0.45], [1.2, 0.45]].forEach(([a, b]) => box(S, 0.08, 0.8, 0.08, '#5d4037', 17.6 + a, 0.4, 19.6 + b));
  box(S, 0.9, 0.55, 0.06, '#222', 17.6, 1.25, 19.95); box(S, 0.12, 0.25, 0.12, '#444', 17.6, 0.98, 19.95); // monitor (faces the door)
  textPlane(S, tr('센터장 문', 'Director Moon'), 0.8, 0.2, '#f5e6c8', '#4a2c1a', { fs: 10 }).position.set(17, 0.98, 19.04);
  solid(16.3, 19.05, 18.9, 20.15);
  box(S, 0.75, 0.12, 0.75, '#34495e', 17.6, 0.5, 20.75); box(S, 0.75, 0.8, 0.12, '#34495e', 17.6, 0.95, 21.15); // big chair
  seats.push({ x: 17.6, z: 20.75, rot: Math.PI });
  box(S, 0.5, 2, 2.6, '#6d4c41', 13.35, 1, 19.8); // bookcase
  for (let i = 0; i < 4; i++) box(S, 0.42, 0.06, 2.5, '#4e342e', 13.38, 0.4 + i * 0.5, 19.8, { cast: false });
  solid(13, 18.5, 13.6, 21.1);
  // guest sofa + coffee table
  box(S, 1, 0.5, 2.2, '#7f8fa6', 14, 0.25, 16.6); box(S, 0.3, 0.9, 2.2, '#7f8fa6', 13.6, 0.55, 16.6);
  seats.push({ x: 14.2, z: 16, rot: Math.PI / 2 }, { x: 14.2, z: 17.2, rot: Math.PI / 2 });
  solid(13.4, 15.5, 14.5, 17.7);
  box(S, 1, 0.4, 1.4, '#c4966a', 15.6, 0.2, 16.6); cyl(S, 0.1, 0.08, 0.18, '#fff', 15.5, 0.49, 16.4);
  solid(15.1, 15.9, 16.1, 17.3);
  plant(20.8, 21.2);

  return { colliders, solid, seats };
}

/** Yellow/black floor tape around a locked area. Returns the meshes so they can be removed. */
export function buildTape(scene, segments) {
  const group = new THREE.Group();
  for (const [x0, z0, x1, z1] of segments) {
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.floor(len / 0.6));
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const m = box(group, 0.6, 0.05, 0.35, i % 2 ? '#222' : '#ffcc00', x0 + (x1 - x0) * t, 0.06, z0 + (z1 - z0) * t, { cast: false });
      m.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
    }
  }
  scene.add(group);
  return group;
}

/** Where you stand to use the retry board. */
export const RETRY_SPOT = { x: 22, z: 10.2 };

export const TAPE = {
  receiving: [[X0, -5.6, -11.9, -5.6], [-11.9, Z0 + 1.5, -11.9, -5.6]],
  printing: [[-15, -4.3, -15, 5.3], [X0, -4.3, -15, -4.3]],
  picking: [[-10.2, -6.2, 10, -6.2], [-10.2, Z0 + 1.5, -10.2, -6.2]],
  packing: [[12, -6.2, X1, -6.2], [12, 5.8, X1, 5.8], [11.8, Z0 + 1.5, 11.8, 6]],
};

/** A small delivery forklift group. */
export function makeForklift() {
  const g = new THREE.Group();
  box(g, 1.6, 0.8, 1.1, '#f2b134', 0, 0.7, 0);
  box(g, 0.9, 1.2, 1, null, -0.2, 1.7, 0, { mat: new THREE.MeshLambertMaterial({ color: '#333', transparent: true, opacity: 0.45 }) });
  box(g, 0.9, 0.1, 1, '#f2b134', -0.2, 2.3, 0);
  box(g, 0.1, 2.6, 0.9, '#555', 0.9, 1.3, 0);
  box(g, 1.1, 0.06, 0.15, '#777', 1.45, 0.2, 0.3); box(g, 1.1, 0.06, 0.15, '#777', 1.45, 0.2, -0.3);
  box(g, 1.2, 0.2, 1.2, '#b08455', 1.5, 0.33, 0);
  carton(g, 1.5, 0.43, 0, 0.8);
  [[-0.5, 0.55], [0.5, 0.55], [-0.5, -0.55], [0.5, -0.55]].forEach(([a, b]) => cyl(g, 0.3, 0.3, 0.2, '#222', a, 0.3, b, { rx: Math.PI / 2 }));
  return g;
}

export { canvasTexture };
