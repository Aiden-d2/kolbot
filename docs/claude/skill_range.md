# 스킬 사거리 (측정·데이터·결정) (261002)

스킬 사거리에 관한 것은 모두 이 문서에 모은다. 260930 측정 결과는 원래 `attack_design.md` 12-1 한 줄에만 있어 찾기 어려웠다(261002 사용자 요청으로 분리).
코드의 사거리 값은 `libs/Misc.js` `Skill.getRange`(10줄부터). 이 값은 `Attack.setPosition`의 접근 거리이자 회피 반경 R = min(사거리, `Dodge.Range` 10)의 재료다.

---

## 1. 사거리 계산 공식 (미사일 스킬)

- **좌표 거리 = 속도 × 프레임 × 3/64.** 감속(`Accel`)이 있으면 프레임마다 속도에 `Accel/1000`을 더한다(Accel은 음수).
- 입력은 Missiles.txt 칸: **속도 = `Vel`**(최대 `MaxVel`), **프레임 = `Range`**(미사일 수명). 1프레임 = 40ms(25fps). 레벨에 따라 수명이 늘어나는 미사일(`LevRange` 등)은 따로 확인해야 한다. Howl처럼 측정값이 계산보다 큰 경우가 그렇다(추정).
- 데이터 출처: blizzhackers/d2data `json/missiles.json`, `json/monstats2.json`(레거시 D2 데이터를 JSON으로 옮긴 것). 게임 버전과의 차이는 확인하지 않음.
- 검산:
  - Frozen Orb 구슬(`frozenorb` 260): Vel 10 × Range 30 × 3/64 = **14.06** (260930 노트의 14.1)
  - Shock Wave(`shockwave` 511): Vel 20 × Range 14 × 3/64 = **13.1**. 측정 12.0~12.7(측정기가 주기적으로 좌표를 봐서 마지막 구간을 놓쳐 조금 작게 나옴, 추정)
  - Nova(`nova` 90): Vel 24, Accel −1000, Range 13 → 24+23+…+12 = 234 × 3/64 = **11.0**. 측정 11.3
  - War Cry(`warcry` 235): Vel 12, Accel −600, Range 16 → Σ(12 − 0.6k, k=0..15) = 120 × 3/64 = **약 5.6** (계산만, 측정 안 함)
  - Howl(`howl` 148): Vel 12, Accel −1000, Range 12 → 78 × 3/64 = 3.7인데 측정은 15.0(스킬 레벨 20). 레벨에 따라 수명·속도가 바뀌는 것으로 보임(추정, 미확인)

### 관련 미사일 데이터 (missiles.json)
| 미사일 (ID) | Vel | Accel | Range(프레임) | Size | 기타 |
|---|---|---|---|---|---|
| shockwave (511) | 20 | – | 14 | 1 | CollideType 3, 관통(CollideKill 없음), NextHit 1·NextDelay 4, 기절(dParam1 0 → 스킬의 Calc4) |
| warcry (235) | 12 | −600 | 16 | 1 | CollideType 3, NextHit 1·NextDelay 6 |
| nova (90) | 24 | −1000 | 13 | 1 | NextHit 1·NextDelay 4 |
| howl (148) | 12 | −1000 | 12 | 1 | |
| frozenorb (260) | 10 | – | 30 | 1 | 구슬. 클라이언트 미사일 목록에 안 나와 측정 불가 |
| frozenorbbolt (261) | 18 | – | 25 | 1 | 파편, CollideKill |
| frozenorbnova (262) | 24 | – | 25 | 1 | 폭발 파편, CollideKill |
| poisonnova (118) | 12 | – | 30 | 1 | |
| armageddoncontrol (577) / rock (578) / explosion (580) | – | – | 25 / 25 / 16 | – / – / 3 | Armageddon 관련 |
| hurricaneswoosh (581) 외 | 18~20 | – | 20~22 | – | Hurricane 관련 |

- **`Size`**: 미사일 충돌 크기(지름, 서브타일). 1 = 1칸, 2 = 2×2, 3 = 3×3 (Phrozen Keep Missiles.txt 가이드, 검색 요약으로 확인).
- **`CollideType`**: 3 일반, 6 위에서 떨어짐, 8 불, 1 바닥에 깔림, 0 충돌 없음.
- **`NextHit`/`NextDelay`**: 한 번 맞힌 뒤 다음 타격까지의 프레임(과다 타격 방지).
- **몹 충돌 크기**(monstats2 `SizeX/SizeY`): 2×2 366종(좀비·폴른·스켈레톤·고트맨·뱀파이어 등), 3×3 197종(원숭이·소·블러드로드·디아블로 등), 0×0 48종, 1×1 12종.

---

## 2. 측정 기록

### 2-1. 260930 측정 (Numpad 5 측정기, 커밋 `4fabff3` → `e572133` → `4ea1938`)
| 스킬 | 측정 | 비고 |
|---|---|---|
| Nova | 11.3 | |
| Howl | 15.0 | 스킬 레벨 20 |
| Shock Wave | 12.4 | 261002 재측정 12.0~12.6(정상 4회), 수명 13~14프레임 |
| Frozen Orb 구슬 | 14.1 | 계산값(측정 불가) |
| Armageddon | – | 측정 없음 |

### 2-2. 261002 쇼크웨이브 퍼짐 측정 (Numpad 6 자동 측정)
- 한 번 시전에 미사일 **5개**(classid 511, owner 나), 모두 내 자리에서 출발(spawn 0.0).
- 커서 거리 d를 1~10으로 바꾸며 거리마다 3회, 오른쪽(+x)으로 자동 시전. **같은 거리는 3회 모두 같은 각도**(무작위 없음).
- **퍼지는 규칙**: 5개가 커서 지점과, 그 지점에서 시전 방향에 직각으로 좌우 1칸·2칸 떨어진 점을 향한다. 안쪽 각도 = atan(1/d), 바깥 각도 = atan(2/d), 부채꼴 = 2·atan(2/d). 미사일 길이는 커서와 무관하게 약 12~13.
- 측정값의 몇 도 차이·좌우 비대칭·d7~9가 같은 값인 것은 끝 좌표가 정수라서 생긴 반올림으로 봄(추정).

| d | 각도(측정) | 부채꼴 | 12칸 지점 너비 | 이웃 미사일 최대 간격(12칸) | 양 끝 미사일 앞쪽 거리 | 판정(간격 ≤ 3) |
|---|---|---|---|---|---|---|
| 1 | −66, −45, 0, 45, 66 | 131° | 21.8 | 9.2 | 5.0 | 빈틈 |
| 2 | −45, −24, 0, 29, 45 | 90° | 17.0 | 6.0 | 9.0 | 빈틈 |
| 3 | −35, −18, 0, 17, 35 | 70° | 13.8 | 3.8 | 10.0 | 빈틈 |
| 4 | −24, −14, 0, 14, 29 | 53° | 10.8 | 3.1 | 9.0 | 빈틈(공식으로는 12칸 2.9 / 13칸 3.2, 경계) |
| **5** | −20, −9, 0, 9, 22 | 42° | 8.6 | 2.6 | 10.0 | **빈틈 없음(최소)** |
| 6 | −18, −9, 0, 9, 17 | 35° | 7.2 | 2.0 | 10.0 | 빈틈 없음 |
| 7 | −14, −9, 0, 9, 14 | 28° | 5.8 | 2.0 | 12.0 | 빈틈 없음 |
| 8 | −14, −5, 0, 5, 14 | 28° | 5.8 | 1.9 | 12.0 | 빈틈 없음 |
| 9 | −14, −5, 0, 5, 14 | 28° | 5.8 | 1.9 | 12.0 | 빈틈 없음 |
| 10 | −9, −5, 0, 5, 9 | 19° | 3.9 | 1.0 | 12.0 | 빈틈 없음 |

- 간격 = 이웃 두 미사일 중심선 사이 거리(반지름 r에서 2r·sin(Δ각/2)). 멀어질수록 벌어지므로 12칸 지점이 가장 넓다(실제 도달 13칸 끝은 조금 더 넓음).
- **"빈틈 없음" 기준(추정)**: 미사일 Size 1 + 2×2 몹이면 몹 중심이 미사일 선에서 좌우 약 1.5칸 안이면 겹친다 → 미사일 하나가 약 3칸 폭을 쓸고 감 → 간격 3 이하면 빈틈 없음. 3×3 몹이면 약 4칸. 사용자가 보수적으로 2×2(3칸) 기준을 정함. 게임의 실제 충돌식은 확인하지 않았다.
- **"앞쪽 거리"**: 미사일 직선거리(`dist`)는 모두 12 안팎으로 같고, 시전 방향(가운데 미사일)으로 잰 성분(`along`)만 넓게 퍼질수록 줄어든다.
- 수동 측정(261002, 커서 가깝게·중간·멀리)도 같은 결과: 가깝게 131°/너비 22.0, 중간 23°/5.0, 멀리 9°/2.0. 첫 시전 3.6(4프레임)은 장애물에 막힌 것으로 봄(추정).

---

## 3. 측정기 코드 (사용자 로컬에만 있음, 저장소 `ToolsThread.js`에는 260930 Numpad 5 원본만 있음)

`threads/ToolsThread.js`. 사용: Pause로 봇을 멈춘 뒤 키를 누른다. 로컬 파일을 저장소 버전으로 덮어쓰면 사라지니 여기 남긴다.

### 3-1. Numpad 5 개정 (미사일별 끝 좌표·퍼짐 출력) — `this.runMeter` 전체 교체
트인 곳을 향해 스킬을 손으로 한 번 쓴다. 종류별 한 줄(`max` 최대 거리, `life` 수명, `spawn` 생성 거리, `owner`)에 더해 같은 종류가 2개 이상이면 미사일별 `end/dist/angle/side/along`과 `spread: fan … width at end …`를 출력한다. 시전 방향은 끝점 방향의 평균.

```js
	this.runMeter = function () {	//260930 temp
		var m, t, gid, cls, line, alive, i, k, dx, dy, dir, sx, sy, rel, side, along, minA, maxA, minS, maxS, sumA, used,
			now = getTickCount(),
			seen = {},
			byClass = {},
			out = function (s) {
				print(s);
				D2Bot.printToConsole(s);
			};

		m = getUnit(3);

		if (m) {
			do {
				seen[m.gid] = true;
				t = this.meter.list[m.gid];

				if (!t) {
					if (this.meter.old[m.gid]) {	//260930 no owner filter
						continue;
					}

					t = this.meter.list[m.gid] = {name: m.name, classid: m.classid, owner: m.owner, ownertype: m.ownertype, cx: me.x, cy: me.y, sx: m.x, sy: m.y, lx: m.x, ly: m.y, max: 0, born: now, last: now};	//261002 lx, ly
					this.meter.lastNew = now;
				}

				t.max = Math.max(t.max, getDistance(t.cx, t.cy, m.x, m.y));
				t.lx = m.x;	//261002 last seen position, for the spread
				t.ly = m.y;
				t.last = now;
			} while (m.getNext());
		}

		alive = 0;

		for (gid in this.meter.list) {
			if (this.meter.list.hasOwnProperty(gid) && seen[gid]) {
				alive += 1;
			}
		}

		// nothing cast within 15s: give up. Otherwise finish once every tracked missile is gone for 1s
		if (!this.meter.lastNew) {
			if (now - this.meter.armed > 15000) {
				print("[MM] no missile seen");
				me.overhead("Meter: nothing");
				this.meter = null;
			}

			return;
		}

		if (alive > 0 || now - this.meter.lastNew < 1000) {
			return;
		}

		for (gid in this.meter.list) {
			if (this.meter.list.hasOwnProperty(gid)) {
				t = this.meter.list[gid];
				cls = byClass[t.classid] || (byClass[t.classid] = {name: t.name, n: 0, max: 0, life: 0, spawn: 0, owners: {}, list: []});	//261002 list
				cls.owners[t.owner === me.gid ? "me" : (this.meter.list[t.owner] ? "missile " + this.meter.list[t.owner].classid : t.owner + "/type " + t.ownertype)] = true;
				cls.n += 1;
				cls.max = Math.max(cls.max, t.max);
				cls.life = Math.max(cls.life, t.last - t.born);
				cls.spawn = Math.max(cls.spawn, getDistance(t.cx, t.cy, t.sx, t.sy));
				cls.list.push(t);
			}
		}

		for (cls in byClass) {
			if (byClass.hasOwnProperty(cls)) {
				t = byClass[cls];
				line = "[MM] " + t.name + " (classid " + cls + ") x" + t.n + " max:" + t.max.toFixed(1) + " life:" + t.life + "ms (~" + Math.round(t.life / 40) + " frames) spawn:" + t.spawn.toFixed(1) + " owner:" + Object.keys(t.owners).join(",");
				out(line);

				// 261002 spread: cast direction = mean of the end directions, angle and side offset of each missile against it
				if (t.n < 2) {
					continue;
				}

				sx = 0;
				sy = 0;

				for (i = 0; i < t.list.length; i += 1) {
					k = t.list[i];
					dx = k.lx - k.cx;
					dy = k.ly - k.cy;

					if (Math.sqrt(dx * dx + dy * dy) >= 1) {
						sx += dx / Math.sqrt(dx * dx + dy * dy);
						sy += dy / Math.sqrt(dx * dx + dy * dy);
					}
				}

				if (!sx && !sy) {
					out("[MM]   spread: no direction");
					continue;
				}

				dir = Math.atan2(sy, sx);
				minA = 999;
				maxA = -999;
				minS = 999;
				maxS = -999;
				sumA = 0;
				used = 0;

				for (i = 0; i < t.list.length; i += 1) {
					k = t.list[i];
					dx = k.lx - k.cx;
					dy = k.ly - k.cy;
					along = dx * Math.cos(dir) + dy * Math.sin(dir);
					side = -dx * Math.sin(dir) + dy * Math.cos(dir);
					rel = Math.atan2(Math.sin(Math.atan2(dy, dx) - dir), Math.cos(Math.atan2(dy, dx) - dir)) * 180 / Math.PI;

					out("[MM]   #" + (i + 1) + " end:" + k.lx + "," + k.ly + " dist:" + Math.sqrt(dx * dx + dy * dy).toFixed(1) + " angle:" + rel.toFixed(0) + " side:" + side.toFixed(1) + " along:" + along.toFixed(1));

					if (Math.sqrt(dx * dx + dy * dy) >= 1) {
						minA = Math.min(minA, rel);
						maxA = Math.max(maxA, rel);
						minS = Math.min(minS, side);
						maxS = Math.max(maxS, side);
						sumA += along;
						used += 1;
					}
				}

				if (used) {
					out("[MM]   spread: fan " + (maxA - minA).toFixed(0) + " deg (" + minA.toFixed(0) + " ~ " + maxA.toFixed(0) + ") width at end:" + (maxS - minS).toFixed(1) + " along avg:" + (sumA / used).toFixed(1));
				}
			}
		}

		me.overhead("Meter: done");
		this.meter = null;
	};
```

### 3-2. Numpad 6 쇼크웨이브 자동 측정 (`[MS]`)
트인 곳에 서서(+x, 화면 오른쪽 아래 대각선 방향(추정)으로 13칸 이상) 누르면 커서 거리 1~10 × 3회를 자동으로 쏘고 시전마다 한 줄, 끝에 거리별 요약과 `closest closed d`를 출력한다. 캐릭터가 움직이면 멈춘다. 마나가 부족하면 기다린다. `Skill.cast`는 시전 동작이 끝날 때까지 기다려 그 사이 미사일이 날아가 버리므로 `setSkill` + `clickMap`으로 쏜다. 다른 스킬에 쓰려면 243·511을 바꾼다.

`this.runMeter` 아래에 추가:
```js
	// Shock Wave fan sweep (temp). Pause first, stand on open ground with room on the +x side, press Numpad 6	//261002 temp
	// Casts at distance 1..10 toward +x, 3 times each; prints the fan per cast and per distance. "closed" = gap between neighbour missiles at 12 <= 3 (2x2 monster)
	this.sweep = null;

	this.startSweep = function () {	//261002 temp
		if (!me.getSkill(243, 1)) {
			print("[MS] no Shock Wave");

			return;
		}

		this.sweep = {ox: me.x, oy: me.y, d: 1, rep: 1, phase: "cast", rows: []};
		print("[MS] start at " + me.x + "," + me.y + ", casting toward " + (me.x + 10) + "," + me.y);
	};

	this.runSweep = function () {	//261002 temp
		var m, t, gid, i, k, alive, list, dist, fan, width, minAlong, maxGap, blocked, sum, best,
			s = this.sweep,
			R = 12,
			now = getTickCount(),
			deg = function (p) {
				return (p.a * 180 / Math.PI).toFixed(0);
			},
			out = function (str) {
				print(str);
				D2Bot.printToConsole(str);
			};

		if (s.phase === "cast") {
			if (me.x !== s.ox || me.y !== s.oy) {
				out("[MS] moved from " + s.ox + "," + s.oy + ", stopped");
				this.sweep = null;

				return;
			}

			if (me.attacking || Skill.getManaCost(243) > me.mp) {
				return;	// wait for the last cast to end / for mana
			}

			s.old = {};
			m = getUnit(3);

			if (m) {
				do {
					s.old[m.gid] = true;
				} while (m.getNext());
			}

			s.list = {};
			s.armed = now;
			s.lastNew = 0;

			if (!Skill.setSkill(243, 0)) {
				out("[MS] setSkill failed");
				this.sweep = null;

				return;
			}

			// not Skill.cast: it waits out the cast animation while the missiles are already flying
			clickMap(3, 0, s.ox + s.d, s.oy);
			delay(20);
			clickMap(5, 0, s.ox + s.d, s.oy);
			s.phase = "track";

			return;
		}

		alive = 0;
		m = getUnit(3);

		if (m) {
			do {
				if (m.classid !== 511 || m.owner !== me.gid || s.old[m.gid]) {
					continue;
				}

				t = s.list[m.gid];

				if (!t) {
					t = s.list[m.gid] = {};
					s.lastNew = now;
				}

				t.x = m.x;
				t.y = m.y;
				alive += 1;
			} while (m.getNext());
		}

		if (!s.lastNew) {
			if (now - s.armed < 2000) {
				return;
			}

			out("[MS] d" + s.d + " #" + s.rep + " no missile");
			s.rows.push({d: s.d, bad: true});
		} else {
			if (alive > 0 || now - s.lastNew < 300) {
				return;
			}

			list = [];

			for (gid in s.list) {
				if (s.list.hasOwnProperty(gid)) {
					t = s.list[gid];
					list.push({dist: getDistance(s.ox, s.oy, t.x, t.y), a: Math.atan2(t.y - s.oy, t.x - s.ox)});
				}
			}

			list.sort(function (p, q) {
				return p.a - q.a;
			});

			blocked = list.length !== 5;
			minAlong = 999;
			maxGap = 0;

			for (i = 0; i < list.length; i += 1) {
				dist = list[i].dist;

				if (dist < 10) {
					blocked = true;
				}

				minAlong = Math.min(minAlong, dist * Math.cos(list[i].a));

				if (i > 0) {
					maxGap = Math.max(maxGap, 2 * R * Math.sin((list[i].a - list[i - 1].a) / 2));
				}
			}

			fan = (list[list.length - 1].a - list[0].a) * 180 / Math.PI;
			width = R * (Math.sin(list[list.length - 1].a) - Math.sin(list[0].a));
			s.rows.push({d: s.d, bad: blocked, fan: fan, width: width, gap: maxGap, along: minAlong});
			out("[MS] d" + s.d + " #" + s.rep + " x" + list.length + " fan:" + fan.toFixed(0) + " width12:" + width.toFixed(1) + " gap12:" + maxGap.toFixed(1) +
				" outerAlong:" + minAlong.toFixed(1) + " angles:" + list.map(deg).join(",") + (blocked ? " BLOCKED" : ""));
		}

		s.rep += 1;

		if (s.rep > 3) {
			s.rep = 1;
			s.d += 1;
		}

		s.phase = "cast";

		if (s.d <= 10) {
			me.overhead("Sweep d" + s.d + " #" + s.rep);

			return;
		}

		best = 0;

		for (k = 1; k <= 10; k += 1) {
			sum = {n: 0, fan: 0, width: 0, gap: 0, along: 999};

			for (i = 0; i < s.rows.length; i += 1) {
				if (s.rows[i].d === k && !s.rows[i].bad) {
					sum.n += 1;
					sum.fan += s.rows[i].fan;
					sum.width += s.rows[i].width;
					sum.gap = Math.max(sum.gap, s.rows[i].gap);
					sum.along = Math.min(sum.along, s.rows[i].along);
				}
			}

			if (!sum.n) {
				out("[MS] = d" + k + " no valid cast");

				continue;
			}

			out("[MS] = d" + k + " valid:" + sum.n + "/3 fan:" + (sum.fan / sum.n).toFixed(0) + " width12:" + (sum.width / sum.n).toFixed(1) +
				" gap12 max:" + sum.gap.toFixed(1) + " outerAlong min:" + sum.along.toFixed(1) + (sum.gap <= 3 ? " closed" : " open"));

			if (!best && sum.gap <= 3) {
				best = k;
			}
		}

		out("[MS] closest closed d: " + (best || "none") + " (gap12 <= 3)");
		me.overhead("Sweep done");
		this.sweep = null;
	};
```

`keyEvent`:
```js
		case 102: // Numpad 6 (Shock Wave fan sweep, temp)	//261002 temp
			this.startSweep();
			break;
```

메인 루프의 `if (this.meter) { ... }` 아래:
```js
		if (this.sweep) {	//261002 temp
			try {
				this.runSweep();
			} catch (e3) {
				print("[MS] " + e3);
				this.sweep = null;
			}
		}
```

---

## 4. 현재 사거리 값과 근거 (`Skill.getRange`, 261002)

| 스킬 | 값 | 근거·이력 |
|---|---|---|
| 근접 계열(Bash, Zeal, Smite, Blessed Hammer, Maul, Fury 등) | 3 | 기존 |
| Battle Cry | 4 | 기존 |
| War Cry (154) | 5 | 기존. 계산 도달 약 5.6. 261002부터 사거리 밖이거나 막혔을 때만 접근(회피 없음, `Barbarian.js`) |
| Twister, Tornado | 5 | 기존. Tornado는 몹 방향 2~3칸 앞·좌우 ±1에 시전(`Druid.js` 104-112) |
| Charged Bolt, Frost Nova | 6 | 기존 |
| Whirlwind, Molten Boulder | 7 | 기존 |
| Shock Wave (243) | 7 | 260930 7→10→7(Armageddon과 같은 값, D.FGOM 진동 방지). 261002 그대로 7, 게이트(회피 없음), 5칸보다 가까우면 5칸 커서(`Wereform.js`) |
| Nova (48), Frozen Orb (64), Poison Nova | 9 | 260917 9, 260930 하루 10 뒤 9로(FONV 진동 방지로 FO·Nova 같은 값). 측정 Nova 11.3, FO 구슬 14.1 |
| Poison/Plague Javelin, Charge, Firestorm | 10 | 기존 |
| Inner Sight, Slow Missiles | 13 | 기존 |
| Howl (130) | 15 | 260901, 260930 20→15(측정 15.0, 스킬 레벨 20). B.WCRY `LowManaSkill = [130]` 삭제(War Cry 5 ↔ Howl 진동 방지) |
| Lightning Fury, Teeth, Holy Bolt, Fissure, Volcano, Fire Blast, Shock Web, Blade Sentinel/Fury | 15 | 기존 |
| 활 스킬, Fire Wall, Fist of the Heavens, Double Throw, Psychic Hammer, Dragon Flight | 20 | 기존 (Fire Wall 260917) |
| Armageddon (249) | 20 | 261002 7→20. 사용자: 맞든 안 맞든 20 안에 몹이 보이면 바로 시전. 게이트(회피 없음, `Wereform.js`). 효과가 시전 좌표와 무관하게 내 주변에 난다는 건 추정(미확인) |
| Summoner(500) | 25 | 260723 |
| Static Field (42) | 스킬 레벨 + 4 | 260915. 선시전 루프(`Sorceress.js:59`)는 floor((레벨+4)×2/3), 사거리 밖일 때만 접근(회피 없음) |
| Leap / Arctic Blast | 표 × 3/2 − 1 | 260513 |
| Bone Spear/Spirit | 15 | PvP 40 |
| Fire Ball, Lightning, Chain Lightning, Glacial Spike, Meteor, Blizzard, Mind Blast | 20 | PvP 40 |
| 그 밖 | (함수 끝 기본값) | |

### 사거리와 회피의 관계
- `setPosition(unit, 사거리, coll)`: 사거리 밖이거나 막혔으면 접근, 사거리 안이고 `Dodge.Enabled`이고 사거리 ≥ `Dodge.MinSkillRange`(5)면 회피 판정(반경 R = min(사거리, 10) 미만 몹 1마리 이상이면 물러남).
- 회피를 원하지 않는 스킬은 직업 파일에서 "사거리 밖이거나 막혔을 때만 `setPosition`"을 부르는 게이트로 막는다(스태틱 선시전, Howl 선공격, 261002 War Cry·Shock Wave·Armageddon). `Dodge.Enabled = false`와 해당 스킬 동작은 같지만 범위가 다르다(다른 스킬 전부, 탈라샤 무덤 토글이 `true`로 되돌림).
- `MinSkillRange`를 `>`로 바꾸는 안은 기각: 정확히 5인 스킬(War Cry, Twister, Tornado, Static Field 레벨 1, Leap 레벨 1) 전부 회피가 꺼진다.
- 빌드의 회피 켜기: 261002부터 모든 빌드 25레벨(전에는 18레벨).

---

## 5. 열린 질문
- War Cry 실제 도달 거리와 미사일 수: 데이터상 미사일(`warcry` 235)이 있으니 Numpad 5 측정기로 잴 수 있다(261002 대화 중 "투사체가 없을 것"이라 한 건 틀림).
- Howl의 레벨별 수명·속도: 측정 15.0이 계산 3.7보다 훨씬 큼. 레벨 스케일링 칸 확인 필요.
- 미사일·몹 충돌의 실제 판정식(빈틈 기준 3칸은 크기 어림).
- Armageddon 효과 범위(시전 좌표 무관 여부).
