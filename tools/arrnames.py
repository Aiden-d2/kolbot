import sys;sys.path.insert(0,sys.argv[1])
from exe import *
names={}
for l in open(sys.argv[1]+'/../lvlprest.txt',encoding='latin-1').read().splitlines()[1:]:
    f=l.split('\t')
    if len(f)>2 and f[1].isdigit(): names[int(f[1])]=(f[0],f[2])
for a,n in [(int(x.split(':')[0],16),int(x.split(':')[1])) for x in sys.argv[2:]]:
    print(hex(a))
    for k in range(n):
        v=[d32(a+16*k+4*j) for j in range(4)]
        print('  ',v, names.get(v[1]))
