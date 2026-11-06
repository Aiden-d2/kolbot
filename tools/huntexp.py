# kolbot hunting route experience, hell (gamedata/experience.md 3절).
# usage: huntexp.py <workdir> [P from] [P to] [players] [receivers]
# Parts: Chaos Sanctum random monsters in the three seal arms (N/W/E cells), seal bosses, Diablo,
#        Baal waves 1-5, Baal, Nihlathak (+20 summoned minions) and Halls of Vaught random monsters.
import sys
W = sys.argv[1]
PF = int(sys.argv[2]) if len(sys.argv) > 2 else 90
PT = int(sys.argv[3]) if len(sys.argv) > 3 else 98
G = int(sys.argv[4]) if len(sys.argv) > 4 else 8
N = int(sys.argv[5]) if len(sys.argv) > 5 else 8
sys.argv = ['x', W]
exec(open(W + '/tools/expcalc.py').read().split("if __name__")[0])
def num(x):
    try: return int(x)
    except Exception: return 0
def mexp(cls, base_lvl, x):  # x: 1 normal, 5 unique/superunique/minion of unique, 3 champion (hell)
    m = MS[cls]
    e = num(m['Exp(H)']) if m.get('noRatio') == '1' else pct(num(ML[base_lvl]['XP(H)']), num(m['Exp(H)']), 100)
    e = e + pct(e, BONUS[G], 100)
    if x >= 3: e *= 5
    if x == 3: e = e - 2 * (e // 5)
    return e
def kill(cls, base_lvl, add, x, P):
    return gain(share(mexp(cls, base_lvl, x), N, N * P, P), P, base_lvl + add)
def region(aid, tiles, boss_share, P):
    """random monsters of area aid in `tiles` tiles; boss_share = this part's share of the level's boss events"""
    r = LV[aid]; lvl = num(r['MonLvl3Ex']); den = min(num(r['MonDen(H)']), 10000)
    lst = [r['nmon%d' % k] for k in range(1, 11) if r.get('nmon%d' % k)]
    nm = max(1, min(13, num(r['NumMon'])))
    groups = tiles * 25 / 9 * den / 100000
    umin, umax = num(r['MonUMin(H)']), num(r['MonUMax(H)'])
    w = [max(num(MS[x]['Rarity']), 0) or 1 for x in lst]; tw = sum(w)
    cnt = 0; ex = 0.0
    bosses = boss_share
    normal = max(groups - bosses, 0)
    for x, wt in zip(lst, w):  # expected over which NumMon types are picked: rarity share of the whole list
        m = MS[x]; f = wt / tw
        mn, mx = (1, 1) if m['BaseId'] in ('fallen1', 'scarab1') else (num(m['MinGrp']), num(m['MaxGrp']))
        c = normal * f * (mn + mx) / 2
        cnt += c; ex += c * kill(x, lvl, 0, 1, P)
        mi = m.get('minion1') or x
        champ = bosses * 0.2 * f * 3; uniq = bosses * 0.8 * f; mins = uniq * 4.5
        cnt += champ + uniq + mins
        ex += champ * kill(x, lvl, 2, 3, P) + uniq * kill(x, lvl, 3, 5, P) + mins * kill(mi, lvl, 3, 5, P)
    return groups, cnt, ex
def boss_events(aid, tiles_total):
    r = LV[aid]; g = tiles_total * 25 / 9 * min(num(r['MonDen(H)']), 10000) / 100000
    umin, umax = num(r['MonUMin(H)']), num(r['MonUMax(H)'])
    return min(g, umax, umin + 0.06 * g) if umax else 0
CELL = 24 * 24  # Chaos Sanctum preset cell (lvlprest 857-862, 24x24 tiles); 6 walkable cells, 20 lava cells
CH_B = boss_events(108, 6 * CELL)          # boss events of the whole level, spread evenly over the 6 cells
HV_T = 84 * 84                             # Halls of Vaught = one 84x84 preset (lvlprest 864)
HV_B = boss_events(124, HV_T)
baal, dia = run_parts()
def parts_exp(parts, P):
    tot = 0; cnt = 0
    for cls, M, x5, c in parts:
        e = mexp(cls, M - 3 if x5 else M, 5 if x5 else 1)
        tot += gain(share(e, N, N * P, P), P, M) * c; cnt += c
    return cnt, tot
nihl = [('nihlathakboss', num(MS['nihlathakboss']['Level(H)']) + 3, True, 1), ('minion6', num(LV[124]['MonLvl3Ex']), False, 20)]
NIHL_ROOM = 25 * 25 / 25  # hunted room: about 25 x 25 game coordinates = 5 x 5 tiles (user, 261105)
if __name__ == '__main__':
    cols = ['1 카오스 날개 일반', '1b 스타 칸 일반(참고)', '2a 봉인 보스 3 + 부하', '2b 디아블로', '3 웨이브 1~5', '4 바알', '5a 니라탁 + 부하 20', '5b 니라탁 방 일반']
    print('| 레벨 | 필요 경험치 | ' + ' | '.join(cols) + ' | 합계(1b 제외) | 필요 런 수 |')
    print('|---' * (len(cols) + 4) + '|')
    for P in range(PF, PT + 1):
        v = []
        g, c, e = region(108, 3 * CELL, CH_B * 3 / 6, P); v.append((e, c))
        g, c, e = region(108, CELL, CH_B / 6, P); v.append((e, c))
        c2, e2 = 0, 0
        for _, p in dia[:3]:
            c, e = parts_exp(p, P); c2 += c; e2 += e
        v.append((e2, c2)); c, e = parts_exp(dia[3][1], P); v.append((e, c))
        c3, e3 = 0, 0
        for _, p in baal[:5]:
            c, e = parts_exp(p, P); c3 += c; e3 += e
        v.append((e3, c3)); c, e = parts_exp(baal[5][1], P); v.append((e, c))
        c, e = parts_exp(nihl, P); v.append((e, c))
        g, c, e = region(124, NIHL_ROOM, 0, P); v.append((e, c))
        tot = sum(e for k, (e, c) in enumerate(v) if k != 1)  # route = 1, 2a, 2b, 3, 4, 5a, 5b (star cell 1b is reference)
        need = EX[P][0] - EX[P - 1][0]
        print('| %d | {:,} | '.format(need) % P + ' | '.join('{:,.0f} ({:.1f}마리)'.format(e, c) if c < 10 else '{:,.0f} ({:.0f}마리)'.format(e, c) for e, c in v)
              + ' | {:,.0f} | {:,} |'.format(tot, -(-need // int(tot))))
