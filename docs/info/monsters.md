# 몬스터 (spectype, 슈퍼유니크 프리셋 번호, 우버·횃불)

몬스터 종류 비트(spectype), 슈퍼유니크 프리셋 유닛 번호, 우버 디아블로·헬파이어 토치 절차 (261104).

- kolbot 사용처: `unit.spectype`(`Attack.js`: `spectype & 0x7`로 보스·챔피언 판단, `& 0x1`로 일반 보스 판단), `getPresetUnit`, `Attack.kill`, `Config.SkipException`
- 몬스터 classid·이름은 mpqdata `monstats.txt`(`Id`·`hcIdx`), 슈퍼유니크 번호는 `superuniques.txt`(`Superunique`·`hcIdx`), 몬스터 인챈트는 `monumod.txt`(`uniquemod`·`id`). 슈퍼유니크·액트 보스의 레벨·TC는 `tc.md`.

## spectype (`unit.spectype`)

- 출처: 사용자 자료 `spectype.png`(원본 표, 출처 표시 없음). 근거: **출처 불명**. 원본 그대로 옮겼다(16줄).
- 원본 열 이름 "monster types to kill" 그대로. 비트: 0x1 "Normal" Boss, 0x2 Champion, 0x4 Boss, 0x8 Minion.

| spectype | monster types to kill |
|---|---|
| 0x0 | all |
| 0x1 | "Normal" Boss |
| 0x2 | Champion |
| 0x3 | "Normal" Boss + Champion |
| 0x4 | Boss |
| 0x5 | "Normal" Boss + Boss |
| 0x6 | Champion + Boss |
| 0x7 | "Normal" Boss + Champion + Boss |
| 0x8 | Minion |
| 0x9 | "Normal" Boss + Minion |
| 0xA | Champion + Minion |
| 0xB | "Normal" Boss + Champion + Minion |
| 0xC | Boss + Minion |
| 0xD | "Normal" Boss + Boss + Minion |
| 0xE | Champion + Boss + Minion |
| 0xF | "Normal" Boss + Champion + Boss + Minion |

## 슈퍼유니크 프리셋 유닛 번호 (`getPresetUnit`)

- 출처: kolbot 옛 sdk `superunique_presetunitids.txt`(원본 머리말: "this list is correct to the best of my knowledge"). 근거: 웹 미검증. mpqdata에 없는 번호다.

| Id | Name |
|---|---|
| 250 | The Summoner |
| 704 | Bishibosh |
| 705 | Bonebreak |
| 706 | Coldcrow |
| 707 | Rakanishu |
| 708 | Treehead WoodFist |
| 709 | Griswold |
| 710 | The Countess |
| 711 | Pitspawn Fouldog |
| 712 | Flamespike the Crawler |
| 713 | Boneash |
| 714 | Radament |
| 715 | Bloodwitch the Wild |
| 716 | Fangskin |
| 717 | Beetleburst |
| 718 | Leatherarm |
| 719 | Coldworm the Burrower |
| 720 | Fire Eye |
| 721 | Dark Elder |
| 723 | Ancient Kaa the Soulless |
| 724 | The Smith |
| 725 | Web Mage the Burning |
| 726 | Witch Doctor Endugu |
| 727 | Stormtree |
| 728 | Sarina the Battlemaid |
| 729 | Icehawk Riftwing |
| 730 | Ismail Vilehand |
| 731 | Geleb Flamefinger |
| 732 | Bremm Sparkfist |
| 733 | Toorc Icefist |
| 734 | Wyand Voidfinger |
| 735 | Maffer Dragonhand |
| 736 | Winged Death |
| 737 | The Tormentor |
| 738 | Taintbreeder |
| 739 | Riftwraith the Cannibal |
| 740 | Infector of Souls |
| 741 | Lord De Seis |
| 742 | Grand Vizier of Chaos |
| 743 | The Cow King |
| 744 | Corpsefire |
| 745 | Hephasto (The Feature Creep) |
| 746 | Siege Boss |
| 747 | Ancient Barbarian 1 |
| 748 | Ancient Barbarian 2 |
| 749 | Ancient Barbarian 3 |
| 750 | Axe Dweller |
| 751 | Bonesaw Breaker |
| 752 | Dac Farren |
| 753 | Eldritch (Megaflow Rectifier) |
| 754 | Eyeback Unleashed |
| 755 | Threash Socket |
| 756 | Pindleskin |
| 757 | Snapchip Shatter |
| 758 | Anodized Elite |
| 759 | Vinvear Molech |
| 760 | Sharp Tooth Sayer |
| 761 | Magma Torquer |
| 762 | Blaze Ripper |
| 763 | Frozenstein |
| 764 | Nihlathak Boss |
| 765 | Baal Subject 1 |
| 766 | Baal Subject 2 |
| 767 | Baal Subject 3 |
| 768 | Baal Subject 4 |
| 769 | Baal Subject 5 |
| 772 | random boss pack? |
| 773 | random champ pack? |
| 774 | Flavie |
| 775 | Blood Raven |
| 778 | maggot queen (broken?) |
| 787 | flayers |
| 788 | flayer+shaman |
| 792 | ratmen |
| 793 | ratmen+shaman |
| 794 | demonimp pack |
| 796 | enslaved pack |
| 799 | dead enslaved |
| 800 | dead demonimp |
| 801 | dead barb |
| 802 | dead prowlingdead |

## 우버 디아블로 (애니힐러스)

- 출처: 카오스큐브 "클래식 전용 우버(애니참) 획득 정보"(글쓴이 Aliase, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941820). 근거: 웹 미검증. 원문 그대로(IP 확인 화면 그림 1장은 뺐다). Battle.net 기준 글이다.

== 우버디아란 ==

블리자드 사에서 수없이 복사된 조던의 수를 줄이기 위해 만든 하나의 이벤트입니다.
우버디아는 헬방에서 모든것이 이루어져야 합니다..
단 우버디아는 헬난이도에서 나오나 조던의 투척은 난이도와 상관없이 아이피만 동일한곳에서
투척해두됩니다

== 우버디아 소환 ==

마을에 있는 NPC(물건을 판매하는 모든 상점)에 조던을 판매합니다..
이때 조던 판매시 조던의 수는 랜덤이며 보통 80개~120개 정도면 우버디아가 출연합니다..
(NPC에 판매하는 조던의수는 랜덤입니다..더 많이 또는 더 적게 사용할수 있습니다..)
조던을 판매하고 있을때 '조던 XXXX개를 상점에 팔았습니다.' 라는 메시지가 나옵니다..
"디아블로가 이 땅을 배회하고 있다"라는 문구가 나올때까지 투척해야 합니다.
만약 조던투척후 조던 물량이 부족할때 같은 아이피 속한 다른방에서 조던을 이어서 판매 한다면 마찬가지로 이전 누적된 조던의 수와 합쳐져 우버디아를 소환할수 있습니다..

== 우버방 획득 ==

우선 우버방 획득은 우버 투척 아이피랑 동일해야 우버를 만날수 있습니다..

예)우버 투척방 아이피 끝자리 " 000 " 이라 가정

자신의 개설방 방 아이피 확인시 " 000 " 과 동일하다면 우버방 입니다..

기본적으로 아이피 세자리를 우버진행시 공개를 합니다...우버 진행시 불상사를 미연에 방지하고자
숫자 보다는 숫자위에 표기하고 있는 문자를 기재합니다..

예:숫자1 = ! , 숫자 = 5 % , 숫자 = 7 &

아이피 공개합니다 !%& 라고 표기 풀이하자면 157 입니다..

보통 우버이벤을 할 때 공개하는 아이피는 XXX.XXX.XX.OOO.4000 에서 제일 마지막의 "000"세자리숫자를 뜻합니다.
각 방에는 고유한 아이피가 있는데 일단 아시아 1 에서 나올 수 있는 아이피는 130~229 까지로 알고 있습니다.
한 아이피당 만들 수 있는 방의 개수는 200여개 정도로 알려져 있고 아이피 의 방이 전부
개설된 상황에서 방을 만들면 다른 아이피만 나오게 됩니다.우버는 한방에 한번만 가능합니다..

== 아이피 확인방법 ==

상단 샷 참조 (가장 기본적인 방법이며 다른 방법도 있음을 알려드립니다)

아이피를 확인할 수 방법을 알려드리자면 윈도우 하단 시작 클릭-\> 실행 클릭-\> command(아니면 cmd) 란
글자를 쓰고 확인-\>도스창이 뜨는데 거기서 netstat -na 또는 netstat라는 명령어를 치고 엔터-\>아이피 뒤에 4000이라는 숫자가 보이면 그 앞에 세자리숫자가 아이피입니다.
아이피는 방 개설할때마다 변합니다..이때 우버 공개 아이피랑 일치 하게 방을 지속적으로 개설하면 우버방을 획득할수 있습니다..

== 애니참이란 ==

우버디아를 사냥하신다면 유닉스몰참을 획득하게 됩니다..이것은 한캐릭에 한개씩만 소지 가능합니다..

옵션: 1모든스킬 ( 고정 )

10~20 모든 능력치 ( 변동 )

10~20 모든 저항력 ( 변동 )

5~10추가 경험치 ( 변동 )

== 우버디아 출연시 만날수 있는 장소 ==

-= 액트1 =-
덴오브이블의 불타는 시체
콜드플레인의 비쉬보쉬
스토니필드의 라키니슈
트리스트럼의 그리스월드
다크우드의 트리헤드 우드피스트
수도원안쪽의 본에쉬 등이 있으며,

-= 액트2 =-
하수도3층의 라다먼트
죽음의홀 3층 미치광이 블러드리치
클러바이퍼템플 2층 펭스킨 등이,

-= 액트3 =-
프레이어정글 출구의 스톰트리
폐허의사원의 베틀메이드 사리나
트라빈컬의 하이카운실
증오의사원3층의 하이카운실 등.

-= 액트4 =-
절망의 평원 이주얼
불길의강 대장장이 헤파스토
카오스 생츄어리 Grand Vizier of Chaos
Lord De Seis
Infector of Souls
디아블로

-= 액트5 =-
블러디풋힐의 쉥크 더 오버시어
블러디풋힐 닥 페런
프리지드 하이랜드의 엘드리치 더 렉터파이어
프리지드하이랜드 샤크투스 슬레이어
아리앗고원의 쓰레쉬 소켓
글레이셜트레일의 본에쉬
니라트하크사원 입구의 핀들스킨

## 헬파이어 토치 (클래식)

- 출처: 카오스큐브 "횃불(헬파이어토치) 획득 정보(클래식)"(글쓴이 Aga). 지금 주소(https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941636)는 서버 오류(500)라, 인터넷 아카이브 2023-09-25 사본(https://web.archive.org/web/20230925035821/https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941636)에서 가져왔다(261104). 근거: 웹 미검증. 원문 그대로.
- 횃불 지역 번호: 133~136 (mpqdata `levels.txt` `LevelName` Pandemonium Run 1~3, Tristram).

★ 유닉라지참 : 헬파이어 토치 획득 정보 총정리 Ver1.3★

지금까지 나온 유닉라지참 획득정보를 각 사이트 및 카오스큐브 회원들의 정보등을
토대로 정리를 하였습니다.
참고하시길 바랍니다.
아래의 사항은 정보수집으로 인한것이오니 완전하지는 않은 사실입니다.
다만 대부분의 내용이 정황상 일치하오니 참고하시기엔 부담이 없을듯 합니다.

1. 카운테스(액트1 블랙마쉬 포가튼 타워 5층)를 죽여서 Key of Terror(공포의키)를 얻습니다.
2. 소환술사(액트2 아케인생츄어리)를 죽여서 Key of Hatred(증오의키)를 얻습니다.
3. 나라하크(액트5 홀스 오브 보우트 : 나라하크사원 3층)를 죽여서 Key of Destruction(파괴의키)를 얻습니다.

세가지를 얻으신 후에 액트 5에 가셔서 큐브에 넣고 돌리시면
3가지의 포탈중에 하나가 랜덤으로 나온답니다

그 세가지의 포탈은 각각
감시자의포탈 - 이곳에 나타나는 몬스터 Lilith (릴리쓰)
잊혀진 사막 - 이곳에 나타나는 몬스터 Clone Duriel (듀리엘)
고통의 용광로 - 이곳에 나타나는 몬스터 Izual (이쥬얼)
이라고 합니다.

각 포탈에 위치한 세마리의 몬스터를 잡게되면

릴리쓰를 죽이면 Diablo's horn (디아블로의 뿔)
듀리엘을 죽이면 Baal's eye (바알의 눈)
이쥬얼을 죽이면 Mephisto's brain (메피스토의 뇌)
를 준다고 하네요.

이 세가지를 모두 얻은후에 액트5에서 조합을 하게 되면
새로운 붉은포탈이 열리고 그 포탈안에 들어가서 바알, 메피, 디아블로를 죽이게 되면
마지막 잡은 보스몹에서 새로운 아이템(유닉 라지참 : 헬파이어 토치)를 얻을수 있습니다.

유닉라지참 : 헬파이어 토치
25% 확율로 레벨 25 파이어 스톰 시전 (공격시)
+3 (각 계열 캐릭터중 하나) 모든 스킬 증가
+10-20 모든 능력치 (변함)
+10-20% 모든 저항력 (변함)
+8 시야 증가
레벨 30 히드라 (10/10 차지)

★ 각종 Tip 정리 ★
1. 키 1세트(공포,증오,파괴)를 가지고 포탈을 열면 세가지 포탈(감시자의포탈,잊혀진사막,고통의용광로)중
한개가 랜덤으로 열립니다.
3세트를 가지고 있을때 한방에서 한번씩 포탈을 열게되면 중복된 포탈이 나올수 있습니다.
그러한 관계로 한방에서 3세트를 가지고 3번 포탈을 열면 각기 다른 세가지 포탈이 나옵니다.

2. 위에 1번 Tip에서 세가지 포탈을 열때 한자리에서 세번 포탈을 열면 포탈이 겹칠수도 있사오니
약간의 자리이동을 하셔서 3개의 포탈을 열면 포탈이 겹치지 않습니다.

3. 이주얼은 매직데미지 이뮨으로 햄딘이 잘 통하지 않습니다. 슴딘이나 강타세팅을 한 전사캐릭으로
사냥하는것이 좋습니다.

4. 메피스토의 경우에는 컨빅션오라를 켜고 소환을 하므로 누적레지를 많이 맞추시거나
셀베이션 오라를 켠 팔라를 대동하고 간다면 쉽게 사냥을 할 수 있습니다.

★ 각종 질문들 정리 ★

Q : 열쇠는 거래창에 올려지나요?
A : 거래창에 올릴 수 있습니다.

Q : 유닉참은 거래창에 올려지나요?
A : 거래창에 올릴 수 있습니다.

Q : 유닉참은 플레이어당 1개를 가질수 있나요?
A : 애니참과 마찬가지로 플레이어당 1개를 가질수 있습니다.

Q : 소환술사, 나라하크, 카운테스가 열쇠를 안주는데요?
A : 각각의 몬스터가 무조건 열쇠를 주는것은 아닙니다.
일정확률(지금까지 알려진것은 1/34)로 열쇠를 떨굽니다.
간혹 2개가 동시에 떨어지는 경우도 있습니다.

Q : 유닉참은 래더만 되나요?
A : 스탠/래더 구분없이 된다고 합니다.

Q : 노멀/나이트/헬에서 다 되나요?
A : 헬 엑트5에서만 가능합니다.
