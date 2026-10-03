# 인수인계 메모 (261003)

새 대화는 이 문서부터 읽는다. 이어서 CLAUDE.md(작업 규칙, **로그 규칙**)와 분석 노트를 필요한 만큼 읽는다.

---

## 1. 현재 상태
- **코드:** main `4f55291`(261001) 기준. 크래시·로그·포털 작업은 PR #7(`claude/funny-pasteur-4ymxd2`), 회피 재설계·스킬 사거리는 PR #8, Precast.summon은 PR #9, Pather·setPosition·상자는 PR #10·#11(`claude/pather-analysis-refactor-w9td75`, 세부는 `pather_status.md`)로 들어왔다. 각 작업의 게임 확인 항목은 아래 목록과 3절 표(10~14번)에 있다.
- **게임 밖 흐름(261001, PR #16):** 캐릭터 선택 화면 생성, 복구할 수 없는 로그인 오류에서 정지, 대기 남은 시간 표시, 게임 밖 회색 콘솔 로그(`OOGLog`). 세부는 5절 끝, 게임 확인은 3절 15~17번.
- **유형 B 크래시 수정(261001, PR #18):** NPC 메뉴를 열 때 대사 중이면 `me.cancel()` 대신 스페이스로 넘긴다(`Packet.skipTalk`/`endTalk`, `Misc.js`). 세부는 7절 끝, 게임 확인은 1절 인게임 검증 8번.
- **회피 없는 스킬·변신 쿨타임(261002):** War Cry·Shock Wave·Armageddon은 사거리 밖일 때만 접근(회피 없음), 쇼크웨이브는 5칸보다 가까운 몹에 5칸 커서로 시전, Armageddon 사거리 20, 변신 빌드에서 허리케인 선시전 안 함, `Skill.cast`의 아마게돈 변신 가드. 세부는 `attack_design.md` 12-1(쇼크웨이브 시전 좌표, 회피 없는 스킬, 변신 빌드 쿨타임), 게임 확인은 3절 20~22번.
- **콘솔 색(261002):** `Misc.quitGame`의 조기 종료 이유를 빨강 → 기본색(검정). 치킨·사망·핑 퇴장·멈춤은 빨강 유지(핑은 발생한 적 없어 그대로). CLAUDE.md 로그 규칙 갱신.
- **스킬 사거리 노트 분리(261002):** 사거리 관련 정보(공식, 미사일 데이터, 260930·261002 측정, 측정기 코드, 현재 값과 근거)는 `skill_range.md`에 모두 둔다.
- **nip 헬름 정리(261002, 사용자 지시):** X.nip의 `[Helm]` 섹션 삭제(머리글·tier 1·tier 11~20·crown 주석, `[Sell]`의 주석 줄은 유지). 빌드 nip 13종의 `[Helm & Circlet]` → `[Helm]`, tier 11~30 줄 앞부분 `[name] >= 418 && [name] <= 421 &&` → `([type] == helm || ([name] >= 418 && [name] <= 421)) &&`, 그 줄의 `[fhr]` → `[frw]`, X의 tier 1 줄을 같은 조건으로 각 빌드 헬름 섹션 맨 앞에 추가. 빌드별 스킬 점수식·warhat·sallet·tiara 줄은 그대로. V·Y·T·Z.nip은 손대지 않음. nip 파서는 조건을 `eval`하므로 괄호가 그대로 쓰인다(`tools/NTItemParser.dbl` 126줄, A.TRAP 무기 줄에도 같은 꼴).
- **바알 루프 드루이드 자리(261002):** `AutoSmurf.js` 바알 웨이브 처리의 드루이드 `Pather.moveTo(15092, 5013)` → `5018`.
- **직업 공격 기준 거리(261003, 사용자 요청):** 소서·어쌔신·아마존·드루이드·웨어폼·네크로의 `doAttack`이 그 몹에게 고른 `timedSkill`·`untimedSkill` 중 짧은 사거리(`baseRange`)를 구해 `doCast`에 넘기고, 두 스킬 모두 그 거리로 `setPosition`한다. 소서의 42·43 예외 분기(사용자 261003 업로드)는 지움. 세부는 5절 끝, `attack_design.md` 12-1, 게임 확인은 3절 28번.
- **회피 반경·SafeTele 순서(261003, 사용자 요청):** 프로즌오브가 시전마다 텔레포트하던 원인은 회피 반경 R = min(사거리, 10)이 오브 사거리 9와 같아 공격 대상 자신이 늘 R 안에 세진 것. 반영: `getMonsterCount` `<` → `<=`, `Dodge.MinSkillRange` 5 → 9, 감지·발동 반경 = min(사거리, 10) − 2(걷기·텔레 공통, 물러나는 링은 그대로: 걷기 min(사거리, 10), 텔레 사거리), War Cry·Shock Wave 접근 전용 가드 제거(사거리 9 미만이라 회피 자체가 없음). Armageddon·Static 반복 시전·네크 저주·어쌔신 덫 가드는 유지. `SafeTele.Range` 10(이제 10 이하), `SafeTele.Angle` 60 → 75, `safeCheckNode` 후보를 모두 만든 뒤 원래 타겟노드에 가까운 순(동점은 먼 링)으로 검사. 이어서 `SafeTele.Skip`에서 62~64 삭제(`[120, 132]`, 게임 확인 31번), setPosition 걷기 도착 기본 minDist 1 → 1.5(대각선 옆 칸도 도착, `attack_design.md` 12-1 걷기 도착 minDist). 세부는 `attack_design.md` 12-1 회피 반경(261003), `pather_status.md` SafeTele 후보 순서(261003), 게임 확인은 3절 29·30번.
- **디아 봉인 보스 목줄(261003, 사용자 요청):** S.FONV(걷기)가 De Seis 봉인 소환몹에 오브 2~3방 뒤 무리 한가운데로 들어간 증상. 원인(코드상 유력, trace 없음): `getBoss`의 `clear(35, name)`에서 보스가 25칸(`leashRange`) 밖이면 주변 몹이 있어도 목줄로 보스를 대상으로 바꾸고(`Attack.js:300-307`) 보스 9칸까지 우회 제한 없이 접근. 예전(260914)은 `clear(35)`만 불렀다(260927에 보스 지정으로 바뀜). 반영: 보스가 보이면 `clear(35)`로 먼저 정리하고, 보스가 살아 있고 보일 때만 `clear(35, name)`. 안 보이면 지정 호출로도 못 찾으므로 부르지 않음(`boss not found` 기록 없음). 목줄 trace는 넣지 않음. Pickit은 원인 아님(clear가 끝나야 돎)으로 결론, gid 방식 줍기는 4절 24번 재검토. 게임 확인 3절 32번.
- **보스 호출 범위·clear 끝 줍기(261003, 사용자 요청):** 보스 지정 호출 중 목줄 위험 검토(봉인 보스 외에는 도망형이 없거나 방이 좁아 문제없다고 판단). 범위: Andariel(2곳)·Izual·Shenk·Nihlathak 20 → 25, Radament·Countess 15 → 20, Blood Raven 10 → 0(죽으면 주변 소환몹도 죽어 끝 줍기 25가 유리), Summoner 10 → 0(합류 때 이미 내 10칸 안이라 주변 메이지는 위험 대상으로 잡히고, 뒤에 박스 정리·`okCount(10)`이 있음). 보스 호출의 range는 보스 위치(org) 기준 정리 반경이고 위험 반경(내 10칸)과 다르며, clear 끝 줍기 반경도 이 값(0이면 25). clear 끝 줍기: `Pickit.pickItems(range, orgx, orgy)`가 기준점을 받으면 "내 위치 원 또는 기준점 원"으로 줍게 바꾸고(기준점을 넘기던 호출부 없음), `Attack.clear` 끝에서 org를 넘김. 원본(kolton·blizzhackers)은 clear 끝 Pickit이 내 위치 기준(`PickRange`). 게임 확인 3절 33번, gid 방식은 4절 24번.
- **gid 줍기(261003, 사용자 요청):** `default.dbj`에서 `addEventListener("itemaction", Pickit.itemEvent)`. 리스너는 검사 없이 `Pickit.gidList[gid] = {gid, x, y, area}`(넣을 때의 내 위치, 이미 있으면 그대로, 이벤트 종류 필터 없음: 줍는 쪽이 아이템 mode 3·5를 직접 봄). `pickItems`: 마을이면 목록을 쓰지도 지우지도 않음. 필드면 ① 지역이 다르거나 기록 위치가 40칸 넘는 항목 삭제 ② 땅 훑기(기준점이 있으면 **기준점 원만**, #35의 "내 위치 원도"는 되돌림) ③ 목록 아이템 중 땅(mode 3·5)이고 **내 위치에서 range 안**인 것을 후보에 더함(동적: clear 끝이면 clear의 range, 기본 25, 중복 제거). 찾지 못했거나 range 밖이면 남기고, 땅이 아니면 삭제 ④ 후보는 처리가 끝나면 결과와 상관없이 목록에서 삭제(재시도 반복 방지. range 안이면 땅 훑기가 계속 봄). 마을 정리로 처리 못 한 항목은 남아 재호출 `pickItems(10)`에서 이어짐. 싸우는 중에는 줍지 않음. 손해 판단: 지금 대비 줍는 아이템이 늘기만 함(#35 대비로는 내 근처의 이벤트 없던 아이템을 땅 훑기로 안 보게 되나, 원래 org·내 위치 한쪽만 보며 놓치던 범주). 게임 확인 3절 34번.
- **사용자 수정(261002):** 모든 빌드의 회피 켜기를 18 → 25레벨로(새 `25:` 블록). `SafeTele.Min` 15 → 10(`Pather.js` safeCheckNode의 후보 거리 하한). `AutoSmurf.travel`의 진단 trace·print 3줄 주석 처리(로그 정리). `farmingCountess` 시작 좌표 조정.
- **오프셋 정리(261002, 사용자 결정):** 트리스트람 경로 순회에서 지점을 건너뛰고 마지막 지점으로 가 포탈을 타던 증상의 원인은 `myX`/`myY` 오프셋을 더한 목표에 경로가 없는 것(`getPath` 빈 배열 → `moveTo`가 움직이지 않고 false, `trist()`는 반환값을 안 봄). 좌표+오프셋 이동을 "오프셋 제거" 또는 "원래 좌표 도착 뒤 `me.x + myX` 흩어지기"로 나눔, 오프셋 8방향, 케인 대기 반복문 변경. 세부는 5절 "오프셋(myX/myY) 정리", 게임 확인은 3절 23~25번.
- **퀘스트 아이템 판정·autoEquip 칸 순서(261002, 사용자 요청):** `NTIP.Evaluate`가 `GetScore`와 같은 퀘스트 검사(`NTIP_QuestItems` → 결과 0, reason `quest`), 목록에서 피규린 546 제거, `Pickit.checkItem` 골드 부족 규칙의 퀘스트 제외를 같은 목록으로. `Equip.autoEquip`은 티어가 낮은 칸부터 교체. 세부는 4절 21·22, 게임 확인은 3절 26번.
- **`Equip.autoEquip` 칸 반복 수정(261002, 사용자 요청):** 교체 조건을 만족한 칸에서 장착이 실패해도 `break`해 다음 칸을 검사하지 않던 결함. 장착에 성공했을 때만 빠져나가게 바꿈(`Misc.js` autoEquip). 결과가 달라지는 건 실패 이유가 칸마다 다른 경우(그 칸 장비의 힘·민첩 보너스, `Equip.canEquip`)뿐이라 실질적으로 바바리안 쌍수 무기 `[4, 5]`. 반지는 요구치가 없어 해당 없음, `Grant`는 모두 한 칸.
- **웨이 누락 복구·travel 실패 처리(261002, 사용자 요청):** trace 261002 a1 Pz-28~32의 `Pather.useWaypoint: Failed to go to waypoint`(118 두 번, 117 세 번). 원인은 travel(9) 실패를 성공으로 넘긴 것과, 웨이가 없을 때의 복구가 동작하지 않은 것. 반영 3가지: `getWP`(웨이 접근 + 클릭, 활성화 여부 반환), `useWaypoint` 복구와 `journeyTo`가 `getWP` 사용, travel case 115~129 재시도 + catch 밖 throw. `goWP`와 그 호출부는 원본 그대로. 세부는 `pather_status.md` "웨이 누락 복구", 게임 확인은 3절 27번. 엑트5 진입 조건 확장(118 외 웨이도 검사)은 사용자 결정으로 보류(4절 23번).
- **마을 chores(261001):** `Town.fillTome` 골드 게이트, `Town.identify` 물건마다 감정 수단 고르기, 감정 trace. 세부는 3절 끝, 게임 확인은 3절 18~19번.
- **이번 작업(260929~260930)의 내용:** 7절에 있다. 크래시 분석(유형 A·B·C), 용병 리스너 위치, 포털·유닛·텔레포트 대기 방식, 조기 종료 이유(`Misc.quitGame`)·잡힌 오류(`Misc.caughtError`), 콘솔/print/trace 역할 분리.
- **인게임 검증:** 아직 안 됨(문법 검사만). 다음 사이클에서 볼 것:
  1. 용병 고용: trace `[MP]`에 `arrived` 뒤로 `0x4f`/`0x4e`가 찍히고 고용되는지
  2. 빨간 포털: trace `usePortal 342 changed ... loading at:` 값이 -1이 아닌지, timeout 감소
  3. 타운 이동·포털 속도가 평소대로인지, `[useUnit] timeout`(이제 trace)·`[teleportTo failed]`(trace) 감소, 몹 사이 텔레포트 멈칫 없음, 마을 텔레포트 시도(`moveTo entered town`) 확인
  4. 콘솔: 조기 종료 `이유 (지역 x,y)`(모든 프로필, 261001, 261002부터 기본색 검정), 치킨·사망은 빨강, 오류 회색(게임당 자리별 1회), 정상 종료는 콘솔 줄 없음(경험치 줄 앞에 조기 종료 줄·빨간 줄·`Error in` 줄이 없으면 정상), 치킨 뒤에도 경험치 줄(261001)
  5. 벨트 물약 `[MoveToSlot] ... FAILED slot: dropped: item:`(trace) 값으로 원인 확정
  6. 상점 `Shopped ... (not bought)`(trace)과 ItemLog 중복 기록 사라짐
  7. 용병 고용 이동 중 "D2BS is not responding" 멈춤(17:40형)이 다시 나는지 — 리스너 위치 변경이 이 가설의 대응이다(7절). 멈추면 `-h` 덤프로 메인 스레드가 D2BS 패킷 이벤트 대기 안인지 본다
  8. 유형 B 수정(261001): trace `[TK] talk skipped <횟수> npc:<이름>`이 찍히는지, `[TK] cancel during talk`(스페이스 20번 초과 뒤 예전 cancel)이 없는지, 대사 뒤 오토맵이 꺼진 채 남지 않는지, 크래시 첫 덤프가 0x661406이 아닌지
     - 결과(261001 a2 trace): `[TK] talk skipped 1`이 4건(Akara 13:59:55·14:25:36, Kashya 14:15:53, Charsi 14:29:01), 모두 스페이스 한 번에 넘어감. `[TK] cancel during talk` 0건. 같은 날 크래시(7절 6번)는 0x6494DC라 유형 B 아님. 오토맵 상태는 trace로 알 수 없어 미확인.
- **분석에 필요한 파일:** 프로필별 trace(`_cache/trace/`), d2bs 로그, 매니저 콘솔 로그, 필요하면 `_cache/ItemLog.txt`.
- **크래시 수집 방침(261001):** ProcDump는 지금 설정 그대로 둔다. 크래시가 나면 첫 덤프(접미사 없는 파일, `procdump_<PID>.log`의 PID·시각으로 고름)의 예외 주소만 보고 7절 유형으로 분류한다. 깊은 분석은 처음 보는 주소이거나 0x661406(유형 B, 우리 원인)일 때만 한다. 나머지 유형은 게임 내부라 원인을 찾아도 고칠 수 없다(Game.exe 패치는 보류). 유형 B가 한동안 안 나오면 ProcDump를 꺼도 된다.
- **임시 로그 정리 대기:** `[MP]`(용병), `usePortal 342`(빨간 포털), 벨트 물약 상세는 한 사이클 확인 뒤 삭제 후보. `[TK]` 래퍼(Prototypes.js `me.cancel`)는 유형 B 수정 확인 때까지 유지(스페이스 20번 초과 뒤 cancel을 기록). `[OD]`(`watchDialog`)는 목적(오브젝트 대사 길이 관찰)을 마쳐 삭제 후보.
- **이 세션 환경:** 원격 브랜치 삭제가 거부된다. 지워야 하면 사용자가 GitHub에서 지운다.

## 2. 작업 방식 (사용자와 합의한 것)
**흐름**
1. 수정 요청을 받으면 작업 브랜치를 main 최신 상태로 맞춘다(리셋·푸시 포함, 수정 요청에 들어 있는 준비 작업).
2. 브랜치에서 수정한다.
3. 커밋 → 푸시한다.
4. 사용자가 브랜치에서 확인한다.
5. `main` 병합은 사용자가 요청할 때만 한다. 그 밖에 내가 필요하다고 보는 커밋·PR·병합은 먼저 묻고 승인받는다(261001).
6. 노트·설명 파일(`docs/claude/*.md`, `CLAUDE.md`)은 대화 중에 쓰지 않고, 사용자가 커밋·PR·병합을 요청할 때 그때까지의 결론으로 몰아서 기록한다(261001). 세부는 CLAUDE.md "git·기록 규칙".

**규칙** (CLAUDE.md에도 있음)
- **요청 없이 코드를 고치지 않는다.** 분석, 검토, 제안까지만 한다.
- `main` 병합은 요청이 있을 때만 한다(261001, "main은 덮어쓰지 않는다" 조항은 삭제됨).
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
| 1 | okCount·teamCount 대기 중 버벅거림이 사라졌는가 | 지역 전환 후 파티 대기 장면 | `attack_status.md` 3-13. 원인이 상자 훑기라는 건 추정. 260930부터 대기 간격 1000ms(clear 호출도 반으로) |
| 2 | 레벨 6 캐릭터가 마나 부족 때 멈추지 않고 기본 공격을 하는가 | 저레벨 전투 | 3-12 |
| 3 | 드루 Molten Boulder(마나 11.5)에서 멈춤이 다시 생기지 않는가 | D.FGOM | 3-12. 다시 생기면 "캐시가 원인"이라는 추정이 틀린 것 |
| 4 | ~~벽 너머 몹 스킵, 강(0x1) 너머 장거리 우회 스킵~~ | **통과 (260930 trace 8개)** | 아래 판정. `[AC]`/`[SP]` 로그는 삭제됨 |
| 5 | ~~해머딘이 벽 너머 몹에서 헛돌지 않는가~~ | **통과 (260930)** | 해머 게이트 0x5 |
| 6 | 상자가 전투 이동 중에만 열리는가 | 이동 중 상자, 텔레 이동 | `Config.OpenChests: 2`, `popChests` |
| 7 | 18레벨 이상 캐릭터의 "Going to town" 반복이 사라졌는가 | 드루이드 등 골드 540 이상 캐릭터 | 아래 5절 열쇠 항목 |
| 8 | ~~박스 호출에서 박스 밖으로 나가지 않는가 (260929 울타리)~~ | **통과 (260930)** | `attack_design.md` 12-1 박스 울타리 |
| 9 | ~~박스 가장자리 MUST에 붙잡히지 않는가 (260929 unreachable → deferred)~~ | **통과 (260930)** | 12-1 MUST unreachable |
| 10 | 걷기 회피가 min(사거리, 10)칸 자리로 짧게 물러나는가, 텔레는 사거리만큼 (260930). 261003: 반경·회피 거리 분리(감지 R − 2), 사거리 9 미만(Tornado 등)은 회피 없음, FONV 진동은 29번으로 | 좁은 지형 소서 | 12-1 회피 거리, 회피 반경(261003) |
| 11 | Howl 15 사거리에서 헛캐스팅이 없는가 (260930) | B.WCRY | 12-1 스킬 사거리 |
| 12 | 회피가 물러나는 쪽의 몹 최소 자리로 가고, 회피 반복이 줄었는가 (261001) | FONV·D.FGOM·B.WCRY 회피 장면 | `pather_status.md` 4절 |
| 13 | Flayer Dungeon·Arcane에서 텔레 이동이 30 간격을 유지하는가 (SafeTele 뒤·실패 뒤 포함, 261001) | trace `[teleportTo failed]`, `path total nodes` | `pather_status.md` 3-1 |
| 14 | 상자 제외: trace `[chest] skip trap`의 objtype 하위 7비트가 1~8이고, `[chest] skip fire`가 불 옆 상자(1막 CorpseOnStick 등)에서 찍히는가 (261001). 트랩 없는 컨테이너 오판은 게임 코드로 없음 확인 | trace `[chest] skip` | `pather_status.md` 3-8 |
| 15 | 게임 밖 trace 줄이 `[OOG loc N]`으로 찍히는가 (261001) | `_cache/trace/` 로그인·계정 생성·키 오류 장면 | 5절 게임 밖 흐름 |
| 16 | 계정 생성 중 30 팝업 문구가 읽히는가. `(no text)`면 문구 박스 좌표 `(4, 268, 320, 264, 120)`가 틀린 것 (261001) | 콘솔·trace `Create account failed: 계정 "문구"` | 결과를 보고 4절 16번(실패 뒤 대기 시간)을 정한다 |
| 17 | 캐릭터 생성 버튼을 누른 뒤 뜨는 대기 창의 location 번호 (261001) | `Create character timeout` 줄의 `(loc N)`(타임아웃 날 때만) | 타임아웃 방식이라 몰라도 동작함 |
| 18 | 레벨 1 첫 시작에서 Akara에게 들르지 않는가(TP 책 없고 골드 400 미만), TP 책이 있고 골드 100 미만일 때도 들르지 않는가 (261001) | 첫 시작 장면(Akara로 걸어가는지, 머리 위 `initNPC: fillTome` 표시) | 3절 끝 마을 chores |
| 19 | 감정 중 멈춤이 사라졌는가. 남으면 trace `identify failed`(실패, ms)·`identify slow`(2초 이상 걸린 성공)로 원인 구분. `identify stopped`는 스크롤을 못 구해 감정 중단 (261001) | `_cache/trace/` 마을 감정 장면 | 3절 끝 마을 chores |
| 20 | War Cry(B.WCRY)·Shock Wave(D.FGOM 46+)가 몹이 붙어도 물러나지 않고 바로 시전하는가, 버벅임이 사라졌는가 (261002) | B.WCRY, D.FGOM 전투 | 12-1 회피 없는 스킬 |
| 21 | 쇼크웨이브가 붙은 몹에게 5칸 앞 커서로 나가 미사일 사이 빈틈 없이 맞히는가. Armageddon이 20칸 안 몹에서 바로 나가는가 (261002) | D.FGOM 46+ | 12-1 쇼크웨이브 시전 좌표 |
| 22 | 변신이 풀린 뒤 인간 상태 허리케인·아마게돈이 안 나가고, 변신이 막히지 않는가. 디아블로 봉인·바알 웨이브 대기에서 곰으로 변신한 뒤 아마게돈을 쓰는가 (261002) | D.FGOM 46+, 디아·바알 대기 | 12-1 변신 빌드 쿨타임 |
| 23 | 트리스트람 순회에서 지점을 건너뛰지 않는가. 전에 건너뛰던 프로필: 현재 경로 a4·a8(`25053,5189`), 이전 경로 a1·a4·a5·a8(y 5050 지점) (261002) | trace에서 Tristram `moveTo getPath -> 경로점` 다음 줄 `path total nodes: 0`이 없는지 | 5절 오프셋 정리 |
| 24 | 8방향 흩어지기: 웨이포인트·재집결 뒤 8명이 겹치지 않고 서는가, 흩어지기 이동(`me.x + myX`)에 `path total nodes: 0`이 잦은지 (261002) | 재집결 장면, trace | 5절 오프셋 정리 |
| 25 | 케인 스톤 대기(포탈 열릴 때까지)에서 각자 자리로 돌아오고, 몹이 없으면 제자리를 지키는가. 카우 팔로워가 쫓아갈 거리 밖에서 멈춰 서는 증상이 사라졌는가 (261002) | 케인 퀘스트, 카우 레벨 팔로워 trace | 5절 오프셋 정리 |
| 26 | 트라빈컬에서 리더가 Khalim's Will 착용 뒤 바닥의 Khalim's Flail을 주우려 하지 않고 바로 오브로 가는가. 피규린(546)은 지금처럼 주워지는가. 반지 교체가 티어 낮은 칸부터 되는가 (261002) | 트라빈컬, 3막 피규린, 반지 교체 로그 `Equipped [N]` | 4절 21·22 |
| 27 | 웨이가 없는 곳으로 `useWaypoint`를 부르면 걸어가서 웨이를 찍고 계속하는가(오류로 끝나지 않음). `journeyTo`가 지나가는 구역의 웨이를 찍는가. travel(9)·(10) 출구 실패가 `Travel failed: area N` 오류로 드러나는가 (261002) | trace `[getWP] ...` 줄(실패 때만), 콘솔 `Failed to go to waypoint`·`Travel failed` | `pather_status.md` 웨이 누락 복구 |
| 28 | 기준 거리(261003): S.FONV에서 번개 면역 몹에 오브(9)와 텔레키네시스가 9에서 번갈아 나가고 물러났다 붙기를 반복하지 않는가. S.SFFW 46레벨 이후 스태틱이 맞는가(스태틱 사거리에 맞춰 붙음, 50레벨 전후로 20) | S.FONV·S.SFFW 회피 장면 | 5절 끝 기준 거리 |
| 29 | 회피 반경 R − 2(261003): S.FONV 프로즌오브가 시전마다 텔레포트하지 않고, 몹이 7칸 안에 들어올 때만 물러나는가. 파이어월 등 사거리 10 이상은 8칸 안일 때만 회피하는가. D.WIND Tornado·D.FGOM Molten Boulder(25~45레벨)는 회피 없이 시전하는데 치킨이 눈에 띄게 늘지 않는가(늘면 Molten Boulder 9 또는 회피 대상 포함을 다시 논의) | S.FONV·S.SFFW·D.WIND·D.FGOM 전투, 치킨 빈도 | `attack_design.md` 12-1 회피 반경(261003) |
| 30 | SafeTele 순서(261003): 몹이 있는 노드에서 진행 방향에 가까운 자리로 옮기는가, 옆으로 크게 벗어나거나 되돌아가는 텔레포트가 없는가 | 텔레 이동 장면 | `pather_status.md` SafeTele 후보 순서(261003) |
| 31 | 매고트 굴 SafeTele(261003, Skip에서 62~64 삭제): trace `[SafeTele] teleportTo FAILED` 중 지역 62~64 줄이 얼마나 되는가. 잦으면 세이프노드 후보 검사도 보정과 같은 플래그로 | trace | `pather_status.md` SafeTele.Skip 62~64 삭제 |
| 32 | 디아 봉인 보스(261003, `getBoss`): 봉인이 풀린 뒤 원거리 팔로워가 소환몹을 먼저 정리하고, 보스를 쫓아 소환몹 한가운데로 들어가지 않는가. 봉인 보스가 남아 디아블로가 안 나오는 일이 없는가 | 디아블로 봉인 3곳(Seis·Infector·Vizier) | 1절 `getBoss` 줄, `attack_design.md` 12-1 목줄 |
| 33 | 보스 호출 범위·줍기(261003): Andariel·Izual·Shenk·Nihlathak(25), Radament·Countess(20)에서 보스 주변 몹이 남지 않는가. Blood Raven·Summoner(0)에서 보스를 먼저 잡고 주변 드롭을 줍는가. clear 끝 줍기가 org 원(보스면 죽은 자리)과 내 위치 원 둘 다를 줍는가, 멀리 있는 아이템으로 걸어가는 시간이 눈에 띄게 늘지 않는가 | 해당 보스 장면, 원거리 프로필의 보스 드롭 | 1절 보스 호출 범위 줄 |
| 34 | gid 줍기(261003): `itemaction` 리스너가 동작하는가(우리 D2BS, 원본 kolton FastPick이 쓰던 이벤트). clear 끝에 org 원 밖이지만 내 위치 range 안의 드롭을 줍는가. 마을 정리를 다녀온 뒤에도 남은 드롭을 줍는가. 엉뚱한 아이템으로 멀리 걸어가지 않는가 | 보스 장면(원거리 프로필), 경로 정리, trace 없음(눈으로) | 1절 gid 줍기 줄 |

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다.

**260930 trace 8개(a1~a8) 판정** (a4·a5는 해머딘: `[SP] detour` 0건, 해머는 setPosition을 안 거침. a7은 N.SUMM)
- 4번 통과: `[AC] drop unreachable` 3732건(Abaddon·Pit of Acheron·Infernal Pit·탈무덤 순). 같은 몹이 반복 제외된 최장은 Den of Evil Gargantuan Beast 4:14~4:15(a4 19회)인데, 이동 중 clear가 부를 때마다 다시 판정한 것이고 제자리에 묶이지 않았다. `[SP] detour` 464건, 경로/직선 비 중앙값 4.6(DetourPath 4). 이 중 118건은 `path:0`(getPath가 빈 배열)이라 "우회 과다"가 아니라 경로 없음이다(표시만 detour, 동작은 제외로 같음).
- 5번 통과: 해머딘(a4·a5)이 같은 자리에서 같은 몹을 5회 넘게 제외한 경우는 3~5초짜리(카우 레벨, 탈무덤 #6 대기 루프)뿐, 헛돎 없음.
- 8번 통과: `[SP] fence` 16건(a8 트라빈컬 4:39 Toorc 15회/2초, a2 8:19 1회). 박스 밖 자리를 걸렀고, a8은 2초 뒤 clear가 끝남.
- 9번 통과: `[AC] defer unreachable` 4건, `[AC] defer`(스킬 없음) 34건 모두 0~18초 안에 clear가 끝남(최장: 탈무덤 #2 Apparition 18초, casts 15~37). a2 8:19 Toorc 건은 18초 뒤 마을(Kurast Docktown)로 이동(end 줄 없음, TownChicken 추정).
- 빨간 포털(260930, 사용자 채택): 260926 사용자 코드의 `usePortal 342` 로그 47회(8개 프로필) 전부 102→103 성공, 1회 35·2회 9·3~5회 3, 성공은 전송 뒤 약 1초 안. → `Pather.usePortal`(시도 14회 루프는 그대로, 10회 제한은 넣었다가 사용자 결정으로 뺌) 빨간 포털 대기를 3초 고정에서 "1.5초 + 로딩 중(`me.gameReady` false)엔 끝날 때까지 대기, 재전송 안 함"으로 바꿈. 성공 판정은 로딩 뒤(`gameReady` && `me.area`) — 로딩 중 `me.area`는 undefined라 "지역 바뀜"으로 잘못 잡힐 수 있어서. 로그에 `loading at:<ms>`(로딩 시작 시점, -1이면 못 봄) 추가. 호출부(mephisto `while (me.area === 102)`)는 `getUnit(2, 342)`가 null이면 `usePortal`을 안 부름(null이면 `getPortal(null, null)`이 파티 파란 포털을 집어 3막 마을로 갈 수 있음).
- 포털·유닛·텔레포트·상점 정리(260930, 사용자 채택, d2bs 로그 8개 + trace 8개 + ItemLog 근거):
  - 원본 kolbot 대비: useUnit 3회·3초 대기 → 7회·ping×2+300ms, usePortal 대기 1→2.1초 증가 → ping×2+300ms 고정, makePortal 500ms+ → ping×2+300ms, teleportTo 3회·max(500, ping×2+200) → 10회·max(200, ping×2). 서버가 받아들인 요청도 1초 가까이 걸릴 수 있어(빨간 포털 기록), 짧은 대기는 느린 요청을 겹쳐 보내게 만들었다. useUnit 타임아웃 하루 59회(d2bs 8개). 판데모니움→해로가스 포털(`AutoSmurf.js:1408` useUnit 566)에서 로딩 중·직후 옛 유닛으로 이동·상호작용(a3 04:53:51 `dist:74`).
  - `usePortal`: 파란 포털도 대기 max(1000, ping×2+300), 빨간 포털 1500. 로딩 중(`gameReady` false)엔 대기·재전송 없음. 성공 판정은 로딩 뒤(`me.area`는 로딩 중 undefined). flash(3회마다)는 1초 뒤라 유지. 같은 액트 포털에서 `gameReady`가 false가 되는지는 근거 없음(액트 전환만 근거 있음) — 그 경우엔 1초 대기만 적용되는 셈.
  - `useUnit`: 대기 max(1000, ping×2+300) + 로딩 중 대기, 회차 시작에 "이미 넘어갔으면 끝"(옛 유닛으로 이동·클릭 방지).
  - `makePortal`: `oldGid`를 첫 시전 전에 한 번만 잡음(매 회차 다시 잡아 늦게 뜬 내 포털을 옛것으로 보고 다시 시전하던 문제). 회차 시작에 늦게 뜬 포털이 있으면 다시 시전하지 않고 씀. 대기 max(1000, ping×2+300).
  - `teleportTo`: 고정 대기 대신 `me.attacking`(시전 동작) 기준 — max(200, ping×2) 안에 시전 동작이 안 시작되면 바로 재시전, 시작됐으면 끝날 때까지 기다리고(겹쳐 시전 안 함), 끝났는데 제자리면 바로 재시전. 회차당 최대 2초. 패킷 텔레포트에서 시전 모드가 안 잡히면 예전과 같은 시간 기준으로 동작.
  - `moveTo`: `useTeleport`는 시작 때 한 번 정해진다. 텔레포트 경로가 마을로 들어가면(a2 07:53 Blood Moor → 로그 캠프, teleportTo failed 3회) 걷기로 바꾸고 걷기 경로로 다시 계산. `getNearestWalkable` 보정(7개 지역만)과는 무관.
  - 상점(`Town.js` MiniShopBot): ItemLog에 같은 아이템을 두 프로필이 같은 초에 Shopped로 기록한 쌍 4개(00:56:13 a2·a5 등) — 같은 게임 상점 공유, 먼저 산 쪽만 실제 구매. d2bs `Shopped undefined`는 그 순간 아이템이 사라져 D2BS가 못 찾은 것(`JSUnit.cpp` 191~194). 기록을 `buy()` 성공 뒤, 인벤토리에 새로 들어온 아이템으로 남기도록 바꿈. 일반 난이도 벨트 출력엔 이름을 buy 전에 잡고 실패면 `(not bought)`.
  - 벨트 물약 `MoveToSlot FAILED`(8개 로그 9회): 실패는 모두 2~3초 걸림 = 커서에서 안 내려가 1.5초 대기 후 커서 아이템을 바닥에 버리는 경로(`Storage.js`)로 추정, ItemLog엔 기록 안 됨. 실패 줄에 칸 점유 아이템·버린 아이템·물약 위치를 찍도록 함(`//260930 temp`), 자리 없어 막던 아이템을 버릴 때도 출력.
- 로그 정리(260930, CLAUDE.md "로그 규칙"): 진단성 print를 trace로 옮김 — Pather(`[useUnit] timeout`, `[teleportTo failed/skipped]`, `[SafeTele] ... FAILED`, `[WP] retry`, `[goWP] Failed`, `ArreatSummit Gate`, `journeyTo` course), Storage(`[MoveToSlot]` 전부, `[Storage.MoveTo]`), Prototypes `[DBG] drop`, CollMap(Misc 없는 스레드 대비 typeof 가드), Pickit `undefined item`, ToolsThread 물약 전달 실패, Town(`moved from cube`, 일반 난이도 벨트 `Shopped`), Merc `[hire] hiring retry`, AutoSmurf(`Travel course`, `nextAreaIndex`, getQuest(13) 디버그). 새 trace: 게임 경계(default.dbj), `makePortal late portal used / cast again`, `moveTo entered town, walk the rest`. `[AC]`/`[SP]` 임시 로그 삭제(판정 완료; `fenced` 카운터·detour 로그 블록도 삭제). 장비 줄·진행 줄은 사용자 결정으로 print 유지. 잡힌 오류는 다음 항목(`Misc.caughtError`)으로 처리됨.
- 콘솔·오류·종료 정리(260930, CLAUDE.md "로그 규칙"): `Misc.where`/`quitGame`/`caughtError` 추가(Misc.js). AutoSmurf의 quit 21곳 전부 `quitGame`으로(이유 없던 곳: syncBO timeout, Area reversed(playerIn 4곳), Malus failed, Not ready to start Duriel, Radament quest item not found, Qual-Kehk talk failed, Malah scroll not received). changeAct 실패(메뉴 4곳·전환 안 됨·예외)는 조기 종료로 바꿈 — 콘솔 `changeAct N failed`, 단계는 trace. playerIn 관문 유지, 120초 초과는 `Players not in after act change`(각자 — 걸린 쪽이 리더일 수 있어 기다린 쪽이 찍음. `Team didn't join`, `syncBO timeout`도 같은 이유로 각자. `Area reversed`는 전원이 같은 자리라 리더만(→ 261001 폐지, 아래). 안 온 사람 이름은 넣지 않음, 사용자 결정). `Mephisto failed`·`Diablo not found`는 콘솔만 있던 것을 quit으로. 잡힌 오류 37곳(AutoSmurf 28, Town 8, Pather 1)을 `caughtError`로. `errorReport`의 showConsole+print 제거, trace 추가. 치킨·핑 콘솔 줄 형식 통일(`Life Chicken 955/3072 (지역 x,y)`) + trace. `BOed` print 삭제. 구간 헤더 43곳 trace에도. `Script ended` 콘솔은 리더만·조기 종료 없을 때만(→ 261001 콘솔에서 뺌, 아래). Attack.clear: 보스 지정인데 한 번도 못 보면 trace `boss not found`(동작 그대로, clear는 여전히 true).
- 로그 정리 2(261001, PR #13·#14): 목표는 "누가 나가든 나간 사유가 콘솔에 한 줄 이상". `Misc.quitGame`의 세 번째 인자(리더만 콘솔) 삭제 → `Area reversed` 4곳·`Mephisto failed`·`Diablo not found`도 각 프로필이 찍음(동시에 여러 줄 감수). `Script ended`는 콘솔에서 빼고 print·trace만(게이트 `quitReason` 유지: `quitGame`은 바로 끝내지 않아 끝 직전 `diablo()`의 `Diablo not found` 뒤 `Script ended`가 이어질 수 있음). 정상 종료 판단은 경험치 줄 앞에 빨간 줄·`Error in` 줄이 없음. 치킨 4곳(Life/Mana/Iron Golem/Merc)도 나가기 전 `Experience.log()`. AttackSkill 미습득 멈춤은 trace에도. PartyThread `party has left`는 print만(나간 쪽이 사유를 찍으므로). 팔로워 끝 대기는 넣었다가(#13) `Script ended` 콘솔 제거로 목적이 없어 뺌(#14). 콘솔 줄이 안 남는 남은 경우: 엔진 MaxGameTime(시간 만료라 정상으로 봄, 철회 — 발견되면 엔진 값 0 + ToolsThread 검사), `default.dbj` try 밖 초기화 예외(게임 시작 직후만), 서버 끊김·Numpad 0(불가·수동), 크래시·not responding(매니저 줄로 구분).
- okCount·teamCount 대기 간격 500 → 1000ms(260930 사용자 요청). 120초 타임아웃은 시간 기준이라 그대로.
- 참고(1번 관련): 같은 자리에서 `[AC] end casts:0`이 10회 이상 이어진 대기 구간 845개, 합계 약 9000초. 최장은 카오스 생추어리·증오의 억류지 3층·Frozen River 등 팔로워 대기 루프(최장 121초, 초당 약 2회 clear 호출). 설계상 대기 중 방어이며, 버벅거림 여부는 trace로 판단 불가.

**261001 Pather·setPosition·상자 (작업 브랜치 `claude/pather-analysis-refactor-w9td75`, 사용자 요청으로 코드 반영)**
- 반영: 7개 지역 텔레 간격 30을 모든 텔레 경로에(`Pather.getTeleDistance`, setPosition 한 번 텔레 한계는 35 그대로), `SafeTele.Count` 삭제(몹 1마리부터 발동), setPosition 회피는 구역(물러나기 → 반대편) 안 몹 수 최소.
- 기각·유지: SafeTele 0x4 시야 검사(기각), setPosition 자리 기억(탈락), `"killMonsters"` 반환(유지), Warriv 1막 경유(의도).
- 기각: SafeTele를 clearPath true 이동에서 끄기(`pather_status.md` 3-6).
- 반영: 상자 제외 — 트랩 전부(`objtype & 0x7F`, `explodingchest`), 불 옆(같은 `getUnit(2)` 루프에서 fire 수집, 반경 4)(`pather_status.md` 3-8).
- 기각·보류: journeyTo throw, 죽은 코드(`cleared`·`MainLoop:`·`j`/`wp`), PathDebug, `NodeAction.go`의 `prevNode` 주석 규칙, `moveTo`의 `errorReport //260922 temp`.
- 실수 기록: 결정을 요청으로 보고 코드를 고쳤다가 되돌림(`8c33a7b`). CLAUDE.md 작업 규칙에 "결정은 요청이 아니다" 추가.

**261001 마을 chores: fillTome·identify (사용자 요청으로 코드 반영, `libs/Town.js`)**
- `fillTome` 헛걸음: TP 책이 없으면 `checkScrolls(518)`가 0이라 5 게이트를 지나고, 골드 검사 없이 `initNPC`로 Akara에게 갔다. 레벨 1(골드 0)은 살 것이 없어 헛걸음. 이동 단계(`AutoSmurf.js` Travel의 `Town.fillTome(518)`)에서도 반복.
  - 반영: `initNPC` 앞 TP 전용 게이트 — TP 책 없음 + 골드 400 미만, 또는 TP 책 있음 + 골드 100 미만(TP 스크롤 값 100, 사용자 확인)이면 `return false`. 낱장 TP 스크롤을 세고 사던 분기(골드 400 미만·책 없음)는 게이트 때문에 도달할 수 없어 삭제(사용자: 책 없이 낱장 사는 건 의미 없음). 그 분기는 `itemType 22`를 세서 ID 스크롤도 TP로 셌다.
  - 첫 시작 `doChores(true)`의 다른 단계(gamble·buyKeys·reviveMerc·heal·identify·buyPotions·repair·stash)는 레벨 1(1막, 골드 0)에서 NPC를 방문하지 않음을 코드로 확인.
- `identify` 감정 멈춤(사용자 관찰: 감정 때 멍때림): 감정 전 `tome = me.findItem(530) || me.findItem(519)`를 한 번만 정하고, 루프에서 `tome`이 있으면 상점 구매(`else`)로 가지 않았다. 인벤토리에 낱장 ID 스크롤 1장이 있으면 첫 물건만 감정, 이후 물건은 없어진 스크롤로 `Misc.identifyItem`(PacketShopping) 패킷을 보내 커서 대기 2초×3 ≈ 6초씩 헛기다리고 미감정으로 남음(다음 방문 때 감정). 낱장이 남는 경로: nip은 ID 스크롤을 줍지 않으므로 시작 아이템(추정)과, 산 스크롤로 감정에 실패한 경우(스크롤 미소모, 그 감정 안에서는 `me.findItem(530)`이 쓰지만 새로 1장을 또 사서 1장이 남음). 멈춤의 원인으로 확정한 것은 아님(코드 추론).
  - 반영: 감정 전 `tome`·`fillTome(519)` 삭제. 물건마다 고름 — ID 책 충전 있음(0이면 `fillTome(519)` 후 다시) → 인벤토리 낱장 ID 스크롤 → 상점 1장 구매(공간 없으면 TP 책 판매, 기존 그대로) → 없으면 `break MainLoop`. ID 책을 쓸 때의 5 게이트 문제(충전 6·물건 8이면 채우지 않음)도 해소. 현재는 ID 책 안 씀(물건마다 낱장 구매).
  - trace: `identify failed: 이름 (scroll|tome, Nms)`, `identify slow: 이름 (scroll|tome, Nms)`(성공했지만 2초 이상), `identify stopped: no ID scroll for 이름 (gold N)`. `Misc.identifyItem`은 성공해도 최대 약 12초 걸릴 수 있어 slow로 구분.
- 그대로 둠: `repair`의 shopItems 방문(노멀 2막 이상 `doChores(true)`면 골드와 무관하게 수리 NPC 방문, `Town.js` repair 앞부분) — 4절 18번.

## 4. 미결 작업 (사용자 결정 또는 확인 후)
| # | 작업 | 상태 | 메모 |
|---|---|---|---|
| 1 | ~~NoSkipArea 키와 조건 제거~~ | **완료 (260929)** | 로컬 `[]`로 1막~헬 파밍 한 사이클 문제없음(사용자 확인) → 제거. 제거할 곳: `Config.js` 키, `Attack.js`의 306 스킵·unreachable 즉시 제외·HP 스킵 조건 3곳, `Paladin.js` 해머 게이트 조건. 조건에서 `Config.NoSkipArea.indexOf(me.area) < 0 &&`만 빼면 동작은 같다 |
| 2 | **임시 로그 정리** | 일부 완료 | `[AC]`/`[SP]` 삭제 완료(260930). 남은 것: `[MP]`(Merc.js), `usePortal 342`(Pather.js, `//260930 temp` — 260926 사용자 redPortal 로그를 대신함), `[MoveToSlot]` 실패 상세(Storage.js) → 한 사이클 확인 뒤 삭제 후보. `Misc.js`의 `[chest] skip` trace(`traceChestSkip`, `//261001 temp`)도 확인 뒤 지운다. `ToolsThread.js`의 미사일 사거리 측정기(Numpad 5, `[MM]`, `//260930 temp`)도 측정이 끝나면 지운다(261002 미사일별 끝 좌표·퍼짐 출력과 쇼크웨이브 자동 측정 Numpad 6 `[MS]`는 사용자 로컬에만 있고 저장소에는 없음). `[TK]`(Prototypes.js `me.cancel` 래퍼) → 유형 B 수정 확인 때까지 유지. `[OD]`(AutoSmurf `watchDialog`) → 삭제 후보(261001) |
| 3 | ~~주석 처리된 옛 코드 정리~~ | **완료 (260929)** | JS/dbj/dbl 32개 파일에서 주석 처리된 옛 코드와 `/* */` 옛 코드 블록, 롤백용 머리글을 지움(Attack.js 2500 → 1349줄). 주석을 뺀 코드 토큰이 정리 전과 같음을 확인. nip·Config.js·builds의 꺼 둔 옵션과 설명 주석·날짜 표기·줄 끝 메모는 유지. 이전 코드는 커밋 `fcd2713` |
| 4 | **소 레벨 치킨 잦음** | 개선 대상 | `followDriver`는 사용자 코드로 교체됨(30 초과 이동, 15~30 clearPath 이동, 근접 clear). 리더 쪽 `clearCowLevel`(팔로워를 기다리지 않고 방마다 이동)은 아직 손대지 않음 |
| 5 | 부활·소환형(샤먼) 우선 | 보류 | 거리순 대전제와 충돌한다. 무리 속 파고들기, 근접은 사실상 효과 없음 등 어느 안도 트레이드오프라 사용자가 보류함 |
| 6 | `lostEntry` 등 변수 이름 | 사용자가 공부 후 직접 다듬기로 함 | `attack_flow.md` 변수 사전에 표시 |
| 7 | Static 사거리 불일치 | 추후 (사용자) | `Misc.js` `Skill.getRange(42)`는 lvl+4, `Sorceress.js` 스태틱 선시전 루프는 (lvl+4) × 2 / 3 (260929 사용자가 × 2 / 3으로 되돌림) |
| 8 | 18레벨 이후 `LowManaSkill = [-1, -1]` | 설계 의도 | 마나가 없으면 대체 공격 없이 기다린다. 결함 아님 |
| 9 | **while + catch 무한 루프** | 보류 (260930 사용자: 기록만) | `AutoSmurf.js`의 `while (목표까지 거리 > N) { try { moveToPreset/moveTo/moveToExit } catch { print } }` 10곳(1197 Arcane, 1277 moveToExit, 1475 WP, 3007 Cube 상자, 3181·6545 저널, 3376 탈무덤 상자, 3557, 3681 Orifice, 4317 빨간 포털)은 탈출 조건이 없다. 경로 계산이 계속 실패하면 같은 자리에서 무한 반복. 줄 번호는 260930 기준 |
| 10 | 재시도 실패 구간을 quit 대신 "그 구간만 건너뛰기" | 보류 (260930) | Malus(30회), Qual-Kehk(5회), Malah(10회) 등. 뒤 구간이 그 퀘스트에 기대는지 하나씩 봐야 해서 동작 변경으로 따로 검토. leveling 구간(Andy·Tombs)의 quit → return은 하지 않기로 함(Tombs는 return하면 두리엘로 넘어감) |
| 11 | ~~NPC 대사 끊기 근본 수정(유형 B 크래시)~~ | **완료 (261001, PR #18), 게임 확인 대기** | 7절 끝. 대사 중이면 스페이스로 넘긴다. 처음 넣은 "대사가 끝날 때까지 기다리기"(`b2a396f`)는 NPC 대사가 수 분 걸릴 수 있어 바꿨다. "대사가 보이면 조기 종료"는 콜백이 게임을 나가도 남아 효과가 없다 |
| 12 | 디아 판정 위치 | 사용자 결정: 지금대로 | `Diablo not found`는 봉인 단계(diabloPrep)에서 바로 quit. 예전엔 그 뒤 `Attack.clear(0, 243)`으로 한 번 더 찾았음 |
| 13 | `alkor error`가 로그 규칙 밖 | 그대로 둠 (261001 사용자: 발현 없음, 메모만) | `Town.moveToSpot`(`Town.js:2134-2142`, 첫 업로드부터 있던 `//eom` 코드). 알코어 자리(`[5083, 5016]`)로 `Pather.moveTo` 한 번이 90초 넘게 걸리고 알코어가 안 보일 때만 난다(빨리 끝나면 오류 없이 false → `Town.move`가 flash 후 3회 재시도). 알코어 가는 길이 미로형이라 넣은 것으로 사용자 추정. `quit()` 직접 호출이라 `(지역 x,y)`·trace·`quitReason`이 없다. 바꾸면 `Misc.quitGame("alkor error")`. 호출: 도박 `Town.move(NPC.Alkor)`(`Town.js:162`), 피규어린 `Town.move("alkor")`(`AutoSmurf.js:3843, 3863`) |
| 14 | `Failed to get corpse, stopping.`이 로그 규칙 밖 | 그대로 둠 (261001 사용자: 발생한 적 없음, 메모만) | `Town.getCorpse`(`Town.js:1540-1542`) 30초 넘게 시체를 못 주우면 빨간 콘솔 + `D2Bot.stop()`. trace 없음, `(지역 x,y)` 없음 |
| 15 | `makeAccount` 대기 창 처리 | 보류 (261001) | 30초 전체 타임아웃이 잡는다. 대기 창에서 취소 클릭·대기는 없음 |
| 16 | 계정 생성 실패 뒤 대기 시간 | 보류 (261001) | 지금은 실패하면 바로 재시작. 3절 16번 문구를 보고 복구되는 실패(대기 후 재시작)와 안 되는 실패(정지)를 나눈다 |
| 17 | 로그인 대기 창 무한 대기 | 기각 (261001) | 내장 `login()`(D2BS 엔진) 안이라 손댈 수 없다. JS 교체는 비밀번호를 얻을 방법이 없어 기각, 감시 스레드도 기각. 24 서버 다운 처리도 기각 |
| 18 | `repair`의 shopItems 방문 골드 검사 | 그대로 둠 (261001 사용자) | 노멀 2막 이상에서 `doChores(true)`면 골드와 관계없이 수리 NPC에 가서 벨트를 훑는다. 살 수 있는지는 도착 뒤 `shopItems`에서 본다 |
| 19 | `Wereform.js` 쇼크웨이브 경로의 인간 상태 + 121 멈춤 | 그대로 둠 (261002) | 121 중이면 timed가 아니라 untimed(쇼크웨이브)로 가는데 그 앞의 `shapeShift`가 121에 막혀 2초 × 3 헛시도 뒤 인간 상태로 쇼크웨이브 시도(곰 전용이라 거부될 것으로 추정). 허리케인 차단·아마게돈 가드로 원인 대부분이 없어져 고치지 않음 |
| 20 | 스킬 사거리 열린 질문 | 측정 대기 | `skill_range.md` 5절: Howl 레벨 스케일링, 충돌 판정식, Armageddon 효과 범위 (War Cry는 261002 측정 완료: 미사일 64개 원형, 5.4~6.3) |
| 21 | ~~퀘스트 아이템 줍기 판정 정리 (261002)~~ | **반영 (261002, 사용자 요청)** | 증상: 트라빈컬에서 리더가 Khalim's Will(174) 착용 뒤 `equipFlail`의 `Pickit.pickItems`가 바닥의 Khalim's Flail(173, 방 인원수만큼 떨어짐)을 3회 주우려다 실패하고 오브로 감. 경로: S.SFFW.nip 티어 규칙 `[type] == mace` 등에 걸림(퀘스트 제외가 `NTIP.GetScore`에만 있고 `NTIP.EvaluateItem`엔 없음, 173 종류가 mace라는 전제는 데이터 미확인) → `canPick`은 173 보유만 봄. 결정: ① `NTIP.Evaluate` 맨 앞에 `GetScore`와 같은 퀘스트 검사(`NTIP_QuestItems` → 0) ② `NTIP_QuestItems`에서 546(피규린) 제거(피규린은 `X.nip:156`으로 줍는 유일한 퀘스트 아이템) ③ `Pickit.js:73` 골드 부족 규칙의 `classid !== 90`을 `NTIP_QuestItems.indexOf(classid) === -1`로 ④ `canPick`은 그대로. NPC가 주는 퀘스트 아이템(86·550·551·644·646)은 목록에 넣지 않음(바닥에 안 떨어짐). 기각: `GetScore`/`autoEquip`에 힘·민첩 보너스 빼기 추가(`Equip.canEquip`·`Grant.canEquip`이 이미 칸별로 뺌) |
| 22 | ~~`autoEquip` 교체 칸 선택 (261002)~~ | **반영 (261002, 사용자 요청)** | 칸이 둘인 장비(반지 `[6, 7]`, 바바리안 쌍수 무기 `[4, 5]`)에서 교체 조건을 처음 만족하는 칸을 골라 가장 낮은 칸을 고르지 않던 것. 칸 반복 전에 `bodyLoc`을 지금 장비 티어 오름차순으로 정렬(`getEquippedItem`은 현재 착용 상태를 읽음, 빈 칸 −1이 먼저). `Grant`는 모두 한 칸이라 그대로 |
| 23 | 엑트5 travel(9) 진입 조건 확장 | 보류 (261002 사용자) | `AutoSmurf.js` 엑트5 진입의 `Leader && !getWaypoint(37)`은 118 웨이만 본다. 118만 있고 115·117이 비어도 travel(9)가 다시 돌지 않는다. 지금은 빠진 웨이를 쓰는 시점에 `getWP`가 찍어서 오류는 안 난다 |
| 24 | ~~gid 방식 줍기~~ | **반영 (261003, 사용자 요청)** | 1절 gid 줍기 줄. 남은 확인: 게임 확인 34번. 원본 `Pickit.js:181` 주석 "마을 다녀온 뒤 gid가 바뀔 수 있어 목록을 다시 만든다"가 있다. 바뀐다면 그 gid는 찾지 못해 남았다가 지역·40칸 정리로 지워질 뿐이라 해는 없음(추정) |

## 5. 이번 대화에서 확정된 주요 결정 (요약)
세부는 `attack_design.md` 12절, `attack_compare.md`를 본다.

**대상 선택과 스킵**
- 대상 선택은 **거리순이 대전제**다. 예외는 목줄(MUST가 25 이상 멀어지면 바로 그 MUST)뿐이다. 260929에 "10 안에 붙은 몹이 없을 때" 조건을 뺐다.
- MUST는 포기하지 않는다. 쓸 스킬이 없거나 칠 자리가 없으면(unreachable, 260929) deferred(뒤로 보내기)한다.
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

**박스 울타리 (260929)**
- 박스는 대상 필터보다 "박스 밖으로 나가지 않기"가 주 목적이다(사용자). `clear`가 박스 호출이면 `tick.box`를 채우고, `setPosition`은 박스 밖 착지 자리를 후보에서 뺀다(접근·회피 공통). 도착 좌표만 검사하고 경로는 따지지 않는다. 우회는 같은 후보 좌표에 가는 방법(moveTo)만 다를 뿐 별도 좌표 판정이 없다.
- 모든 박스 호출에 자동 적용(새 인자·함수 없음). 해머는 설 자리가 몹 옆 5칸 이내이고 회피가 없어 제외.
- 함께 바꾼 것: MUST unreachable을 flash 후 재선택 → deferred. 바바리안 선공격(Howl 사거리 밖) setPosition 실패 시 `return 0` (남은 `tick.fail` 때문에 본공격 성공 틱이 unreachable로 판정되던 것). NoSkipArea 제거.

**Pather 이동의 pop 인자 (260929)**
- `pop`은 경로의 마지막 노드를 지워 목적지 한 노드 앞(걷기 약 5칸, 텔레 최대 약 35칸)에서 멈추게 한다(`Pather.moveTo`). `Pather.js`는 건드리지 않고 AutoSmurf 호출부에서만 정한다.
- 규칙: **기본은 pop 없음.** 순수 이동으로 **몬스터에게 다가갈 때만**(바로 붙지 않게) pop을 쓴다. 텔레도 걷기와 똑같이 적용한다. 위치 선정·재집결(clear 뒤 재이동, `myX`/`myY` 자리, 오프셋으로 설 자리를 정한 이동)은 pop 없음.
- 현재 pop=true: Blood Raven 묘지(`moveTo`), Treehead 나무 첫 이동(738), Rakanishu 스톤 첫 이동(737, cain·trist). clear 뒤 재이동(나무·스톤·trist·Countess 580)은 pop을 뺐다.
- 뒤에 붙은 기본값 인자(오프셋 0, clearPath false, pop false)는 쓰지 않는다.

**오프셋(myX/myY) 정리 (261002, 사용자 결정·요청으로 반영)**
- 원인(trace a1~a8 확인): 좌표+오프셋 목표가 내 위치와 이어지지 않는 구역이면 `getPath`가 빈 배열을 돌려주고, `moveTo`는 한 걸음도 안 움직이고 false를 돌려준다(6절 getPath). 트리스트람 a4·a8 `25058,5184`(=`25053,5189` + (5,−5)), 이전 경로 a1·a5 `25045,5045`·a4·a8 `25055,5045` 등. 같은 지점을 다른 오프셋 프로필은 매번 정상 이동.
- 경위: 예전엔 "검증된 좌표로 이동 → `me.x + myX`로 흩어지기" 두 단계였고, 이를 한 번의 `좌표 + myX` 이동으로 합치면서 흩어질 자리를 확인하지 않게 됐다. 오프셋은 플레이어끼리 몸으로 막히는 것을 피하려는 것(사용자).
- 기준: **바로 뒤에 `okCount` 대기가 있으면** 원래 좌표로 간 뒤 `Pather.moveTo(me.x + myX, me.y + myY);`로 흩어진다. **바로 뒤에 다시 움직이면**(경로 순회, 반복 이동, 포탈 타기, 스톤 열기) 오프셋만 뺀다. 흩어지기가 실패해도 원래 좌표에 선다(예전 두 단계와 같음).
- 오프셋만 제거: trist 경로(2341), 디아블로 `followPath`, 메피 해자 `17515,8061`(2곳), smith 반복 이동, tombs 상자 반복 이동, 레드포탈 3종(Abaddon·POA·Infernal: 반복 이동 뒤 바로 포탈, 오프셋 자리에 경로가 없으면 180초 동안 제자리였음), 카우 `followDriver` 5곳(드라이버에 몰려도 일단 제거, 사용자), 스톤 737 첫 이동·trist 마지막 이동.
- 도착 뒤 흩어지기: andy·farmingAndy 포탈 앞, smith 마지막, 트라빈컬(+109·−95 고정 오프셋 유지), 메피 다리 `17566,8069`(2곳), 디아블로 별 중앙(2곳), 에인션트(2곳), 3막 마을 `5148,5066`, farmingCountess 580, farmingNihlathak 462.
- 케인 스톤 대기(열쇠 없는 캐릭터): 흩어지기 → 자리 저장(`spot`) → `while (!getPortal(38)) { clear(20); moveTo(spot); }`. 반복문 안의 `moveToPreset(737 + 오프셋)`은 제거. 몹이 없으면 clear가 이동 없이 끝나고 `moveTo(spot)`은 2칸 안이라 바로 끝남 → 제자리.
- 오프셋 값: 8방향 5칸, 프로필 번호(`Team.Profiles` 순서) 기준 `1 2 3 / 8 · 4 / 7 6 5`(1번 좌상부터 시계방향, x 오른쪽·y 아래가 +). a1 (−5,−5), a2 (0,−5), a3 (5,−5), a4 (5,0), a5 (5,5), a6 (0,5), a7 (−5,5), a8 (−5,0). 순번은 `myPos = Team.Profiles.indexOf(me.profile)`(0~7) 하나로 합쳤다: `myX`·`myY`는 `myPos % 8`로 표에서 고르고, 알코르 보상 대기는 `((Team.Profiles.length - 1 - myPos) % 4) * 15000`(뒤집은 순번, 리더 a1이 마지막 — 예전 `reverse().indexOf % 4`와 같은 순서: a4·a8 0초, a3·a7 15초, a2·a6 30초, a1·a5 45초). 프로필 이름이 목록에 없을 때의 방어는 두지 않는다(그 경우 `Build.getBuildType`부터 실패).
- 그대로: `me.x + myX` 흩어지기 34곳(값만 8방향), Pather·Attack. 기각: Pather `moveTo` 안의 대체 좌표(setPosition 등 다른 이동까지 바뀜), `getNearestWalkable`로 대체 칸 찾기(걸을 수 있는지만 보고 닿을 수 있는지는 못 봄, 벽 건너편 칸 오판), 좌표만 고치기(좌표가 바뀌면 다시 생김).

**게임 밖 흐름 (261001, PR #16)** — Lead·Follow 공통
- 캐릭터 선택 화면(12): `login()`이 실패하고 목록(`findCharacter`, 24칸)에 프로필 캐릭터가 없으면 `AutoCreate.character`로 생성한다(12도 받음). 슬롯 가득 참 → 정지. 이름 중복 뒤에도 없으면 → 정지. `makeCharacter`가 처리하지 않는 화면에 1분 → 취소 후 재시도(대기·횟수 제한 없음). 계정·캐릭터 정보 없음 → 정지.
- 로그인: 재시도(`loginRetry` 2회) 소진 → 정지. 비밀번호 틀림 → 정지(예전엔 무한 대기). 나쁜 CDKey(다른 제품용·Disabled·Disabled LoD·22 잘못된 키·42 렐름 차단)는 키 교체 켜짐이면 기존대로 교체 재시작, 꺼짐이면 정지(`badKey`).
- 대기값: `RetryKeyDelay` 30초, `RealmDownDelay` 5분. 키 사용 중 1분·연결 불가·R/D Blocker 동작·Starter의 16/21/25 처리는 그대로.
- 남은 시간 표시: 계정 생성 전 대기(`timeoutDelay`), `makeAccount`(30초), `makeCharacter`(1분, 멈춘 화면에서만), `locationTimeout`(화면 이름은 `OOGLog.names`). 끝난 뒤 덮어쓰지 않는다.
- 로그: 게임 밖 콘솔은 모두 회색, 형식 `사건: 대상 - 처리 (loc N)`(CLAUDE.md). `OOGLog.print`/`OOGLog.stop`(`tools/OOG.js` 끝)이 같은 줄을 trace에 남긴다. `Misc.trace`는 게임 밖이면 `[OOG loc N]`. 10·30 화면 문구는 `ControlAction.readText`로 읽는다.

**261003 직업 공격 기준 거리 (사용자 요청으로 코드 반영, `libs/Attacks/*.js` 6개)**
- 문제: 같은 몹에게 타임드와 언타임드의 사거리가 다르면 회피(텔레는 사거리 지점에 착지)로 두 거리를 오간다. 예: S.FONV 번개 면역 몹에 오브 9 ↔ 텔레키네시스 20. 사용자가 소서에 42·43 예외(`AttackSkill[1]` 사거리)를 넣었으나 스태틱이 주력보다 짧으면 20에서 쏴 헛방(S.SFFW 46~49레벨).
- 반영: `baseRange = min(고른 timedSkill 사거리, 고른 untimedSkill 사거리)`(-1은 제외, 로우마나 교체 뒤 계산). 타임드·언타임드 모두 `setPosition(unit, baseRange)`. 소서·어쌔신·아마존(라이트닝 퓨리 포함)·드루이드·웨어폼·네크로(포이즌 노바 포함).
- 결정: 면역 몹은 자기가 맞을 수 있는 스킬 거리에 선다(B안). 빌드 자리 기준으로 모두 같은 거리(A안)는 면역 몹에 못 쓰는 스킬 거리까지 붙어 위험해 기각.
- 그대로 둠: 다가가기만 하는 스킬(Howl `[0]`, War Cry, Armageddon·Shock Wave는 자기 사거리), 자체 위치 스킬(휠윈드, 해머, 드루 229·240·245, 서모너 500, 어쌔신 덫·클로크, 보류), 바바리안·팔라딘(한 틱에 스킬 하나라 결과 같음), 네크로 `doCast`의 `break`(원본 kolton·blizzhackers도 같음: 한 틱에 타임드와 언타임드를 둘 다 시전).
- 남는 것(사용자 수용): 면역 몹이 섞인 무리에서 몹이 바뀔 때 거리가 바뀌는 진동(대부분 원래 있던 것. S.SFFW 46~49레벨 12/20은 새로 생김, 스태틱이 맞는 대가). `LowManaSkill` 근접 공격 진동(1~17레벨, 마나 상태로 생김).
- 효과: 타임드 원거리 + 언타임드 근접 조합은 근접 거리에 고정(진동 없음). 사거리 값은 서로 맞출 필요가 없고 정확하기만 하면 된다.
- S.SFFW 스태틱 레벨(스킬 분배 모의, `AutoBuildThread.spendSkills` 규칙, 선행·요구 레벨은 기억한 skills.txt 값): 46레벨 8(사거리 12), 48레벨 14(18), 50레벨 16(20), 52레벨 17(21). 보너스 46레벨까지 4, 48레벨까지 8 가정. 43~46레벨은 에너지 실드 선행 4점 때문에 정체.

## 6. 알아 두면 좋은 사실 (확인됨)
- **D2BS `me.mp`:** 실제 마나를 내림한 정수다(`JSUnit.cpp:262`, stat 8 `>> 8`).
- **D2BS `include`:** 이미 include한 파일은 다시 실행하지 않는다(`Script.cpp:308`).
- **이벤트 처리:** default.dbj의 `AutoBuild.levelUpHandler`만 레벨업 때 `applyConfigUpdates`를 한다. 다른 스레드는 `Config.js`의 별도 핸들러로 json만 다시 읽는다.
- **소수점 마나 비용:** 빌드 공격 스킬의 절반 이상이 소수점이다(Fire Bolt는 모든 레벨 2.5). 계산식은 skills.txt의 mana·lvlmana·manashift·minmana다.
- **`getPath`:** WalkPathReducer 노드 간격은 5칸 이하다. 그래서 `노드 수 × 5`는 실제 길이와 같거나 크다.
- **D2BS `getPath`(261002, noah-/d2bs 소스):** kolbot은 `getPath(area, 목표x, 목표y, 내x, 내y, ...)`로 불러 엔진 안에서는 목표가 출발점이다(`JSGame.cpp` `my_getPath`). 출발·도착 칸이 막혔으면 `MutatePoint`가 ±2칸에서 주변까지 빈 칸으로 옮기고(`WalkPathReducer.h`), A*는 출발 칸 자체를 검사하지 않는다(그래서 물체 칸 목표도 경로가 나온다). 열린 칸이 바닥나면(목표 구역이 내 위치와 이어지지 않거나 레벨 맵 밖, `ActMap`은 맵 데이터 없는 칸을 Avoid로 봄) **빈 배열**을 돌려준다. kolbot `moveTo`의 `if (!path)`는 빈 배열을 거르지 못해, 반복문을 안 돌고 false로 끝난다(trace `path total nodes: 0`).
- **D2BS 유닛 속성:** 읽을 때마다 ID로 유닛을 다시 찾고, 못 찾으면 `undefined`(`JSUnit.cpp` 186~194). `me.area`는 로딩 중 undefined. `me.gameReady`는 방 정보가 없거나 갱신 중이면 false(액트 전환 중 false는 근거 있음, 같은 액트 포털은 근거 없음).
- **최소 게임 시간:** 게임 안 `Config.MinGameTime` 300초는 정상 종료(default.dbj)에서만 마을에서 대기. 로비 `StarterConfig.MinGameTime` 60초는 리더(D2BotLead)만, 60초보다 짧은 게임일 때. quit은 바로 나감.
- **경험치 로그:** ToolsThread가 `quit` 메시지를 받을 때 찍음(정상·조기 종료 모두). 치킨도 나가기 전에 찍음(261001).
- **리더:** a1(`Creating Game`은 리더만 남김). 260930 리더 치킨 8/59게임(팔로워 전원 동시 종료), 사용자: 무시.
- **상점:** 같은 게임의 상점 목록은 공유. nip이 겹쳐 두 프로필이 같은 아이템을 노릴 수 있음(먼저 산 쪽만 구매).
- **콘솔 색(D2Bot#):** 4 파랑, 5 초록, 6 노랑, 7 금색, 8 주황, 9 빨강, 10 회색, 생략 시 검정. print 색은 `ÿc0` 흰, `ÿc1` 빨강, `ÿc2` 초록, `ÿc3` 파랑, `ÿc4` 금색, `ÿc5` 회색, `ÿc6` 검정, `ÿc7` 황갈, `ÿc8` 주황, `ÿc9` 노랑, `ÿc:` 짙은 초록, `ÿc;` 보라.
- **ProcDump:** `-e -h -n 10`. 한 크래시에 덤프가 여러 개 생기면(D2BS exit0 버그로 반복 예외) 첫 파일(접미사 없음)만 보면 된다. 261001 6건은 모두 첫 덤프에 원래 예외가 그대로 있었다(6번 유형 C도 첫 덤프에 0x6494DC가 바로 찍힘, 260930 유형 C 때처럼 0x576F08에서 꺼낼 필요 없었음). 크래시 프로세스의 procdump 로그는 약 7KB, 몇 초 뒤의 약 1.5KB 로그는 재시작된 새 프로세스다. `-e`는 처리되지 않은 예외만 덤프한다(잡힌 예외는 `-e 1`, 덤프가 많이 생길 수 있어 쓰지 않음).
- **탈라샤 무덤 회피 토글(`AutoSmurf.js` 3693·3704, 사용자 260812):** 포탈로 파티가 모인 직후 회피가 붙은 몹 사이로 자리를 잡다 치킨이 나서, 오리피스 박스를 먼저 정리한 뒤 회피를 켠다. 박스 울타리로는 막히지 않음. 유지(261002). 되돌릴 때 무조건 `true`지만 `this.duriel`은 파티 전원 25레벨 이상에서만 실행되므로(리더는 `this.tombs` 끝에서 `partyLevel(tombsLvl 25)`까지 대기·미달이면 quit, 팔로워는 리더의 `duriel` 메시지로 진입) 빌드의 25레벨 회피 켜기와 어긋나지 않는다.
- **미사일·몹 데이터(261002):** blizzhackers/d2data `missiles.json`·`monstats2.json`. Shock Wave 미사일 511: Vel 20, Range 14(프레임), Size 1, 관통(CollideKill 없음), NextHit 1·NextDelay 4. 몹 충돌 크기 2×2 366종, 3×3 197종.
- **팔로워 크래시 때 전원 종료:** 크래시 난 프로필이 파티에서 빠지면 나머지 전원(리더 포함)이 `PartyThread`의 `retry > 2`(`threads/PartyThread.js:122-124`)로 약 2초 뒤 나간다. `party has left`는 print만이라 콘솔·trace에는 이유가 안 남는다(로그 규칙대로). 크래시 쪽은 매니저의 `Window has unexpectedly exited` 줄로 구분한다.

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
- 결정(260929 최종): **동작 수정 없이 로그만 둔다.** 크래시 사례가 더 모일 때까지 관찰한다. 한때 넣었던 수정(저널 리더만 읽기 0e18e15, 오브젝트 대사 즉시 끊기 `cancelObjectDialog` 0155897·2a11717)은 모두 되돌렸다. `AutoSmurf.js`는 main과 비교해 로그 함수, `delay` 8곳의 치환(고대인 처치 후 2곳 포함), `Misc.click(0, 0)` 3곳 삭제(저널 2곳, 고대인 끝)만 다르다. `Misc.click`은 `clickMap`(D2BS가 `D2CLIENT_ClickMap`을 스크립트 스레드에서 직접 호출)으로 내 위치를 월드 클릭한다. 대사 닫기 핸들러(창 메시지)를 타지 않고, ClickMap과 하위 15개 함수에 대사 관련 참조가 없어 대사를 끄지 못한다고 보고 지웠다(사용자 결정). 대사는 뒤따르는 `me.cancel()`이 닫는다.
- 관찰 로그(trace 파일): `[OD]` = `this.watchDialog(wait)`. 저널 2곳·얼어붙은 Anya 2곳·고대인 제단·Lam Esen의 원래 `delay(wait)` 자리에서 같은 시간을 기다리며, 대사가 떴는지·몇 ms에 떴고 몇 ms에 사라졌는지 기록한다(끊지 않음). `[TK]` = 대사 중(`getIsTalkingNPC()`)에 `me.cancel()`이 불리면 NPC 이름과 호출 위치를 기록한다(`Prototypes.js` 끝의 `me.cancel` 래퍼, 원래 함수를 그대로 호출). 다음 크래시가 나면 덤프(0x661406 여부, `[0x7c0c77]` NPC 메시지·`[0x7bf212]` 텍스트 번호 → string.tbl)와 그 프로필의 trace(`[TK]`·`[OD]`)를 대조한다. 후보 수정(보류): NPC 쪽은 대화 연쇄를 끊지 않고 끝난 뒤 닫기(`Packet.openMenu` 등), 오브젝트 쪽은 대사를 즉시 끊기(blizzhackers 방식).
- 모드의 역할(사용자 판단에 동의): 원인이 아니다. 원인은 스크립트가 NPC 대화 연쇄를 끊어 콜백을 남기는 것(모드 전부터 있던 조건). 모드는 오브젝트 대사를 즉시 스스로 끝나게 만들어 이 경로가 드러나게 했을 뿐이다. 모드 전에는 오브젝트 대사가 길게 흘러 스크립트가 도중에 닫았고(콜백 미실행), 대신 WP 상호작용이 막히는 오류가 있었다(고대인, `Misc.click`+`me.cancel` 260916의 배경). 모드 전 원인 불명 크래시는 덤프가 없어 유형 불명.
- 임바모드 재비교(260929, 기준: blizzhackers/d2data 커밋 116fcac = 2020년 D2R 이전 데이터, 음원 `.wav`): 바뀐 것은 시각·음향뿐이다. objects `Draw` 548행 비움, Missiles `CelFile` null 595행·클라이언트 보조 미사일·폭발·소리 제거(missiles.bin에도 null 684개), Overlay 파일 null, sounds 4542행이 `none.wav`(NPC 음성 포함), monstats `MonSound`·일부 몬스터 미사일 칸 비움, Levels 조명 최대·잡몹(cmon) 제거·LOSDraw 끔, LvlPrest Animate 끔, armor·weapons·misc의 인벤 그림·소리 칸 비움. skills·cubemain·TreasureClassEx·runes·ItemStatCost·charstats·experience 등은 같다. UniqueItems 몇 행(Azurewrath, Rainbow Facet)과 방패 mindam/maxdam 차이는 기준 데이터 판 차이일 수 있어 판단 보류. sounds.bin은 형식을 몰라 확인 못 함.
- 대사 종료 조건(0x4a0770): 대사 시작 때 음성 핸들을 `[0x7bf24b]`에 둔다(0x4a14b7). 핸들이 있으면 음성 쪽 상태를 보고, 0이면 바로 스크롤 판정(0x49d5a0)으로 간다. 퀘스트 대사 첫 줄 `-1`은 속도 0xFFFF라 스크롤 판정으로 가면 1~2프레임 만에 끝난다. a7 덤프는 음성 핸들 0, 대사 시작 후 약 79ms에 종료. 임바모드가 음성을 `none.wav`(MPQ에 없음)로 바꿔 핸들이 안 생긴 것으로 본다. 사용자 관찰: 모드 전에는 `-ns`(소리 끔)에서도 대사가 길게 흘렀다. 모드 후 대사가 스스로 빨리 끝나는지는 관찰한 적 없다(캔슬로 닫혔는지 구분 불가). 현재 근거는 a7 덤프 1건뿐(매 프레임 종료 경로, 캔슬 아님). `[OD]` 로그(`watchDialog`는 대기 중 캔슬하지 않음)의 `gone at`으로 확인한다. `[0x8817b0]`을 Master Volume으로 본 해석은 근거가 약해 철회한다. `-ns`에서 음성 핸들 동작은 미확인.
- 로그 첫 결과(260929 17시대): `[TK]` a3 17:37:28 `cancel during talk npc:Akara at misc.js:2644 < prototypes.js:91 < autosmurf.js:2288` → `Packet.openMenu`의 "상호작용 중인데 메뉴 없음 → me.cancel()"이 NPC 대사를 끊는 것을 실제로 확인. `[OD]` a8 17:44:47 저널 `dialog at 922ms gone at 1000ms` → 캔슬 없이 약 78ms 만에 스스로 종료(a7 덤프 계산 79ms와 일치). 저널 대사는 상호작용 후 약 0.9초에 떠서 원래 코드의 `me.cancel()`보다 먼저 스스로 끝난다.
**유형 C: 유닛 이동 경로의 대상 유닛 NULL (Game.exe 0x6494DC), 2건 (a7 PID 21512, 260930 05:00:32 / a2 PID 23052, 261001 14:03:18, 아래 6번)**
- ProcDump 로그: 같은 크래시에서 `-n 10`만큼 덤프 10개가 연달아 써졌다. 받은 덤프의 예외 주소 0x576F08은 D2BS `exit0` 버그(아래)로 생긴 두 번째 크래시다. 원래 예외는 스택의 EXCEPTION_POINTERS(0x19f214)에서 꺼냈다: 0xC0000005 at 0x6494DC, NULL 읽기, ESI=0.
- 경로: 게임 루프(0x44efa0) → 0x481600 → 0x4814a0 → 0x4812e0 → 0x480c10 → 유닛 동작 처리 0x461250(동작 24, 0x461704에 D2BS GameAttack 훅이 있는 함수) → 0x480780(대상 유닛을 ServerSideUnitHashTables에서 찾아 경로 `+0x58`에 넣음, 0x648b90) → 경로 갱신 0x649970 → 0x649400(대상 유닛). 0x649970 안에서 경로의 대상 `[path+0x58]`을 다시 읽을 때 NULL이 되어 있었고, 0x649400은 NULL을 받으면 검사 분기(0x6494dc)에서 그대로 역참조해 튕긴다.
- 대상 유닛은 스택 인자로 보아 type 1(NPC/몬스터), id 0x27efbd3e. 움직이던 유닛이 a7 자신인지, 대상이 어느 NPC인지는 덤프에 힙이 없어 모른다.
- trace: 앤야 단계(a7은 비리더, 해동 물약 없음 → delay 5000) 뒤 5:00:25 Harrogath로 와서 라주크 쪽으로 이동 중(5:00:31 `moveTo getPath -> 5144,5037`), 약 1초 뒤 크래시. `[TK]` 없음, 그날 trace 전체 `[TK]` 0건. 유형 B(대사 콜백)와 무관.
- 유형 A(그리기 중 경로 NULL)와 같이 "유닛 경로가 가리키는 대상이 비어 있음" 계열로 보인다(추정). 원인 미상.
- D2BS `exit0` 버그 확인(소스): `Patch.h:42`의 Fog 0x82E0 PatchJmp 대상 `D2GAME_exit0`는 `D2Ptrs.h:481` FUNCPTR라 변환 전 값 `DLLOFFSET(D2GAME, 0x576F)` = 6 | 0x576F<<8 = 0x576F06을 정적 초기화 때 잡는다. 크래시 보고 함수로 가면 0x576F06(명령 중간)으로 뛰어 0x576F08에서 다시 튕긴다. 그래서 d2bs 로그에 EXCEPTION 줄이 안 남고, ProcDump 덤프가 여러 개 생긴다. 필요한 덤프는 첫 번째(접미사 없는 파일) 하나다.
- 별건: 17:40 a3·a8 동시 멈춤("D2BS is not responding", 매니저 강제 재시작, 덤프 없음). 둘 다 Andariel 후 Warriv로 Lut Gholein 도착 직후, 용병 고용 NPC(5033,5053)로 걷기 시작한 17:40:12 이후 기록 없음. 원인 미상. ProcDump 루프를 `-e -h -n 10` + PID별 출력 로그(`C:\CrashDumps\procdump_<PID>.log`)로 바꿔 멈춤 덤프도 받기로 함.
  - 가설(미증명): `Merc.hire`(libs/Merc.js)는 `Town.move` 전에 `gamepacket` 리스너를 켜고 `initNPC` 뒤에 끈다. 리스너가 켜진 동안 D2BS는 게임이 받는 **모든 패킷**마다 게임 스레드가 스크립트 처리를 기다린다(Events.cpp `PacketEventCallback`, 패킷당 최대 500ms). 15~18초 이동 중 스크립트가 바쁘면 게임 스레드가 사실상 멈춰 매니저가 강제 종료할 수 있다. "Merc unmatched"마다 거치는 경로인데 멈춤은 드물어 이것만으로는 다 설명되지 않는다. 동시 멈춤이라 외부 요인도 배제 못 함. 확정은 `-h` 덤프에서 메인 스레드가 이 대기 안에 있는지로 본다.
  - 막는 방향(보류): 리스너를 0x4E/0x4F가 오는 구간에만 켠다. 그 시점 확인용 `[MP]` 로그를 넣음(260929, 동작 변경 없음): `[MP] 0x4f|0x4e|arrived|menu done at <리스너 켠 뒤 ms> npc:<고용 NPC> dist:<거리|none>`. 0x4E가 "arrived"(도착) 뒤, "menu done" 전에만 찍히면 리스너를 `initNPC` 직전에 켜도 된다.
  - 결과(260930): a1~a8 8건(모두 그레이즈, 빌드의 `MercSkill`이 전부 2막 용병) 모두 이동 중 수신 0건, 도착 뒤 `initNPC` 안에서만 0.25~0.33초 동안 수신(목록 2회씩). 도착→첫 0x4F 최소 47ms(a1). a2·a3·a8은 8:04에 15~21초 걸었는데 필요한 건 마지막 0.3초였다. → 리스너를 `Town.initNPC` 직전으로 옮김(260930, 사용자 승인). `[MP]` 시간 기준은 이동 시작으로 유지.
  - 새는 경로 점검: `addEventListener`~`removeEventListener` 사이에 `return`은 없다. 예외는 `Town.initNPC` 안(`Packet.openMenu` → `Pather.moveToUnit`, `Town.move` → `Pather.moveTo` "Failed to generate path")에서 날 수 있고, 그러면 제거가 건너뛰어진다. 호출부(`AutoSmurf.js:158`, `:7313`)에는 try가 없어 예외는 `Loader`의 catch까지 올라가 AutoSmurf가 끝나고 `default.dbj`가 게임을 나간다. 리스너는 그 스크립트가 끝날 때 같이 사라지므로 남는 시간은 게임 종료까지다. 옮기기 전에는 `Town.move` 예외도 이 경로였다.

**261001 크래시 6건 (260930 18:04 ~ 261001 12:04, 약 98게임·8프로필, 실행 코드는 PR #14 이전 / 6번은 261001 14:03, PR #18 이후 코드)**
첫 덤프·procdump 로그·trace·d2bs 로그와 Game.exe·D2BS.dll(1.6.4U)을 대조했다. 모두 메인 스레드(게임 루프 0x44efa0)의 접근 위반이다. 첫 덤프 시각이 다른 프로필의 종료보다 약 2초 빠르다(크래시가 먼저, 위 `PartyThread` 동반 종료).

| # | 프로필·시각 | 예외 주소 | 분류 |
|---|---|---|---|
| 1 | a1 9/30 22:10:20 (앤야 단계) | 0x661406 | **유형 B 확정** |
| 2 | a2 9/30 22:21:26 (Pit of Acheron 전투) | 0x5ff28e | SpriteCache 목록 손상 (그리기) |
| 3 | a6 10/1 03:05:57 (Abaddon → Harrogath 도착 3초 뒤) | 0x66f99f | **유형 D** |
| 4 | a7 10/1 04:34:23 (Moo Moo Farm) | 0x481617 | 2차 크래시 (해제된 유닛·Act) |
| 5 | a8 10/1 09:46:07 (Pandemonium → Harrogath 도착 7초 뒤) | 0x66f99f | **유형 D** |
| 6 | a2 10/1 14:03:18 (Burial Grounds, Blood Raven `Attack.clear` 중, PR #18 이후 코드) | 0x6494DC | **유형 C** |

- **1번 (유형 B 확정):** trace 22:09:09 `[TK] cancel during talk npc:Anya at misc.js:2680 < prototypes.js:91 < autosmurf.js:5263`(`Packet.openMenu`의 cancel). 71초 뒤 Arreat Summit 제단 앞(10047,12617)에서 크래시. 덤프: 콜백 `[0x7bf258]`=0x4b6a30, 목록 `[0x7bf250]`=NULL, `[0x7c0c69]`=0, 처리 중 오브젝트 `[0x7bf234]`=546(고대인 제단), 스택 0x4a080b(매 프레임 종료) → 0x4b6a45 → 0x4b1863 → 0x661406. 260929 가설이 `[TK]`+덤프 짝으로 처음 확인됐다. 이날 trace의 `[TK]`는 3건(Kashya `autosmurf.js:2021`, Malah `:5227`, Anya `:5263`), 모두 `Packet.openMenu` 안의 cancel.
- **2번 (SpriteCache):** EBP 체인 = 그리기 목록 루프(0x4df510) → 유닛 그리기(0x471620) → 0x4f6540 → 렌더러 `[0x7c8cc0]+0x90` → 0x6c87e0 → 0x6001f0 → 0x5ff5b0 → 0x5ff1b0(LRU 목록에서 빼기)에서 항목의 이전 링크 NULL에 쓰기(`[NULL+0x18]`). 캐시 0x89db60은 `SpriteCache.cpp`(Objects/Monsters/Chars/Overlays/Items/Missiles의 DCC·DC6). 캐시 잠금(+0x30)은 메인 스레드가 쥐고 있었다(다른 스레드 경합 아님). 처음에 "D2BS가 스택에 있다"고 한 것은 틀렸다: 0x6001f0의 지역 변수 영역(0x224바이트)에 남은 흔적이었다. 유형 A와 같은 그리기 루프. 임바모드와의 관련은 증거 없음.
- **3·5번 (유형 D, 두 건이 완전히 같음):** 게임 루프 → 패킷 루프(0x45f7b0, 0x45f8e9 `call eax`) → 서버 패킷 **0x07**(방 추가, 크기 6, 핸들러 0x45cab0, 패킷 표 0x7114d0의 7번) → `AddRoomData`(0x61a070) → 0x61b640 → 0x61b490 → 0x61b390 → 0x66c370 → 0x66c220 → 0x6424a0 → 0x675360 → 0x67e600 → 0x67e0e0 → 0x670750 → 0x66f990에서 `[ebx+0x50]`(0x10, 0x1)을 포인터로 읽음. 덤프에 힙이 없어 `ebx` 구조체는 모른다. 두 건 모두 다른 지역에서 Harrogath로 막 도착해 걷던 중으로, 유형 C(260930 a7, Harrogath 도착 7초 뒤)와 상황이 같다(같은 원인인지는 추정).
- **4번 (2차 크래시):** 게임 루프(0x44efb0 `GetPlayerUnit` = `[0x7a6a70]`) → 0x481600에 넘긴 내 유닛 0xb52e900과 Act `[0x7a0634]`=0x48e7000이 모두 MEM_FREE. 게임 구조가 해제된 뒤 루프가 옛 포인터를 썼다. procdump 로그에 처리되지 않은 예외 앞에 잡힌 예외 2개가 있고, 그쪽이 원래 원인으로 보인다(추정, 덤프 없음). a7 d2bs 로그에도 흔적 없음(마지막 줄 04:28:12 `=== [COWS] ===`). 유형 C와 같은 진입 함수(0x481600).
- **6번 (유형 C, 261002 분석):** procdump_23052 로그에 14:03:18~19 처리되지 않은 접근 위반 10회(덤프 10개, 첫 덤프 `Game.exe_261001_140318.dmp`). 14:03:20의 procdump_12448(예외 없음)은 재시작된 새 프로세스. 첫 덤프: 0xC0000005 at 0x6494DC, NULL 읽기, ESI=0, EAX=0, ECX=0x1522, EDX=0x15B4, 메인 스레드. EBP 체인: 0x649bdc(0x649970 안) → 0x4807b2(0x480780) → 0x4613ca(0x461250) → 0x481331 → 0x48156c → 0x4816ef → 0x44f12b(게임 루프). 260930 건과 주소·레지스터·경로가 같다. 그때 적은 0x480c10 단계는 이번 체인에 안 보인다(FPO로 건너뛴 것으로 추정, 미확인). 0x480780 프레임 인자 `0x15b41522` = (5410,5556)으로, a2 마지막 위치(5411,5562)에서 약 6칸이라 근처 유닛의 이동 목표 좌표로 보인다(추정). 어느 유닛인지(Blood Raven, 좀비, a2 자신)는 덤프에 힙이 없어 모른다.
  - trace: Pz-2 `=== [BLOOD] ===` → 14:02:32 Burial Grounds 진입 → 프리셋 805로 이동 → 14:02:58 도착(이후 `AutoSmurf.js` BLOOD의 `Attack.clear(10, Blood Raven)` 구간, 코드 순서로 판단) → 14:03:17 `[5411,5562] moveTo end`가 마지막 줄, 약 1초 뒤 크래시. d2bs 로그 마지막 줄은 14:00:57 `=== [BLOOD] ===`(EXCEPTION 줄 없음, exit0 버그 패턴). 콘솔 `Crash: no entry Burial Grounds - wait 5s (loc 9)`의 지역이 크래시 지역과 같다. 같은 시각 a1 `12m / 2r`는 `PartyThread` 동반 종료로 보인다(a1 trace 미확인).
  - 유형 C 두 건은 상황이 다르다(마을에서 NPC 쪽으로 이동 / 보스 전투). 특정 스크립트 동작과 이어지는 근거가 없어 게임 내부로 본다.
- **결론:** 우리 스크립트가 원인인 것은 1번(유형 B)뿐. 2·3·4·5·6번은 게임 내부라 스크립트로 고칠 수 없다.

**유형 B 수정 (261001, PR #18)**
- 대사 입력 처리 표(Game.exe 0x722600, 대사 중에 등록됨): 왼·오른 클릭 → 0x4a17d0, ESC(0x1B)·스페이스(0x20) → 0x4a1770. 0x4a1770은 텍스트 시작 100ms 안의 입력을 버리고, 그 뒤면 0x4a08c0으로 대사를 정상 종료한다(콜백 실행 → 다음 대사나 메뉴, 연쇄가 끝나면 콜백이 스스로 지워짐). `me.cancel()`은 이 표를 거치지 않고 화면을 지워 콜백이 남는다.
- 클릭(0x4a17d0)은 조건이 있다: 마우스 아래 유닛이 대화 중인 NPC면 무시, 아무것도 없고 `[0x7bf23a]`(기억된 유닛 표시)가 있으면 대사를 끝내지 않음. 마우스 아래 유닛은 게임의 매 프레임 상태라 `sendClick` 좌표가 아니라 실제 커서를 따를 수 있다(미확인). 그래서 클릭(나를 클릭 포함) 대신 키를 쓴다.
- ESC는 대사가 막 끝난 뒤 눌리면 게임 메뉴가 열려 위험하다. 스페이스는 기본 "화면 정리"라 해가 없다. 다만 허공에 눌리면 오토맵이 꺼진다(사용자 확인) → 대사가 끝난 뒤 꺼져 있으면 다시 켠다(오토맵은 항상 켜져 있어야 함).
- D2BS(1.6.4U): `sendClick`은 Sleep(100) 뒤 WM_LBUTTONDOWN/UP를 창에 보낸다. `sendKey`는 WM_KEYDOWN/UP. `getIsTalkingNPC`는 게임의 대사 입력 처리 표 등록 여부.
- 반영: `Packet.openMenu`(`Misc.js`)와 `Unit.openMenu`(`Prototypes.js`, `Config.PacketShopping`이 false일 때만 쓰는 자체 루프, 지금 설정은 true라 실행 안 됨, 설정이 바뀔 경우 대비)에서 대사 중이면 `Packet.skipTalk`(스페이스) → 메뉴가 뜨면 `Packet.endTalk`(trace `[TK] talk skipped <횟수> npc:<이름>`, 오토맵 다시 켜기). 20번 넘으면 예전 `me.cancel()`.
- 기각: 대사가 끝날 때까지 기다리기(`b2a396f`, NPC 대사가 수 분 걸릴 수 있음), 대사가 보이면 조기 종료(콜백 `[0x7bf258]`의 쓰기는 설정 함수 0x49e7e0뿐이고 호출부는 모두 대사·NPC 대화 코드, 게임 종료 경로에서 지우지 않음 → 같은 프로세스의 다음 게임에서 크래시).
- 유형 A·C·D·SpriteCache 주소로 분류: 0x6489C6(A), 0x661406(B), 0x6494DC(C), 0x66f99f(D), 0x5ff28e(SpriteCache), 0x481617(해제된 유닛), 0x2F11BC9(해제된 내 유닛, D2BS 상태 확인에서 발견, 아래 7번).

**261003 크래시 7번 (a7 PID 23184, 261003 00:48:15, Pz-57 `[BAAL]` 왕좌 웨이브 대기 중, 261003 분석)**
- trace 마지막 줄 00:47:53 `[Throne Of Destruction 15094,5039] moveTo end`, `[Quit]`·치킨 없음. 콘솔 `Crash: no entry Throne Of Destruction - wait 5s (loc 9)`.
- 첫 덤프 `Game.exe_261003_004815.dmp`: 0xC0000005 at **0x2F11BC9**(D2BS+0x1bc9), `0x878f070` 읽기, 스레드 0x226c(D2BS 스크립트 스레드). D2BS 게임 상태 확인 함수가 `GetPlayerUnit()`(0x463dd0) 결과의 `+0x70`을 읽는 줄이다. 게임 전역 `[0x7a6a70]`=0x878f000(내 유닛)은 그대로인데 그 메모리를 읽을 수 없었다. procdump 로그상 이 앞에 잡힌 예외는 없다(4번과 다름). 나머지 스크립트 스레드도 같은 줄에서 차례로 튕겼다.
- 메인 스레드: 게임 루프 → 패킷 루프 → 서버 패킷 0xA3(크기 0x18, 핸들러 0x45d5e0) → 0x4c6a11 → 0x4f1e94 → 0x4cd804 → 0x4667db → 0x466183 → 0x465f2c → 0x681e16 → 0x407f36 → 0x409d3e → 0x68402e → 힙 해제(`NtFreeVirtualMemory` MEM_DECOMMIT 0x9160000~0x9184000, 내 유닛 주소는 범위 밖). 게임 종료 경로 아님.
- WER 덤프 `Game.exe.23184.dmp`(머리 예외 0x576F0C, exit0 버그)에는 Game.exe 스레드 0x49f8(첫 덤프 때는 `select()` 대기)이 메모리 풀 잠금 0x74f244(0x200 블록 풀)에 들어가다 ntdll 0x77966627에서 `[0x14]` 쓰기로 튕긴 예외도 있다. 첫 덤프에서 이 잠금은 다른 풀 잠금과 같이 전부 0이었으므로 첫 크래시 뒤의 2차 크래시다.
- 내 유닛 메모리가 왜 사라졌는지, 패킷 0xA3과 관련이 있는지는 모른다(덤프에 힙 없음). 4번(메인 스레드가 해제된 내 유닛·Act 사용)과 같은 계열로 본다(추정). 게임 내부, 스크립트로 고칠 수 없음.
