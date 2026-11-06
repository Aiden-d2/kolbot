# threads/ToolsThread.js

## drinkPotion (용병 생명 물약, main 용병 분기)

### 261101~261102 Claude: 용병 물약 확인 trace → 상태 100이 없을 때만 주기 (`36bcb50`·`f541423`, 사용자 요청, 옛 handoff 3-55)
- 문제(사용자): 용병 HP가 70% 미만인데 회복이 안 되는 것처럼 보였다. `UseMerc`는 캐릭터 69레벨 이상, `UseMercHP = 70`, `drinkPotion(3)`은 벨트 생명 물약만 `clickItem(2, 물약)`, 원래 최소 8초 간격.
- 261101: 준 직후 물약 gid·시각을 기억(`mercPotGid`·`mercPotTick`), main 용병 분기에서 `me.ping + 200`ms 뒤 trace `[mercPot] gone:true/false state100:true/false mercHP:N`. 261102 로그 550줄: `gone:true` 547(그중 `state100:true` 539), 간격 9초 이하 272회(8초 간격으로 계속 줌).
- 261102: 8초 간격 → 플레이어(type 0)처럼 최소 1초 + 용병(`me.getMerc()`)에게 상태 100(`healthpot`)이 있으면 주지 않음. `drinkPotion` type 3 분기, 지역 변수 `merc`.
- 확인: 261103 로그 295줄, 간격 193개 중간 10초(7~10초 89), 6초 이하 17개는 모두 한 번씩(1초 간격 연속 없음), 짧은 간격 뒤 줄은 모두 `state100:false`. 검증 통과(사용자 261103). `[mercPot]` trace와 변수 `mercPotGid`·`mercPotTick` 삭제(261103, 제거 조건: 이 판정).

## main (copydata 중계)

### 261021 Claude: default.dbj가 멈춘 동안의 메시지 중계 (`eddab3a`, 옛 handoff 3-2)
- 엔진은 멈춘 스크립트의 copydata를 버린다(`Events.cpp:230`). default.dbj가 멈춰 있을 때 받은 copydata 55·56을 `relayMsgs`에 쌓았다가, 다시 돌면 `Messaging.sendToScript`로 순서대로 넘긴다(실패하면 남김). 받는 쪽은 `AutoSmurf.md` onCopyData.
- 감수: 재개 직후 수 ms 틈의 유실, 같은 틈의 중복(이름·플래그는 무해, 아직 개수인 readyCount·buffCount·BOCount는 넘칠 수 있음 → handoff 2-1 확장 때 해소).
- 확인: 261022 `relay` 6건, 261023 5건 모두 Town chicken으로 마을에 다녀온 직후, 중계한 프로필로 인한 desync 0. 검증 통과(사용자 261023). 확인 줄 `relay N msgs`는 261023 `0f6da09`에서 삭제(옛 handoff 3-28). 261025 로그에 `relay` 0(삭제 확인). 중계 자체를 보는 줄은 없고, desync 5건은 모두 다른 사유로 판별됨(handoff 3-31). 검증 통과(사용자 261025).

## main (Life Chicken)

### 261021 Claude: Life Chicken 상세 삭제 (`ab94751`, 옛 handoff 3-9)
- `[Quit] Life Chicken H/M` 뒤의 `| mode:N near: ...`와 `nearMonsters` 함수 삭제(사용자 결정).
- 확인: 261022·261023 로그. 검증 통과(사용자 261023).

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- 치킨 콘솔 `Life/Mana/Iron Golem/Merc Chicken …` → `[Chicken] Life H/M`·`Mana`·`Iron Golem`·`Merc`(빨강 그대로), trace `[Quit] …` → `Misc.print("[Chicken] …")`, 옛 print `[Chicken] Life (H/M) area:N (x,y)` 삭제.
- `checkPing`: 콘솔 `High ping` → `[Chicken] High ping N/M`, trace → print, 머리 위 글자 `High Ping` 삭제.
- 죽음: 변수 `wasDead`. 게임 준비 상태에서 살아 있다가 `me.dead`가 된 순간 1회 콘솔 빨강 `[Died] (지역 x,y)` + print `[Died]`. 부활하면 다음 죽음도 찍는다.
- 최대 게임 시간: 변수 `maxTimeLogged`. `getTickCount() - me.gamestarttime >= me.maxgametime - 1000`이면 1회 콘솔(기본색)·print `[Quit] Max game time N min`. 엔진이 사유 없이 내보내는 퇴장의 사유 줄. 리더가 먼저 시간이 끝나고 팔로워는 `PartyThread`로 따라 나가므로 실제로는 리더 1줄(사용자 261103). 엔진이 `me.gamestarttime`부터 재는지는 엔진 소스로 확인하지 않음(`getGameTime`과 같은 기준이라는 추정).
- `getPotion` 머리 위 글자 → `Misc.print("[getPotion] Drinking potion from inventory")`, `drinkPotion` trace → `Misc.print("[drinkPotion] Failed: merc potion")`. 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.

### 261104 Claude: 로그 모양 정리 (사용자 승인 261104, handoff 3-66)
- 죽음 줄에 잃은 경험치: 새 변수 `aliveExp`(살아 있는 동안 매 순회 `me.getStat(13)`). 살아 있다가 죽은 순간 `(aliveExp - 지금 경험치) × 100 / Experience.nextExp[레벨]`(경험치 줄 %와 같은 기준, 99레벨이면 0)을 소수 둘째 자리로 `aliveExp`에 넣어 콘솔 `[Died] lost=N.NN% (지역 x,y)`·print `[Died] lost=N.NN%`. 다시 살아나면 `aliveExp`는 경험치로 돌아간다. 게임이 죽는 순간 경험치를 깎는지는 확인하지 않음(0만 나오면 부활 때 깎이는 것).
- `[Quit] Max game time N min` 콘솔 색 6.

### 261105 Claude: 끝 줄 정리 — Script ended 리더 콘솔·팔로워 waitParty, Max game time 콘솔 리더만, 게임 이름 print 삭제 (사용자 승인 261105, handoff 3-68)
- 최대 게임 시간 콘솔 `[Quit] Max game time N min (지역 x,y)`에 `me.profile === Team.Leader` 조건. print는 모든 프로필 그대로.
- 이유(사용자 261105): 모든 프로필이 콘솔에 찍어 지저분해진 사례. 퇴장은 엔진이 하므로 이 조건은 로그만 바꾼다. 팔로워가 리더보다 먼저 시간이 끝나 리더가 콘솔 없이 따라 나가는 경우는 리더가 먼저 들어가므로 드물다(추정).
- 확인: 261106 로그 — 콘솔 `[Quit] Max game time 30 min` 리더 2줄(11/05 17:39:48 Lut Gholein, 19:47:49 Infernal Pit)·팔로워 0, print는 리더 2 + a4 1(Pz-62, 혼자 남은 게임). 검증 통과(사용자 261106, 옛 handoff 3-68).
