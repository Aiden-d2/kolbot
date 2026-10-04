# 크래시 분석 절차 (261004)

크래시 분석을 다시 할 때 이 순서대로 한다. 유형별 분석 결과와 근거는 `handoff.md` 7절에 있다.

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

## 4. 분류 (예외 주소 → 유형, 세부는 handoff.md 7절)
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
- `handoff.md` 7절 크래시 목록에 번호, 프로필·시각·지역, 첫 덤프 이름, 예외 주소, 유형, trace 마지막 동작을 한 줄씩 더한다.
- 노트는 대화 중에 쓰지 않고 커밋 요청 때 쓴다(CLAUDE.md).
