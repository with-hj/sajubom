/* 천령당 — 종합운세 : 신년운세 · 평생사주 (v68 전면 개편)
   원칙
   1) 사주를 한 번도 배운 적 없는 사람이 읽어도 막히지 않게 쓴다. 어려운 용어는 쓰지 않는다.
   2) 장마다 첫 문장은 ‘읽고 싶게 만드는 한 줄’로 연다.
   3) 신년운세는 2027년 1월부터 12월까지 한 해 전체를 보여준다(11월에 끊기지 않게). */
(function(){
'use strict';
var C=window.CH, S=C.S;
var EL_KO=S.EL_KO;
var P=C.P,H=C.H,UL=C.UL,K=C.K,elB=C.elB,stemB=C.stemB,brB=C.brB,bj=C.bj,sj=C.sj,bp=C.bp,sp=C.sp;
var pillars=C.pillars, elMeter=C.elMeter, godTable=C.godTable, daeunTable=C.daeunTable;
var gaewunBlock=C.gaewunBlock, risky=C.riskyMonthsText, yearOfStar=C.yearOfStar, pillarDetail=C.pillarDetail, facts=C.facts;
window.CTP=window.CTP||{};

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
var NY=2027;                                  /* 신년운세가 다루는 해 */
function D(R){ return S.deep(R); }
function elK(i){ return S.EL_KO[i]+'('+S.EL_HAN[i]+')'; }
function n2(n){ return n<10?'0'+n:''+n; }
function by(w,p){ return w+S.josaP(w,p||'이가'); }
/* 오행 이름을 생활의 말로 한 번 더 풀어준다 */
var EL_WORD=['나무','불','흙','쇠','물'];
var EL_LIFE=[
  '새로 시작하고 자라나는 힘','드러내고 데우는 힘','담고 품는 힘','끊고 맺는 힘','스며들고 모으는 힘'];

/* 그해의 달을 조건으로 고르기 */
function months2027(R,pred){
  var out=[];
  for(var m=1;m<=12;m++){
    var r=S.monthRead(R,NY,m), mp=S.monthPillarOf(NY,m);
    if(!pred||pred(r,mp,m)) out.push({m:m,r:r,mp:mp});
  }
  return out;
}
function monthChips(list){
  if(!list.length) return '<p>2027년에는 이 조건에 꼭 맞는 달이 없습니다. 달보다 분기의 흐름으로 보세요.</p>';
  return '<p>'+list.map(function(x){ return '<b>'+x.m+'월</b>'; }).join(' · ')+'</p>';
}
function monthRows(list,cols){
  var h='<table class="tbl"><tr><th>달</th><th>간지</th><th>이 달에 할 일</th></tr>';
  list.forEach(function(x){
    var r=x.r;
    h+='<tr><td><b>'+NY+'.'+n2(x.m)+'</b></td><td>'+r.gz+'</td><td style="font-size:13px">'+(cols?cols(x):monthTip(r))+'</td></tr>';
  });
  return h+'</table>';
}
/* 해설 문장을 우리말로 직접 쓴다 — 계산 결과의 설명문에는 어려운 말이 섞여 있다 */
function plainYearWhy(R,r){
  var rel=r.rels.map(function(x){ return x.pos; }).join('·');
  var t=r.rels.map(function(x){ return x.type; }).join('·');
  var bits=[];
  bits.push(NY+'년의 글자 '+r.gz+'은(는) 당신의 '+r.g+' 자리로 들어옵니다. '+(S.SEUN_DEEP[r.g]||''));
  if(r.rels.length) bits.push('네 기둥과는 '+rel+'에서 '+t+'으로 만나, 그 자리의 일이 눈에 띄게 움직입니다.');
  else bits.push('네 기둥과 크게 부딪히지도 얽히지도 않아, 평소의 흐름이 그대로 이어집니다.');
  if(r.yong) bits.push('이 해에는 당신에게 힘이 되는 기운이 직접 들어옵니다. 미뤄둔 일이 풀리는 쪽으로 쓰세요.');
  else if(r.gi) bits.push('이 해에는 조심할 기운이 함께 들어옵니다. 벌이기보다 지키는 쪽이 오래 남습니다.');
  else bits.push('힘이 되는 기운도 조심할 기운도 크게 겹치지 않아, 무엇을 심느냐가 그대로 결과가 됩니다.');
  if(r.isGong) bits.push('약속과 문서가 늦어지기 쉬운 자리라, 구두 약속은 꼭 기록으로 남기세요.');
  return bits.join(' ');
}
function monthTip(r){
  if(r.tone==='open') return '밀어도 되는 달 — 계약·제안·면접·고백';
  if(r.tone==='hold') return '미루는 달 — 큰 결제와 큰 결정은 다음 달로';
  return '오르내리는 달 — 하나만 잡고 나머지는 흘려보내기';
}

/* ================================================================
   신년운세 ① 나의 오행
   ================================================================ */
function nyElem(R,c,input,name){
  var dd=D(R);
  var h='';
  h+=H('다섯 기운의 무게');
  h+='<p>많이 가진 쪽은 잘 쓰면 무기가 되고, 모자란 쪽은 몸이 먼저 알려줍니다. '+esc(name)+' 님의 여덟 글자는 '+elB(c.mostI)+S.josaP(EL_KO[c.mostI],'이가')+' 가장 두텁고('+R.pct[c.mostI].toFixed(1)+'%), '+elB(c.leastI)+S.josaP(EL_KO[c.leastI],'이가')+' 가장 얇습니다('+R.pct[c.leastI].toFixed(1)+'%).</p>';
  h+=elMeter(R);
  h+=H('가장 두터운 기운 — '+EL_KO[c.mostI]+'('+S.EL_HAN[c.mostI]+')');
  h+='<p>'+S.EL_DEEP[c.mostI].over+'</p>';
  h+='<p>이 기운은 '+EL_WORD[c.mostI]+'의 결, 곧 <b>'+EL_LIFE[c.mostI]+'</b>입니다. 많이 가졌다는 것은 늘 쓸 수 있다는 뜻이고, 동시에 <b>쓰지 못하면 안에서 쌓인다</b>는 뜻입니다.</p>';
  h+=H('가장 얇은 기운 — '+EL_KO[c.leastI]+'('+S.EL_HAN[c.leastI]+')');
  h+='<p>'+S.EL_DEEP[c.leastI].under+'</p>';
  h+='<p>그래서 '+S.EL_DEEP[c.leastI].part+' 쪽이 먼저 피곤해집니다. 이건 타고난 약점이 아니라 <b>평생 조금씩 채워야 하는 자리</b>입니다.</p>';
  h+=H('그래서 이 사람은 어떤 사람인가');
  h+='<p>기운의 균형을 생활의 말로 바꾸면 이렇습니다. '+S.STRENGTH_TXT[R.strength].out+'</p>';
  h+='<p>'+S.DAY_MASTER[R.dStem][0]+' — 이것이 이 사주의 바탕입니다. '+S.ILJU[R.dIdx][1]+'</p>';
  h+=H('2027년에 채우면 좋은 것');
  h+='<p>'+EL_KO[c.yongEl]+'('+S.EL_HAN[c.yongEl]+') 기운입니다. 거창한 의식이 아니라, '+S.EL_DEEP[c.yongEl].habit+' 같은 하루의 습관입니다. 색은 '+S.EL_DEEP[c.yongEl].color+', 방향은 '+S.EL_DEEP[c.yongEl].dir+' 쪽이 편합니다.</p>';
  h+='<table class="tbl"><tr><th>항목</th><th>2027년에 채울 것</th></tr>'+
     '<tr><td>색</td><td>'+S.EL_DEEP[c.yongEl].color+'</td></tr>'+
     '<tr><td>방향</td><td>'+S.EL_DEEP[c.yongEl].dir+'</td></tr>'+
     '<tr><td>생활</td><td>'+S.EL_DEEP[c.yongEl].habit+'</td></tr>'+
     '<tr><td>먹는 것</td><td>'+S.EL_DEEP[c.yongEl].food+' · '+S.EL_DEEP[c.yongEl].taste+'</td></tr></table>';
  h+=K('한 줄','많이 가진 기운은 <b>밖으로 쓰고</b>, 모자란 기운은 <b>매일 조금씩 채웁니다.</b> 이 두 문장이 2027년의 기본입니다.');
  return h;
}

/* ================================================================
   신년운세 ② 인간 관계
   ================================================================ */
function nyPeople(R,c,input,name){
  var dd=D(R);
  var h='';
  h+='<p>사람에게 지치는 방식은 사람마다 다릅니다. 당신이 어떤 자리에서 말수가 줄어드는지, 여덟 글자는 그 장면을 정확히 기억하고 있습니다.</p>';
  h+=H('이 사주가 사람을 대하는 기본값');
  h+='<p>중심이 되는 기운은 <b>'+c.topGrp+'</b>입니다. '+S.GROUP_MEAN[c.topGrp]+' 그래서 사람을 사귈 때도 이 방식이 먼저 나옵니다. '+S.GOD_KEY[c.topGodInGrp]+'의 방식으로 다가가고, 그 방식이 통하지 않는 자리에서는 서둘러 문을 닫습니다.</p>';
  h+='<p>'+S.DM_DEEP[R.dStem].out+' '+S.DM_DEEP[R.dStem].in+'</p>';
  h+=H('곁에 있으면 편해지는 사람');
  h+='<p>'+S.EL_PERSON[c.yongEl]+' — 이 사주는 이 결을 가진 사람 곁에서 어깨의 힘이 빠집니다. 직업이나 나이가 아니라 <b>말의 속도와 온도</b>가 맞는 사람입니다. '+S.EL_DEEP[c.yongEl].dir+' 방향의 모임, '+S.EL_DEEP[c.yongEl].color+' 계열의 공간에서 이런 사람을 만날 확률이 높습니다.</p>';
  h+=H('부딪히는 지점');
  h+='<p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>';
  h+='<p>이 감정이 올라올 때 대부분의 사람은 상대를 바꾸려 합니다. 이 사주에게 맞는 방법은 반대입니다. <b>그 자리를 잠깐 떠나 말의 속도를 늦추는 것</b> — 한 번의 침묵이 관계를 오래 살립니다.</p>';
  h+=H('사람에게 주는 것, 사람에게 바라는 것');
  h+='<ul><li><b>주는 것</b> — '+S.ENV_BY_EL[R.dayEl]+'에서 자연스러워집니다. 사람들은 이 곁에서 자기 속도를 인정받는 느낌을 받습니다.</li>'+
     '<li><b>바라는 것</b> — '+S.GOD_KEY[c.topGodInGrp]+'을 당연하게 여겨주는 것. 이 부분이 무시당하면 조용히 거리를 둡니다.</li></ul>';
  h+=H('2027년, 사람이 들어오는 달');
  var good=months2027(R,function(r){ return r.rels&&r.rels.some(function(x){return x.type==='육합'||x.type==='삼합';}); });
  h+=monthChips(good);
  h+='<p>이 달들은 누군가를 소개받거나, 오래 연락이 없던 사람에게 먼저 말을 거는 데 좋습니다. 반대로 일지와 부딪히는 달에는 새 약속을 잡지 않는 편이 낫습니다.</p>';
  h+=H('2027년에 조심할 관계의 장면');
  var bad=months2027(R,function(r){ return r.tone==='hold'; });
  h+=monthChips(bad);
  h+='<p>이 달에는 말이 세지고, 사소한 것이 오래 남습니다. 중요한 대화는 하루만 미뤄도 절반이 해결됩니다.</p>';
  h+=K('한 줄','이 사주의 인연은 <b>많은 사람</b>이 아니라 <b>말이 통하는 한두 사람</b>에서 깊어집니다.');
  return h;
}

/* ================================================================
   신년운세 ③ 평생의 큰 흐름
   ================================================================ */
function nyFlow(R,c,input,name){
  var cur=R.daeun[R.curDaeun];
  var curG=S.tenGod(R.dStem,cur.idx%10);
  var best=S.bestDaeun(R,c);
  var h='';
  h+='<p>인생은 노력의 총합이라기보다, 판이 바뀌는 때를 알아채는 일에 가깝습니다. 10년마다 문이 열리고 닫히는 자리를 한눈에 펼쳐 놓았습니다.</p>';
  h+=H('지금 서 있는 자리');
  h+='<p>지금은 <b>'+cur.from+'~'+cur.to+'세</b>의 10년, 그중 <b>'+(R.age-cur.from+1)+'년 차</b>입니다. 이 10년의 성격은 <b>'+curG+'</b> — '+(S.GOD_DAEUN[curG]||'')+'</p>';
  h+='<p>'+((R.age-cur.from+1)<=2?'아직 새 판에 자리를 잡는 초반입니다. 크게 벌이기보다 기반을 만드는 쪽이 남습니다.':((R.age-cur.from+1)>=7?'후반부입니다. 다음 판을 준비하면서 마무리를 정리할 때입니다.':'중반입니다. 이 10년의 재료를 가장 잘 쓸 수 있는 구간입니다.'))+'</p>';
  h+=H('아홉 번의 10년');
  h+='<p>나이와 함께 놓았습니다. 지금 구간만 진하게 표시되어 있습니다.</p>';
  h+=daeunTable(R,c);
  h+=H('가장 힘이 실리는 10년');
  h+='<p><b>'+R.daeun[best.i].from+'~'+R.daeun[best.i].to+'세</b>입니다. '+(S.GOD_DAEUN[S.tenGod(R.dStem,R.daeun[best.i].idx%10)]||'')+' 이때 무엇을 심어두는지가 그 뒤 10년을 바꿉니다.</p>';
  h+=H('다음 문은 언제 열리는가');
  var nx=R.daeun[R.curDaeun+1];
  if(nx){
    h+='<p>다음 10년은 <b>'+nx.from+'세</b>부터입니다. 실제 변화는 <b>'+(nx.from-2)+'~'+(nx.from+2)+'세</b>에 걸쳐 천천히 옵니다. 그래서 지금부터 그 자리에 필요한 것을 하나씩 준비해두면, 문이 열릴 때 밀지 않아도 들어갑니다.</p>';
  } else {
    h+='<p>지금 구간이 마지막 10년입니다. 이후는 해마다의 흐름과 매일의 선택으로 읽습니다.</p>';
  }
  h+=K('한 줄','10년은 <b>문이 열리는 시기</b>를 알려줄 뿐, 그 문을 지나가는 것은 매일의 선택입니다.');
  return h;
}

/* ================================================================
   신년운세 ④ 다가오는 한 해의 문 (무료는 여기까지)
   ================================================================ */
function nyDoor(R,c,input,name){
  var r=S.yearRead(R,NY);
  var toneLine=(r.tone==='open'
    ? '미뤄둔 것을 꺼내고 문을 두드리기 좋은 해입니다. 이 해에 시작한 일은 내년의 재료가 됩니다.'
    : (r.tone==='hold'?'벌이기보다 지키는 해입니다. 새 계약·새 대출·새 판은 다음 해로 미루는 편이 낫습니다.':'되는 일과 막히는 일이 번갈아 오는 해입니다. 한 번에 하나만 잡으세요.'));
  var h='';
  h+='<p>2027년 정미년. 누군가에게는 준비의 해, 누군가에게는 문이 열리는 해입니다. 당신의 2027년이 어느 쪽인지, 달마다 짚어드립니다.</p>';
  h+='<p>'+plainYearWhy(R,r)+'</p>';
  h+='<p>그래서 2027년은 <b>'+r.short+'</b>입니다. '+toneLine+'</p>';
  h+=H('이 해의 성격 — '+r.gz);
  h+='<p>2027년의 하늘은 <b>'+r.gz+'</b>입니다. 당신의 여덟 글자와 만나면 <b>'+r.g+'</b> 자리가 됩니다. '+(S.SEUN_DEEP[r.g]||'')+'</p>';
  h+='<p>'+S.SEUN_EL[S.BR_EL[r.branch]]+'</p>';
  h+=H('2026년 남은 두 달은 어떻게 쓰나');
  var rest='', nowY=new Date().getFullYear(), nowM=new Date().getMonth()+1;
  if(nowY<NY){
    for(var m=nowM;m<=12;m++){
      var mr=S.monthRead(R,nowY,m);
      rest+='<tr><td><b>'+nowY+'.'+n2(m)+'</b></td><td>'+mr.gz+'</td><td style="font-size:13px">'+monthTip(mr)+'</td></tr>';
    }
  }
  if(rest){
    h+='<p>2027년을 맞기 전, 남은 달은 <b>비우는 시간</b>으로 쓰면 좋습니다. 새로 벌이기보다 정리하고, 미뤄둔 결정 하나를 끝내세요.</p>';
    h+='<table class="tbl"><tr><th>달</th><th>간지</th><th>이 달에 할 일</th></tr>'+rest+'</table>';
  }
  h+=H('2027년, 어디에 문이 열리는가');
  var nyG=S.tenGod(R.dStem,S.mod(NY-4,60)%10), nyGrp=S.GOD_GROUP[nyG];
  var AREA=[['돈','재성','수입과 계약'],['일·자리','관성','직장과 책임'],['표현·재능','식상','만들고 알리는 일'],['문서·집','인성','계약·등기·공부']];
  h+='<table class="tbl"><tr><th>영역</th><th>2027년의 결</th></tr>';
  AREA.forEach(function(a){
    h+='<tr><td><b>'+a[0]+'</b></td><td style="font-size:13px">'+(nyGrp===a[1]?'<b>이 해의 중심</b>입니다. '+a[2]+'에서 실제 일이 생깁니다.':'중심은 아니지만, 달마다 문이 열리는 때가 있습니다.')+'</td></tr>';
  });
  h+='</table>';
  h+='<p>2027년의 중심은 <b>'+(nyGrp==='재성'?'돈':(nyGrp==='관성'?'일과 자리':(nyGrp==='식상'?'표현과 재능':(nyGrp==='인성'?'배움과 문서':'나와 동료'))))+'</b>입니다. 그래서 아래에서 돈·일·사랑·몸을 하나씩, 달까지 짚어드립니다.</p>';
  h+=K('2027년의 한 줄','<b>'+S.SEUN_KEY[r.g]+'</b>의 해 — 이 방향에 얹히는 선택이 힘을 받습니다.');
  return h;
}

/* ================================================================
   신년운세 ⑤ 올해의 돈
   ================================================================ */
function nyMoney(R,c,input,name){
  var dd=D(R);
  var jaeCnt=(c.gc['정재']||0)+(c.gc['편재']||0);
  var h='';
  h+='<p>돈은 벌이는 크기보다 <b>들어오는 달에 무엇을 하느냐</b>로 갈립니다. 2027년에 통장이 두꺼워지는 달과 얇아지는 달을 갈라 놓았습니다.</p>';
  h+=H('이 사주의 돈그릇');
  h+='<p>돈의 기운은 <b>'+jaeCnt+'개</b>입니다. '+(jaeCnt>=3?'돈이 눈에 잘 들어오고 실제로 손에 쥐는 편입니다. 반대로 씀씀이도 큽니다.':(jaeCnt>=1?'버는 힘과 지키는 힘이 반반입니다. 구조를 만들면 남습니다.':'현금이 크게 도는 편은 아닙니다. 대신 사람과 실력이 재산이 되는 구조입니다.'))+'</p>';
  h+='<p>'+(S.WEALTH_VESSEL_GOD[c.topGodInGrp]||'성실함이 그대로 재산이 되는 구조입니다.')+'</p>';
  h+=H('2027년에 돈이 들어오는 달');
  var inc=months2027(R,function(r){ return S.GOD_GROUP[r.g]==='재성'; });
  h+=monthChips(inc);
  h+='<p>이 달에는 계약·정산·영업처럼 <b>숫자가 오가는 일</b>을 몰아넣으세요. 같은 노력이 두 배로 남는 때입니다.</p>';
  h+=H('돈이 새는 달');
  var leak=months2027(R,function(r){ return r.tone==='hold'; });
  h+=monthChips(leak);
  h+='<p>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'사람을 통한 지출')+' 이 달에 특히 커집니다. 큰 결제는 2주만 미뤄도 절반은 사지 않습니다.</p>';
  h+=H('2027년 돈 달력');
  h+=monthRows(months2027(R,function(r){ return S.GOD_GROUP[r.g]==='재성'||r.tone!=='hold'; }).slice(0,8));
  h+=K('한 줄','수입이 들어온 날 <b>절반</b>을 먼저 떼어두는 규칙 하나면 2027년은 남습니다.');
  return h;
}

/* ================================================================
   신년운세 ⑥ 일과 자리
   ================================================================ */
function nyWork(R,c,input,name){
  var cm=S.careerMap(R);
  var h='';
  h+='<p>올해 자리를 옮겨야 하는 사람과, 지금 자리에서 한 칸 올라가야 하는 사람이 있습니다. 2027년의 당신이 어느 쪽인지 봅시다.</p>';
  h+=H('맞는 일의 방향');
  h+='<p>'+cm.why+'</p>';
  h+='<ul>'+cm.roles.slice(0,4).map(function(x,i){ return '<li>'+(i===0?'<b>'+x+'</b>':x)+'</li>'; }).join('')+'</ul>';
  h+='<p>이 중 하나가 지금 하는 일과 겹친다면, 2027년은 그 일을 <b>더 깊게</b> 파는 해입니다. 겹치지 않는다면 옮길 준비를 하는 해입니다.</p>';
  h+=H('2027년, 자리가 움직이는 때');
  var gw=months2027(R,function(r){ return S.GOD_GROUP[r.g]==='관성'; });
  var years=yearOfStar(R,'관성');
  h+='<p>'+(years.length?'자리와 책임의 기운이 해로 들어오는 때는 <b>'+years.slice(0,3).map(function(x){return x.y+'년';}).join(', ')+'</b>입니다. ':'앞으로 몇 해는 자리보다 실력으로 평가받는 시기입니다. ')+'그중 2027년은 아래 달에 힘이 실립니다.</p>';
  h+=monthChips(gw);
  h+='<p>이 달에 면접·발표·승진 요청·계약을 잡으세요. 반대로 부딪히는 달에는 퇴사나 이직을 결의하지 않는 편이 낫습니다. 결정은 감정이 아니라 숫자로 — 생활비 6개월, 다음 자리에서 내가 쓰일 자리, 옮기는 이유 세 줄.</p>';
  h+=H('2027년에 남길 것');
  h+='<p>이 사주는 <b>기록</b>이 남을 때 다음 자리로 이어집니다. 올해 만든 결과 하나를 문서·숫자·후기 중 하나로 남기세요. 그것이 내년의 연봉이 됩니다.</p>';
  h+=K('한 줄','2027년의 일은 <b>옮기는 해</b>가 아니라 <b>값을 매기는 해</b>로 쓰면 좋습니다.');
  return h;
}

/* ================================================================
   신년운세 ⑦ 사랑과 가족
   ================================================================ */
function nyLove(R,c,input,name){
  var dd=D(R);
  var marry=C.marryOf(input), kid=C.kidOf(input);
  var h='';
  h+='<p>마음이 움직이는 데도 계절이 있습니다. 2027년에 사람이 들어오는 달, 말이 어긋나는 달을 미리 알고 가면 훨씬 덜 다칩니다.</p>';
  h+=H('이 사주의 사랑 방식');
  h+='<p>배우자 자리인 일지 '+bj(R.dBranch,'은는')+' <b>'+S.SPOUSE[R.dBranch]+'</b>을 가리킵니다. '+S.BR_INNER[R.dBranch]+'</p>';
  h+='<p>끌리는 사람은 '+S.LOVE_ATTRACT[R.dayEl]+'</p>';
  h+='<p>오래 가는 사람은 '+S.LOVE_FIT[R.dayEl]+'</p>';
  h+=H('2027년, 사람이 들어오는 달');
  var open=months2027(R,function(r){ return r.rels&&r.rels.some(function(x){return x.type==='육합'||x.type==='삼합';}); });
  h+=monthChips(open);
  h+='<p>'+(marry==='single'?'아직 혼자라면 이 달에 나가 있는 것이 좋습니다. 소개·모임·전시·수업 — 사람이 있는 자리에 몸을 두세요.':(marry==='dating'?'지금 만나는 사람과 관계를 한 단계 옮기기 좋은 달입니다. 말로 확인하는 쪽이 오래 갑니다.':'배우자와의 사이에서 오해가 풀리는 달입니다. 미뤄둔 이야기를 이 달에 꺼내세요.'))+'</p>';
  h+=H('말이 어긋나는 달');
  var shut=months2027(R,function(r){ return r.tone==='hold'; });
  h+=monthChips(shut);
  h+='<p>이 달에는 같은 말도 세게 들립니다. 중요한 대화는 하루 뒤로 미루고, 그 대신 짧은 안부를 먼저 보내세요.</p>';
  if(kid==='plan'||kid==='none'){
    h+=H('아이를 생각하고 있다면');
    h+='<p>2027년은 <b>몸을 먼저 세우는 해</b>로 쓰면 좋습니다. 잠드는 시간을 고정하고, '+S.EL_DEEP[c.yongEl].food+' 쪽으로 한 끼를 바꾸세요. 시기는 하늘이 정하지만 몸의 리듬은 오늘 정할 수 있습니다. (사주는 임신·출산을 진단하지 않습니다. 계획은 산부인과 상담이 먼저입니다.)</p>';
  }
  h+=K('한 줄','2027년의 인연은 <b>먼저 말을 거는 쪽</b>이 가져갑니다. 이 사주는 표현이 반 박자 늦습니다.');
  return h;
}

/* ================================================================
   신년운세 ⑧ 몸과 마음
   ================================================================ */
function nyHealth(R,c,input,name){
  var dd=D(R);
  var h='';
  h+='<p>몸은 가장 먼저, 가장 조용히 신호를 보냅니다. 2027년에 유난히 피곤해지는 달과, 회복이 빨리 오는 달입니다.</p>';
  h+=H('먼저 지치는 자리');
  h+='<p>가장 얇은 기운은 '+elB(c.leastI)+'입니다. '+S.EL_DEEP[c.leastI].under+' 그래서 <b>'+S.EL_DEEP[c.leastI].part+'</b> 쪽이 먼저 알려옵니다.</p>';
  h+='<p>넘치는 기운은 '+elB(c.mostI)+'입니다. '+S.EL_DEEP[c.mostI].part+' 쪽은 반대로 과열되기 쉽습니다.</p>';
  h+=H('2027년 몸이 흔들리는 달');
  var bad=months2027(R,function(r){ return r.tone==='hold'; });
  h+=monthChips(bad);
  h+='<p>이 달에는 일정을 20% 비워두세요. 잠과 식사를 먼저 고정하면 절반은 지나갑니다.</p>';
  h+=H('회복이 빨리 오는 달');
  var good=months2027(R,function(r){ return r.tone==='open'; });
  h+=monthChips(good);
  h+='<p>검진·치료·운동을 시작하기 좋은 달입니다. 미뤄둔 병원 예약을 이 달에 잡으세요.</p>';
  h+=H('2027년의 몸 습관');
  h+='<ul><li>잠드는 시간 고정 — 이 사주는 수면이 가장 약한 고리입니다.</li>'+
     '<li>'+S.EL_DEEP[c.yongEl].habit+'</li>'+
     '<li>'+S.EL_DEEP[c.yongEl].food+' 주 3회, '+S.EL_DEEP[c.leastI].taste+'은 줄이기</li></ul>';
  h+='<p class="hint">사주는 몸의 리듬을 보여줄 뿐, 병을 진단하지 않습니다. 증상이 있으면 병원이 먼저입니다.</p>';
  h+=K('한 줄','2027년의 건강은 <b>잠드는 시간</b> 하나로 절반이 결정됩니다.');
  return h;
}

/* ================================================================
   신년운세 ⑨ 열두 달
   ================================================================ */
function nyMonths(R,c,input,name){
  var h='';
  h+='<p>같은 1월이라도 사람마다 다른 문이 열립니다. 2027년 1월부터 12월까지, 당신의 달력에만 찍히는 표시입니다.</p>';
  h+='<p>2027년은 <b>'+S.yearRead(R,NY).gz+'</b>의 해입니다. 아래 표에서 <b>밀어도 되는 달</b>에 중요한 일을 몰고, <b>미루는 달</b>은 비워두세요.</p>';
  h+='<table class="tbl"><tr><th>달</th><th>간지</th><th>이 달의 결</th><th>할 일</th></tr>';
  for(var m=1;m<=12;m++){
    var r=S.monthRead(R,NY,m);
    h+='<tr><td><b>'+NY+'.'+n2(m)+'</b></td><td>'+r.gz+'</td><td style="font-size:12.5px">'+r.g+'</td><td style="font-size:12.5px">'+monthTip(r)+'</td></tr>';
  }
  h+='</table>';
  h+=H('분기로 묶어 보면');
  h+='<p><b>1~3월</b>은 비우고 정리하는 때, <b>4~6월</b>은 시작하는 때, <b>7~9월</b>은 지키는 때, <b>10~12월</b>은 거두는 때입니다. 이 순서만 지켜도 한 해가 덜 흔들립니다.</p>';
  h+=K('한 줄','문이 열린 달에 <b>밀고</b>, 닫힌 달에 <b>쉬는 것</b> — 그것이 운을 쓰는 방법입니다.');
  return h;
}

/* ================================================================
   신년운세 ⑩ 2027년 실천 가이드
   ================================================================ */
function nyGuide(R,c,input,name){
  var d=S.EL_DEEP[c.yongEl];
  var h='';
  h+='<p>읽은 것으로는 아무것도 바뀌지 않습니다. 서른 날 동안, 하루 하나씩. 아래는 2027년에 실제로 해볼 만한 순서입니다.</p>';
  h+=H('1주 — 관찰');
  h+='<p>아무것도 바꾸지 않습니다. 아침에 눈뜨자마자 몸의 상태를 세 단어로 적고, 저녁에 “오늘 기운이 가장 오래 간 시간”을 한 줄로 남기세요. 일주일이면 내가 어디서 지치는지 보입니다.</p>';
  h+=H('2주 — 하나만 바꾸기');
  h+='<p>'+elK(c.yongEl)+' 기운을 채우는 일 하나. 새로 사지 말고 있던 것의 자리를 옮기는 것으로 시작하세요 — '+d.space+'. 식탁에 '+d.food+'를 한 번 올려보고 몸의 반응만 확인하면 충분합니다.</p>';
  h+=H('3주 — 경계 세우기');
  h+='<p>이 사주의 무기인 '+S.GOD_KEY[c.topGodInGrp]+'은 과해지기 쉬운 자리이기도 합니다. 이번 주에는 <b>거절 한 번, 결정 미루기 한 번</b>을 일부러 해보세요. 미루는 연습은 게으름이 아니라 판단을 정확하게 만드는 일입니다.</p>';
  h+=H('4주 — 다시 읽기');
  h+='<p>1주에 적은 세 단어를 다시 펼쳐보세요. 같은 조건에서 몸이 편해졌다면 그 선택이 맞는 것이고, 오히려 무거워졌다면 다른 장을 다시 읽을 때입니다.</p>';
  h+=H('2027년에 남길 세 가지');
  h+='<ul><li><b>돈</b> — 수입일 절반 먼저 떼어두기</li><li><b>일</b> — 결과 하나를 문서로 남기기</li><li><b>몸</b> — 잠드는 시간 고정하기</li></ul>';
  h+=K('한 줄','결심은 약하고 <b>순서</b>는 강합니다. 2027년은 순서로 이기는 해입니다.');
  return h;
}

/* ================================================================
   평생사주
   ================================================================ */
function life1(R,c,input,name){
  var dd=D(R);
  var h=facts(R);
  h='<p>태어난 날의 여덟 글자는 바뀌지 않습니다. 그래서 이 장은 “올해 어떻게 될까”가 아니라 <b>“나는 어떤 사람인가”</b>를 끝까지 파고듭니다.</p>'+h;
  h+='<p>'+esc(name)+' 님의 여덟 글자는 <b>'+C.gzP(R.dStem,R.dBranch)+'일주</b>입니다. '+S.lineup(R)+'. '+S.STRENGTH_TXT[R.strength].out+'</p>';
  h+=pillarDetail(R);
  h+=H('일간이 말하는 삶의 태도');
  h+='<p>'+S.DAY_MASTER[R.dStem][0]+' — 이것이 이 사주의 바탕입니다. '+S.ILJU[R.dIdx][1]+'</p>';
  h+='<p>가장 두터운 기운은 <b>'+c.topGrp+'</b>('+c.grp[c.topGrp]+'개)이고, 그 안의 중심은 <b>'+c.topGodInGrp+'</b>입니다. '+S.GROUP_MEAN[c.topGrp]+' '+S.GOD_DEEP[c.topGodInGrp]+'</p>';
  h+=H('기둥이 서로 만나는 자리');
  h+='<p>여덟 글자를 따로 보면 반쪽입니다. 이 사주는 기둥 사이에 이런 관계가 있습니다.</p>'+S.interHTML(R);
  h+='<p>'+S.gongmangText(R)+'</p>';
  h+=H('평생 바뀌지 않는 세 가지');
  h+=UL([
    '<b>동력</b> — '+S.GOD_KEY[c.topGodInGrp]+'. 이 힘이 쓰이지 않는 자리에서는 오래 못 버팁니다.',
    '<b>약점</b> — '+S.STRENGTH_TXT[R.strength].adv,
    '<b>회복법</b> — '+S.EL_DEEP[dd.yong].habit
  ]);
  h+=K('이 사주의 환경', S.ENV_BY_EL[R.dayEl]+'에서 가장 편안해집니다.');
  return h;
}
function life2(R,c,input,name){
  var dm=S.DM_DEEP[R.dStem], dd=D(R);
  var stage=S.stage12(R.dStem,R.dBranch);
  var daySal=dd.sals.filter(function(s){ return s.pos==='일지'||s.pos==='월지'; });
  var h='<p>사람들은 당신을 세 단어로 기억합니다. 그런데 가까운 사람은 전혀 다른 세 단어를 씁니다. 이 장은 그 간격에 대한 이야기입니다.</p>';
  h+=H('겉으로 보이는 나')+'<p>'+dm.out;
  if(c.grp['관성']>=3) h+=' 관성의 기운이 '+c.grp['관성']+'개라 처음에는 선을 넘지 않고 규칙을 지키는 사람처럼 보입니다.';
  else if(c.grp['식상']>=3) h+=' 표현의 기운이 두터워 좋은 것도 싫은 것도 금방 드러납니다.';
  else if(c.grp['인성']>=3) h+=' 배움의 기운이 두터워 말수가 적고 대답이 한 박자 늦습니다.';
  h+='</p>';
  h+=H('가까운 사람이 아는 나')+'<p>'+dm.in+'<br><br>'+S.BR_INNER[R.dBranch]+'</p>';
  h+='<p>일지 '+bj(R.dBranch,'이가')+' <b>'+stage+'</b>의 자리입니다. '+S.STAGE_MEAN[stage]+' 그래서 이 사람은 <b>'+stage+'</b>의 방식으로 회복합니다.</p>';
  if(daySal.length){
    h+='<p>이 자리에 걸린 표시 — '+daySal.map(function(s){return '<b>'+s.name+'</b>('+s.pos+')';}).join(', ')+'. '+daySal[0].txt+'</p>';
  }
  h+=H('기운이 빠져나가는 순간')+'<p>'+dm.drain+'</p>';
  h+=H('타고난 무기')+'<p>'+dm.weapon+' 여덟 글자에서 <b>'+c.topGrp+'</b>이 가장 두터우니 이 무기는 결국 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>에서 나옵니다.</p>';
  h+=H('조심할 결')+'<p>'+dm.weak+'</p>';
  return h;
}
function life3(R,c,input,name){
  var h='<p>“나는 왜 이럴까”라는 질문의 절반은 기운의 무게로 설명됩니다. 넘치는 것과 모자란 것, 그 차이를 저울에 올려봅니다.</p>';
  h+=facts(R);
  h+=H('오행의 무게')+'<p>여덟 글자(시간을 모르면 여섯 글자)의 오행을 세어보면 이렇게 나뉩니다. 가장 두터운 기운은 '+elB(c.mostI)+' '+R.pct[c.mostI].toFixed(1)+'%, 가장 얇은 기운은 '+elB(c.leastI)+' '+R.pct[c.leastI].toFixed(1)+'%입니다.</p>';
  h+=elMeter(R);
  h+=H('가장 강한 기운 — '+S.EL_KO[c.mostI])+'<p>'+S.EL_DEEP[c.mostI].over+'</p>';
  h+=H('가장 약한 기운 — '+S.EL_KO[c.leastI])+'<p>'+S.EL_DEEP[c.leastI].under+'</p>';
  h+=H('기운이 강한 편인가, 약한 편인가');
  h+='<p>'+S.strengthText(R)+'</p>';
  h+=H('그래서 필요한 것과 피할 것');
  h+='<p>'+S.yongText(R)+'</p>';
  h+=gaewunBlock(R,c);
  return h;
}
function life4(R,c,input,name){
  var dd=D(R);
  var h='<p>여덟 글자는 재료입니다. 같은 재료라도 어떤 요리를 하느냐에 따라 결과가 달라지듯, 이 재료를 어떻게 쓰는지가 인생의 맛을 정합니다.</p>';
  h+=H('기운의 구조')+'<p>여덟 글자가 어떤 재료로 이루어졌는지 묶음으로 보면 이렇습니다.</p>'+godTable(c);
  h+='<p>가장 두터운 묶음은 <b>'+c.topGrp+'</b>입니다. '+S.GROUP_MEAN[c.topGrp]+' 그래서 인생의 과제는 이 기운을 <b>쓰는 법</b>을 배우는 일입니다.</p>';
  h+=H('겉으로 드러나지 않은 재료');
  var rows='<table class="tbl"><tr><th>지지</th><th>품고 있는 기운</th><th>이 사주에서</th></tr>';
  dd.live.forEach(function(p){
    rows+='<tr><td><b>'+p.pos+' '+S.BR_KO[p.branch]+'('+S.BR_HAN[p.branch]+')</b></td><td>'+p.hidden.map(function(x){return S.STEM_KO[x.stem]+'('+x.god+')';}).join(' · ')+'</td><td style="font-size:12.5px">'+p.hidden[0].label+' '+S.STEM_KO[p.hidden[0].stem]+S.josaP(S.STEM_KO[p.hidden[0].stem],'이가')+' '+(p.bGod===p.hidden[0].god?'그대로':'다른 결로')+' 작동합니다</td></tr>';
  });
  h+=rows+'</table>';
  h+='<p>이것은 <b>“말하지 않은 마음”</b>입니다. 이 사주는 '+dd.live.map(function(p){ return S.BR_KO[p.branch]+'('+S.BR_HAN[p.branch]+')에 '+p.hidden.map(function(x){return x.god;}).join('·'); }).join(', ')+'이 숨어 있어, 겉으로 보이는 성격과 실제 계산이 다를 수 있습니다.</p>';
  h+=H('이 사주가 반복하는 장면');
  h+='<p>'+S.GOD_DEEP[c.topGodInGrp]+'</p>';
  h+='<p>반대로 <b>'+c.topGrp+'</b>이 무시당하는 자리에 오래 있으면, 능력과 별개로 몸과 마음이 먼저 지칩니다. 이 감각이 들면 자리를 바꾸는 신호로 보세요.</p>';
  if(dd.gmHits.length) h+='<p>'+S.gongmangText(R)+'</p>';
  h+=K('한 줄','이 사주의 무기는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이고, 약점은 그 무기를 못 쓰는 자리에 오래 머무는 것입니다.');
  return h;
}
function life5(R,c,input,name){
  var y=c.yongEl, d=S.EL_DEEP[y], dd=D(R), w=dd.docu;
  var jc=c.gc['정재'], pc=c.gc['편재'];
  var h='<p>돈은 성격을 닮습니다. 이 사주가 돈을 대하는 방식, 모으는 방식, 새는 방식을 한 장에 담았습니다.</p>';
  h+=H('평생의 재물 구조');
  h+='<p>돈의 기운은 <b>'+(jc+pc)+'개</b>(쌓는 돈 '+jc+' · 도는 돈 '+pc+')이고, 일간의 힘은 <b>'+(R.strength==='강'?'강한 편':(R.strength==='약'?'약한 편':'고른 편'))+'</b>입니다. '+(pc>jc?'변동형 수입에 강하고 큰 판을 보는 눈이 있습니다.':(jc>pc?'고정형 수입에 강하고 관리에 능합니다.':'고정과 변동이 반반이라 균형 잡힌 운영이 맞습니다.'))+'</p>';
  h+='<p>'+S.strengthText(R)+'</p>';
  h+=H('돈이 새는 지점')+'<p>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'사람을 통한 지출에서 계산이 흐려집니다.')+' 조심할 기운이 도는 달에 특히 커집니다.</p>';
  h+=H('부르는 방식')+'<p>'+(S.WEALTH_VESSEL_GOD[c.topGodInGrp]||'성실함이 그대로 재산이 되는 구조입니다.')+'</p>';
  h+=H('문서·부동산')+'<p>문서·부동산 취득 지수는 <b>'+w.score+'/100('+w.grade+')</b>입니다. 가장 잘 맞는 방식은 <b>'+w.types[0].label+'</b>이고, 첫 번째 창은 <b>'+(w.bestClean?w.bestClean.y+'년 '+w.bestClean.gz:w.best.y+'년 '+w.best.gz)+'</b>입니다. '+(w.gmIn.length?'문서가 비어 있는 사주라 계약서·등기를 직접 확인해야 합니다.':'문서와 절차가 받쳐줘 등기와 계약에서 손해가 적은 구조입니다.')+'</p>';
  h+=H('평생의 루틴')+'<p>'+(S.WEALTH_ROUTINE[c.topGrp]||'수입이 들어온 날 바로 떼어두는 습관 하나가 10년을 바꿉니다.')+' '+d.habit+'.</p>';
  h+=K('한 줄','평생의 재물은 <b>'+S.careerMap(R).roles[0]+'</b> 같은 자리에서 만들어집니다.');
  return h;
}
function life6(R,c,input,name){
  var dd=D(R);
  var dohwa=dd.sals.filter(function(s){return s.key==='dohwa'||s.key==='hongyeom';});
  var h='<p>사랑은 취향이 아니라 구조입니다. 왜 같은 사람에게 끌리고, 왜 같은 자리에서 다치는지 — 여덟 글자가 그 이유를 들고 있습니다.</p>';
  h+=H('평생의 인연');
  h+='<p>배우자 자리인 일지 '+bj(R.dBranch,'은는')+' <b>'+S.SPOUSE[R.dBranch]+'</b>을 가리킵니다. '+S.BR_INNER[R.dBranch]+'</p>';
  h+='<p>일지의 기운 단계는 <b>'+S.stage12(R.dStem,R.dBranch)+'</b>입니다. '+S.STAGE_MEAN[S.stage12(R.dStem,R.dBranch)]+'</p>';
  if(dohwa.length) h+='<p>인연의 표시로 <b>'+dohwa.map(function(s){return s.name;}).join('·')+'</b>이 '+dohwa[0].pos+'에 있습니다. '+dohwa[0].txt+'</p>';
  h+=H('오래 가는 사람 vs 끌리는 사람');
  h+='<p><b>끌리는 사람</b> — '+S.LOVE_ATTRACT[R.dayEl]+'</p>';
  h+='<p><b>오래 가는 사람</b> — '+S.LOVE_FIT[R.dayEl]+'</p>';
  h+=H('사랑의 언어')+'<p>'+S.LOVE_LANG[R.dayEl]+'</p>';
  h+=H('평생의 숙제')+'<p>'+S.LOVE_SHADOW[R.dayEl]+'</p>';
  h+=K('한 줄','서두르는 인연보다 천천히 익는 인연이 이 사주에 오래 남습니다.');
  return h;
}
function life7(R,c,input,name){
  var cm=S.careerMap(R);
  var h='<p>“무엇을 해야 할까”보다 “어디서 힘이 나는가”가 먼저입니다. 이 사주가 오래 갈 수 있는 자리와, 힘이 실리는 10년을 함께 봅니다.</p>';
  h+=H('일의 방향');
  h+='<p>'+cm.why+'</p>';
  h+='<ul>'+cm.roles.map(function(x,i){ return '<li>'+(i===0?'<b>'+x+'</b>':x)+'</li>'; }).join('')+'</ul>';
  h+='<p>부업·사업으로는 '+cm.biz[0]+' 같은 형태가 맞습니다.</p>';
  h+=H('일하는 방식')+'<p>'+(S.WORK_MODE[c.topGrp]||'역할이 분명할 때 가장 오래 갑니다.')+'</p>';
  h+=H('평생의 10년 지도')+'<p>아홉 번의 10년을 한눈에 놓았습니다. 지금 구간을 기준으로 앞뒤를 함께 보세요.</p>';
  h+=daeunTable(R,c);
  var best=S.bestDaeun(R,c);
  var br=S.tenGod(R.dStem,R.daeun[best.i].idx%10);
  h+='<p>가장 힘이 실리는 구간은 <b>'+R.daeun[best.i].from+'~'+R.daeun[best.i].to+'세 · '+br+'</b>입니다. '+(S.GOD_DAEUN[br]||'')+'</p>';
  return h+K('가장 힘이 실리는 구간', '<b>'+R.daeun[best.i].from+'~'+R.daeun[best.i].to+'세 · '+br+'</b> — '+(S.GOD_DAEUN[br]||''));
}

/* ---------------- 조립 ---------------- */
window.CTP.general={
  newyear:[
    {title:'나의 오행 — 다섯 기운의 무게',sub:'많이 가진 기운과 모자란 기운',
     lead:'여덟 글자를 저울에 올려보면, 유난히 많은 기운과 유난히 적은 기운이 보입니다. 그 차이가 지금의 성격이고, 지금의 피로입니다.',
     body:nyElem},
    {title:'인간 관계 — 사람 사이의 나',sub:'지치는 자리와 편해지는 사람',
     lead:'사람에게 지치는 방식은 사람마다 다릅니다. 당신이 어떤 자리에서 말수가 줄어드는지, 여덟 글자는 그 장면을 기억하고 있습니다.',
     body:nyPeople},
    {title:'평생의 큰 흐름',sub:'10년마다 바뀌는 판',
     lead:'인생은 노력의 총합이라기보다, 판이 바뀌는 때를 알아채는 일에 가깝습니다. 10년마다 문이 열리고 닫히는 자리를 펼쳐 놓았습니다.',
     body:nyFlow},
    {title:'다가오는 한 해의 문 — 2027 정미년',sub:'한 해의 성격과 문이 열리는 영역',
     lead:'2027년 정미년. 누군가에게는 준비의 해, 누군가에게는 문이 열리는 해입니다. 당신의 2027년이 어느 쪽인지 짚어드립니다.',
     body:nyDoor},
    {title:'2027년의 돈',sub:'들어오는 달과 새는 달',
     lead:'돈은 벌이는 크기보다 들어오는 달에 무엇을 하느냐로 갈립니다. 통장이 두꺼워지는 달과 얇아지는 달을 갈라 놓았습니다.',
     body:nyMoney},
    {title:'2027년의 일과 자리',sub:'옮길 때와 값을 매길 때',
     lead:'올해 자리를 옮겨야 하는 사람과, 지금 자리에서 한 칸 올라가야 하는 사람이 있습니다. 2027년의 당신은 어느 쪽인지 봅시다.',
     body:nyWork},
    {title:'2027년의 사랑과 가족',sub:'사람이 들어오는 달',
     lead:'마음이 움직이는 데도 계절이 있습니다. 사람이 들어오는 달, 말이 어긋나는 달을 미리 알고 가면 훨씬 덜 다칩니다.',
     body:nyLove},
    {title:'2027년의 몸과 마음',sub:'먼저 지치는 자리와 회복의 달',
     lead:'몸은 가장 먼저, 가장 조용히 신호를 보냅니다. 2027년에 유난히 피곤해지는 달과 회복이 빨리 오는 달입니다.',
     body:nyHealth},
    {title:'2027년 열두 달',sub:'1월부터 12월까지',
     lead:'같은 1월이라도 사람마다 다른 문이 열립니다. 2027년 1월부터 12월까지, 당신의 달력에만 찍히는 표시입니다.',
     body:nyMonths},
    {title:'2027년 실천 가이드',sub:'서른 날의 순서',
     lead:'읽은 것으로는 아무것도 바뀌지 않습니다. 서른 날 동안, 하루 하나씩. 실제로 해볼 만한 순서를 적었습니다.',
     body:nyGuide}
  ],
  life:[
    {title:'원국의 바탕',sub:'일간·일지·기운의 강약',
     lead:'태어난 날의 여덟 글자는 바뀌지 않습니다. 그래서 이 장은 “올해 어떻게 될까”가 아니라 “나는 어떤 사람인가”를 파고듭니다.',
     body:life1},
    {title:'겉과 속',sub:'보이는 나와 가까운 사람이 아는 나',
     lead:'사람들은 당신을 세 단어로 기억합니다. 그런데 가까운 사람은 전혀 다른 세 단어를 씁니다. 이 장은 그 간격에 대한 이야기입니다.',
     body:life2},
    {title:'타고난 그릇',sub:'오행의 무게와 필요한 기운',
     lead:'“나는 왜 이럴까”라는 질문의 절반은 기운의 무게로 설명됩니다. 넘치는 것과 모자란 것, 그 차이를 저울에 올려봅니다.',
     body:life3},
    {title:'무엇으로 이루어진 사람인가',sub:'다섯 갈래 기운의 구조',
     lead:'여덟 글자는 재료입니다. 같은 재료라도 어떻게 쓰느냐에 따라 결과가 달라지듯, 이 재료를 어떻게 쓰는지가 인생의 맛을 정합니다.',
     body:life4},
    {title:'평생의 재물',sub:'버는 구조와 새는 곳',
     lead:'돈은 성격을 닮습니다. 이 사주가 돈을 대하는 방식, 모으는 방식, 새는 방식을 한 장에 담았습니다.',
     body:life5},
    {title:'평생의 인연',sub:'끌리는 사람과 오래 가는 사람',
     lead:'사랑은 취향이 아니라 구조입니다. 왜 같은 사람에게 끌리고, 왜 같은 자리에서 다치는지 — 여덟 글자가 그 이유를 들고 있습니다.',
     body:life6},
    {title:'평생의 일과 10년',sub:'천직과 아홉 번의 10년',
     lead:'“무엇을 해야 할까”보다 “어디서 힘이 나는가”가 먼저입니다. 오래 갈 자리와 힘이 실리는 10년을 함께 봅니다.',
     body:life7}
  ]
};
})();
