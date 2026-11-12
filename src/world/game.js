// The 3D center: renderer, camera that follows 김사원, walking, NPC wandering, name tags, quest marks.
import * as THREE from 'three';
import { makePerson, animatePerson } from './builders.js';
import { buildCenter, buildTape, makeForklift, TAPE, ZONES } from './layout.js';

const PLAYER_R = 0.42;
const SPEED = 5.5;
const VIEW = 22; // ortho frustum height (bigger = farther)

export function createWorld(container, { npcs, playerStart, onInteract, onMove }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1d2027');
  scene.add(new THREE.HemisphereLight('#ffffff', '#8a8f99', 2.5));
  const sun = new THREE.DirectionalLight('#fff4e0', 2.3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 140 });
  sun.shadow.bias = -0.0006;
  scene.add(sun, sun.target);

  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
  const CAM_OFFSET = new THREE.Vector3(60, 62, 60);

  const { colliders } = buildCenter(scene);

  // ---- locked areas ----
  const locks = {}; // zone -> { tape, collider }
  const lockZone = (zone) => {
    if (locks[zone] || !ZONES[zone]?.lockRect) return;
    const [x0, z0, x1, z1] = ZONES[zone].lockRect;
    const collider = { x0, z0, x1, z1, lock: zone };
    colliders.push(collider);
    const tapeKey = zone === 'shipping' ? 'packing' : zone;
    const shared = Object.values(locks).find((l) => l.tapeKey === tapeKey);
    locks[zone] = { tape: shared ? null : buildTape(scene, TAPE[tapeKey] || []), collider, tapeKey };
  };
  const unlockZone = (zone) => {
    const l = locks[zone];
    if (!l) return;
    colliders.splice(colliders.indexOf(l.collider), 1);
    if (l.tape) scene.remove(l.tape);
    delete locks[zone];
  };

  // ---- player ----
  const me = makePerson({ hair: '#5a3825', vest: '#ff9f43', shirt: '#ffffff', pants: '#2d3e66' });
  me.group.position.set(playerStart.x, 0, playerStart.z);
  scene.add(me.group);

  // ---- NPCs ----
  const people = [];
  for (const [id, def] of Object.entries(npcs)) {
    const p = makePerson(def.look);
    const [ax0, az0, ax1, az1] = def.area;
    const start = findFree((ax0 + ax1) / 2, (az0 + az1) / 2, def.area);
    let holder = p.group;
    if (def.forklift) {
      holder = makeForklift();
      holder.add(p.group);
      p.group.position.set(-0.2, 0.9, 0);
      p.group.rotation.y = Math.PI / 2;
    }
    holder.position.set(start.x, 0, start.z);
    scene.add(holder);
    people.push({ id, def, p, holder, target: null, wait: Math.random() * 2, moving: false, speed: def.forklift ? 3 : 1.5 });
  }

  // ---- quest mark (red 3D "!") ----
  const markMat = new THREE.MeshLambertMaterial({ color: '#ff2a2a', emissive: '#a00000' });
  const markEdge = new THREE.MeshBasicMaterial({ color: '#4a0000', side: THREE.BackSide });
  const makeMark = () => {
    const g = new THREE.Group();
    const sh = new THREE.Shape();
    const tw = 0.13, bw = 0.07, top = 0.62, bot = 0.2;
    sh.moveTo(-bw, bot); sh.lineTo(-tw, top); sh.absarc(0, top, tw, Math.PI, 0, true); sh.lineTo(bw, bot); sh.absarc(0, bot, bw, 0, Math.PI, true);
    const barG = new THREE.ExtrudeGeometry(sh, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3, curveSegments: 16 });
    barG.translate(0, 0, -0.05);
    const dotG = new THREE.SphereGeometry(0.1, 20, 16);
    const bar = new THREE.Mesh(barG, markMat), dot = new THREE.Mesh(dotG, markMat);
    dot.position.y = -0.12;
    for (const m of [bar, dot]) { const e = new THREE.Mesh(m.geometry, markEdge); e.position.copy(m.position); e.scale.setScalar(1.12); g.add(m, e); }
    g.scale.setScalar(1.35);
    return g;
  };
  const marks = new Map(); // npcId -> mesh
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.7, 32), new THREE.MeshBasicMaterial({ color: '#ff4d4d', transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;

  // ---- arrow that points to the next quest giver ----
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 3), new THREE.MeshBasicMaterial({ color: '#ff9f43' }));
  arrow.rotation.x = Math.PI / 2;
  const arrowHolder = new THREE.Group();
  arrowHolder.add(arrow);
  arrow.position.z = 1.6;
  scene.add(arrowHolder);

  // ---- name tags (HTML) ----
  const tagLayer = document.createElement('div');
  tagLayer.className = 'tags';
  container.appendChild(tagLayer);
  const makeTag = (html, cls = '') => { const d = document.createElement('div'); d.className = 'tag ' + cls; d.innerHTML = html; tagLayer.appendChild(d); return d; };
  const meTag = makeTag('<b>물류팀</b>김사원', 'me');
  for (const n of people) n.tag = makeTag(`<b>${n.def.role}</b>${n.def.name}`);
  const prompt = makeTag('<kbd>Space</kbd> 말 걸기', 'prompt');

  // ---- input ----
  const keys = new Set();
  let frozen = false;
  const onKey = (e, down) => {
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) {
      if (down) keys.add(k); else keys.delete(k);
      if (!frozen) e.preventDefault();
    }
    if (down && (k === ' ' || k === 'enter') && !frozen && nearest) { e.preventDefault(); onInteract(nearest.id); }
  };
  addEventListener('keydown', (e) => onKey(e, true));
  addEventListener('keyup', (e) => onKey(e, false));
  addEventListener('blur', () => keys.clear());
  // touch / mouse d-pad
  const pad = { x: 0, z: 0 };

  // ---- helpers ----
  function blocked(x, z, r, ignoreLocks) {
    for (const c of colliders) {
      if (ignoreLocks && c.lock) continue;
      if (x + r > c.x0 && x - r < c.x1 && z + r > c.z0 && z - r < c.z1) return c;
    }
    return null;
  }
  function findFree(x, z, area) {
    for (let i = 0; i < 60; i++) {
      if (!blocked(x, z, 0.5, true)) return { x, z };
      x = area[0] + Math.random() * (area[2] - area[0]);
      z = area[1] + Math.random() * (area[3] - area[1]);
    }
    return { x, z };
  }
  function moveWithCollision(obj, dx, dz, r) {
    const p = obj.position;
    if (!blocked(p.x + dx, p.z, r)) p.x += dx;
    if (!blocked(p.x, p.z + dz, r)) p.z += dz;
  }

  // ---- state ----
  let nearest = null;
  let arrowTarget = null;
  let blockedZoneHit = null;
  const clock = new THREE.Clock();
  let saveTimer = 0;

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h);
    const aspect = w / h;
    const vh = w < 700 ? VIEW * 0.8 : VIEW;
    cam.left = -vh * aspect / 2; cam.right = vh * aspect / 2; cam.top = vh / 2; cam.bottom = -vh / 2;
    cam.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  const tmp = new THREE.Vector3();
  function placeTag(el, obj, y) {
    tmp.set(0, y, 0);
    obj.localToWorld(tmp);
    tmp.project(cam);
    if (tmp.z > 1 || Math.abs(tmp.x) > 1.2 || Math.abs(tmp.y) > 1.2) { el.style.display = 'none'; return; }
    el.style.display = '';
    el.style.transform = `translate(${(tmp.x + 1) / 2 * container.clientWidth}px, ${(1 - tmp.y) / 2 * container.clientHeight}px) translate(-50%, -100%)`;
  }

  function loop() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // player movement (screen-relative: up = away from camera)
    let ix = 0, iz = 0;
    if (!frozen) {
      if (keys.has('arrowup') || keys.has('w')) iz -= 1;
      if (keys.has('arrowdown') || keys.has('s')) iz += 1;
      if (keys.has('arrowleft') || keys.has('a')) ix -= 1;
      if (keys.has('arrowright') || keys.has('d')) ix += 1;
      ix += pad.x; iz += pad.z;
    }
    const moving = ix !== 0 || iz !== 0;
    blockedZoneHit = null;
    if (moving) {
      const len = Math.hypot(ix, iz);
      // screen axes → world: right = (1,0,-1)/√2, down = (1,0,1)/√2
      const wx = (ix + iz) / Math.SQRT2 / len, wz = (iz - ix) / Math.SQRT2 / len;
      const p = me.group.position;
      const nx = p.x + wx * SPEED * dt, nz = p.z + wz * SPEED * dt;
      const hit = blocked(nx, nz, PLAYER_R);
      if (hit?.lock) blockedZoneHit = hit.lock;
      moveWithCollision(me.group, wx * SPEED * dt, wz * SPEED * dt, PLAYER_R);
      me.group.rotation.y = Math.atan2(wx, wz);
      saveTimer += dt;
      if (saveTimer > 1) { saveTimer = 0; onMove?.(p.x, p.z); }
    }
    animatePerson(me, t, moving);

    // NPCs
    nearest = null;
    let best = 2.3;
    const mp = me.group.position;
    for (const n of people) {
      const pos = n.holder.position;
      const d = Math.hypot(pos.x - mp.x, pos.z - mp.z);
      const talking = d < 2.6 && !n.def.forklift;
      if (d < best && !frozen) { best = d; nearest = n; }
      if (talking) {
        n.moving = false;
        n.holder.rotation.y = Math.atan2(mp.x - pos.x, mp.z - pos.z);
      } else if (n.wait > 0) {
        n.wait -= dt; n.moving = false;
      } else {
        if (!n.target) {
          const [ax0, az0, ax1, az1] = n.def.area;
          n.target = n.def.forklift
            ? { x: Math.abs(pos.x - ax0) < Math.abs(pos.x - ax1) ? ax1 : ax0, z: (az0 + az1) / 2 }
            : { x: ax0 + Math.random() * (ax1 - ax0), z: az0 + Math.random() * (az1 - az0) };
        }
        const dx = n.target.x - pos.x, dz = n.target.z - pos.z, dist = Math.hypot(dx, dz);
        if (dist < 0.2) { n.target = null; n.wait = n.def.forklift ? 1.5 : 1.5 + Math.random() * 3; n.moving = false; }
        else {
          const step = Math.min(dist, n.speed * dt);
          const sx = dx / dist * step, sz = dz / dist * step;
          const r = n.def.forklift ? 0.1 : 0.4;
          if (blocked(pos.x + sx, pos.z + sz, r, true) && !n.def.forklift) { n.target = null; n.wait = 0.5; n.moving = false; }
          else { pos.x += sx; pos.z += sz; n.moving = true; n.holder.rotation.y = n.def.forklift ? (sx > 0 ? 0 : Math.PI) : Math.atan2(sx, sz); }
        }
      }
      animatePerson(n.p, t + n.id.length, n.moving && !n.def.forklift);
      const mark = marks.get(n.id);
      if (mark) {
        mark.position.set(pos.x, 3.5 + Math.sin(t * 3) * 0.12, pos.z);
        mark.rotation.y = Math.PI / 4;
      }
      placeTag(n.tag, n.holder, mark ? 4.85 : (n.def.forklift ? 3.9 : 2.95));
    }
    const ringOwner = [...marks.keys()][0];
    if (ringOwner) { const n = people.find((q) => q.id === ringOwner); ring.position.set(n.holder.position.x, 0.06, n.holder.position.z); ring.visible = true; }
    else ring.visible = false;

    placeTag(meTag, me.group, 2.95);
    if (nearest) { prompt.style.display = ''; placeTag(prompt, nearest.holder, -0.2); } else prompt.style.display = 'none';
    prompt.classList.toggle('hidden', !nearest);

    // arrow to the next quest giver
    if (arrowTarget) {
      const n = people.find((q) => q.id === arrowTarget);
      const d = n ? Math.hypot(n.holder.position.x - mp.x, n.holder.position.z - mp.z) : 0;
      arrowHolder.visible = !!n && d > 5;
      if (n) { arrowHolder.position.set(mp.x, 0.15, mp.z); arrowHolder.rotation.y = Math.atan2(n.holder.position.x - mp.x, n.holder.position.z - mp.z); }
    } else arrowHolder.visible = false;

    // camera follows (not too close)
    tmp.copy(cam.userData.override || mp);
    const target = cam.userData.target || (cam.userData.target = tmp.clone());
    target.lerp(tmp, cam.userData.snap ? 1 : 1 - Math.pow(cam.userData.override ? 0.05 : 0.002, dt));
    cam.userData.snap = false;
    cam.position.copy(target).add(CAM_OFFSET);
    cam.lookAt(target);
    sun.position.copy(target).add(new THREE.Vector3(25, 45, 30));
    sun.target.position.copy(target);

    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  cam.userData.snap = true;
  requestAnimationFrame(loop);

  return {
    lockZone, unlockZone,
    debug: { colliders, blocked: (x, z, r = PLAYER_R) => !!blocked(x, z, r) },
    setFrozen(v) { frozen = v; if (v) keys.clear(); },
    setQuestMarks(ids) {
      for (const [id, m] of marks) { if (!ids.includes(id)) { scene.remove(m); marks.delete(id); } }
      for (const id of ids) if (!marks.has(id)) { const m = makeMark(); scene.add(m); marks.set(id, m); }
      if (ids.length && !ring.parent) scene.add(ring);
    },
    setArrowTarget(id) { arrowTarget = id; },
    get blockedZone() { return blockedZoneHit; },
    get playerPos() { return me.group.position; },
    setPad(x, z) { pad.x = x; pad.z = z; },
    /** Smoothly look at an NPC for a moment (used when a new quest opens). */
    async showNpc(id, ms = 1800) {
      const n = people.find((q) => q.id === id);
      if (!n) return;
      frozen = true;
      cam.userData.override = n.holder.position;
      await new Promise((r) => setTimeout(r, ms));
      cam.userData.override = null;
      await new Promise((r) => setTimeout(r, 500));
      frozen = false;
    },
  };
}
