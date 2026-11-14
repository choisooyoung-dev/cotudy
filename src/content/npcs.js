// NPCs of the center. Everyone wanders inside `area` (x0, z0, x1, z1) doing their job.
// `look`: hair, style ('short' | 'long' | 'bun'), vest (false = no safety vest), shirt, cap, helmet, prop.
// `talk`: small talk lines when there is no quest for you. `en`: the English name, role and talk.

import { isEn } from '../i18n.js';

const ALL = {
  han: {
    name: '한지원', role: '인사팀', area: [-30, 11, -16, 20],
    look: { hair: '#4a2c1a', style: 'long', vest: false, shirt: '#a29bfe', prop: 'papers' },
    talk: ['출입증은 꼭 목에 걸고 다니세요~', '점심은 11시 50분부터예요!', '모르는 거 있으면 언제든 물어보세요.'],
    en: { name: "Jiwon", role: "HR", talk: ["Always wear your badge around your neck!", "Lunch starts at 11:50!", "Ask me anytime if you're not sure about something."] },
  },
  park: {
    name: '박주임', role: '입고', area: [-29, -19, -14, -8],
    look: { hair: '#2b1d14', prop: 'scanner' },
    talk: ['오늘 입고 물량 많네요~', '박스 바코드는 꼭 스캔하고 쌓아 주세요!', '쿠션 팩트가 요즘 엄청 들어와요.'],
    en: { name: "Park", role: "Receiving", talk: ["Lots of deliveries today!", "Scan the barcode before you stack a box!", "So many cushion compacts coming in lately."] },
  },
  choi: {
    name: '최기사', role: '지게차', area: [-27, -7, -14, -5], forklift: true,
    look: { hair: '#222', helmet: '#f39c12' },
    talk: ['지게차 지나갈 땐 노란 선 밖에 있어요~', '빵빵! 조심하세요!'],
    en: { name: "Choi", role: "Forklift", talk: ["Stay outside the yellow lines when the forklift passes!", "Beep beep! Watch out!"] },
  },
  lee: {
    name: '이대리', role: '주문 출력', area: [-30, -2, -18, 3],
    look: { hair: '#6b3e26', style: 'bun', prop: 'papers' },
    talk: ['오늘 출고 마감 3시예요!', '송장 프린터가 또 종이 걸렸어요…'],
    en: { name: "Lee", role: "Order printing", talk: ["Today's shipping cutoff is 3 o'clock!", "The label printer jammed again…"] },
  },
  jung: {
    name: '정사원', role: '피킹', area: [-6, -17, 6, -8],
    look: { hair: '#1e1e1e', cap: '#2f6fd6', prop: 'cart' },
    talk: ['랙 번호만 잘 보면 금방 찾아요.', '오늘 만 보 넘겼어요!'],
    en: { name: "Jung", role: "Picking", talk: ["Just watch the rack numbers and you'll find it fast.", "I passed 10,000 steps today!"] },
  },
  song: {
    name: '송사원', role: '패킹', area: [14, -4, 23, 3],
    look: { hair: '#7a4a2a', prop: 'tape' },
    talk: ['에어캡은 두 번 감아야 안 깨져요.', '테이프 소리 좋죠?'],
    en: { name: "Song", role: "Packing", talk: ["Wrap bubble wrap twice so nothing breaks.", "Love the sound of packing tape, right?"] },
  },
  kang: {
    name: '강군', role: '패킹 알바', area: [14, -4, 25, 4],
    look: { hair: '#c9a227', prop: 'bubble' },
    talk: ['에어캡 터뜨리면 혼나요… 근데 재밌어요.', '오늘 첫날이세요? 저도 2주차예요!'],
    en: { name: "Kang", role: "Packing part-timer", talk: ["I get scolded for popping bubble wrap… but it's fun.", "Is it your first day? It's my second week!"] },
  },
  oh: {
    name: '오팀원', role: '출고', area: [15, -17, 25, -9],
    look: { hair: '#3b2a20', prop: 'box' },
    talk: ['출고 박스는 택배사별로 나눠 놔요.', '롤테이너 바퀴 조심하세요!'],
    en: { name: "Oh", role: "Shipping", talk: ["We sort outgoing boxes by courier.", "Watch out for the cage cart wheels!"] },
  },
  yoon: {
    name: '윤기사님', role: '번개택배', area: [23, -19, 29, -15],
    look: { hair: '#222', cap: '#e2523f', vest: false, shirt: '#e2523f', prop: 'box' },
    talk: ['오늘 물량 다 실으면 바로 출발해요!', '번개처럼 배송합니다~'],
    en: { name: "Mr. Yoon", role: "Lightning Express", talk: ["Once today's load is on, I'm off!", "Fast as lightning!"] },
  },
  // HQ staff: three people who take turns visiting once a week (see src/main.js). Not in the center
  // normally (hidden); on a visit they follow Kim around. Each one gives tests of one difficulty level,
  // and starts visiting once the `unlock` stage is done.
  hq1: {
    name: '서다은', role: '본사', area: [-20, 6.5, -14, 8.5], hidden: true, level: 1, unlock: 'receiving',
    look: { hair: '#2b2b2b', vest: false, shirt: '#ffffff', jacket: '#24345c', tie: '#2f6fd6', badge: '#4a90e2', pants: '#24345c', glasses: true, prop: 'tablet' },
    talk: ['센터는 늘 바쁘네요.', '다음에 또 올게요.'],
    en: { name: 'Seo', role: 'HQ', talk: ['The center is always busy.', 'See you next time.'] },
  },
  hq2: {
    name: '백승호', role: '본사', area: [-20, 6.5, -14, 8.5], hidden: true, level: 2, unlock: 'packing',
    look: { hair: '#5a3a22', vest: false, shirt: '#ffffff', jacket: '#5d6670', tie: '#c0392b', badge: '#4a90e2', pants: '#4b525a', prop: 'papers' },
    talk: ['서류가 산더미네요…', '김사원님, 요즘 실력 늘었다던데요?'],
    en: { name: 'Baek', role: 'HQ', talk: ['So much paperwork…', 'Kim, I hear you\'ve been improving.'] },
  },
  hq3: {
    name: '차미경', role: '본사', area: [-20, 6.5, -14, 8.5], hidden: true, level: 3, unlock: 'forklift',
    look: { hair: '#1a1a1a', style: 'long', vest: false, shirt: '#ffffff', jacket: '#1e1e24', tie: '#8e44ad', badge: '#f1c40f', pants: '#1e1e24', glasses: true, prop: 'coffee' },
    talk: ['기본이 탄탄해야 해요.', '대충 하는 건 안 돼요.'],
    en: { name: 'Cha', role: 'HQ', talk: ['Solid basics come first.', 'No cutting corners.'] },
  },
  moon: {
    name: '문센터장', role: '센터장', area: [14.8, 15.2, 21, 21.4], // stays in 센터장실 (director's office)
    look: { hair: '#9e9e9e', vest: false, shirt: '#2c3e50', prop: 'coffee' },
    talk: ['첫날 힘들죠? 커피 한잔해요.', '천천히 해도 괜찮아요. 하나씩!'],
    en: { name: "Director Moon", role: "Center director", talk: ["Tough first day? Have a coffee.", "Take it slow. One thing at a time!"] },
  },
};

// English names, roles and small talk replace the Korean ones when the display language is English.
export const NPCS = Object.fromEntries(Object.entries(ALL).map(([id, n]) => [id, isEn ? { ...n, ...n.en } : n]));
