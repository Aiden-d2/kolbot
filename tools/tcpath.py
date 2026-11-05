import sys,re
sys.argv=[sys.argv[0],sys.argv[1],'/dev/null']+sys.argv[2:]
exec(open(sys.argv[1]+'/tools/tccalc.py').read().split('# parse tc.md tables')[0])
def walk(n,d=0,seen=set()):
    r=TCR[TCI[n]]
    print('  '*d+n, reach(n))
    if d>6: return
    for k in range(1,11):
        it=r.get('Item%d'%k,''); pr=r.get('Prob%d'%k,'')
        if it in TCI and pr and int(pr)>0 and it not in seen:
            seen.add(it); walk(it,d+1,seen)
walk(sys.argv[3])
