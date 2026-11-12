// First-day tour: Jiwon walks Kim around the center to say hello, and the player follows with the
// arrow keys (that is how they learn to move). Every stop is a 3-way talk: Jiwon, the person there, and Kim.
// It also covers the first Java download: the last stop (coffee in the director's office) keeps chatting
// until the language runtime is ready, so the wait never shows.
//
// Line: { who: npc id | 'me', text }. `path` is where Jiwon walks (she ignores walls, so the points
// follow open floor). `meet` is where the person stands, just inside their area.
import { tr } from '../i18n.js';

export const TOUR_START = [
  { who: 'han', text: tr('김사원님, 첫 출근이니까 센터 사람들한테 인사 한번 하고 와요! 제가 같이 갈게요.', 'Kim, it\'s your first day, so let\'s go say hello to everyone at the center! I\'ll come with you.') },
  { who: 'han', text: tr('저 따라오세요~ 방향키나 W A S D 로 걸을 수 있어요.', 'Follow me! You can walk with the arrow keys or W A S D.') },
];

export const TOUR_STOPS = [
  {
    npc: 'lee',
    path: [{ x: -20, z: 10.2 }, { x: -20, z: 7.6 }, { x: -13.4, z: 7.6 }, { x: -13.4, z: 2 }],
    meet: { x: -15.6, z: 0.8 },
    lines: [
      { who: 'han', text: tr('여기는 주문 출력실이에요. 이대리님, 오늘 들어온 신입이에요!', 'This is order printing. Lee, meet our new hire!') },
      { who: 'lee', text: tr('어머, 반가워요! 이대리예요. 주문이 들어오면 여기서 송장을 뽑아요.', 'Oh, nice to meet you! I\'m Lee. When orders come in, we print the shipping labels here.') },
      { who: 'me', text: tr('안녕하세요! 물류팀 김사원입니다. 잘 부탁드려요!', 'Hello! I\'m Kim from the logistics team. Nice to meet you!') },
      { who: 'lee', text: tr('송장 프린터가 자꾸 종이가 걸려서… 나중에 전산 일 좀 도와줘요~', 'The label printer keeps jamming… Help me with the system work later, okay?') },
      { who: 'han', text: tr('다음은 입고장이에요. 따라오세요!', 'Next is receiving. Follow me!') },
    ],
  },
  {
    npc: 'park',
    path: [{ x: -13.4, z: -4.9 }, { x: -21, z: -4.9 }],
    meet: { x: -21, z: -6.6 },
    lines: [
      { who: 'han', text: tr('박주임님~ 신입 김사원님 왔어요!', 'Park! Our new hire Kim is here!') },
      { who: 'park', text: tr('오, 반가워요! 입고 담당 박주임이에요. 들어오는 화장품 박스는 다 여기로 와요.', 'Oh, welcome! I\'m Park, in charge of receiving. Every cosmetics box that comes in lands here.') },
      { who: 'me', text: tr('김사원입니다! 박스가 엄청 많네요.', 'I\'m Kim! Wow, that\'s a lot of boxes.') },
      { who: 'park', text: tr('그쵸? 박스 세는 게 일이에요. 나중에 전산 정리 좀 같이 해요!', 'Right? Counting boxes is half the job. Let\'s sort out the system together sometime!') },
      { who: 'han', text: tr('센터는 어디든 편하게 돌아다녀도 돼요. 패킹 쪽으로 가 볼까요?', 'Feel free to walk around anywhere in the center. Shall we head to packing?') },
    ],
  },
  {
    npc: 'kang',
    path: [{ x: -12.5, z: -4.9 }, { x: 9.5, z: -4.9 }, { x: 10.4, z: 1.5 }],
    meet: { x: 12.6, z: 1.5 },
    lines: [
      { who: 'han', text: tr('강군! 인사해요, 오늘 첫 출근한 김사원님이에요.', 'Kang! Say hi, this is Kim. It\'s their first day.') },
      { who: 'kang', text: tr('앗, 안녕하세요! 패킹 알바 강군이에요. 저도 이제 2주차예요!', 'Oh, hi! I\'m Kang, part-timer in packing. It\'s only my second week too!') },
      { who: 'me', text: tr('반가워요! 저보다 선배시네요.', 'Nice to meet you! So you\'re my senior here.') },
      { who: 'kang', text: tr('에어캡 몰래 터뜨리는 건 비밀이에요… 쉿!', 'Popping bubble wrap when no one\'s looking is our secret… shh!') },
      { who: 'han', text: tr('마지막으로 센터장실에 인사드리러 가요.', 'Last, let\'s go say hello in the director\'s office.') },
    ],
  },
  {
    npc: 'moon',
    path: [{ x: 10.4, z: 7.5 }, { x: 19.6, z: 7.5 }, { x: 20.2, z: 11.5 }, { x: 18.2, z: 13.9 }],
    meet: { x: 17.3, z: 15.6 }, // inside 센터장실, by the door
    lines: [
      { who: 'han', text: tr('센터장님, 신입 김사원님 모시고 왔어요.', 'Director, I brought our new hire, Kim.') },
      { who: 'moon', text: tr('어서 와요, 김사원님. 센터장 문이에요. 첫날이라 정신없죠?', 'Welcome, Kim. I\'m Moon, the center director. First days are a bit hectic, aren\'t they?') },
      { who: 'me', text: tr('안녕하세요! 열심히 하겠습니다!', 'Hello! I\'ll do my best!') },
      { who: 'moon', text: tr('하나씩 천천히 하면 돼요. 커피 한잔하고 가요. ☕', 'Just take it one step at a time. Have a coffee before you go. ☕') },
    ],
    // more coffee chat, shown one group at a time only while the runtime is still loading
    extra: [
      [
        { who: 'moon', text: tr('우리 센터는 입고부터 출고까지, 하루에 박스 수천 개가 지나가요.', 'Thousands of boxes pass through here every day, from receiving to shipping.') },
        { who: 'han', text: tr('그걸 전산으로 다 정리하거든요. 김사원님이 큰 힘이 될 거예요!', 'And we keep track of all of it in the system. You\'ll be a big help, Kim!') },
      ],
      [
        { who: 'moon', text: tr('커피 맛 괜찮아요? 믹스커피가 최고죠.', 'How\'s the coffee? Instant coffee mix is the best.') },
        { who: 'me', text: tr('네, 맛있어요!', 'Yes, it\'s great!') },
      ],
      [
        { who: 'han', text: tr('점심은 11시 50분부터예요. 이번 주 식단표는 휴게실 벽에 붙어 있어요!', 'Lunch starts at 11:50. This week\'s menu is on the break room wall!') },
        { who: 'moon', text: tr('모르는 건 언제든 물어봐요. 여기 사람들 다 친절해요.', 'Ask anytime if you\'re unsure. Everyone here is friendly.') },
      ],
    ],
  },
];

export const TOUR_END = {
  lines: [{ who: 'han', text: tr('이제 사무실로 돌아가서 첫 일을 시작해 볼까요? 따라오세요!', 'Now let\'s head back to the office and start your first task. Follow me!') }],
  path: [{ x: 20.2, z: 11.5 }, { x: 19.6, z: 7.5 }, { x: -20, z: 7.6 }, { x: -20, z: 10.2 }, { x: -21, z: 12.5 }],
};
