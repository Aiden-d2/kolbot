import sys;sys.path.insert(0,sys.argv[1])
from exe import *
lo,hi=SEC['.text']
out=open(sys.argv[1]+'/../text.asm','w')
a=lo
while a<hi:
    got=False
    for i in md.disasm(rd(a,hi-a),a):
        out.write(f"{i.address:x}\t{i.mnemonic}\t{i.op_str}\n"); a=i.address+i.size; got=True
    if a<hi: a+=1
out.close()
