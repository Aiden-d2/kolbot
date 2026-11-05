import sys;sys.path.insert(0,sys.argv[1])
from exe import *
src=open(sys.argv[2],encoding='utf-8',errors='replace').read()
for m in re.finditer(r'static const D2MazeLevelIdStrc (\w+)\[\]\s*=\s*\{(.*?)\};',src,re.S):
    rows=re.findall(r'\{\s*([^}]*)\}',m.group(2))
    vals=[[E[p.strip()] if p.strip() in E else int(p) for p in r.split(',')] for r in rows]
    b=b''.join(pk(*v) for v in vals); h=find(b)
    print(m.group(1),'full match' if h else 'MISMATCH',[hex(x) for x in h])
