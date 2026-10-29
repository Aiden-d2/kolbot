# libs/Precast.js

## 선시전 (허리케인)

### 261002 Claude: 변신 빌드에서 허리케인 선시전 안 함
- `Config.Wereform`이면 허리케인을 인간 상태로 선시전하지 않는다. 인간 상태 허리케인·아마게돈은 쿨타임(121)이 걸려 변신(228)이 막혔다(`shapeShift` 2초 × 3).

## enchant

### 261028 Claude: 인챈트 대상을 빌드 이름으로 (`dfc884b`, 사용자 요청, 옛 handoff 3-40)
- `Config.Enchant.Player`는 직업 번호 → 빌드 이름. 처음 부를 때 한 번 `Team.Profiles` 중 빌드(`Build.getBuildType(profile)`)가 목록에 있는 프로필의 `Profile(p).character`로 `Precast.enchantNames`(새 속성)를 만들고, 플레이어는 이 이름만 인챈트. 용병·소환수는 그대로(40칸 안 파티원 전원의 용병·소환수).
- 확인: 261029 로그 a1(S.SFFW) 10/29 01:52~ 플레이어 인챈트는 aozo-ie(a5, M.HYBR) 90회뿐, 용병·소환수 classid 338·357·417·428. 검증 통과(사용자 261029).
