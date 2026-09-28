# 인수인계 메모 (260928)

새 대화는 이 문서부터 읽는다. 이어서 CLAUDE.md의 분석 노트(설계·흐름·대조표·결함 현황)를 필요한 만큼 읽는다.

---

## 1. 현재 상태
- **코드:** Attack 리팩터링과 후속 수정이 모두 main에 반영되어 있다(사용자가 직접 업로드, main `5a2bc1f` 기준).
- **문서:** `CLAUDE.md`, `docs/claude/*.md`는 PR로 main에 올린다.
- **인게임 검증:** 일부만 됐다. 아래 3절의 확인 항목이 남아 있다.
- **작업 브랜치:** `claude/attack-docs`. 이 세션 환경에서는 원격 브랜치 삭제가 거부된다. 지워야 하면 사용자가 GitHub에서 지운다.

## 2. 작업 방식 (사용자와 합의한 것)
**흐름**
1. 작업을 시작할 때 브랜치를 main 최신 상태로 맞춘다(`git merge origin/main`).
2. 브랜치에서 수정한다.
3. 커밋 → 푸시 → PR을 만든다.
4. 사용자가 PR 화면에서 확인한다.
5. 사용자가 요청하면 병합한다.

**규칙** (CLAUDE.md에도 있음)
- **요청 없이 코드를 고치지 않는다.** 분석, 검토, 제안까지만 한다.
- main은 절대 직접 덮어쓰지 않는다.
- 지우지 않고 주석 처리한다. 수정 줄에는 `//YYMMDD` 표기를 한다.
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
| 3 | **주석 처리된 옛 코드 정리** | 사용자가 나중에 일괄 | `Attack.js`의 옛 clear/clearList/scanList/setPosition 본문, 죽은 함수(getIntoPosition, dodge, buildGrid, sortMonsters, sortByDistance, getScarinessLevel, getMob, openChests), `Config.Dodge.Count`, `Misc.manaCostList` 변수 |
| 4 | **소 레벨 치킨 잦음** | 개선 대상 | `followDriver`는 사용자 코드로 교체됨(30 초과 이동, 15~30 clearPath 이동, 근접 clear). 리더 쪽 `clearCowLevel`(팔로워를 기다리지 않고 방마다 이동)은 아직 손대지 않음 |
| 5 | 부활·소환형(샤먼) 우선 | 보류 | 거리순 대전제와 충돌한다. 무리 속 파고들기, 근접은 사실상 효과 없음 등 어느 안도 트레이드오프라 사용자가 보류함 |
| 6 | `lostEntry` 등 변수 이름 | 사용자가 공부 후 직접 다듬기로 함 | `attack_flow.md` 변수 사전에 표시 |
| 7 | Static 사거리 불일치 | 추후 (사용자) | `Misc.js` lvl+4 vs `Sorceress.js` |
| 8 | 18레벨 이후 `LowManaSkill = [-1, -1]` | 설계 의도 | 마나가 없으면 대체 공격 없이 기다린다. 결함 아님 |

## 5. 이번 대화에서 확정된 주요 결정 (요약)
세부는 `attack_design.md` 12절, `attack_compare.md`를 본다.

**대상 선택과 스킵**
- 대상 선택은 **거리순이 대전제**다. 예외는 목줄(MUST가 25 이상 멀어지고, 10 안에 붙은 몹이 없을 때)뿐이다.
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

## 6. 알아 두면 좋은 사실 (확인됨)
- **D2BS `me.mp`:** 실제 마나를 내림한 정수다(`JSUnit.cpp:262`, stat 8 `>> 8`).
- **D2BS `include`:** 이미 include한 파일은 다시 실행하지 않는다(`Script.cpp:308`).
- **이벤트 처리:** default.dbj의 `AutoBuild.levelUpHandler`만 레벨업 때 `applyConfigUpdates`를 한다. 다른 스레드는 `Config.js`의 별도 핸들러로 json만 다시 읽는다.
- **소수점 마나 비용:** 빌드 공격 스킬의 절반 이상이 소수점이다(Fire Bolt는 모든 레벨 2.5). 계산식은 skills.txt의 mana·lvlmana·manashift·minmana다.
- **`getPath`:** WalkPathReducer 노드 간격은 5칸 이하다. 그래서 `노드 수 × 5`는 실제 길이와 같거나 크다.
