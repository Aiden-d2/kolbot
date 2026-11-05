# usage: ds1find.py <workdir> <act 0-4> <kind 1=monster 2=object> <preset id>...
# Lists DS1 files (all three mpq sets) holding the given preset units.
import sys,glob
W=sys.argv[1];A=int(sys.argv[2]);K=int(sys.argv[3]);I=set(map(int,sys.argv[4:]))
exec(open(W+'/tools/ds1.py').read().split('mp={}')[0])
for f in sorted(glob.glob(W+'/ds1/mpqdata/tiles/**/*',recursive=True)):
    if not f.lower().endswith('.ds1'): continue
    try: act,objs=parse(f)
    except Exception: continue
    if act==A and any(t==K and i in I for t,i,x,y in objs): print(f.split('tiles/')[1])
