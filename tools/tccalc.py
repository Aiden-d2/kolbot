# Independent recomputation of tc.md tables from mpqdata + rules; prints diffs.
import sys, re
W = sys.argv[1]
TCMD = sys.argv[2]
def rows(p):
    L = [l.split('\t') for l in open(p, encoding='latin-1').read().split('\n') if l]
    h = L[0]; return h, [dict(zip(h, r)) for r in L[1:]]
_, TCR = rows(W + '/tcx.txt')
TCR = [r for r in TCR if r.get('Treasure Class')]
TCI = {r['Treasure Class']: i for i, r in enumerate(TCR)}
_, MS = rows(W + '/monstats.txt')
MSI = {r['Id']: r for r in MS if r.get('Id')}
_, LV = rows(W + '/lv.txt')
LVI = {}
for r in LV:
    if r.get('Id', '').isdigit(): LVI[int(r['Id'])] = r
_, SU = rows(W + '/su2.txt')
SU = [r for r in SU if r.get('Superunique') and r.get('Class')]
RUNES = ['El','Eld','Tir','Nef','Eth','Ith','Tal','Ral','Ort','Thul','Amn','Sol','Shael','Dol','Hel','Io','Lum','Ko','Fal','Lem','Pul','Um','Mal','Ist','Gul','Vex','Ohm','Lo','Sur','Ber','Jah','Cham','Zod']
memo = {}
def reach(name):
    if name in memo: return memo[name]
    memo[name] = (0, 0)
    r = TCR[TCI[name]]; e = 0; ru = 0
    for k in range(1, 11):
        it = r.get('Item%d' % k, ''); pr = r.get('Prob%d' % k, '')
        if not it or not pr or int(pr) <= 0: continue
        m = re.fullmatch(r'(weap|armo|bow|mele)(\d+)', it)
        if m: e = max(e, int(m.group(2))); continue
        m = re.fullmatch(r'r(\d\d)', it)
        if m: ru = max(ru, int(m.group(1))); continue
        if it in TCI:
            a, b = reach(it); e = max(e, a); ru = max(ru, b)
    memo[name] = (e, ru); return memo[name]
def fmt(name):
    if not name: return '- / -'
    e, ru = (name[1], name[2]) if isinstance(name, tuple) else reach(name)
    return '%s / %s' % (e or '-', RUNES[ru-1] if ru else '-')
def flag(m, k):
    return m.get(k, '') == '1'
def upgrade(name, lvl):
    i = TCI[name]
    while i + 1 < len(TCR):
        n = TCR[i+1]
        if n['group'] and n['group'] == TCR[i]['group'] and n['level'] and int(n['level']) <= lvl: i += 1
        else: break
    return TCR[i]['Treasure Class']
SUF = {0: '', 1: '(N)', 2: '(H)'}
def mtc(m, kind, d):
    return m.get('TreasureClass%d%s' % (kind, SUF[d]), '')
def mlvl_area(aid, d):
    return int(LVI[aid]['MonLvl%dEx' % (d+1)] or 0)
def best(names):
    ns=[n for n in names if n]
    if not ns: return None
    return ('SEP', max(reach(n)[0] for n in ns), max(reach(n)[1] for n in ns))
def mon_tc(mid, aid, d, kind, add):
    m = MSI.get(mid)
    if not m: return None
    tc = mtc(m, kind, d)
    if not tc: return None
    if d == 0: return tc
    if flag(m, 'boss') or flag(m, 'noRatio'):
        return tc
    return upgrade(tc, mlvl_area(aid, d) + add)
ACTS = [(2,37),(41,73),(76,102),(104,108),(109,136)]
def chest(aid, d):
    lvl = mlvl_area(aid, d)
    if not lvl: return None
    a = int(LVI[aid]['Act']); lo, hi = ACTS[a]
    f = mlvl_area(lo, d); l = mlvl_area(hi, d)
    t = (abs(l - f) + 1) // 3
    k = 'A' if lvl < f + t else ('C' if lvl >= f + 2*t else 'B')
    nm = 'Act %d%s Chest %s' % (a+1, (' ' + SUF[d]) if d else '', k)
    return (k, nm)
def minion_of(c):
    m = MSI.get(c); return (m.get('minion1') or c) if m else None
def area_minion(aid, d):
    r = LVI[aid]
    src = [r.get(('umon%d' if d == 0 else 'nmon%d') % k, '') for k in range(1, 11)]
    return fmt(best([mon_tc(minion_of(x), aid, d, 1, 3 if d else 0) for x in src if x and minion_of(x)]))
def su_minion(s, d, area):
    if s['MinGrp'] in ('', '0') or s['MaxGrp'] in ('', '0'): return '-'
    mn = minion_of(s['Class'])
    if not mn: return '-'
    if d == 0: return fmt(mtc(MSI[mn], 1, 0)) if mtc(MSI[mn], 1, 0) else '-'
    return fmt(mon_tc(mn, int(area.split()[0]), d, 1, 3)) if area else '-'
# parse tc.md tables
md = open(TCMD, encoding='utf-8').read().split('\n')
sec = None; diffs = 0; checked = 0
for line in md:
    if line.startswith('## 2. 지역 (노말)'): sec = ('area', 0)
    elif line.startswith('## 2. 지역 (나이트메어)'): sec = ('area', 1)
    elif line.startswith('## 2. 지역 (헬)'): sec = ('area', 2)
    elif line.startswith('### 노말'): sec = ('su', 0)
    elif line.startswith('### 나이트메어'): sec = ('su', 1)
    elif line.startswith('### 헬'): sec = ('su', 2)
    elif line.startswith('## 4.'): sec = ('boss', None)
    elif line.startswith('## 5.'): sec = None
    if not sec or not line.startswith('| ') or line.startswith('| ID') or line.startswith('| hcIdx') or line.startswith('| 몬스터') or line.startswith('| 슈퍼'): continue
    c = [x.strip() for x in line.strip('|').split('|')]
    if sec[0] == 'area':
        if not c[0].isdigit(): continue
        aid = int(c[0]); d = sec[1]; r = LVI[aid]
        if d == 0:
            nl = [r.get('mon%d' % k, '') for k in range(1, 11)]; ul = [r.get('umon%d' % k, '') for k in range(1, 11)]
        else:
            nl = [r.get('nmon%d' % k, '') for k in range(1, 11)]; ul = nl
        nl = [x for x in nl if x]; ul = [x for x in ul if x]
        got = [str(mlvl_area(aid, d))]
        got.append(fmt(best([mon_tc(x, aid, d, 1, 0) for x in nl])))
        got.append(fmt(best([mon_tc(x, aid, d, 2, 2 if d else 0) for x in ul])))
        got.append(fmt(best([mon_tc(x, aid, d, 3, 3 if d else 0) for x in ul])))
        got.append(area_minion(aid, d))
        ch = chest(aid, d)
        got.append('%s: %s' % (ch[0], fmt(ch[1])) if ch and ch[1] in TCI else '-')
        exp = c[2:8]
        checked += 1
        for name, a, b in zip(['레벨','일반','챔피언','유니크','유니크 부하','상자'], exp, got):
            if a != b:
                diffs += 1; print('AREA d%d %d %s: md=%r calc=%r' % (d, aid, name, a, b))
    elif sec[0] == 'su':
        if not c[0].isdigit(): continue
        h = int(c[0]); d = sec[1]
        s = [x for x in SU if x.get('hcIdx') == str(h)][0]
        m = MSI.get(s['Class'])
        base = s['TC' + ((' ' if False else '') + ('' if d == 0 else SUF[d]))] if d else s['TC']
        checked += 1
        if d == 0:
            got = fmt(base) if base else '- / -'
            if c[4] != got: diffs += 1; print('SU d0 %d %s: md=%r calc=%r' % (h, s['Superunique'], c[4], got))
            mg = su_minion(s, 0, None)
            if c[5] != mg: diffs += 1; print('SU d0 %d %s 부하: md=%r calc=%r' % (h, s['Superunique'], c[5], mg))
            continue
        area = c[3]
        if not area:
            if c[8] != '-': diffs += 1; print('SU d%d %d 부하: md=%r calc=-' % (d, h, c[8]))
            continue
        aid = int(area.split()[0])
        bossy = flag(m, 'boss') or flag(m, 'noRatio')
        lvl = int(m['Level' + SUF[d]]) if bossy else mlvl_area(aid, d)
        lvl += 3
        if s['Class']=='summoner': lvl -= 3
        up = base if (bossy or not base) else upgrade(base, lvl)
        got = [str(lvl), base or '-', (up if up != base else ''), fmt(up) if up else '- / -', su_minion(s, d, area)]
        exp = [c[4], c[5], c[6], c[7], c[8]]
        for name, a, b in zip(['레벨','기본','올린','값','부하'], exp, got):
            if a != b: diffs += 1; print('SU d%d %d %s %s: md=%r calc=%r' % (d, h, s['Superunique'], name, a, b))
    elif sec[0] == 'boss':
        if len(c) < 7 or c[1] not in ('노말','나이트메어','헬'): continue
        d = ['노말','나이트메어','헬'].index(c[1]); m = MSI[c[0]]
        got = [m['Level' + SUF[d]], mtc(m, 1, d) or '-', fmt(mtc(m, 1, d)), mtc(m, 4, d) or '-', fmt(mtc(m, 4, d)) if mtc(m, 4, d) else '-']
        exp = c[2:7]; checked += 1
        for name, a, b in zip(['레벨','TC','값','퀘TC','퀘값'], exp, got):
            if a != b: diffs += 1; print('BOSS %s d%d %s: md=%r calc=%r' % (c[0], d, name, a, b))
print('rows checked', checked, 'diffs', diffs)
