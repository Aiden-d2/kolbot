# nips/*.nip

261027~261028 사용자 업로드: 소켓 우선 tier·기어 조건(`723a581`·`5bf237c`·`8a162f8`·`19a2d70`·`c999fab`·`8144c74`, PR #103, 옛 handoff 3-39):
- 소켓 tier: 소켓 1개부터 소켓 수마다 tier 1씩. 헬름(빌드 14개)·바바리안 헬름·드루이드 펠트 1~3, X.nip 아머 1~3, X.nip 방패 1~2, 팔라딘 방패 1~4, 네크로맨서 머리 1~2. 소켓 0개 tier 줄은 없음. 무기는 M.HYBR 활만(tier 1 아무 활, 2~5 데미지 또는 소켓 1~4).
- tier 11 이상 점수 줄 품질 하한 `>= normal`: 헬름(빌드 14개), X.nip 아머·방패, 클래스 전용 아이템. 장갑·부츠·벨트·반지·목걸이와 일부 무기 점수 줄은 `>= magic` 그대로.
- 유니크·룬워드 tier를 31 이상으로(룬워드 아머 31·32, 무기 31, HotO 41 등), 점수 tier는 X.nip 25·빌드 30까지. 일부 유니크·룬워드 tier 줄 삭제.
- 재료 줄을 기어 조건(옛 이름 `[body] < 31`, `[armr] < 31`, `[arml] < 25` 등)으로 교체, 빌드 `TierGoal` 숫자 변경.
- 확인: 261028 로그(`8144c74`까지) — 노말 헬름 소켓 tier 1~2 착용 6건, 보석을 넣은 뒤 tier 11~17(Gemmed Cap 11·12, Skull Cap 12, Rondache 15·17 등, `Socketed` 49줄 중 34줄에 tier 표시), 기어 조건 표시 99줄(`(ArmL<25)` 등 옛 이름), nip 로드 오류 0. 검증 통과(사용자 판정 261028, 여러 사이클).

261028 문법 변경(handoff 3-39, 문법은 `NTItemParser.md` ParseExpr·ParseRule):
- 홀드 끝 칸 `[qty]` → `[owned]`. 기본값이 `< 1`이므로 `# [qty] < 1`은 지움.
- 기어 조건 키 `[body]` → `[armor]`, `[armr]` → `[armg]`, `[arml]` → `[armb]`(다른 칸 키는 nip에서 쓰는 곳 없음).
- `[tiered] == 0` → `[tiered]`.
- 바꾼 줄 끝에 `//261028` 메모.
- 확인: 261029 로그 — nip 로드 오류·표시 줄 0(ScriptErrorLog·회색 콘솔), print `equipped:` 새 칸 이름만, ItemLog 기어 조건 표시 124줄(그중 100줄을 그 시각 착용 tier와 대조, 기준 이상이 된 뒤 줍기 0). `[tiered]`(ItemLog `(Tiered)` 0)·홀드 기본값은 사례를 확인하지 않음. 검증 통과(사용자 261029, 같은 헤더 항목 공통).

261102 사용자·Claude: 빌드 이름 변경·점수식 통일·줄 끝 주석 삭제 (handoff 3-62):
- 빌드 이름(사용자 업로드 `5e7e7e1`·`b7b65dd`): M.HYBR → M.BOWF, S.FONV → S.NORB, S.SFFW → S.ENCH, P.CONC → P.AURA, P.CONV·P.FIST → P.HAMM(새 빌드). 이 노트의 옛 이름 절은 옛 파일의 기록이다.
- 기본 양식(X.nip, 사용자 업로드 `0c7de18`~`ad57938`): 점수식 순서 = 캐릭터 전용 옵션 → 클래스스킬부 → 올스킬 → 파트 전용 옵션 → 패스트 3종(`[frw]/2` → `[fhr]/2` → `[fcr]/2`) → 마나(`[itemmaxmanapercent]` → `[manarecoverybonus]/2`) → 공통부 `[maxhp]+[vitality]+[maxmana]+[energy]+([coldresist]+[fireresist]+[lightresist]+[poisonresist])*0.8`. 붙지 않는 옵션은 생략(아머는 `[itemmaxmanapercent]` 없음). A.TRAP·M.BOWF는 사용자가 이 양식으로 고친 샘플.
- 공용 부위(헬름·목걸이) 클래스스킬부: `[직업스킬]*Y-[itemaddclassskills]*60+[스킬탭]*N-[itemaddskilltab]*30`. 하위 번호 없는 `[itemaddclassskills]`·`[itemaddskilltab]`은 어느 직업·스킬탭이든 처음 0이 아닌 값을 돌려주므로(`Prototypes.js` getStatEx 83·188) 다른 직업 스킬이 붙으면 음수가 된다. 직업 전용 아이템은 빼는 항 없이 순점수(헬름의 Y−60, N−30)를 가중치로 쓴다. M.BOWF 장갑은 다른 빌드가 쓰지 않는 스킬탭만 붙으므로 빼는 항 없음(사용자).
- 빌드 nip 11개 헬름·목걸이: 위 순서로, 헬름 패스트 `frw → fhr → fcr`, 목걸이 `[fcr]/2` 추가·`[manarecoverybonus]*0.5` → `/2`, 공통부 X.nip 형식(가중치·기준값·tier 숫자는 그대로).
- 직업 전용 방어구: 바바리안 헬름·펠트 `[fhr]` → `[fhr]/2`, 네크로맨서 머리 `[fcr]/2` 추가, 팔라딘 방패 `[itemdamagetomana]*0.5` → `/2`·`[fcr]/2` 추가, 공통부 X.nip 형식. 클래스스킬부는 그대로. 올스킬·헬름 부위 옵션은 붙지 않아 넣지 않음(사용자).
- 무기(M.BOWF 제외, tier 1~5(B.WCRY 1~10)·11~30 같은 타입): 공통 8종(mace·knife·throwingknife·throwingaxe·javelin·axe·hammer·sword) + 직업 전용(A handtohand·assassinclaw, D club, N wand, P scepter, S orb, B 없음). `[name] == …`·`thrownweapon` 삭제. 양손 거르기 `# [secondarymindamage] == 0 && …`, 바바리안 `# [mindamage] > 0 && …`(순수 양손무기에서 21이 0인지는 인게임 미확인). `[flag] != ethereal`은 tier 1~5만. tier 1~5 점수식(스탯 번호)은 그대로. tier 11~30: A `[ias]/2`, 나머지 `[fcr]/2`를 맨 앞에, 클래스스킬부 그대로(소서리스 `-[itemaddskilltab]*30`은 스킬탭 뒤로), `[itemallskills]*X`, 공통부 X.nip 형식. 품질 하한은 그대로(B.WCRY·D.* `>= magic`).
- `[FCR]` → `[fcr]`(flail 룬워드 줄).
- nip 규칙 줄(꺼 둔 규칙 포함) 뒤 주석 삭제, 날짜 표기도 달지 않음(`CLAUDE.md` 3절 예외). T.nip·Y.nip 전체와 Z.nip `[Runeword]` 절은 둠.
- 확인: 261103 로그(8프로필 90게임) — nip 로드 오류 0(ScriptErrorLog·d2bs `Error`), 양손무기 착용은 M.BOWF 활뿐(B.WCRY 한손무기만), 8프로필 모두 tier 11 이상에서도 무기를 바꿔 낌, 착용 tier가 내려간 것은 a5 화살통 1건. 용병 인사이트 베이스 `(MercArmA<11)` 표시 2줄(a5 Thresher, 용병 무기 tier -1). 용병 무기 tier 11 이상은 룬워드를 못 만들어 생길 수 없는 상황이었음. 검증 통과(사용자 261103, 옛 handoff 3-62).

261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62):
- 무기 tier 점수 줄(tier 1~5, B.WCRY 1~10, tier 11~30)의 타입을 이름 대신 번호로(`[type] == 36` 등, 번호는 `tools/NTItemAlias.dbl`). 직업 전용 무기를 맨 앞에(A.TRAP도 handtohand·assassinclaw를 앞으로).
- `[Weapon]` 절 설명 줄: 옛 아이템 번호 줄(`[handaxe]=0 …`)을 그 빌드의 타입 번호로. 직업 전용 무기 줄과 공통 8종 줄(`[mace]=36 // [knife]=32 // [throwingknife]=42 // [throwingaxe]=43 // [javelin]=44 // [axe]=28 // [hammer]=31 // [sword]=30`)로 나눔. 전용 번호: club 29, wand 25, scepter 24, orb 68, handtohand 67, assassinclaw 88.
- M.BOWF(활 줄), 유니크·룬워드 무기 줄, 재료 줄은 이름 그대로.
- 확인: 파서(node, `NTIP.OpenFile`)로 수정 전후 nip 18개 — 오류 0, 규칙 1869개 같음, 읽힌 결과 차이는 A.TRAP 25줄의 타입 순서뿐.

261102 사용자: 기어 칸 이름 (`Config.md` Gear):
- 기어 조건 키 `[armor]` → `[body]`, `[armg]` → `[arma]`, `[mercarmg]` → `[mercarma]`. `[armb]`는 이름 그대로. 빌드 nip 13개와 V.nip, 꺼 둔 규칙 포함 219곳(`[arma]` 90, `[armb]` 63, `[body]` 62, `[mercarma]` 4). 다른 칸 키는 nip에서 쓰는 곳 없음.
- 아이템 분류 설명 줄(`// [Helm] …`, `// [Armor] …` 등)은 그대로 둠(사용자 결정 261102).

261102 사용자: 스피릿 베이스 0소켓 줄 노말만 (사용자 업로드 `8deaca1`):
- 스피릿 베이스(crystalsword·broadsword) 0소켓 줄 본문의 품질 `([quality] == normal || [quality] == superior)` → `[quality] == normal`. 무기 소켓 큐빙 레시피 입력이 `weap,nor,nos`(mpqdata `cubemain.txt`)라 노말만 큐빙되고, `Cubing.js` 펀치 레시피 판정도 노말(`quality === 2`)·0소켓만 받는다.
- 홀드(`@` 뒤)와 4소켓 줄의 `normal || superior`는 그대로(수페 4소켓도 스피릿 베이스).
- 빌드 nip 12개 13줄: A.TRAP, B.WCRY(`[arma]`·`[armb]` 2줄), D.FGOM, D.WIND, N.SUMM, P.AURA, P.HAMM, S.COLD, S.ENCH, S.FIRE, S.LTNG, S.NORB 각 1줄.
- 확인: diff 13줄이 모두 이 품질 조건만 바뀜, 본문에 superior가 남은 0소켓 줄 0개. 인게임 미확인.

## A.TRAP.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 15줄, `[tiered]` 1줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 무기 타입에서 wand·club·scepter 제외(tier 1~5·11~30 각 5·20줄), 클로 `[ias]` → `[ias]/2` 20줄, 줄 끝 주석 16줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호·전용 무기 앞으로, 설명 줄 2줄과 구분선 1줄 새로.

## B.WCRY.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 2줄, 기어 키 이름 15줄, `[tiered]` 2줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 바바리안 헬름 20줄, 무기 30줄(공통 8종, `[mindamage] > 0`), 줄 끝 주석 17줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 30줄 타입 번호, 설명 줄 1줄(공통 8종).

## D.FGOM.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 15줄, `[tiered]` 1줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 펠트 20줄, 무기 25줄(club + 공통 8종), 줄 끝 주석 17줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## D.WIND.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 15줄, `[tiered]` 1줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 펠트 20줄, 무기 25줄(club + 공통 8종), 줄 끝 주석 18줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## M.BOWF.nip


### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 줄 끝 주석 20줄(점수식은 사용자 샘플 그대로).

## M.HYBR.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 5줄, 홀드 `[qty]` → `[owned]` 2줄, 기어 키 이름 19줄.

## N.SUMM.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 15줄, `[tiered]` 1줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 머리 20줄, 무기 25줄(wand + 공통 8종), `[FCR]` 1줄, 줄 끝 주석 17줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## P.AURA.nip


### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 방패 20줄, 무기 25줄(scepter + 공통 8종), 줄 끝 주석 18줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## P.HAMM.nip


### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 방패 20줄, 무기 25줄(scepter + 공통 8종), 줄 끝 주석 18줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## P.CONC.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 3줄, 기어 키 이름 16줄.

## P.CONV.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 3줄, 기어 키 이름 16줄.

## P.FIST.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 3줄, 기어 키 이름 15줄, `[tiered]` 1줄, 주석으로 꺼 둔 Eld 룬 줄의 `&& [tiered] != 0` 삭제.

## S.COLD.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 무기 25줄(orb + 공통 8종), `[FCR]` 1줄, 줄 끝 주석 14줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## S.ENCH.nip


### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 무기 25줄(orb + 공통 8종), `[FCR]` 1줄, 줄 끝 주석 14줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## S.FIRE.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 무기 25줄(orb + 공통 8종), `[FCR]` 1줄, 줄 끝 주석 14줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## S.FONV.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

## S.LTNG.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 무기 25줄(orb + 공통 8종), `[FCR]` 1줄, 줄 끝 주석 14줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## S.NORB.nip


### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 헬름·목걸이 40줄, 무기 25줄(orb + 공통 8종), `[FCR]` 1줄, 줄 끝 주석 14줄.

### 261102 사용자·Claude: 무기 타입 번호 표기 (handoff 3-62)
- 무기 25줄 타입 번호, 설명 줄 1줄 → 2줄.

## S.SFFW.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

## V.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 4줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 인사이트·오비디언스 베이스 줄(사용자 업로드 `ad57938`, 홀드 → `[qty] == 1`·기어 조건)의 `[armg]`(플레이어 무기 칸) → `[mercarmg]`(용병 무기 칸) 4줄. `[qty]`·홀드 개수는 용병 아이템까지 센다(`NTItemParser` CheckQuantityOwned). 용병 헬름·아머 tier 9단계 → 5단계는 사용자 업로드(의도).

## X.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty]` → `[owned]` 1줄.

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- 줄 끝 주석 1줄.

## Z.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- `[tiered]` 16줄 (주석으로 꺼 둔 2줄 포함).

### 261102 사용자·Claude: 점수식 통일·줄 끝 주석 삭제 (handoff 3-62)
- `[Tiered]` 절 줄 끝 주석 16줄(꺼 둔 규칙 2줄 포함).
