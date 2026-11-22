/* 천령당 — 썸·연애·재회 : 썸 속마음 · 재회/연락운 · 내 연애 패턴 */
(function(){
'use strict';
var C=window.CH, S=C.S;
var P=C.P,H=C.H,UL=C.UL,K=C.K,elB=C.elB,stemB=C.stemB,brB=C.brB;
var monthsBlock=C.monthsBlock, seunTable=C.seunTable, risky=C.riskyMonthsText, yearOfStar=C.yearOfStar, partnerChart=C.partnerChart;
window.CTP=window.CTP||{};

function loveYears(R){
  var out=[];
  for(var i=0;i<R.seun.length;i++){
    var g=S.tenGod(R.dStem,R.seun[i].idx%10), grp=S.GOD_GROUP[g];
    if(grp==='재성'||grp==='관성') out.push({y:R.seun[i].year,g:g});
  }
  return out;
}

/* ---------- 썸 속마음 ---------- */
function sm1(R,c,input,name){
  var dd=S.deep(R);
  var stage=S.stage12(R.dStem,R.dBranch);
  var sal=dd.sals.filter(function(s){return s.key==='dohwa'||s.key==='hongyeom'||s.key==='hwagae';});
  var h=window.CH.facts(R);
  h+='<p>'+name+' 님이 좋아할 때 드러나는 신호는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b> 쪽입니다. '+S.loveSignal(R,c)+'</p>';
  h+=H('사랑의 언어')+'<p>'+S.LOVE_LANG[R.dayEl]+'</p>';
  h+=H('상대가 읽는 나')+'<p>'+S.DM_DEEP[R.dStem].out+' 그래서 처음 만난 사람은 이 사람을 “차분하다, 쉽게 마음을 안 준다”고 기억합니다. 하지만 '+S.DM_DEEP[R.dStem].in+'</p>';
  h+='<p>일지 '+window.CH.bj(R.dBranch,'이가')+' <b>'+stage+'</b>의 자리입니다. '+S.STAGE_MEAN[stage]+' 연애에서도 이 방식으로 회복합니다.</p>';
  if(sal.length) h+='<p>인연의 표시로 <b>'+sal.map(function(s){return s.name;}).join('·')+'</b>이 '+sal[0].pos+'에 있습니다. '+sal[0].txt+'</p>';
  h+=H('지금의 온도')+'<p>'+S.yearRead(R,R.seun[0].year).why+'</p>';
  return h+K('먼저 할 일','완벽한 문장을 만들기보다 <b>짧은 안부를 먼저</b> 보내세요. 이 사주는 표현이 늦어질수록 상대가 마음을 접습니다.');
}
function sm2(R,c,input,name){
  var pc=partnerChart(input),h='';
  if(pc){
    var R2=pc.R, c2=pc.c, rel=S.branchRel(R.dBranch,R2.dBranch);
    h+='<p>상대의 일주는 <b>'+C.gzP(R2.dStem,R2.dBranch)+'</b>, 중심 별은 <b>'+c2.topGodInGrp+'</b>입니다. '+S.GOD_DEEP[c2.topGodInGrp]+'</p>';
    h+=H('상대가 지금 보고 있는 것');
    var sn=R.seun[0], pg=S.tenGod(R2.dStem,sn.idx%10);
    h+='<p>'+sn.year+'년 상대의 세운은 <b>'+pg+'</b> — '+S.PARTNER_MIND[S.GOD_GROUP[pg]]+'</p>';
    h+=H('두 사람의 자리')+'<p>일지끼리는 <b>'+rel.k+'</b>입니다. '+rel.t+'</p>';
    h+='<p>상대의 사랑의 언어는 '+S.LOVE_LANG[R2.dayEl]+' 이 사주의 언어와 다를 수 있습니다. 같은 마음을 다른 방식으로 표현하고 있을 뿐이라는 점을 기억하세요.</p>';
    h+=H('상대의 온도 읽기')+'<p>상대의 일간은 '+stemB(R2.dStem)+'입니다. '+S.DAY_MASTER[R2.dStem][0]+' — 이 결은 '+S.MARR_TEMP[R2.dayEl]+'</p>';
  } else {
    h+='<p>상대의 생년월일을 넣으면 상대가 지금 무엇을 보고 있는지까지 짚어드립니다. 지금은 이 사주가 보내는 신호부터 정리합니다.</p>';
    h+=H('이 사주가 끌리는 사람')+'<p>'+S.LOVE_ATTRACT[R.dayEl]+'</p>';
    h+=H('상대를 볼 때 먼저 확인할 것')+UL(['말의 속도가 나와 맞는지','약속을 지키는 방식','돈을 쓰는 기준']);
    h+='<p>세 가지 중 둘이 어긋나면 설렘이 커도 오래가기 어렵습니다. 이 사주는 특히 <b>말의 속도</b>에서 갈립니다.</p>';
  }
  return h+K('마음을 확인하는 법','질문 하나를 던지고 <b>답의 길이</b>를 보세요. 이 사주에게 마음이 있는 사람은 답이 길어집니다.');
}
function sm3(R,c,input,name){
  var pc=partnerChart(input),h='';
  if(pc){
    var sc=S.coupleScore(R,pc.R);
    h+='<div class="ch-key" style="margin-bottom:12px"><b>지금 두 사람의 온도 '+sc.s+'점</b><span>'+sc.notes.join(' · ')+'</span></div>';
    h+='<p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>';
    h+=H('맞춰가는 법')+UL(['상대의 말이 짧아진 이유를 상상하지 말고 한 번 물어보세요.','내가 원하는 표현을 한 문장으로 알려주세요.','만남의 간격을 정하세요. 이 사주는 간격이 없으면 먼저 지칩니다.']);
  } else {
    h+='<p>상대의 생년월일이 없으면 두 사람의 궁합은 아직 계산되지 않습니다. 지금은 이 사주가 관계에서 만드는 온도부터 봅니다.</p>';
    h+='<p>'+S.LOVE_LANG[R.dayEl]+'</p>';
    h+=H('이 사주가 관계에서 원하는 것')+UL(['설렘보다 안심','말보다 반복되는 행동','같이 계획하는 미래']);
  }
  return h;
}
function sm4(R,c,input,name){
  var dd=S.deep(R);
  var reads=[]; for(var i=0;i<R.seun.length;i++) reads.push(S.yearRead(R,R.seun[i].year));
  var open=reads.filter(function(r){return r.grp==='재성'||r.grp==='관성';});
  var h=H('지금 움직여도 되는가');
  h+='<p>'+(open.length?open.map(function(r){return '<b>'+r.y+'년 '+r.gz+'</b>';}).join(', ')+'이 관계가 구체적으로 움직이는 해입니다. '+open[0].why:'앞으로 다섯 해에는 관계성이 세운으로 크게 들어오지 않아, 해보다 만남의 밀도가 중요합니다.')+'</p>';
  h+='<p>'+S.gongmangText(R)+'</p>';
  h+=H('연락의 순서')+UL([
    '<b>1단계</b> — 안부 한 줄, 질문은 하나만.',
    '<b>2단계</b> — 상대가 답하면 그 답에 대한 내 감상 한 줄. 질문을 또 던지지 마세요.',
    '<b>3단계</b> — 만남은 상대가 편한 시간대에. 이 사주는 저녁보다 낮 약속에서 자연스럽습니다.'
  ]);
  var now=new Date(), mm=now.getMonth()+1, tops=[];
  for(var k=0;k<6;k++){
    var yy=now.getFullYear(), mo=mm+k;
    while(mo>12){ mo-=12; yy++; }
    var mr=S.monthRead(R,yy,mo);
    if(mr.rels.some(function(x){return x.type==='육합'||x.type==='삼합';})||mr.grp==='재성'||mr.grp==='관성') tops.push(yy+'.'+(mo<10?'0'+mo:mo)+' '+mr.gz);
  }
  if(tops.length) h+='<p>연락·고백에 힘이 실리는 달은 <b>'+tops.slice(0,3).join(', ')+'</b>입니다.</p>';
  h+=H('흔들리는 지점')+'<p>'+S.LOVE_SHADOW[R.dayEl]+'</p>';
  return h+K('타이밍','지금 답이 없다고 관계가 없는 것은 아닙니다. 다만 <b>기다릴 기한</b>을 정해두세요. 이 사주는 기한 없이 기다리다 스스로 정리합니다.');
}
function sm5(R,c,input,name){
  var h=H('부딪히는 방식')+'<p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>';
  h+=H('대화가 막힐 때')+UL([
    '감정을 설명하지 말고 <b>사실 한 줄</b>부터. “어제 연락이 없어서 나는 좀 서운했어.”',
    '상대의 말을 되풀이해 확인하기. “그 말은 이렇게 들렸어, 맞아?”',
    '결론은 마지막에. 이 사주는 결론을 서두르면 상대가 닫힙니다.'
  ]);
  h+=H('문자에서 조심할 것')+'<p>이 사주는 글로 감정을 정리하려는 습관이 있습니다. 긴 문자는 상대에게 숙제가 됩니다. <b>세 줄</b>을 넘기지 마세요.</p>';
  return h+K('한 문장','하고 싶은 말을 세 줄로 줄여보세요. 세 줄이 되면 감정이 정리된 것입니다.');
}
function sm6(R,c,input,name){
  var h='<p>이 사주가 썸에서 반복하는 실수는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>에서 나옵니다. '+S.LOVE_MISTAKE_GOD[c.topGodInGrp]+'</p>';
  h+=H('오해가 생기는 지점')+'<p>겉으로는 담백한데 속으로는 이미 많이 가까워져 있습니다. 그래서 “관심 없는 줄 알았다”는 말을 나중에 듣게 됩니다.</p>';
  h+=H('멈추어야 할 신호')+UL(['내가 보낸 말의 양이 상대의 두 배를 넘을 때','상대의 답이 짧아진 이유를 나만 해석하고 있을 때','만남 뒤에 늘 내가 먼저 정리하고 있을 때']);
  return h+K('한 줄','셋 중 하나라도 해당하면 <b>사흘</b>을 비워두세요. 이 사주는 사흘이면 절반이 정리됩니다.');
}
function sm7(R,c,input,name){
  return monthsBlock(R,c,'love',6,'앞으로 6개월, 인연의 문이 열리는 달입니다.')+
    K('가장 좋은 달','일지와 합하는 달에 만남이 생기고, 충하는 달에는 연락이 끊깁니다. 표에서 <b>합</b>이 붙은 달을 먼저 보세요.');
}

/* ---------- 재회 / 연락운 ---------- */
function re1(R,c,input,name){
  var dd=S.deep(R);
  var chung=dd.branchRels.filter(function(r){return r.type==='충';});
  var h=window.CH.facts(R);
  h+='<p>재회운은 “돌아올까”보다 <b>다시 이어졌을 때 무엇이 달라지는가</b>로 봅니다. 이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 그리움이 커지면 이유를 잊는 편입니다.</p>';
  h+='<p>'+S.interHTML(R)+'</p>';
  h+='<p>'+(chung.length?'특히 '+chung.map(function(r){return r.a+'와 '+r.b;}).join(', ')+'의 충이 이 사주 안에 이미 있습니다. <b>관계가 끊기고 다시 붙는 일</b>이 구조적으로 반복되는 자리입니다. 그래서 재회는 “한 번 더”가 아니라 <b>규칙을 바꾸는 일</b>이어야 합니다.':'원국에 충이 없어 관계가 끊기는 방식이 급격하지 않습니다. 대신 <b>서서히 식는</b> 쪽이라, 재회도 서서히 시작됩니다.')+'</p>';
  h+=H('헤어진 이유가 바뀌었는가')+'<p>헤어진 이유를 세 줄로 적어보세요. 그중 <b>두 줄이 아직 그대로</b>라면 지금의 재회는 같은 결말을 한 번 더 겪는 일이 됩니다.</p>';
  h+=H('이 사주가 그리워하는 것')+'<p>'+S.DM_DEEP[R.dStem].in+' 그래서 그리운 것이 상대보다 <b>그때의 나</b>인 경우가 많습니다. 둘을 구분하면 연락의 문장이 훨씬 담백해집니다.</p>';
  h+=H('재회가 되는 경우')+UL(['헤어진 이유가 <b>상황</b>이었고 상황이 실제로 바뀌었을 때','한 사람이 먼저 <b>조건을 내려놓았을 때</b>','연락이 아니라 <b>만남</b>으로 이어질 계기가 있을 때']);
  return h+K('먼저 확인할 것','그 사람이 지금 어떤 자리에 있는지 아는가. 모른 채 보내는 연락은 이 사주를 더 지치게 합니다.');
}
function re2(R,c,input,name){
  var pc=partnerChart(input),h='';
  if(pc){
    var R2=pc.R, rel=S.branchRel(R.dBranch,R2.dBranch);
    h+='<p>상대의 일지는 '+brB(R2.dBranch)+', 이 사주와는 <b>'+rel.k+'</b>입니다. '+rel.t+'</p>';
    h+='<p>상대의 중심 별은 <b>'+pc.c.topGodInGrp+'</b> — '+S.GOD_DEEP[pc.c.topGodInGrp]+'</p>';
    h+=H('상대의 지금');
    var sn=R.seun[0], pg=S.tenGod(R2.dStem,sn.idx%10);
    h+='<p>'+sn.year+'년 상대의 세운은 <b>'+pg+'</b>. '+S.PARTNER_MIND[S.GOD_GROUP[pg]]+'</p>';
    h+=H('다시 이어질 때 달라지는 것');
    h+='<p>두 사람의 일간은 '+S.EL_KO[R.dayEl]+'과 '+S.EL_KO[R2.dayEl]+'입니다. '+(S.generates(R2.dayEl,R.dayEl)?'상대의 기운이 이 사주를 살리는 구조라, 상대가 먼저 움직이면 관계가 빨리 회복됩니다.':(S.generates(R.dayEl,R2.dayEl)?'이 사주의 기운이 상대를 살립니다. 먼저 움직이는 쪽은 늘 이 사주였을 가능성이 큽니다.':'두 기운이 서로를 누르지는 않지만, 생활의 리듬이 달라 같은 문제가 반복되기 쉽습니다.'))+'</p>';
    h+='<p>상대의 배우자궁은 '+brB(R2.dBranch)+' — '+S.SPOUSE[R2.dBranch]+' 쪽을 원하는 사람입니다. 이 사주가 그 자리에 있는지 스스로에게 물어보세요.</p>';
  } else {
    h+='<p>상대의 생년월일이 없으면 재회의 문은 이 사주의 세운만으로 봅니다. 상대의 생년월일을 넣으면 두 사람의 일지·일간까지 짚어드립니다.</p>';
    h+=H('이 사주가 다시 끌리는 사람')+'<p>'+S.LOVE_ATTRACT[R.dayEl]+'</p>';
  }
  return h+K('상대의 속도','상대가 압박을 받는 시기라면 연락은 <b>한 번만</b>. 두 번째부터는 상대의 속도가 아니라 내 불안이 움직입니다.');
}
function re3(R,c,input,name){
  var reads=[]; for(var i=0;i<R.seun.length;i++) reads.push(S.yearRead(R,R.seun[i].year));
  var ys=reads.filter(function(r){return r.grp==='재성'||r.grp==='관성';});
  var h=H('연락의 문');
  h+='<p>연락은 <b>배우자성</b>이 세운으로 들어오는 해에 열립니다. '+(ys.length?('앞으로 다섯 해 중 <b>'+ys.map(function(r){return r.y+'년 '+r.gz;}).join(', ')+'</b>이 그 해입니다. '+ys[0].why):'앞으로 다섯 해에는 그 문이 뚜렷하지 않습니다. 이 시기는 기다림보다 내 생활을 세우는 쪽이 맞습니다.')+'</p>';
  h+=seunTable(R,c,5);
  var now=new Date(), tops=[];
  for(var k=0;k<8;k++){
    var yy=now.getFullYear(), mo=now.getMonth()+1+k;
    while(mo>12){ mo-=12; yy++; }
    var mr=S.monthRead(R,yy,mo);
    if(mr.rels.some(function(x){return x.type==='육합';})) tops.push(yy+'.'+(mo<10?'0'+mo:mo)+' '+mr.gz);
  }
  h+='<p>'+(tops.length?'일지와 합이 걸리는 달은 <b>'+tops.slice(0,3).join(', ')+'</b>입니다. 이 달의 연락은 상대도 마음이 열려 있습니다.':'앞으로 8개월은 일지와 합이 걸리는 달이 뚜렷하지 않습니다. 연락보다 만남의 자리를 먼저 만드세요.')+'</p>';
  h+=H('달 단위로 보기')+monthsBlock(R,c,'love',6,'앞으로 6개월 중 연락이 오갈 달입니다.');
  return h+K('한 줄','일지와 충하는 달에 들어온 연락은 감정이 앞서 있습니다. 그 달에 결정하지 마세요.');
}
function re4(R,c,input,name){
  var pc=partnerChart(input);
  var h=H('첫 문장')+'<p>“잘 지내?”는 이 사주에게 가장 어려운 문장입니다. 대신 <b>구체적인 기억 하나</b>를 꺼내세요. “지난번에 말한 그 책, 다 읽었어.” — 이 사주가 기억을 오래 하는 사람이라는 걸 상대도 압니다.</p>';
  h+=H('보내지 말아야 할 문장')+UL(['“나 아직 너 생각해.” — 마음은 전해지지만 결정을 상대에게 넘깁니다.','“우리 다시 해볼 수 있을까.” — 너무 큰 문장입니다.','긴 문자 — 상대에게 숙제가 됩니다.']);
  h+=H('보내는 시간')+'<p>밤 10시 이후는 피하세요. 이 사주는 밤에 감정이 깊어져 다음 날 아침 후회할 문장을 만듭니다. <b>낮 시간</b>에 보내세요.</p>';
  if(pc){ h+=H('상대에게 통하는 화법')+'<p>상대의 일간은 '+stemB(pc.R.dStem)+'. '+S.DAY_MASTER[pc.R.dStem][0]+' — 이 결의 사람에게는 짧고 분명한 문장이 잘 닿습니다.</p>'; }
  return h+K('답이 없을 때','한 번 보내고 <b>일주일</b>을 기다리세요. 그 안에 답이 없으면 이 사주가 먼저 정리하는 편이 맞습니다.');
}
function re5(R,c,input,name){
  var h='<p>재회를 그만두어야 할 신호는 감정이 아니라 <b>생활</b>에서 먼저 나타납니다.</p>';
  h+=UL(['잠들기 전 연락을 확인하는 습관이 <b>2주</b>를 넘겼을 때','상대의 SNS를 하루에 세 번 이상 보게 될 때','다시 만나면 바뀔 것이라는 생각이 <b>구체적인 한 가지</b>로 설명되지 않을 때']);
  h+=H('정리하는 순서')+'<p>연락을 끊는 것이 아니라 <b>시간을 정하는 것</b>부터 시작하세요. “한 달은 내 일에만 쓴다.” 이 사주는 시간을 정하면 지킬 힘이 있습니다.</p>';
  h+=H('그 뒤에 오는 것')+'<p>이 사주는 정리하고 나면 회복이 빠른 편입니다. 다만 회복을 서두르면 같은 사람에게 다시 마음이 갑니다. <b>한 달</b>은 비워두세요.</p>';
  return h+K('한 줄','그리움은 사랑이 아니라 습관일 때가 많습니다. 습관은 3주면 바뀝니다.');
}
function re6(R,c,input,name){
  var h=H('다시 이어졌을 때의 세 가지')+UL([
    '<b>같은 자리</b> — 헤어진 이유가 반복되는가',
    '<b>바뀐 자리</b> — 무엇이 실제로 달라졌는가',
    '<b>새 자리</b> — 두 사람이 함께 만들 수 있는 것이 있는가'
  ]);
  h+=H('이 사주가 다시 무너지는 지점')+'<p>'+S.LOVE_SHADOW[R.dayEl]+'</p>';
  h+=H('관계를 다시 세우는 규칙')+UL(['싸운 뒤 24시간은 중요한 말을 미루기','한 주에 한 번은 관계가 아닌 이야기 하기','돈과 시간의 균형을 정해두기']);
  return h+K('한 줄','재회는 <b>다시 시작</b>이 아니라 <b>다시 설계</b>입니다.');
}
function re7(R,c,input,name){
  return monthsBlock(R,c,'love',6,'앞으로 6개월, 연락과 만남의 문을 봤습니다.')+
    K('한 줄','합의 달에는 먼저 다가가고, 충의 달에는 정리에 쓰세요.');
}

/* ---------- 내 연애 패턴 ---------- */
function pt1(R,c,input,name){
  var dd=S.deep(R);
  var h=window.CH.facts(R);
  h+='<p>이 사주가 끌리는 사람은 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>의 반대편에 있습니다. '+S.LOVE_ATTRACT[R.dayEl]+'</p>';
  h+=H('왜 그 사람에게 끌리는가')+'<p>이 사주의 가장 얇은 기운은 '+window.CH.elB(c.leastI)+'입니다. 그래서 그 기운을 가진 사람에게서 <b>내게 없는 것</b>을 느끼고, 관계가 깊어질수록 기대도 커집니다. 기대를 말로 옮기는 연습이 필요합니다.</p>';
  h+='<p>끌리는 사람은 '+window.CH.elB(c.leastI)+' 쪽, 오래 가는 사람은 '+window.CH.elB(dd.yong)+' 쪽입니다. '+S.LOVE_FIT[R.dayEl]+'</p>';
  return h+K('한 줄','설렘이 6개월을 넘기면 그다음은 <b>생활의 리듬</b>이 결정합니다.');
}
function pt2(R,c,input,name){
  var h='<p>반복되는 장면의 출발점은 일지 '+brB(R.dBranch)+'입니다. '+S.BR_INNER[R.dBranch]+'</p>';
  h+=H('이 사주가 반복하는 실수')+'<p>'+S.LOVE_MISTAKE_GOD[c.topGodInGrp]+'</p>';
  h+=H('끊어내는 세 가지')+UL(['<b>사흘 규칙</b> — 흔들린 일은 사흘 뒤에 결론','<b>한 문장</b> — 하고 싶은 말을 한 문장으로 적어두기','<b>한 번</b> — 연락은 한 번만, 두 번째는 내 불안']);
  return h+K('가장 큰 변화','상대를 고치려는 마음을 내려놓을 때 관계가 달라집니다. '+S.LOVE_SHADOW[R.dayEl].split('.')[0]+'.');
}
function pt3(R,c,input,name){
  var h=H('상처가 되는 말')+'<p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>';
  h+=H('내가 상처받는 지점')+'<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>을 무시당할 때 가장 크게 다칩니다. 그래서 싸움의 내용보다 <b>말투</b>가 오래 남습니다.</p>';
  h+=H('회복의 순서')+UL(['그날 안에 <b>사실</b>만 말하기','상대의 말을 되풀이해 확인하기','결론은 다음 날로 미루기']);
  return h+K('한 줄','이 사주에게 화해는 “잘못했다”보다 <b>“그 말은 내가 너무 심했어”</b> 한 문장으로 옵니다.');
}
function pt4(R,c,input,name){
  var h='<p>이 사주의 매력은 꾸밈이 아니라 <b>결</b>에서 나옵니다. '+S.LOVE_CHARM[R.dayEl]+'</p>';
  h+=H('매력이 커지는 조건')+UL(['잠을 충분히 잔 날의 얼굴','내 이야기를 한 가지 준비해두는 것',S.EL_KO[c.yongEl]+' 색 소품 하나 — '+S.EL_DEEP[c.yongEl].color]);
  h+=H('매력이 죽는 조건')+'<p>상대의 반응을 재는 순간입니다. 이 사주는 확인하려고 할수록 말이 무거워집니다.</p>';
  return h+K('개운',S.EL_DEEP[c.yongEl].habit+' — 몸이 편하면 표정이 먼저 달라집니다.');
}
function pt5(R,c,input,name){
  var h=H('설레는 사람')+'<p>'+S.LOVE_ATTRACT[R.dayEl]+'</p>';
  h+=H('오래 가는 사람')+'<p>'+S.LOVE_FIT[R.dayEl]+'</p>';
  h+=H('두 사람이 겹치는지 확인하는 법')+UL(['대화 뒤에 피곤한가, 편안한가','내 일정을 바꿀 때 서운함이 남는가','다툰 뒤에 누가 먼저 회복하는가']);
  return h+K('한 줄','설렘은 6개월, 맞음은 6년입니다. 이 사주는 6개월의 설렘으로 6년을 결정하는 경향이 있습니다.');
}
function pt6(R,c,input,name){
  var h=H('패턴을 끊는 연습')+UL([
    '<b>기록</b> — 이별의 이유를 세 줄로 적어두기. 같은 문장이 반복되면 그것이 패턴입니다.',
    '<b>속도</b> — 마음이 생긴 뒤 3주는 표현을 서두르지 않기.',
    '<b>말</b> — 좋으면 좋다고, 서운하면 서운하다고 그날 말하기.'
  ]);
  h+=H('이 사주가 특히 조심할 것')+'<p>'+S.LOVE_SHADOW[R.dayEl]+'</p>';
  return h+K('한 줄','패턴은 성격이 아니라 습관입니다. 습관은 하나만 바꿔도 결과가 달라집니다.');
}
function pt7(R,c,input,name){
  return monthsBlock(R,c,'love',6,'앞으로 6개월의 연애 흐름입니다.')+
    K('한 줄','합의 달에는 먼저 다가가고, 충의 달에는 정리에 쓰세요.');
}

window.CTP.love={
  sseom:[
    {title:'좋아할 때 드러나는 신호',sub:'나의 연애 언어와 상대가 읽는 나',body:sm1},
    {title:'상대의 지금',sub:'상대가 보고 있는 것',body:sm2},
    {title:'두 사람의 온도',sub:'지금 어느 쪽이 앞서 있는가',body:sm3},
    {title:'지금 밀어도 되는가',sub:'연락의 순서와 기한',body:sm4},
    {title:'대화의 기술',sub:'부딪히는 방식과 화해법',body:sm5},
    {title:'오해가 생기는 지점',sub:'반복하는 실수',body:sm6},
    {title:'인연의 6개월',sub:'만남이 열리는 달',body:sm7}
  ],
  reunion:[
    {title:'재회의 조건',sub:'돌아오면 무엇이 달라지는가',body:re1},
    {title:'상대의 마음',sub:'지금 상대의 자리',body:re2},
    {title:'연락이 열리는 시기',sub:'해와 달로 보는 창',body:re3},
    {title:'첫 연락의 문장',sub:'보낼 말과 보내지 말 말',body:re4},
    {title:'그만두어야 할 신호',sub:'정리의 순서',body:re5},
    {title:'다시 이어졌을 때',sub:'무너지는 지점과 새 규칙',body:re6},
    {title:'연락의 6개월',sub:'문이 열리는 달',body:re7}
  ],
  pattern:[
    {title:'끌리는 사람',sub:'왜 그 사람에게 마음이 가는가',body:pt1},
    {title:'반복되는 장면',sub:'이별의 이유가 같은 이유',body:pt2},
    {title:'상처가 되는 말',sub:'다치는 지점과 회복법',body:pt3},
    {title:'매력의 무기',sub:'커지는 조건, 죽는 조건',body:pt4},
    {title:'설렘과 맞음',sub:'끌리는 사람 vs 오래 가는 사람',body:pt5},
    {title:'패턴을 끊는 법',sub:'세 가지 연습',body:pt6},
    {title:'연애의 6개월',sub:'달별 흐름',body:pt7}
  ]
};
})();
