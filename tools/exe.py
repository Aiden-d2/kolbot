import pefile,struct,json,os,re
from capstone import *
D=os.path.dirname(os.path.abspath(__file__))
E=json.load(open(D+'/enums.json'))
pe=pefile.PE(D+'/../exe/Game.exe',fast_load=True)
IB=pe.OPTIONAL_HEADER.ImageBase
img=pe.get_memory_mapped_image()
SEC={s.Name.rstrip(b'\0').decode():(IB+s.VirtualAddress,IB+s.VirtualAddress+s.Misc_VirtualSize) for s in pe.sections}
def rd(va,n): return img[va-IB:va-IB+n]
def d32(va): return struct.unpack('<i',rd(va,4))[0]
def find(b,sec=None):
    res=[];lo,hi=(SEC[sec] if sec else (IB,IB+len(img)))
    s=img; i=s.find(b,lo-IB)
    while i!=-1 and i+IB<hi: res.append(i+IB); i=s.find(b,i+1)
    return res
def pk(*v): return b''.join(struct.pack('<i',x) for x in v)
md=Cs(CS_ARCH_X86,CS_MODE_32); md.detail=False
def dis(va,n=200):
    return list(md.disasm(rd(va,n*8),va,n))
def xref(addr):
    "code places containing imm32 addr"
    return find(struct.pack('<I',addr),'.text')
INV={}
for k,v in E.items():
    INV.setdefault(k.split('_')[0],{})[v]=k
def lvl(v): return INV['LEVEL'].get(v,'?')
def pr(v): return INV['LVLPREST'].get(v,'?')
def funcstart(va):
    "scan back for typical prologue / int3 padding"
    p=va
    while p>va-0x4000:
        if rd(p-1,1) in (b'\xcc',b'\x90',b'\xc3') and rd(p,1) in (b'\x55',b'\x83',b'\x81',b'\x53',b'\x56',b'\x57',b'\x8b',b'\x6a',b'\x51'):
            if rd(p-1,1)==b'\xcc' or rd(p-2,2)==b'\xcc\xcc': return p
        p-=1
    return None
