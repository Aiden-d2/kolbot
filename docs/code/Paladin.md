# libs/Attacks/Paladin.js

## getHammerPosition

### 260928 Claude: 옛 clear의 Angle/Detour 게이트
- 해머는 setPosition을 안 거치므로 맨 앞에 게이트. 조건 0x5(해머는 몹 옆에 서야 하므로 0x1로 막혀도 이동이 필요). 막히면 `tick.fail = "unreachable"`. MUST는 게이트 없음(260929 NoSkipArea 제거). 박스 울타리는 적용 안 함(설 자리가 몹 옆 5칸 이내, 회피 없음).
- 확인: 260930 trace에서 해머딘 헛돎 없음(`log_results.md`).
