/* 천령당 — 궁합·결혼·이혼 : 커플 궁합 · 결혼 시기 · 이혼/위기 */
(function(){
'use strict';
var C=window.CH, S=C.S;
var P=C.P,H=C.H,UL=C.UL,K=C.K,elB=C.elB,stemB=C.stemB,brB=C.brB,bj=C.bj,gzP=C.gzP;
var monthsBlock=C.monthsBlock, seunTable=C.seunTable, risky=C.riskyMonthsText, yearOfStar=C.yearOfStar, partnerChart=C.partnerChart;
window.CTP=window.CTP||{};

function wedYears(R,input){
  var star=(input.gender==='f')?'관성':'재성';
  return {star:star,ys:yearOfStar(R,star)};
}

/* ---------- 커플 궁합 ---------- */
function cp1(R,c,input,name){
  var pc=partnerChart(input),h='';
  var dd=S.deep(R);
  if(pc){
    var R2=pc.R, sc=S.coupleScore(R,R2), dd2=S.deep(R2);
    h+='<div class="ch-key" style="margin-bottom:12px"><b>기본 궁합 '+sc.s+'점</b><span>'+sc.notes.join(' · ')+'</span></div>';
    h+='<p>두 사람의 일간은 '+stemB(R.dStem)+'과 '+stemB(R2.dStem)+'. '+S.DAY_MASTER[R.dStem][0]+'와 '+S.DAY_MASTER[R2.dStem][0]+'가 만나는 구조입니다.</p>';
    h+=H('일간이 만나는 자리');
    h+='<p>'+(S.generates(R2.dayEl,R.dayEl)?'상대의 '+S.EL_KO[R2.dayEl]+' 기운이 이 사주의 '+S.EL_KO[R.dayEl]+'을 살립니다. 상대가 먼저 움직일 때 관계가 부드러워집니다.':(S.generates(R.dayEl,R2.dayEl)?'이 사주의 '+S.EL_KO[R.dayEl]+' 기운이 상대의 '+S.EL_KO[R2.dayEl]+'을 살립니다. 다만 이 사주가 지치면 관계 전체가 무거워집니다.':(R.dayEl===R2.dayEl?'두 사람의 결이 같아 통하는 부분이 많습니다. 다만 같은 약점도 함께 커집니다.':'두 기운이 서로를 누르지도 살리지도 않아, 생활의 규칙이 관계를 지탱합니다.')))+'</p>';
    h+=H('일지가 만나는 자리');
    var rel=S.branchRel(R.dBranch,R2.dBranch);
    h+='<p><b>'+rel.k+'</b> — '+rel.t+'</p>';
    h+='<p>이 사주 안에서도 기둥 사이의 관계가 결을 만듭니다.</p>'+S.interHTML(R);
    h+=H('서로에게 없는 것');
    h+='<p>이 사주에게 얇은 기운은 '+window.CH.elB(c.leastI)+', 상대에게 얇은 기운은 '+window.CH.elB(pc.c.leastI)+'. '+(c.leastI===pc.c.leastI?'두 사람 모두 같은 기운이 얇아 그 부분은 서로 채워주지 못합니다. 생활에서 의식적으로 만들어야 합니다.':'서로 다른 기운이 비어 있어 채워줄 수 있습니다. 이 사주가 상대에게 '+S.EL_KO[pc.c.leastI]+'의 환경을 만들어주면 관계가 편해집니다.')+'</p>';
    if(dd.gmHits.length||dd2.gmHits.length) h+='<p>'+(dd.gmHits.length?S.gongmangText(R):'')+' 상대 쪽에서도 '+(dd2.gmHits.length?dd2.gmHits.map(function(x){return x.pos;}).join('·')+'가 공망이라 ':'')+'약속이 문서로 남지 않으면 기억이 달라집니다.</p>';
  } else {
    h+='<p>상대의 생년월일이 비어 있어 두 사람의 점수는 아직 계산되지 않았습니다. 위쪽 <b>상대방 정보</b>를 켜고 생년월일을 넣으면 일간·일지·오행까지 계산해 드립니다.</p>';
    h+=H('지금은 이 사주의 배우자궁부터')+'<p>배우자궁인 일지 '+window.CH.bj(R.dBranch,'은는')+' <b>'+S.SPOUSE[R.dBranch]+'</b>을 가리킵니다. '+S.BR_INNER[R.dBranch]+'</p>';
    h+='<p>일지의 십이운성은 <b>'+S.stage12(R.dStem,R.dBranch)+'</b>입니다. '+S.STAGE_MEAN[S.stage12(R.dStem,R.dBranch)]+'</p>';
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

/* =====================================================================
   v50 · 결혼운 — 완전 개편
   “언제, 어떤 사람과 결혼하게 되는지”를 일지·배우자성·대운·세운으로 읽는다.
   7장 : ① 연애운과 배우자궁 ② 결혼의 의미 ③ 이혼수와 개운법
         ④ 결혼의 골든타임 ⑤ 미래 배우자 ⑥ 피해야 할 악연 ⑦ 결혼 이후·자녀·맺음말
   ===================================================================== */

/* ---- 배우자성 : 여성은 관성(남편), 남성은 재성(아내) ---- */
function wedStar(input){ return (input&&input.gender==='f')?'관성':'재성'; }
function wedStarKo(input){ return (input&&input.gender==='f')?'관성':'재성'; }
function wedStarGod(input){ return (input&&input.gender==='f')?'정관':'정재'; }
function wedStarEl(R,input){ return (wedStar(input)==='관성')?S.mod(R.dayEl+3,5):S.mod(R.dayEl+2,5); }
function wedStarPos(R,input){
  var star=wedStar(input), out=[], d=S.deep(R);
  d.live.forEach(function(p){
    if(S.GOD_GROUP[p.bGod]===star||S.GOD_GROUP[p.sGod]===star) if(out.indexOf(p.pos)<0) out.push(p.pos);
  });
  return out;
}
/* 일지(배우자궁)에 걸린 관계만 */
function wedDayRels(R){
  var d=S.deep(R), out=[];
  d.branchRels.forEach(function(x){
    if(x.aBr===R.dBranch||x.bBr===R.dBranch) out.push(x);
  });
  return out;
}
function wedSeun(R,n){
  var out=[];
  for(var i=0;i<R.seun.length&&i<(n||5);i++) out.push(S.yearRead(R,R.seun[i].year));
  return out;
}
/* 결혼의 온도 : 배우자성 자리 · 신강약 · 인성/비겁 · 공망 · 일지 관계 */
function wedScore(R,c,input){
  var pos=wedStarPos(R,input), d=S.deep(R), sc=0, why=[];
  if(pos.indexOf('일지')>=0){ sc+=2; why.push('배우자성이 배우자궁 안에 있습니다'); }
  else if(pos.indexOf('월지')>=0){ sc+=1; why.push('배우자성이 월지에 있어 사회생활에서 인연이 들어옵니다'); }
  else if(pos.length){ sc+=0; why.push('배우자성이 배우자궁 바깥에 있습니다'); }
  else { sc-=1; why.push('배우자성이 원국에 뚜렷하지 않습니다'); }
  if(R.strength==='약'){ sc+=1; why.push('일간이 신약해 사람과 환경의 도움이 힘이 됩니다'); }
  if(R.strength==='강'){ sc-=1; why.push('일간이 강해 혼자서도 버티는 힘이 큽니다'); }
  if(c.grp['인성']>=2){ sc+=1; why.push('인성이 두터워 보호와 안정을 주는 자리가 있습니다'); }
  if(c.grp['비겁']>=2){ sc-=1; why.push('비겁이 두터워 내 기준이 먼저 서는 사주입니다'); }
  var gmDay=d.gmHits.filter(function(x){ return x.pos==='일주'||x.pos==='일지'; });
  if(gmDay.length){ sc-=1; why.push('배우자궁이 공망에 걸려 있습니다'); }
  var rels=wedDayRels(R);
  if(rels.some(function(x){return x.type==='육합';})){ sc+=1; why.push('일지에 합이 있어 관계가 묶이는 힘이 있습니다'); }
  if(rels.some(function(x){return x.type==='충';})){ sc-=1; why.push('일지에 충이 있어 관계가 끊기고 다시 붙기 쉬운 구조입니다'); }
  var type=(sc>=3)?'grow':(sc>=1?'frame':'chain');
  return {s:sc,type:type,why:why,pos:pos};
}

/* ---- 오행별 배우자상 (일지·배우자성의 오행으로 읽는다) ---- */
var WED_MOOD=[
 '첫인상이 밝고 반듯합니다. 말이 빠르지 않고 눈을 맞추며 듣는 사람이라, 처음 만난 날 “이 사람은 급하지 않구나” 싶은 인상을 줍니다. 자라온 환경이 단정하고, 자기 자리에 대한 자부심이 있습니다.',
 '첫인상이 환하고 온도가 높습니다. 웃음이 먼저 나오고 표정이 풍부해서 사람이 모입니다. 다만 기분이 얼굴에 그대로 나와서, 처음에는 다정하다가도 피곤한 날에는 무뚝뚝해 보입니다.',
 '첫인상이 든든하고 말수가 적습니다. 자리를 잡아주고 순서를 정리하는 사람이라 모임에서 자연스럽게 중심이 됩니다. 낯을 조금 가리지만 한 번 편해지면 오래 웃습니다.',
 '첫인상이 정갈하고 단호합니다. 옷차림과 말투에 기준이 있어 신뢰가 가고, 약속 시간을 어기지 않습니다. 감정 표현이 절제되어 있어 처음에는 차갑게 느껴질 수 있습니다.',
 '첫인상이 조용하고 깊습니다. 말을 아끼지만 질문은 정확해서, 대화를 마치면 “이 사람은 내 이야기를 다 들었다”는 느낌이 남습니다. 사람을 오래 관찰하고 천천히 다가옵니다.'
];
var WED_LOOK=[
 '키가 크거나 몸이 곧은 편이고, 손과 눈이 유난히 깨끗한 인상입니다. 목소리가 낮고 말의 속도가 느립니다.',
 '표정이 밝고 눈이 크게 웃습니다. 목소리에 온도가 있어 듣고 있으면 마음이 풀립니다. 말이 빠른 편입니다.',
 '체격이 안정되고 어깨가 넓은 인상입니다. 말수가 적고 목소리가 낮으며, 결정을 말할 때 짧고 분명합니다.',
 '선이 정돈되어 있고 피부와 손끝이 깔끔합니다. 말투가 정확하고 군더더기가 없으며, 농담도 짧게 던집니다.',
 '눈빛이 깊고 표정 변화가 적습니다. 목소리가 낮고 조용하며, 말끝을 흐리지 않습니다.'
];
var WED_VALUE=[
 '자기 기준이 분명하고 성장하려는 마음이 큽니다. “같이 배우자”는 말을 좋아하고, 관계에서도 방향과 계획을 중요하게 여깁니다.',
 '지금의 기분과 관계의 온도를 중요하게 여깁니다. 함께 웃고 인정해주는 말에 힘을 쓰고, 무뚝뚝한 사람에게는 마음을 잘 열지 않습니다.',
 '안정과 소유보다 생활의 질서를 중요하게 여깁니다. 집·가족·역할을 자연스럽게 자기 일로 여기고, 결정을 미루는 것을 답답해합니다.',
 '규칙과 신뢰를 중요하게 여깁니다. 약속은 문서처럼 지키고, 감정보다 원칙을 먼저 말합니다. 그 대신 한 번 신뢰를 잃으면 쉽게 돌아오지 않습니다.',
 '생각과 이해를 중요하게 여깁니다. 말이 통하는지를 관계의 기준으로 삼고, 설명되지 않는 요구에는 조용히 물러납니다.'
];
var WED_MONEY=[
 '버는 힘보다 키우는 힘이 강합니다. 처음에는 작게 시작해도 오래 쌓아 자산을 만드는 쪽이고, 공부·자격·콘텐츠처럼 시간이 자산이 되는 곳에 돈을 씁니다.',
 '쓰는 재미와 버는 재미가 함께 있습니다. 사람을 통해 돈이 들어오고 나가며, 경조사·모임·접대의 지출이 큽니다. 통장을 나누면 훨씬 안정됩니다.',
 '안정과 실물을 좋아합니다. 집·땅·예금처럼 손에 잡히는 것에 돈을 두고, 위험한 투자를 싫어합니다. 대신 결정이 느려 기회를 놓칠 때가 있습니다.',
 '현금 흐름과 원칙을 중요하게 여깁니다. 수입과 지출을 정확히 기록하고, 빚을 싫어합니다. 큰 지출은 반드시 근거를 확인한 뒤 결정합니다.',
 '정보와 흐름을 읽는 감각이 있습니다. 돈이 어디로 움직이는지 빨리 알아채고, 조용히 오래 버티는 쪽입니다. 다만 손에 있는 돈은 잘 쥐지 않습니다.'
];
var WED_JOB=[
 ['교육·출판·기획·콘텐츠 제작','법무·행정·연구처럼 기록이 남는 일','농업·원예·식품처럼 자라게 하는 일'],
 ['방송·마케팅·강연·요식업','의료·뷰티·스포츠처럼 사람을 움직이는 일','브랜드·광고처럼 눈에 보이게 만드는 일'],
 ['부동산·건설·유통·물류','공무·관리·총무처럼 질서를 세우는 일','요리·돌봄·교육처럼 사람을 품는 일'],
 ['금융·회계·법률·엔지니어링','제조·품질·정밀기술','자격·감사처럼 기준을 지키는 일'],
 ['연구·데이터·의료·상담','무역·유통·해외 영업처럼 흐름을 타는 일','IT·정보보안처럼 보이지 않는 것을 다루는 일']
];

/* ---------- ① 내 사주 속 연애운과 배우자궁 ---------- */
function wd1(R,c,input,name){
  var dd=S.deep(R), stage=S.stage12(R.dStem,R.dBranch);
  var sal=dd.sals.filter(function(s){return s.key==='dohwa'||s.key==='hongyeom'||s.key==='hwagae';});
  var star=wedStar(input), pos=wedStarPos(R,input);
  var give=c.grp['식상'], take=c.grp['인성'], self=c.grp['비겁'], mate=c.grp[star];
  var style=(give>=2&&take>=2)?'주고받는 사랑':(give>take?'주는 사랑':(take>give?'받는 사랑':'균형을 재는 사랑'));
  var h=window.CH.facts(R);
  h+='<p>'+name+' 님의 사랑은 일지 '+bj(R.dBranch,'에서')+' 시작됩니다. 일간 '+S.STEM_KO[R.dStem]+'('+S.STEM_HAN[R.dStem]+')'+S.josaP(S.STEM_KO[R.dStem],'은는')+' 밖으로 드러나는 나이고, 일지 '+bj(R.dBranch,'은는')+' 내가 앉는 자리이자 가장 가까이 마주 앉을 사람의 자리인 <b>배우자궁</b>입니다. 그래서 이 사주는 “어떤 사람이 좋은가”보다 <b>어떤 사람 곁에서 내가 편해지는가</b>로 인연을 정합니다.</p>';
  h+=H('배우자궁이 가리키는 사람')+'<p>일지 '+brB(R.dBranch)+'는 <b>'+S.SPOUSE[R.dBranch]+'</b>을 가리킵니다. '+S.BR_INNER[R.dBranch]+'</p>';
  h+='<p>이 자리의 십이운성은 <b>'+stage+'</b>입니다. '+S.STAGE_MEAN[stage]+' 이 기운이 연애에서도 그대로 나와서, 마음이 정해지기까지의 속도와 정해진 뒤의 태도를 함께 만듭니다. 그래서 이 사주는 첫 만남에서 판단하기보다 <b>세 번째 만남</b>에서 마음이 정해집니다.</p>';
  h+=H('나의 연애 성향과 선천적 매력')+'<p>이 사주의 사랑의 언어는 <b>'+String(S.LOVE_LANG[R.dayEl]).split('.')[0]+'</b>입니다. '+S.LOVE_LANG[R.dayEl]+'</p>';
  h+='<p>'+S.LOVE_CHARM[R.dayEl]+'</p>';
  h+='<p>'+S.DM_DEEP[R.dStem].out+' '+S.DM_DEEP[R.dStem].in+' 그래서 처음 만난 사람은 이 사람을 “차분하다, 쉽게 마음을 안 준다”고 기억하고, 가까운 사람은 “생각보다 단단하고 계산이 빠르다”고 말합니다. 두 인상 모두 사실이고, 이 두 얼굴이 사랑에서도 번갈아 나옵니다.</p>';
  if(sal.length) h+='<p>인연의 표시로 <b>'+sal.map(function(s){return s.name;}).join('·')+'</b>이 '+sal[0].pos+'에 있습니다. '+sal[0].txt+' 이 기운은 사람을 끌어당기는 힘이라, 표정이 살아 있는 날에 더 크게 작동합니다.</p>';
  h+=H('사주 글자로 본 사랑 방식 — 주는 사랑인가, 받는 사랑인가')+'<p>이 사주의 사랑은 <b>'+style+'</b>입니다. 여덟 글자에서 주는 힘(식상)은 <b>'+give+'개</b>, 받는 힘(인성)은 <b>'+take+'개</b>, 나란히 서는 힘(비겁)은 <b>'+self+'개</b>, 배우자성('+wedStar(input)+')은 <b>'+mate+'개</b>입니다.</p>';
  h+='<p>'+(give>take
    ? '주는 쪽이 더 두터워서, 좋아하면 먼저 챙기고 먼저 맞춰줍니다. 문제는 그 챙김을 상대가 알아채지 못할 때입니다. 이 사주는 “말하지 않아도 알 것”을 기대하는데, 상대는 알 수 없습니다. 좋아한다는 말을 한 번 더 꺼내는 것이 이 사주의 사랑을 지키는 방법입니다.'
    : (take>give
      ? '받는 쪽이 더 두터워서, 상대가 다가와 주기를 기다리는 편입니다. 마음이 없어서가 아니라 <b>표현하는 방법을 배우지 않아서</b>입니다. 이 사주에게 사랑은 받는 일이 아니라 확인하는 일이고, 확인은 말과 행동으로만 됩니다.'
      : '주고받는 힘이 고르게 있어 균형을 잘 잡습니다. 다만 균형을 재는 마음이 앞서면 사랑이 거래처럼 느껴질 수 있습니다. 계산을 내려놓는 시간, 즉 함께 아무것도 하지 않는 시간이 이 사주에게 특히 중요합니다.'))+'</p>';
  if(pos.length) h+='<p>배우자성이 '+pos.join('·')+'에 있다는 것은, 사랑이 <b>'+(pos.indexOf('일지')>=0?'생활 속에서 자연스럽게 결정되는':(pos.indexOf('월지')>=0?'일과 사회생활을 통해 들어오는':'새로운 판과 먼 곳에서 들어오는'))+'</b> 구조라는 뜻입니다. 잠복해서 기다리기보다 그 자리에 나가 있어야 인연이 보입니다.</p>';
  h+=H('이 사주가 사랑에서 먼저 확인할 것')+UL([
    '내가 지금 <b>마음을 주는 것</b>인지, <b>확인받고 싶은 것</b>인지 구분하기',
    '상대가 편안해하는 속도를 나의 속도와 나란히 놓아보기',
    '좋으면 좋다고, 서운하면 서운하다고 <b>그날</b> 한 문장으로 말하기'
  ]);
  return h+K('한 줄','이 사주에게 사랑은 <b>찾는 일</b>이 아니라 <b>알아보는 일</b>입니다. 알아보려면 오래 봐야 하고, 오래 보려면 내가 먼저 편해져야 합니다.');
}

/* ---------- ② 나에게 결혼은 어떤 의미일까? ---------- */
function wd2(R,c,input,name){
  var m=wedScore(R,c,input);
  var star=wedStar(input), pos=m.pos;
  var h=window.CH.facts(R);
  h+='<p>결혼은 사람마다 다른 그릇입니다. 어떤 사주에게 결혼은 삶의 판을 키우는 문이고, 어떤 사주에게는 생활의 규칙을 빼앗는 족쇄가 됩니다. 차이는 감정이 아니라 <b>여덟 글자의 구조</b>에서 갈립니다.</p>';
  h+=H('결혼이 삶을 키우는 사주')+'<p>배우자성이 배우자궁(일지)이나 월지에 있고, 일간이 신약하며 인성이 받쳐주는 사주입니다. 이 구조는 사람을 통해 힘을 얻고, 혼자일 때보다 둘일 때 판이 넓어집니다. 결정도 빨라지고, 돈의 흐름도 안정됩니다. 결혼이 <b>생활의 기반</b>이 되는 사주입니다.</p>';
  h+=H('결혼이 족쇄가 되기 쉬운 사주')+'<p>비겁이 두텁고 일간이 강하며 배우자성이 배우자궁 바깥에 있는 사주입니다. 자기 기준이 분명하고 혼자서도 잘 버티기 때문에, 결혼이 <b>내 자리를 줄이는 일</b>처럼 느껴집니다. 이 사주에게 결혼이 족쇄가 되는 것은 상대가 나쁘기 때문이 아니라 <b>역할이 정해지지 않았기 때문</b>입니다.</p>';
  h+=H('그래서 '+name+' 님의 사주는')+'<p>배우자성은 '+ (pos.length?pos.join('·'):'원국에 뚜렷하지 않음') +', 일간의 힘은 <b>'+(R.strength==='강'?'신강':(R.strength==='약'?'신약':'중화'))+'</b>, 인성 '+c.grp['인성']+'개 · 비겁 '+c.grp['비겁']+'개 · 식상 '+c.grp['식상']+'개입니다. 이 조건을 놓고 보면 이 사주는 <b>'+ (m.type==='grow'?'결혼이 삶을 키우는 쪽':(m.type==='frame'?'결혼이 삶의 틀이 되는 쪽':'결혼이 족쇄가 되기 쉬운 쪽')) +'</b>에 서 있습니다.</p>';
  h+='<p>'+(m.type==='grow'
    ? '이 사주에게 결혼은 <b>판을 넓히는 선택</b>입니다. 배우자를 통해 사람과 일의 폭이 넓어지고, 결정의 무게를 나눌 수 있습니다. 다만 이 사주는 좋은 것을 받아도 고맙다고 말하지 않아서, 배우자가 자기 몫을 잃었다고 느끼기 쉽습니다. “네 덕분에 편해졌다”는 한 문장이 이 결혼의 가장 큰 재산이 됩니다.'
    : (m.type==='frame'
      ? '이 사주에게 결혼은 <b>생활의 틀</b>입니다. 극적으로 삶을 바꾸지는 않지만, 규칙이 생기면 훨씬 안정됩니다. 그래서 결혼 전에 생활비·거주지·역할 세 가지를 정해두는 것이 특히 중요합니다. 틀이 정해지면 이 사주는 오래 갑니다.'
      : '이 사주에게 결혼은 <b>내 자리를 어떻게 나눌 것인가</b>의 문제입니다. 상대가 좋아도 역할이 정해지지 않으면 서운함이 쌓이고, 서운함은 이 사주에게서 말보다 침묵으로 나옵니다. 그래서 이 사주는 “참는 결혼”이 아니라 <b>“정하는 결혼”</b>을 해야 합니다. 영역을 나누고, 그 안에서는 서로 간섭하지 않는 규칙 하나면 충분합니다.'))+'</p>';
  h+=H('사주가 보내는 신호')+UL(m.why.concat([
    '중심 기운은 '+c.topGrp+'입니다. '+S.GROUP_MEAN[c.topGrp]
  ]));
  h+='<p>'+(m.s>=3?'이 사주는 결혼을 서두를 필요가 없습니다. 구조가 받쳐주니 조금 늦어도 좋은 자리에 앉습니다.':(m.s>=1?'이 사주는 결혼의 시기보다 <b>조건</b>이 중요합니다. 조건이 정리되면 시기는 자연스럽게 따라옵니다.':'이 사주는 결혼을 미루는 쪽이 안전합니다. 다만 미루는 것과 피하는 것은 다릅니다. 피하면 마음이 굳고, 미루면 준비가 됩니다.'))+'</p>';
  return h+K('한 줄','이 사주에게 결혼은 <b>감정의 결론</b>이 아니라 <b>역할의 설계</b>입니다. 설계가 되면 감정은 따라옵니다.');
}

/* ---------- ③ 내 사주 속 이혼수와 개운법 ---------- */
function wd3(R,c,input,name){
  var dd=S.deep(R), rels=wedDayRels(R);
  var hard=rels.filter(function(x){return x.type==='충'||x.type==='형'||x.type==='파'||x.type==='해'||x.type==='원진';});
  var good=rels.filter(function(x){return x.type==='육합'||x.type==='삼합'||x.type==='방합';});
  var gm=dd.gmHits.filter(function(x){return x.pos==='일주'||x.pos==='일지';});
  var sal=dd.sals.filter(function(s){return s.key==='yangin'||s.key==='baekho'||s.key==='goegang';});
  var h=window.CH.facts(R);
  h+='<p>명리에서 이혼수는 “이혼한다”는 예언이 아닙니다. <b>관계가 흔들리는 자리</b>를 가리키는 표시이고, 그 자리를 아는 사람은 대개 같은 자리에서 덜 넘어집니다. 이 장은 겁을 주려는 글이 아니라 <b>미리 손볼 곳</b>을 찾는 글입니다.</p>';
  h+=H('원국에 새겨진 흔들리는 자리')+'<p>'+(hard.length
    ? '배우자궁인 일지에 '+hard.map(function(x){return '<b>'+x.type+'</b>('+x.a+'·'+x.b+')';}).join(', ')+'이 걸려 있습니다. '+hard[0].mean+' 이 구조는 갈등이 “사건”으로 오기보다 <b>반복되는 장면</b>으로 옵니다. 같은 이유로 세 번 싸우면 그것이 이 사주의 패턴입니다.'
    : '배우자궁인 일지에 충·형·파·해가 직접 걸려 있지는 않습니다. 이 사주는 관계가 급격히 끊기지 않고 <b>서서히 식는</b> 방식으로 흔들립니다. 그래서 위기는 대개 말이 줄어드는 것으로 시작됩니다.')+'</p>';
  if(good.length) h+='<p>대신 '+good.map(function(x){return x.type+'('+x.a+'·'+x.b+')';}).join(', ')+'이 일지에 걸려 있어, 한 번 묶인 관계는 쉽게 풀리지 않습니다. 이 힘이 이 사주의 가장 큰 안전장치입니다.</p>';
  if(gm.length) h+='<p>'+S.gongmangText(R)+' 배우자궁이 공망이면 관계의 약속이 <b>문서로 남지 않으면 기억이 달라집니다</b>. 말로 정한 것은 한 달이면 흐려지니, 생활의 규칙을 글로 남겨두세요.</p>';
  if(sal.length) h+='<p>강하게 나가는 힘으로 <b>'+sal.map(function(s){return s.name+'('+s.pos+')';}).join('·')+'</b>이 있습니다. '+sal[0].txt+' 이 힘은 관계에서 <b>밀어붙일 때</b> 나옵니다. 그 순간을 알아채는 것만으로 절반은 막힙니다.</p>';
  h+=H('이 사주가 관계에서 흔들리는 방식')+'<p>'+S.MARR_CRISIS_BR[R.dBranch]+'</p>';
  h+='<p>'+S.CONFLICT_BY_EL[R.dayEl]+' 그리고 '+S.LOVE_SHADOW[R.dayEl]+' 이 문장이 반복되면 그것이 이 사주의 이별 공식입니다.</p>';
  h+=H('현실적인 개운법 — 오늘부터 되는 것')+'<p>개운은 큰 의식이 아닙니다. 이 사주에게 필요한 기운은 <b>'+S.EL_KO[c.yongEl]+'('+S.EL_HAN[c.yongEl]+')</b>이고, 그 기운을 생활에 심는 것이 곧 개운입니다.</p>'+
    '<table class="tbl"><tr><th>항목</th><th>처방</th></tr>'+
    '<tr><td>색</td><td>'+S.EL_DEEP[c.yongEl].color+'</td></tr>'+
    '<tr><td>방위</td><td>'+S.EL_DEEP[c.yongEl].dir+'</td></tr>'+
    '<tr><td>생활</td><td>'+S.EL_DEEP[c.yongEl].habit+'</td></tr>'+
    '<tr><td>음식</td><td>'+S.EL_DEEP[c.yongEl].food+'</td></tr>'+
    '<tr><td>소품</td><td>'+S.EL_DEEP[c.yongEl].item+'</td></tr></table>';
  h+='<p>관계의 개운은 자리에서 옵니다. '+S.MARR_SOLUTION[c.topGrp]+'</p>';
  h+=H('관계를 지키는 세 가지 규칙')+UL([
    '<b>24시간 규칙</b> — 화가 난 날에는 중요한 말을 하지 않습니다. 이 사주는 말이 정확한 대신 날카로워서, 그 한 문장이 오래 남습니다.',
    '<b>한 달에 한 번, 관계가 아닌 이야기</b> — 아이·돈·집안 이야기를 빼고 웃는 시간입니다. 이 시간이 없으면 관계는 관리로만 남습니다.',
    '<b>문서로 남기기</b> — 돈과 일정, 양가에 대한 약속은 말이 아니라 글로. 공망이 있는 사주일수록 기록이 사람을 살립니다.'
  ]);
  h+=H('흔들리는 해를 미리 아는 법')+'<p>앞으로 다섯 해 중 일지와 부딪히는 해는 '+(function(){
    var out=[];
    wedSeun(R,5).forEach(function(r){
      if(r.rels.some(function(x){return x.type==='충'||x.type==='형';})) out.push('<b>'+r.y+'년 '+r.gz+'</b>');
    });
    return out.length?out.join(', ')+'입니다. 이 해에는 이사·이직·별거 같은 생활 변화가 겹치기 쉬워 작은 갈등이 크게 느껴집니다.':'뚜렷하지 않습니다. 대신 갈등이 쌓이는 구조를 점검하세요.';
  })+'</p>';
  h+='<p>달까지 좁히면 '+risky(R,c,12)+'</p>';
  return h+K('한 줄','이 사주의 이혼수는 <b>운명이 아니라 습관</b>입니다. 습관은 하나만 바꿔도 결과가 달라집니다.');
}

/* ---------- ④ 놓치면 안 될 결혼의 골든타임 ---------- */
function wd4(R,c,input,name){
  var star=wedStar(input), ys=wedSeun(R,5);
  var starYears=ys.filter(function(r){return r.grp===star;});
  var hapYears=ys.filter(function(r){return r.rels.some(function(x){return x.type==='육합'||x.type==='삼합';});});
  var golden=ys.filter(function(r){ return r.grp===star && r.rels.some(function(x){return x.type==='육합'||x.type==='삼합';}); });
  var rush=ys.filter(function(r){ return r.gi||r.rels.some(function(x){return x.type==='충';}); });
  var h=window.CH.facts(R);
  h+='<p>결혼의 때는 두 겹으로 옵니다. <b>대운</b>은 10년짜리 판이고, <b>세운</b>은 그 판 위에서 문이 열리는 해입니다. 판이 좋아도 해가 맞지 않으면 결정이 흔들리고, 해가 좋아도 판이 아니면 만남이 오래가지 않습니다.</p>';
  h+=H('대운으로 보는 결혼의 판')+'<table class="tbl"><tr><th>나이</th><th>간지</th><th>십성</th><th>이 10년의 결</th></tr>'+(function(){
    var t='';
    for(var i=0;i<R.daeun.length;i++){
      var d=R.daeun[i], g=S.tenGod(R.dStem,d.idx%10), grp=S.GOD_GROUP[g], cur=(i===R.curDaeun);
      var mark=(grp===star)?'<b style="color:#c94228">배우자성</b> ':'';
      t+='<tr'+(cur?' style="background:#f3ecdd"':'')+'><td><b>'+d.from+'~'+d.to+'</b>'+(cur?' <span style="font-size:10.5px;color:#c94228">지금</span>':'')+'</td><td>'+gzP(d.idx%10,d.idx%12)+'</td><td>'+mark+g+'</td><td style="font-size:12.5px;line-height:1.65;color:#5a5145">'+(S.GOD_DAEUN[g]||'')+'</td></tr>';
    }
    return t;
  })()+'</table>';
  h+='<p>이 사주에게 결혼의 문이 가장 크게 열리는 10년은 <b>배우자성('+star+')이 대운으로 들어오는 구간</b>입니다. '+(function(){
    var out=[];
    for(var i=0;i<R.daeun.length;i++){
      var d=R.daeun[i], g=S.tenGod(R.dStem,d.idx%10);
      if(S.GOD_GROUP[g]===star) out.push(d.from+'~'+d.to+'세('+gzP(d.idx%10,d.idx%12)+')');
    }
    return out.length?out.join(', ')+'입니다. 이 구간에는 사람이 자연스럽게 들어오고, 관계가 구체적인 이야기로 넘어갑니다.':'뚜렷하지 않습니다. 이 사주는 대운보다 <b>세운과 만남의 자리</b>가 결정합니다.';
  })()+' 지금은 '+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세 대운을 지나고 있습니다.</p>';
  h+=H('매력 자본이 최고점이 되는 때')+'<p>사람을 끄는 힘은 얼굴이 아니라 <b>기운의 밀도</b>에서 옵니다. 이 사주는 배우자성이 들어오는 해에 표정과 말의 온도가 함께 올라가고, 일지에 합이 걸리는 해에는 사람이 실제로 다가옵니다. 두 조건이 겹치는 해가 <b>매력 자본의 최고점</b>입니다.</p>';
  if(hapYears.length&&!starYears.length) h+='<p>앞으로 다섯 해 중 일지와 합이 걸리는 해는 <b>'+hapYears.map(function(r){return r.y+'년';}).join(', ')+'</b>입니다. 배우자성은 뚜렷하지 않지만 사람이 다가오는 문은 열려 있으니, 만남의 자리를 먼저 만들면 이 해에 이어집니다.</p>';
  h+='<p>'+(golden.length
    ? '앞으로 다섯 해 중 <b>'+golden.map(function(r){return r.y+'년 '+r.gz;}).join(', ')+'</b>이 그 해입니다. 이 해에는 소개·모임·새 자리에 나가 있는 것만으로 결과가 달라집니다.'
    : (starYears.length?'배우자성이 들어오는 <b>'+starYears.map(function(r){return r.y+'년';}).join(', ')+'</b>이 창입니다. 합까지 겹치는 해는 없으니, 만남을 <b>내가 만드는 쪽</b>이 맞습니다.'
      : '앞으로 다섯 해에는 두 조건이 겹치지 않습니다. 이 시기는 배우자를 기다리는 때가 아니라 <b>나의 그릇을 키우는 때</b>입니다. 그릇이 커지면 다음 창에서 만나는 사람의 질이 달라집니다.'))+'</p>';
  h+=H('성급하면 망하는 시기')+'<p>'+(rush.length
    ? '<b>'+rush.map(function(r){return r.y+'년 '+r.gz;}).join(', ')+'</b>은 기신이 들거나 일지와 충이 걸리는 해입니다. 이 해의 결정은 감정이 앞서기 쉬워, 결혼을 서두르면 <b>생활의 조건을 확인하지 않은 채</b> 시작하게 됩니다. 예식은 가능하지만 계약·이사·양가 협의는 한 박자 늦추세요.'
    : '앞으로 다섯 해에는 크게 부딪히는 해가 없습니다. 다만 결정을 서두르는 습관이 문제입니다. 이 사주는 설렘이 커지면 조건을 건너뛰는 경향이 있습니다.')+'</p>';
  h+=H('늦으면 고립되는 시기')+'<p>이 사주의 인연은 <b>생활이 안정될수록 늦게 옵니다</b>. 일이 자리를 잡고 혼자의 리듬이 완성되면, 새 사람이 들어올 빈틈이 줄어듭니다. 그래서 마지막 창을 지나면 만남의 <b>횟수</b>가 줄어듭니다. 사람이 없는 것이 아니라 만날 자리가 없어지는 것입니다. '+(starYears.length?'가장 늦은 창은 '+starYears[starYears.length-1].y+'년입니다. 그 전에 자리를 하나는 비워두세요.':'이 사주는 창이 흩어져 있어, 한 해를 정해두고 움직이는 편이 안전합니다.')+'</p>';
  h+=H('프러포즈와 혼인신고의 적기')+'<p>이 사주는 <b>합의 달</b>에 결정하면 마음이 흔들리지 않습니다. 프러포즈는 일지와 합이 걸리는 달, 혼인신고는 두 사람의 일정이 비는 달에 하세요. 반대로 충의 달에 잡은 약속은 뒤에서 한 번 흔들립니다.</p>';
  h+='<p>올해 남은 달과 내년 상반기 중 결정하기 좋은 달은 아래 흐름에서 <b>육합·삼합</b>이 붙은 달입니다. 관계가 묶이는 달에 상견례·날짜·집 이야기를 꺼내면 훨씬 수월하게 정리됩니다.</p>';
  h+=monthsBlock(R,c,'marriage',12,'앞으로 12개월, 결혼 이야기가 움직이는 달입니다.');
  h+=seunTable(R,c,5);
  return h+K('한 줄','골든타임은 <b>해가 열어주고, 사람이 채웁니다</b>. 해를 놓치면 다음 해가 오지만, 사람을 놓치면 그 사람은 오지 않습니다.');
}

/* ---------- ⑤ 미래 배우자의 모습과 내면 ---------- */
function wd5(R,c,input,name){
  var elB2=S.BR_EL[R.dBranch], starEl=wedStarEl(R,input);
  var pos=wedStarPos(R,input);
  var h=window.CH.facts(R);
  h+='<p>배우자의 모습은 두 글자에서 읽습니다. <b>배우자궁인 일지</b>는 곁에 앉을 사람의 분위기와 생활 방식을, <b>배우자성</b>은 그 사람이 세상에 나와 있는 방식(직업·돈·태도)을 보여줍니다. 이 사주는 일지가 '+S.EL_KO[elB2]+'('+S.EL_HAN[elB2]+'), 배우자성이 '+S.EL_KO[starEl]+'('+S.EL_HAN[starEl]+')인 사람입니다.</p>';
  h+=H('첫인상과 분위기')+'<p>'+WED_MOOD[elB2]+'</p>';
  h+='<p>그리고 '+S.SPOUSE[R.dBranch]+' 쪽의 사람입니다. '+S.BR_INNER[R.dBranch]+' 그래서 처음 만난 자리에서 “이 사람은 내 편에 서 줄 사람”이라는 인상이 먼저 옵니다.</p>';
  h+=H('외모와 말투')+'<p>'+WED_LOOK[starEl]+'</p>';
  h+='<p>인상은 화려하기보다 <b>정돈된 쪽</b>입니다. 유행을 따라가기보다 자기에게 맞는 것을 오래 쓰고, 말할 때 결론이 분명합니다. 이 사주는 이 결의 사람에게 “믿을 수 있다”는 감각을 먼저 받습니다.</p>';
  h+=H('가치관과 함께 있을 때의 온도')+'<p>'+WED_VALUE[elB2]+'</p>';
  h+='<p>함께 있을 때의 온도는 <b>뜨겁지 않지만 오래가는 쪽</b>입니다. 이 사주는 상대의 감정이 나보다 낮아도 서운해하지 않으며, 대신 <b>반복되는 행동</b>으로 사랑을 확인합니다. 그래서 말보다 습관이 중요하고, 습관이 무너지면 온도가 빠르게 내려갑니다.</p>';
  h+=H('경제 관념과 신념')+'<p>'+WED_MONEY[starEl]+'</p>';
  h+='<p>이 사주가 돈을 다루는 방식은 '+S.MARR_MONEY_GRP[c.topGrp]+' 그래서 두 사람이 같은 기준을 갖기보다 <b>역할을 나누는 것</b>이 안전합니다. 고정 지출은 한 사람이, 큰 지출은 둘이 함께 결정하는 구조가 오래 갑니다.</p>';
  h+=H('배우자의 자산 규모와 어울리는 직종')+'<p>이 사주에게 오는 사람은 <b>한 번에 크게 벌기보다 오래 쌓는 쪽</b>입니다. 자산은 급격히 늘지 않지만, 생활의 기반이 흔들리지 않는 구조입니다. '+ (starEl===2?'부동산·예금처럼 실물이 중심이고, 결정이 느린 대신 크게 잃지 않습니다.':(starEl===3?'현금 흐름과 자격이 자산이고, 빚을 싫어해 안정적입니다.':(starEl===4?'정보와 흐름이 자산이고, 손에 있는 돈은 잘 쥐지 않습니다.':(starEl===0?'배움과 콘텐츠가 자산이 되고, 초기에 작게 시작해 오래 키웁니다.':'사람과 브랜드가 자산이 되고, 경조사·모임 지출이 큽니다.'))))+'</p>';
  h+=UL(WED_JOB[starEl].map(function(x){return x;}));
  if(pos.length) h+='<p>배우자성이 '+pos.join('·')+'에 있는 만큼, 이 사람을 만나는 자리는 <b>'+(pos.indexOf('월지')>=0?'일과 사회생활':'생활의 거점과 오래된 인연')+'</b>입니다. 그 자리에 서 있으면 만나고, 비켜 있으면 지나갑니다.</p>';
  return h+K('한 줄','이 사주에게 맞는 배우자는 <b>설레게 하는 사람</b>보다 <b>생활을 함께 정리해주는 사람</b>입니다.');
}

/* ---------- ⑥ 절대 피해야 할 악연 ---------- */
function wd6(R,c,input,name){
  var elB2=S.BR_EL[R.dBranch], starEl=wedStarEl(R,input);
  var badEl=S.mod(elB2+3,5);  /* 배우자궁을 누르는 기운 */
  var dd=S.deep(R);
  var sal=dd.sals.filter(function(s){return s.key==='dohwa'||s.key==='hongyeom';});
  var h=window.CH.facts(R);
  h+='<p>악연은 나쁜 사람이 아니라 <b>나를 흔드는 방식</b>입니다. 같은 사람도 어떤 사주에게는 약이고 어떤 사주에게는 독입니다. 이 사주에게 독이 되는 유형은 여덟 글자로 미리 알 수 있습니다.</p>';
  h+=H('만나면 운을 깎아먹는 이성의 특징')+'<p>이 사주의 배우자궁은 '+S.EL_KO[elB2]+'('+S.EL_HAN[elB2]+')이고, 그 기운을 누르는 것은 '+S.EL_KO[badEl]+'('+S.EL_HAN[badEl]+')입니다. 그래서 <b>'+S.EL_KO[badEl]+' 기운이 강한 사람</b> — '+(badEl===0?'시작만 하고 마무리하지 않는 사람, 말이 많고 약속이 가벼운 사람':(badEl===1?'감정의 기복이 크고 화를 그 자리에서 쏟는 사람, 인정 욕구가 강한 사람':(badEl===2?'모든 것을 자기 기준으로 정리하려는 사람, 통제가 강한 사람':(badEl===3?'말이 날카롭고 규칙으로 사람을 재단하는 사람, 감정을 인정하지 않는 사람':'생각만 많고 결정하지 않는 사람, 관계를 흐리게 두는 사람'))))+'</b>에게 이 사주는 특히 지칩니다.</p>';
  h+='<p>또한 이 사주에게는 <b>'+S.LOVE_MISTAKE_GOD[c.topGodInGrp]+'</b> 그래서 같은 실수를 반복하기 쉬운 유형이 따로 있습니다. '+S.DM_DEEP[R.dStem].weak+'</p>';
  if(sal.length) h+='<p>도화·홍염이 '+sal.map(function(s){return s.pos;}).join('·')+'에 있어 사람이 끊이지 않는 사주입니다. 그 자체는 복이지만, <b>확신 없이 시작하는 관계</b>가 많아지면 운이 흩어집니다. 시작 전에 한 번 더 물어보는 습관이 필요합니다.</p>';
  h+=H('나를 편안하게 하는 사람 vs 불안하게 하는 사람')+
    '<table class="tbl"><tr><th>편안하게 하는 사람</th><th>불안하게 하는 사람</th></tr>'+
    '<tr><td>답이 짧아도 일정이 일정합니다</td><td>답은 길지만 만남이 자주 바뀝니다</td></tr>'+
    '<tr><td>내가 지칠 때 자리를 비켜줍니다</td><td>내가 지칠 때 확인을 요구합니다</td></tr>'+
    '<tr><td>약속을 크게 말하지 않습니다</td><td>약속을 크게 말하고 기록은 남기지 않습니다</td></tr>'+
    '<tr><td>내 일을 묻고 기억합니다</td><td>내 일을 듣고 자기 이야기로 바꿉니다</td></tr></table>';
  h+=H('함께 성장하는 관계 vs 나만 애쓰는 관계')+UL([
    '<b>성장</b> — 다툰 뒤에 규칙이 하나 생깁니다. 같은 이유로 두 번 싸우지 않습니다.',
    '<b>소모</b> — 다툰 뒤에 사과만 있고 규칙은 없습니다. 같은 이유로 세 번 싸웁니다.',
    '<b>성장</b> — 내가 편해지는 만큼 상대도 편해집니다. 시간이 지나면 둘 다 말수가 줄고 표정이 좋아집니다.',
    '<b>소모</b> — 내가 맞추는 만큼 상대의 요구가 늘어납니다. 시간이 지나면 내 일정표에 상대만 남습니다.'
  ]);
  h+='<p>이 사주가 특히 조심할 유형은 <b>처음에 너무 잘해주는 사람</b>입니다. 이 사주는 받는 것에 약해서, 초반의 호의를 마음으로 바꿔버립니다. 호의가 <b>세 달을 넘겨도 같은 온도</b>인지 확인하세요. 그 온도가 유지되는 사람이 이 사주의 배우자입니다.</p>';
  return h+K('한 줄','악연은 <b>나를 불안하게 만드는 사람</b>입니다. 편안함이 오래가는 사람이 정답입니다.');
}

/* ---------- ⑦ 결혼 이후의 삶과 자녀운, 그리고 결론 ---------- */
function wd7(R,c,input,name){
  var jae=c.grp['재성'], gwan=c.grp['관성'];
  var kidStar=(input&&input.gender==='f')?S.mod(R.dayEl+1,5):S.mod(R.dayEl+3,5); /* 여:식상, 남:관성 */
  var kidGrp=(input&&input.gender==='f')?'식상':'관성';
  var kidYears=wedSeun(R,5).filter(function(r){return r.grp===kidGrp;});
  var h=window.CH.facts(R);
  h+='<p>결혼은 끝이 아니라 <b>생활의 시작</b>입니다. 이 사주는 결혼 전보다 결혼 후에 돈과 사람의 흐름이 더 분명해지는 구조인지, 반대로 관리해야 할 것이 늘어나는 구조인지가 여덟 글자에 적혀 있습니다.</p>';
  h+=H('결혼 후 재물운의 변화')+'<p>이 사주는 재성이 <b>'+jae+'개</b>입니다. '+ (jae>=2?'결혼 후에는 통장이 두 개가 되면서 오히려 재물의 그릇이 커집니다. 다만 두 사람의 기준이 다르면 지출이 새므로, 고정 지출을 한 사람이 맡는 구조가 필요합니다.':(jae===1?'결혼 후 재물운은 배우자의 습관에 크게 좌우됩니다. 이 사주는 벌이는 힘이 있지만 챙기는 데 약해서, 배우자가 챙기는 역할을 맡으면 안정됩니다.':'재성이 얇아 결혼 후에도 돈은 꾸준히 모으는 쪽이 맞습니다. 큰 투자보다 고정 수입과 저축의 비중을 높이세요.'))+'</p>';
  h+='<p>'+S.MARR_MONEY_GRP[c.topGrp]+' 결혼 후 3년은 재물의 구조가 정해지는 시간이라, 이 기간에 통장·보험·명의를 정리해두면 그 뒤 10년이 편합니다.</p>';
  h+=H('결혼 후 관계운')+'<p>이 사주의 배우자궁은 '+brB(R.dBranch)+' — '+String(S.MARR_HABIT_BR[R.dBranch]).split('.')[0]+'입니다. '+S.BR_INNER[R.dBranch]+' 결혼 후 이 사주가 가장 조심할 것은 <b>혼자 다 하려는 습관</b>입니다.</p>';
  h+='<p>'+S.MARR_SOLUTION[c.topGrp]+' 그리고 '+S.MARR_TEMP[R.dayEl]+'</p>';
  h+=S.interHTML(R);
  h+=H('자녀운 — 수와 시기')+'<p>이 사주의 자녀성은 <b>'+S.EL_KO[kidStar]+'('+S.EL_HAN[kidStar]+')</b>이고, 원국에 '+c.grp[kidGrp]+'개 있습니다. '+(c.grp[kidGrp]>=2?'자녀의 인연이 두 갈래 이상으로 이어지는 구조입니다. 아이와의 관계가 삶의 중심에 오고, 아이를 통해 이 사주의 재능이 다시 열립니다.':(c.grp[kidGrp]===1?'자녀의 인연이 하나로 깊게 이어지는 구조입니다. 수보다 관계의 밀도가 중요한 사주입니다.':'자녀의 인연이 늦게 오는 구조입니다. 서두르지 않아도 되고, 오면 오래 곁에 있습니다.'))+'</p>';
  h+='<p>아이의 결은 '+S.CHILD_NATURE_EL[kidStar]+'</p>';
  h+='<p>임신과 출산의 문은 자녀성('+kidGrp+')이 세운으로 들어오는 해에 열립니다. '+(kidYears.length?'앞으로 다섯 해 중 <b>'+kidYears.map(function(r){return r.y+'년 '+r.gz;}).join(', ')+'</b>이 그 해입니다. 이 해의 봄·가을에 몸의 리듬을 맞춰두면 훨씬 자연스럽습니다.':'앞으로 다섯 해에는 그 문이 뚜렷하지 않습니다. 이 시기는 아이보다 <b>몸의 기반</b>을 먼저 세우는 때입니다.')+'</p>';
  h+='<p>사주는 몸의 리듬과 시기를 보여줄 뿐 임신 가능성이나 건강을 진단하지 않습니다. 실제 계획은 산부인과 상담과 검사 결과를 먼저 두세요.</p>';
  h+=H('결혼 후 인생 그래프')+UL((function(){
    var out=[], mid=Math.floor(R.daeun.length/2);
    var segs=[[0,Math.min(2,mid)],[Math.max(0,mid-1),Math.min(mid+2,R.daeun.length)],[Math.max(0,mid+1),R.daeun.length]];
    var label=['전반','중반','후반'];
    for(var s=0;s<segs.length;s++){
      var a=segs[s][0], b=segs[s][1]; if(b<=a) continue;
      var gsum={};
      for(var i=a;i<b;i++){ var g=S.tenGod(R.dStem,R.daeun[i].idx%10), grp=S.GOD_GROUP[g]; gsum[grp]=(gsum[grp]||0)+1; }
      var best=''; var bv=-1;
      for(var k in gsum){ if(gsum[k]>bv){ bv=gsum[k]; best=k; } }
      out.push('<b>'+label[s]+'('+R.daeun[a].from+'~'+R.daeun[b-1].to+'세)</b> — '+best+'의 시기입니다. '+(S.GOD_DAEUN[(best==='재성'?'정재':(best==='관성'?'정관':(best==='식상'?'식신':(best==='인성'?'정인':'비견'))))]||''));
    }
    return out;
  })());
  h+=H('맺음말')+'<p>'+name+' 님의 결혼운은 <b>누구를 만나느냐</b>보다 <b>어떻게 살아갈 것인가</b>에 더 크게 달려 있습니다. 이 사주는 사랑이 식는 것이 아니라 <b>표현이 줄어드는 것</b>으로 관계가 흐려집니다. 그래서 오늘 할 일은 거창하지 않습니다. 좋아한다는 말 한 번, 서운한 것을 한 문장으로. 그 두 가지가 이 사주의 결혼을 오래 갑니다.</p>';
  return h+K('한 줄','결혼은 <b>맞는 사람을 찾는 일</b>이 아니라 <b>맞춰가는 규칙을 만드는 일</b>입니다.');
}

/* ---------- 이혼 / 위기 ---------- */
function dv1(R,c,input,name){
  var single=C.singleOf(input), dd=S.deep(R);
  var rel=dd.branchRels.filter(function(r){return r.type==='충'||r.type==='형'||r.type==='파';});
  var sal=dd.sals.filter(function(s){return s.key==='yangin'||s.key==='baekho'||s.key==='goegang';});
  var h=window.CH.facts(R);
  if(single){
    h+='<p>아직 결혼 전이라면 이 탭은 <b>앞으로의 관계에서 반복될 위기 패턴</b>을 미리 보는 용도입니다. 이혼을 전제하지 않고, 이 사주가 관계에서 무너지는 지점을 봅니다.</p>';
  } else {
    h+='<p>명리에서 이혼수는 “이혼한다”는 예언이 아니라 <b>관계가 흔들리는 해</b>를 가리킵니다.</p>';
  }
  h+=H('구조적으로 흔들리는 자리');
  h+='<p>'+(rel.length? '원국에 '+rel.map(function(r){return r.a+'·'+r.b+'의 '+r.type;}).join(', ')+'이 있어 <b>관계가 끊기고 다시 붙는 일</b>이 구조적으로 반복됩니다. 이 사주는 갈등이 “사건”이 아니라 <b>반복되는 패턴</b>으로 옵니다.':'원국에 충·형·파가 없어 관계가 급격히 끊기지는 않습니다. 대신 <b>서서히 식는</b> 방식으로 흔들립니다.')+'</p>';
  h+='<p>'+S.gongmangText(R)+'</p>';
  if(sal.length) h+='<p>'+sal.map(function(s){return '<b>'+s.name+'</b>('+s.pos+')';}).join(', ')+' — '+sal[0].txt+' 관계에서 강하게 나갈 때 이 힘이 나옵니다.</p>';
  h+=H('이 사주의 위기 신호')+'<p>'+S.MARR_CRISIS_BR[R.dBranch]+'</p>';
  h+=H('갈등이 커지는 구조')+'<p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>';
  h+=H('위기가 오는 방식')+'<p>이 사주는 <b>'+c.topGrp+'</b>이 중심이라, 그 기운이 무시당한다고 느낄 때 조용히 마음을 닫습니다. 상대는 이유를 모른 채 끝났다고 느낍니다.</p>';
  return h+K('한 줄','위기는 <b>큰 사건</b>이 아니라 <b>작은 침묵</b>으로 시작됩니다.');
}
function dv2(R,c,input,name){
  var danger=[];
  for(var i=0;i<R.seun.length;i++){
    var r=S.yearRead(R,R.seun[i].year);
    if(r.rels.some(function(x){return x.type==='충';})) danger.push({y:r.y,why:'일지·기둥과 충'});
    else if(r.grp==='관성'&&S.GOD_GROUP[S.tenGod(R.dStem,R.seun[i].idx%10)]==='관성'&&r.gi) danger.push({y:r.y,why:'기신이 겹친 관성'});
  }
  var h=H('흔들리는 해');
  h+='<p>'+(danger.length?('앞으로 다섯 해 중 <b>'+danger.map(function(o){return o.y+'년('+o.why+')';}).join(', ')+'</b>입니다. 이 해에는 이사·이직·별거 같은 생활 변화가 겹치기 쉬워 작은 갈등이 크게 느껴집니다.'):'앞으로 다섯 해에는 기둥과 직접 충하는 해가 없습니다. 대신 갈등이 쌓이는 구조를 점검하세요.')+'</p>';
  h+='<p>올해는 '+S.yearRead(R,R.seun[0].year).why+'</p>';
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
    {title:'두 사람의 기본 궁합',sub:'일간·일지·오행',body:cp1},
    {title:'생활 리듬의 차이',sub:'시간표가 먼저 부딪힌다',body:cp2},
    {title:'정서 온도',sub:'애정을 표현하는 방식',body:cp3},
    {title:'돈과 역할',sub:'살림의 현실 궁합',body:cp4},
    {title:'부딪히는 지점',sub:'반복되는 갈등',body:cp5},
    {title:'화해의 순서',sub:'싸운 뒤 다시 말 거는 법',body:cp6},
    {title:'5년과 12개월',sub:'두 사람의 날씨',body:cp7}
  ],
  wedding:[
    {title:'내 사주 속 연애운과 배우자궁',sub:'일지가 가리키는 사람과 나의 사랑 방식',body:wd1},
    {title:'나에게 결혼은 어떤 의미일까',sub:'삶을 키우는 사주, 족쇄가 되는 사주',body:wd2},
    {title:'내 사주 속 이혼수와 개운법',sub:'흔들리는 자리와 손보는 법',body:wd3},
    {title:'놓치면 안 될 결혼의 골든타임',sub:'대운·세운으로 보는 결혼의 문',body:wd4},
    {title:'미래 배우자의 모습과 내면',sub:'첫인상·가치관·경제관념·직종',body:wd5},
    {title:'절대 피해야 할 악연',sub:'나를 편안하게 하는 사람, 불안하게 하는 사람',body:wd6},
    {title:'결혼 이후의 삶과 자녀운, 그리고 결론',sub:'재물·관계·자녀와 맺음말',body:wd7}
  ],
  divorce:[
    {title:'위기의 신호',sub:'어디서부터 어긋나는가',body:dv1},
    {title:'흔들리는 해',sub:'충의 해와 달',body:dv2},
    {title:'갈등의 구조',sub:'서로가 원하는 것',body:dv3},
    {title:'결정 기준',sub:'결정 전 세 질문',body:dv4},
    {title:'아이가 있을 때',sub:'아이에게 해야 할 말',body:dv5},
    {title:'결정 후의 흐름',sub:'3개월과 1년',body:dv6},
    {title:'6개월의 기압',sub:'대화의 길이',body:dv7}
  ]
};
})();
