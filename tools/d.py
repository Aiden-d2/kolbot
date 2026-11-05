import sys;sys.path.insert(0,sys.argv[1])
from exe import *
a=int(sys.argv[2],16);b=int(sys.argv[3],16)
for i in md.disasm(rd(a,b-a),a):
    s=f"{i.address:x} {i.mnemonic} {i.op_str}"
    m=re.search(r'0x([0-9a-f]+)$',i.op_str)
    if i.mnemonic in('cmp','sub','add') and m:
        v=int(m.group(1),16); s+=f"   ; {lvl(v) if v<200 else ''}"
    print(s)
