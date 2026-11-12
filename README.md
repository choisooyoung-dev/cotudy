# cotudy

화장품 물류센터 물류팀 신입 **김사원**이 되어, 센터 사람들이 부탁하는 일을 **자바 코드로** 해결하는 3D 공부 게임.
코드는 브라우저 안에서 진짜로 컴파일·실행해서 채점한다 ([CheerpJ](https://cheerpj.com), Java 8).

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5180` 을 연다.

- 방향키 또는 WASD 로 이동하고, 사람 앞에서 `Space` 를 눌러 말을 건다.
- 처음 자바를 실행할 때는 자바 실행기를 받느라 10~40초쯤 걸린다. 왼쪽 아래에 "☕ 자바 준비 완료" 가 뜨면 그다음부터는 1~2초면 실행된다.
- 자바 실행기는 인터넷(CheerpJ CDN)에서 받으므로 인터넷이 연결돼 있어야 한다.
- 진행 상황은 브라우저 `localStorage` 에 저장된다. 오른쪽 아래 ⚙︎ 에서 초기화할 수 있다.

## 배포 (GitHub Pages)

주소: https://choisooyoung-dev.github.io/cotudy/

`main` 에 푸시하면 `.github/workflows/deploy.yml` 이 `npm run build` 를 해서 자동으로 배포한다 (1~2분). `vite.config.js` 의 `base: './'` 덕분에 `/cotudy/` 하위 경로에서도 동작한다.

## 폴더

```
public/tools.jar          브라우저에서 돌리는 javac (JDK 8, JavaFiddle 저장소에서 가져옴)
src/main.js               게임 흐름: 언어 선택, 대화, 퀘스트 시작/완료, 잠금, HUD
src/store.js              진행 저장 (localStorage, 언어별)
src/runner/java.js        CheerpJ 로 컴파일·실행, javac 에러를 쉬운 말로 풀이
src/world/layout.js       센터 바닥·벽·가구·표지판·충돌 상자, 공간(ZONES)과 잠금 테이프
src/world/builders.js     로우폴리 도형, 캐릭터(머리 큰 블록형) 만들기·걷기 애니메이션
src/world/game.js         Three.js 장면, 카메라 따라가기, 이동·충돌, NPC 돌아다니기, 이름표, 빨간 3D 느낌표
src/ui/mission.js         미션 창: 개념 공부 → 출력 예상 → 빈칸 → 직접 쓰기 → 완료
src/ui/code.js            코드 하이라이트, 빈칸 코드, 코드 편집기
src/content/stages.js     1회차 공간 순서 (사무실 → 입고장 → … → 휴게실)
src/content/npcs.js       NPC 이름·직함·모습·돌아다니는 범위·잡담
src/content/java/quests.js  자바 퀘스트 내용 (코드와 분리된 데이터)
docs/mockups/             디자인 시안
PLAN.md                   전체 설계
```

## 새 퀘스트·공간 추가하는 법

1. **퀘스트 추가**: `src/content/java/quests.js` 의 `QUESTS` 에 객체를 하나 더 넣는다.
   - `stage` 는 `src/content/stages.js` 의 공간 id (예: `'printing'` = 주문 출력실 · 연산자), `npc` 는 `src/content/npcs.js` 의 id (예: `'lee'` = 이대리).
   - 같은 공간의 퀘스트는 파일에 적힌 순서대로 나온다.
   - `concepts`(개념 카드), `predict`(출력 예상, 객관식), `fill`(빈칸 `{{0}}`), `write`(직접 쓰기) 를 채운다. 코드는 `main('…')` 도우미로 `class Main` 뼈대를 씌운다.
   - `fill.solution`, `write.solution` 은 "정답 보기" 에 쓰이고, 실행 결과가 `expected` 와 같아야 한다.
2. **공간 열기**: 그 공간(`stage`)에 퀘스트가 하나라도 생기면, 앞 공간을 끝냈을 때 자동으로 테이프가 걷히고 열린다. 따로 할 일 없음.
3. **확인**: `npm run dev` 로 띄우고 걸어가서 직접 풀어 본다. 개발 중에는 브라우저 콘솔에서 `cotudy.startQuest(...)` 로 바로 열 수도 있다.

## 크레딧

- 자바 실행: [CheerpJ](https://cheerpj.com) (CDN 에서 불러옴, 화면에 "Built with CheerpJ" 표시)
- javac: OpenJDK 8 `tools.jar` ([leaningtech/javafiddle](https://github.com/leaningtech/javafiddle) 에서 가져옴)
