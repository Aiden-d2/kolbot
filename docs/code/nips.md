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

## A.TRAP.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 15줄, `[tiered]` 1줄.

## B.WCRY.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 2줄, 기어 키 이름 15줄, `[tiered]` 2줄.

## D.FGOM.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 15줄, `[tiered]` 1줄.

## D.WIND.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 15줄, `[tiered]` 1줄.

## M.HYBR.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 5줄, 홀드 `[qty]` → `[owned]` 2줄, 기어 키 이름 19줄.

## N.SUMM.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 15줄, `[tiered]` 1줄.

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

## S.FIRE.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

## S.FONV.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

## S.LTNG.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

## S.SFFW.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 1줄, 기어 키 이름 12줄, `[tiered]` 1줄.

## V.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty] < 1` 삭제 4줄.

## X.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- 홀드 `[qty]` → `[owned]` 1줄.

## Z.nip

### 261028 사용자: nip 문법 변경 (handoff 3-39)
- `[tiered]` 16줄 (주석으로 꺼 둔 2줄 포함).
