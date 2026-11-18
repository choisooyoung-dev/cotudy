// 3D 물류센터 화면: 그리기(렌더러), 김사원을 따라가는 카메라, 걷기, 사람들(NPC)의 움직임, 이름표, 퀘스트 느낌표.
// main.js 가 createWorld() 로 만들고, 돌려받은 world 객체의 메서드로 조종한다 (맨 아래 return 참고).
import { tr } from '../i18n.js';
import * as THREE from 'three';
import { makePerson, animatePerson, holdCup } from './builders.js';
import { buildCenter, buildTape, makeForklift, TAPE, ZONES } from './layout.js';

const PLAYER_R = 0.42; // 김사원의 몸 반지름 (벽·가구에 부딪히는 크기)
const SPEED = 5.5; // 걷는 속도 (초당 칸 수)
const COARSE = matchMedia('(pointer: coarse)').matches; // 휴대폰·태블릿인지: 그러면 Enter·Space 대신 탭
// 사람 앞 안내에 "Enter" 키 표시는 처음 한 번 써 볼 때까지만 보여 준다 (그다음엔 다들 아니까).
const HINT_KEY = 'cotudy.keyhint.world';
let enterHint = (() => {
    try {
        return !localStorage.getItem(HINT_KEY);
    } catch {
        return false;
    }
})();
const VIEW = 22; // 카메라가 보는 세로 범위 (클수록 멀리서 넓게 보인다)

/**
 * 3D 세계를 만들어 container 안에 그린다.
 * npcs: 등장인물 정의 / playerStart: 시작 위치 / playerLook: 김사원 모습 / onInteract(id): Enter 로 무언가를 썼을 때
 * onMove(x, z): 걸었을 때 위치 저장용 / onPrompt(글자): 휴대폰 행동 버튼 글자 / spots: 쓸 수 있는 사물들
 */
export function createWorld(container, { npcs, playerStart, playerLook, onInteract, onMove, onPrompt, spots = [] }) {
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

    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400); // 원근 없는 카메라 (비스듬히 내려다보는 쿼터뷰)
    const CAM_OFFSET = new THREE.Vector3(60, 62, 60); // 카메라가 김사원으로부터 떨어진 방향과 거리

    const { colliders, seats } = buildCenter(scene); // 센터 건물·가구를 만들고, 부딪히는 상자들과 앉을 자리들을 받는다
    // 구역 둘레의 노랑·검정 바닥 테이프: 그림만 있고 막지는 않는다 (모든 구역을 걸어 다닐 수 있다)
    for (const lines of Object.values(TAPE)) buildTape(scene, lines);

    // ---- 잠긴 구역 (지금은 안 쓰지만 테이프로 막는 기능) ----
    const locks = {}; // 구역 id → { tape, collider }
    /** 구역을 테이프로 막는다. */
    const lockZone = (zone) => {
        if (locks[zone] || !ZONES[zone]?.lockRect) return;
        const [x0, z0, x1, z1] = ZONES[zone].lockRect;
        const collider = { x0, z0, x1, z1, lock: zone };
        colliders.push(collider);
        const tapeKey = zone === 'shipping' ? 'packing' : zone;
        const shared = Object.values(locks).find((l) => l.tapeKey === tapeKey);
        locks[zone] = { tape: shared ? null : buildTape(scene, TAPE[tapeKey] || []), collider, tapeKey };
    };
    /** 구역 테이프를 걷는다. */
    const unlockZone = (zone) => {
        const l = locks[zone];
        if (!l) return;
        colliders.splice(colliders.indexOf(l.collider), 1);
        if (l.tape) scene.remove(l.tape);
        delete locks[zone];
    };

    // ---- 김사원 (플레이어) ----
    const me = makePerson(playerLook || { hair: '#5a3825', vest: '#ff9f43', shirt: '#ffffff', pants: '#2d3e66' });
    me.group.position.set(playerStart.x, 0, playerStart.z);
    scene.add(me.group);

    // ---- 등장인물 (NPC) ----
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
        holder.visible = !def.hidden;
        // 사람마다 하나: holder = 실제로 움직이는 물체 (지게차 기사는 탄 동안 지게차, 내리면 사람). cart = 지게차, riding = 타고 있는지
        // target = 걸어갈 곳, wait = 멈춰 있을 시간, guide = 투어 등에서 정해 준 길, seat = 앉을 자리, follow = 김사원을 따라다니는지
        people.push({
            id,
            def,
            p,
            holder,
            cart: def.forklift ? holder : null,
            riding: !!def.forklift,
            target: null,
            wait: Math.random() * 2,
            moving: false,
            speed: def.forklift ? 3 : 1.5,
            guide: null,
            seat: null,
            sitting: false,
            hidden: !!def.hidden,
            follow: false,
        });
    }

    // 지게차 기사: 김사원이 가까이 오면(DISMOUNT_AT) 지게차를 세우고 내려서 말 걸기·퀘스트를 받을 수 있게 하고,
    // 김사원이 멀어지면(REMOUNT_AT) 걸어서 돌아가 다시 탄다 (2026-11-18 사용자 의견: 계속 지나가 버려서 말을 못 걸었다).
    const DISMOUNT_AT = 3.6,
        REMOUNT_AT = 7;
    /** 지게차에서 내린다. forKim: 김사원 때문에 내렸으면 true (그때는 그 자리에 서서 김사원을 본다), 나들이면 false. */
    function dismount(n, forKim = true) {
        if (!n.riding) return;
        const c = n.cart.position;
        const dx = me.group.position.x - c.x,
            dz = me.group.position.z - c.z,
            d = Math.hypot(dx, dz) || 1;
        // 내릴 자리: 김사원 쪽(자리가 있고 김사원과 겹치지 않으면) → 지게차 옆 → 반대쪽 순서로 고른다
        // (「바로 가기」는 김사원을 지게차 바로 옆에 놓아서, 그쪽으로 내리면 겹친다)
        const mx = me.group.position.x,
            mz = me.group.position.z;
        const spots = [
            [dx / d, dz / d],
            [-dz / d, dx / d],
            [dz / d, -dx / d],
            [-dx / d, -dz / d],
        ].map(([ux, uz]) => [c.x + ux * 1.3, c.z + uz * 1.3]);
        const [x, z] =
            spots.find(([sx, sz]) => !blocked(sx, sz, 0.35, true) && Math.hypot(sx - mx, sz - mz) >= 1.1) || spots[3];
        n.cart.remove(n.p.group);
        scene.add(n.p.group);
        n.p.group.position.set(x, 0, z);
        n.p.group.rotation.set(0, Math.atan2(me.group.position.x - x, me.group.position.z - z), 0);
        n.holder = n.p.group;
        n.riding = false;
        n.target = null;
        n.moving = false;
        n.returning = false;
        n.forKim = forKim;
    }
    /** 지게차에 다시 탄다. 김사원이 그 지게차를 몰고 있으면 기다렸다가 다시 시도한다. */
    function mount(n) {
        if (n.riding || !n.cart) return;
        if (myCart === n.cart) {
            n.target = null;
            n.wait = 2;
            return;
        } // 김사원이 몰고 있음: 기다렸다가 다시
        scene.remove(n.p.group);
        n.cart.add(n.p.group);
        n.p.group.position.set(-0.2, 0.9, 0);
        n.p.group.rotation.set(0, Math.PI / 2, 0);
        n.holder = n.cart;
        n.riding = true;
        n.target = null;
        n.wait = 1;
        n.returning = false;
        n.moving = false;
        n.forKim = false;
    }

    // 나들이: 사람들은 거의 자기 구역에 있지만, 가끔 휴게실에 가거나 다른 구역에 잠깐 들른다 (2026-11-18 사용자 의견).
    // 나들이는 큰 통로(z = CORRIDOR_Z)를 따라 걷고, 투어처럼 가구는 무시하고 지나간다.
    // 김사원에게 줄 퀘스트가 있는 사람(빨간 "!")은 찾기 쉽게 자기 구역에 머문다.
    const CORRIDOR_Z = 7.6; // 센터를 가로지르는 큰 통로의 z 위치
    const BREAK_ROOM = [22.5, 9.8, 29.5, 13.6]; // 휴게실 범위 [x0, z0, x1, z1]
    const TRIP_CHANCE = 0.03; // 새로 걸어갈 곳을 정할 때(약 5초마다) 나들이를 갈 확률
    const TRIP_REST = [60, 120]; // 나들이에서 돌아온 뒤 다음 나들이까지 쉬는 시간(초) 범위
    /** n 말고 다른 사람들의 구역들 (나들이로 들를 곳 후보). */
    const otherAreas = (n) => people.filter((q) => q !== n && !q.def.hidden && !q.def.stayHome).map((q) => q.def.area);
    /** 범위 안의 아무 점. */
    const randIn = ([x0, z0, x1, z1]) => ({ x: x0 + Math.random() * (x1 - x0), z: z0 + Math.random() * (z1 - z0) });
    /** n 을 area 로 나들이 보낸다: 통로로 나가서 → 통로를 따라 → 그 구역 안으로. stay: 가서 머무는 시간(초). */
    function startTrip(n, area, stay) {
        const pos = n.holder.position,
            to = randIn(area);
        n.trip = { path: [{ x: pos.x, z: CORRIDOR_Z }, { x: to.x, z: CORRIDOR_Z }, to], i: 0, area, stay };
        n.target = null;
    }

    // 김사원도 세워 둔 지게차를 몰 수 있다: 옆에서 Enter(또는 Space·탭)로 타고, 다시 누르면 내린다.
    let myCart = null; // 김사원이 몰고 있는 지게차 (없으면 null)
    let myLane = null; // 몰 수 있는 범위: 그 기사의 지게차 통로 (2026-11-18: 센터 전체를 마음대로 다니지 못하게)
    const cartSpots = people
        .filter((n) => n.cart)
        .map((n) => ({
            id: 'cart:' + n.id,
            cartOf: n,
            holder: n.cart,
            tag: null,
            action: tr('지게차 타기', 'Drive the forklift'),
            r: 1.9,
            def: {},
        }));
    /** 지게차에 탄다 (sp: 지게차 자리). */
    function driveOn(sp) {
        myCart = sp.cartOf.cart;
        const [x0, z0, x1, z1] = sp.cartOf.def.area;
        myLane = [x0 - 0.5, z0 - 0.5, x1 + 0.5, z1 + 0.5];
        me.group.position.set(myCart.position.x, 0, myCart.position.z);
        me.group.rotation.y = myCart.rotation.y + Math.PI / 2;
    }
    /** 지게차에서 내려 옆 빈자리에 선다. */
    function driveOff() {
        if (!myCart) return;
        const c = myCart.position;
        const side = [
            [0, 1.3],
            [0, -1.3],
            [1.3, 0],
            [-1.3, 0],
        ]
            .map(([ox, oz]) => [c.x + ox, c.z + oz])
            .find(([x, z]) => !blocked(x, z, PLAYER_R)) || [c.x, c.z + 1.3];
        me.group.position.set(side[0], 0, side[1]);
        myCart = null;
    }

    // ---- 퀘스트 표시 (빨간 3D "!") ----
    const markMat = new THREE.MeshLambertMaterial({ color: '#ff2a2a', emissive: '#a00000' });
    const markEdge = new THREE.MeshBasicMaterial({ color: '#4a0000', side: THREE.BackSide });
    /** 빨간 느낌표 3D 모양을 만든다. */
    const makeMark = () => {
        const g = new THREE.Group();
        const sh = new THREE.Shape();
        const tw = 0.13,
            bw = 0.07,
            top = 0.62,
            bot = 0.2;
        sh.moveTo(-bw, bot);
        sh.lineTo(-tw, top);
        sh.absarc(0, top, tw, Math.PI, 0, true);
        sh.lineTo(bw, bot);
        sh.absarc(0, bot, bw, 0, Math.PI, true);
        const barG = new THREE.ExtrudeGeometry(sh, {
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.03,
            bevelSegments: 3,
            curveSegments: 16,
        });
        barG.translate(0, 0, -0.05);
        const dotG = new THREE.SphereGeometry(0.1, 20, 16);
        const bar = new THREE.Mesh(barG, markMat),
            dot = new THREE.Mesh(dotG, markMat);
        dot.position.y = -0.12;
        for (const m of [bar, dot]) {
            const e = new THREE.Mesh(m.geometry, markEdge);
            e.position.copy(m.position);
            e.scale.setScalar(1.12);
            g.add(m, e);
        }
        g.scale.setScalar(1.35);
        return g;
    };
    const marks = new Map(); // 느낌표가 떠 있는 사람 id → 느낌표 모양
    const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.5, 0.7, 32),
        new THREE.MeshBasicMaterial({ color: '#ff4d4d', transparent: true, opacity: 0.45, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;

    // ---- 다음 퀘스트를 줄 사람 쪽을 가리키는 바닥 화살표 ----
    const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 0.9, 3),
        new THREE.MeshBasicMaterial({ color: '#ff9f43' }),
    );
    arrow.rotation.x = Math.PI / 2;
    const arrowHolder = new THREE.Group();
    arrowHolder.add(arrow);
    arrow.position.z = 1.6;
    scene.add(arrowHolder);

    // ---- 이름표 (HTML 글자를 3D 위치에 맞춰 띄운다) ----
    const tagLayer = document.createElement('div');
    tagLayer.className = 'tags';
    container.appendChild(tagLayer);
    /** 이름표 HTML 요소를 만들어 화면에 붙인다. */
    const makeTag = (html, cls = '') => {
        const d = document.createElement('div');
        d.className = 'tag ' + cls;
        d.innerHTML = html;
        tagLayer.appendChild(d);
        return d;
    };
    const meTag = makeTag(tr('<b>물류팀</b>김사원', '<b>Logistics</b>Kim'), 'me');
    for (const n of people) n.tag = makeTag(`<b>${n.def.role}</b>${n.def.name}`);
    /** 안내 앞에 붙는 키 표시: 휴대폰은 👆, 컴퓨터는 처음에만 Enter. */
    const keyHTML = () => (COARSE ? '👆 ' : enterHint ? '<kbd>Enter</kbd> ' : '');
    const prompt = makeTag(keyHTML() + tr('말 걸기', 'Talk'), 'prompt');
    let promptFor;
    // 쓸 수 있는 사물들: { id, x, z, label?, action?, r? }. label = 늘 보이는 이름표 (재도전 게시판 등),
    // action = 가까이 가면 뜨는 안내 글자, r = 얼마나 가까이 가야 하는지. 가까이서 Enter 를 누르면 onInteract('spot:' + id).
    const spotList = spots.map((sp) => {
        const holder = new THREE.Object3D();
        holder.position.set(sp.x, 0, sp.z);
        scene.add(holder);
        return {
            id: 'spot:' + sp.id,
            holder,
            tag: sp.label ? makeTag(sp.label, 'spot') : null,
            action: sp.action,
            r: sp.r || 2,
            def: {},
        };
    });
    // 의자도 모두 사물: Enter 로 앉고, 움직이거나 다시 Enter 를 누르면 일어난다
    for (const [i, st] of seats.entries()) {
        const holder = new THREE.Object3D();
        holder.position.set(st.x, 0, st.z);
        scene.add(holder);
        spotList.push({ id: 'seat:' + i, seat: st, holder, tag: null, action: tr('앉기', 'Sit'), r: 1.3, def: {} });
    }
    spotList.push(...cartSpots);
    let mySeat = null,
        standPos = null;
    /** 의자 st 에 앉는다 (일어날 때 돌아갈 자리를 기억해 둔다). */
    const sitDown = (st) => {
        standPos = me.group.position.clone();
        mySeat = st;
        st.taken = true;
        me.group.position.set(st.x, 0, st.z);
        me.group.rotation.y = st.rot;
    };
    /** 앉아 있으면 일어난다. */
    const standUp = () => {
        if (!mySeat) return;
        mySeat.taken = false;
        mySeat = null;
        me.group.position.copy(standPos); // 의자는 가구 상자 안에 있어서, 앉기 전 자리로 먼저 나온다
    };

    // ---- 입력 (키보드) ----
    const keys = new Set();
    let frozen = false;
    /** 키를 누르고 뗄 때: 방향키·WASD 는 걷기, Enter·Space 는 가까운 것 쓰기. */
    const onKey = (e, down) => {
        const k = e.key.toLowerCase();
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) {
            if (down) keys.add(k);
            else keys.delete(k);
            if (!frozen) e.preventDefault();
        }
        if (down && (k === 'enter' || k === ' ') && !frozen && nearest) {
            e.preventDefault();
            interact();
        }
    };
    /** 가장 가까운 것을 쓴다: 지게차 타고 내리기, 의자 앉고 일어나기, 사람·사물이면 onInteract. */
    const interact = () => {
        if (enterHint) {
            enterHint = false;
            promptFor = undefined;
            try {
                localStorage.setItem(HINT_KEY, '1');
            } catch {
                /* ignore */
            }
        }
        if (nearest.cartOf) {
            if (myCart) driveOff();
            else driveOn(nearest);
        } else if (nearest.seat) {
            if (mySeat) standUp();
            else sitDown(nearest.seat);
        } else {
            standUp();
            onInteract(nearest.id);
        }
    };
    addEventListener('keydown', (e) => onKey(e, true));
    addEventListener('keyup', (e) => onKey(e, false));
    addEventListener('blur', () => keys.clear());
    // 화면 방향 버튼(예전 휴대폰 조작)이 넣는 값
    const pad = { x: 0, z: 0 };
    // 터치로 걷기: 손가락(펜)으로 바닥을 누르고 있으면 김사원이 그쪽으로 걷고, 밀면 따라간다.
    // 가만히 누르고 있으면 그 방향으로 계속 걷는다 (카메라가 따라가면서 손가락 아래 지점도 움직이니까).
    // 손을 떼면 멈춘다. 짧게 톡 치면 그 지점까지 간다. 손 닿는 거리의 사람·사물을 톡 치면 그걸 쓴다 (Enter 와 같다).
    let walkTo = null,
        stuck = 0;
    const ray = new THREE.Raycaster(),
        ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
        hitP = new THREE.Vector3();
    /** 화면 좌표(손가락 위치)가 가리키는 바닥 지점 {x, z}. */
    const floorAt = (e) => {
        const r = renderer.domElement.getBoundingClientRect();
        ray.setFromCamera(
            new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1),
            cam,
        );
        return ray.ray.intersectPlane(ground, hitP) ? { x: hitP.x, z: hitP.z } : null;
    };
    let touch = null; // 지금 누르고 있는 손가락 { id, t(누른 시각), x, y(처음 위치), cx, cy(지금 위치), use, drag }
    const cv = renderer.domElement;
    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' || frozen) return;
        touch = { id: e.pointerId, t: performance.now(), x: e.clientX, y: e.clientY, cx: e.clientX, cy: e.clientY };
        cv.setPointerCapture(e.pointerId);
        // 손 닿는 거리의 사람·사물 바로 위(화면에서 발끝~머리 사이)를 눌렀으면 걷지 않고 그걸 쓴다
        if (nearest) {
            const r = cv.getBoundingClientRect(),
                hp = nearest.holder.position;
            const onScreen = (y) => {
                const v = new THREE.Vector3(hp.x, y, hp.z).project(cam);
                return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
            };
            const a = onScreen(0),
                b = onScreen(2.6); // 발끝 ~ 머리 바로 위
            const px = Math.max(Math.min(a.x, b.x), Math.min(Math.max(a.x, b.x), e.clientX)),
                py = Math.max(Math.min(a.y, b.y), Math.min(Math.max(a.y, b.y), e.clientY));
            if (Math.hypot(e.clientX - px, e.clientY - py) < 36) {
                touch.use = true;
                return;
            }
        }
        walkTo = floorAt(e);
        stuck = 0;
    });
    cv.addEventListener('pointermove', (e) => {
        if (!touch || e.pointerId !== touch.id || frozen) return;
        touch.cx = e.clientX;
        touch.cy = e.clientY;
        if (Math.hypot(e.clientX - touch.x, e.clientY - touch.y) > 12) {
            touch.use = false;
            touch.drag = true;
        } // 밀었으면 탭이 아니다
        if (!touch.use) {
            walkTo = floorAt(e);
            stuck = 0;
        }
    });
    /** 손가락을 뗄 때. */
    const endTouch = (e) => {
        if (!touch || e.pointerId !== touch.id) return;
        const quick = performance.now() - touch.t < 300 && !touch.drag;
        if (touch.use && quick && nearest && !frozen) interact();
        // 바닥을 짧게 톡 쳤으면 그 지점까지 걷고, 누르고 있다가 떼거나 밀다가 떼면 바로 멈춘다
        if (!quick || e.type === 'pointercancel') walkTo = null;
        touch = null;
    };
    cv.addEventListener('pointerup', endTouch);
    cv.addEventListener('pointercancel', endTouch);

    // ---- 도우미 ----
    /** (x, z) 에 반지름 r 인 몸이 들어가면 부딪히는 상자를 돌려준다 (없으면 null). */
    function blocked(x, z, r, ignoreLocks) {
        for (const c of colliders) {
            if (ignoreLocks && c.lock) continue;
            if (x + r > c.x0 && x - r < c.x1 && z + r > c.z0 && z - r < c.z1) return c;
        }
        return null;
    }
    /** (x, z) 가 막혀 있으면 area 안에서 비어 있는 아무 자리를 찾는다. */
    function findFree(x, z, area) {
        for (let i = 0; i < 60; i++) {
            if (!blocked(x, z, 0.5, true)) return { x, z };
            x = area[0] + Math.random() * (area[2] - area[0]);
            z = area[1] + Math.random() * (area[3] - area[1]);
        }
        return { x, z };
    }
    /** obj 를 (dx, dz) 만큼 옮기되, x 와 z 를 따로 검사해서 벽에 닿으면 미끄러지듯 그 방향만 막는다. */
    function moveWithCollision(obj, dx, dz, r) {
        const p = obj.position;
        if (!blocked(p.x + dx, p.z, r)) p.x += dx;
        if (!blocked(p.x, p.z + dz, r)) p.z += dz;
    }

    // ---- 상태 ----
    let nearest = null; // 지금 가장 가까워서 Enter 로 쓸 수 있는 사람·사물
    let arrowTarget = null; // 바닥 화살표가 가리키는 사람 id
    let blockedZoneHit = null; // 잠긴 구역에 부딪혔으면 그 구역 id
    // 그림자용 해: 카메라를 따라 움직이되 그림자 지도 한 칸 단위로만 움직여서 그림자 가장자리가 떨리지 않게 한다
    const SUN_OFFSET = new THREE.Vector3(25, 45, 30);
    const TEXEL = (sun.shadow.camera.right - sun.shadow.camera.left) / sun.shadow.mapSize.x;
    const lightRot = new THREE.Matrix4().lookAt(SUN_OFFSET, new THREE.Vector3(), new THREE.Vector3(0, 1, 0)).invert();
    const lightRotInv = lightRot.clone().invert();
    const sunPos = new THREE.Vector3();
    let saveTimer = 0; // 위치 저장 간격(1초)을 재는 시계

    /** 창 크기가 바뀌면 그림 크기와 카메라 범위를 맞춘다 (폭이 좁은 휴대폰은 조금 더 가까이). */
    function resize() {
        const w = container.clientWidth,
            h = container.clientHeight;
        renderer.setSize(w, h);
        const aspect = w / h;
        const vh = w < 700 ? VIEW * 0.8 : VIEW;
        cam.left = (-vh * aspect) / 2;
        cam.right = (vh * aspect) / 2;
        cam.top = vh / 2;
        cam.bottom = -vh / 2;
        cam.updateProjectionMatrix();
    }
    addEventListener('resize', resize);
    resize();

    const tmp = new THREE.Vector3(); // 계산할 때 다시 쓰는 임시 벡터
    /** 이름표 el 을 3D 물체 obj 의 높이 y 위치에 맞춰 화면에 놓는다 (화면 밖이면 숨긴다). */
    function placeTag(el, obj, y) {
        tmp.set(0, y, 0);
        obj.localToWorld(tmp);
        tmp.project(cam);
        if (tmp.z > 1 || Math.abs(tmp.x) > 1.2 || Math.abs(tmp.y) > 1.2) {
            el.style.display = 'none';
            return;
        }
        el.style.display = '';
        el.style.transform = `translate(${((tmp.x + 1) / 2) * container.clientWidth}px, ${((1 - tmp.y) / 2) * container.clientHeight}px) translate(-50%, -100%)`;
    }

    // 한 프레임 시간(dt): 브라우저가 알려 주는 화면 갱신 시각으로 재고 살짝 고르게 다듬는다 (걸을 때 떨림 방지)
    let lastNow = null,
        t = 0,
        dt = 1 / 60;
    /** 매 프레임 한 번: 김사원 이동 → 카메라 → 사람들 움직임 → 이름표·안내·화살표 → 그리기. */
    function loop(now) {
        const raw = lastNow == null ? 1 / 60 : Math.min((now - lastNow) / 1000, 0.05);
        lastNow = now;
        dt += (raw - dt) * (Math.abs(raw - dt) > 0.02 ? 1 : 0.25);
        t += dt;

        // 김사원 이동 (화면 기준: 위쪽 키 = 카메라에서 멀어지는 쪽)
        let ix = 0,
            iz = 0;
        if (!frozen) {
            if (keys.has('arrowup') || keys.has('w')) iz -= 1;
            if (keys.has('arrowdown') || keys.has('s')) iz += 1;
            if (keys.has('arrowleft') || keys.has('a')) ix -= 1;
            if (keys.has('arrowright') || keys.has('d')) ix += 1;
            ix += pad.x;
            iz += pad.z;
        }
        // 손가락을 누르고 있으면 매 프레임 손가락 아래 바닥을 다시 가리켜서, 가만히 있어도 그 방향으로 계속 걷는다
        if (touch && !touch.use && !frozen) {
            walkTo = floorAt({ clientX: touch.cx, clientY: touch.cy });
        }
        let moving = ix !== 0 || iz !== 0;
        let wx = 0,
            wz = 0;
        if (moving) {
            walkTo = null; // 키보드가 터치 목표보다 먼저
            const len = Math.hypot(ix, iz);
            // 화면 방향 → 세계 방향: 오른쪽 = (1,0,-1)/√2, 아래 = (1,0,1)/√2
            wx = (ix + iz) / Math.SQRT2 / len;
            wz = (iz - ix) / Math.SQRT2 / len;
        } else if (walkTo && !frozen) {
            const p = me.group.position,
                dx = walkTo.x - p.x,
                dz = walkTo.z - p.z,
                dist = Math.hypot(dx, dz);
            if (dist < 0.25) walkTo = null;
            else {
                wx = dx / dist;
                wz = dz / dist;
                moving = true;
            }
        }
        if (frozen) walkTo = null;
        if (moving && mySeat) {
            standUp();
            moving = false;
            walkTo = touch ? walkTo : null;
        } // 앉아 있을 때 첫 움직임은 일어나기만
        blockedZoneHit = null;
        if (moving) {
            const p = me.group.position;
            const bx = p.x,
                bz = p.z;
            const sp = myCart ? SPEED * 1.6 : SPEED,
                rr = myCart ? 0.7 : PLAYER_R;
            const nx = p.x + wx * sp * dt,
                nz = p.z + wz * sp * dt;
            const hit = blocked(nx, nz, rr);
            if (hit?.lock) blockedZoneHit = hit.lock;
            moveWithCollision(me.group, wx * sp * dt, wz * sp * dt, rr);
            me.group.rotation.y = Math.atan2(wx, wz);
            // 터치 목표로 가다가 가구에 막혔으면 제자리걸음 대신 잠시 뒤 포기한다
            if (walkTo && !touch) {
                stuck = Math.hypot(p.x - bx, p.z - bz) < SPEED * dt * 0.2 ? stuck + dt : 0;
                if (stuck > 0.35) walkTo = null;
            }
            saveTimer += dt;
            if (saveTimer > 1) {
                saveTimer = 0;
                onMove?.(p.x, p.z);
            }
        }
        if (myCart) {
            // 지게차 운전 중: 지게차가 김사원을 따라오고 김사원은 그 위에 앉는다 (최기사처럼 옆을 보고 앉음), 통로 밖으로는 못 나간다
            const mp0 = me.group.position;
            if (myLane) {
                mp0.x = Math.min(myLane[2], Math.max(myLane[0], mp0.x));
                mp0.z = Math.min(myLane[3], Math.max(myLane[1], mp0.z));
            }
            myCart.position.set(mp0.x, 0, mp0.z);
            myCart.rotation.y = me.group.rotation.y - Math.PI / 2;
            me.group.position.y = 0.9;
        } else me.group.position.y = 0;
        animatePerson(me, t, moving && !myCart, !!mySeat || !!myCart);

        // 카메라가 김사원을 부드럽게 따라간다. 이름표를 놓기 전에 해야 이름표가 이번 프레임 카메라 위치를 쓴다 (안 그러면 한 박자 늦게 흔들린다).
        const mp = me.group.position;
        tmp.copy(cam.userData.override || mp);
        const target = cam.userData.target || (cam.userData.target = tmp.clone());
        target.lerp(tmp, cam.userData.snap ? 1 : 1 - Math.pow(cam.userData.override ? 0.05 : 0.002, dt));
        cam.userData.snap = false;
        cam.position.copy(target).add(CAM_OFFSET);
        cam.lookAt(target);
        cam.updateMatrixWorld();
        // 해를 그림자 지도 한 칸 단위로만 옮겨서 그림자 가장자리가 지글거리지 않게 한다
        sunPos.copy(target).applyMatrix4(lightRot);
        sunPos.x = Math.round(sunPos.x / TEXEL) * TEXEL;
        sunPos.y = Math.round(sunPos.y / TEXEL) * TEXEL;
        sunPos.applyMatrix4(lightRotInv);
        sun.target.position.copy(sunPos);
        sun.position.copy(sunPos).add(SUN_OFFSET);

        // 사람들 (NPC)
        nearest = null;
        let best = 2.3;
        for (const n of people) {
            if (n.hidden) {
                n.tag.style.display = 'none';
                continue;
            }
            if (n.cart && !n.guide && !n.follow) {
                const hp = n.holder.position,
                    dk = Math.hypot(hp.x - mp.x, hp.z - mp.z);
                if (n.riding && dk < DISMOUNT_AT && !n.trip) dismount(n);
                else if (n.forKim && !n.riding && !frozen && dk > REMOUNT_AT && !n.returning && myCart !== n.cart) {
                    // 지게차로 걸어 돌아가서 다시 탄다 (도착 처리는 아래 걷기 부분에서)
                    n.returning = true;
                    n.wait = 0;
                    n.target = { x: n.cart.position.x, z: n.cart.position.z + 0.9, cart: true };
                } else if (n.returning && dk < DISMOUNT_AT) {
                    n.returning = false;
                    n.target = null;
                }
            }
            const pos = n.holder.position;
            const d = Math.hypot(pos.x - mp.x, pos.z - mp.z);
            // talking = 멈춰서 김사원을 볼지: 가까이 있거나, 김사원 때문에 지게차에서 내린 기사가 돌아가기 전까지
            const talking = (d < 2.6 && !n.riding) || (n.forKim && !n.riding && !n.returning);
            if (d < best && !frozen) {
                best = d;
                nearest = n;
            }
            if (n.follow && !n.guide && !frozen) {
                // 김사원을 몇 걸음 뒤에서 따라다닌다 (본사 직원 방문 때. 가구는 무시하고 곧장)
                if (n.seat) {
                    n.seat.taken = false;
                    n.seat = null;
                    n.sitting = false;
                }
                if (d > 3.2) {
                    const dx = mp.x - pos.x,
                        dz = mp.z - pos.z;
                    const step = Math.min(d - 3, (d > 8 ? 6 : 4.2) * dt);
                    pos.x += (dx / d) * step;
                    pos.z += (dz / d) * step;
                    n.holder.rotation.y = Math.atan2(dx, dz);
                    n.moving = true;
                } else {
                    n.moving = false;
                    n.holder.rotation.y = Math.atan2(mp.x - pos.x, mp.z - pos.z);
                }
                animatePerson(n.p, t + n.id.length, n.moving, false);
                const fm = marks.get(n.id);
                if (fm) {
                    fm.position.set(pos.x, 3.5 + Math.sin(t * 3) * 0.12, pos.z);
                    fm.rotation.y = Math.PI / 4;
                }
                placeTag(n.tag, n.holder, fm ? 4.85 : 2.95);
                continue;
            }
            if (n.guide && n.seat) {
                n.seat.taken = false;
                n.seat = null;
                n.sitting = false;
            } // 투어에 필요하면 앉아 있다가도 일어난다
            if (n.sitting) {
                // 의자에 잠시 앉아 있다 (말을 걸어도 앉은 채로)
                n.moving = false;
                n.wait -= dt;
                if (n.wait <= 0) {
                    n.sitting = false;
                    n.seat.taken = false;
                    n.seat = null;
                    n.wait = 0.5;
                }
            } else if (n.guide) {
                // 정해진 길 걷기 (투어 등): 벽은 무시하고 길을 따라간다. 앞장서는 사람은 김사원이 뒤처지면 기다린다
                const g = n.guide;
                const wp = g.path[g.i];
                const waitForPlayer = g.lead && d > 6;
                if (wp && !waitForPlayer && !frozen) {
                    const dx = wp.x - pos.x,
                        dz = wp.z - pos.z,
                        dist = Math.hypot(dx, dz);
                    if (dist < 0.15) g.i++;
                    else {
                        const step = Math.min(dist, g.speed * dt);
                        pos.x += (dx / dist) * step;
                        pos.z += (dz / dist) * step;
                        n.holder.rotation.y = Math.atan2(dx, dz);
                    }
                    n.moving = dist >= 0.15;
                } else {
                    n.moving = false;
                    const f = !wp && g.face ? g.face : mp;
                    n.holder.rotation.y = Math.atan2(f.x - pos.x, f.z - pos.z);
                }
                if (!wp && g.onArrive && (!g.lead || d < 3.4)) {
                    const done = g.onArrive;
                    g.onArrive = null;
                    done();
                }
            } else if (talking) {
                n.moving = false;
                n.holder.rotation.y = Math.atan2(mp.x - pos.x, mp.z - pos.z);
            } else if (n.trip && !frozen) {
                // 나들이 중 (휴게실 / 다른 구역 / 집으로 돌아오기), 통로를 따라서
                const tr0 = n.trip,
                    wp = tr0.path[tr0.i];
                if (!wp) {
                    n.trip = null;
                    n.moving = false;
                    n.wait = 1;
                    if (tr0.home) {
                        n.away = null;
                        n.homeUntil = t + TRIP_REST[0] + Math.random() * (TRIP_REST[1] - TRIP_REST[0]);
                        if (n.cart) {
                            n.returning = true;
                        }
                    } else n.away = { area: tr0.area, until: t + tr0.stay };
                } else {
                    const dx = wp.x - pos.x,
                        dz = wp.z - pos.z,
                        dist = Math.hypot(dx, dz);
                    if (dist < 0.15) tr0.i++;
                    else {
                        const step = Math.min(dist, 2.6 * dt); // 빠른 걸음: 센터가 넓어서
                        pos.x += (dx / dist) * step;
                        pos.z += (dz / dist) * step;
                        n.holder.rotation.y = Math.atan2(dx, dz);
                        n.moving = true;
                    }
                }
            } else if (n.wait > 0) {
                n.wait -= dt;
                n.moving = false;
            } else {
                const area = n.away ? n.away.area : n.def.area;
                if (!n.target && n.away && (t > n.away.until || marks.has(n.id))) {
                    // 김사원에게 줄 퀘스트가 생기면 일찍 돌아온다
                    // 돌아갈 시간: 자기 구역으로 (지게차 기사는 지게차로 걸어가서 다시 탄다)
                    const home = n.cart
                        ? [n.cart.position.x, n.cart.position.z + 0.9, n.cart.position.x, n.cart.position.z + 0.9]
                        : n.def.area;
                    startTrip(n, home, 0);
                    n.trip.home = true;
                    continue;
                }
                n.homeUntil ??= 60 + Math.random() * 120; // 처음 1~3분은 아무도 나가지 않는다
                if (
                    !n.target &&
                    !n.away &&
                    !n.def.stayHome &&
                    !marks.has(n.id) &&
                    t > n.homeUntil &&
                    Math.random() < TRIP_CHANCE
                ) {
                    // 쉬러 가기(대개 휴게실) 또는 다른 구역 들르기, 8~22초 머문다
                    if (n.riding) dismount(n, false); // 지게차는 그 자리에 세워 둔다
                    const others = otherAreas(n);
                    const where =
                        Math.random() < 0.7 || !others.length
                            ? BREAK_ROOM
                            : others[Math.floor(Math.random() * others.length)];
                    startTrip(n, where, 8 + Math.random() * 14);
                    continue;
                }
                if (n.returning && myCart === n.cart) {
                    n.returning = false;
                    n.forKim = true;
                } // 김사원이 지게차를 가져감: 그 옆에서 기다린다
                if (!n.target && n.returning)
                    n.target = { x: n.cart.position.x, z: n.cart.position.z + 0.9, cart: true };
                if (!n.target && (!n.cart || !n.riding) && Math.random() < 0.35) {
                    // 가끔 지금 있는 구역의 빈 의자에 가서 앉는다
                    const [ax0, az0, ax1, az1] = area;
                    const free = seats.filter(
                        (st) => !st.taken && st.x >= ax0 - 1 && st.x <= ax1 + 1 && st.z >= az0 - 1 && st.z <= az1 + 1,
                    );
                    if (free.length) {
                        n.seat = free[Math.floor(Math.random() * free.length)];
                        n.seat.taken = true;
                        n.target = { x: n.seat.x, z: n.seat.z, seat: true };
                    }
                }
                if (!n.target) {
                    const [ax0, az0, ax1, az1] = area;
                    n.target = n.riding
                        ? { x: Math.abs(pos.x - ax0) < Math.abs(pos.x - ax1) ? ax1 : ax0, z: (az0 + az1) / 2 }
                        : { x: ax0 + Math.random() * (ax1 - ax0), z: az0 + Math.random() * (az1 - az0) };
                }
                const dx = n.target.x - pos.x,
                    dz = n.target.z - pos.z,
                    dist = Math.hypot(dx, dz);
                if (dist < 0.2 && n.target.seat) {
                    // 의자에 도착: 8~20초 앉아 있는다
                    pos.x = n.seat.x;
                    pos.z = n.seat.z;
                    n.holder.rotation.y = n.seat.rot;
                    n.target = null;
                    n.sitting = true;
                    n.wait = 8 + Math.random() * 12;
                    n.moving = false;
                } else if (dist < 0.2 && n.target.cart) {
                    mount(n);
                } else if (dist < 0.2) {
                    n.target = null;
                    n.wait = n.riding ? 1.5 : 1.5 + Math.random() * 3;
                    n.moving = false;
                } else {
                    const step = Math.min(dist, n.speed * dt);
                    const sx = (dx / dist) * step,
                        sz = (dz / dist) * step;
                    const r = n.riding ? 0.1 : 0.4;
                    // 의자로 가는 길에는 그 책상을 스칠 수 있어서, 그때는 가구에 막혀도 멈추지 않는다
                    if (!n.target.seat && !n.target.cart && blocked(pos.x + sx, pos.z + sz, r, true) && !n.riding) {
                        n.target = null;
                        n.wait = 0.5;
                        n.moving = false;
                    } else {
                        pos.x += sx;
                        pos.z += sz;
                        n.moving = true;
                        n.holder.rotation.y = n.riding ? (sx > 0 ? 0 : Math.PI) : Math.atan2(sx, sz);
                    }
                }
            }
            animatePerson(n.p, t + n.id.length, n.moving && !n.riding, n.sitting);
            const mark = marks.get(n.id);
            if (mark) {
                mark.position.set(pos.x, 3.5 + Math.sin(t * 3) * 0.12, pos.z);
                mark.rotation.y = Math.PI / 4;
            }
            placeTag(n.tag, n.holder, mark ? 4.85 : n.riding ? 3.9 : 2.95);
        }
        const ringOwner = [...marks.keys()][0];
        if (ringOwner) {
            const n = people.find((q) => q.id === ringOwner);
            ring.position.set(n.holder.position.x, 0.06, n.holder.position.z);
            ring.visible = true;
        } else ring.visible = false;

        for (const sp of spotList) {
            if (sp.tag) placeTag(sp.tag, sp.holder, 2.4);
            if (frozen) continue;
            if (sp.cartOf) {
                if (myCart) {
                    if (sp.cartOf.cart === myCart) {
                        best = -1;
                        nearest = sp;
                    }
                    continue;
                }
                if (sp.cartOf.riding || mySeat) continue;
            } else if (myCart) continue;
            if (sp.seat) {
                if (mySeat) {
                    if (sp.seat === mySeat) {
                        best = -1;
                        nearest = sp;
                    }
                    continue;
                }
                if (sp.seat.taken) continue;
            }
            const d = Math.hypot(sp.holder.position.x - mp.x, sp.holder.position.z - mp.z);
            if (d < sp.r && d < best) {
                best = d;
                nearest = sp;
            }
        }
        const act = !nearest
            ? null
            : nearest.cartOf && myCart
              ? tr('지게차에서 내리기', 'Get off the forklift')
              : nearest.seat && mySeat
                ? tr('일어나기', 'Stand up')
                : nearest.action || tr('말 걸기', 'Talk');
        if (act !== promptFor) {
            promptFor = act;
            prompt.innerHTML = act ? keyHTML() + act : keyHTML() + tr('말 걸기', 'Talk');
            onPrompt?.(act); // 휴대폰 행동 버튼에도 같은 글자를 보여 준다
        }
        placeTag(meTag, me.group, 2.95);
        if (nearest) {
            prompt.style.display = '';
            placeTag(prompt, nearest.holder, -0.2);
        } else prompt.style.display = 'none';
        prompt.classList.toggle('hidden', !nearest);

        // 다음 퀘스트를 줄 사람을 가리키는 화살표 (5칸 넘게 떨어져 있을 때만)
        if (arrowTarget) {
            const n = people.find((q) => q.id === arrowTarget);
            const d = n ? Math.hypot(n.holder.position.x - mp.x, n.holder.position.z - mp.z) : 0;
            arrowHolder.visible = !!n && d > 5;
            if (n) {
                arrowHolder.position.set(mp.x, 0.15, mp.z);
                arrowHolder.rotation.y = Math.atan2(n.holder.position.x - mp.x, n.holder.position.z - mp.z);
            }
        } else arrowHolder.visible = false;

        renderer.render(scene, cam);
        requestAnimationFrame(loop);
    }
    cam.userData.snap = true;
    requestAnimationFrame(loop);

    return {
        lockZone,
        unlockZone,
        debug: { colliders, blocked: (x, z, r = PLAYER_R) => !!blocked(x, z, r) },
        /** 멈춤: true 면 김사원이 못 움직이고 사람들도 대화 중처럼 멈춘다 (대화창·미션 중). */
        setFrozen(v) {
            frozen = v;
            if (v) keys.clear();
        },
        /** 빨간 느낌표를 띄울 사람들 id 목록. */
        setQuestMarks(ids) {
            for (const [id, m] of marks) {
                if (!ids.includes(id)) {
                    scene.remove(m);
                    marks.delete(id);
                }
            }
            for (const id of ids)
                if (!marks.has(id)) {
                    const m = makeMark();
                    scene.add(m);
                    marks.set(id, m);
                }
            if (ids.length && !ring.parent) scene.add(ring);
        },
        /** 바닥 화살표가 가리킬 사람 id (null 이면 숨김). */
        setArrowTarget(id) {
            arrowTarget = id;
        },
        /** 잠긴 구역에 부딪혔으면 그 구역 id. */
        get blockedZone() {
            return blockedZoneHit;
        },
        /** 김사원 위치 (THREE.Vector3). */
        get playerPos() {
            return me.group.position;
        },
        /** 그 사람 위치 (THREE.Vector3). */
        npcPos(id) {
            return people.find((q) => q.id === id)?.holder.position;
        },
        /** 시험·디버깅용: 그 사람이 어디서 무엇을 하는지. */
        npcState(id) {
            const n = people.find((q) => q.id === id);
            if (!n) return null;
            const h = n.holder.position,
                c = n.cart?.position;
            return {
                x: h.x,
                z: h.z,
                riding: !!n.riding,
                away: !!n.away,
                trip: !!n.trip,
                returning: !!n.returning,
                forKim: !!n.forKim,
                cart: c ? { x: c.x, z: c.z } : null,
                kimDriving: !!myCart,
            };
        },
        /** 시험·디버깅용: 김사원을 (x, z) 에 놓는다. */
        placePlayer(x, z) {
            me.group.position.set(x, me.group.position.y, z);
        },
        /** 화면 방향 버튼 입력 (-1~1). */
        setPad(x, z) {
            pad.x = x;
            pad.z = z;
        },
        /**
         * 사람을 path([{x, z}, …]) 를 따라 걷게 하고, freeNpc() 를 부를 때까지 거기 머물게 한다. 도착하면 끝나는 Promise.
         * lead: 앞장서기. 김사원이 6m 넘게 뒤처지면 기다리고, 김사원이 따라와야 끝난다.
         * face: 도착한 뒤 바라볼 곳 {x, z} (기본: 김사원).
         */
        walkNpc(id, path, { lead = false, speed = 2.6, face = null } = {}) {
            const n = people.find((q) => q.id === id);
            if (!n) return Promise.resolve();
            return new Promise((resolve) => {
                n.guide = { path, i: 0, lead, speed, face, onArrive: resolve };
            });
        },
        /** 사람을 보이거나 숨긴다 (본사 직원은 방문할 때만 보인다). at: 보일 때 놓을 자리 {x, z}. */
        setNpcHidden(id, hidden, at) {
            const n = people.find((q) => q.id === id);
            if (!n) return;
            n.hidden = hidden;
            n.holder.visible = !hidden;
            if (at) n.holder.position.set(at.x, 0, at.z);
            if (hidden) {
                n.follow = false;
                n.guide = null;
            }
        },
        /** 사람이 김사원을 따라다니게(true) 하거나 멈추게(false) 한다. */
        followNpc(id, on) {
            const n = people.find((q) => q.id === id);
            if (n) n.follow = on;
        },
        /** 김사원을 그 사람 바로 옆으로 한 번에 옮긴다 (「바로 가기」 버튼). */
        teleportTo(id) {
            const n = people.find((q) => q.id === id);
            if (!n) return;
            const { x, z } = n.holder.position;
            // 둘레에서 처음 찾은 빈자리로 (책상 안에 들어가지 않게)
            for (let r = 1.6; r <= 3.2; r += 0.8) {
                for (let k = 0; k < 8; k++) {
                    const a = Math.PI / 4 + (k * Math.PI) / 4;
                    const px = x + Math.cos(a) * r,
                        pz = z + Math.sin(a) * r;
                    if (!blocked(px, pz, PLAYER_R)) {
                        me.group.position.set(px, 0, pz);
                        me.group.rotation.y = Math.atan2(x - px, z - pz);
                        onMove?.(px, pz);
                        return;
                    }
                }
            }
        },
        /** 정해진 길을 걷는 사람을 길 끝으로 바로 옮긴다. */
        skipWalk(id) {
            const n = people.find((q) => q.id === id);
            const g = n?.guide;
            if (!g || !g.path.length) return;
            const last = g.path[g.path.length - 1];
            n.holder.position.set(last.x, 0, last.z);
            g.i = g.path.length;
        },
        /** 김사원('me')이나 사람에게 컵을 들려 주거나(on) 뺏는다. drink: 음료 색. */
        holdCup(id, on, drink) {
            const p = id === 'me' ? me : people.find((q) => q.id === id)?.p;
            if (p) holdCup(p, on, drink);
        },
        /** 앉아 있으면 김사원을 일으킨다. */
        standUp() {
            standUp();
        },
        /** 사람을 정해진 길에서 풀어 다시 자기 구역에서 돌아다니게 한다. */
        freeNpc(id) {
            const n = people.find((q) => q.id === id);
            if (n) {
                n.guide = null;
                n.target = null;
                n.wait = 1;
            }
        },
        /** 카메라가 잠깐 그 사람을 보여 준다 (새 퀘스트가 열릴 때). */
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
