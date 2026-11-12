// Small helpers that make low-poly meshes. Everything is plain boxes/cylinders.
import * as THREE from 'three';

const matCache = new Map();
export function mat(color) {
  if (!matCache.has(color)) matCache.set(color, new THREE.MeshLambertMaterial({ color }));
  return matCache.get(color);
}

export function box(parent, w, h, d, color, x, y, z, o = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.mat || mat(color));
  m.position.set(x, y, z);
  m.castShadow = o.cast !== false;
  m.receiveShadow = true;
  if (o.ry) m.rotation.y = o.ry;
  parent.add(m);
  return m;
}

export function cyl(parent, rt, rb, h, color, x, y, z, o = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 12), mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  if (o.rx) m.rotation.x = o.rx;
  if (o.rz) m.rotation.z = o.rz;
  parent.add(m);
  return m;
}

export function canvasTexture(w, h, draw, scale = 64) {
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * scale);
  cv.height = Math.round(h * scale);
  draw(cv.getContext('2d'), cv.width, cv.height);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const FONT = '"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif';

export function drawText(g, text, cw, ch, fg, fs) {
  g.fillStyle = fg;
  g.font = `800 ${fs}px ${FONT}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const lines = text.split('\n');
  lines.forEach((l, i) => g.fillText(l, cw / 2, ch / 2 + (i - (lines.length - 1) / 2) * fs * 1.15));
}

/** A flat sign with text. */
export function textPlane(parent, text, w, h, bg, fg, o = {}) {
  const sc = 64;
  const tex = canvasTexture(w, h, (g, cw, ch) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, cw, ch); }
    if (o.border) { g.strokeStyle = o.border; g.lineWidth = sc * 0.12; g.strokeRect(sc * 0.08, sc * 0.08, cw - sc * 0.16, ch - sc * 0.16); }
    drawText(g, text, cw, ch, fg, o.fs || h * sc * 0.5);
  }, sc);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !bg }));
  parent.add(m);
  return m;
}

export function floorMaterial(kind, w, d) {
  const tex = canvasTexture(w, d, (g, cw, chh) => {
    if (kind === 'concrete') {
      g.fillStyle = '#b9bec5'; g.fillRect(0, 0, cw, chh);
      for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`; g.fillRect(Math.random() * cw, Math.random() * chh, 3, 3); }
      g.strokeStyle = '#a9aeb5'; g.lineWidth = 2;
      const step = cw / (w / 6);
      for (let x = 0; x < cw; x += step) g.strokeRect(x, 0, step, chh);
    } else if (kind === 'wood') {
      const row = 24;
      for (let y = 0; y < chh; y += row) {
        g.fillStyle = (y / row) % 2 ? '#b98a5e' : '#c4966a'; g.fillRect(0, y, cw, row);
        g.fillStyle = '#a77a50';
        for (let x = (y * 7) % 90; x < cw; x += 130) g.fillRect(x, y, 2, row);
      }
    } else if (kind === 'tile') {
      const s = 32;
      for (let y = 0; y < chh; y += s) for (let x = 0; x < cw; x += s) { g.fillStyle = ((x + y) / s) % 2 ? '#e9e4d8' : '#cfd8d4'; g.fillRect(x, y, s, s); }
    } else if (kind === 'epoxy') {
      g.fillStyle = '#8fb3a5'; g.fillRect(0, 0, cw, chh);
      for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.06})`; g.fillRect(Math.random() * cw, Math.random() * chh, 4, 4); }
    }
  }, 16);
  return new THREE.MeshLambertMaterial({ map: tex });
}

const BOX_COLORS = ['#f7c6d0', '#ffe0b2', '#cfe8ff', '#d9f2d0', '#e8d5ff', '#fff1a8'];
/** A cosmetics carton. */
export function carton(parent, x, y, z, s = 0.8, color) {
  const c = color || BOX_COLORS[Math.abs(Math.round(x * 7 + z * 13 + y * 5)) % BOX_COLORS.length];
  box(parent, s, s * 0.75, s, '#d8b27a', x, y + s * 0.375, z);
  box(parent, s * 1.01, s * 0.25, s * 0.6, c, x, y + s * 0.45, z, { cast: false });
  box(parent, s * 0.12, s * 0.76, s * 1.01, '#c79a5c', x, y + s * 0.375, z, { cast: false });
}

// ---------- people ----------
/**
 * A chunky big-head character. Returns { group, parts } where parts has legs/arms pivots for walking.
 * look: { skin, hair, style, vest, shirt, pants, cap, helmet, prop }
 */
export function makePerson(look = {}) {
  const g = new THREE.Group();
  const body = new THREE.Group(); // bobs while walking
  g.add(body);
  const shirt = look.shirt || '#f5f6fa';
  const pants = look.pants || '#3d4a5c';
  const limb = (x, y, w, h, d, color) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    box(pivot, w, h, d, color, 0, -h / 2, 0);
    body.add(pivot);
    return pivot;
  };
  const legL = limb(-0.17, 0.56, 0.28, 0.55, 0.3, pants);
  const legR = limb(0.17, 0.56, 0.28, 0.55, 0.3, pants);
  box(body, 0.7, 0.7, 0.45, shirt, 0, 0.9, 0);
  if (look.vest !== false) {
    box(body, 0.74, 0.62, 0.49, look.vest || '#c6f432', 0, 0.92, 0);
    box(body, 0.76, 0.07, 0.5, '#e8e8e8', 0, 0.85, 0);
  }
  const armL = limb(-0.45, 1.22, 0.18, 0.55, 0.22, shirt);
  const armR = limb(0.45, 1.22, 0.18, 0.55, 0.22, shirt);
  box(body, 0.16, 0.2, 0.02, '#ffffff', 0.12, 1.0, 0.26); // badge
  const hs = 1.05;
  const fz = hs * 0.45 + 0.01;
  box(body, hs, hs * 0.92, hs * 0.9, look.skin || '#ffd9b8', 0, 1.75, 0);
  box(body, 0.09, 0.14, 0.02, '#2d2d2d', -0.2, 1.75, fz);
  box(body, 0.09, 0.14, 0.02, '#2d2d2d', 0.2, 1.75, fz);
  box(body, 0.14, 0.07, 0.02, '#ff9aa2', -0.33, 1.6, fz);
  box(body, 0.14, 0.07, 0.02, '#ff9aa2', 0.33, 1.6, fz);
  box(body, 0.12, 0.04, 0.02, '#b5651d', 0, 1.58, fz);
  const hc = look.hair || '#3b2a20';
  box(body, hs + 0.08, 0.28, hs * 0.9 + 0.08, hc, 0, 2.27, 0);
  box(body, hs + 0.08, 0.7, 0.2, hc, 0, 1.95, -hs * 0.45 - 0.04);
  box(body, 0.14, 0.55, hs * 0.9 + 0.04, hc, -hs / 2 - 0.03, 1.95, -0.02);
  box(body, 0.14, 0.55, hs * 0.9 + 0.04, hc, hs / 2 + 0.03, 1.95, -0.02);
  box(body, hs * 0.55, 0.16, 0.12, hc, -0.12, 2.08, hs * 0.45 + 0.02);
  if (look.style === 'bun') box(body, 0.4, 0.35, 0.4, hc, 0, 2.55, -0.15);
  if (look.style === 'long') box(body, hs + 0.06, 0.8, 0.25, hc, 0, 1.45, -hs * 0.45 - 0.05);
  if (look.cap) { box(body, hs + 0.14, 0.22, hs * 0.9 + 0.14, look.cap, 0, 2.36, 0); box(body, 0.7, 0.06, 0.4, look.cap, 0, 2.27, 0.6); }
  if (look.helmet) box(body, hs + 0.14, 0.3, hs * 0.9 + 0.14, look.helmet, 0, 2.38, 0);
  const carry = look.prop && look.prop !== 'cart';
  if (look.prop === 'box') carton(body, 0, 0.95, 0.5, 0.7);
  if (look.prop === 'scanner') { box(body, 0.12, 0.3, 0.12, '#333', 0.5, 1.0, 0.25); box(body, 0.16, 0.12, 0.3, '#f2b134', 0.5, 1.18, 0.35); }
  if (look.prop === 'papers') box(body, 0.5, 0.12, 0.4, '#ffffff', 0, 1.1, 0.4);
  if (look.prop === 'coffee') cyl(body, 0.1, 0.08, 0.2, '#ffffff', 0.5, 1.2, 0.2);
  if (look.prop === 'tape') cyl(body, 0.16, 0.16, 0.1, '#c8a46a', 0.5, 1.15, 0.25);
  if (look.prop === 'bubble') cyl(body, 0.3, 0.3, 0.9, '#dff3ff', 0, 1.1, 0.45, { rz: Math.PI / 2 });
  if (look.prop === 'cart') {
    const c = new THREE.Group(); c.position.set(0, 0, 1.0); g.add(c);
    box(c, 0.8, 0.08, 1.2, '#7f8c8d', 0, 0.5, 0); box(c, 0.8, 0.06, 1.2, '#7f8c8d', 0, 0.95, 0);
    box(c, 0.8, 1.0, 0.06, '#555', 0, 0.75, -0.6); carton(c, 0, 0.54, 0.1, 0.5);
  }
  if (carry) { armL.rotation.x = -1.1; armR.rotation.x = -1.1; }
  return { group: g, parts: { body, legL, legR, armL, armR, carry } };
}

/** Animates walking (t = time, moving = bool). */
export function animatePerson(p, t, moving) {
  const { body, legL, legR, armL, armR, carry } = p.parts;
  const s = moving ? Math.sin(t * 11) : 0;
  legL.rotation.x = s * 0.6;
  legR.rotation.x = -s * 0.6;
  if (!carry) { armL.rotation.x = -s * 0.5; armR.rotation.x = s * 0.5; }
  body.position.y = moving ? Math.abs(Math.sin(t * 11)) * 0.08 : Math.sin(t * 2) * 0.015;
}
