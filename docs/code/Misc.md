# libs/Misc.js

## Skill.getRange

### 260930~261008: 스킬 사거리
- 사거리 값과 근거는 `skill_range.md`(정보 파일)에 모두 둔다.

## Skill.cast

### 260928 Claude: 시전 기록, 마나 판정
- `setSkill` 성공 직후 `Attack.tick.cast = true`(`typeof Attack` 가드). 마나 판정 `비용 + 1 > mp` → `비용 > mp`(직업 파일의 LowManaSkill 판정과 같게). `+1`은 캐시된(레벨업 전) 비용 때문에 생긴 Molten Boulder 멈춤을 덮던 것으로 추정.

### 261002 Claude: 아마게돈 변신 가드
- 249는 곰·늑대 상태가 아니면 먼저 변신(121 중이면 바로 false, 변신 실패면 false). 인간 상태 아마게돈 경로(Wereform 변신 실패·걷는 사이 만료, `diabloPrep`·바알 preattack)를 한곳에서 막는다. 전체 스킬 무조건 변신은 Cyclone Armor·CTA BO가 안 나가서 아마게돈만.

## Skill.getManaCost

### 260928 Claude: 캐시 제거
- 매번 현재 스킬 레벨로 계산한다.

## Equip.updateTiers

### 261028 사용자: 기어 칸 이름·`TieredGear` 삭제 (handoff 3-39)
- `Config.TieredGear`(부위별 도달) 설정 2줄 삭제. 전 칸이 `TierGoal` 이상이면 `Config.Tiered = true`는 그대로(게임 시작 때 빌드 1레벨 Update에서 부름). 칸 이름은 `Config.Gear`를 따라 `equipped: [ArmG] N`처럼 찍힌다.
- 확인: 261029 로그 — nip 로드 오류·표시 줄 0(ScriptErrorLog·회색 콘솔), print `equipped:` 새 칸 이름만, ItemLog 기어 조건 표시 124줄(그중 100줄을 그 시각 착용 tier와 대조, 기준 이상이 된 뒤 줍기 0). `[tiered]`(ItemLog `(Tiered)` 0)·홀드 기본값은 사례를 확인하지 않음. 검증 통과(사용자 261029, 같은 헤더 항목 공통).

## Misc.openChests

### 260928 Claude: 갈 수 있는지 검사
- `CollMap.checkColl(me, 상자, 0x5)`(걷기·텔레 공통). clear에서 상자 열기를 빼고 Pather `popChests`(clearPath 이동 노드마다 반경 15, `Config.OpenChests: 2`)로 일원화.

### 261001 Claude: 트랩·불 옆 상자 제외 (사용자 요청)
- 목록을 만드는 `getUnit(2)` 루프에서 `objtype & 0x7F`가 0이 아니면(트랩 1~8) 빼고, `"explodingchest"`도 뺀다. 같은 루프에서 이름 `"fire"` 오브젝트(나에게서 range+4 안)를 모아 `Attack.checkFire`(반경 4 이하) 상자를 뺀다(`getUnit` 추가 호출 없음).
- 근거: 게임은 이 값으로 트랩을 고른다(D2MOO `ObjMode.cpp:373`), 트랩 없는 컨테이너는 0이라 걸러지지 않는다(컨테이너별 표는 `D2BS_Structure.md`). `CorpseOnStick` 자체는 불·데미지가 없고 옆의 `fire` 오브젝트가 데미지를 준다. 이름으로 `corpseonstick`을 빼는 안은 불 없는 시체도 빠지고 다른 상자는 못 걸러 기각.
- 확인: 확인용 trace `[chest] skip trap|fire`로 게임 확인 뒤 261006에 trace 삭제.

## Misc.itemLogger / Misc.logItem

### 261021~261023 사용자 결정: 소켓 보석 로그 (옛 handoff 3-15)
- `itemLogger`의 `Ingredient {가진 개수}`(소켓 보석 줍기)와 `Socketed`(261023 전 `Gemmed`) case, `logItem` match. 동작은 `Town.md` socketGems. 검증 통과(사용자 261023).

## Misc.townCheck

### 261021 Claude: default.dbj는 직접 마을행 (`ab94751`, 옛 handoff 3-5)
- default.dbj면 `Town.visitTown`을 직접 부른다(멈춤 없음, trace `Town check (direct)`). TownChicken(visitTown 안에서만 부름)·MapHelper(default와 동시에 움직임)는 기존 메시지. 재진입 막기는 `Town.md` visitTown. 검증 통과(사용자 261023).

## Misc.wornItems / Misc.takeOff

### 261024 Claude: 착용 중인 재료 베이스로 룬워드·펀치 (`789d80d`·`aafbe50`·`9c0d445`, 사용자 결정 261023·261024·261025, 옛 handoff 3-32)
- 문제: 보유 개수(`NTIP.CheckQuantityOwned`)는 보관품·플레이어 착용·용병 장비를 모두 세는데, 룬워드 베이스 찾기(`getBase`)와 큐빙 재료(`Cubing.buildLists`)는 보관품만 봐서 착용 중인 재료 베이스가 홀드를 차지하면서 재료로는 쓰이지 않았다.
- `Misc.takeOff(item, merc, tag)`(새 함수, 룬워드·큐빙 공통): 인벤토리 자리 확인 → 빼기(플레이어 `Storage.Inventory.MoveTo`, 용병 `clickItem(4, 칸)` → 커서 → 인벤토리) → 커서에 남으면 `cursorCheck` → `Equip.updateTier`/`Grant.updateTier` → trace `[Runeword|Cube] takeOff [칸] 이름 (player|merc): ok | fail (no room | still equipped | stuck on cursor)`. 자리가 없으면 빼지 않는다.
- `Misc.wornItems()`(새 함수, `aafbe50`): 플레이어 머리·몸·양손 + 용병 장착품 목록. 용병 장비는 `merc.getItem()` + `getNext()`로 하나씩 읽고 `copyUnit`으로 복사(`9c0d445`, `merc.getItems().forEach`가 게임에서 `[].forEach is not a function`).
- 다시 입기는 기존 `doChores`의 `Equip.autoEquip`·`Grant.autoEquip`.
- 확인: 룬워드 takeOff ok 3건 — 261026 a1 `[ArmR] Double Axe` → Steel, 261028 a3 `[Body] Breast Plate` → Stealth, 261029 a2 `[ArmG] Double Axe` → Steel(18:05:57 → 18:06:08 `Runeworded` → 18:06:32 `Equipped`), fail 0. 착용 베이스 펀치는 사례 없음(펀치는 모두 보관함 베이스). 검증 통과(사용자 261029). trace `[Runeword] takeOff`·`[Cube] takeOff`는 코드에 남아 있음.

## Packet.openMenu

### 261001 Claude: 대사 중이면 스페이스로 넘김 (유형 B 크래시)
- 문제: 대사 중 `me.cancel()`은 게임의 대사 입력 처리 표를 거치지 않고 화면을 지워 대사 콜백이 남는다 → 뒤에 NULL 메뉴 목록으로 크래시(Game.exe 0x661406, `crash_analysis.md` 유형 B).
- 동작: 대사 중이면 `Packet.skipTalk`(스페이스) → 메뉴가 뜨면 `Packet.endTalk`. 20번 넘으면 예전 `me.cancel()`.
- 클릭 대신 키: 클릭은 마우스 아래 유닛 조건이 있어 대사를 끝내지 않을 수 있다. ESC는 대사가 막 끝난 뒤 눌리면 게임 메뉴가 열린다. 스페이스는 허공에 눌리면 오토맵이 꺼져 endTalk에서 다시 켠다.
- 확인: 261001 a2 trace `[TK] talk skipped 1` 4건(모두 스페이스 한 번), `[TK] cancel during talk` 0건. 261004까지 덤프로 본 크래시 4건 중 유형 B 0건.

## Packet.skipTalk

### 261001 Claude: 대사 넘기기 (openMenu 항목 참고)
- 스페이스를 보내 대사를 정상 종료한다.

## Packet.endTalk

### 261001 Claude: 대사 끝 처리 (openMenu 항목 참고)
- trace `[TK] talk skipped <횟수> npc:<이름>`, 오토맵이 꺼져 있으면 다시 켬.
