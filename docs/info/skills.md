# 스킬 (`me.getSkill`, `getSkillInfo`, `Skill.cast`)

스킬 번호·영문·한글 이름·직업·요구 레벨, `me.getSkill`·`getSkillInfo` 인자 (261104).

- 출처:
  - 번호·영문 이름·직업·요구 레벨: mpqdata `skills.txt` (`Id`, `skill`, `charclass`, `reqlevel`). 근거: mpqdata
  - 한글 이름: 사용자 자료 `스킬 코드.txt`(0~280). 근거: 사용자 자료
  - `me.getSkill` 인자: 사용자 자료 `260923 me.getSkill.txt`(사용자 확인). `getSkillInfo` 인자: kolbot 옛 sdk `getskillinfo.txt`(근거: 웹 미검증, 판 불명)
- kolbot 사용처: `me.getSkill`, `Skill.cast`, `Skill.getRange`, `sdk.skills`

## 스킬 표

- 영문은 mpq 내부 이름이라 게임 표시 이름과 다를 수 있다(예: 251 `Fire Trauma` = Fire Blast, 280 `Royal Strike` = Phoenix Strike).
- 요구 레벨은 직업 스킬만 의미가 있다. 직업 칸이 빈 줄은 공용·아이템·몬스터 스킬.
- 156~220, 281~356은 몬스터·아이템 전용 스킬이다(한글 이름 없음). 217~220은 주문서·책.

| ID | 영문 (mpq) | 한글 | 직업 | 요구 레벨 |
|---|---|---|---|---|
| 0 | Attack | 공격 |  |  |
| 1 | Kick | 킥 |  |  |
| 2 | Throw | 던지기 |  |  |
| 3 | Unsummon | 소환해제 |  |  |
| 4 | Left Hand Throw | 왼손 던지기 |  |  |
| 5 | Left Hand Swing | 왼손 공격 |  |  |
| 6 | Magic Arrow | 매직 애로우 | 아마존 | 1 |
| 7 | Fire Arrow | 파이어 애로우 | 아마존 | 1 |
| 8 | Inner Sight | 이너 사이트 | 아마존 | 1 |
| 9 | Critical Strike | 크리티컬 스트라이크 | 아마존 | 1 |
| 10 | Jab | 잽 | 아마존 | 1 |
| 11 | Cold Arrow | 콜드 애로우 | 아마존 | 6 |
| 12 | Multiple Shot | 멀티플 샷 | 아마존 | 6 |
| 13 | Dodge | 닷지 | 아마존 | 6 |
| 14 | Power Strike | 파워 스트라이크 | 아마존 | 6 |
| 15 | Poison Javelin | 포이즌 자벨린 | 아마존 | 6 |
| 16 | Exploding Arrow | 익스플로딩 애로우 | 아마존 | 12 |
| 17 | Slow Missiles | 슬로우 미사일 | 아마존 | 12 |
| 18 | Avoid | 어보이드 | 아마존 | 12 |
| 19 | Impale | 임페일 | 아마존 | 12 |
| 20 | Lightning Bolt | 라이트닝 볼트 | 아마존 | 12 |
| 21 | Ice Arrow | 아이스 애로우 | 아마존 | 18 |
| 22 | Guided Arrow | 가이드 애로우 | 아마존 | 18 |
| 23 | Penetrate | 패네트레이트 | 아마존 | 18 |
| 24 | Charged Strike | 차지드 스트라이크 | 아마존 | 18 |
| 25 | Plague Javelin | 플레이크 자벨린 | 아마존 | 18 |
| 26 | Strafe | 스트레이프 | 아마존 | 24 |
| 27 | Immolation Arrow | 이몰레이션 애로우 | 아마존 | 24 |
| 28 | Dopplezon | 디코이 | 아마존 | 24 |
| 29 | Evade | 이베이드 | 아마존 | 24 |
| 30 | Fend | 펜드 | 아마존 | 24 |
| 31 | Freezing Arrow | 프리징 애로우 | 아마존 | 30 |
| 32 | Valkyrie | 발키리 | 아마존 | 30 |
| 33 | Pierce | 피어스 | 아마존 | 30 |
| 34 | Lightning Strike | 라이트닝 스트라이크 | 아마존 | 30 |
| 35 | Lightning Fury | 라이트닝 퓨리 | 아마존 | 30 |
| 36 | Fire Bolt | 파이어 볼트 | 소서리스 | 1 |
| 37 | Warmth | 웜쓰 | 소서리스 | 1 |
| 38 | Charged Bolt | 차지드 볼트 | 소서리스 | 1 |
| 39 | Ice Bolt | 아이스볼트 | 소서리스 | 1 |
| 40 | Frozen Armor | 프로즌 아머 | 소서리스 | 1 |
| 41 | Inferno | 인페르노 | 소서리스 | 6 |
| 42 | Static Field | 스태틱 필드 | 소서리스 | 6 |
| 43 | Telekinesis | 텔레키네시스 | 소서리스 | 6 |
| 44 | Frost Nova | 프로스트 노바 | 소서리스 | 6 |
| 45 | Ice Blast | 아이스 블래스트 | 소서리스 | 6 |
| 46 | Blaze | 블레이즈 | 소서리스 | 12 |
| 47 | Fire Ball | 파이어 볼 | 소서리스 | 12 |
| 48 | Nova | 노바 | 소서리스 | 12 |
| 49 | Lightning | 라이트닝 | 소서리스 | 12 |
| 50 | Shiver Armor | 쉬버 아머 | 소서리스 | 12 |
| 51 | Fire Wall | 파이어 월 | 소서리스 | 18 |
| 52 | Enchant | 인첸트 | 소서리스 | 18 |
| 53 | Chain Lightning | 체인 라이트닝 | 소서리스 | 18 |
| 54 | Teleport | 텔레포트 | 소서리스 | 18 |
| 55 | Glacial Spike | 글래이셜 스파이크 | 소서리스 | 18 |
| 56 | Meteor | 메테오 | 소서리스 | 24 |
| 57 | Thunder Storm | 썬더 스톰 | 소서리스 | 24 |
| 58 | Energy Shield | 에너지 실드 | 소서리스 | 24 |
| 59 | Blizzard | 블리자드 | 소서리스 | 24 |
| 60 | Chilling Armor | 칠링 아머 | 소서리스 | 24 |
| 61 | Fire Mastery | 파이어 마스터리 | 소서리스 | 30 |
| 62 | Hydra | 하이드라 | 소서리스 | 30 |
| 63 | Lightning Mastery | 라이트닝 마스터리 | 소서리스 | 30 |
| 64 | Frozen Orb | 프로즌 오브 | 소서리스 | 30 |
| 65 | Cold Mastery | 콜드 마스터리 | 소서리스 | 30 |
| 66 | Amplify Damage | 앰플리파이 대미지 | 네크로맨서 | 1 |
| 67 | Teeth | 티쓰 | 네크로맨서 | 1 |
| 68 | Bone Armor | 본 아머 | 네크로맨서 | 1 |
| 69 | Skeleton Mastery | 스켈레톤 마스터리 | 네크로맨서 | 1 |
| 70 | Raise Skeleton | 레이즈 스켈레톤 | 네크로맨서 | 1 |
| 71 | Dim Vision | 딤 버젼 | 네크로맨서 | 6 |
| 72 | Weaken | 위큰 | 네크로맨서 | 6 |
| 73 | Poison Dagger | 포이즌 대거 | 네크로맨서 | 6 |
| 74 | Corpse Explosion | 커프스 익스플로젼 | 네크로맨서 | 6 |
| 75 | Clay Golem | 클레이 골렘 | 네크로맨서 | 6 |
| 76 | Iron Maiden | 아이언 메이든 | 네크로맨서 | 12 |
| 77 | Terror | 테러 | 네크로맨서 | 12 |
| 78 | Bone Wall | 본 월 | 네크로맨서 | 12 |
| 79 | Golem Mastery | 골렘 마스터리 | 네크로맨서 | 12 |
| 80 | Raise Skeletal Mage | 레이즈 스켈레톤 메이지 | 네크로맨서 | 12 |
| 81 | Confuse | 컨퓨즈 | 네크로맨서 | 18 |
| 82 | Life Tap | 라이프 탭 | 네크로맨서 | 18 |
| 83 | Poison Explosion | 포이즌 익스플로젼 | 네크로맨서 | 18 |
| 84 | Bone Spear | 본 스피어 | 네크로맨서 | 18 |
| 85 | BloodGolem | 블러드 골렘 | 네크로맨서 | 18 |
| 86 | Attract | 어트랙트 | 네크로맨서 | 24 |
| 87 | Decrepify | 디크리피파이 | 네크로맨서 | 24 |
| 88 | Bone Prison | 본 프리즌 | 네크로맨서 | 24 |
| 89 | Summon Resist | 서몬 레지스트 | 네크로맨서 | 24 |
| 90 | IronGolem | 아이언 골렘 | 네크로맨서 | 24 |
| 91 | Lower Resist | 로우어 레지스트 | 네크로맨서 | 30 |
| 92 | Poison Nova | 포이즌 노바 | 네크로맨서 | 30 |
| 93 | Bone Spirit | 본 스피리트 | 네크로맨서 | 30 |
| 94 | FireGolem | 파이어 골렘 | 네크로맨서 | 30 |
| 95 | Revive | 리바이브 | 네크로맨서 | 30 |
| 96 | Sacrifice | 새크리파이스 | 팔라딘 | 1 |
| 97 | Smite | 스마이트 | 팔라딘 | 1 |
| 98 | Might | 마이트 | 팔라딘 | 1 |
| 99 | Prayer | 프레이어 | 팔라딘 | 1 |
| 100 | Resist Fire | 레지스트 파이어 | 팔라딘 | 1 |
| 101 | Holy Bolt | 홀리 볼트 | 팔라딘 | 6 |
| 102 | Holy Fire | 홀리 파이어 | 팔라딘 | 6 |
| 103 | Thorns | 쏜즈 | 팔라딘 | 6 |
| 104 | Defiance | 디파이언스 | 팔라딘 | 6 |
| 105 | Resist Cold | 레지스트 콜드 | 팔라딘 | 6 |
| 106 | Zeal | 질 | 팔라딘 | 12 |
| 107 | Charge | 차지 | 팔라딘 | 12 |
| 108 | Blessed Aim | 블레시드 에임 | 팔라딘 | 12 |
| 109 | Cleansing | 클랜징 | 팔라딘 | 12 |
| 110 | Resist Lightning | 레지스트 라이트닝 | 팔라딘 | 12 |
| 111 | Vengeance | 벤젠스 | 팔라딘 | 18 |
| 112 | Blessed Hammer | 블레시드 해머 | 팔라딘 | 18 |
| 113 | Concentration | 컨센트레이션 | 팔라딘 | 18 |
| 114 | Holy Freeze | 홀리 프리즈 | 팔라딘 | 18 |
| 115 | Vigor | 비거 | 팔라딘 | 18 |
| 116 | Conversion | 컨버젼 | 팔라딘 | 24 |
| 117 | Holy Shield | 홀리 실드 | 팔라딘 | 24 |
| 118 | Holy Shock | 홀리 쇼크 | 팔라딘 | 24 |
| 119 | Sanctuary | 생츄어리 | 팔라딘 | 24 |
| 120 | Meditation | 메디테이션 | 팔라딘 | 24 |
| 121 | Fist of the Heavens | 피스트 오브 더 헤븐즈 | 팔라딘 | 30 |
| 122 | Fanaticism | 파나티시즘 | 팔라딘 | 30 |
| 123 | Conviction | 컨빅션 | 팔라딘 | 30 |
| 124 | Redemption | 리뎀션 | 팔라딘 | 30 |
| 125 | Salvation | 샐베이션 | 팔라딘 | 30 |
| 126 | Bash | 배쉬 | 바바리안 | 1 |
| 127 | Sword Mastery | 소드 마스터리 | 바바리안 | 1 |
| 128 | Axe Mastery | 액스 마스터리 | 바바리안 | 1 |
| 129 | Mace Mastery | 메이스 마스터리 | 바바리안 | 1 |
| 130 | Howl | 하울 | 바바리안 | 1 |
| 131 | Find Potion | 파인드 포션 | 바바리안 | 1 |
| 132 | Leap | 리프 | 바바리안 | 6 |
| 133 | Double Swing | 더블 스윙 | 바바리안 | 6 |
| 134 | Pole Arm Mastery | 폴 암 마스터리 | 바바리안 | 6 |
| 135 | Throwing Mastery | 스로윙 마스터리 | 바바리안 | 6 |
| 136 | Spear Mastery | 스피어 마스터리 | 바바리안 | 6 |
| 137 | Taunt | 타운트 | 바바리안 | 6 |
| 138 | Shout | 샤우트 | 바바리안 | 6 |
| 139 | Stun | 스턴 | 바바리안 | 12 |
| 140 | Double Throw | 더블 스로우 | 바바리안 | 12 |
| 141 | Increased Stamina | 인크리즈드 스태미나 | 바바리안 | 12 |
| 142 | Find Item | 파인드 아이템 | 바바리안 | 12 |
| 143 | Leap Attack | 리프 어택 | 바바리안 | 18 |
| 144 | Concentrate | 컨센트레이트 | 바바리안 | 18 |
| 145 | Iron Skin | 아이언 스킨 | 바바리안 | 18 |
| 146 | Battle Cry | 배틀 크라이 | 바바리안 | 18 |
| 147 | Frenzy | 프렌지 | 바바리안 | 24 |
| 148 | Increased Speed | 인크리즈드 스피드 | 바바리안 | 24 |
| 149 | Battle Orders | 배틀 오더스 | 바바리안 | 24 |
| 150 | Grim Ward | 그림 워드 | 바바리안 | 24 |
| 151 | Whirlwind | 휠인드 | 바바리안 | 30 |
| 152 | Berserk | 버서크 | 바바리안 | 30 |
| 153 | Natural Resistance | 내츄럴 레지스턴스 | 바바리안 | 30 |
| 154 | War Cry | 워 크라이 | 바바리안 | 30 |
| 155 | Battle Command | 배틀 커맨드 | 바바리안 | 30 |
| 156 | Fire Hit |  |  |  |
| 157 | UnHolyBolt |  |  |  |
| 158 | SkeletonRaise |  |  |  |
| 159 | MaggotEgg |  |  |  |
| 160 | ShamanFire |  |  |  |
| 161 | MagottUp |  |  |  |
| 162 | MagottDown |  |  |  |
| 163 | MagottLay |  |  |  |
| 164 | AndrialSpray |  |  |  |
| 165 | Jump |  |  |  |
| 166 | Swarm Move |  |  |  |
| 167 | Nest |  |  |  |
| 168 | Quick Strike |  |  |  |
| 169 | VampireFireball |  |  |  |
| 170 | VampireFirewall |  |  |  |
| 171 | VampireMeteor |  |  |  |
| 172 | GargoyleTrap |  |  |  |
| 173 | SpiderLay |  |  |  |
| 174 | VampireHeal |  |  |  |
| 175 | VampireRaise |  |  |  |
| 176 | Submerge |  |  |  |
| 177 | FetishAura |  |  |  |
| 178 | FetishInferno |  |  |  |
| 179 | ZakarumHeal |  |  |  |
| 180 | Emerge |  |  |  |
| 181 | Resurrect |  |  |  |
| 182 | Bestow |  |  |  |
| 183 | MissileSkill1 |  |  |  |
| 184 | MonTeleport |  |  |  |
| 185 | PrimeLightning |  |  |  |
| 186 | PrimeBolt |  |  |  |
| 187 | PrimeBlaze |  |  |  |
| 188 | PrimeFirewall |  |  |  |
| 189 | PrimeSpike |  |  |  |
| 190 | PrimeIceNova |  |  |  |
| 191 | PrimePoisonball |  |  |  |
| 192 | PrimePoisonNova |  |  |  |
| 193 | DiabLight |  |  |  |
| 194 | DiabCold |  |  |  |
| 195 | DiabFire |  |  |  |
| 196 | FingerMageSpider |  |  |  |
| 197 | DiabWall |  |  |  |
| 198 | DiabRun |  |  |  |
| 199 | DiabPrison |  |  |  |
| 200 | PoisonBallTrap |  |  |  |
| 201 | AndyPoisonBolt |  |  |  |
| 202 | HireableMissile |  |  |  |
| 203 | DesertTurret |  |  |  |
| 204 | ArcaneTower |  |  |  |
| 205 | MonBlizzard |  |  |  |
| 206 | Mosquito |  |  |  |
| 207 | CursedBallTrapRight |  |  |  |
| 208 | CursedBallTrapLeft |  |  |  |
| 209 | MonFrozenArmor |  |  |  |
| 210 | MonBoneArmor |  |  |  |
| 211 | MonBoneSpirit |  |  |  |
| 212 | MonCurseCast |  |  |  |
| 213 | HellMeteor |  |  |  |
| 214 | RegurgitatorEat |  |  |  |
| 215 | MonFrenzy |  |  |  |
| 216 | QueenDeath |  |  |  |
| 217 | Scroll of Identify |  |  |  |
| 218 | Book of Identify |  |  |  |
| 219 | Scroll of Townportal |  |  |  |
| 220 | Book of Townportal |  |  |  |
| 221 | Raven | 레이번 | 드루이드 | 1 |
| 222 | Plague Poppy | 포이즌 크리퍼 | 드루이드 | 1 |
| 223 | Wearwolf | 워 울프 | 드루이드 | 1 |
| 224 | Shape Shifting | 변신술 | 드루이드 | 1 |
| 225 | Firestorm | 파이어 스톰 | 드루이드 | 1 |
| 226 | Oak Sage | 오크 세이지 | 드루이드 | 6 |
| 227 | Summon Spirit Wolf | 스피리트 울프 | 드루이드 | 6 |
| 228 | Wearbear | 워 베어 | 드루이드 | 6 |
| 229 | Molten Boulder | 몰튼 보울더 | 드루이드 | 6 |
| 230 | Arctic Blast | 아틱 블래스트 | 드루이드 | 6 |
| 231 | Cycle of Life | 캐리언 바인 | 드루이드 | 12 |
| 232 | Feral Rage | 피어럴 레이지 | 드루이드 | 12 |
| 233 | Maul | 마울 | 드루이드 | 12 |
| 234 | Eruption | 피셔 | 드루이드 | 12 |
| 235 | Cyclone Armor | 사이클론 아머 | 드루이드 | 12 |
| 236 | Heart of Wolverine | 하트 오브 울버린 | 드루이드 | 18 |
| 237 | Summon Fenris | 다이어 울프 | 드루이드 | 18 |
| 238 | Rabies | 레이비즈 | 드루이드 | 18 |
| 239 | Fire Claws | 파이어 클러 | 드루이드 | 18 |
| 240 | Twister | 트위스터 | 드루이드 | 18 |
| 241 | Vines | 솔라 크리퍼 | 드루이드 | 24 |
| 242 | Hunger | 헝거 | 드루이드 | 24 |
| 243 | Shock Wave | 쇼크 웨이브 | 드루이드 | 24 |
| 244 | Volcano | 볼케이노 | 드루이드 | 24 |
| 245 | Tornado | 토네이도 | 드루이드 | 24 |
| 246 | Spirit of Barbs | 스피리트 오브 바브스 | 드루이드 | 30 |
| 247 | Summon Grizzly | 그리즐리 | 드루이드 | 30 |
| 248 | Fury | 퓨리 | 드루이드 | 30 |
| 249 | Armageddon | 아마게돈 | 드루이드 | 30 |
| 250 | Hurricane | 허리케인 | 드루이드 | 30 |
| 251 | Fire Trauma | 파이어 블라스트 | 어쌔신 | 1 |
| 252 | Claw Mastery | 클러 마스터리 | 어쌔신 | 1 |
| 253 | Psychic Hammer | 사이킥 해머 | 어쌔신 | 1 |
| 254 | Tiger Strike | 타이거 스트라이크 | 어쌔신 | 1 |
| 255 | Dragon Talon | 드래곤 탈런 | 어쌔신 | 1 |
| 256 | Shock Field | 쇼크 웹 | 어쌔신 | 6 |
| 257 | Blade Sentinel | 블레이드 센티널 | 어쌔신 | 6 |
| 258 | Quickness | 버스트 오브 스피드 | 어쌔신 | 6 |
| 259 | Fists of Fire | 피스트 오브 파이어 | 어쌔신 | 6 |
| 260 | Dragon Claw | 드래곤 클러 | 어쌔신 | 6 |
| 261 | Charged Bolt Sentry | 차지드 볼트 센트리 | 어쌔신 | 12 |
| 262 | Wake of Fire Sentry | 웨이크 오브 파이어 | 어쌔신 | 12 |
| 263 | Weapon Block | 웨폰 블록 | 어쌔신 | 12 |
| 264 | Cloak of Shadows | 클럭 오브 쉐도우 | 어쌔신 | 12 |
| 265 | Cobra Strike | 코브라 스트라이크 | 어쌔신 | 12 |
| 266 | Blade Fury | 블레이드 퓨리 | 어쌔신 | 18 |
| 267 | Fade | 페이드 | 어쌔신 | 18 |
| 268 | Shadow Warrior | 쉐도우 워리어 | 어쌔신 | 18 |
| 269 | Claws of Thunder | 클러 오브 선더 | 어쌔신 | 18 |
| 270 | Dragon Tail | 드래곤 테일 | 어쌔신 | 18 |
| 271 | Lightning Sentry | 라이트닝 센트리 | 어쌔신 | 24 |
| 272 | Inferno Sentry | 웨이크 오브 인페르노 | 어쌔신 | 24 |
| 273 | Mind Blast | 마인드 블래스트 | 어쌔신 | 24 |
| 274 | Blades of Ice | 블레이드 오브 아이스 | 어쌔신 | 24 |
| 275 | Dragon Flight | 드래곤 플라이트 | 어쌔신 | 24 |
| 276 | Death Sentry | 데쓰 센트리 | 어쌔신 | 30 |
| 277 | Blade Shield | 블레이드 실드 | 어쌔신 | 30 |
| 278 | Venom | 베넘 | 어쌔신 | 30 |
| 279 | Shadow Master | 쉐도우 마스터 | 어쌔신 | 30 |
| 280 | Royal Strike | 피닉스 스트라이크 | 어쌔신 | 30 |
| 281 | Wake Of Destruction Sentry |  |  |  |
| 282 | Imp Inferno |  |  |  |
| 283 | Imp Fireball |  |  |  |
| 284 | Baal Taunt |  |  |  |
| 285 | Baal Corpse Explode |  |  |  |
| 286 | Baal Monster Spawn |  |  |  |
| 287 | Catapult Charged Ball |  |  |  |
| 288 | Catapult Spike Ball |  |  |  |
| 289 | Suck Blood |  |  |  |
| 290 | Cry Help |  |  |  |
| 291 | Healing Vortex |  |  |  |
| 292 | Teleport 2 |  |  |  |
| 293 | Self-resurrect |  |  |  |
| 294 | Vine Attack |  |  |  |
| 295 | Overseer Whip |  |  |  |
| 296 | Barbs Aura |  |  |  |
| 297 | Wolverine Aura |  |  |  |
| 298 | Oak Sage Aura |  |  |  |
| 299 | Imp Fire Missile |  |  |  |
| 300 | Impregnate |  |  |  |
| 301 | Siege Beast Stomp |  |  |  |
| 302 | MinionSpawner |  |  |  |
| 303 | CatapultBlizzard |  |  |  |
| 304 | CatapultPlague |  |  |  |
| 305 | CatapultMeteor |  |  |  |
| 306 | BoltSentry |  |  |  |
| 307 | CorpseCycler |  |  |  |
| 308 | DeathMaul |  |  |  |
| 309 | Defense Curse |  |  |  |
| 310 | Blood Mana |  |  |  |
| 311 | mon inferno sentry |  |  |  |
| 312 | mon death sentry |  |  |  |
| 313 | sentry lightning |  |  |  |
| 314 | fenris rage |  |  |  |
| 315 | Baal Tentacle |  |  |  |
| 316 | Baal Nova |  |  |  |
| 317 | Baal Inferno |  |  |  |
| 318 | Baal Cold Missiles |  |  |  |
| 319 | MegademonInferno |  |  |  |
| 320 | EvilHutSpawner |  |  |  |
| 321 | CountessFirewall |  |  |  |
| 322 | ImpBolt |  |  |  |
| 323 | Horror Arctic Blast |  |  |  |
| 324 | death sentry ltng |  |  |  |
| 325 | VineCycler |  |  |  |
| 326 | BearSmite |  |  |  |
| 327 | Resurrect2 |  |  |  |
| 328 | BloodLordFrenzy |  |  |  |
| 329 | Baal Teleport |  |  |  |
| 330 | Imp Teleport |  |  |  |
| 331 | Baal Clone Teleport |  |  |  |
| 332 | ZakarumLightning |  |  |  |
| 333 | VampireMissile |  |  |  |
| 334 | MephistoMissile |  |  |  |
| 335 | DoomKnightMissile |  |  |  |
| 336 | RogueMissile |  |  |  |
| 337 | HydraMissile |  |  |  |
| 338 | NecromageMissile |  |  |  |
| 339 | MonBow |  |  |  |
| 340 | MonFireArrow |  |  |  |
| 341 | MonColdArrow |  |  |  |
| 342 | MonExplodingArrow |  |  |  |
| 343 | MonFreezingArrow |  |  |  |
| 344 | MonPowerStrike |  |  |  |
| 345 | SuccubusBolt |  |  |  |
| 346 | MephFrostNova |  |  |  |
| 347 | MonIceSpear |  |  |  |
| 348 | ShamanIce |  |  |  |
| 349 | Diablogeddon |  |  |  |
| 350 | Delerium Change |  |  |  |
| 351 | NihlathakCorpseExplosion |  |  |  |
| 352 | SerpentCharge |  |  |  |
| 353 | Trap Nova |  |  |  |
| 354 | UnHolyBoltEx |  |  |  |
| 355 | ShamanFireEx |  |  |  |
| 356 | Imp Fire Missile Ex |  |  |  |

## `me.getSkill` 인자

원본 그대로(사용자 자료).

```
me.getSkill(0) = Right(mana) slot skill name
me.getSkill(1) = Left(life) slot skill name
me.getSkill(2) = Right(mana) slot skill id
me.getSkill(3) = Left(life) slot skill id

me.getSkill(4) = all skills [id, hard point, total point]	*item charged skills count as hard points

me.getSkill(id, 0) = hard point
me.getSkill(id, 1) = total point (+item bonus)

[ex]
attack	0,1,1,
throw	2,1,1,
kick	1,1,1,
Scroll of Identify	217,1,1,
Book of Identify	218,1,1,
Scroll of Townportal	219,1,1,
Book of Townportal	220,1,1,
Unsummon	3,1,1,
Warmth	37,7,7,
Ice Bolt	39,1,1,
Frozen Armor	40,1,1,
Inferno	41,1,1,
Static Field	42,5,5,
Telekinesis	43,1,1,
Ice Blast	45,1,1,
Blaze	46,1,1,
Shiver Armor	50,1,1,
Fire Wall	51,12,12,
Teleport	54,1,1,
Enchant	52,0,1,	(+item bonus)
Chain Lightning	53,0,2, (+item bonus)
Frost Nova	44,1,1	(+item charged)
```

## `getSkillInfo(스킬 번호 또는 이름, 인덱스)` 인덱스

원본 그대로(kolbot 옛 sdk).

```
Usage:
returnvar = getSkillInfo([SkillID or SkillName], index);

0	Id
1	Name
2	ClassID
3	Monster
4	Enhanceable
5	CostMult
6	CostAdd
7	ClassReq
8	AttackRank
9	ItemClass1	String
10	ItemClass2	String
11	ItemClass3	String
12	ItemClass4	String
13	ItemClass5	String
14	ItemClass6	String
15	Anim		String
16	MonAnim		String
17	AnimID
18	MonAnimID
19	SeqNum
20	Durability
21	Shiver
22	unused
23	UseAttackRate
24	LineOfSight
25	ItemEffect
26	TargetableOnly
27	SearchEnemyXY
28	SearchMonsterNear
29	SelectDead
30	SearchOpenXY
31	TargetPet
32	TargetAlly
33	Range		String
34	RangeID
35	AttackNoMana
36	ReqLevel
37	ReqStr
38	ReqDex
39	ReqInt
40	ReqVit
41	ReqSkillId1
42	ReqSkillId2
43	ReqSkillId3
44	CasterState
45	unknown, always -1
46	IsAura
47	pReqSkill1	ptr
48	pReqSkill2	ptr
49	pReqSkill3	ptr
50	State1
51	State2
52	State3
53	Delay
54	SkillPage
55	SkillRow
56	SkillColumn
57	IconCell
58	LeftSkill
59	ManaShift
60	Mana
61	LvlMana
62	Interrupt
63	InTown
64	Periodic
65	Finishing
66	Passive
67	Param1
68	Param2
69	Param3
70	Param4
71	Param5
72	Param6
73	InGame
74	Open
75	Beta
76	unknown
77	unknown
78	unused
79	ToHit
80	LevToHit
81	HitShift
82	SrcDam
83	unused
84	unused
85	MinDam
86	MaxDam
87	LevDam1
88	LevDam2
89	LevDam3
90	EType
91	EMin
92	EMax
93	ELev1
94	ELev2
95	ELev3
96	ELen
97	ELevLen1
98	ELevLen2
99	ELevLen3
100	Proper Skill Name (Locale based)
101	Item Description (Locale based)
```
