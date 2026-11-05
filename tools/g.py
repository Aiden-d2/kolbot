# usage: g.py lo hi regex [context]
import sys,re
W=sys.argv[0].rsplit('/tools/',1)[0]
lo=int(sys.argv[1],16);hi=int(sys.argv[2],16);rx=re.compile(sys.argv[3]);c=int(sys.argv[4]) if len(sys.argv)>4 else 0
L=[l.rstrip('\n') for l in open(W+'/text.asm')]
for n,l in enumerate(L):
    a=int(l.split('\t')[0],16)
    if lo<=a<hi and rx.search(l):
        for k in range(max(0,n-c),min(len(L),n+c+1)): print(L[k])
        if c: print('--')
