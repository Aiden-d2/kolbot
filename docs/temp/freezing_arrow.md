# 프리징 애로우 프리즈 길이 (Freezing Arrow, skill 31)

임시노트(261103). 근거 표시: **데이터** = mpqdata 브랜치 / **코드** / **웹** = 인게임 미검증 / **사용자 결정** / **Claude 제안**(미결정). 1프레임 = 40ms로 계산(웹).

## 1. 확인된 값 (데이터)
- **Freezing Arrow** (`skills.txt`): `ELen = 50`(2초), `ELevLen` 없음 → 스킬 레벨·+스킬로 길이 안 늘어남. `ELenSymPerCalc = Ice Arrow blvl × 5`% → 아이스 애로우 **직접 포인트**만 시너지. 콜드 애로우는 데미지 시너지만.
- **얼리는 것은 폭발** (`missiles.txt`): `freezingarrow`(87) → `freezingarrowexp3`(657) 반경 5, `EType = frze`. `AlwaysExplode = 1`.
- **난이도** (`difficultylevels.txt` `MonsterFreezeDivisor`): 노멀 1, 나이트메어 2, 헬 4.
- **번호**: 상태 `freeze` 1, `cold` 11, `holywindcold` 44(`states.txt`). 스탯 `coldresist` 43, `coldlength` 56, `item_halffreezeduration` 118, `item_freeze` 134, `item_pierce_cold` 305(`itemstatcost.txt`). nip 키 `[coldlength]` = 56(`NTItemAlias.dbl`).
- **참 냉기 길이** (`magicprefix.txt`·`magicsuffix.txt`): 접두사 Snowflake·Shivering·Boreal·Hibernal(`mod1`), 접미사 of Frost·of the Icicle·of the Glacier·of Winter(`mod3`) 모두 `cold-len` 25 고정. 크기(스몰·라지·그랜드) 무관. 마법 참은 **0 / 25 / 50**뿐. 유니크 참에는 없음.
- **Holy Freeze**(114): 속도 감소 오라, 프리즈(상태 1) 아님.
- **`M.BOWF`**: Freezing Arrow 20 → Cold Arrow 20 → Ice Arrow 20. 완성 시 시너지 +100%.
- **Hell Bovine** (`monstats.txt`, `levels.txt` 39): classid 391, 헬 냉기 저항 50, 냉기 효과 −33. 카우 레벨에는 이 몹만 나옴.
- 확인 안 함: 접두+접미 참의 스탯 56이 50으로 읽히는지, 캐릭터 `me.getStat(56)`이 아이템 합계인지.

## 2. 웹 (미검증)
- 아이템 냉기 길이는 프리즈 길이로 바뀌어 프리징 애로우 폭발에 **더해진다**(Basin). 시너지 **뒤에** 더한다는 글도 있음.
- 냉기 저항 %만큼 길이 감소, 걸리는 순간에만 적용. 저항 100 이상이면 면역(Basin, maxroll). 출처끼리 엇갈린 적 있음(GameFAQs).
- 냉기 효과 0인 몹, Cannot Be Frozen에는 길이가 걸리지 않음(Basin).
- 액트 보스·슈퍼 유니크·챔피언은 얼지 않고 칠만(fandom).
- 저항·난이도 적용 순서, 반올림, 길이 상한은 못 찾음.

## 3. 계산식과 예상값
`IA` = `me.getSkill(21, 0)`, `CL` = `me.getStat(56)`(프레임), `D` = 1/2/4, `R` = 대상 `getStat(43)`
- **식 A** (웹: 시너지 뒤에 더함): `(50 × (1 + IA × 0.05) + CL) ÷ D × (1 − R/100)`
- **식 B** (시너지가 아이템 길이에도 곱해짐): `(50 + CL) × (1 + IA × 0.05) ÷ D × (1 − R/100)`
- **식 C** (아이템 길이 안 더해짐): `50 × (1 + IA × 0.05) ÷ D × (1 − R/100)`

헬, IA 20, Hell Bovine(R 50):

| CL (옵션 수) | 식 A | 식 B | 식 C |
|---|---|---|---|
| 0 (0) | 12.5f · 0.50초 | 12.5f · 0.50초 | 0.50초 |
| 250 (10) | 43.75f · 1.75초 | 75f · 3.00초 | 0.50초 |
| 750 (30) | 106.25f · 4.25초 | 200f · 8.00초 | 0.50초 |

헬, IA 20, CL 0의 저항별 값: R 0 → 1.00초, 25 → 0.75초, 40 → 0.60초, 50 → 0.50초.

## 4. 테스트 계획
**사용자 결정**
- 헬, 카우(Hell Bovine)에서 혼자 측정. **맵 진입점**(`D2BotMap.dbj`)으로 들어가 손으로 플레이한다(팔로우 프로필 Pause 안 씀).
- 냉기 길이 참을 수십 개 채워 차이를 키운다.
- 측정 코드로 기록한다(사람이 초를 세지 않음).
- 운용: 한 발 쏘고, 얼은 몹이 다 풀린 뒤 다음 발을 쏜다(다시 얼리기로 값이 길어지는 것을 막음. 코드로 거르지 않음).
- 측정 코드: 키로 켜고 끈다. 확인 간격은 루프 그대로(따로 조절 안 함). 거리 제한 30.
- 자동 물약·체력 치킨이 없는 것은 문제없음(손으로 플레이).
- 참 수집: `nips/T.nip`에 아래 두 줄(모든 프로필이 읽음, `Config.PickitFiles`). 아직 넣지 않음.
  ```
  [name] == smallcharm && [quality] == magic # [coldlength] == 25 # [qty] == 2
  [name] == smallcharm && [quality] == magic # [coldlength] == 50 # [qty] == 2
  ```
  `[qty]`는 프로필마다 창고·인벤토리·용병 아이템 중 같은 조건 개수(`NTIP.CheckQuantityOwned`) → 프로필당 25짜리·50짜리 각 2개.

**측정 조건 (코드)**
- 맵 진입점이면 `default.dbj`가 `threads/MapThread.js`만 띄운다(+ MapThread가 `MapHelper.js`를 띄움). `ToolsThread`(자동 물약·치킨·Pause)와 `default.dbj` 본 흐름(파티 대기)은 돌지 않는다. `me.maxgametime`을 정하는 줄도 맵 분기 뒤라 최대 게임 시간이 없을 것으로 봄(추정).
- `MapThread` 메인 루프: 20ms. 아래 창이 하나라도 열려 있으면 닫힐 때까지 루프 전체가 멈춘다(`hideFlags`, `while (getUIFlag(…)) { Hooks.flush(); delay(100); }`). 측정 호출도 같이 멈춰서, 그 사이 풀린 몹은 값이 길게 나온다.

  | 번호 | 창 |
  |---|---|
  | 0x01 | 인벤토리 |
  | 0x02 | 캐릭터 스탯 |
  | 0x09 | ESC 메뉴 |
  | 0x0C | NPC 거래 |
  | 0x0D | **Alt 키 아이템 이름 표시**(누르고 있는 동안) |
  | 0x0F | 퀘스트 화면 |
  | 0x18 | 메시지 기록 |
  | 0x19 | 창고 |
  | 0x1A | 호라드릭 큐브 |
  | 0x21 | 도움말 |

  - 번호 출처: D2MOO `source/D2CommonDefinitions/include/D2Constants.h`의 `UI_` 목록(코드 확인). kolbot 사용처(0x08 NPC 메뉴, 0x0C 거래, 0x14 웨이포인트, 0x19 창고, 0x1A 큐브)와 맞음.
  - `MapHelper`는 ESC 메뉴(0x09)가 열리면 MapThread 스크립트를 `pause()`, 닫히면 `resume()`한다.
  - 자동맵(0x0A)은 멈춤 조건이 아님(열리면 그리기, 닫히면 지우기).
  - 측정 중 피할 것: Alt, 인벤토리(I)·스탯(C)·퀘스트(Q), ESC 메뉴, 메시지 기록, 도움말. 자동맵(Tab)·벨트 물약은 괜찮음.
  - `docs/D2BS_Structure.md`의 "인벤토리 UI(0x09)" 설명은 틀림(0x09는 ESC 메뉴). 노트 정리 때 고침.
- MapThread 숫자패드: 0 다음 지역, 1 이전 지역, 2 웨이포인트, 3 주요 지점(POI), 4 옆 지역(이동은 MapHelper가 실행), 7 몬스터 표시, 8 경로 선, `*` 좌표, `−` 플레이어 거리. 빈 키는 5, 6, 9.
- 혼자라 팀 소서 프리즈(`S.COLD` 등)는 섞이지 않음. 용병은 2막·5막. 3막 냉기 용병(Glacial Spike·Ice Blast·Frozen Armor)은 쓰지 않음.
- 카우 킹을 잡으면 그 난이도에서 포털을 다시 못 연다(일반 지식, 확인 안 함).
- 주운 참이 창고로 옮겨지는지는 확인 안 함.

**측정 코드 (사용자 승인 261103, 구현됨)** — 파일 1개 `threads/MapThread.js`
1. `main` include 줄에 `include("libs/Misc.js")` 추가(`Misc.trace`용).
2. `this.keyEvent`에 **Numpad 5**로 측정 켜기·끄기. 머리 위 글자 `Freeze log on`/`off`.
3. 새 함수 `this.freezeCheck`, 새 변수 `this.freezeStart`(꺼짐 = `null`): `getUnit(1)`을 돌며 상태 1이 새로 켜졌고 거리 30 안쪽이면 시작 시각·이름·classid·spectype·냉기 저항을 기록. 기록 중인 몹은 거리와 상관없이 상태 1이 꺼지면 `Misc.trace` 한 줄을 남기고 지움. 도중에 죽거나 목록에서 사라진 몹은 기록 없이 지움.
4. 메인 루프 `delay(20)` 앞에 `this.freezeCheck()` 호출. 자체 try/catch로 감싸 오류 시 `[FREEZE] Off: …`를 print하고 측정만 끔.
- 줄 형식: `[FREEZE] Hell Bovine classid=391 spectype=0 ms=… coldres=… diff=… ia=… coldlen=… (지역 x,y)`
- 줄 끝 메모: `//261103 temp` (첫 줄들에 `docs/temp/freezing_arrow.md, remove after cold length 0/10/30 judged`)
- 기록 파일: `_cache/trace/trace-<프로필>-<날짜>.txt`
- 확인 안 함: 키 처리 안의 `this`가 MapThread `main`의 `this`와 같은지(MapThread는 `js_strict(true)`, ToolsThread는 같은 방식으로 `this.togglePause`를 씀). 첫 테스트에서 Numpad 5를 눌러 머리 위 글자가 나오는지 본다.
- 가설과 판정: (a) 아이템 길이가 더해진다, (b) 시너지 뒤에 더해진다(식 A). 3절 표와 비교한다.
- 제거 조건: 냉기 길이 옵션 0 / 10 / 30 조건마다 20건 이상 모여 (a)·(b)가 판정되면 지운다.
- 사전 확인: 마을에서 참을 넣고 `me.getStat(56)`이 25 × 옵션 수만큼 느는지.
- 한계: 상태 수신 지연으로 1~2프레임 오차(추정). 다른 몹의 상태 1을 클라이언트가 받는지는 첫 로그로 확인. 다시 얼리기를 걸러내는 코드는 없음(운용으로 막음).

**정해진 것**
- 비교할 냉기 길이 옵션 수: 0 / 10 / 30 (사용자 결정)
- 보조 측정(카타콤 4층, 카운테스 타워)과 `T.nip` 두 줄 넣기, 참 옮기기는 사용자가 직접 한다.

## 5. 출처
- 데이터: mpqdata `skills.txt`, `missiles.txt`, `difficultylevels.txt`, `states.txt`, `itemstatcost.txt`, `properties.txt`, `magicprefix.txt`, `magicsuffix.txt`, `uniqueitems.txt`, `monstats.txt`, `levels.txt`
- 웹: [Basin Freeze length](https://www.theamazonbasin.com/wiki/index.php/Freeze_length), [Basin Freezing Arrow](https://www.theamazonbasin.com/wiki/index.php/Freezing_Arrow), [Basin Cold Damage](https://www.theamazonbasin.com/wiki/index.php/Cold_Damage), [Basin Cold Resist](https://theamazonbasin.com/wiki/index.php/Cold_Resist), [maxroll Crowd Control](https://maxroll.gg/d2/resources/crowd-control), [fandom Freeze](https://diablo.fandom.com/wiki/Freeze), [GameFAQs](https://gamefaqs.gamespot.com/boards/370600-diablo-ii-lord-of-destruction/49885099). Basin·maxroll은 세션 네트워크에서 막혀 검색 요약만 봄.
- 엔진 코드로 확정하려면 D2MOO(GitHub `ThePhrozenKeep/D2MOO`, 1.10f 역분석)를 볼 수 있음. 해당 함수 구현 여부는 미확인.
