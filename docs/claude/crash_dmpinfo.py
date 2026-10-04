# 사용: python3 docs/claude/crash_dmpinfo.py <첫 덤프.dmp> [주소:앞:뒤 ...] [@주소:바이트 ...]   (모두 16진)
#   주소:앞:뒤  = 그 주소 앞뒤 코드 역어셈블
#   @주소:바이트 = 그 주소의 메모리를 dword로 출력 (전역 변수 확인용)
import sys, struct
from minidump.minidumpfile import MinidumpFile
from capstone import Cs, CS_ARCH_X86, CS_MODE_32

path = sys.argv[1]
md = MinidumpFile.parse(path)
r = md.get_reader()
cs = Cs(CS_ARCH_X86, CS_MODE_32)

def rd(a, n):
    try:
        return r.read(a, n)
    except Exception:
        return None

ex = md.exception.exception_records[0]
er = ex.ExceptionRecord
info = [hex(x) for x in er.ExceptionInformation[:er.NumberParameters]]
print("예외:", er.ExceptionCode, "주소", hex(er.ExceptionAddress), "정보", info, "(0=읽기 1=쓰기, 대상 주소)")
for m in md.modules.modules:
    if m.baseaddress <= er.ExceptionAddress < m.baseaddress + m.size:
        print("모듈:", m.name.split("\\")[-1], "+" + hex(er.ExceptionAddress - m.baseaddress))
for m in md.modules.modules:
    n = m.name.split("\\")[-1]
    if n.lower() in ("game.exe", "d2bs.dll"):
        print("기준 주소:", n, hex(m.baseaddress))

th = [t for t in md.threads.threads if t.ThreadId == ex.ThreadId][0]
stack_lo = th.Stack.StartOfMemoryRange
print("스레드:", hex(ex.ThreadId), "스택", hex(stack_lo), "(0x19f000대 = 메인 스레드)")

with open(path, "rb") as f:
    f.seek(ex.ThreadContext.Rva)
    c = f.read(ex.ThreadContext.DataSize)
edi, esi, ebx, edx, ecx, eax, ebp, eip, _cs, _efl, esp = struct.unpack_from("<11I", c, 4 * 7 + 112 + 16)
print("레지스터: EAX %x EBX %x ECX %x EDX %x ESI %x EDI %x EBP %x ESP %x EIP %x" % (eax, ebx, ecx, edx, esi, edi, ebp, esp, eip))

code = rd(eip - 0x10, 0x30)
if code:
    print("예외 지점 코드:")
    for i in cs.disasm(code, eip - 0x10):
        print(("=> " if i.address == eip else "   ") + hex(i.address), i.mnemonic, i.op_str)

print("EBP 체인 (프레임, 돌아갈 주소, 인자 4개):")
b = ebp
for _ in range(25):
    d = rd(b, 24)
    if not d:
        print("  끝", hex(b))
        break
    nb, ra, a1, a2, a3, a4 = struct.unpack("<6I", d)
    print("  %x ret %x args %x %x %x %x" % (b, ra, a1, a2, a3, a4))
    if nb <= b:
        break
    b = nb

for spec in sys.argv[2:]:
    if spec.startswith("@"):
        a, n = [int(x, 16) for x in spec[1:].split(":")]
        d = rd(a, n)
        print("==", hex(a), " ".join("%08x" % v for v in struct.unpack("<%dI" % (n // 4), d)) if d else "덤프에 없음 (힙은 덤프에 없다)")
        continue
    a, before, after = [int(x, 16) for x in spec.split(":")]
    code = rd(a - before, before + after)
    print("==", hex(a), "" if code else "덤프에 없음 (코드는 예외 지점 근처만 들어 있다)")
    if code:
        for i in cs.disasm(code, a - before):
            print(("=> " if i.address == a else "   ") + hex(i.address), i.mnemonic, i.op_str)
