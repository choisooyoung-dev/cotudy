// NPCs of the center. Everyone wanders inside `area` (x0, z0, x1, z1) doing their job.
// `look`: hair, style ('short' | 'long' | 'bun'), vest (false = no safety vest), shirt, cap, helmet, prop.
// `talk`: small talk lines when there is no quest for you.

export const NPCS = {
  han: {
    name: '한지원', role: '인사팀', area: [-30, 11, -16, 20],
    look: { hair: '#4a2c1a', style: 'long', vest: false, shirt: '#a29bfe', prop: 'papers' },
    talk: ['출입증은 꼭 목에 걸고 다니세요~', '점심은 11시 50분부터예요!', '모르는 거 있으면 언제든 물어보세요.'],
  },
  park: {
    name: '박주임', role: '입고', area: [-29, -19, -14, -8],
    look: { hair: '#2b1d14', prop: 'scanner' },
    talk: ['오늘 입고 물량 많네요~', '박스 바코드는 꼭 스캔하고 쌓아 주세요!', '쿠션 팩트가 요즘 엄청 들어와요.'],
  },
  choi: {
    name: '최기사', role: '지게차', area: [-27, -7, -14, -5], forklift: true,
    look: { hair: '#222', helmet: '#f39c12' },
    talk: ['지게차 지나갈 땐 노란 선 밖에 있어요~', '빵빵! 조심하세요!'],
  },
  lee: {
    name: '이대리', role: '주문 출력', area: [-30, -2, -18, 3],
    look: { hair: '#6b3e26', style: 'bun', prop: 'papers' },
    talk: ['오늘 출고 마감 3시예요!', '송장 프린터가 또 종이 걸렸어요…'],
  },
  jung: {
    name: '정사원', role: '피킹', area: [-6, -17, 6, -8],
    look: { hair: '#1e1e1e', cap: '#2f6fd6', prop: 'cart' },
    talk: ['랙 번호만 잘 보면 금방 찾아요.', '오늘 만 보 넘겼어요!'],
  },
  song: {
    name: '송사원', role: '패킹', area: [14, -4, 23, 3],
    look: { hair: '#7a4a2a', prop: 'tape' },
    talk: ['에어캡은 두 번 감아야 안 깨져요.', '테이프 소리 좋죠?'],
  },
  kang: {
    name: '강군', role: '패킹 알바', area: [14, -4, 25, 4],
    look: { hair: '#c9a227', prop: 'bubble' },
    talk: ['에어캡 터뜨리면 혼나요… 근데 재밌어요.', '오늘 첫날이세요? 저도 2주차예요!'],
  },
  oh: {
    name: '오팀원', role: '출고', area: [15, -17, 25, -9],
    look: { hair: '#3b2a20', prop: 'box' },
    talk: ['출고 박스는 택배사별로 나눠 놔요.', '롤테이너 바퀴 조심하세요!'],
  },
  yoon: {
    name: '윤기사님', role: '번개택배', area: [23, -19, 29, -15],
    look: { hair: '#222', cap: '#e2523f', vest: false, shirt: '#e2523f', prop: 'box' },
    talk: ['오늘 물량 다 실으면 바로 출발해요!', '번개처럼 배송합니다~'],
  },
  moon: {
    name: '문센터장', role: '센터장', area: [17, 12, 27, 19],
    look: { hair: '#9e9e9e', vest: false, shirt: '#2c3e50', prop: 'coffee' },
    talk: ['첫날 힘들죠? 커피 한잔해요.', '천천히 해도 괜찮아요. 하나씩!'],
  },
};
