// 1회차: the tutorial lap around the center. One stage = one area + one quest giver.
// A stage is finished when all its quests are done. Stages open in this order.
// `zone` is the area id in src/world/layout.js. `quests` are ids from src/content/<lang>/.

export const STAGES = [
  { id: 'office',    name: '사무실',        topic: '첫 출근',     npc: 'han',  zone: 'office' },
  { id: 'receiving', name: '화장품 입고장', topic: '변수와 타입', npc: 'park', zone: 'receiving' },
  { id: 'printing',  name: '주문 출력실',   topic: '연산자',      npc: 'lee',  zone: 'printing' },
  { id: 'picking',   name: '피킹',          topic: '조건문',      npc: 'jung', zone: 'picking' },
  { id: 'packing',   name: '패킹',          topic: '반복문',      npc: 'song', zone: 'packing' },
  { id: 'shipping',  name: '출고장',        topic: '배열',        npc: 'oh',   zone: 'shipping' },
  { id: 'loading',   name: '택배 상차장',   topic: 'String',      npc: 'yoon', zone: 'shipping' },
  { id: 'rest',      name: '휴게실',        topic: '복습',        npc: 'moon', zone: 'rest' },
];
