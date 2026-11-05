import json,sys
W=sys.argv[1]
d=json.load(open(W+'/su_ds1.json'))
by={}
for k,v in d.items():
    rel=k.split('/',1)[1]  # strip tiles_xxx
    by.setdefault(rel,{})[k.split('/')[0]]=v
out={}
for l in open(W+'/lvlprest.txt',encoding='latin-1').read().splitlines()[1:]:
    f=l.split('\t')
    if len(f)<22 or not f[1].isdigit(): continue
    files=[x for x in f[16:22] if x and x!='0']
    sus=set();src=[]
    for x in files:
        rel=x.replace('\\','/').lower()
        if rel in by:
            e=by[rel]; pick=e.get('tiles_d2patch') or e.get('tiles_d2exp') or e.get('tiles_d2data')
            sus|=set(pick)
    if sus: out[int(f[1])]=(f[0],f[2],sorted(sus))
for k in sorted(out): print(k,*out[k],sep=' | ')
