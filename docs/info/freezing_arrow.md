# 프리징 애로우 프리즈 길이 (Freezing Arrow, skill 31)

정보 파일(261103~261104, `docs/temp`에서 옮김). 근거: **데이터** = mpqdata 브랜치 / **코드** / **측정** = 261104 인게임 측정 / **사용자** = 사용자 확인. 1프레임 = 40ms(측정값과 맞음). 할 일: 6절 상한 측정.

## 1. 확인된 값 (데이터)
- **Freezing Arrow** (`skills.txt`): `ELen = 50`(2초), `ELevLen` 없음 → 스킬 레벨·+스킬로 길이 안 늘어남. `ELenSymPerCalc = Ice Arrow blvl × 5`% → 아이스 애로우 **직접 포인트**만 시너지. 콜드 애로우는 데미지 시너지만.
- **얼리는 것은 폭발** (`missiles.txt`): `freezingarrow`(87) → `freezingarrowexp3`(657) 반경 5, `EType = frze`. `AlwaysExplode = 1`.
- **난이도** (`difficultylevels.txt` `MonsterFreezeDivisor`): 노멀 1, 나이트메어 2, 헬 4.
- **번호**: 상태 `freeze` 1, `cold` 11, `holywindcold` 44(`states.txt`). 스탯 `coldresist` 43, `coldlength` 56, `item_halffreezeduration` 118, `item_freeze` 134, `item_pierce_cold` 305(`itemstatcost.txt`). nip 키 `[coldlength]` = 56(`NTItemAlias.dbl`).
- **참 냉기 길이** (`magicprefix.txt`·`magicsuffix.txt`): 접두사 Snowflake·Shivering·Boreal·Hibernal(`mod1`), 접미사 of Frost·of the Icicle·of the Glacier·of Winter(`mod3`) 모두 `cold-len` 25 고정. 크기(스몰·라지·그랜드) 무관. 마법 참은 **0 / 25 / 50**뿐. 유니크 참에는 없음.
- **Holy Freeze**(114): 속도 감소 오라, 프리즈(상태 1) 아님.
- **`M.BOWF`**: Freezing Arrow 20 → Cold Arrow 20 → Ice Arrow 20. 완성 시 시너지 +100%.
- **Hell Bovine** (`monstats.txt`, `levels.txt` 39): classid 391, 헬 냉기 저항 50, 냉기 효과 −33. 카우 레벨에는 이 몹만 나옴.
- 측정으로 확인(5절): 캐릭터 `me.getStat(56)`은 장착·인벤토리 아이템 냉기 길이의 합계다.

## 2. 얼지 않는 대상
- 냉기 면역(저항 100 이상)은 얼지 않는다(사용자 확인. Basin과 같음).
- 냉기 효과 0인 몹은 냉기 면역이 아니어도 얼지 않는다(사용자 게임 경험).
- 챔피언·유니크는 얼지 않는다(측정 5절 결론 6).

## 3. 계산식과 예상값
`IA` = `me.getSkill(21, 0)`, `CL` = `me.getStat(56)`(프레임), `D` = 1/2/4, `R` = 대상 `getStat(43)`
- **프리즈 프레임 = 정수로 자름[(50 × (1 + IA × 0.05) + CL) ÷ D × (1 − R/100)]** (측정 5절)
- 헬, IA 20이면 예상 ms ≈ 정수로 자름[(100 + CL) ÷ 4 × (1 − R/100)] × 40.

## 4. 테스트 계획
**사용자 결정**
- 헬, 카우(Hell Bovine)에서 혼자 측정. **맵 진입점**(`D2BotMap.dbj`)으로 들어가 손으로 플레이한다(팔로우 프로필 Pause 안 씀).
- 냉기 길이 아이템을 바꿔 가며 냉기 길이를 키운다.
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
- 맵 진입점이면 `default.dbj`가 `threads/MapThread.js`만 띄운다(+ MapThread가 `MapHelper.js`를 띄움). `ToolsThread`(자동 물약·치킨·Pause)와 `default.dbj` 본 흐름(파티 대기)은 돌지 않는다.
- `MapThread` 메인 루프: 20ms. 정해진 창(`hideFlags`)이 하나라도 열려 있으면 닫힐 때까지 루프 전체가 멈춘다(`hideFlags`, `while (getUIFlag(…)) { Hooks.flush(); delay(100); }`). 측정 호출도 같이 멈춰서, 그 사이 풀린 몹은 값이 길게 나온다.
  - 멈추는 창 번호(`hideFlags`)와 UI 번호 전체는 `docs/info/ids.md` "UI 플래그" 절.
  - `MapHelper`는 ESC 메뉴(0x09)가 열리면 MapThread 스크립트를 `pause()`, 닫히면 `resume()`한다.
  - 자동맵(0x0A)은 멈춤 조건이 아님(열리면 그리기, 닫히면 지우기).
  - 측정 중 피할 것: Alt, 인벤토리(I)·스탯(C)·퀘스트(Q), ESC 메뉴, 메시지 기록, 도움말. 자동맵(Tab)·벨트 물약은 괜찮음.
- MapThread 숫자패드: 0 다음 지역, 1 이전 지역, 2 웨이포인트, 3 주요 지점(POI), 4 옆 지역(이동은 MapHelper가 실행), 5 프리즈 측정 켜기·끄기(임시, 261103), 7 몬스터 표시, 8 경로 선, `*` 좌표, `−` 플레이어 거리. 빈 키는 6, 9.
- 혼자라 팀 소서 프리즈(`S.COLD` 등)는 섞이지 않음. 용병은 2막·5막. 3막 냉기 용병(Glacial Spike·Ice Blast·Frozen Armor)은 쓰지 않음.

**측정 코드 (사용자 승인 261103, 구현됨, 상한 측정에 다시 씀)** — 파일 1개 `threads/MapThread.js`
1. `main` include 줄에 `include("libs/Misc.js")` 추가(`Misc.trace`용).
2. `this.keyEvent`에 **Numpad 5**로 측정 켜기·끄기. 머리 위 글자 `Freeze log on`/`off`.
3. 새 함수 `this.freezeCheck`, 새 변수 `this.freezeStart`(꺼짐 = `null`): `getUnit(1)`을 돌며 상태 1이 새로 켜졌고 거리 30 안쪽이면 시작 시각·이름·classid·spectype·냉기 저항을 기록. 기록 중인 몹은 거리와 상관없이 상태 1이 꺼지면 `Misc.trace` 한 줄을 남기고 지움. 도중에 죽거나 목록에서 사라진 몹은 기록 없이 지움.
4. 메인 루프 `delay(20)` 앞에 `this.freezeCheck()` 호출. 자체 try/catch로 감싸 오류 시 `[FREEZE] Off: …`를 print하고 측정만 끔.
- 줄 형식: `[FREEZE] Hell Bovine classid=391 spectype=0 ms=… coldres=… diff=… ia=… coldlen=… (지역 x,y)`. `ia` = 아이스 애로우 직접 포인트, `coldlen` = 캐릭터 냉기 길이 합계(스탯 56).
- 사용자 업로드 `a023087`: 같은 줄을 `print`로도 남김(d2bs 로그).
- 줄 끝 메모: `//261103 temp` (첫 줄들에 `docs/temp/freezing_arrow.md, remove after cold length 0/10/30 judged`). 261104 사용자 요청: 세 줄(include, Numpad 5 case, Freeze log 주석)의 노트 경로를 `docs/info/freezing_arrow.md`로, 날짜 표기를 `//261104 temp`로 바꿈. 제거 조건 문구는 그대로다(제거는 상한 측정 뒤 사용자가 정함).
- 기록 파일: `_cache/trace/trace-<프로필>-<날짜>.txt`
- 확인됨(측정): Numpad 5로 켜지고 기록 줄이 남는다. 클라이언트가 다른 몬스터의 상태 1을 받는다. `coldres`는 `monstats.txt` 헬 값과 같다.
- 다시 얼리기를 걸러내는 코드는 없음(한 발 쏘고 다 풀린 뒤 다음 발로 막음). 몹이 많으면 같은 시각 묶음의 뒤쪽 줄이 길게 나오므로 중앙값으로 본다(5절 카우).
- 코드 줄 끝 메모의 제거 조건(`remove after cold length 0/10/30 judged`)은 측정 방식이 바뀌어 맞지 않음. 제거는 상한 측정 뒤 사용자가 정한다.
**정해진 것**
- 보조 측정(카타콤 4층, 카운테스 타워)과 `T.nip` 두 줄 넣기, 참 옮기기는 사용자가 직접 한다.

## 5. 측정 결과 (261104, 사용자 측정)
조건: 맵 진입점, 헬, 아이스 애로우 직접 포인트 20, 블러드 무어·콜드 플레인·이블 동굴. 한 줄씩 ±1프레임(40ms) 안팎 흔들림.

| CL | 몹 (저항) | 예상: 정수로 자름 | 측정 (ms) | 평균 |
|---|---|---|---|---|
| 0 | Quill Rat (50) | 12f · 480 | 500 | 500 |
| 100 | Quill Rat (50) | 25f · 1000 | 1032 | 1032 |
| 175 | Quill Rat (50) | 34f · 1360 | 1328 | 1328 |
| 225 | Quill Rat (50) | 40f · 1600 | 1562 | 1562 |
| 250 | Quill Rat (50) | 43f · 1720 | 1719 | 1719 |
| 250 | Fallen (40) | 52f · 2080 | 2094, 2094 | 2094 |
| 325 | Fallen (40) | 63f · 2520 | 2484, 2531, 2531, 2516, 2547 | 2522 |
| 400 | Quill Rat (50) | 62f · 2480 | 2453 ×3, 2485 | 2461 |
| 475 | Fallen (40) | 86f · 3440 | 14줄 3406~3469 | 3433 |
| 475 | Quill Rat (50) | 71f · 2840 | 2844, 2797, 2828 | 2823 |
| 475 | Fallen Shaman (0) | 143f · 5720 | 5734, 5703, 5735 | 5724 |
| 475 | Hell Bovine (50), 카우 | 71f · 2840 | 44줄 2828~3016 (2828이 15줄) | 중앙값 2844, 평균 2869 |

- 뺀 줄(얼어 있는 동안 다시 맞아 갱신된 것으로 봄, 예상보다 0.5초 이상 김): CL 400 Quill Rat 3078·4141·3562·3703, CL 400 Fallen 3594·4281·3640, CL 475 Fallen 4953.
- 카우 44줄: 중앙값·최빈값(2844·2828)은 정수로 자른 2840에 붙고, 평균(2869)은 긴 줄 몇 개(2890~3016) 때문에 올라감. 같은 시각에 여러 줄이 찍힌 묶음 안에서 뒤쪽 줄일수록 값이 큼 몹이 많을 때는 평균보다 중앙값이 맞는 값.
- 냉기 길이 출처(데이터 값과 `coldlen` 증가가 모두 맞음): Raven Frost 100(`dmg-cold` 파라미터), 접미사 참 of Frost·of Winter 각 25, Eye of Etlich 75(데이터 범위 50~250), 레어 목걸이 "of Frost"(냉기 최대 3~6) 50, 무기 소켓 Thul 룬 75 ×3(같은 무기).

**결론**
1. 프리즈 프레임 = 정수로 자름[(50 × (1 + IA × 0.05) + CL) ÷ D × (1 − R/100)]. 아이템 냉기 길이는 시너지를 적용한 뒤에 더해진다. "시너지가 아이템 길이에도 곱해짐"(CL 250에서 3000ms)과 "아이템 길이가 안 더해짐"(늘 500ms)은 맞지 않음.
2. 정수로 자르는 것은 마지막 한 번과 같은 결과다(저항을 먼저 곱해 자르고 ÷4 뒤 다시 잘라도 수학적으로 같음). "÷4 뒤 자르고 저항 뒤 또 자름"은 CL 475 Fallen에서 85f·3400ms가 되어 14줄 평균 3433과 맞지 않음.
3. 아이템 냉기 길이는 출처(링, 목걸이, 참, 무기 소켓 룬, 같은 무기의 여러 룬)와 상관없이 스탯 56으로 합산되어 더해진다.
4. 냉기 저항은 ×(1 − R/100). 저항 0·40·50에서 맞음.
5. 얼어 있는 동안 다시 맞으면 그 시점부터 새 길이로 갱신되고, 누적되지 않는다(사용자 확인. 측정값도 "한 번 길이 + 두 화살 간격" 꼴과 맞음).
6. `spectype` 8(보스 `spectype & 0x7`이 아닌 무리, `libs/Attacks/*.js`)은 일반 몹과 똑같이 언다. 챔피언·유니크는 얼지 않는다(사용자 화면 확인, `spectype` 1·2·4 기록 없음).
7. 상한: CL 475(143프레임, 5.7초)까지는 없음. 그 이상은 아이템을 모아 다시 측정 예정(6절). 사용자 판단: 상한이 없을 가능성이 높음.

**측정하지 않은 것**: CL 475 초과, 접두사 참·주얼, IA 20 외, 노멀·나이트메어.

## 6. 상한 측정 준비 (사용자 결정 261104)
- **측정 캐릭터: `aozo-qe`**(아마존). 냉기 길이 아이템을 이 캐릭터에 모은다. 아이템이 더 쌓이면 상한 측정은 이 캐릭터로 한다.
- 측정 코드(`MapThread.js` Numpad 5)는 상한 측정에 다시 쓴다.

**261104 측정에 쓴 냉기 길이 아이템** (값은 mpqdata, `coldlen` 증가로 확인)
| 아이템 | 부위 | 냉기 길이 | 데이터 |
|---|---|---|---|
| Raven Frost | 반지 | 100 | `uniqueitems.txt` `dmg-cold` 파라미터 100 |
| The Eye of Etlich | 목걸이 | 75 | `uniqueitems.txt` `cold-len` 50~250(아이템마다 다름) |
| of Frost 참 ×2, of Winter 참 ×1 | 인벤토리 | 각 25 | `magicsuffix.txt` 참 접미사 `cold-len` 25 |
| 소켓 활(일반) + Thul 룬 ×3 | 무기 | 룬마다 75 | `gems.txt` Thul 무기 `dmg-cold` 파라미터 75 |

최대 구성 합계: 100 + 75 + 75 + 225 = **475**.

**더 모을 것 (사용자 목록)**
| 아이템 | 늘어나는 냉기 길이 | 데이터·메모 |
|---|---|---|
| Raven Frost 하나 더 | +100 | 반지 두 칸 |
| 냉기 길이가 더 높은 Eye of Etlich | 지금 75 → 최대 250(+175까지) | `cold-len` 50~250 |
| Vampire Gaze(그림 헬름 유니크, `xh9`) | +100 | `uniqueitems.txt` `Vampiregaze` `dmg-cold` 파라미터 100 |
| 냉기 길이 스몰 참 | 개당 25(접두+접미 둘 다면 50) | 1-5절 |
| 5~6소켓 활 + 소켓 수만큼 Thul 룬 | 룬마다 75(6소켓이면 450, 지금 225) | `gems.txt` |
| Duress(갑옷 룬워드) | +50 | `runes.txt` Duress(Shael Um Thul) `dmg-cold` 파라미터 50. 만들려면 Um 룬이 부족함 |

- 예(데이터로 계산): 반지 2 + Eye 250 + Vampire Gaze + Duress + 6소켓 활(Thul 6) = 200 + 250 + 100 + 50 + 450 = 1050(+참). 헬 Fallen(저항 40)에서 식 A로 정수로 자름[(100 + 1050) ÷ 4 × 0.6] = 172프레임 · 6.88초.

## 7. 출처
- 데이터: mpqdata `skills.txt`, `missiles.txt`, `difficultylevels.txt`, `states.txt`, `itemstatcost.txt`, `properties.txt`, `magicprefix.txt`, `magicsuffix.txt`, `uniqueitems.txt`, `monstats.txt`, `levels.txt`
- 웹: [Basin Freeze length](https://www.theamazonbasin.com/wiki/index.php/Freeze_length), [Basin Freezing Arrow](https://www.theamazonbasin.com/wiki/index.php/Freezing_Arrow), [Basin Cold Damage](https://www.theamazonbasin.com/wiki/index.php/Cold_Damage), [Basin Cold Resist](https://theamazonbasin.com/wiki/index.php/Cold_Resist), [maxroll Crowd Control](https://maxroll.gg/d2/resources/crowd-control), [fandom Freeze](https://diablo.fandom.com/wiki/Freeze), [GameFAQs](https://gamefaqs.gamespot.com/boards/370600-diablo-ii-lord-of-destruction/49885099).
- 엔진 코드로 확정하려면 D2MOO(GitHub `ThePhrozenKeep/D2MOO`, 1.10f 역분석)를 볼 수 있음. 해당 함수 구현 여부는 미확인.
