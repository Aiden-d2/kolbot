# 크래시 분석 절차 (261004)

크래시 분석을 다시 할 때 이 순서대로 한다. 유형별 분석 결과와 근거는 6절에 있다.

## 0. 현재 방침 (사용자 결정 261004)
- ProcDump를 끄고, 크래시마다 하던 분석을 그만둔다.
  - 근거: 유형 B(우리 원인)는 PR #18로 고친 뒤 0건이다. 남은 유형은 게임 내부 원인이라 고칠 수 없다.
  - 빈도: 5사이클째, 사이클(약 55런 × 8프로필)마다 크래시 1~2건이다.
  - 용병 고용 중 멈춤은 리스너 위치를 바꾼 뒤 24회 넘게 고용하는 동안 재발이 없었다.
- **다시 켜는 조건:**
  1. 매니저 콘솔에 "D2BS is not responding"이 다시 나올 때. `-h` 덤프로 메인 스레드가 D2BS 패킷 이벤트 대기(`Events.cpp` `PacketEventCallback`) 안에 있는지 본다.
  2. 크래시가 눈에 띄게 잦아질 때. 매니저의 Crashes 열로 본다.
  3. NPC 대화나 오브젝트 대사(저널·Anya·고대인 제단) 직후에 크래시가 날 때. 유형 B 재발을 의심한다.
  4. Game.exe, D2BS.dll, 모드(MPQ)를 바꾼 뒤 크래시가 날 때.

## 1. 수집 설정 (Windows, ProcDump)
- 도구: Sysinternals ProcDump. 덤프 폴더는 `C:\CrashDumps`.
- 쓰던 설정은 procdump 로그 머리에서 확인했다:
  - `-e`: 처리되지 않은 예외만 덤프
  - `-h`: 창이 응답하지 않으면(hung window) 덤프
  - `-n 10`: 덤프 최대 10개
  - 파일 이름 `PROCESSNAME_YYMMDD_HHMMSS`(기본값), WER 전달 안 함, 덤프 뒤 종료 안 함
- Game.exe마다 PID별 로그 `procdump_<PID>.log`를 남긴다. 이전 로그는 UTF-16이었으므로 PowerShell `>`로 남긴 것으로 보인다.
- 아래 스크립트는 위 설정으로 다시 짠 것이다(Claude 작성 261004). 사용자가 쓰던 원본 스크립트는 저장소에 기록되지 않았다. 원본이 있으면 그것을 쓴다.

```powershell
# C:\CrashDumps\watch.ps1  — 관리자 PowerShell에서: powershell -ExecutionPolicy Bypass -File C:\CrashDumps\watch.ps1
$dir      = 'C:\CrashDumps'
$procdump = 'C:\Tools\procdump.exe'          # 설치 경로에 맞게 고친다
$seen     = @{}
New-Item -ItemType Directory -Force -Path $dir | Out-Null
while ($true) {
    foreach ($p in Get-Process -Name Game -ErrorAction SilentlyContinue) {
        if ($seen.ContainsKey($p.Id)) { continue }
        $seen[$p.Id] = $true
        $log = Join-Path $dir ("procdump_{0}.log" -f $p.Id)
        # 새 Game.exe마다 procdump 하나를 붙인다. 프로세스가 끝나면 procdump도 끝난다
        Start-Process -FilePath $procdump `
            -ArgumentList '-accepteula', '-e', '-h', '-n', '10', $p.Id, $dir `
            -RedirectStandardOutput $log -WindowStyle Hidden
    }
    Start-Sleep -Seconds 2
}
```

- 끄기: 스크립트 창에서 Ctrl+C. 이미 붙은 procdump는 그 Game.exe가 끝날 때 같이 끝난다. 바로 끄려면 `Get-Process procdump* | Stop-Process`. procdump는 대상 프로세스를 죽이지 않는다.
- 덤프 크기:
  - `-n 10`이면 한 크래시에 약 6MB × 10이다. 필요한 것은 첫 덤프 하나라서 `-n 1`이어도 된다.
  - 기본 미니덤프(약 6MB)에는 힙이 없다. 그래서 "어느 유닛인지"를 늘 알아내지 못했다.
  - 힙까지 보려면 `-ma`(전체 덤프, 수백 MB)를 더한다. 이유를 꼭 알아내야 하는 유형일 때만 쓴다.
- 지난 크래시 덤프 지우기: `Remove-Item C:\CrashDumps\*.dmp`

## 2. 크래시 하나에 모을 파일
매니저 콘솔에서 `Window has unexpectedly exited`가 찍힌 프로필과 시각을 확인한다. 크래시는 이 줄보다 1~3초 먼저 났다.

1. **`procdump_<PID>.log`**
   - 크래시 시각에 `Unhandled` 줄이 있는 로그를 고른다(약 7KB).
   - 몇 초 뒤에 생긴 약 1.5KB 로그는 재시작된 새 프로세스다.
   - 덤프 이름의 시각이 다른 로그와 섞이지 않았는지 꼭 맞춰 본다. 261004에 다른 크래시(10/3 22:11) 로그가 섞여 온 적이 있다.
   - 처음 `Unhandled` 앞에 `Exception`만 있는 줄(잡힌 예외)이 있는지 본다. 4번 건은 이 앞선 예외가 원인으로 보였다.
2. **첫 덤프**
   - 로그의 `Dump 1 initiated:`에 적힌 파일이다(예: `Game.exe_261004_011006.dmp`).
   - `-1`, `-2` 같은 접미사가 붙은 파일과 이후 시각의 파일은 D2BS `exit0` 버그로 다시 튕긴 2차 예외라 보지 않는다.
3. **그 프로필의 trace**: `_cache/trace/trace-<프로필>-<날짜>.txt`. 크래시 직전 동작을 본다(마지막 줄, `[TK]`·`[OD]`).
4. 필요할 때만 받는 것:
   - d2bs 로그. 크래시는 EXCEPTION 줄을 남기지 않는다(exit0 버그).
   - WER 덤프 `Game.exe.<PID>.dmp`. 머리 예외 0x576F0C는 2차 크래시라 원인이 아니다. 7번처럼 다른 스레드 상태를 볼 때만 쓴다.
   - 깊은 역어셈블이 필요하면 Game.exe(1.14d)와 D2BS.dll(1.6.4U). 미니덤프에는 예외 지점 근처 코드만 들어 있다.

## 3. 분석 (Claude 세션, Linux)
```bash
pip install minidump capstone
python3 docs/claude/crash_dmpinfo.py <첫 덤프.dmp>
```
- 출력 항목:
  - 예외 코드·주소, 읽기/쓰기 대상, 모듈+오프셋
  - 스레드: 스택이 0x19f000대면 메인 스레드다.
  - 레지스터
  - 예외 지점 앞뒤 역어셈블
  - EBP 체인: 돌아갈 주소와 인자 4개
- 추가 인자:
  - `주소:앞:뒤`: 그 주소 앞뒤 코드를 역어셈블한다. 덤프에 있는 범위만 된다.
  - `@주소:바이트`: 메모리를 dword로 출력한다. 예: `@7a6a70:4` = 내 유닛 포인터 `[0x7a6a70]`.
- 주의:
  - 스크립트 파일 이름을 `dis.py`로 하지 않는다. 파이썬 표준 `dis` 모듈을 가려 capstone import가 실패한다.
  - 덤프에 힙이 없어 유닛 구조체는 읽을 수 없다.

## 4. 분류 (예외 주소 → 유형, 세부는 6절)
| 예외 주소 | 유형 | 알아보는 표시 | 원인 | 조치 |
|---|---|---|---|---|
| 0x661406 | **B** NPC 대화 콜백 | 스택 0x4a080b → 0x4b6a45 → 0x4b1863, `[0x7bf258]`=0x4b6a30, `[0x7bf250]`=NULL | **우리 스크립트** (대사 중 `me.cancel()`) | 깊이 분석: trace `[TK]`·`[OD]`, `[0x7bf212]`·`[0x7c0c77]` → string.tbl |
| 0x6489C6 | A 그리기 중 유닛 경로 NULL | NULL+8 읽기, 0x4df5f4 → 0x471667 → 0x471537 → 0x620693 | 게임 내부 | 기록만 |
| 0x6494DC | C | ESI=0, EAX=0, ECX·EDX=좌표, 0x649bdc → 0x4807b2 → 0x4613ca → 0x481331 → 0x48156c → 0x4816ef → 0x44f12b | 게임 내부 | 기록만 |
| 0x66f99f | D 방 추가 패킷 0x07 | 패킷 루프 0x45f8e9 → 0x45cab0 → 0x61a070 … | 게임 내부 | 기록만 |
| 0x5ff28e | SpriteCache 목록 손상 | 그리기 루프 0x4df510 → 0x471620 → … → 0x5ff1b0 | 게임 내부 | 기록만 |
| 0x481617 | 해제된 유닛·Act | 게임 루프 0x44efb0, 내 유닛·Act MEM_FREE | 앞선 잡힌 예외(추정) | 기록만 |
| 0x2F11BC9 (D2BS+0x1bc9) | 해제된 내 유닛 | D2BS 스크립트 스레드, `GetPlayerUnit()+0x70` 읽기 | 게임 내부(추정) | 기록만 |
| 0x576F08 / 0x576F0C | 2차 크래시 (exit0 버그) | WER 덤프 머리 예외 | — | 원래 예외는 첫 procdump 덤프에서 본다. 첫 덤프가 이 주소면 스택의 EXCEPTION_POINTERS에서 꺼낸다(260930 유형 C) |
| 그 밖 | 새 유형 | — | — | 깊이 분석: EBP 체인, Game.exe 역어셈블, trace 대조 |

- D2BS.dll 기준 주소는 실행마다 다르다(0x2d60000, 0x2f70000 등). D2BS 안 주소는 모듈+오프셋으로 비교한다.
- 유형 C의 ECX(x)·EDX(y)는 크래시 순간 좌표다. 261004 a3 건은 그 프로필의 trace 마지막 위치와 정확히 같았다.

## 5. 기록
- 6절 크래시 목록에 번호, 프로필·시각·지역, 첫 덤프 이름, 예외 주소, 유형, trace 마지막 동작을 한 줄씩 더한다.
- 노트는 대화 중에 쓰지 않고 커밋 요청 때 쓴다(CLAUDE.md).

## 6. 유형별 분석 결과 (260929~261004, Game.exe 1.14d 역어셈블, handoff에서 옮김 261021)
다시 분석할 때의 절차(수집 설정, 모을 파일, 분석 스크립트, 주소별 분류표)는 `crash_analysis.md`에 있다(261004).
ProcDump(`C:\CrashDumps`)가 원래 예외 지점을 잡는다. WER 덤프의 0x576F0C는 D2BS `exit0` 버그로 생긴 두 번째 크래시라 원인이 아니다.

**유형 A: 그리기 중 유닛 경로 NULL (Game.exe 0x6489C6), 2건 (a1 10:11, a5 10:58)**
- 그리기 목록 루프(0x4df510) → 유닛 그리기(0x471620/0x471450, Gfx.cpp) → D2Common 좌표 함수(0x620650) → `unit+0x2C`(동적 경로) NULL.
- 유닛 종류(플레이어·몬스터·미사일)와 NULL이 된 이유는 모른다. 스택의 애니메이션 문자열은 앞서 그린 유닛의 흔적이다(`bm`은 오브젝트 285 화로).
- 임바모드(Patch_D2_eom.mpq)는 오브젝트 Draw 제거, 미사일 CelFile null·클라이언트 보조 미사일 제거, SO/PA DCC 교체 등 시각 요소만 바꾼다. 직접 원인이라는 증거는 없다.
- Game.exe 패치(그리기 건너뛰기)는 설계까지만 했고, 사용자가 보류함(빈도 낮음, 설치 파일이라 위험).

**유형 B: NPC 대화 콜백의 메뉴 목록 NULL (Game.exe 0x661406), 1건 (a7 14:00:30, 서머너 저널)**
- 게임은 대사 텍스트가 끝날 때 `[0x7bf258]` 콜백을 실행한다(매 프레임 0x4a0770, 클릭 0x4a17d0 → 0x4a08c0). NPC 대화 콜백 0x4b6a30은 NPC 메뉴 목록 `[0x7bf250]`을 검사 없이 읽는다(0x4b1830 → 0x661400).
- 콜백은 대화 연쇄가 정상으로 끝날 때만 스스로 지운다(0x4b6b6b, 0x4b6c42). `CloseNPCInteract`(0x4b3f10)와 `ClearScreen`(0x4b4620)은 목록을 해제하고(0x4b3c20 → 0x4a1730) 플래그 `[0x7c0c69]`를 0으로 만들지만 **콜백은 지우지 않는다.**
- 대사 텍스트 시작(0x4a1320)은 콜백을 새로 등록하지 않는다. 그래서 **NPC 대사 중 `me.cancel()`로 닫으면 오래된 콜백이 남고, 다음에 아무 대사 텍스트(NPC든 오브젝트든)가 끝날 때 크래시가 난다.** 몇 분 뒤에 날 수도 있다.
- a7 덤프 상태가 이와 같다: 콜백 0x4b6a30, 메시지 0x172, `[0x7c0c69]`=0, 목록 NULL, 처리 중이던 텍스트는 저널(`[0x7bf234]`=0x165=357). 메시지 0x172(370)는 string.tbl 370번 `A2Q3SuccessfulLysander`(Lysander 퀘스트 대사)이고, 크래시 순간 텍스트 `[0x7bf212]`=396은 `A2Q4SuccessfulNarrator`(저널 본문, 1009자)다. 즉 약 3분 전 AMULET 단계 doChores(13:56:58, 물약·스크롤 구매)에서 Lysander 대사가 끊겨 콜백이 남았고, 저널 텍스트가 끝날 때 실행됐다.
- 스크립트 쪽 발생 지점 후보: `Packet.openMenu`(`Misc.js:2617-2657`)는 NPC와 상호작용 중인데 메뉴(UI 0x08)가 500ms 넘게 안 뜨면 `me.cancel()`을 부른다. 퀘스트 대사 중이 이 상태다. `Unit.openMenu`(`Prototypes.js`)도 같은 구조다.
- 이전의 Malah 크래시(약 8건, identify/buyPotions 중)도 이 유형일 가능성이 높다(덤프 없음, 추정).
- 대사 텍스트가 스스로 끝나거나 클릭으로 끝나면 콜백이 실행된다(NPC 대사는 목록이 있어 안전, 오브젝트 대사는 목록이 없어 남은 콜백이 있으면 크래시). `me.cancel()`(대사 중 → `ClearScreen`)은 텍스트를 먼저 지워 콜백이 실행되지 않는다. 그래서 **오브젝트 대사는 끝나기 전에 끊는다**(blizzhackers kolbot도 같은 방식, D2BS 이력의 "summoner bug" 수정). NPC 대사 뒤 남은 콜백은 다음 NPC 상호작용 때 목록이 새로 만들어져 무해해진다. 콜백은 게임을 나가도 지워지지 않는다(0x4a0680).
- 대사 확인: `getIsTalkingNPC()`(대사 닫기 핸들러 등록 여부). UI 0x08은 D2BS에서 NPCMENU와 DIALOG가 같은 값이라 대사 확인용으로 못 쓴다. `sendClick`은 창 메시지(메인 스레드), `clickMap`/`Misc.click`은 월드 클릭 함수 직접 호출.
- 대사를 띄우는 오브젝트(objects.txt): 357 Horazon's Journal(OperateFn 42), 558 얼어붙은 Anya(67), 546 고대인 제단(65), 193 Lam Esen's Tome(28, `Misc.openChest`로 엶, 대사 여부 모름), 8 Tower Tome(6, 스크립트에서 안 씀).
- 이전 Malah 크래시(약 8건)와 고대인 크래시(몇 건)는 덤프가 없어 확정 못 함. 앤야 단계는 Malah·Anya 대사 끊기와 얼어붙은 Anya 오브젝트 대사(1초 넘게 방치)가 모여 있다. 크래시 위치는 콜백을 남긴 곳이 아니라 다음 대사가 끝나는 곳이라 제각각일 수 있다.
- 결정(260929 최종): **동작 수정 없이 로그만 둔다.** 크래시 사례가 더 모일 때까지 관찰한다. 한때 넣었던 수정(저널 리더만 읽기 0e18e15, 오브젝트 대사 즉시 끊기 `cancelObjectDialog` 0155897·2a11717)은 모두 되돌렸다. `AutoSmurf.js`는 main과 비교해 로그 함수, `delay` 8곳의 치환(고대인 처치 후 2곳 포함), `Misc.click(0, 0)` 3곳 삭제(저널 2곳, 고대인 끝)만 다르다. `Misc.click`은 `clickMap`(D2BS가 `D2CLIENT_ClickMap`을 스크립트 스레드에서 직접 호출)으로 내 위치를 월드 클릭한다. 대사 닫기 핸들러(창 메시지)를 타지 않고, ClickMap과 하위 15개 함수에 대사 관련 참조가 없어 대사를 끄지 못한다고 보고 지웠다(사용자 결정). 대사는 뒤따르는 `me.cancel()`이 닫는다.
- 관찰 로그(trace 파일): `[OD]` = `this.watchDialog(wait)`. 저널 2곳·얼어붙은 Anya 2곳·고대인 제단·Lam Esen의 원래 `delay(wait)` 자리에서 같은 시간을 기다리며, 대사가 떴는지·몇 ms에 떴고 몇 ms에 사라졌는지 기록한다(끊지 않음). `[TK]` = 대사 중(`getIsTalkingNPC()`)에 `me.cancel()`이 불리면 NPC 이름과 호출 위치를 기록한다(`Prototypes.js` 끝의 `me.cancel` 래퍼, 원래 함수를 그대로 호출). 다음 크래시가 나면 덤프(0x661406 여부, `[0x7c0c77]` NPC 메시지·`[0x7bf212]` 텍스트 번호 → string.tbl)와 그 프로필의 trace(`[TK]`·`[OD]`)를 대조한다. 후보 수정(보류): NPC 쪽은 대화 연쇄를 끊지 않고 끝난 뒤 닫기(`Packet.openMenu` 등), 오브젝트 쪽은 대사를 즉시 끊기(blizzhackers 방식).
- 모드의 역할(사용자 판단에 동의): 원인이 아니다. 원인은 스크립트가 NPC 대화 연쇄를 끊어 콜백을 남기는 것(모드 전부터 있던 조건). 모드는 오브젝트 대사를 즉시 스스로 끝나게 만들어 이 경로가 드러나게 했을 뿐이다. 모드 전에는 오브젝트 대사가 길게 흘러 스크립트가 도중에 닫았고(콜백 미실행), 대신 WP 상호작용이 막히는 오류가 있었다(고대인, `Misc.click`+`me.cancel` 260916의 배경). 모드 전 원인 불명 크래시는 덤프가 없어 유형 불명.
- 임바모드 재비교(260929, 기준: blizzhackers/d2data 커밋 116fcac = 2020년 D2R 이전 데이터, 음원 `.wav`): 바뀐 것은 시각·음향뿐이다. objects `Draw` 548행 비움, Missiles `CelFile` null 595행·클라이언트 보조 미사일·폭발·소리 제거(missiles.bin에도 null 684개), Overlay 파일 null, sounds 4542행이 `none.wav`(NPC 음성 포함), monstats `MonSound`·일부 몬스터 미사일 칸 비움, Levels 조명 최대·잡몹(cmon) 제거·LOSDraw 끔, LvlPrest Animate 끔, armor·weapons·misc의 인벤 그림·소리 칸 비움. skills·cubemain·TreasureClassEx·runes·ItemStatCost·charstats·experience 등은 같다. UniqueItems 몇 행(Azurewrath, Rainbow Facet)과 방패 mindam/maxdam 차이는 기준 데이터 판 차이일 수 있어 판단 보류. sounds.bin은 형식을 몰라 확인 못 함.
- 대사 종료 조건(0x4a0770): 대사 시작 때 음성 핸들을 `[0x7bf24b]`에 둔다(0x4a14b7). 핸들이 있으면 음성 쪽 상태를 보고, 0이면 바로 스크롤 판정(0x49d5a0)으로 간다. 퀘스트 대사 첫 줄 `-1`은 속도 0xFFFF라 스크롤 판정으로 가면 1~2프레임 만에 끝난다. a7 덤프는 음성 핸들 0, 대사 시작 후 약 79ms에 종료. 임바모드가 음성을 `none.wav`(MPQ에 없음)로 바꿔 핸들이 안 생긴 것으로 본다. 사용자 관찰: 모드 전에는 `-ns`(소리 끔)에서도 대사가 길게 흘렀다. 모드 후 대사가 스스로 빨리 끝나는지는 관찰한 적 없다(캔슬로 닫혔는지 구분 불가). 현재 근거는 a7 덤프 1건뿐(매 프레임 종료 경로, 캔슬 아님). `[OD]` 로그(`watchDialog`는 대기 중 캔슬하지 않음)의 `gone at`으로 확인한다. `[0x8817b0]`을 Master Volume으로 본 해석은 근거가 약해 철회한다. `-ns`에서 음성 핸들 동작은 미확인.
- 로그 첫 결과(260929 17시대): `[TK]` a3 17:37:28 `cancel during talk npc:Akara at misc.js:2644 < prototypes.js:91 < autosmurf.js:2288` → `Packet.openMenu`의 "상호작용 중인데 메뉴 없음 → me.cancel()"이 NPC 대사를 끊는 것을 실제로 확인. `[OD]` a8 17:44:47 저널 `dialog at 922ms gone at 1000ms` → 캔슬 없이 약 78ms 만에 스스로 종료(a7 덤프 계산 79ms와 일치). 저널 대사는 상호작용 후 약 0.9초에 떠서 원래 코드의 `me.cancel()`보다 먼저 스스로 끝난다.
**유형 C: 유닛 이동 경로의 대상 유닛 NULL (Game.exe 0x6494DC), 2건 (a7 PID 21512, 260930 05:00:32 / a2 PID 23052, 261001 14:03:18, 아래 6번)**
- ProcDump 로그: 같은 크래시에서 `-n 10`만큼 덤프 10개가 연달아 써졌다. 받은 덤프의 예외 주소 0x576F08은 D2BS `exit0` 버그(아래)로 생긴 두 번째 크래시다. 원래 예외는 스택의 EXCEPTION_POINTERS(0x19f214)에서 꺼냈다: 0xC0000005 at 0x6494DC, NULL 읽기, ESI=0.
- 경로: 게임 루프(0x44efa0) → 0x481600 → 0x4814a0 → 0x4812e0 → 0x480c10 → 유닛 동작 처리 0x461250(동작 24, 0x461704에 D2BS GameAttack 훅이 있는 함수) → 0x480780(대상 유닛을 ServerSideUnitHashTables에서 찾아 경로 `+0x58`에 넣음, 0x648b90) → 경로 갱신 0x649970 → 0x649400(대상 유닛). 0x649970 안에서 경로의 대상 `[path+0x58]`을 다시 읽을 때 NULL이 되어 있었고, 0x649400은 NULL을 받으면 검사 분기(0x6494dc)에서 그대로 역참조해 튕긴다.
- 대상 유닛은 스택 인자로 보아 type 1(NPC/몬스터), id 0x27efbd3e. 움직이던 유닛이 a7 자신인지, 대상이 어느 NPC인지는 덤프에 힙이 없어 모른다.
- trace: 앤야 단계(a7은 비리더, 해동 물약 없음 → delay 5000) 뒤 5:00:25 Harrogath로 와서 라주크 쪽으로 이동 중(5:00:31 `moveTo getPath -> 5144,5037`), 약 1초 뒤 크래시. `[TK]` 없음, 그날 trace 전체 `[TK]` 0건. 유형 B(대사 콜백)와 무관.
- 유형 A(그리기 중 경로 NULL)와 같이 "유닛 경로가 가리키는 대상이 비어 있음" 계열로 보인다(추정). 원인 미상.
- D2BS `exit0` 버그 확인(소스): `Patch.h:42`의 Fog 0x82E0 PatchJmp 대상 `D2GAME_exit0`는 `D2Ptrs.h:481` FUNCPTR라 변환 전 값 `DLLOFFSET(D2GAME, 0x576F)` = 6 | 0x576F<<8 = 0x576F06을 정적 초기화 때 잡는다. 크래시 보고 함수로 가면 0x576F06(명령 중간)으로 뛰어 0x576F08에서 다시 튕긴다. 그래서 d2bs 로그에 EXCEPTION 줄이 안 남고, ProcDump 덤프가 여러 개 생긴다. 필요한 덤프는 첫 번째(접미사 없는 파일) 하나다.
- 별건: 17:40 a3·a8 동시 멈춤("D2BS is not responding", 매니저 강제 재시작, 덤프 없음). 둘 다 Andariel 후 Warriv로 Lut Gholein 도착 직후, 용병 고용 NPC(5033,5053)로 걷기 시작한 17:40:12 이후 기록 없음. 원인 미상. ProcDump 루프를 `-e -h -n 10` + PID별 출력 로그(`C:\CrashDumps\procdump_<PID>.log`)로 바꿔 멈춤 덤프도 받기로 함.
  - 가설(미증명): `Merc.hire`(libs/Merc.js)는 `Town.move` 전에 `gamepacket` 리스너를 켜고 `initNPC` 뒤에 끈다. 리스너가 켜진 동안 D2BS는 게임이 받는 **모든 패킷**마다 게임 스레드가 스크립트 처리를 기다린다(Events.cpp `PacketEventCallback`, 패킷당 최대 500ms). 15~18초 이동 중 스크립트가 바쁘면 게임 스레드가 사실상 멈춰 매니저가 강제 종료할 수 있다. "Merc unmatched"마다 거치는 경로인데 멈춤은 드물어 이것만으로는 다 설명되지 않는다. 동시 멈춤이라 외부 요인도 배제 못 함. 확정은 `-h` 덤프에서 메인 스레드가 이 대기 안에 있는지로 본다.
  - 막는 방향(보류): 리스너를 0x4E/0x4F가 오는 구간에만 켠다. 그 시점 확인용 `[MP]` 로그를 넣음(260929, 동작 변경 없음): `[MP] 0x4f|0x4e|arrived|menu done at <리스너 켠 뒤 ms> npc:<고용 NPC> dist:<거리|none>`. 0x4E가 "arrived"(도착) 뒤, "menu done" 전에만 찍히면 리스너를 `initNPC` 직전에 켜도 된다.
  - 결과(260930): a1~a8 8건(모두 그레이즈, 빌드의 `MercSkill`이 전부 2막 용병) 모두 이동 중 수신 0건, 도착 뒤 `initNPC` 안에서만 0.25~0.33초 동안 수신(목록 2회씩). 도착→첫 0x4F 최소 47ms(a1). a2·a3·a8은 8:04에 15~21초 걸었는데 필요한 건 마지막 0.3초였다. → 리스너를 `Town.initNPC` 직전으로 옮김(260930, 사용자 승인). `[MP]` 시간 기준은 이동 시작으로 유지.
  - 새는 경로 점검: `addEventListener`~`removeEventListener` 사이에 `return`은 없다. 예외는 `Town.initNPC` 안(`Packet.openMenu` → `Pather.moveToUnit`, `Town.move` → `Pather.moveTo` "Failed to generate path")에서 날 수 있고, 그러면 제거가 건너뛰어진다. 호출부(`AutoSmurf.js:158`, `:7313`)에는 try가 없어 예외는 `Loader`의 catch까지 올라가 AutoSmurf가 끝나고 `default.dbj`가 게임을 나간다. 리스너는 그 스크립트가 끝날 때 같이 사라지므로 남는 시간은 게임 종료까지다. 옮기기 전에는 `Town.move` 예외도 이 경로였다.

**261001 크래시 6건 (260930 18:04 ~ 261001 12:04, 약 98게임·8프로필, 실행 코드는 PR #14 이전 / 6번은 261001 14:03, PR #18 이후 코드)**
첫 덤프·procdump 로그·trace·d2bs 로그와 Game.exe·D2BS.dll(1.6.4U)을 대조했다. 모두 메인 스레드(게임 루프 0x44efa0)의 접근 위반이다. 첫 덤프 시각이 다른 프로필의 종료보다 약 2초 빠르다(크래시가 먼저, 위 `PartyThread` 동반 종료).

| # | 프로필·시각 | 예외 주소 | 분류 |
|---|---|---|---|
| 1 | a1 9/30 22:10:20 (앤야 단계) | 0x661406 | **유형 B 확정** |
| 2 | a2 9/30 22:21:26 (Pit of Acheron 전투) | 0x5ff28e | SpriteCache 목록 손상 (그리기) |
| 3 | a6 10/1 03:05:57 (Abaddon → Harrogath 도착 3초 뒤) | 0x66f99f | **유형 D** |
| 4 | a7 10/1 04:34:23 (Moo Moo Farm) | 0x481617 | 2차 크래시 (해제된 유닛·Act) |
| 5 | a8 10/1 09:46:07 (Pandemonium → Harrogath 도착 7초 뒤) | 0x66f99f | **유형 D** |
| 6 | a2 10/1 14:03:18 (Burial Grounds, Blood Raven `Attack.clear` 중, PR #18 이후 코드) | 0x6494DC | **유형 C** |

- **1번 (유형 B 확정):** trace 22:09:09 `[TK] cancel during talk npc:Anya at misc.js:2680 < prototypes.js:91 < autosmurf.js:5263`(`Packet.openMenu`의 cancel). 71초 뒤 Arreat Summit 제단 앞(10047,12617)에서 크래시. 덤프: 콜백 `[0x7bf258]`=0x4b6a30, 목록 `[0x7bf250]`=NULL, `[0x7c0c69]`=0, 처리 중 오브젝트 `[0x7bf234]`=546(고대인 제단), 스택 0x4a080b(매 프레임 종료) → 0x4b6a45 → 0x4b1863 → 0x661406. 260929 가설이 `[TK]`+덤프 짝으로 처음 확인됐다. 이날 trace의 `[TK]`는 3건(Kashya `autosmurf.js:2021`, Malah `:5227`, Anya `:5263`), 모두 `Packet.openMenu` 안의 cancel.
- **2번 (SpriteCache):** EBP 체인 = 그리기 목록 루프(0x4df510) → 유닛 그리기(0x471620) → 0x4f6540 → 렌더러 `[0x7c8cc0]+0x90` → 0x6c87e0 → 0x6001f0 → 0x5ff5b0 → 0x5ff1b0(LRU 목록에서 빼기)에서 항목의 이전 링크 NULL에 쓰기(`[NULL+0x18]`). 캐시 0x89db60은 `SpriteCache.cpp`(Objects/Monsters/Chars/Overlays/Items/Missiles의 DCC·DC6). 캐시 잠금(+0x30)은 메인 스레드가 쥐고 있었다(다른 스레드 경합 아님). 처음에 "D2BS가 스택에 있다"고 한 것은 틀렸다: 0x6001f0의 지역 변수 영역(0x224바이트)에 남은 흔적이었다. 유형 A와 같은 그리기 루프. 임바모드와의 관련은 증거 없음.
- **3·5번 (유형 D, 두 건이 완전히 같음):** 게임 루프 → 패킷 루프(0x45f7b0, 0x45f8e9 `call eax`) → 서버 패킷 **0x07**(방 추가, 크기 6, 핸들러 0x45cab0, 패킷 표 0x7114d0의 7번) → `AddRoomData`(0x61a070) → 0x61b640 → 0x61b490 → 0x61b390 → 0x66c370 → 0x66c220 → 0x6424a0 → 0x675360 → 0x67e600 → 0x67e0e0 → 0x670750 → 0x66f990에서 `[ebx+0x50]`(0x10, 0x1)을 포인터로 읽음. 덤프에 힙이 없어 `ebx` 구조체는 모른다. 두 건 모두 다른 지역에서 Harrogath로 막 도착해 걷던 중으로, 유형 C(260930 a7, Harrogath 도착 7초 뒤)와 상황이 같다(같은 원인인지는 추정).
- **4번 (2차 크래시):** 게임 루프(0x44efb0 `GetPlayerUnit` = `[0x7a6a70]`) → 0x481600에 넘긴 내 유닛 0xb52e900과 Act `[0x7a0634]`=0x48e7000이 모두 MEM_FREE. 게임 구조가 해제된 뒤 루프가 옛 포인터를 썼다. procdump 로그에 처리되지 않은 예외 앞에 잡힌 예외 2개가 있고, 그쪽이 원래 원인으로 보인다(추정, 덤프 없음). a7 d2bs 로그에도 흔적 없음(마지막 줄 04:28:12 `=== [COWS] ===`). 유형 C와 같은 진입 함수(0x481600).
- **6번 (유형 C, 261002 분석):** procdump_23052 로그에 14:03:18~19 처리되지 않은 접근 위반 10회(덤프 10개, 첫 덤프 `Game.exe_261001_140318.dmp`). 14:03:20의 procdump_12448(예외 없음)은 재시작된 새 프로세스. 첫 덤프: 0xC0000005 at 0x6494DC, NULL 읽기, ESI=0, EAX=0, ECX=0x1522, EDX=0x15B4, 메인 스레드. EBP 체인: 0x649bdc(0x649970 안) → 0x4807b2(0x480780) → 0x4613ca(0x461250) → 0x481331 → 0x48156c → 0x4816ef → 0x44f12b(게임 루프). 260930 건과 주소·레지스터·경로가 같다. 그때 적은 0x480c10 단계는 이번 체인에 안 보인다(FPO로 건너뛴 것으로 추정, 미확인). 0x480780 프레임 인자 `0x15b41522` = (5410,5556)으로, a2 마지막 위치(5411,5562)에서 약 6칸이라 근처 유닛의 이동 목표 좌표로 보인다(추정). 어느 유닛인지(Blood Raven, 좀비, a2 자신)는 덤프에 힙이 없어 모른다.
  - trace: Pz-2 `=== [BLOOD] ===` → 14:02:32 Burial Grounds 진입 → 프리셋 805로 이동 → 14:02:58 도착(이후 `AutoSmurf.js` BLOOD의 `Attack.clear(10, Blood Raven)` 구간, 코드 순서로 판단) → 14:03:17 `[5411,5562] moveTo end`가 마지막 줄, 약 1초 뒤 크래시. d2bs 로그 마지막 줄은 14:00:57 `=== [BLOOD] ===`(EXCEPTION 줄 없음, exit0 버그 패턴). 콘솔 `Crash: no entry Burial Grounds - wait 5s (loc 9)`의 지역이 크래시 지역과 같다. 같은 시각 a1 `12m / 2r`는 `PartyThread` 동반 종료로 보인다(a1 trace 미확인).
  - 유형 C 두 건은 상황이 다르다(마을에서 NPC 쪽으로 이동 / 보스 전투). 특정 스크립트 동작과 이어지는 근거가 없어 게임 내부로 본다.
- **결론:** 우리 스크립트가 원인인 것은 1번(유형 B)뿐. 2·3·4·5·6번은 게임 내부라 스크립트로 고칠 수 없다.

**유형 B 수정 (261001, PR #18)**
- 대사 입력 처리 표(Game.exe 0x722600, 대사 중에 등록됨): 왼·오른 클릭 → 0x4a17d0, ESC(0x1B)·스페이스(0x20) → 0x4a1770. 0x4a1770은 텍스트 시작 100ms 안의 입력을 버리고, 그 뒤면 0x4a08c0으로 대사를 정상 종료한다(콜백 실행 → 다음 대사나 메뉴, 연쇄가 끝나면 콜백이 스스로 지워짐). `me.cancel()`은 이 표를 거치지 않고 화면을 지워 콜백이 남는다.
- 클릭(0x4a17d0)은 조건이 있다: 마우스 아래 유닛이 대화 중인 NPC면 무시, 아무것도 없고 `[0x7bf23a]`(기억된 유닛 표시)가 있으면 대사를 끝내지 않음. 마우스 아래 유닛은 게임의 매 프레임 상태라 `sendClick` 좌표가 아니라 실제 커서를 따를 수 있다(미확인). 그래서 클릭(나를 클릭 포함) 대신 키를 쓴다.
- ESC는 대사가 막 끝난 뒤 눌리면 게임 메뉴가 열려 위험하다. 스페이스는 기본 "화면 정리"라 해가 없다. 다만 허공에 눌리면 오토맵이 꺼진다(사용자 확인) → 대사가 끝난 뒤 꺼져 있으면 다시 켠다(오토맵은 항상 켜져 있어야 함).
- D2BS(1.6.4U): `sendClick`은 Sleep(100) 뒤 WM_LBUTTONDOWN/UP를 창에 보낸다. `sendKey`는 WM_KEYDOWN/UP. `getIsTalkingNPC`는 게임의 대사 입력 처리 표 등록 여부.
- 반영: `Packet.openMenu`(`Misc.js`)와 `Unit.openMenu`(`Prototypes.js`, `Config.PacketShopping`이 false일 때만 쓰는 자체 루프, 지금 설정은 true라 실행 안 됨, 설정이 바뀔 경우 대비)에서 대사 중이면 `Packet.skipTalk`(스페이스) → 메뉴가 뜨면 `Packet.endTalk`(trace `[TK] talk skipped <횟수> npc:<이름>`, 오토맵 다시 켜기). 20번 넘으면 예전 `me.cancel()`.
- 기각: 대사가 끝날 때까지 기다리기(`b2a396f`, NPC 대사가 수 분 걸릴 수 있음), 대사가 보이면 조기 종료(콜백 `[0x7bf258]`의 쓰기는 설정 함수 0x49e7e0뿐이고 호출부는 모두 대사·NPC 대화 코드, 게임 종료 경로에서 지우지 않음 → 같은 프로세스의 다음 게임에서 크래시).
- 유형 A·C·D·SpriteCache 주소로 분류: 0x6489C6(A), 0x661406(B), 0x6494DC(C), 0x66f99f(D), 0x5ff28e(SpriteCache), 0x481617(해제된 유닛), 0x2F11BC9(해제된 내 유닛, D2BS 상태 확인에서 발견, 아래 7번).

**261003 크래시 7번 (a7 PID 23184, 261003 00:48:15, Pz-57 `[BAAL]` 왕좌 웨이브 대기 중, 261003 분석)**
- trace 마지막 줄 00:47:53 `[Throne Of Destruction 15094,5039] moveTo end`, `[Quit]`·치킨 없음. 콘솔 `Crash: no entry Throne Of Destruction - wait 5s (loc 9)`.
- 첫 덤프 `Game.exe_261003_004815.dmp`: 0xC0000005 at **0x2F11BC9**(D2BS+0x1bc9), `0x878f070` 읽기, 스레드 0x226c(D2BS 스크립트 스레드). D2BS 게임 상태 확인 함수가 `GetPlayerUnit()`(0x463dd0) 결과의 `+0x70`을 읽는 줄이다. 게임 전역 `[0x7a6a70]`=0x878f000(내 유닛)은 그대로인데 그 메모리를 읽을 수 없었다. procdump 로그상 이 앞에 잡힌 예외는 없다(4번과 다름). 나머지 스크립트 스레드도 같은 줄에서 차례로 튕겼다.
- 메인 스레드: 게임 루프 → 패킷 루프 → 서버 패킷 0xA3(크기 0x18, 핸들러 0x45d5e0) → 0x4c6a11 → 0x4f1e94 → 0x4cd804 → 0x4667db → 0x466183 → 0x465f2c → 0x681e16 → 0x407f36 → 0x409d3e → 0x68402e → 힙 해제(`NtFreeVirtualMemory` MEM_DECOMMIT 0x9160000~0x9184000, 내 유닛 주소는 범위 밖). 게임 종료 경로 아님.
- WER 덤프 `Game.exe.23184.dmp`(머리 예외 0x576F0C, exit0 버그)에는 Game.exe 스레드 0x49f8(첫 덤프 때는 `select()` 대기)이 메모리 풀 잠금 0x74f244(0x200 블록 풀)에 들어가다 ntdll 0x77966627에서 `[0x14]` 쓰기로 튕긴 예외도 있다. 첫 덤프에서 이 잠금은 다른 풀 잠금과 같이 전부 0이었으므로 첫 크래시 뒤의 2차 크래시다.
- 내 유닛 메모리가 왜 사라졌는지, 패킷 0xA3과 관련이 있는지는 모른다(덤프에 힙 없음). 4번(메인 스레드가 해제된 내 유닛·Act 사용)과 같은 계열로 본다(추정). 게임 내부, 스크립트로 고칠 수 없음.

**261004 크래시 8·9번 (5사이클째 실행, 55런 × 8프로필 중 2건, 261004 분석)**
| # | 프로필·시각 | 첫 덤프 | 예외 주소 | 분류 |
|---|---|---|---|---|
| 8 | a1 (PID 24300) 10/4 01:10:06, Lut Gholein | `Game.exe_261004_011006.dmp` | 0x6489C6, NULL+8 읽기 | **유형 A** |
| 9 | a3 (PID 21236) 10/4 02:41:24, Harrogath | `Game.exe_261004_024124.dmp` | 0x6494DC, NULL 읽기 | **유형 C** |
- 두 건 모두 procdump 로그에 첫 `Unhandled` 앞의 잡힌 예외가 없다. 메인 스레드이고, 약 2초 동안 처리되지 않은 예외가 10번 났다(exit0 반복).
- **8번 (유형 A):**
  - EBP 체인: 게임 루프 0x44f291 → 0x44cafd → 0x476cf8 → 0x4df5f4(그리기 목록 루프 0x4df510) → 0x471667(0x471620) → 0x471537(0x471450) → 0x620693(0x620650) → 0x6489c0. 0x6489c0은 `[arg+8]`을 읽는 함수인데 arg가 NULL이었다.
  - 그리던 유닛 0x5ff5f00은 내 유닛(`[0x7a6a70]`=0x9d2eb00)이 아니다. 힙이 없어 종류는 모른다.
  - trace: Tal Rasha 무덤 #1에서 마을로 와 doChores 중이었다. 마지막 줄은 01:10:04 `[Lut Gholein 5124,5071] moveTo end`(stash 쪽 이동), 2초 뒤 크래시.
- **9번 (유형 C):**
  - ESI=0, EAX=0, ECX=0x13CA, EDX=0x13D9이고, EBP 체인이 6번과 같다.
  - 좌표 (5066,5081)이 trace 마지막 줄 02:41:24 `[Harrogath 5066,5081] moveTo end` → `getPath -> 5070,5085`의 a3 자기 위치와 정확히 같다. 6번은 a2 위치와 약 6칸 차이였다. 그래서 크래시 난 유닛이 그 프로필 자신일 가능성이 높아졌다(추정, 힙 없음).
  - 상황: doChores 뒤 48초 대기 → Qual-Kehk 쪽 이동 중. 유형 C·D의 기존 Harrogath 사례와 비슷하다.
- 함께 받은 `procdump_13272.log`는 10/3 22:11:46의 다른 크래시 로그다. 덤프는 받지 않아 미분류.
- 결론: 두 건 모두 게임 내부 원인이라 스크립트로 고칠 수 없다. 이후 방침은 0절.
