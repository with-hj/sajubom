/* 천령당 — 재물·직업 : 재물/횡재 · 직업/이직 · 창업/부업 (v31 정밀판) */
(function(){
'use strict';
var C=window.CH, S=C.S;
var EL_KO=S.EL_KO;
var P=C.P,H=C.H,UL=C.UL,K=C.K,elB=C.elB,stemB=C.stemB,brB=C.brB,bj=C.bj,sj=C.sj,bp=C.bp,sp=C.sp;
var monthsBlock=C.monthsBlock, seunTable=C.seunTable, risky=C.riskyMonthsText, yearOfStar=C.yearOfStar;
window.CTP=window.CTP||{};

function D(R){ return S.deep(R); }
function elK(i){ return S.EL_KO[i]+'('+S.EL_HAN[i]+')'; }
function jeong(c){ return c.gc['정재']; }
function pyeon(c){ return c.gc['편재']; }
function n2(n){ return n<10?'0'+n:''+n; }

/* 이 사주의 재성 위치를 문장으로 */
function jaeWhere(R,c){
  var d=D(R), out=[];
  d.live.forEach(function(p){
    if(S.GOD_GROUP[p.sGod]==='재성') out.push(p.pos+' 천간 '+sp(p.stem)+' '+p.sGod);
    if(S.GOD_GROUP[p.bGod]==='재성') out.push(p.pos+' 지지 '+bp(p.branch)+' '+p.bGod);
  });
  return out;
}
/* 해 하나를 문장으로 — 이유까지 */
function yearSentence(R,y){
  var r=S.yearRead(R,y);
  return r.why;
}

/* ---------------- 재물 · 횡재 ---------------- */
function mo1(R,c,input,name){
  var d=D(R), jc=jeong(c), pc=pyeon(c), tot=jc+pc;
  var where=jaeWhere(R,c);
  var h='<p>'+name+' 님의 재물은 <b>재성 '+tot+'개</b>(정재 '+jc+' · 편재 '+pc+')로 시작합니다. '+(where.length?'재성이 놓인 자리는 '+where.join(', ')+'입니다. ':'재성이 천간·지지 본기에 뚜렷하게 앉아 있지 않습니다. ')+
    (pc>jc?'편재가 더 많아 <b>변동형 수입</b>에 강하고, 큰 판을 보는 눈이 있습니다. 대신 달마다 들어오는 금액이 흔들립니다.'
     :(jc>pc?'정재가 더 많아 <b>고정형 수입</b>에 강하고 관리에 능합니다. 대신 큰 한 방을 기다리면 늦습니다.'
     :'정재와 편재가 반반이라, 고정 수입 위에 변동 수입을 한 줄 얹는 구조가 가장 잘 맞습니다.'))+'</p>';
  h+=H('그릇의 크기 — 왜 그런가');
  h+='<p>'+S.strengthText(R)+'</p>';
  h+='<p>'+(R.strength==='강'
      ? '힘이 넘치는 사주가 재성을 만나면 <b>벌이는 힘</b>이 좋습니다. 다만 재성이 힘에 눌리면 돈이 사람을 거치지 못하고, 결국 <b>내가 직접 쥐고 있어야</b> 남습니다.'
      : (R.strength==='약'
        ? '일간이 얇은데 재성이 보이면 <b>돈은 보이는데 그릇이 얇은</b> 구조입니다. 큰돈을 한 번에 받기보다 <b>여러 번 나눠 받는</b> 계약이 이 사주에 맞습니다.'
        : '힘과 재성이 비슷해 <b>번 만큼 지키는</b> 균형형입니다. 대신 결정이 늦으면 기회도 늦게 옵니다.'))+'</p>';
  h+='<p>'+S.yongText(R)+'</p>';
  h+=H('십성으로 보는 돈의 재료')+C.godTable(c);
  h+='<p>중심은 <b>'+c.topGrp+'</b>이고, 그 안의 별은 <b>'+c.topGodInGrp+'</b>입니다. '+S.GROUP_MEAN[c.topGrp]+'</p>';
  h+='<p>'+(d.docu.gmJae.length?'다만 재성 중 '+d.docu.gmJae.map(function(p){return p.pos;}).join('·')+'가 <b>공망</b>입니다. 벌이는 되지만 <b>들어온 돈이 손에 오래 머물지 않는</b> 자리라, 받을 것은 그 자리에서 확정해야 합니다.':'재성에 공망이 걸리지 않아, 들어온 돈이 <b>장부에 남는</b> 구조입니다.')+'</p>';
  return h+K('한 줄','이 사주의 돈은 <b>'+S.careerMap(R).roles[0]+'</b> 같은 자리에서 만들어지고, <b>'+(tot>=3?'여러 줄':'한 줄')+'</b>로 들어올 때 가장 안정됩니다.');
}
function mo2(R,c,input,name){
  var d=D(R), g=d.gisin, gu=d.gusin;
  var h=H('새는 지점 — 구조로 본다');
  h+='<p>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'사람을 통한 지출에서 계산이 흐려집니다.')+'</p>';
  h+='<p>이 사주에서 돈이 새는 이유는 의지가 아니라 <b>기운의 구조</b>입니다. 필요한 기운은 '+elK(d.yong)+'인데 <b>기신 '+elK(g)+'</b>이 들어오는 달에는 같은 지출이 두 배로 느껴지고, <b>구신 '+elK(gu)+'</b>이 겹치면 애쓴 만큼 남지 않습니다.</p>';
  h+='<p>특히 '+(c.grp['식상']>=3?'식상이 두터워 <b>기분 전환의 소비</b>가 큽니다. 만들고 사고 나누는 데 쓰는 돈이 가장 큰 구멍입니다.'
      :(c.grp['비겁']>=3?'비겁이 두터워 <b>사람에게 쓰는 돈</b>이 큽니다. 빌려주고, 내가 더 내고, 함께 쓰는 자리에서 계산이 흐려집니다.'
      :(c.grp['인성']>=3?'인성이 두터워 <b>배움과 준비에 쓰는 돈</b>이 큽니다. 강의·자격·장비를 사두고 끝내지 못한 것이 쌓입니다.'
      :(c.grp['관성']>=3?'관성이 두터워 <b>체면과 절차에 쓰는 돈</b>이 큽니다. 형식과 선물, 격에 맞추는 지출이 반복됩니다.'
      :'재성이 두터워 <b>기회에 쓰는 돈</b>이 큽니다. 좋아 보이는 것에 먼저 들어가고, 검증은 나중에 합니다.'))))+'</p>';
  h+=H('이 사주가 반복하는 세 가지 지출')+UL([
    (c.grp['식상']>=2?'기분이 좋아지면 사는 작은 것 — 한 달에 모으면 꽤 큽니다':'필요해 보여서 사두고 쓰지 않는 것 — 집에 쌓입니다'),
    (c.grp['비겁']>=2?'사람과의 자리에서 내가 더 내는 습관':'구독·멤버십을 해지하지 못하는 습관'),
    (d.docu.gmJae.length?'받을 돈을 “나중에”로 미루는 것 — 공망 재성은 미룰수록 사라집니다':'정산을 미루는 것 — 미룬 결정은 손실이 됩니다')
  ]);
  h+=H('막는 방법 — 이 사주에게 맞는 것');
  h+='<p>큰 결심보다 <b>구조</b>입니다. 통장을 셋으로 나누세요 — 쓰는 통장, 쌓는 통장, 비상 통장. 이 사주는 필요한 기운이 '+elK(d.yong)+'이고, 쌓는 통장의 이름에 '+S.EL_DEEP[d.yong].color+' 계열을 쓰면 의식이 유지됩니다.</p>';
  h+='<p>기신 '+EL_KO[g]+S.josaP(EL_KO[g],'이가')+' 도는 달에는 <b>큰 결제를 2주 미루는 규칙</b> 하나만 더하세요. 이 사주는 2주만 지나면 절반은 사지 않습니다.</p>';
  return h+K('한 줄','들어오는 것보다 <b>새는 곳</b>을 먼저 막으세요. 이 사주는 버는 힘보다 지키는 구조가 약합니다.');
}
function mo3(R,c,input,name){
  var d=D(R);
  var reads=[];
  for(var i=0;i<R.seun.length;i++) reads.push(S.yearRead(R,R.seun[i].year));
  var open=reads.filter(function(r){return r.tone==='open';});
  var hold=reads.filter(function(r){return r.tone==='hold';});
  var h=H('앞으로 다섯 해 — 이유까지');
  h+='<table class="tbl"><tr><th>해</th><th>간지 · 십성</th><th>이 사주에 오는 것</th></tr>';
  reads.forEach(function(r){
    var whyShort=[];
    if(r.grp==='재성') whyShort.push('재성(돈)');
    if(r.grp==='인성') whyShort.push('인성(문서·자금줄)');
    if(r.grp==='관성') whyShort.push('관성(자리·계약)');
    if(r.grp==='식상') whyShort.push('식상(만들 것)');
    if(r.grp==='비겁') whyShort.push('비겁(내 힘)');
    if(r.yong) whyShort.push('용신 '+EL_KO[d.yong]);
    if(r.gi) whyShort.push('기신 '+EL_KO[d.gisin]);
    if(r.isGong) whyShort.push('공망');
    if(r.rels.length) whyShort.push(r.rels.map(function(x){return x.pos+' '+x.type;}).join('·'));
    h+='<tr><td><b>'+r.y+'</b></td><td>'+r.gz+' · '+r.g+'</td><td style="font-size:13px">'+r.short+' — '+(whyShort.length?whyShort.join(', '):'특별한 자극 없음')+'</td></tr>';
  });
  h+='</table>';
  h+='<p>'+(open.length
    ? '이 중 <b>'+open.map(function(r){return r.y+'년('+r.gz+')';}).join(', ')+'</b>이 돈의 문이 실제로 열리는 해입니다. '+open[0].why
    : '앞으로 다섯 해에는 재물의 문이 크게 열리는 해가 없습니다. 이때는 벌이를 키우기보다 <b>새는 곳을 막고 구조를 세우는</b> 시기로 쓰는 편이 맞습니다.')+'</p>';
  if(hold.length) h+='<p>반대로 <b>'+hold.map(function(r){return r.y+'년';}).join(', ')+'</b>은 결정이 늦게 오는 해입니다. 이 해에는 큰 지출·보증·새 대출을 만들지 마세요.</p>';
  h+=seunTable(R,c,5);
  h+=H('달 단위 — 계약과 정산에 힘이 실리는 달');
  var tops=[], now=new Date();
  for(var k=0;k<12;k++){
    var yy=now.getFullYear(), mm=now.getMonth()+1+k;
    while(mm>12){ mm-=12; yy++; }
    var mr=S.monthRead(R,yy,mm);
    if(mr.grp==='재성'||mr.grp==='인성'||mr.grp==='관성') tops.push({y:yy,m:mm,r:mr});
  }
  if(tops.length){
    h+='<ul>'+tops.slice(0,4).map(function(o){
      return '<li><b>'+o.y+'.'+n2(o.m)+' '+o.r.gz+'('+o.r.g+')</b> — '+(o.r.rels.length?o.r.rels.map(function(x){return x.pos+'와 '+x.type;}).join(', ')+'이라 ':'')+(o.r.grp==='재성'?'수입과 계약이 구체적으로 움직이는 달입니다.':(o.r.grp==='인성'?'문서·자금줄이 정리되는 달입니다.':'자리와 절차가 돈을 만드는 달입니다.'))+'</li>';
    }).join('')+'</ul>';
  } else {
    h+='<p>앞으로 12개월은 재성·인성·관성이 도는 달이 뚜렷하지 않습니다. 달을 고르기보다 <b>분기마다 한 번</b> 정산하는 리듬이 맞습니다.</p>';
  }
  h+=monthsBlock(R,c,'wealth',12,'앞으로 12개월, 돈이 움직이는 달을 그대로 짚었습니다.');
  return h+K('한 줄','재성이 들어오는 해에는 <b>계약과 정산을 그해 안에</b> 끝내세요. 미루면 다음 해의 기신이 그것을 지웁니다.');
}
function mo4(R,c,input,name){
  var d=D(R), pc=pyeon(c);
  var geum=d.sals.filter(function(s){return s.key==='geumyeo';});
  var yang=d.sals.filter(function(s){return s.key==='yangin';});
  var h=H('횡재의 결');
  h+='<p>편재는 <b>큰 돈, 예상하지 못한 돈</b>입니다. 이 사주는 편재가 <b>'+pc+'개</b>이고, '+(pc>=2?'큰돈이 들어올 문이 여럿 있습니다. 다만 들어온 만큼 나가는 구조도 함께 있어, 지키는 규칙이 없으면 남지 않습니다.':(pc===1?'한 번의 큰 기회가 올 수 있습니다. 그때를 위해 평소에 <b>담을 그릇</b>을 준비해두세요.':'큰돈보다 쌓이는 돈에 강한 구조입니다. 무리한 한 방보다 매달 남기는 쪽이 맞습니다.'))+'</p>';
  h+='<p>'+(geum.length
    ? '<b>금여(金輿)</b>가 '+geum.map(function(s){return s.pos;}).join('·')+'에 있습니다. 금여는 <b>형태가 남는 재산</b> — 집, 차, 보증금, 퇴직금처럼 <b>통장이 아니라 자산으로 남는 돈</b>과 인연이 깊은 자리입니다. 이 사주에게 횡재는 현금보다 <b>자산</b>의 형태로 오고, 그 자산을 오래 들고 있을수록 커집니다.'
    : '금여가 뚜렷하지 않아 큰돈이 <b>현금으로 오래 머무는</b> 자리는 아닙니다. 큰돈이 들어오면 그 자리에서 자산으로 바꾸는 편이 낫습니다.')+'</p>';
  if(yang.length) h+='<p><b>양인(羊刃)</b>이 '+yang.map(function(s){return s.pos;}).join('·')+'에 있습니다. 큰돈을 밀어붙이는 힘이 강해, 한 번의 판단으로 자산의 크기가 달라질 수 있습니다. 그만큼 <b>계약에서 강하게 나가면 다툼이 남습니다.</b> 큰 거래일수록 조건을 문서로 남기세요.</p>';
  h+=H('큰돈이 오는 방식');
  h+='<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해, 사람을 통해 기회가 옵니다. '+
    (d.sals.some(function(s){return s.key==='cheonul';})
      ? '천을귀인이 '+d.sals.filter(function(s){return s.key==='cheonul';}).map(function(s){return s.pos;}).join('·')+'에 있어, 막히는 순간에 <b>예상하지 못한 사람</b>이 손을 내밉니다. 그 사람은 대개 내가 설명한 적 있는 사람입니다.'
      : '귀인이 뚜렷하지 않으니, 기회는 <b>내가 먼저 말한 자리</b>에서 옵니다.')+' 다만 사람이 권하는 것에 계산이 흐려지므로 <b>서류</b>로 확인하는 습관이 필요합니다.</p>';
  h+=H('들어왔을 때의 규칙 — 이 사주 전용')+UL([
    '들어온 날 <b>절반</b>을 자산(예금·적금·부동산 계약금)으로 바꾸기 — 현금으로 두면 구신 '+elK(d.gusin)+'이 데려갑니다',
    '빌려준 돈은 <b>없는 돈</b>으로 처리하고, 다음부터는 금액의 상한을 정하기',
    '큰돈이 들어온 해에는 <b>새는 곳을 먼저</b> 점검하고 나서 쓰기'
  ]);
  return h+K('한 줄','횡재는 <b>그릇</b>이 준비된 사람에게만 남습니다. 이 사주의 그릇은 현금이 아니라 <b>자산</b>입니다.');
}

/* ---------- 문서 · 부동산 취득운 (신설) ---------- */
function md5(R,c,input,name){
  var d=D(R), w=d.docu;
  var h='<p>문서운과 부동산 취득운은 재물의 크기와 <b>다른 축</b>입니다. 돈이 많아도 등기와 계약에서 새면 남지 않고, 돈이 적어도 문서가 정확하면 자산이 됩니다. 명리에서는 <b>인성(문서·계약·등기)</b> · <b>관성(명의·관청·법적 효력)</b> · <b>재성(실물·자금)</b> 세 축의 균형과, 그 글자가 <b>공망·충·형</b>에 걸렸는지로 봅니다.</p>';
  h+='<div class="ch-key" style="margin-bottom:10px"><b>문서·부동산 취득 지수 '+w.score+' / 100 · '+w.grade+'</b><span>인성 '+w.inCnt+' · 관성 '+w.gwanCnt+' · 재성 '+w.jaeCnt+' · 토 '+w.toCnt+'</span></div>';
  h+=H('이 사주가 문서를 다루는 구조');
  h+='<ul>';
  h+='<li><b>인성 '+w.inCnt+'개</b>(정인 '+w.jeong+' · 편인 '+w.pyeon+') — '+(w.inCnt===0?'문서를 “나중에” 보는 구조입니다. 계약서·등기부를 읽는 습관 자체를 만들어야 합니다.':(w.inCnt<=2?'문서를 읽고 남기는 힘이 적당히 있습니다. 확인 목록만 정해두면 충분합니다.':'문서가 많은 사주입니다. 검토가 길어져 <b>타이밍을 놓치는</b> 쪽이 위험합니다.'))+'</li>';
  h+='<li><b>관성 '+w.gwanCnt+'개</b> — '+(w.gwanCnt===0?'명의·등기·관청 절차에 약합니다. 매수는 되지만 <b>명의를 넘기는 순서</b>에서 실수가 생깁니다.':(w.gwanCnt<=2?'명의와 절차를 지키는 힘이 있습니다. 등기·확정일자처럼 <b>공적 기록</b>이 힘이 됩니다.':'절차가 강해 오히려 형식에 매달릴 수 있습니다. 실익(잔금·대출·세금)을 먼저 계산하세요.'))+'</li>';
  h+='<li><b>재성 '+w.jaeCnt+'개</b> — '+(w.jaeCnt===0?'실물 자산보다 현금·사람 쪽에 가까운 사주입니다. 부동산은 <b>작게 한 채</b>가 맞습니다.':(w.jaeCnt<=2?'실물을 쥐는 힘이 있습니다. 매수·매도 판단이 늦지 않으면 남습니다.':'자산이 여러 개로 흩어지기 쉽습니다. 명의와 관리 주체를 하나로 모으세요.'))+'</li>';
  h+='<li><b>토(土) '+w.toCnt+'개</b> — 부동산은 명리에서 토의 실물입니다. '+(w.toCnt>=2?'토가 넉넉해 <b>땅·집과 인연</b>이 있습니다.':(w.toCnt===1?'토가 하나 있어 부동산과 한 번은 인연이 됩니다.':'토가 얇아 부동산보다 <b>금융·사람</b> 쪽이 이 사주에 맞습니다.'))+'</li>';
  h+='</ul>';
  h+=H('공망과 충 — 계약에서 새는 자리');
  h+='<p>'+S.gongmangText(R)+'</p>';
  if(d.branchRels.length){
    h+='<p>기둥 사이 관계도 함께 봅니다 — '+d.branchRels.map(function(r){
      return r.a+' '+bp(r.aBr)+'·'+r.b+' '+bp(r.bBr)+' <b>'+r.type+'</b>';
    }).join(', ')+'. '+(d.branchRels.some(function(r){return r.type==='충';})?'충이 있어 <b>계약 시점과 잔금 시점이 어긋나기</b> 쉽습니다. 잔금일과 등기 접수일을 한 사람에게만 맡기지 마세요.':(d.branchRels.some(function(r){return r.type==='형'||r.type==='파';})?'형·파가 있어 <b>서류가 꼬이는</b> 자리입니다. 특약과 확인 목록을 종이로 남기세요.':'합이 있어 <b>사람을 거쳐 계약이 풀리는</b> 구조입니다. 중개·소개를 활용하면 빨라집니다.'))+'</p>';
  }
  h+=H('어떤 방식의 취득이 맞는가');
  h+='<table class="tbl"><tr><th>유형</th><th>적합도</th><th>이 사주에 맞는 이유</th></tr>';
  w.types.forEach(function(t){
    h+='<tr><td><b>'+t.label+'</b></td><td style="white-space:nowrap">'+t.s+'점</td><td style="font-size:13px">'+t.why+'</td></tr>';
  });
  h+='</table>';
  var best=w.types[0], second=w.types[1];
  h+='<p>결론은 <b>'+best.label+'</b>'+S.josaP(best.label.slice(-1),'이가')+' 가장 잘 맞고, 그다음이 <b>'+second.label+'</b>입니다. '+(best.k==='jeonse'?'전세·보증금 계약이 1순위라는 것은, 이 사주가 <b>큰 빚을 지는 매수보다 안전한 계약</b>에서 힘을 낸다는 뜻입니다.':(best.k==='live'?'실거주 매수가 1순위라는 것은, 이 사주가 <b>사는 순간 명의와 생활이 함께 정리되는</b> 구조라는 뜻입니다.':(best.k==='cheong'?'청약·분양이 1순위라는 것은, 이 사주가 <b>공적 절차와 서류</b>에서 이긴다는 뜻입니다.':'수익형·임대가 1순위라는 것은, 이 사주가 <b>돌아가는 현금</b>을 다루는 감각이 있다는 뜻입니다.')))+'</p>';
  h+=H('유리한 해와 달 — 이유');
  var dshow=w.years.slice(0,3);
  if(w.bestClean&&dshow.indexOf(w.bestClean)<0) dshow.push(w.bestClean);
  h+='<ul>'+dshow.map(function(y){
    var clean=!y.why.some(function(x){return x.indexOf('기신')>=0||x.indexOf('공망')>=0;});
    return '<li><b>'+y.y+'년 '+y.gz+'('+y.g+')</b> — '+(y.why.length?y.why.join(' · '):'특별한 자극 없음')+(w.bestClean&&y.y===w.bestClean.y?' → <b>이 해가 첫 번째 창</b>입니다.':'')+(clean?'':' — <span style="color:#B5533F">조건이 겹쳐 부담이 큽니다.</span>')+'</li>';
  }).join('')+'</ul>';
  h+='<p>'+(w.bestClean?'실제로 계약을 잡을 첫 번째 창은 <b>'+w.bestClean.y+'년 '+w.bestClean.gz+'</b>입니다. 기신·공망이 겹치지 않는 해라 잔금과 등기가 뒤에서 흔들리지 않습니다.':'앞으로 여섯 해 중 기신·공망이 겹치지 않는 해가 없습니다. 이때는 <b>가장 점수가 높은 해</b>에 계약하되 잔금·등기·대출 조건을 세 번 확인하세요.')+'</p>';
  h+='<p>달까지 좁히면 '+w.goodMonths.map(function(m){
    return '<b>'+m.y+'.'+n2(m.m)+' '+m.gz+'</b>'+(m.why.length?'('+m.why.join('·')+')':'');
  }).join(', ')+'입니다. 이 달에 가계약·잔금·등기 접수 중 하나를 잡으면 흐름이 붙습니다.</p>';
  h+='<p>반대로 <b>'+w.badMonths.map(function(m){return m.y+'.'+n2(m.m);}).join(', ')+'</b>은 피하세요. '+(w.badMonths[0].why.length?w.badMonths[0].why.join('·')+'이라 그 달의 계약은 뒤에서 흔들립니다.':'')+'</p>';
  h+=H('계약·대출에서 조심할 것');
  h+=UL(w.traps);
  return h+K('한 줄','이 사주의 문서운은 <b>'+w.grade+'</b>입니다. '+(w.score>=60?'확인 목록만 지키면 자산이 남습니다.':'먼저 <b>명의·등기·자금 순서</b>를 정리하고 움직이세요.'));
}
function mo5(R,c,input,name){
  var d=D(R);
  var h=H('한 달의 순서 — 이 사주 전용');
  h+='<p>'+(S.WEALTH_ROUTINE[c.topGrp]||'수입이 들어온 날 바로 떼어두는 습관 하나가 10년을 바꿉니다.')+'</p>';
  h+='<table class="tbl"><tr><th>때</th><th>할 일</th><th>왜 이 사주에게</th></tr>'+
     '<tr><td>수입이 들어온 날</td><td>절반을 쌓는 통장으로 이동</td><td>'+(R.strength==='강'?'힘이 넘쳐 손에 있으면 바로 씁니다':'재성이 얇아 남겨두지 않으면 사라집니다')+'</td></tr>'+
     '<tr><td>주 1회</td><td>지출 10분 점검 — 구독·약속 확인</td><td>'+c.topGrp+'의 결이 새는 곳이 여기입니다</td></tr>'+
     '<tr><td>월 1회</td><td>고정 지출 하나 줄이기</td><td>구조를 바꾸는 유일한 방법</td></tr>'+
     '<tr><td>기신 '+EL_KO[d.gisin]+'의 달</td><td>큰 결제 2주 미루기</td><td>2주면 절반은 사지 않습니다</td></tr>'+
     '<tr><td>분기 1회</td><td>큰 지출 계획 세우기</td><td>충동과 분리하기</td></tr>'+
     '<tr><td>연 1회</td><td>보험·연금·세금 점검</td><td>이 사주가 가장 미루는 일</td></tr></table>';
  h+=H('공간의 처방')+'<p>'+S.EL_DEEP[d.yong].space+'. '+S.EL_DEEP[d.yong].item+' — 이 사주는 눈에 보이는 것으로 의식을 유지합니다.</p>';
  return h+K('한 줄','돈은 <b>한 달의 순서</b>로 지켜집니다. 많이 버는 사람이 아니라 순서를 지키는 사람이 남깁니다.');
}
function mo6(R,c,input,name){
  var d=D(R), gi=d.gisin;
  var h=H('투자 성향 — 구조로 본 결론');
  h+='<p>'+(c.grp['식상']>=3?'식상이 두터워 <b>아이디어에 끌려 들어가기</b> 쉽습니다. 검증 없이 뛰어들지 말고 작은 금액으로 먼저 확인하세요.'
      :(c.grp['인성']>=3?'인성이 두터워 <b>공부하고 확신이 생겨야</b> 움직입니다. 확신이 늦어 기회를 놓치니 기한을 정해두세요.'
      :(c.grp['비겁']>=3?'비겁이 두터워 <b>내 판단을 믿는</b> 편입니다. 손실 한도를 먼저 정하세요.'
      :(c.grp['관성']>=3?'관성이 두터워 <b>안정형</b>입니다. 원금 보장과 절차를 중요하게 봅니다.'
      :'재성이 두터워 <b>현실적인 계산이 빠릅니다.</b> 다만 사람을 통한 투자에서 계산이 흐려집니다.'))))+'</p>';
  h+='<p>'+(R.strength==='약'?'일간이 약한 사주는 <b>레버리지(대출·신용)</b>에서 가장 크게 다칩니다. 원금의 두 배를 넘기는 구조는 이 사주에 맞지 않습니다.'
      :(R.strength==='강'?'일간이 강한 사주는 <b>버티는 힘</b>이 있어 조정을 견딥니다. 다만 고집이 되어 손절이 늦습니다. 손절선을 숫자로 먼저 적으세요.'
      :'일간이 중화라 어느 쪽으로도 치우치지 않습니다. 대신 <b>결정을 미루는</b> 것이 손실입니다.'))+'</p>';
  h+=H('지켜야 할 원칙')+UL([
    '잃어도 되는 금액의 <b>한도</b>를 먼저 정하기 — 이 사주는 한도를 정하면 지킵니다',
    '사람이 권하는 상품은 <b>서류</b>로 확인하기',
    '수입이 늘어난 달에는 늘어난 절반을 먼저 떼어두기'
  ]);
  h+=H('이 사주가 특히 조심할 때');
  h+='<p>기신 <b>'+elK(gi)+'</b>이 세운·월운으로 들어오는 시기입니다. '+risky(R,c,6)+'</p>';
  h+='<p>'+(d.branchRels.some(function(r){return r.type==='충';})?'원국에 충이 있어 <b>충의 달과 겹치는 결제</b>가 가장 위험합니다. 그 달의 계약은 2주 미루세요.':'원국에 충이 없어 급격한 사고는 적습니다. 대신 <b>서서히 새는</b> 구조를 점검하세요.')+'</p>';
  return h+K('한 줄','투자에서 이 사주가 이기는 방식은 <b>한도</b>를 정하는 것입니다.');
}
function mo7(R,c,input,name){
  return monthsBlock(R,c,'wealth',12,'앞으로 12개월, 재물의 흐름입니다.')+
    K('한 줄','합의 달에 계약하고, 충의 달에는 결제를 미루세요.');
}

/* ---------------- 직업 · 이직 ---------------- */
function jb1(R,c,input,name){
  var d=D(R), cm=S.careerMap(R);
  var wol=d.live.filter(function(p){return p.key==='month';})[0];
  var h=H('천직의 방향 — 2026년의 실제 직군으로');
  h+='<p>'+cm.why+'</p>';
  h+='<p>그래서 이 사주에게 실제로 맞는 자리는 이런 이름들입니다:</p>';
  h+='<ul>'+cm.roles.map(function(x,i){ return '<li>'+(i===0?'<b>'+x+'</b>':'+x')+'</li>'; }).join('')+'</ul>';
  h+='<p>두 번째 줄은 <b>'+cm.secondGrp+'</b>('+cm.secondGod+')입니다 — '+cm.sub.join(' · ')+'. 수입이 한 줄로만 들어오면 이 사주는 금방 지칩니다. 두 줄을 <b>본업과 부업</b>으로 나눠 가지세요.</p>';
  h+='<p>일간의 결이 맞는 영역은 '+cm.domain+' 쪽입니다. 여기에 '+(wol?'월주 '+wol.gz+'('+wol.sGod+')가 직업의 재료를 대고 있습니다. '+S.GOD_DEEP[wol.sGod]:'월주가 직업의 재료를 댑니다.')+'</p>';
  h+=H('일하는 방식');
  h+='<p>'+(S.WORK_MODE[c.topGrp]||'역할이 분명할 때 가장 오래 갑니다.')+'</p>';
  h+='<p>'+(d.deukRyeong?'월령이 받쳐주는 사주라 <b>조직·계절의 리듬</b> 안에서 힘이 납니다.':'월령이 받쳐주지 않아 <b>내가 리듬을 만드는 자리</b>에서 힘이 납니다.')+' '+(c.grp['관성']>=2?'관성이 있어 위계가 있는 곳에서 안정됩니다.':'관성이 얇아 위계가 강한 곳에서는 소모가 큽니다.')+'</p>';
  h+='<p>'+(c.grp['식상']>=3?'식상이 두터워 <b>만들고 표현하는</b> 일에서 성과가 나옵니다. 완성도보다 <b>공개 횟수</b>가 실력을 만듭니다.':(c.grp['인성']>=3?'인성이 두터워 <b>연구·기획·상담</b>처럼 배운 것이 곧 일이 되는 자리가 맞습니다.':'내 이름을 거는 전문 영역이 맞습니다.'))+'</p>';
  h+='<p>반대로 기신 '+elK(d.gisin)+'이 강한 영역('+cm.avoid.join(' · ')+')은 <b>잘해도 소모되는</b> 자리입니다. 남이 좋다고 해서 들어가면 3년 안에 지칩니다.</p>';
  h+=H('이 사주가 일에서 지치는 순간');
  h+='<p>'+S.DM_DEEP[R.dStem].drain+' 이 감각이 2주 이상 이어지면 자리를 점검하세요.</p>';
  return h+K('한 줄','천직은 <b>잘하는 일</b>이 아니라 <b>오래 해도 힘이 돌아오는 일</b>입니다.');
}
function jb2(R,c,input,name){
  var d=D(R);
  var reads=[]; for(var i=0;i<R.seun.length;i++) reads.push(S.yearRead(R,R.seun[i].year));
  var gwan=reads.filter(function(r){return r.grp==='관성';});
  var h=H('이직의 문 — 관성이 오는 해');
  h+='<p>이직의 문은 <b>관성(자리)</b>이 세운으로 들어오는 해에 열립니다. '+(gwan.length
    ? '앞으로 다섯 해 중 <b>'+gwan.map(function(r){return r.y+'년('+r.gz+')';}).join(', ')+'</b>이 그 해입니다. '+gwan[0].why
    : '앞으로 다섯 해에는 관성이 세운으로 뚜렷하게 들어오지 않습니다. 이때는 <b>준비의 시기</b>로 보는 편이 맞습니다.')+'</p>';
  h+='<p>지금 대운은 <b>'+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세 · '+S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)+'</b>입니다. '+(S.GOD_GROUP[S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)]==='관성'?'대운까지 관성이라 <b>자리가 실제로 바뀌는 10년</b>입니다. 세운이 관성인 해는 그중에서도 문이 크게 열립니다.':'대운은 관성이 아니라, 세운이 관성인 해에 <b>한 번의 창</b>이 열리는 구조입니다. 그 해를 놓치면 다음 대운까지 기다려야 합니다.')+'</p>';
  h+=seunTable(R,c,5);
  h+=H('달로 보는 창');
  var now=new Date(), tops=[];
  for(var k=0;k<8;k++){
    var yy=now.getFullYear(), mm=now.getMonth()+1+k;
    while(mm>12){ mm-=12; yy++; }
    var mr=S.monthRead(R,yy,mm);
    if(mr.grp==='관성'||mr.rels.some(function(r){return r.type==='육합';})) tops.push({y:yy,m:mm,r:mr});
  }
  h+='<p>'+(tops.length?tops.slice(0,4).map(function(o){return '<b>'+o.y+'.'+n2(o.m)+'</b>('+o.r.gz+'·'+o.r.g+')';}).join(', ')+' — 서류·면접·협상에 힘이 실리는 달입니다.':'앞으로 8개월은 관성이나 합이 걸리는 달이 뚜렷하지 않습니다. 면접은 분기 초에 몰아 잡으세요.')+'</p>';
  h+=monthsBlock(R,c,'wealth',6,'이직·면접에 힘이 실리는 달입니다.');
  return h+K('한 줄','옮기는 <b>해</b>를 기다리되, 준비는 <b>지금</b> 시작하세요.');
}
function jb3(R,c,input,name){
  var d=D(R);
  var guan=c.grp['관성'], bi=c.grp['비겁'];
  var h=H('지금 자리에 남을까');
  h+='<p>이 사주는 관성 <b>'+guan+'개</b>, 비겁 <b>'+bi+'개</b>입니다. '+(guan>=3?'조직에서 자리를 올리는 방식이 맞습니다.':(guan===0?(bi===0?'관성과 비겁이 모두 얇아 조직의 위계도 독립의 뿌리도 약합니다. <b>결과로 평가받는 자리</b>가 맞습니다.':'관성이 없어 조직의 위계가 나를 지켜주지 못합니다. <b>전문 영역을 내 것으로</b> 가져가야 합니다.'):'조직과 독립이 반반이라, 소속은 있되 전문 영역은 내 것으로 가져야 합니다.'))+'</p>';
  h+='<p>'+(d.deukJi?'일지가 나를 받쳐주는 자리라 <b>내 자리에서 버티는 힘</b>이 있습니다.':'일지가 나를 소모시키는 자리라 <b>같은 자리에 오래 있으면</b> 먼저 지칩니다.')+' '+S.WORK_MODE[c.topGrp]+'</p>';
  h+=H('옮길까 — 숫자로 판단하기');
  h+=UL([
    '<b>생활비 6개월</b>이 확보되었는가 (이 사주는 '+R.age+'세, 현 대운 '+(R.age-R.daeun[R.curDaeun].from+1)+'년 차입니다)',
    '그만두는 이유가 <b>사람</b>인가 <b>일</b>인가 — 사람 때문이라면 옮겨도 반복될 수 있습니다',
    '다음 자리에서 내 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 쓰이는가'
  ]);
  h+=H('남는 경우의 조건');
  h+='<p>남기로 했다면 <b>6개월 안에 하나</b>를 바꾸세요. 업무 범위, 보고 방식, 근무 시간 중 하나입니다. 아무것도 바뀌지 않으면 1년 뒤 같은 자리에서 같은 고민을 합니다.</p>';
  h+='<p>'+(d.branchRels.some(function(r){return r.type==='충';})?'원국에 충이 있어 <b>갑자기 그만두는 결정</b>이 나오기 쉽습니다. 충의 달에는 사표를 쓰지 마세요.':'원국이 크게 부딪히지 않아 <b>서서히 식는</b> 방식으로 지칩니다. 3개월마다 자리를 점검하세요.')+'</p>';
  return h+K('한 줄','퇴사는 <b>감정</b>이 아니라 <b>숫자</b>로 결정하세요.');
}
function jb4(R,c,input,name){
  var d=D(R);
  var cheon=d.sals.filter(function(s){return s.key==='cheonul';});
  var mun=d.sals.filter(function(s){return s.key==='munchang';});
  var h=H('이 사주의 귀인');
  h+='<p>귀인은 돕는 사람이 아니라 <b>나를 쓰는 자리에 데려다주는 사람</b>입니다. 이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 '+S.GROUP_MEAN[c.topGrp].split('.')[0]+'을 알아봐 주는 사람에게서 기회가 옵니다.</p>';
  if(cheon.length) h+='<p><b>천을귀인</b>이 '+cheon.map(function(s){return s.pos;}).join('·')+'에 있습니다. '+cheon[0].txt+' 이 자리는 <b>내가 설명해야 하는 자리</b>에서 작동합니다. 말로 정리해 누군가에게 보여줄 때, 그 사람이 “그거면 되겠네”라고 말해줍니다.</p>';
  if(mun.length) h+='<p><b>문창</b>이 '+mun.map(function(s){return s.pos;}).join('·')+'에 있습니다. '+mun[0].txt+'</p>';
  h+='<p>귀인의 결은 '+elK(d.yong)+'입니다. '+S.EL_KO[d.yong]+'의 결을 가진 사람 — '+S.EL_PERSON[d.yong]+' — 이 귀인이고, '+S.EL_DEEP[d.yong].dir+' 방향의 모임, '+S.EL_DEEP[d.yong].color+' 계열의 자리에서 만나기 쉽습니다.</p>';
  h+='<p>반대로 기신 '+elK(d.gisin)+'의 사람('+S.EL_PERSON[d.gisin]+')과 오래 경쟁하면 잘해도 지칩니다.</p>';
  h+=H('귀인을 만나는 자리')+UL([
    '내가 <b>설명해야 하는</b> 자리 — 말로 정리할 때 사람이 알아봅니다',
    '한 사람이 소개하는 자리 — 이 사주는 소개로 이어지는 인연이 오래 갑니다',
    '배우는 자리 — 자격·강의·스터디'
  ]);
  return h+K('한 줄','귀인은 찾는 것이 아니라 <b>내가 설명할 수 있는 자리</b>에서 만납니다.');
}
function jb5(R,c,input,name){
  var d=D(R);
  var h=H('연봉·조건 협상');
  h+='<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 조건을 말할 때 감정이 섞입니다. 협상은 <b>숫자 → 근거 → 양보 순서</b>로 하세요.</p>';
  h+='<p>'+(c.grp['관성']>=2?'관성이 있어 <b>직함과 절차</b>가 협상의 재료가 됩니다. 숫자와 함께 직함을 요구하세요.':'관성이 얇아 직함보다 <b>실제 보수와 시간</b>으로 받아내는 쪽이 유리합니다.')+' '+(c.grp['인성']>=2?'인성이 있어 자격·교육 지원도 조건에 넣을 수 있습니다.':'인성이 얇아 배움을 조건으로 걸면 오히려 평가가 흐려집니다.')+'</p>';
  h+=H('협상의 순서')+UL(['원하는 숫자를 <b>먼저</b> 말하기','근거는 시장가와 내가 만든 결과 두 가지로만','양보는 <b>한 번</b>만. 그 뒤에는 조건을 바꾸기']);
  h+=H('이 사주가 놓치는 것');
  h+='<p>연봉만 보고 <b>근무 조건</b>을 놓칩니다. 시간, 재택, 휴가 — 이 사주는 '+(d.deukRyeong?'계절의 리듬이 있는 사람이라 <b>시간이 보장될 때</b> 오래 갑니다.':'자기 리듬을 스스로 만들어야 하는 사주라 <b>시간의 자유</b>가 조건입니다.')+'</p>';
  return h+K('한 줄','협상은 <b>한 번에 하나</b>만 요구할 때 성공합니다.');
}
function mo6b(R,c,input,name){
  return monthsBlock(R,c,'wealth',6,'앞으로 6개월, 일과 자리의 흐름입니다.')+
    K('한 줄','자리를 옮기는 결정은 합의 달에, 면접은 충의 달을 피해서.');
}
function jb7(R,c,input,name){
  var g=S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10);
  var nx=R.daeun[R.curDaeun+1];
  var h=H('앞으로 5년의 커리어')+seunTable(R,c,5);
  h+=H('대운의 방향')+'<p>지금 대운은 <b>'+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세 · '+g+'</b> — '+(S.GOD_DAEUN[g]||'')+'</p>';
  if(nx){
    var ng=S.tenGod(R.dStem,nx.idx%10);
    h+='<p>다음은 <b>'+nx.from+'~'+nx.to+'세 · '+ng+'</b>입니다. '+(S.GOD_DAEUN[ng]||'')+' 전환은 <b>'+(nx.from-2)+'~'+(nx.from+2)+'세</b>에 걸쳐 오니, 그 전에 지금 자리에서 남길 것을 정리하세요.</p>';
  }
  h+=H('이 5년의 순서')+UL(['<b>1년차</b> — 실력을 정리하고 기록으로 남기기','<b>2~3년차</b> — 자리 또는 이름을 하나 얻기','<b>4~5년차</b> — 얻은 자리에서 사람을 만들기']);
  return h+K('한 줄','커리어는 <b>기록</b>이 남을 때 다음 자리로 이어집니다.');
}

/* ---------------- 창업 · 부업 ---------------- */
function st1(R,c,input,name){
  var d=D(R), cm=S.careerMap(R);
  var bi=c.grp['비겁'], sik=c.grp['식상'], jae=c.grp['재성'];
  var h='<p>창업 적성은 <b>비겁(내 힘) · 식상(만들 것) · 재성(돈의 흐름)</b>의 조합으로 봅니다. 이 사주는 비겁 <b>'+bi+'</b> · 식상 <b>'+sik+'</b> · 재성 <b>'+jae+'</b>입니다.</p>';
  h+='<p>'+(bi>=3&&sik>=2?'내 이름을 걸고 시작하는 힘이 있습니다. 다만 크게 시작하면 초반에 무너지기 쉬우니 6개월 안에 검증할 크기로 여세요.'
      :(sik>=3?'만들어서 파는 구조가 잘 맞습니다. 부업으로 반응을 확인한 뒤 키우는 방식이 안전합니다.'
      :(jae>=3?'돈의 흐름을 보는 눈이 사업 감각으로 이어집니다. 다만 사람을 쓰는 일에서 계산이 흐려지니 장부를 먼저 만드세요.'
      :'혼자 시작하기보다 검증된 구조에 들어가 역할을 맡는 쪽이 안정적입니다. 창업은 준비 기간을 길게 두세요.')))+'</p>';
  h+='<p>'+(R.strength==='약'?'일간이 약한 사주는 <b>혼자 모든 것을 지는 창업</b>에서 가장 빨리 무너집니다. 동업이나 위탁, 플랫폼에 얹는 형태가 맞습니다.':(R.strength==='강'?'일간이 강한 사주는 <b>밀어붙이는 힘</b>이 있어 초기 돌파가 빠릅니다. 대신 사람을 쓰는 순간 계산이 흐려집니다.':'일간이 중화라 <b>균형 잡힌 운영</b>이 강점입니다. 대신 결단이 늦습니다.'))+'</p>';
  h+=H('이 사주에게 맞는 2026년 사업 모델');
  h+='<ul>'+cm.biz.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>';
  h+='<p>이 모델들이 맞는 이유는 구조에 있습니다 — '+cm.why+'</p>';
  h+=H('이 사주가 빛나는 지점')+'<p><b>'+S.GOD_KEY[c.topGodInGrp]+'</b> — '+S.GOD_DEEP[c.topGodInGrp]+'</p>';
  return h+K('한 줄','창업은 <b>6개월 검증</b>이 먼저입니다. 손익분기보다 “돈을 내는 사람이 있는가”를 보세요.');
}
function st2(R,c,input,name){
  var d=D(R), cm=S.careerMap(R);
  var h=H('무엇으로 시작할까 — 구체적으로');
  h+='<p>이 사주의 첫 번째 재료는 <b>'+cm.mainGrp+'('+cm.mainGod+')</b>입니다. 그래서 상품도 이 결에서 나와야 오래 갑니다.</p>';
  h+='<ul>'+cm.roles.slice(0,3).map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>';
  h+='<p>부업으로는 <b>'+cm.biz[0]+'</b> 같은 형태가 맞습니다. '+ (cm.secondGrp!==cm.mainGrp?'두 번째 기운인 '+cm.secondGrp+'('+cm.secondGod+')가 수입의 두 번째 줄이 됩니다.':'')+'</p>';
  h+=H('아이템을 고르는 기준')+UL(['내가 <b>설명하지 않아도</b> 좋아하는 것','3개월 안에 첫 손님을 만들 수 있는 것','혼자 시작할 수 있고, 키울 때 사람을 쓸 수 있는 것']);
  h+=H('이 사주에게 맞는 형태')+'<p>'+(c.grp['비겁']>=3?'1인 사업 — 내 이름을 걸고 전문성을 파는 형태':'작게 시작해 반응을 보는 부업 형태')+'가 맞습니다. 처음부터 큰 자리를 잡으려 하면 이 사주의 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 오히려 부담이 됩니다.</p>';
  return h+K('한 줄','좋은 아이템은 <b>내가 오래 말할 수 있는 것</b>입니다.');
}
function st3(R,c,input,name){
  var d=D(R);
  var reads=[]; for(var i=0;i<R.seun.length;i++) reads.push(S.yearRead(R,R.seun[i].year));
  var start=reads.filter(function(r){return r.grp==='비겁'||r.grp==='식상';});
  var h=H('시작의 문');
  h+='<p>창업은 <b>비겁(내 힘)</b> 또는 <b>식상(만들 것)</b>이 세운으로 들어오는 해에 시작하는 것이 좋습니다. '+(start.length
    ? '앞으로 다섯 해 중 <b>'+start.map(function(r){return r.y+'년('+r.gz+')';}).join(', ')+'</b>이 그 해입니다. '+start[0].why
    : '앞으로 다섯 해에는 그 문이 뚜렷하지 않습니다. 이때는 준비와 검증에 쓰세요.')+'</p>';
  h+='<p>지금 대운 <b>'+S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)+'</b>은 '+(S.GOD_GROUP[S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)]==='비겁'||S.GOD_GROUP[S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)]==='식상'?'시작의 문이 <b>대운에도 열려 있는</b> 10년입니다. 세운이 받쳐주는 해에 여세요.':'대운에는 시작의 문이 크게 열려 있지 않습니다. <b>세운이 비겁·식상인 해</b>가 실질적인 창입니다.')+'</p>';
  h+=seunTable(R,c,5);
  h+=H('달로 보는 창')+monthsBlock(R,c,'wealth',6,'첫 손님을 만나기 좋은 달입니다.');
  return h+K('한 줄','시작은 <b>작게, 빨리</b>. 이 사주는 준비가 길어지면 시작하지 못합니다.');
}
function st4(R,c,input,name){
  var d=D(R);
  var h=H('실패하는 지점');
  h+='<p>이 사주가 사업에서 무너지는 방식은 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>에서 옵니다. '+S.STRENGTH_TXT[R.strength].adv+'</p>';
  h+=H('특히 조심할 것')+UL([
    '<b>동업</b> — 이 사주는 정이 앞서 서류 없이 시작합니다. 몫과 역할을 글로 남기세요.',
    '<b>확장</b> — 첫 반응이 좋으면 바로 키우려 합니다. 6개월은 같은 크기로 버티세요.',
    '<b>비상금</b> — 생활비 6개월은 사업 자금과 분리하세요.'
  ]);
  h+='<p>구조적으로는 '+(d.gmHits.length?'공망이 '+d.gmHits.map(function(x){return x.pos;}).join('·')+'에 걸려 <b>약속과 서류가 늦어지는</b> 자리입니다. 구두로 정한 것은 반드시 종이로 남기세요.':'공망이 기둥에 걸리지 않아 약속이 비교적 정확히 지켜집니다.')+' '+(d.branchRels.some(function(r){return r.type==='형'||r.type==='파';})?'형·파가 있어 <b>서류와 정산에서 꼬이는</b> 일이 생깁니다.':'')+'</p>';
  h+=H('위기가 오는 달')+'<p>'+risky(R,c,12)+'</p>';
  return h+K('한 줄','사업의 실패는 대개 <b>사람과 돈을 같이</b> 관리하지 못할 때 옵니다.');
}
function st5(R,c,input,name){
  var d=D(R);
  var h=H('동업과 파트너');
  h+='<p>이 사주는 <b>'+c.topGrp+'</b>이 중심이라 '+S.GROUP_MEAN[c.topGrp].split('.')[0]+' 역할을 맡기 쉽습니다. 파트너는 그 반대를 채워주는 사람이 좋습니다 — 즉 '+elK(d.yong)+' 쪽 사람입니다.</p>';
  h+=H('파트너를 고르는 기준')+UL(['내가 못 하는 것을 <b>실제로 해본</b> 사람','돈 이야기를 <b>불편해하지 않는</b> 사람','결정이 늦을 때 <b>기한</b>을 정해줄 수 있는 사람']);
  h+=H('시작 전 서류')+'<p>몫, 역할, 결정권, 나가는 조건 — 네 가지를 한 장으로 적으세요. 이 사주는 이 한 장이 없으면 3년 뒤에 사람을 잃습니다.</p>';
  h+='<p>'+(d.gmHits.length?'특히 '+d.gmHits.map(function(x){return x.pos+' '+bp(x.br);}).join('·')+'가 공망이라, <b>문서로 남기지 않은 약속은 상대도 기억하지 못합니다.</b> 카톡이라도 남기세요.':'')+'</p>';
  return h+K('한 줄','동업은 <b>서류</b>가 우정을 지킵니다.');
}
function st6(R,c,input,name){
  return monthsBlock(R,c,'wealth',6,'앞으로 6개월, 사업의 흐름입니다.')+
    K('한 줄','첫 결제·계약은 합의 달에, 확장은 충의 달을 피해서.');
}

window.CTP.wealth={
  money:[
    {han:'器',title:'재물의 그릇',sub:'재성의 자리와 일간의 힘',body:mo1},
    {han:'漏',title:'새는 곳',sub:'반복되는 지출과 막는 법',body:mo2},
    {han:'時',title:'돈이 들어오는 해',sub:'재성이 오는 때와 이유',body:mo3},
    {han:'橫',title:'횡재의 결',sub:'큰돈이 오는 방식',body:mo4},
    {han:'券',title:'문서·부동산 취득운',sub:'계약·등기·매매의 문',body:md5},
    {han:'法',title:'금전 루틴',sub:'한 달의 순서',body:mo5},
    {han:'險',title:'투자 주의',sub:'이기는 방식은 한도',body:mo6},
    {han:'月',title:'12개월의 재물',sub:'달별 흐름',body:mo7}
  ],
  job:[
    {han:'職',title:'천직의 방향',sub:'오래 해도 힘이 돌아오는 일',body:jb1},
    {han:'轉',title:'이직의 문',sub:'자리가 열리는 해와 달',body:jb2},
    {han:'擇',title:'남을까 옮길까',sub:'퇴사 판단 기준',body:jb3},
    {han:'貴',title:'귀인',sub:'기회를 데려오는 사람',body:jb4},
    {han:'價',title:'조건 협상',sub:'연봉과 근무 조건',body:jb5},
    {han:'月',title:'6개월의 자리',sub:'달별 흐름',body:mo6b},
    {han:'五',title:'5년의 커리어',sub:'해마다의 자리',body:jb7}
  ],
  startup:[
    {han:'始',title:'창업 적성',sub:'비겁·식상·재성의 조합',body:st1},
    {han:'品',title:'무엇으로 시작할까',sub:'아이템을 고르는 기준',body:st2},
    {han:'時',title:'시작의 문',sub:'언제 여는가',body:st3},
    {han:'險',title:'실패하는 지점',sub:'무너지는 방식',body:st4},
    {han:'伴',title:'동업과 파트너',sub:'서류가 우정을 지킨다',body:st5},
    {han:'月',title:'6개월의 사업',sub:'달별 흐름',body:st6}
  ]
};
})();
