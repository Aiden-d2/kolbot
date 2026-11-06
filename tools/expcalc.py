# Baal/Diablo run experience from mpqdata + 1.14d rules (gamedata/experience.md 1절).
# usage: expcalc.py <workdir> [P from] [P to]
# Integer math follows 1.14d: CalculatePercentage 0x483360, party split 0x57E6C0 (32-bit imul, float32 ratio),
# ComputeExperienceGain 0x57E480.
import sys, struct
W = sys.argv[1]
PF = int(sys.argv[2]) if len(sys.argv) > 2 else 90
PT = int(sys.argv[3]) if len(sys.argv) > 3 else 98
def rows(p):
    L = [l.split('\t') for l in open(p, encoding='latin-1').read().split('\n') if l]
    return [dict(zip(L[0], r)) for r in L[1:]]
MS = {r['Id']: r for r in rows(W + '/monstats.txt') if r.get('Id')}
LV = {int(r['Id']): r for r in rows(W + '/lv.txt') if r.get('Id', '').isdigit()}
SU = {int(r['hcIdx']): r for r in rows(W + '/su2.txt') if r.get('hcIdx', '').isdigit()}
ML = {int(r['Level']): r for r in rows(W + '/monlvl.txt') if r.get('Level', '').isdigit()}
EX = {}
for r in rows(W + '/experience.txt'):
    if r.get('Level', '').isdigit(): EX[int(r['Level'])] = (int(r['Amazon']), int(r['ExpRatio']))
    elif r.get('Level') == 'MaxLvl': MAXLVL = int(r['Amazon']); RATIO0 = int(r['ExpRatio'])
def i32(x): return struct.unpack('<i', struct.pack('<I', x & 0xffffffff))[0]
def tdiv(a, b): q = abs(a) // abs(b); return q if (a >= 0) == (b > 0) else -q
def pct(v, m, d):  # 0x483360
    if not d: return 0
    if v <= 0x100000:
        if m <= 0x10000: return tdiv(i32(m * v), d)
        if d <= (m >> 4): return i32(v * tdiv(m, d))
    elif d <= (v >> 4): return i32(m * tdiv(v, d))
    return tdiv(m * v, d)
F1 = [256, 256, 256, 256, 256, 256, 207, 159, 110, 61, 13]
F2 = [256, 256, 256, 256, 256, 256, 225, 174, 92, 38, 5]
BONUS = [0, 0, 50, 100, 150, 200, 250, 300, 350]
def mon_exp(cls, mlvl, players, x5):  # 0x6539CD, 0x573FE3, 0x5A0E70 (hell)
    m = MS[cls]
    e = int(m['Exp(H)']) if m.get('noRatio') == '1' else pct(int(ML[mlvl]['XP(H)']), int(m['Exp(H)']), 100)
    e = e + pct(e, BONUS[players], 100)
    return e * 5 if x5 else e
def gain(e, P, M):  # 0x57E480
    if e <= 0: return 1
    e = min(e, 0x7fffff)
    if P >= MAXLVL: return 0
    if M <= P:
        f = F1[min(P - M, 10)]; r = e if f == 256 else pct(e, f, 256)
    elif P < 25 or M <= 0:
        f = F2[min(M - P, 10)]; r = e if f == 256 else pct(e, f, 256)
    else:
        r = pct(e, P, M)
    if r > 0:
        R1 = EX[P][1]; R2 = RATIO0  # MaxLvl row ExpRatio (0x613E7A)
        if r <= (0x7fffffff >> (R2 + (R1 >> R2))): r = (r * R1) >> R2
        else: r = R1 * (r >> R2)
    return r
def f32(x): return struct.unpack('<f', struct.pack('<f', x))[0]
def share(e, n, levels, P):  # 0x57E6C0 -> my share before gain
    if n <= 1: return e
    s = i32(e + tdiv(i32(i32((n - 1) * e) * 89), 256))
    mult = f32(s / levels)
    return int(P * mult)
# run composition (hell): (label, class, level, x5, count)
A = 85
def su(h): return SU[h]
def run_parts():
    baal, dia = [], []
    for w, h in enumerate(range(61, 66), 1):
        s = su(h); boss = s['Class']; mn = MS[boss].get('minion1') or boss
        cnt = int(s['MinGrp']) + 2 if s['MinGrp'] != '0' and s['MaxGrp'] != '0' else 0
        parts = [(boss, A + 3, True, 1), (mn, A + 3, True, cnt)]  # minions get umod 1-4 too (0x5A2155 -> 0x58F380)
        if h == 62: parts.append(('skmage_cold3', A, False, 10))  # spawned after umods (0x5A4E2D): no x5, area level
        baal.append(('웨이브 %d' % w, parts))
    baal.append(('바알', [('baalcrab', int(MS['baalcrab']['Level(H)']), False, 1)]))
    for h in (38, 37, 36):
        s = su(h); boss = s['Class']; mn = MS[boss].get('minion1') or boss
        dia.append((s['Superunique'], [(boss, A + 3, True, 1), (mn, A + 3, True, int(s['MinGrp']) + 2)]))
    dia.append(('디아블로', [('diablo', int(MS['diablo']['Level(H)']), False, 1)]))
    return baal, dia
COND = {
    'A 1명 게임 솔로': (1, 1, None),
    'B 8명 게임 솔로': (8, 1, None),
    'C 8명 파티 전원 같은 레벨': (8, 8, 'same'),
}
def part_exp(parts, P, cond):
    pl, n, lv = cond; tot = 0
    for cls, M, x5, cnt in parts:
        # umod 4 (0x5A0E40) multiplies the exp already set at spawn (base level) by 5 and then raises level by 3
        e = mon_exp(cls, M - 3 if x5 else M, pl, x5)
        levels = n * P if lv == 'same' else (lv or P)
        tot += gain(share(e, n, levels, P), P, M) * cnt
    return tot
if __name__ == '__main__':
    baal, dia = run_parts()
    print('구성:', [(l, p) for l, p in baal + dia])
    for name, cond in COND.items():
        for runname, parts in (('바알런', baal), ('디아런', dia)):
            print('\n##', runname, name)
            print('| 레벨 | ' + ' | '.join(l for l, _ in parts) + ' | 합계 | 필요 경험치 | 필요 런 수 |')
            for P in range(PF, PT + 1):
                v = [part_exp(p, P, cond) for _, p in parts]; t = sum(v)
                need = EX[P][0] - EX[P - 1][0]
                runs = -(-need // t) if t else 0
                print('| %d | ' % P + ' | '.join('{:,}'.format(x) for x in v) + ' | {:,} | {:,} | {:,} |'.format(t, need, runs))
