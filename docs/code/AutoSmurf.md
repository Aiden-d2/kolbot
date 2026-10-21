# bots/AutoSmurf.js

(AutoSmurf 정리 단계에서 나머지 `this.` 함수를 채운다.)

## this.okCount / this.teamCount

### 261004 Claude: 죽은 사람도 타임아웃, 타임아웃 상세
- 죽은 사람도 120초 타임아웃(`&& !me.dead` 삭제, 사유 `Dead wait timeout`). 타임아웃 trace 상세에 `okCount`/`teamCount`/`teamOk` 값.
- 확인: 261006 로그. 261021 이름 수집 방식은 `handoff.md` 2-1(검증 대기).

## this.bossGuard

### 261004 Claude: 보스 보호 도입 (치킨 끄고 킬까지 대기)
- 배경: 보스전에서 한 명이 치킨으로 나간 뒤 나머지가 감지해 나가는 약 0.3초 안에 보스가 죽으면, 나간 쪽만 킬을 못 해 다음 게임부터 디싱크. 방장이 끝낸 퀘스트는 그 방에서 꺼지므로 못 잡은 쪽은 따라잡지 못한다(`D2BS_Structure.md` 확인된 사실).
- 동작: 원래 치킨 값을 `guardChicken`에 저장. pct 0이면 바로 치킨 끔. pct > 0이면 `Attack.clear` 스캔 훅(`Attack.md` clear)에서 보스 HP ≤ pct면 한 번 치킨을 끈다. 에인션트(540~542)는 살아 있는 고대인이 한 마리일 때만.
- 적용: 써모너 0, 라다먼트 85, 앤디·메피스토·이주얼·쉥크·에인션트 15, 디아블로 15(`!getQuest(26,0)`일 때만), 바알 15(`!getQuest(40,0)`일 때만). 듀리엘 제외(다음 게임에도 퀘스트가 살아 있어 다시 잡으면 복구됨).
- 리더 포탈: 디아블로 별 자리(`diabloPrep` 전), 앤디 normal `moveTo(22548, 9582)` 뒤, 바알 132 `moveTo(15134, 5923)` 뒤, 에인션트는 118의 120 출구 앞.
- 확인: 261006 로그. 그 뒤 사용자가 값(써모너 100, 쉥크 50, 에인션트 10·2마리 이하)과 trace를 바꿈 → `handoff.md` 3-1(검증 대기).

## this.bossEnd

### 261004 Claude: 킬 확인과 시체 회수
- 동작: 보스 clear의 try/catch 바로 뒤. okCount(킬 확인, 죽은 사람은 시체로 대기해 크레딧을 받음) → 죽었으면 위치 기록 → `me.revive()`(mode 17일 때, 1초 × 10, 실패 `Revive failed`) → 마을 도착 후 치킨 복구 → portalspot → `usePortal(죽은 지역, null)`(120이면 118, 실패 `Corpse portal not found`) → 리더는 그 자리에서 `makePortal` → 120이면 `moveToExit(120)` → `moveTo(x, y)` → 시체 확인(0.5초 × 5) 뒤 `Town.getCorpse(true)`(실패는 `Failed to get corpse`, 상세 `not seen` / `far N` / `died` / `timeout`) → okCount(산 사람이 엄호하며 대기). 산 사람은 첫 okCount 뒤 치킨 복구. 보호를 안 켰으면(파밍) 아무것도 안 함.
- 확인: 261006 로그. 261013에 회수 동안 `Config.TownCheck` 끔(사용자), trace는 261020에 바뀜 → `handoff.md` 3-1.

## this.summoner

### 261004 Claude: 공통 보스 보호로 교체
- 기존 `setLifeChicken(0)`·죽음 퇴장·치킨 복구를 `bossGuard(0)`·`bossEnd(10)`으로 교체, `okCount(10)` 유지.

## this.radament

### 261004 Claude: 북 확인·읽기와 분실 복구
- 게이트 `(!9,1 && !9,0) || (9,5 && 북 없음)`(`radament` 안과 리더 쪽). bossEnd 뒤 북이 보이는지 한 번 확인(약 2초, 못 보면 `Radament quest item not found`) → okCount → 줍기·읽기. 누구 하나 못 보면 아무도 줍지 않고 나가 전원이 같은 상태가 된다.
- 복구: 리더가 `9,1 && 9,5 && 북 없음`이면 radament 시작에서 아트마와 대화(9,1 → 9,0) 후 `Radament book reset`으로 퇴장(N+1) → N+2는 퀘스트가 꺼져 북이 안 나옴 → N+3에 북이 필요한 전원에게 드롭.
- 확인: 261006 로그 정상 경로 통과, 261013 로그 분실 복구 경로(Pz-54~58) 통과. 261012에 사용자가 북 확인을 바닥(`getUnit(4, 552)`)만으로 바꿈, 261021 `radamentOff`는 `handoff.md` 2-10(검증 대기).

## this.ancients

### 261004 Claude: 리더 포탈 위치와 루프 끝 갱신
- 리더가 118의 120 출구 앞에서 포탈을 열고 전원 들어감(팔로워 `usePortal(118)` → `moveToExit(120)`). 제단을 누르면 정상의 TP가 모두 닫히고, 전투 중 120에서 TP를 열면 고대인이 리셋된다.
- 루프 끝(okCount 뒤)에 `sendPacket(1, 0x40)` + 대기: 죽은 사람의 마지막 퀘스트 갱신이 킬 전이라 루프 조건이 낡은 값을 볼 수 있음(추정, 보험).
- 확인: 261013·261020 로그에서 루프 1회.
