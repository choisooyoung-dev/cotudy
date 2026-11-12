// 1회차: the tutorial lap around the center. One stage = one area + one quest giver.
// A stage is finished when all its quests are done. Stages open in this order.
// `zone` is the area id in src/world/layout.js. `quests` are ids from src/content/<lang>/.

import { isEn } from '../i18n.js';

const ALL = [
  { id: 'office',    name: '사무실',        topic: '첫 출근',     npc: 'han',  zone: 'office', en: { name: 'Office', topic: 'First day' } },
  { id: 'receiving', name: '화장품 입고장', topic: '변수와 타입', npc: 'park', zone: 'receiving', en: { name: 'Cosmetics receiving', topic: 'Variables and types' } },
  { id: 'printing',  name: '주문 출력실',   topic: '연산자',      npc: 'lee',  zone: 'printing', en: { name: 'Order printing', topic: 'Operators' } },
  { id: 'picking',   name: '피킹',          topic: '조건문',      npc: 'jung', zone: 'picking', en: { name: 'Picking', topic: 'Conditions' } },
  { id: 'packing',   name: '패킹',          topic: '반복문',      npc: 'song', zone: 'packing', en: { name: 'Packing', topic: 'Loops' } },
  { id: 'shipping',  name: '출고장',        topic: '배열',        npc: 'oh',   zone: 'shipping', en: { name: 'Shipping', topic: 'Arrays' } },
  { id: 'loading',   name: '택배 상차장',   topic: 'String',      npc: 'yoon', zone: 'shipping', en: { name: 'Courier loading', topic: 'Strings' } },
  { id: 'rest',      name: '휴게실',        topic: '복습',        npc: 'moon', zone: 'rest', en: { name: 'Break room', topic: 'Review' } },
];

export const STAGES = ALL.map((s) => (isEn ? { ...s, ...s.en } : s));
