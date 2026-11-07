# 프리징 애로우 프리즈 길이 (Freezing Arrow, skill 31)

정보 파일(261103~261107). 근거: **데이터** = d2reference 브랜치 `mpqdata/` / **측정** = 261104·261105·261107 인게임 측정 / **사용자** = 사용자 확인. 1프레임 = 40ms(측정값과 맞음).

## 1. 결론
- **프리즈 프레임 = 내림[(50 × (1 + IA × 0.05) + CL) ÷ D × (100 − R) ÷ 100]**
  - `IA` = 아이스 애로우 직접 포인트(`me.getSkill(21, 0)`), `CL` = 캐릭터 냉기 길이 합계(`me.getStat(56)`, 프레임), `D` = 난이도 보정(노멀 1, 나이트메어 2, 헬 4), `R` = 몹 냉기 저항(`getStat(43)`).
  - 예: 헬, IA 20, CL 1050, Fallen(저항 40) → (100 + 1050) ÷ 4 × 60 ÷ 100 = 172.5 → 172프레임 · 6.88초.
- 시너지(아이스 애로우)는 프리징 애로우 기본 길이(50프레임)에만 곱해지고, 아이템 냉기 길이에는 곱해지지 않는다.
- 아이템 냉기 길이는 출처(반지, 목걸이, 갑옷 룬워드, 참, 무기 소켓 룬, 주얼)와 상관없이 스탯 56으로 합산되어 더해진다.
- 상한 없음: CL 1050(287프레임, 11.5초)까지 측정.
- 얼어 있는 동안 다시 맞으면 그 시점부터 새 길이로 갱신되고, 누적되지 않는다.
- 대상은 헬만이다. 노멀·나이트메어는 보정이 작고 몹이 한두 발에 죽어 다루지 않는다.

## 2. 얼지 않는 대상
- 냉기 면역(저항 100 이상).
- 냉기 효과 0인 몹(냉기 면역이 아니어도).
- 챔피언·유니크. 챔피언·유니크를 따라다니는 무리(`spectype` 8)는 일반 몹과 똑같이 언다.

## 3. 테스트 필요
- Vampire Gaze(그림 헬름 유니크, `xh9`): `uniqueitems.txt` `Vampiregaze` `dmg-cold` 파라미터 100.
- 냉기 길이 참이 지금(11개)보다 많을 때.
- 접두사와 접미사에 냉기 길이가 둘 다 붙은 참(50)이 합산되는지.
- 사파이어(무기 소켓): `gems.txt` 무기 `cold-len` Chipped 25, Flawed 35, 일반 50, Flawless 60, Perfect 75. 헬멧·방패에는 냉기 길이가 없다.

## 4. 확인된 값 (데이터)
- **Freezing Arrow** (`skills.txt`): `ELen = 50`(2초), `ELevLen` 없음 → 스킬 레벨·+스킬로 길이 안 늘어남. `ELenSymPerCalc = Ice Arrow blvl × 5`% → 아이스 애로우 **직접 포인트**만 시너지. 콜드 애로우는 데미지 시너지만.
- **얼리는 것은 폭발** (`missiles.txt`): `freezingarrow`(87) → `freezingarrowexp3`(657) 반경 5, `EType = frze`. `AlwaysExplode = 1`.
- **난이도** (`difficultylevels.txt` `MonsterFreezeDivisor`): 노멀 1, 나이트메어 2, 헬 4.
- **번호**: 상태 `freeze` 1, `cold` 11, `holywindcold` 44(`states.txt`). 스탯 `coldresist` 43, `coldlength` 56, `item_halffreezeduration` 118, `item_freeze` 134, `item_pierce_cold` 305(`itemstatcost.txt`). nip 키 `[coldlength]` = 56(`NTItemAlias.dbl`).
- **냉기 길이 속성** (`properties.txt`): `cold-len` = 스탯 56. `dmg-cold` = 냉기 최소·최대 피해와 스탯 56(파라미터가 냉기 길이).
- **참 냉기 길이** (`magicprefix.txt`·`magicsuffix.txt`): 접두사 Snowflake·Shivering·Boreal·Hibernal(`mod1`), 접미사 of Frost·of the Icicle·of the Glacier·of Winter(`mod3`) 모두 `cold-len` 25 고정. 크기(스몰·라지·그랜드) 무관. 마법 참은 **0 / 25 / 50**뿐. 유니크 참에는 없음.
- **주얼 냉기 길이** (`magicsuffix.txt`): 접미사 `of Frigidity`(`jewl`) `cold-len` 50 고정(냉기 피해 1~3 / 5 함께).
- **Holy Freeze**(114): 속도 감소 오라, 프리즈(상태 1) 아님.
- **`M.BOWF`**: Freezing Arrow 20 → Cold Arrow 20 → Ice Arrow 20. 완성 시 시너지 +100%.
- **Hell Bovine** (`monstats.txt`, `levels.txt` 39): classid 391, 헬 냉기 저항 50. 카우 레벨에는 이 몹만 나옴.

**냉기 길이 아이템** (값은 데이터, 측정에서 `coldlen` 합계로 확인)
| 아이템 | 부위 | 냉기 길이 | 데이터 |
|---|---|---|---|
| Raven Frost | 반지 | 100 | `uniqueitems.txt` `dmg-cold` 파라미터 100 |
| The Eye of Etlich | 목걸이 | 50~250(측정에 쓴 것 75) | `uniqueitems.txt` `cold-len` |
| Duress | 갑옷 룬워드 | 50 | `runes.txt` Duress(Shael Um Thul) `dmg-cold` 파라미터 50 |
| 냉기 길이 참 | 인벤토리 | 25 | 위 참 접두사·접미사 |
| Thul 룬 | 무기 소켓 | 룬마다 75 | `gems.txt` Thul 무기 `dmg-cold` 파라미터 75 |
| of Frigidity 주얼 | 무기 소켓 | 50 | 위 주얼 접미사 |

## 5. 측정 방법
- 헬, 혼자, **맵 진입점**(`D2BotMap.dbj`)으로 들어가 손으로 플레이. 블러드 무어·콜드 플레인·이블 동굴·카우 레벨.
- 측정 캐릭터: `aozo-qe`(아마존). 아이스 애로우 직접 포인트 20.
- 운용: 한 발 쏘고, 얼은 몹이 다 풀린 뒤 다음 발을 쏜다. 예상보다 0.5초 이상 긴 줄(얼어 있는 동안 다시 맞은 줄)은 뺐다. 몹이 많은 묶음은 중앙값으로 본다.
- 측정 코드: `threads/MapThread.js` **Numpad 5**로 켜고 끈다(머리 위 글자 `Freeze log on`/`off`). `this.freezeCheck`가 메인 루프(20ms)마다 `getUnit(1)`을 돌며, 거리 30 안에서 상태 1이 새로 켜진 몹의 시각을 적고, 상태 1이 꺼지면 한 줄을 남긴다. 도중에 죽거나 목록에서 사라진 몹은 기록 없이 지운다.
  - 줄 형식: `[FREEZE] 이름 classid=… spectype=… ms=… coldres=… diff=… ia=… coldlen=… (지역 x,y)`. `ia` = 아이스 애로우 직접 포인트, `coldlen` = 캐릭터 냉기 길이 합계(스탯 56).
  - 기록: `Misc.trace`(`_cache/trace/trace-<프로필>-<날짜>.txt`)와 `print`(d2bs 로그).
- 맵 진입점이면 `default.dbj`가 `threads/MapThread.js`만 띄운다(+ `MapHelper.js`). `ToolsThread`(자동 물약·치킨)는 돌지 않는다.
- 정해진 창(`hideFlags`, `gamedata/ids.md` "UI 플래그" 절)이 열려 있으면 MapThread 루프 전체가 멈춰 그 사이 풀린 몹은 값이 길게 나온다. 측정 중 피할 것: Alt, 인벤토리(I)·스탯(C)·퀘스트(Q), ESC 메뉴, 메시지 기록, 도움말. 자동맵(Tab)·벨트 물약은 괜찮음.
- MapThread 숫자패드: 0 다음 지역, 1 이전 지역, 2 웨이포인트, 3 주요 지점(POI), 4 옆 지역, 5 프리즈 측정 켜기·끄기, 7 몬스터 표시, 8 경로 선, `*` 좌표, `−` 플레이어 거리.

## 6. 측정 결과
조건: 헬, IA 20. 예상 = 1절 식.

| CL | 착용 | 몹 (저항) | 예상 | 측정 (ms) | 대표값 |
|---|---|---|---|---|---|
| 0 | — | Quill Rat (50) | 12f · 480 | 500 | 500 |
| 100 | | Quill Rat (50) | 25f · 1000 | 1032 | 1032 |
| 175 | | Quill Rat (50) | 34f · 1360 | 1328 | 1328 |
| 225 | | Quill Rat (50) | 40f · 1600 | 1562 | 1562 |
| 250 | | Quill Rat (50) | 43f · 1720 | 1719 | 1719 |
| 250 | | Fallen (40) | 52f · 2080 | 2094 ×2 | 2094 |
| 325 | | Fallen (40) | 63f · 2520 | 2484~2547 (5줄) | 평균 2522 |
| 400 | | Quill Rat (50) | 62f · 2480 | 2453 ×3, 2485 | 2461 |
| 475 | 반지 100, 목걸이 75, 참 75, Thul 3 225 | Fallen (40) | 86f · 3440 | 3406~3469 (14줄) | 평균 3433 |
| 475 | 〃 | Quill Rat (50) | 71f · 2840 | 2797~2844 (3줄) | 평균 2823 |
| 475 | 〃 | Fallen Shaman (0) | 143f · 5720 | 5703~5735 (3줄) | 평균 5724 |
| 475 | 〃 | Hell Bovine (50), 카우 | 71f · 2840 | 2828~3016 (44줄) | 중앙값 2844 |
| 550 | 반지 200, 목걸이 75, Duress 50, 참 225, 일반 무기 | Fallen (40) | 97f · 3880 | 3843~4063 (8줄) | 중앙값 3898.5 |
| 550 | 〃 | Fallen Shaman (0) | 162f · 6480 | 6485~6516 (3줄) | 중앙값 6500 |
| 775 | 위 + Thul 3 225 | Fallen (40) | 131f · 5240 | 5234~5281 (13줄) | 중앙값 5250 |
| 775 | 〃 | Fallen Shaman (0) | 218f · 8720 | 8688~8719 (4줄) | 중앙값 8719 |
| 1050 | 반지 200, 목걸이 75, Duress 50, 참 275(11개), Thul 6 450 | Quill Rat (50) | 143f · 5720 | 5688~5984 (12줄) | 중앙값 5718.5 |
| 1050 | 〃 | Fallen (40) | 172f · 6880 | 6859~6953 (25줄) | 중앙값 6875 |
| 1050 | 〃 | Fallen Shaman (0) | 287f · 11480 | 11453~11531 (10줄) | 중앙값 11476.5 |
| 1025 | 위에서 무기만 Thul 5 375 + of Frigidity 주얼 50 | Fallen (40) | 168f · 6720 | 6672~6906 (41줄) | 중앙값 6719 |
| 1025 | 〃 | Fallen Shaman (0) | 281f · 11240 | 11219~11282 (6줄) | 중앙값 11258 |

- 참은 모두 접두사나 접미사 하나만 붙은 25짜리.

## 7. 출처
- 데이터: mpqdata `skills.txt`, `missiles.txt`, `difficultylevels.txt`, `states.txt`, `itemstatcost.txt`, `properties.txt`, `magicprefix.txt`, `magicsuffix.txt`, `uniqueitems.txt`, `runes.txt`, `gems.txt`, `monstats.txt`, `levels.txt`
- 웹: [Basin Freeze length](https://www.theamazonbasin.com/wiki/index.php/Freeze_length), [Basin Freezing Arrow](https://www.theamazonbasin.com/wiki/index.php/Freezing_Arrow), [Basin Cold Damage](https://www.theamazonbasin.com/wiki/index.php/Cold_Damage), [Basin Cold Resist](https://theamazonbasin.com/wiki/index.php/Cold_Resist), [maxroll Crowd Control](https://maxroll.gg/d2/resources/crowd-control), [fandom Freeze](https://diablo.fandom.com/wiki/Freeze), [GameFAQs](https://gamefaqs.gamespot.com/boards/370600-diablo-ii-lord-of-destruction/49885099).
