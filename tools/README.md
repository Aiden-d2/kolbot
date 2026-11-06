# 분석 도구 (1.14d Game.exe · DS1 · mpqdata txt)

`gamedata/tc.md`·`gamedata/experience.md`를 만들 때 쓴 스크립트(261105). 같은 분석을 다시 하지 않도록 남긴다. 찾은 주소는 `gamedata/exe_1.14d.md`.

## 준비

- 필요한 것: 1.14d `Game.exe`(FileVersion 1.14.3.71, 저장소에 없음, 사용자가 올림), Python 3, 인터넷(pip `capstone`·`pefile`).
- kolbot 저장소 안에서(`git fetch origin d2reference` 뒤):

```bash
bash <(git show origin/d2reference:tools/setup.sh) <작업 폴더> <Game.exe 경로>
```

- 만들어지는 것: `<작업 폴더>/tools/`(이 폴더), `exe/Game.exe`, txt 파일(줄 끝 `\r` 제거), `ds1/mpqdata/tiles/`(DS1 2,384개), `text.asm`(`.text` 전체 역어셈블, 약 107만 줄, 3초).
- D2MOO(1.10f 재구성 소스, 많은 함수에 1.14d 주소 주석)는 필요할 때 `git clone --depth 1 https://github.com/ThePhrozenKeep/D2MOO.git`. 261105에 대조한 판은 `4a60fca`(2026-11-02). `enums.json`은 그 판의 `source/D2Common/include/DataTbls/LevelsIds.h`에서 만든 것(`LEVEL_*`·`LVLPREST_*`·`LVLTYPE_*` 번호)이다.

## 스크립트 (모두 `python3 -I <작업 폴더>/tools/<파일> ...`)

| 파일 | 하는 일 | 인자 |
|---|---|---|
| `exe.py` | 다른 스크립트가 불러 쓰는 exe 읽기 모듈: 주소로 바이트 읽기(`rd`, `d32`), 바이트 찾기(`find`, `pk`로 int 묶음), 주소를 담은 코드 찾기(`xref`), 역어셈블(`dis`), 지역·지도 번호 이름(`lvl`, `pr`) | - |
| `full.py` | `.text` 전체를 `text.asm`으로 역어셈블(주소·명령·인자 탭 구분) | `<작업 폴더>/tools` |
| `g.py` | `text.asm`에서 주소 구간 안의 줄을 정규식으로 찾기(앞뒤 줄 수 지정) | `<시작 hex> <끝 hex> <정규식> [앞뒤 줄]` |
| `d.py` | 주소 구간을 바로 역어셈블, 비교값에 지역 이름 표시 | `<작업 폴더>/tools <시작 hex> <끝 hex>` |
| `enums.py` | D2MOO 헤더에서 `enums.json` 다시 만들기 | `<헤더 경로>...` |
| `maze_arrays.py` | D2MOO `DrlgMaze.cpp`의 지도 배열이 exe에 값 그대로 있는지(주소) | `<작업 폴더>/tools <DrlgMaze.cpp>` |
| `arrnames.py` | 지도 배열 내용을 `lvlprest.txt` 이름과 함께 출력 | `<작업 폴더>/tools <주소hex>:<개수>...` |
| `ds1.py` | DS1의 프리셋 몬스터 중 슈퍼유니크를 찾아 `su_ds1.json`으로 | `<작업 폴더>` |
| `prest_su.py` | `su_ds1.json` + `lvlprest.txt` → 슈퍼유니크가 있는 지도 번호 (결과: `data/superunique_lvlprest.txt`) | `<작업 폴더>` |
| `ds1find.py` | 프리셋 몬스터·오브젝트가 들어 있는 DS1 찾기 | `<작업 폴더> <액트 0~4> <1=몬스터 2=오브젝트> <프리셋 번호>...` |
| `tccalc.py` | `tc.md` 1절 규칙으로 지역·슈퍼유니크·보스 표를 다시 계산해 `tc.md`와 칸마다 비교(다른 칸만 출력, 끝에 줄 수·다른 칸 수) | `<작업 폴더> <tc.md 경로>` |
| `expcalc.py` | 헬 바알런·디아런 경험치(조건 A~C, `experience.md` 2절) | `<작업 폴더> [시작 레벨] [끝 레벨]` |
| `huntexp.py` | kolbot 사냥 경로(디아 날개·봉인·디아·웨이브·바알·니라탁 본체) 경험치 표 전부(`experience.md` 3절, 파티원 수 1~8) | `<작업 폴더> [시작 레벨] [끝 레벨]` |
| `tcpath.py` | TC 하나의 하위 TC 나무와 각 단계의 (장비 최댓값, 룬 번호) | `<작업 폴더> "<TC 이름>"` |

- DS1의 오브젝트 프리셋 번호 → `objects.txt` 번호는 exe 표 `0x748AD8`(액트당 150칸, `int`)로 바꾼다(`exe_1.14d.md`).
- `data/superunique_lvlprest.txt`: 슈퍼유니크가 들어 있는 `lvlprest.txt` 번호 | 이름 | `LevelId` | 슈퍼유니크(DS1을 다시 읽지 않고 쓸 수 있다).
