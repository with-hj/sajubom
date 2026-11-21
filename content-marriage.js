/* 천령당 — 궁합·결혼·이혼 : 커플 궁합 · 결혼 시기 · 이혼/위기 */
(function(){
'use strict';
var C=window.CH, S=C.S;
var P=C.P,H=C.H,UL=C.UL,K=C.K,elB=C.elB,stemB=C.stemB,brB=C.brB;
var monthsBlock=C.monthsBlock, seunTable=C.seunTable, risky=C.riskyMonthsText, yearOfStar=C.yearOfStar, partnerChart=C.partnerChart;
window.CTP=window.CTP||{};

function wedYears(R,input){
  var star=(input.gender==='f')?'관성':'재성';
  return {star:star,ys:yearOfStar(R,star)};
}

/* ---------- 커플 궁합 ---------- */
function cp1(R,c,input,name){
  var pc=partnerChart(input),h='';
  if(pc){
    var R2=pc.R, sc=S.coupleScore(R,R2);
    h+='<div class="ch-key" style="margin-bottom:12px"><b>기본 궁합 '+sc.s+'점</b><span>'+sc.notes.join(' · ')+'</span></div>';
    h+='<p>두 사람의 일간은 '+stemB(R.dStem)+'과 '+stemB(R2.dStem)+'. '+S.DAY_MASTER[R.dStem][0]+'와 '+S.DAY_MASTER[R2.dStem][0]+'가 만나는 구조입니다.</p>';
    h+=H('일간이 만나는 자리');
    h+='<p>'+(S.generates(R2.dayEl,R.dayEl)?'상대의 기운이 이 사주를 살립니다. 상대가 먼저 움직일 때 관계가 부드러워집니다.':(S.generates(R.dayEl,R2.dayEl)?'이 사주의 기운이 상대를 살립니다. 다만 이 사주가 지치면 관계 전체가 무거워집니다.':(R.dayEl===R2.dayEl?'두 사람의 결이 같아 통하는 부분이 많습니다. 다만 같은 약점도 함께 커집니다.':'두 기운이 서로를 누르지도 살리지도 않아, 생활의 규칙이 관계를 지탱합니다.')))+'</p>';
    h+=H('일지가 만나는 자리');
    var rel=S.branchRel(R.dBranch,R2.dBranch);
    h+='<p><b>'+rel.k+'</b> — '+rel.t+'</p>';
    h+=H('서로에게 없는 것');
    h+='<p>이 사주에게 얇은 기운은 '+elB(c.leastI)+', 상대에게 얇은 기운은 '+elB(pc.c.leastI)+'. '+(c.leastI===pc.c.leastI?'두 사람 모두 같은 기운이 얇아 그 부분은 서로 채워주지 못합니다. 생활에서 의식적으로 만들어야 합니다.':'서로 다른 기운이 비어 있어 채워줄 수 있습니다. 이 사주가 상대에게 '+S.EL_KO[pc.c.leastI]+'의 환경을 만들어주면 관계가 편해집니다.')+'</p>';
  } else {
    h+='<p>상대의 생년월일이 비어 있어 두 사람의 점수는 아직 계산되지 않았습니다. 위쪽 <b>상대방 정보</b>를 켜고 생년월일을 넣으면 일간·일지·오행까지 계산해 드립니다.</p>';
    h+=H('지금은 이 사주의 배우자궁부터')+'<p>배우자궁인 일지 '+brB(R.dBranch)+'는 <b>'+S.SPOUSE[R.dBranch]+'</b>을 가리킵니다. '+S.BR_INNER[R.dBranch]+'</p>';
    h+=H('궁합에서 먼저 볼 세 가지')+UL(['<b>일간</b> — 서로를 살리는지, 누르는지','<b>일지</b> — 생활의 리듬이 붙는지 부딪히는지','<b>비어 있는 기운</b> — 상대가 내게 없는 것을 채워주는지']);
  }
  return h+K('한 줄','궁합은 잘 맞는 사람을 찾는 일이 아니라 <b>어긋나는 방식을 미리 아는 일</b>입니다.');
}
function cp2(R,c,input,name){
  var pc=partnerChart(input),h=H('이 사주의 생활 리듬')+'<p>'+S.MARR_HABIT_BR[R.dBranch]+'</p>';
  if(pc){ h+='<p>상대의 생활 리듬은 '+S.MARR_HABIT_BR[pc.R.dBranch]+' 두 사람의 리듬이 다르면 사랑보다 <b>시간표</b>가 먼저 부딪힙니다.</p>'; }
  h+=H('부딪히는 세 가지')+UL(['잠드는 시간과 아침의 말','집안일의 기준','주말을 보내는 방식']);
  h+=H('미리 정해두면 되는 것')+'<p>이 사주는 말로 정해두면 지킬 수 있는 사람입니다. 정하지 않으면 서운함으로 쌓입니다.</p>';
  return h+K('한 줄','결혼생활은 <b>규칙 세 개</b>로 버팁니다. 그 이상은 서로를 피곤하게 합니다.');
}
function cp3(R,c,input,name){
  var h=H('이 사주의 정서 온도')+'<p>'+S.MARR_TEMP[R.dayEl]+'</p>';
  h+=H('애정을 표현하는 방식')+'<p>'+S.LOVE_LANG[R.dayEl]+'</p>';
  h+=H('온도차가 생길 때')+'<p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>';
  h+=H('맞추는 법')+UL(['상대의 표현 방식을 <b>번역</b>해보기. 말이 아니라 행동으로 오는 애정 찾기','내가 원하는 표현을 한 문장으로 알려주기','하루 한 번 짧은 안부를 규칙으로 두기']);
  return h+K('한 줄','온도가 다른 두 사람은 <b>표현의 횟수</b>를 맞추면 오래 갑니다.');
}
function cp4(R,c,input,name){
  var h=H('이 사주가 돈을 다루는 방식')+'<p>'+S.MARR_MONEY_GRP[c.topGrp]+'</p>';
  h+=H('역할을 나누는 법')+
    '<table class="tbl"><tr><th>영역</th><th>맡기면 좋은 쪽</th></tr>'+
    '<tr><td>고정 지출·공과금</td><td>숫자를 보는 데 익숙한 쪽</td></tr>'+
    '<tr><td>큰 지출 결정</td><td>두 사람이 함께, 한 번 쉬고 결정</td></tr>'+
    '<tr><td>양가 일정·선물</td><td>관계를 챙기는 데 부담이 적은 쪽</td></tr>'+
    '<tr><td>저축·투자</td><td>'+S.EL_KO[c.yongEl]+' 기운이 강한 쪽이 기준을 잡기</td></tr></table>';
  h+=H('집안일의 기준')+'<p>이 사주는 <b>기준이 있는 쪽</b>입니다. 기준을 말하지 않고 혼자 치우면 서운함이 쌓입니다. “나는 이렇게 하는 게 편해”를 먼저 말하세요.</p>';
  return h+K('한 줄','돈은 합치지 말고 <b>구조</b>를 합치세요. 통장은 나누되 기준은 하나로.');
}
function cp5(R,c,input,name){
  var h=H('반복해서 부딪히는 지점')+'<p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>';
  h+=H('두 사람의 차이')+'<p>이 사주의 십성 구조는 <b>'+c.topGrp+'</b>가 중심입니다. '+S.GROUP_MEAN[c.topGrp]+' 상대의 중심이 다른 기운이라면, 같은 상황에서 <b>다른 것을 중요하게</b> 여깁니다. 이 차이가 다툼의 대부분입니다.</p>';
  h+=H('다툼을 줄이는 순서')+UL(['상황을 말할 때 <b>사실</b>부터','상대의 의도를 추측하지 않고 묻기','결론은 하루 뒤에']);
  return h+K('한 줄','이 사주는 <b>무시당했다</b>고 느낄 때 크게 다칩니다. 말투 하나가 관계를 바꿉니다.');
}
function cp6(R,c,input,name){
  var h=H('화해의 순서')+UL(['24시간은 중요한 말을 미루기','먼저 <b>한 문장</b>만 꺼내기 — “어제 내가 말이 심했어”','상대의 말을 끝까지 듣고 되풀이해 확인하기']);
  h+=H('이 사주의 회복법')+'<p>'+(S.MARR_SOLUTION[c.topGrp]||'각자의 시간을 보장하고, 함께하는 시간을 정기적으로 두세요.')+'</p>';
  h+=H('싸운 뒤 다시 말을 거는 방식')+'<p>이 사주는 <b>행동</b>으로 화해하는 편입니다. 밥을 챙기고, 물을 갖다주고, 일정을 확인합니다. 상대가 말을 원한다면 그 행동에 한 문장을 더하세요.</p>';
  return h+K('한 줄','부부는 역할을 나누고 감정은 나누지 않을 때 오래 갑니다.');
}
function cp7(R,c,input,name){
  var h=H('앞으로 5년의 부부운')+'<p>두 사람의 관계가 구체적으로 움직이는 해를 짚었습니다.</p>'+seunTable(R,c,5);
  h+=H('12개월 흐름')+monthsBlock(R,c,'marriage',12,'앞으로 12개월, 두 사람 사이의 날씨입니다.');
  return h+K('한 줄','충의 달에는 큰 결정을 미루고, 합의 달에 함께 계획하세요.');
}

/* ---------- 결혼 시기 ---------- */
function wd1(R,c,input,name){
  var w=wedYears(R,input);
  var h='<p>이 사주에서 결혼의 문은 <b>'+w.star+'</b>이 열어요. '+(w.ys.length?('앞으로 5년 중 '+w.ys.map(function(o){return '<b>'+o.y+'년('+o.g+')</b>';}).join(', ')+'이 그 문이 열리는 해입니다.'):('앞으로 5년에는 '+w.star+'이 세운으로 뚜렷하게 들어오지 않아, 해보다 사람을 만나는 자리의 밀도가 중요합니다.'))+'</p>';
  h+=seunTable(R,c,5);
  h+=H('문이 열리는 달')+monthsBlock(R,c,'marriage',6,'결혼 이야기가 구체화되기 좋은 달입니다.');
  return h+K('한 줄','날짜보다 <b>조건</b>이 먼저입니다. 조건이 정리되면 날짜는 자연스럽게 정해집니다.');
}
function wd2(R,c,input,name){
  var pc=partnerChart(input);
  var h=H('배우자궁이 말하는 사람')+'<p>일지 '+brB(R.dBranch)+'는 <b>'+S.SPOUSE[R.dBranch]+'</b>을 가리킵니다. '+S.BR_INNER[R.dBranch]+'</p>';
  h+=H('끌리는 사람과 오래 가는 사람')+'<p><b>끌리는 사람</b> — '+S.LOVE_ATTRACT[R.dayEl]+'</p><p><b>오래 가는 사람</b> — '+S.LOVE_FIT[R.dayEl]+'</p>';
  if(pc){
    h+=H('지금 상대가 배우자감인지')+'<p>상대의 일주는 '+S.STEM_HAN[pc.R.dStem]+S.BR_HAN[pc.R.dBranch]+', 배우자궁은 '+brB(pc.R.dBranch)+'입니다. 두 사람의 일지 관계는 <b>'+S.branchRel(R.dBranch,pc.R.dBranch).k+'</b>. '+S.branchRel(R.dBranch,pc.R.dBranch).t+'</p>';
    h+='<p>배우자감은 설렘보다 <b>생활의 리듬</b>으로 판단하세요. 두 사람의 리듬은 각각 “'+S.MARR_HABIT_BR[R.dBranch].split('.')[0]+'”, “'+S.MARR_HABIT_BR[pc.R.dBranch].split('.')[0]+'”입니다.</p>';
  } else {
    h+='<p>상대의 생년월일을 넣으면 두 사람의 일지·일간으로 배우자감을 더 정확히 볼 수 있습니다.</p>';
  }
  return h+K('한 줄','이 사주에게 배우자는 <b>설레게 하는 사람</b>보다 <b>편하게 하는 사람</b>입니다.');
}
function wd3(R,c,input,name){
  var h=H('결혼 전에 정리해야 하는 세 가지')+UL([
    '<b>생활비</b> — 각자 얼마를 어떤 방식으로 낼지',
    '<b>거주지</b> — 양가와의 거리, 직장과의 거리',
    '<b>역할</b> — 집안일과 양가 일정의 분담'
  ]);
  h+='<p>이 세 가지가 정리되지 않으면 마음이 커도 결정이 흔들립니다. 이 사주는 특히 <b>돈의 구조</b>에서 불안을 느낍니다.</p>';
  h+='<p>'+S.MARR_MONEY_GRP[c.topGrp]+'</p>';
  return h+K('한 줄','결혼 전에 <b>한 번 싸워보는 것</b>이 좋습니다. 싸움의 방식이 결혼생활의 방식을 보여줍니다.');
}
function wd4(R,c,input,name){
  var h=H('날짜를 정하는 법')+'<p>이 사주는 <b>'+S.EL_KO[c.yongEl]+'</b>의 기운이 필요한 사주입니다. '+S.EL_DEEP[c.yongEl].season+'에 예식을 잡으면 마음이 편합니다. 가능하면 '+S.EL_DEEP[c.yongEl].dir+' 방향의 예식장이 좋습니다.</p>';
  h+=H('형식')+'<p>이 사주는 규모보다 <b>참석한 사람의 밀도</b>가 중요한 사람입니다. 큰 예식보다 가까운 사람이 중심에 있는 자리가 오래 기억에 남습니다.</p>';
  h+=H('피하면 좋은 달')+'<p>'+risky(R,c,12)+'</p>';
  return h+K('한 줄','예식 날짜는 두 사람의 사주에서 <b>합</b>이 붙는 달이 좋습니다.');
}
function wd5(R,c,input,name){
  var h=H('양가와의 거리')+'<p>이 사주는 <b>'+S.BR_INNER[R.dBranch].split('.')[0]+'</b> 쪽이라, 가까운 사람에게 다정하지만 선이 분명합니다. 양가와의 거리는 가까움보다 <b>규칙</b>이 중요합니다.</p>';
  h+=H('정해두면 좋은 것')+UL(['명절·생일 일정을 미리 정하기','양가에 대한 이야기는 각자 자기 부모를 맡기','금전 지원의 선을 정하기']);
  h+=H('이 사주가 특히 조심할 것')+'<p>배우자보다 부모의 말이 먼저 나오면 관계가 흔들립니다. 결정의 순서를 <b>두 사람 → 양가</b>로 지키세요.</p>';
  return h+K('한 줄','양가와의 거리는 <b>정한 규칙</b>이 감정보다 오래 갑니다.');
}
function wd6(R,c,input,name){
  var h=H('결혼 후 3년')+'<p>결혼 초반은 두 사람의 생활 리듬이 맞춰지는 시간입니다. 이 사주는 '+S.MARR_HABIT_BR[R.dBranch]+'</p>';
  h+=H('첫 1년')+'<p>역할을 정하는 시기입니다. 이 사주가 혼자 다 하려는 습관이 나오면, 1년 뒤에 서운함으로 돌아옵니다. 처음부터 <b>반씩</b> 나누세요.</p>';
  h+=H('2~3년')+'<p>관계의 온도가 익숙해지는 시기입니다. '+S.MARR_TEMP[R.dayEl]+' 이때 필요한 것은 이벤트가 아니라 <b>반복되는 확인</b>입니다.</p>';
  h+=H('3년 뒤')+'<p>이 사주는 3년을 지나면 관계가 안정됩니다. 다만 안정과 무관심은 다릅니다. 한 달에 한 번은 관계가 아닌 이야기로 웃어보세요.</p>';
  return h+K('한 줄','결혼 초반의 규칙이 10년을 정합니다.');
}
function wd7(R,c,input,name){
  return monthsBlock(R,c,'marriage',12,'앞으로 12개월, 결혼 이야기가 움직이는 달입니다.')+
    K('한 줄','합의 달에 상견례·날짜·집 이야기를 꺼내세요.');
}

/* ---------- 이혼 / 위기 ---------- */
function dv1(R,c,input,name){
  var single=C.singleOf(input);
  var h='';
  if(single){
    h+='<p>아직 결혼 전이라면 이 탭은 <b>앞으로의 관계에서 반복될 위기 패턴</b>을 미리 보는 용도입니다. 이혼을 전제하지 않고, 이 사주가 관계에서 무너지는 지점을 봅니다.</p>';
  } else {
    h+='<p>명리에서 이혼수는 “이혼한다”는 예언이 아니라 <b>관계가 흔들리는 해</b>를 가리킵니다.</p>';
  }
  h+=H('이 사주의 위기 신호')+'<p>'+S.MARR_CRISIS_BR[R.dBranch]+'</p>';
  h+=H('갈등이 커지는 구조')+'<p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>';
  h+=H('위기가 오는 방식')+'<p>이 사주는 <b>'+c.topGrp+'</b>이 중심이라, 그 기운이 무시당한다고 느낄 때 조용히 마음을 닫습니다. 상대는 이유를 모른 채 끝났다고 느낍니다.</p>';
  return h+K('한 줄','위기는 <b>큰 사건</b>이 아니라 <b>작은 침묵</b>으로 시작됩니다.');
}
function dv2(R,c,input,name){
  var danger=[];
  for(var i=0;i<R.seun.length;i++){ if(S.mod(R.seun[i].idx%12-R.dBranch,12)===6) danger.push(R.seun[i].year); }
  var h=H('흔들리는 해')+'<p>'+(danger.length?('앞으로 5년 중 일지와 충하는 해는 <b>'+danger.join(', ')+'년</b>입니다. 이 해에는 이사·이직·별거 같은 생활 변화가 겹치기 쉬워 작은 갈등이 크게 느껴집니다.'):'앞으로 5년에는 일지와 직접 충하는 해가 없습니다. 대신 갈등이 쌓이는 구조를 점검하세요.')+'</p>';
  h+=seunTable(R,c,5);
  h+=H('달 단위')+'<p>'+risky(R,c,12)+'</p>';
  return h+K('한 줄','충의 해에는 <b>큰 결정을 3개월 단위로</b> 나눠 확인하세요.');
}
function dv3(R,c,input,name){
  var h=H('반복되는 갈등의 구조')+'<p>'+S.MARR_CRISIS_BR[R.dBranch]+'</p>';
  h+=H('이 사주가 상대에게 바라는 것')+'<p>'+S.GROUP_MEAN[c.topGrp]+' 그래서 상대가 이 부분을 <b>당연하게 여긴다</b>고 느낄 때 서운함이 쌓입니다.</p>';
  h+=H('상대가 이 사주에게 바라는 것')+'<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해, 자기 방식으로 상대를 챙깁니다. 그 챙김이 상대에게는 통제나 무관심으로 보일 수 있습니다.</p>';
  return h+K('한 줄','갈등의 대부분은 <b>사랑의 방식이 다르다</b>는 데서 옵니다.');
}
function dv4(R,c,input,name){
  var h=H('결정 전 세 질문')+UL([
    '상대가 바뀌지 않아도 <b>내가 견딜 수 있는가</b>.',
    '이 관계에서 <b>내가 잃은 것이 나인지 상대인지</b>.',
    '지금 결정하면 <b>1년 뒤의 내가 고마워할까</b>.'
  ]);
  h+=H('이 사주가 판단을 흐리는 지점')+'<p>'+S.DM_DEEP[R.dStem].drain+' 이 상태에서 내린 결정은 대개 <b>감정의 정리</b>이지 관계의 정리가 아닙니다.</p>';
  h+=H('순서')+'<p>결정을 미루는 것이 아니라 <b>조건을 확인</b>하세요. 돈, 거주, 아이, 양가 — 네 가지 중 무엇이 실제로 바뀔 수 있는지 적어보면 답이 보입니다.</p>';
  return h+K('한 줄','결정은 <b>화가 가라앉은 뒤</b>에. 이 사주는 화가 식는 데 사흘이면 충분합니다.');
}
function dv5(R,c,input,name){
  var kidHas=C.kidOf(input)==='have';
  var h='';
  if(kidHas){
    h+=H('아이가 있을 때')+'<p>아이는 부모의 관계를 <b>해석</b>하면서 자랍니다. 이 사주는 감정을 말로 풀기보다 조용히 정리하는 편이라, 아이는 상황을 모른 채 불안해할 수 있습니다.</p>';
    h+=H('아이에게 해야 할 말')+UL(['“엄마·아빠 사이 문제는 너 때문이 아니야.”','“우리가 너를 떠나는 게 아니야.”','아이 앞에서 상대를 평가하지 않기']);
    h+=H('이 사주가 특히 조심할 것')+'<p>아이에게 <b>편을 묻는 말</b>입니다. 이 사주는 정이 많아 아이에게 기대고 싶어지지만, 그 기대는 아이에게 너무 큽니다.</p>';
  } else {
    h+=H('아이가 없다면')+'<p>결정이 훨씬 가볍습니다. 다만 이 사주는 <b>정</b>이 많아 “아이가 있었으면 달랐을까”를 오래 생각합니다. 그 생각이 결정을 흔들지 않도록, 결정의 이유를 세 줄로 적어두세요.</p>';
    h+=H('정리 후의 생활')+UL(['주거와 수입 구조를 먼저 확인하기','가까운 사람 두 명에게만 알리기','한 달은 큰 결정을 미루기']);
  }
  return h+K('한 줄','아이의 안정은 부모의 <b>일관된 태도</b>에서 옵니다.');
}
function dv6(R,c,input,name){
  var h=H('결정한 뒤의 흐름')+'<p>이 사주는 정리하고 나면 회복이 빠른 편입니다. 다만 <b>재정리</b>의 유혹이 두 번 옵니다. 보통 3개월과 1년입니다.</p>';
  h+=H('3개월')+'<p>외로움이 가장 큰 시기입니다. 이때 연락하면 같은 결말을 반복합니다. 새 일정을 미리 채워두세요.</p>';
  h+=H('1년')+'<p>생활이 안정되면서 “그때 잘못했나” 하는 생각이 옵니다. 그 생각은 관계가 아니라 <b>익숙함</b>을 그리워하는 것입니다.</p>';
  h+=H('이 사주의 회복법')+'<p>'+S.EL_DEEP[c.yongEl].habit+' · '+S.EL_DEEP[c.yongEl].food+'. 몸이 먼저 회복되면 마음도 따라옵니다.</p>';
  return h+K('한 줄','회복은 <b>새로운 반복</b>을 만드는 일입니다.');
}
function dv7(R,c,input,name){
  return monthsBlock(R,c,'marriage',6,'앞으로 6개월, 두 사람 사이의 기압을 봤습니다.')+
    K('한 줄','충의 달에는 대화를 짧게, 합의 달에는 길게.');
}

window.CTP.marriage={
  couple:[
    {han:'合',title:'두 사람의 기본 궁합',sub:'일간·일지·오행',body:cp1},
    {han:'性',title:'생활 리듬의 차이',sub:'시간표가 먼저 부딪힌다',body:cp2},
    {han:'情',title:'정서 온도',sub:'애정을 표현하는 방식',body:cp3},
    {han:'家',title:'돈과 역할',sub:'살림의 현실 궁합',body:cp4},
    {han:'異',title:'부딪히는 지점',sub:'반복되는 갈등',body:cp5},
    {han:'和',title:'화해의 순서',sub:'싸운 뒤 다시 말 거는 법',body:cp6},
    {han:'五',title:'5년과 12개월',sub:'두 사람의 날씨',body:cp7}
  ],
  wedding:[
    {han:'期',title:'결혼의 문',sub:'문이 열리는 해와 달',body:wd1},
    {han:'人',title:'배우자의 결',sub:'배우자궁이 말하는 사람',body:wd2},
    {han:'家',title:'결혼 전 조건',sub:'정리해야 하는 세 가지',body:wd3},
    {han:'式',title:'날짜와 형식',sub:'어느 달, 어떤 자리',body:wd4},
    {han:'親',title:'양가와의 거리',sub:'규칙이 감정보다 오래',body:wd5},
    {han:'後',title:'결혼 후 3년',sub:'초반의 규칙이 10년을 정한다',body:wd6},
    {han:'月',title:'12개월 준비',sub:'결혼 이야기가 움직이는 달',body:wd7}
  ],
  divorce:[
    {han:'危',title:'위기의 신호',sub:'어디서부터 어긋나는가',body:dv1},
    {han:'年',title:'흔들리는 해',sub:'충의 해와 달',body:dv2},
    {han:'因',title:'갈등의 구조',sub:'서로가 원하는 것',body:dv3},
    {han:'擇',title:'결정 기준',sub:'결정 전 세 질문',body:dv4},
    {han:'子',title:'아이가 있을 때',sub:'아이에게 해야 할 말',body:dv5},
    {han:'後',title:'결정 후의 흐름',sub:'3개월과 1년',body:dv6},
    {han:'月',title:'6개월의 기압',sub:'대화의 길이',body:dv7}
  ]
};
})();
