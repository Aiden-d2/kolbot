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
