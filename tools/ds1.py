import struct,os,glob,sys,json
W=sys.argv[1]
def parse(p):
    b=open(p,'rb').read(); o=0
    def i():
        nonlocal o; v=struct.unpack_from('<i',b,o)[0]; o+=4; return v
    ver=i(); w=i()+1; h=i()+1
    act=i() if ver>=8 else 0
    tag=i() if ver>=10 else 0
    if ver>=3:
        n=i()
        for _ in range(n):
            e=b.index(b'\0',o); o=e+1
    if 9<=ver<=13: o+=8
    if ver>=4:
        walls=i(); floors=i() if ver>=16 else 1
    else: walls=1; floors=1
    layers=walls*2+floors+1+(1 if tag in(1,2) else 0)
    o+=layers*w*h*4
    objs=[]
    if ver>=2:
        n=i()
        for _ in range(n):
            t=i();idd=i();x=i();y=i()
            if ver>5: i()
            objs.append((t,idd,x,y))
    return act,objs
mp={}
cur={}
for l in open(W+'/monpreset.txt',encoding='latin-1').read().splitlines()[1:]:
    f=l.split('\t')
    if len(f)<2 or not f[0].isdigit(): continue
    a=int(f[0]); cur[a]=cur.get(a,-1)+1; mp[(a,cur[a])]=f[1]
SU=set()
for l in open(W+'/su.txt',encoding='latin-1').read().splitlines()[1:]:
    f=l.split('\t'); SU.add(f[0]) 
res={}
for p in glob.glob(W+'/ds1/mpqdata/tiles/**/*',recursive=True):
    if not p.lower().endswith('.ds1'): continue
    try: act,objs=parse(p)
    except Exception as e: continue
    names=sorted({mp.get((act+1,idd),'?') for t,idd,x,y in objs if t==1} & SU)
    if names: res[os.path.relpath(p,W+'/ds1/mpqdata/tiles').lower()]=names
json.dump(res,open(W+'/su_ds1.json','w'),indent=0)
print(len(res))
