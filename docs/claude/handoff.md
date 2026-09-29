# 인수인계 메모 (260928)

새 대화는 이 문서부터 읽는다. 이어서 CLAUDE.md의 분석 노트(설계·흐름·대조표·결함 현황)를 필요한 만큼 읽는다.

---

## 1. 현재 상태
- **코드:** Attack 리팩터링과 후속 수정이 모두 main에 반영되어 있다(사용자가 직접 업로드, main `5a2bc1f` 기준).
- **문서:** `CLAUDE.md`, `docs/claude/*.md`도 작업 브랜치에 올린다. main 반영(PR)은 요청이 있을 때만 한다.
- **인게임 검증:** 일부만 됐다. 아래 3절의 확인 항목이 남아 있다.
- **작업 브랜치:** `claude/attack-docs`. 이 세션 환경에서는 원격 브랜치 삭제가 거부된다. 지워야 하면 사용자가 GitHub에서 지운다.

## 2. 작업 방식 (사용자와 합의한 것)
**흐름**
1. 작업을 시작할 때 브랜치를 main 최신 상태로 맞춘다(`git merge origin/main`).
2. 브랜치에서 수정한다.
3. 커밋 → 푸시한다.
4. 사용자가 브랜치에서 확인한다.
5. 사용자가 요청하면 PR을 만들고, 요청하면 병합한다.

**규칙** (CLAUDE.md에도 있음)
- **요청 없이 코드를 고치지 않는다.** 분석, 검토, 제안까지만 한다.
- main은 절대 직접 덮어쓰지 않는다.
- 지운다(260929부터, 주석으로 남기지 않음). 이전 코드는 git 기록으로 찾는다. 주석 일괄 정리 직전 커밋은 `fcd2713`. 수정 줄에는 `//YYMMDD` 표기를 한다.
- `AutoSmurf.js`, `Reload.js`, `nips/*.nip`은 LF다. 사용자의 로컬 파일은 CRLF일 수 있다.

**사용자가 중요하게 보는 것** (지난 대화에서 여러 번 지적받음)
- **확실한 것만 말한다.** 추정은 추정이라고 밝히고, 근거(코드 줄, 데이터)를 붙인다. 원인을 단정하지 않는다.
- **기존에 잘 돌던 흐름은 유지하고, 지적된 결함만 고친다.** 개선은 먼저 제안하고 허락을 받는다.
- **위치나 방식을 이리저리 바꾸지 않는다.** 판정에 필요한 정보가 어디 있는지 먼저 따지고, 한 번에 맞는 자리에 둔다. 지난번에는 게이트를 setPosition → clear → setPosition으로 오가서 신뢰를 잃었다.
- **"이전과 같다"고 말하기 전에 실제로 대조한다.** 모의 대조표는 적은 상황만 확인한다는 한계를 밝힌다.
- 모든 답변은 한국어로 한다.

**검증 방법**
- 게임 실행 환경이 없다. 문법 검사(`node -e "new Function(src)"`)와 Node 모의 실행으로 확인한다.
- 모의 하네스(엔진 함수 흉내: getUnit, CollMap, getPath, 벽·강 지형)는 지난 세션의 scratchpad에 있었고 **지금은 없다.** 필요하면 다시 만든다. `attack_compare.md` 1절의 방법을 참고한다.
- D2BS 소스(noah-/d2bs)나 kolbot 원본(kolton/d2bot-with-kolbot)을 확인해야 하면 공개 저장소에서 받는다.

## 3. 게임에서 확인할 것 (사용자 확인 대기)
| # | 항목 | 확인 방법 | 관련 |
|---|---|---|---|
| 1 | okCount·teamCount 대기 중 버벅거림이 사라졌는가 | 지역 전환 후 파티 대기 장면 | `attack_status.md` 3-13. 원인이 상자 훑기라는 건 추정 |
| 2 | 레벨 6 캐릭터가 마나 부족 때 멈추지 않고 기본 공격을 하는가 | 저레벨 전투 | 3-12 |
| 3 | 드루 Molten Boulder(마나 11.5)에서 멈춤이 다시 생기지 않는가 | D.FGOM | 3-12. 다시 생기면 "캐시가 원인"이라는 추정이 틀린 것 |
| 4 | 벽 너머 몹 스킵, 강(0x1) 너머 장거리 우회 스킵 | trace `[AC] drop unreachable`, `[SP] detour` | `attack_design.md` 6절 |
| 5 | 해머딘이 벽 너머 몹에서 헛돌지 않는가 | trace `[AC] drop unreachable` | 해머 게이트 0x5 |
| 6 | 상자가 전투 이동 중에만 열리는가 | 이동 중 상자, 텔레 이동 | `Config.OpenChests: 2`, `popChests` |
| 7 | 18레벨 이상 캐릭터의 "Going to town" 반복이 사라졌는가 | 드루이드 등 골드 540 이상 캐릭터 | 아래 5절 열쇠 항목 |

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다.

## 4. 미결 작업 (사용자 결정 또는 확인 후)
| # | 작업 | 상태 | 메모 |
|---|---|---|---|
| 1 | **NoSkipArea 키와 조건 제거** | 로컬 `[]`로 테스트 중 | 문제없으면 제거. 제거할 곳: `Config.js` 키, `Attack.js`의 306 스킵·unreachable 즉시 제외·HP 스킵 조건 3곳, `Paladin.js` 해머 게이트 조건. 조건에서 `Config.NoSkipArea.indexOf(me.area) < 0 &&`만 빼면 동작은 같다 |
| 2 | **임시 로그 정리** | 인게임 검증 후 | `//260926 temp` 표시가 붙은 `Misc.trace("[AC] ...")`, `"[SP] ..."` 줄. `Pather.js`의 redPortal `//260926 temp`는 사용자 코드라 먼저 물어본다 |
| 3 | ~~주석 처리된 옛 코드 정리~~ | **완료 (260929)** | JS/dbj/dbl 32개 파일에서 주석 처리된 옛 코드와 `/* */` 옛 코드 블록, 롤백용 머리글을 지움(Attack.js 2500 → 1349줄). 주석을 뺀 코드 토큰이 정리 전과 같음을 확인. nip·Config.js·builds의 꺼 둔 옵션과 설명 주석·날짜 표기·줄 끝 메모는 유지. 이전 코드는 커밋 `fcd2713` |
| 4 | **소 레벨 치킨 잦음** | 개선 대상 | `followDriver`는 사용자 코드로 교체됨(30 초과 이동, 15~30 clearPath 이동, 근접 clear). 리더 쪽 `clearCowLevel`(팔로워를 기다리지 않고 방마다 이동)은 아직 손대지 않음 |
| 5 | 부활·소환형(샤먼) 우선 | 보류 | 거리순 대전제와 충돌한다. 무리 속 파고들기, 근접은 사실상 효과 없음 등 어느 안도 트레이드오프라 사용자가 보류함 |
| 6 | `lostEntry` 등 변수 이름 | 사용자가 공부 후 직접 다듬기로 함 | `attack_flow.md` 변수 사전에 표시 |
| 7 | Static 사거리 불일치 | 추후 (사용자) | `Misc.js` `Skill.getRange(42)`는 lvl+4, `Sorceress.js` 스태틱 선시전 루프는 (lvl+4) × 2 / 3 (260929 사용자가 × 2 / 3으로 되돌림) |
| 8 | 18레벨 이후 `LowManaSkill = [-1, -1]` | 설계 의도 | 마나가 없으면 대체 공격 없이 기다린다. 결함 아님 |

## 5. 이번 대화에서 확정된 주요 결정 (요약)
세부는 `attack_design.md` 12절, `attack_compare.md`를 본다.

**대상 선택과 스킵**
- 대상 선택은 **거리순이 대전제**다. 예외는 목줄(MUST가 25 이상 멀어지면 바로 그 MUST)뿐이다. 260929에 "10 안에 붙은 몹이 없을 때" 조건을 뺐다.
- MUST는 포기하지 않는다. 쓸 스킬이 없으면 deferred(뒤로 보내기)한다.
- HP 스킵: 실제 시전 5회에 20%. 시전 없는 틱은 5회 연속이면 제외한다.

**벽과 우회**
- Angle/Detour 판정은 **setPosition 접근 단계**에 있다.
  - 텔레·걷기 모두 나에게서 0x4로 보이는 자리만 후보로 쓴다.
  - 걷기 우회는 **나→몹** 경로가 직선 × 4 이내일 때만 한다.
  - MUST는 조건 없이 이동한다.
- 해머는 setPosition을 거치지 않으므로 `getHammerPosition`에 같은 게이트(0x5)를 둔다.
- 접근 정렬은 바깥 링 → 각도 순이다(회피와 같다).

**그 밖의 변경**
- 상자는 clear에서 열지 않는다. Pather가 전투 이동 노드마다 반경 15로 연다(`OpenChests: 2`, 0x5 직선).
- 마나 판정은 `비용 > mp`이고, `getManaCost`는 캐시 없이 계산한다.
- 레벨업 때 `Attack.init()`을 다시 호출한다(46레벨 Wereform). 스킬을 실제로 안 배웠으면 `D2Bot.stop()`한다.
- 고대인은 `clear(0, [540, 541, 542])` 배열 호출이다. 다시 놓치면 개별 호출 복원을 검토한다.

**열쇠 (260928)**
- 증상: 18레벨(`TownCheck = true`)부터 "Going to town" 무한 반복. `OpenChests: 2`로 바꾸면서 townCheck의 열쇠 조건(`Misc.js`)이 켜졌는데, 마을에서는 열쇠를 사지 않아서(`doChores`의 `buyKeys` 주석) 반복했다. 골드가 540 미만이 되면 `checkKeys`가 12를 돌려줘 멈춘다. 그래서 다른 캐릭터는 골드가 바닥나 멈췄고, 드루이드만 골드가 남아 계속 반복한 것으로 추정한다.
- 조치: townCheck 열쇠 조건 주석 처리. 열쇠 관리는 `Config.UseKeys`(기본 false)로 `OpenChests`에서 분리했다(`checkKeys`, `ignoredCheck`, `doChores`의 `buyKeys`). 열쇠 부족은 마을 가기 이유로 쓰지 않는다. 3막 `buyKeys` 건너뜀 때문에 다시 반복할 수 있기 때문이다.
- `ignoredCheck`의 열쇠 조건은 원래 반대로 동작했다(OpenChests가 꺼져 있을 때 보관). 지금은 UseKeys가 켜져 있을 때만 보관한다.
- 파티 방침: 잠긴 상자는 어새신만 연다. `Misc.openChest`의 잠김 검사(열쇠가 없으면 이동 전에 건너뜀)는 유지한다.

**보스 호출과 박스 (260929)**
- 박스는 `{x1, x2, y1, y2}`를 그대로 넘긴다(`box` 감싸기 제거). `mustSpec`: 배열(`instanceof Array`) → 그 밖의 객체는 박스 → 나머지는 id/이름.
- 보스 호출 레인지: 사용자가 뒷정리가 필요한 보스에 레인지를 줬다(Blood Raven 15, Andariel 25 ×2, Radament 15, Izual 20, Shenk 25, Countess 15, Nihlathak 20). Summoner·Duriel·Mephisto·Diablo·고대인·Baal은 0 유지(뒤에 박스·청소 이동이 있거나 혼자 나오는 보스). 보스 호출 앞의 별도 `Attack.clear(N)`은 사용자가 주석 처리했다.
- 트라빈컬: 평의회 배열 must → 박스 2개(1~4 합집합, 5). 이유와 지형은 `attack_design.md` 12절.

**Pather 이동의 pop 인자 (260929)**
- `pop`은 경로의 마지막 노드를 지워 목적지 한 노드 앞(걷기 약 5칸, 텔레 최대 약 35칸)에서 멈추게 한다(`Pather.moveTo`). `Pather.js`는 건드리지 않고 AutoSmurf 호출부에서만 정한다.
- 규칙: **기본은 pop 없음.** 순수 이동으로 **몬스터에게 다가갈 때만**(바로 붙지 않게) pop을 쓴다. 텔레도 걷기와 똑같이 적용한다. 위치 선정·재집결(clear 뒤 재이동, `myX`/`myY` 자리, 오프셋으로 설 자리를 정한 이동)은 pop 없음.
- 현재 pop=true: Blood Raven 묘지(`moveTo`), Treehead 나무 첫 이동(738), Rakanishu 스톤 첫 이동(737, cain·trist). clear 뒤 재이동(나무·스톤·trist·Countess 580)은 pop을 뺐다.
- 뒤에 붙은 기본값 인자(오프셋 0, clearPath false, pop false)는 쓰지 않는다.

## 6. 알아 두면 좋은 사실 (확인됨)
- **D2BS `me.mp`:** 실제 마나를 내림한 정수다(`JSUnit.cpp:262`, stat 8 `>> 8`).
- **D2BS `include`:** 이미 include한 파일은 다시 실행하지 않는다(`Script.cpp:308`).
- **이벤트 처리:** default.dbj의 `AutoBuild.levelUpHandler`만 레벨업 때 `applyConfigUpdates`를 한다. 다른 스레드는 `Config.js`의 별도 핸들러로 json만 다시 읽는다.
- **소수점 마나 비용:** 빌드 공격 스킬의 절반 이상이 소수점이다(Fire Bolt는 모든 레벨 2.5). 계산식은 skills.txt의 mana·lvlmana·manashift·minmana다.
- **`getPath`:** WalkPathReducer 노드 간격은 5칸 이하다. 그래서 `노드 수 × 5`는 실제 길이와 같거나 크다.

## 7. 크래시 분석 (260929, Game.exe 1.14d 역어셈블)
ProcDump(`C:\CrashDumps`)가 원래 예외 지점을 잡는다. WER 덤프의 0x576F0C는 D2BS `exit0` 버그로 생긴 두 번째 크래시라 원인이 아니다.

**유형 A: 그리기 중 유닛 경로 NULL (Game.exe 0x6489C6), 2건 (a1 10:11, a5 10:58)**
- 그리기 목록 루프(0x4df510) → 유닛 그리기(0x471620/0x471450, Gfx.cpp) → D2Common 좌표 함수(0x620650) → `unit+0x2C`(동적 경로) NULL.
- 유닛 종류(플레이어·몬스터·미사일)와 NULL이 된 이유는 모른다. 스택의 애니메이션 문자열은 앞서 그린 유닛의 흔적이다(`bm`은 오브젝트 285 화로).
- 임바모드(Patch_D2_eom.mpq)는 오브젝트 Draw 제거, 미사일 CelFile null·클라이언트 보조 미사일 제거, SO/PA DCC 교체 등 시각 요소만 바꾼다. 직접 원인이라는 증거는 없다.
- Game.exe 패치(그리기 건너뛰기)는 설계까지만 했고, 사용자가 보류함(빈도 낮음, 설치 파일이라 위험).

**유형 B: NPC 대화 콜백의 메뉴 목록 NULL (Game.exe 0x661406), 1건 (a7 14:00:30, 서머너 저널)**
- 게임은 대사 텍스트가 끝날 때 `[0x7bf258]` 콜백을 실행한다(매 프레임 0x4a0770, 클릭 0x4a17d0 → 0x4a08c0). NPC 대화 콜백 0x4b6a30은 NPC 메뉴 목록 `[0x7bf250]`을 검사 없이 읽는다(0x4b1830 → 0x661400).
- 콜백은 대화 연쇄가 정상으로 끝날 때만 스스로 지운다(0x4b6b6b, 0x4b6c42). `CloseNPCInteract`(0x4b3f10)와 `ClearScreen`(0x4b4620)은 목록을 해제하고(0x4b3c20 → 0x4a1730) 플래그 `[0x7c0c69]`를 0으로 만들지만 **콜백은 지우지 않는다.**
- 대사 텍스트 시작(0x4a1320)은 콜백을 새로 등록하지 않는다. 그래서 **NPC 대사 중 `me.cancel()`로 닫으면 오래된 콜백이 남고, 다음에 아무 대사 텍스트(NPC든 오브젝트든)가 끝날 때 크래시가 난다.** 몇 분 뒤에 날 수도 있다.
- a7 덤프 상태가 이와 같다: 콜백 0x4b6a30, 메시지 0x172, `[0x7c0c69]`=0, 목록 NULL, 처리 중이던 텍스트는 저널(`[0x7bf234]`=0x165=357). 메시지 0x172(370)는 string.tbl 370번 `A2Q3SuccessfulLysander`(Lysander 퀘스트 대사)이고, 크래시 순간 텍스트 `[0x7bf212]`=396은 `A2Q4SuccessfulNarrator`(저널 본문, 1009자)다. 즉 약 3분 전 AMULET 단계 doChores(13:56:58, 물약·스크롤 구매)에서 Lysander 대사가 끊겨 콜백이 남았고, 저널 텍스트가 끝날 때 실행됐다.
- 스크립트 쪽 발생 지점 후보: `Packet.openMenu`(`Misc.js:2617-2657`)는 NPC와 상호작용 중인데 메뉴(UI 0x08)가 500ms 넘게 안 뜨면 `me.cancel()`을 부른다. 퀘스트 대사 중이 이 상태다. `Unit.openMenu`(`Prototypes.js`)도 같은 구조다.
- 이전의 Malah 크래시(약 8건, identify/buyPotions 중)도 이 유형일 가능성이 높다(덤프 없음, 추정).
- 대사 텍스트가 스스로 끝나거나 클릭으로 끝나면 콜백이 실행된다(NPC 대사는 목록이 있어 안전, 오브젝트 대사는 목록이 없어 남은 콜백이 있으면 크래시). `me.cancel()`(대사 중 → `ClearScreen`)은 텍스트를 먼저 지워 콜백이 실행되지 않는다. 그래서 **오브젝트 대사는 끝나기 전에 끊는다**(blizzhackers kolbot도 같은 방식, D2BS 이력의 "summoner bug" 수정). NPC 대사 뒤 남은 콜백은 다음 NPC 상호작용 때 목록이 새로 만들어져 무해해진다. 콜백은 게임을 나가도 지워지지 않는다(0x4a0680).
- 대사 확인: `getIsTalkingNPC()`(대사 닫기 핸들러 등록 여부). UI 0x08은 D2BS에서 NPCMENU와 DIALOG가 같은 값이라 대사 확인용으로 못 쓴다. `sendClick`은 창 메시지(메인 스레드), `clickMap`/`Misc.click`은 월드 클릭 함수 직접 호출.
- 대사를 띄우는 오브젝트(objects.txt): 357 Horazon's Journal(OperateFn 42), 558 얼어붙은 Anya(67), 546 고대인 제단(65), 193 Lam Esen's Tome(28, `Misc.openChest`로 엶, 대사 여부 모름), 8 Tower Tome(6, 스크립트에서 안 씀).
- 이전 Malah 크래시(약 8건)와 고대인 크래시(몇 건)는 덤프가 없어 확정 못 함. 앤야 단계는 Malah·Anya 대사 끊기와 얼어붙은 Anya 오브젝트 대사(1초 넘게 방치)가 모여 있다. 크래시 위치는 콜백을 남긴 곳이 아니라 다음 대사가 끝나는 곳이라 제각각일 수 있다.
- 결정(260929 최종): **동작 수정 없이 로그만 둔다.** 크래시 사례가 더 모일 때까지 관찰한다. 한때 넣었던 수정(저널 리더만 읽기 0e18e15, 오브젝트 대사 즉시 끊기 `cancelObjectDialog` 0155897·2a11717)은 모두 되돌렸다. `AutoSmurf.js`는 main과 비교해 로그 함수와 `delay` 6곳의 치환만 다르다.
- 관찰 로그(trace 파일): `[OD]` = `this.watchDialog(wait)`. 저널 2곳·얼어붙은 Anya 2곳·고대인 제단·Lam Esen의 원래 `delay(wait)` 자리에서 같은 시간을 기다리며, 대사가 떴는지·몇 ms에 떴고 몇 ms에 사라졌는지 기록한다(끊지 않음). `[TK]` = 대사 중(`getIsTalkingNPC()`)에 `me.cancel()`이 불리면 NPC 이름과 호출 위치를 기록한다(`Prototypes.js` 끝의 `me.cancel` 래퍼, 원래 함수를 그대로 호출). 다음 크래시가 나면 덤프(0x661406 여부, `[0x7c0c77]` NPC 메시지·`[0x7bf212]` 텍스트 번호 → string.tbl)와 그 프로필의 trace(`[TK]`·`[OD]`)를 대조한다. 후보 수정(보류): NPC 쪽은 대화 연쇄를 끊지 않고 끝난 뒤 닫기(`Packet.openMenu` 등), 오브젝트 쪽은 대사를 즉시 끊기(blizzhackers 방식).
- 대사 시간: 소리가 꺼져 있으면(Master Volume 0) 퀘스트 대사의 `-1`(자동 속도 0xFFFF) 때문에 음성을 기다리지 않고 1~2프레임 만에 끝난다(a7 덤프: 시작 후 약 79ms). 원인 제거에는 대사 시간이 상관없다.
- 임바모드 재비교(260929, 기준: blizzhackers/d2data 커밋 116fcac = 2020년 D2R 이전 데이터, 음원 `.wav`): 바뀐 것은 시각·음향뿐이다. objects `Draw` 548행 비움, Missiles `CelFile` null 595행·클라이언트 보조 미사일·폭발·소리 제거(missiles.bin에도 null 684개), Overlay 파일 null, sounds 4542행이 `none.wav`(NPC 음성 포함), monstats `MonSound`·일부 몬스터 미사일 칸 비움, Levels 조명 최대·잡몹(cmon) 제거·LOSDraw 끔, LvlPrest Animate 끔, armor·weapons·misc의 인벤 그림·소리 칸 비움. skills·cubemain·TreasureClassEx·runes·ItemStatCost·charstats·experience 등은 같다. UniqueItems 몇 행(Azurewrath, Rainbow Facet)과 방패 mindam/maxdam 차이는 기준 데이터 판 차이일 수 있어 판단 보류. sounds.bin은 형식을 몰라 확인 못 함.
- 대사 종료 조건(0x4a0770): Master Volume(`[0x8817b0]`, 레지스트리 `Diablo II\Master Volume`)이 0이 아니고 음성이 재생 중이면 기다리고, 아니면 텍스트 스크롤(0x49d5a0, 시간 기준)이 끝나면 끝낸다. a7 덤프는 Master Volume 0, 음성 핸들 0이었다. 따라서 `none.wav` 길이와 무관하게 대사는 텍스트 스크롤만 끝나면 닫힌다. 모드의 string.tbl 대사 본문은 그대로다.
