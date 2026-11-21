/* =====================================================================
   천령당 인생사주 리포트 (104쪽) — 책자 생성기
   A4 · 크림 배경 · 네이비 제목 · 오렌지 라벨
   ===================================================================== */
(function(){
'use strict';
var S=window.SJ;
var B={pages:[],R:null,c:null,input:null,name:'',num:{},chapters:[]};
window.BOOK=B;

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function n2(n){return n<10?'0'+n:''+n;}
function elK(i){return S.EL_KO[i]+'('+S.EL_HAN[i]+')';}
function elS(i){return '<b>'+S.EL_KO[i]+'</b>('+S.EL_HAN[i]+')';}
function stemS(s){return S.STEM_HAN[s]+'('+S.STEM_KO[s]+')';}
function brS(b){return S.BR_HAN[b]+'('+S.BR_KO[b]+')';}
function josa(s,pair){var c=s.charCodeAt(s.length-1);var has=(c>=0xAC00&&c<=0xD7A3)&&((c-0xAC00)%28)!==0;return has?pair[0]:pair[1];}

/* ---------------- 십이운성 ---------------- */
var UNSUNG_START=[11,5,2,9,2,9,5,0,8,3]; /* 갑해 을오 병인 정유 무인 기유 경사 신자 임신 계묘 */
var UNSUNG=['장생','목욕','관대','임관','제왕','쇠','병','사','묘','절','태','양'];
function unsung(dayStem,branch){
  var st=UNSUNG_START[dayStem];
  var idx=(dayStem%2===0)?S.mod(branch-st,12):S.mod(st-branch,12);
  return UNSUNG[idx];
}
var UNSUNG_MEAN={
 '장생':'새로 시작하는 힘. 배우고 자라는 자리라 처음엔 느리지만 오래 갑니다.',
 '목욕':'물에 몸을 담근 상태. 감정이 많고 인연이 잦지만 중심을 잡기 어렵습니다.',
 '관대':'옷을 갖춰 입은 자리. 사회성이 좋고 사람 앞에 서는 힘이 있습니다.',
 '임관':'자리를 맡은 자리. 책임과 권한이 함께 오고 조직에서 인정받습니다.',
 '제왕':'가장 강한 자리. 힘이 넘치지만 고집과 독선이 함께 옵니다.',
 '쇠':'한 번 꺾인 자리. 경험으로 사람을 살피는 눈이 생깁니다.',
 '병':'기운이 약한 자리. 몸과 마음이 예민해지고 배려가 깊어집니다.',
 '사':'끝을 정리하는 자리. 결단이 빠르고 미련이 적습니다.',
 '묘':'안으로 들어간 자리. 생각이 깊고 혼자 있는 시간이 필요합니다.',
 '절':'끊어진 자리. 변화가 잦고 새 판을 여는 힘이 있습니다.',
 '태':'씨앗의 자리. 아직 드러나지 않았지만 가능성이 큽니다.',
 '양':'기르는 자리. 받아들이고 돌보는 힘이 있습니다.'
};
/* ---------------- 신살 ---------------- */
var SAMHAP={0:['신','자','진'],1:['사','유','축'],2:['인','오','술'],3:['해','묘','미']};
function samOf(b){
  var h=S.BR_HAN[b];
  if('신자진'.indexOf(h)>=0) return 0;
  if('사유축'.indexOf(h)>=0) return 1;
  if('인오술'.indexOf(h)>=0) return 2;
  return 3;
}
var DOHWA=[3,6,9,0]; var YEOKMA=[8,11,2,5]; var HWAgae=[4,1,4,1];
function salsOf(R){
  var out=[];
  var branches={년지:R.yIdx%12, 월지:R.mIdx%12, 일지:R.dBranch};
  if(R.hIdxP!=null) branches['시지']=R.hIdxP%12;
  var base=samOf(R.dBranch);
  var dohwaBr=DOHWA[base], yeokBr=YEOKMA[base], hwaBr=HWAgae[base];
  for(var k in branches){
    if(branches[k]===dohwaBr) out.push({n:'도화살',b:k,t:'사람을 끄는 힘. 인연이 많고 눈에 띄지만, 관계에서 중심을 잡는 연습이 필요합니다.'});
    if(branches[k]===yeokBr) out.push({n:'역마살',b:k,t:'움직이는 힘. 이사·여행·이직이 잦고, 한곳에 머무는 것이 오히려 어색합니다.'});
    if(branches[k]===hwaBr) out.push({n:'화개살',b:k,t:'혼자 깊어지는 힘. 종교·예술·연구 쪽에 재능이 있고 고독을 견디는 힘이 있습니다.'});
  }
  var cheonul={0:[1,7],4:[1,7],6:[1,7],1:[0,8],5:[0,8],2:[11,9],3:[11,9],8:[3,5],9:[3,5],7:[2,6]}[R.dStem];
  if(cheonul){ for(var k2 in branches){ if(cheonul.indexOf(branches[k2])>=0 && !out.some(function(x){return x.n==='천을귀인';})) out.push({n:'천을귀인',b:k2,t:'막힐 때 사람이 나타나는 힘. 어려운 자리에서 도움을 받는 복이 있습니다.'}); } }
  var munchang=[5,6,8,9,8,9,11,0,2,3][R.dStem];
  for(var k3 in branches){ if(branches[k3]===munchang && !out.some(function(x){return x.n==='문창귀인';})) out.push({n:'문창귀인',b:k3,t:'배움과 글의 재능. 기록하고 설명하는 일에서 힘이 납니다.'}); }
  return out;
}

/* ---------------- 페이지 조립 ---------------- */
function page(label,body,opt){
  opt=opt||{};
  return '<section class="pg"><div class="pg-hd"><span class="l">天靈堂 · LIFE SAJU REPORT</span><span class="r">'+label+'</span></div>'+
    '<div class="pg-bd'+(opt.spread?' spread':'')+'">'+body+'</div>'+
    '<div class="pg-ft"><span>天靈堂 · 인생사주 리포트</span><span class="pn">__PN__</span></div></section>';
}
function push(html){ B.pages.push(html); }
function chapter(key,no,title,sub){
  B.chapters.push({key:key,no:no,title:title,sub:sub,page:B.pages.length+1});
}
function secLabel(no,label){ return '<div class="sec-label"><span>'+no+'</span>'+label+'</div>'; }
function callout(title,body){ return '<div class="callout"><div class="ct">'+title+'</div>'+body+'</div>'; }

/* ---------------- 표지 ---------------- */
function coverPage(){
  var R=B.R;
  return '<section class="pg cover"><div class="art" style="background-image:url(./assets/cover-art.jpg)"></div><div class="veil"></div><div class="frame"><i></i></div>'+
    '<div class="inner"><div><div class="seal">天</div><div class="cover-brand">天靈堂</div>'+
    '<div class="han">인생사주 리포트</div><div class="rule"></div><div class="sub">PREMIUM LIFE REPORT</div></div>'+
    '<div class="epi"><span class="orn"></span><p>여덟 글자에 새겨진 하늘의 뜻을<br>한 사람의 설계도로 옮겼습니다</p></div>'+
    '<div class="box"><div class="nm">'+esc(B.name)+'</div>'+
    '<div class="d">'+R.y+'.'+n2(R.m)+'.'+n2(R.d)+(R.hasTime?' · '+hourText(R):' · 시간 모름')+'<br>'+
    S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주 · '+S.ILJU[R.dIdx][0]+'</div></div>'+
    '<div class="cover-ft">2026 · CHEONRYEONGDANG · SEOUL · __TOT__ PAGES</div></div></section>';
}
function hourText(R){
  if(R.hIdxP==null) return '시간 모름';
  return S.BR_HAN[R.hIdxP%12]+'시 무렵';
}

/* ---------------- 서문 ---------------- */
function introPage(){
  var R=B.R,c=B.c;
  var body=secLabel('PROLOGUE','발간에 부쳐')+
   '<h1>당신의 여덟 글자를<br><span class="accent">한 사람의 설계도로</span></h1>'+
   '<p class="lead">사주는 미래를 정해둔 예언이 아닙니다. 태어난 순간의 하늘을 여덟 글자로 적어둔 <b>기록</b>이고, 그 기록은 ‘어떤 조건에서 이 사람이 가장 잘 자라는가’를 알려줍니다.</p>'+
   '<p>'+esc(B.name)+' 님의 원국은 '+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주입니다. 일간 '+stemS(R.dStem)+'은 '+S.DAY_MASTER[R.dStem][0]+'의 결이고, 가장 두터운 기운은 '+elS(c.mostI)+', 가장 얇은 기운은 '+elS(c.leastI)+'입니다. 이 책은 그 여덟 글자 위에 평생의 대운과 5년의 세운, 12개월의 달력을 얹어 한 사람의 인생 전체를 한 권으로 엮었습니다.</p>'+
   '<p>이 책을 읽는 방법은 간단합니다. 1장에서 원국을 확인하고, 2장에서 네 기둥을 한 칸씩 읽으세요. 3장부터 8장은 삶의 영역별 해설이고, 9장부터는 시간의 지도입니다. 급하면 9장(대운)과 11장(2027년 달력)부터 펼치셔도 좋습니다.</p>'+
   '<p>읽는 동안 세 가지 질문을 마음에 두시면 좋습니다. “나는 어떤 조건에서 힘이 나는가”, “나는 어떤 상황에서 먼저 지치는가”, “지금 내가 미루고 있는 결정은 무엇인가”. 이 책의 스물한 장은 모두 이 세 질문에 서로 다른 각도에서 답하는 글입니다. 그래서 한 번에 다 읽지 않아도 괜찮습니다. 마음에 걸리는 장부터 펼치세요.</p>'+
   callout('이 책을 읽는 태도','<p>여기 적힌 문장은 정답이 아니라 <b>질문</b>입니다. “내가 왜 이 자리에서 지치는지”, “왜 같은 관계를 반복하는지”에 대한 하나의 설명으로 읽어주세요. 맞지 않는 문장은 넘기시면 됩니다.</p>')+
   '<p class="small">※ 본 책자는 사주명리 상징을 생활의 언어로 옮긴 참고 해석입니다. 의학적 진단, 법률·투자 판단을 대신하지 않습니다.</p>';
  push(page('PROLOGUE',body,{spread:true}));
}

/* ---------------- 목차 ---------------- */
function tocPages(){
  var rows=B.chapters.map(function(ch){
    return '<div class="toc-r"><span class="n">'+ch.no+'</span><span class="t">'+ch.title+'</span><span class="d"></span><span class="p">__TOC_'+ch.key+'__</span></div>';
  });
  var half=Math.ceil(rows.length/2);
  push(page('CONTENTS 01','<div class="sec-label"><span>00</span>목차 · CONTENTS</div><h1>이 책의 지도</h1><div class="toc-list">'+rows.slice(0,half).join('')+'</div>',{spread:true}));
  push(page('CONTENTS 02','<div class="sec-label"><span>00</span>목차 · CONTENTS</div><h1>이어서</h1><div class="toc-list">'+rows.slice(half).join('')+'</div><p class="note">쪽수는 인쇄 기준입니다. PDF 뷰어에서는 페이지 번호로 바로 이동할 수 있습니다.</p>',{spread:true}));
}

/* ---------------- 1장 요약 ---------------- */
function summaryPage(){
  var R=B.R,c=B.c;
  var best=S.bestDaeun(R,c);
  var tags='<div style="margin:2mm 0 5mm"><span class="tag">'+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주</span><span class="tag navy">'+(R.strength==='강'?'신강':(R.strength==='약'?'신약':'중화'))+'</span><span class="tag">용신 '+elK(c.yongEl)+'</span><span class="tag soft">중심 '+c.topGrp+'</span><span class="tag soft">'+c.topGodInGrp+'</span></div>';
  var body=secLabel('01','EXECUTIVE SUMMARY · 총평')+
   '<h1>한 장으로 보는<br><span class="accent">'+esc(B.name)+' 님의 설계도</span></h1>'+tags+
   '<p class="lead">'+S.DAY_MASTER[R.dStem][0]+'의 결로 태어났고, 여기에 '+brS(R.dBranch)+'가 앉아 <b>'+S.ILJU[R.dIdx][0]+'</b>이 되었습니다. '+S.STRENGTH_TXT[R.strength].out+'</p>'+
   '<table><tr><th>항목</th><th>이 사주의 결</th></tr>'+
   '<tr><td class="k">중심 기운</td><td>'+S.GROUP_MEAN[c.topGrp]+'</td></tr>'+
   '<tr><td class="k">중심의 별</td><td>'+S.GOD_DEEP[c.topGodInGrp]+'</td></tr>'+
   '<tr><td class="k">필요한 기운</td><td>'+S.EL_KO[c.yongEl]+' — '+S.EL_DEEP[c.yongEl].color+', '+S.EL_DEEP[c.yongEl].dir+', '+S.EL_DEEP[c.yongEl].habit+'.</td></tr>'+
   '<tr><td class="k">가장 힘든 지점</td><td>'+S.STRENGTH_TXT[R.strength].adv+'</td></tr>'+
   '<tr><td class="k">가장 힘이 실리는 10년</td><td>'+R.daeun[best.i].from+'~'+R.daeun[best.i].to+'세 · '+S.tenGod(R.dStem,R.daeun[best.i].idx%10)+' — '+(S.GOD_DAEUN[S.tenGod(R.dStem,R.daeun[best.i].idx%10)]||'')+'</td></tr>'+
   '<tr><td class="k">지금</td><td>'+R.age+'세 · '+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세 대운의 '+(R.age-R.daeun[R.curDaeun].from+1)+'년 차</td></tr></table>'+
   callout('이 책의 결론 세 줄','<p>1. 이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>으로 살 때 가장 편안합니다. 그 힘이 쓰이지 않는 자리에서는 능력과 별개로 먼저 지칩니다.</p><p>2. 필요한 기운은 '+elK(c.yongEl)+'입니다. 큰 사건보다 매일의 작은 선택이 균형을 만듭니다.</p><p>3. 시간의 문은 <b>'+R.daeun[best.i].from+'~'+R.daeun[best.i].to+'세</b>에 가장 크게 열립니다. 그 전에 무엇을 심어두는지가 결과를 바꿉니다.</p>');
  chapter('summary','01','총평 · 한 장 요약','원국·중심·용신·대운');
  push(page('01 / SUMMARY',body,{spread:true}));
}

/* ---------------- 2장 원국 ---------------- */
function chartPage(){
  var R=B.R,c=B.c;
  var cells=[['년주',R.yIdx,'祖 · 초년'],['월주',R.mIdx,'父母 · 청년'],['일주',R.dIdx,'我 · 배우자'],['시주',R.hIdxP,'子 · 말년']];
  var h='<div class="chart4">';
  cells.forEach(function(x,i){
    var ix=x[1];
    if(ix==null){ h+='<div class="c"><div class="lab">'+x[0]+'</div><div class="god">時未知</div><div class="st" style="color:#7C6E58">—</div><div class="ko">시간 모름</div><div class="st" style="color:#7C6E58">—</div><div class="ko">&nbsp;</div></div>'; return; }
    var s=ix%10,b=ix%12;
    h+='<div class="c'+(i===2?' me':'')+'"><div class="lab">'+x[0]+'</div>'+
      '<div class="god">'+(i===2?'일간':S.tenGod(R.dStem,s))+'</div>'+
      '<div class="st">'+S.STEM_HAN[s]+'</div><div class="ko">'+S.STEM_KO[s]+'</div>'+
      '<div class="st">'+S.BR_HAN[b]+'</div><div class="ko">'+S.BR_KO[b]+' · '+S.EL_KO[S.BR_EL[b]]+'</div></div>';
  });
  h+='</div>';
  // 십성 / 운성 / 신살 표
  h+='<table><tr><th>구분</th><th>년주</th><th>월주</th><th>일주</th><th>시주</th></tr>';
  var row=function(label,fn){
    var s='<tr><td class="k">'+label+'</td>';
    cells.forEach(function(x){ s+='<td>'+(x[1]==null?'—':fn(x[1]))+'</td>'; });
    return s+'</tr>';
  };
  h+=row('십성',function(ix){ return ix===B.R.dIdx?'일간':S.tenGod(R.dStem,ix%10); });
  h+=row('지지 오행',function(ix){ return S.EL_KO[S.BR_EL[ix%12]]+'('+S.EL_HAN[S.BR_EL[ix%12]]+')'; });
  h+=row('십이운성',function(ix){ return unsung(R.dStem,ix%12); });
  h+='</table>';
  var body=secLabel('02','ORIGINAL CHART · 원국')+
   '<h1>여덟 글자의 <span class="accent">지도</span></h1>'+
   '<p class="lead">'+R.y+'년 '+n2(R.m)+'월 '+n2(R.d)+'일'+(R.hasTime?' · 시주 기록':' · 시간 미상(육자)')+'. 일간은 '+stemS(R.dStem)+'이며, 일지를 기준으로 나머지 글자의 십성을 읽습니다.</p>'+h+
   '<p>년주는 조상과 초년(0~15세), 월주는 부모와 청년(16~30세), 일주는 나와 배우자(31~45세), 시주는 자녀와 말년(46세 이후)을 상징합니다. 네 기둥 중 <b>일간</b>이 이 사주의 주인이고, <b>일지</b>는 배우자궁이자 내가 앉는 자리입니다.</p>'+
   callout('원국을 읽는 첫 문장','<p>이 사주는 <b>'+S.STEM_HAN[R.dStem]+'('+S.STEM_KO[R.dStem]+')</b> 일간이 '+brS(R.dBranch)+' 위에 앉아 <b>'+S.ILJU[R.dIdx][0]+'</b>의 결을 만들었습니다. '+S.ILJU[R.dIdx][1]+'</p>');
  chapter('chart','02','원국 · 여덟 글자','사주 원국표와 십성·운성');
  push(page('02 / CHART',body,{spread:true}));
}

function elPage(){
  var R=B.R,c=B.c;
  var h='';
  for(var i=0;i<5;i++){
    h+='<div class="elrow"><span class="n">'+S.EL_KO[i]+' '+S.EL_HAN[i]+'</span><span class="bar"><i style="width:'+Math.max(2,R.pct[i])+'%;background:'+S.EL_COLOR[i]+'"></i></span><span class="v">'+R.pct[i].toFixed(1)+'% · '+R.count[i]+'</span></div>';
  }
  var body=secLabel('03','FIVE ELEMENTS · 오행')+
   '<h1>다섯 기운의 <span class="accent">무게</span></h1>'+
   '<p class="lead">여덟 글자(시간을 모르면 여섯 글자)의 천간과 지지를 오행으로 환산했습니다. 합계 '+R.total+'개 중에서 가장 두터운 기운은 '+elS(c.mostI)+' '+R.pct[c.mostI].toFixed(1)+'%, 가장 얇은 기운은 '+elS(c.leastI)+' '+R.pct[c.leastI].toFixed(1)+'%입니다.</p>'+h+
   '<h3>가장 강한 기운 — '+elK(c.mostI)+'</h3><p>'+S.EL_DEEP[c.mostI].over+'</p>'+
   '<h3>가장 약한 기운 — '+elK(c.leastI)+'</h3><p>'+S.EL_DEEP[c.leastI].under+'</p>'+
   '<p>오행의 균형은 숫자보다 <b>어느 쪽으로 기울어 있는지</b>가 중요합니다. 넘치는 기운은 억제하기보다 <b>잘 쓰는 법</b>을 익히고, 얇은 기운은 생활에서 의식적으로 채웁니다.</p>';
  chapter('element','03','오행 · 다섯 기운','분포와 균형');
  push(page('03 / ELEMENTS',body,{spread:true}));
}

function godPage(){
  var R=B.R,c=B.c;
  var order=['비겁','식상','재성','관성','인성'];
  var role={'비겁':'나·동료·자존심','식상':'재능·표현·결과물','재성':'돈·현실·성과','관성':'자리·규칙·책임','인성':'배움·휴식·보호'};
  var h='<table><tr><th>묶음</th><th>개수</th><th>담당</th><th>이 사주에서</th></tr>';
  order.forEach(function(k){
    var n=c.grp[k];
    h+='<tr><td class="k">'+k+'</td><td>'+n+'</td><td>'+role[k]+'</td><td style="font-size:12px">'+(n>=3?'두터움 — 이 기운이 삶의 중심':(n===0?'비어 있음 — 의식적으로 채워야':'고른 편'))+'</td></tr>';
  });
  h+='</table>';
  var h2='<table><tr><th>십성</th><th>개수</th><th>의미</th></tr>';
  S.GODS.forEach(function(g){ if(c.gc[g]>0) h2+='<tr><td class="k">'+g+'</td><td>'+c.gc[g]+'</td><td>'+S.GOD_DEEP[g]+'</td></tr>'; });
  h2+='</table>';
  var body=secLabel('04','TEN GODS · 십성')+
   '<h1>무엇으로 이루어진 <span class="accent">사람인가</span></h1>'+
   '<p class="lead">십성은 일간과 다른 글자의 관계를 열 가지로 나눈 이름입니다. 재료를 알면 “이 사람이 어떤 상황에서 힘을 내고 어디서 지치는지”가 보입니다.</p>'+h+
   '<p>가장 두터운 묶음은 <b>'+c.topGrp+'</b>입니다. '+S.GROUP_MEAN[c.topGrp]+' 그 안에서 가장 강한 별은 <b>'+c.topGodInGrp+'</b> — '+S.GOD_DEEP[c.topGodInGrp]+'</p>'+
   callout('십성 사용법','<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 쓰이는 자리에서 오래 갑니다. 반대로 '+c.topGrp+'이 무시당하는 자리에 오래 있으면 능력과 별개로 몸이 먼저 지칩니다. 그 감각이 들면 자리를 바꿀 신호로 보세요.</p>');
  chapter('tenGods','04','십성 · 재료','열 가지 별의 구조');
  push(page('04 / TEN GODS',body,{spread:true}));
  var body2=secLabel('04','TEN GODS · 십성 상세')+
   '<h2>이 사주에 실제로 있는<br><span class="accent">열 가지 별</span></h2>'+
   '<p>아래 표는 이 원국에 실제로 들어 있는 십성만 골라, 각각이 생활에서 어떻게 드러나는지 적은 것입니다. 개수는 천간과 지지에 있는 글자를 함께 센 값이라, 같은 별이 두 개 세 개면 그 결이 반복해서 나타납니다.</p>'+h2+
   '<p>표를 읽을 때는 개수가 많은 별부터 보세요. 세 개 이상이면 그 기운이 삶의 기본값이 되고, 하나도 없으면 반대로 <b>의식적으로 채워야 하는 자리</b>가 됩니다. 없는 것은 약점이 아니라 방향입니다.</p>'+
   '<p class="note">※ 십성은 사람을 평가하는 등급이 아니라, 기운이 움직이는 방식을 부르는 이름입니다.</p>';
  push(page('04 / TEN GODS',body2,{spread:true}));
}

function salsPage(){
  var R=B.R;
  var sals=salsOf(R);
  var h='<table><tr><th>글자</th><th>위치</th><th>십이운성</th></tr>';
  var cols=[['년지',R.yIdx%12],['월지',R.mIdx%12],['일지',R.dBranch]];
  if(R.hIdxP!=null) cols.push(['시지',R.hIdxP%12]);
  cols.forEach(function(x){ h+='<tr><td class="k">'+brS(x[1])+'</td><td>'+x[0]+'</td><td>'+unsung(R.dStem,x[1])+' — '+UNSUNG_MEAN[unsung(R.dStem,x[1])]+'</td></tr>'; });
  h+='</table>';
  var body=secLabel('05','TWELVE STAGES · 십이운성과 신살')+
   '<h1>기운이 머무는 <span class="accent">자리</span></h1>'+
   '<p class="lead">십이운성은 일간의 기운이 각 지지에서 어느 단계에 있는지를 보여줍니다. 같은 글자라도 사람마다 단계가 달라, 힘의 세기와 쓰임이 달라집니다.</p>'+h+
   '<h3>신살(神煞)</h3>'+
   (sals.length?'<ul>'+sals.map(function(s){return '<li><b>'+s.n+'</b> · '+s.b+' — '+s.t+'</li>';}).join('')+'</ul>':'<p>이 사주에는 대표적인 신살이 뚜렷하게 걸리지 않았습니다. 신살이 없다는 것은 흠이 아니라, 삶의 결이 <b>사주 본연의 구조</b>로 더 또렷하게 나타난다는 뜻입니다.</p>')+
   '<p>신살은 “있다/없다”보다 <b>어느 자리에 있는지</b>가 중요합니다. 년지·월지에 있으면 초년과 사회 초기의 성향으로, 일지에 있으면 배우자와의 관계로, 시지에 있으면 말년과 자녀의 결로 나타납니다.</p>'+
   callout('신살을 읽는 태도','<p>신살은 길흉의 낙인이 아닙니다. 도화는 매력, 역마는 이동, 화개는 몰입 — 쓰는 방식에 따라 재능이 되고 부담이 됩니다.</p>');
  chapter('stages','05','십이운성 · 신살','기운이 머무는 자리');
  push(page('05 / STAGES',body,{spread:true}));
}

function strengthPage(){
  var R=B.R,c=B.c;
  var yongWhy=(R.strength==='약')?'일간이 약한 편(신약)이라 나를 생해주는 '+elK(c.yongEl)+'의 기운으로 뿌리를 보강하는 것이 먼저입니다.':(R.strength==='강'?'일간이 강한 편(신강)이라 넘치는 힘을 밖으로 풀어내는 '+elK(c.yongEl)+'의 기운이 약이 됩니다.':'전체 균형이 크게 기울지 않아 가장 얇은 '+elK(c.yongEl)+' 기운을 채우는 것이 가장 효율적입니다.');
  var d=S.EL_DEEP[c.yongEl];
  var body=secLabel('06','USEFUL GOD · 격국과 용신')+
   '<h1>이 사주에 필요한<br><span class="accent">한 가지 기운</span></h1>'+
   '<p class="lead">일간의 힘은 <b>'+(R.strength==='강'?'강(신강)':(R.strength==='약'?'약(신약)':'중화에 가까움'))+'</b>입니다. '+S.STRENGTH_TXT[R.strength].out+'</p>'+
   '<p>'+yongWhy+'</p>'+
   '<table><tr><th>용신</th><th>'+elK(c.yongEl)+'</th></tr>'+
   '<tr><td class="k">색</td><td>'+d.color+'</td></tr>'+
   '<tr><td class="k">방위</td><td>'+d.dir+'</td></tr>'+
   '<tr><td class="k">계절</td><td>'+d.season+'</td></tr>'+
   '<tr><td class="k">공간</td><td>'+d.space+'</td></tr>'+
   '<tr><td class="k">생활</td><td>'+d.habit+'</td></tr>'+
   '<tr><td class="k">음식</td><td>'+d.food+' · '+d.taste+'</td></tr>'+
   '<tr><td class="k">소품</td><td>'+d.item+'</td></tr></table>'+
   '<p>'+S.EL_DEEP[c.mostI].over+' 가장 두터운 기운이 곧 필요한 기운이라면, 억지로 덜어내기보다 <b>잘 쓰는 법</b>을 익히는 쪽이 맞습니다. 반대라면 넘치는 기운을 더 밀어붙이지 않도록 주의하세요.</p>'+
   callout('용신을 쓰는 법','<p>개운은 큰 의식이 아닙니다. 매일 '+S.EL_KO[c.yongEl]+' 쪽으로 조금씩 기울여두면, 일 년 뒤 사주의 균형이 눈에 띄게 달라집니다. '+d.habit+' — 이것 하나부터.</p>');
  chapter('yong','06','격국 · 용신','필요한 기운과 보완');
  push(page('06 / YONGSIN',body,{spread:true}));
}

/* ---------------- 3장 네 기둥 ---------------- */
function pillarPages(){
  var R=B.R,c=B.c;
  var defs=[
    {name:'년주',ix:R.yIdx,range:'0~15세 · 뿌리',desc:'조상과 집안의 분위기, 그리고 초년의 환경을 상징합니다. 이 자리는 “내가 태어난 조건”입니다.',key:'year'},
    {name:'월주',ix:R.mIdx,range:'16~30세 · 사회 초년',desc:'부모와 형제, 그리고 사회에 처음 나갈 때의 자리입니다. 직업의 재료가 여기서 나옵니다.',key:'month'},
    {name:'일주',ix:R.dIdx,range:'31~45세 · 나와 배우자',desc:'일간은 나, 일지는 내가 앉는 자리이자 배우자궁입니다. 가장 중요한 기둥입니다.',key:'day'},
    {name:'시주',ix:R.hIdxP,range:'46세 이후 · 결실',desc:'자녀와 말년, 그리고 내가 남기는 것을 상징합니다.',key:'hour'}
  ];
  defs.forEach(function(df,i){
    var ix=df.ix;
    var body=secLabel('07','FOUR PILLARS · '+df.name);
    if(ix==null){
      body+='<h1>'+df.name+' — <span class="accent">시간 미상</span></h1>'+
        '<p class="lead">태어난 시간을 모르면 시주를 세우지 않습니다. 여섯 글자로도 충분히 읽을 수 있지만, 시주가 있어야 자녀·말년·숨은 재능까지 정확해집니다.</p>'+
        '<p>시주는 하루 중 태어난 시각을 뜻합니다. 출생신고서나 어머니의 기억, 병원 기록에서 확인할 수 있다면 이 책의 9~10장과 11장이 더 정밀해집니다.</p>'+
        callout('시간을 모른 채 읽는 법','<p>시주가 없으면 일지와 월지의 관계로 말년의 결을 대신 봅니다. 이 사주는 일지 '+brS(R.dBranch)+'가 그 역할을 합니다. '+S.BR_INNER[R.dBranch]+'</p>');
      chapter(df.key,'07-'+(i+1),df.name+' · '+df.range,'시간 미상');
      push(page('07 / PILLARS',body,{spread:true}));
      return;
    }
    var s=ix%10,b=ix%12,g=S.tenGod(R.dStem,s);
    body+='<h1>'+df.name+' — <span class="accent">'+S.STEM_HAN[s]+S.BR_HAN[b]+'</span></h1>'+
      '<p class="lead">'+df.desc+'</p>'+
      '<div class="chart4"><div class="c"><div class="lab">천간</div><div class="god">'+g+'</div><div class="st">'+S.STEM_HAN[s]+'</div><div class="ko">'+S.STEM_KO[s]+' · '+S.EL_KO[S.STEM_EL[s]]+'</div></div>'+
      '<div class="c"><div class="lab">지지</div><div class="god">'+unsung(R.dStem,b)+'</div><div class="st">'+S.BR_HAN[b]+'</div><div class="ko">'+S.BR_KO[b]+' · '+S.EL_KO[S.BR_EL[b]]+'</div></div>'+
      '<div class="c"><div class="lab">십성</div><div class="god">'+S.GOD_GROUP[g]+'</div><div class="st" style="font-size:18px">'+g+'</div><div class="ko">'+S.GOD_KEY[g]+'</div></div>'+
      '<div class="c"><div class="lab">단계</div><div class="god">'+df.range.split(' · ')[0]+'</div><div class="st" style="font-size:17px">'+df.range.split(' · ')[1]+'</div><div class="ko">'+unsung(R.dStem,b)+'</div></div></div>'+
      '<h3>이 기둥의 결</h3><p>'+S.GOD_DEEP[g]+'</p>'+
      '<p>'+S.BR_INNER[b]+' 이 기둥에서 이 글자가 놓인 자리는 '+df.range.split(' · ')[1]+'의 시기입니다. 그래서 이 시기에 '+S.GOD_KEY[g]+'의 성향이 삶의 방식으로 굳어집니다.</p>'+
      '<p>'+UNSUNG_MEAN[unsung(R.dStem,b)]+'</p>'+
      callout('이 기둥을 쓰는 법','<p>'+df.name+'는 '+S.GOD_KEY[g]+'의 자리입니다. '+S.GROUP_MEAN[S.GOD_GROUP[g]]+' 이 재료를 '+df.range.split(' · ')[1]+'에 어떻게 썼는지가 지금의 습관이 되었습니다.</p>');
    chapter(df.key,'07-'+(i+1),df.name+' · '+df.range,S.STEM_HAN[s]+S.BR_HAN[b]+' · '+g);
    push(page('07 / PILLARS',body,{spread:true}));
  });
}

/* ---------------- 4장 성격 ---------------- */
function personalityPages(){
  var R=B.R,c=B.c;
  var dm=S.DM_DEEP[R.dStem];
  var pages=[
   {t:'겉으로 보이는 나',body:'<p class="lead">'+dm.out+'</p>'+
     '<p>사람들이 이 사주를 처음 기억하는 방식은 <b>'+S.EL_PERSON[R.dayEl]+'</b>입니다. '+S.ENV_BY_EL[R.dayEl]+'에서 가장 자연스러워지고, 그 반대 환경에서는 표정부터 굳습니다.</p>'+
     '<h3>첫인상의 재료</h3><p>일간 '+stemS(R.dStem)+'은 '+S.DAY_MASTER[R.dStem][0]+'의 결입니다. 여기에 일지 '+brS(R.dBranch)+'가 더해져 겉과 속의 온도가 다릅니다. '+S.BR_INNER[R.dBranch]+'</p>'+
     '<p>'+(c.grp['관성']>=3?'관성의 기운이 '+c.grp['관성']+'개라 처음에는 선을 넘지 않고 규칙을 지키는 사람처럼 보입니다. 그 인상이 신뢰를 만들지만, 동시에 “속을 모르겠다”는 말을 듣기도 합니다.':(c.grp['식상']>=3?'식상이 두터워 좋은 것도 싫은 것도 금방 드러납니다. 그 솔직함이 사람을 편하게 하지만, 가끔 준비되지 않은 자리에서 너무 많이 말합니다.':(c.grp['인성']>=3?'인성이 두터워 말수가 적고 대답이 한 박자 늦습니다. 대신 한 번 한 말은 무게가 있어, 사람들이 결정을 맡기고 싶어 합니다.':'이 사주는 표정과 말이 같은 방향으로 움직입니다. 그래서 사람들이 긴장을 풀고, 이 사람 앞에서 자기 이야기를 꺼냅니다.')))+'</p>'},
   {t:'가까운 사람이 아는 나',body:'<p class="lead">'+dm.in+'</p>'+
     '<p>'+S.BR_INNER[R.dBranch]+' 그래서 오래 아는 사람일수록 이 사람을 처음 본 인상과 다르게 기억합니다.</p>'+
     '<h3>혼자 있을 때</h3><p>이 사주는 혼자 있는 시간에 마음을 정리합니다. '+S.EL_DEEP[c.leastI].under+' 그래서 혼자 있는 시간이 부족하면 표정이 먼저 굳습니다.</p>'+
     '<h3>가까운 사람에게 특히</h3><p>'+(c.grp['비겁']>=3?'가까운 사람에게는 자존심을 숨기지 않습니다. 편하다는 뜻이지만, 상대는 그 직설이 오래 남을 수 있습니다.':'가까운 사람에게 다정하지만 문을 여는 데 시간이 걸립니다. 한 번 마음을 열면 오래갑니다.')+'</p>'},
   {t:'기운이 빠져나가는 순간',body:'<p class="lead">'+dm.drain+'</p>'+
     '<h3>지치는 조건</h3><p>이 사주의 중심 기운은 <b>'+c.topGrp+'</b>입니다. '+S.GROUP_MEAN[c.topGrp]+' 이 기운이 무시당하거나 제대로 쓰이지 못할 때, 몸과 마음이 동시에 지칩니다.</p>'+
     '<ul><li>'+c.topGrp+'의 결이 필요 없는 자리</li><li>설명하지 못한 채 결과만 요구받는 상황</li><li>'+S.EL_KO[c.leastI]+'의 결이 결핍된 환경 — '+S.EL_DEEP[c.leastI].part+' 쪽이 먼저 신호를 보냅니다</li></ul>'+
     '<p>이 감각이 2주 이상 이어지면 그것은 성격이 아니라 <b>환경의 문제</b>입니다. 이 사주는 참는 힘이 강해 스스로를 늦게 알아챕니다.</p>'},
   {t:'타고난 무기와 조심할 결',body:'<p class="lead">'+dm.weapon+'</p>'+
     '<p>여덟 글자에서 <b>'+c.topGrp+'</b>이 가장 두터우니, 이 무기는 결국 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>에서 나옵니다. '+S.GOD_DEEP[c.topGodInGrp]+'</p>'+
     '<h3>조심할 결</h3><p>'+dm.weak+'</p>'+
     '<p>'+S.STRENGTH_TXT[R.strength].adv+'</p>'+
     callout('성격을 쓰는 한 가지 규칙','<p>이 사주는 자기 기준이 분명한 사람입니다. 그 기준을 <b>말로 옮기는 것</b>이 관계의 핵심입니다. 기준만 있고 말이 없으면 사람들은 이 사람을 “차갑다”고 기억합니다.</p>')}
  ];
  chapter('personality','08','성격과 기질','겉과 속, 그리고 무기');
  pages.forEach(function(p,i){
    push(page('08 / PERSONALITY',secLabel('08','PERSONALITY · 성격 '+(i+1))+'<h1>'+p.t+'</h1>'+p.body,{spread:true}));
  });
}

/* ---------------- 5장 관계 ---------------- */
function relationPages(){
  chapter('relations','09','관계와 귀인','사람 사이의 방식');
  var R=B.R,c=B.c;
  push(page('09 / RELATIONS',secLabel('09','RELATIONS · 관계')+'<h1>사람 사이에서<br><span class="accent">어떤 사람인가</span></h1>'+
    '<p class="lead">이 사주의 대인관계는 <b>'+c.topGrp+'</b>을 재료로 만들어집니다. '+S.GROUP_MEAN[c.topGrp]+'</p>'+
    '<table><tr><th>관계</th><th>이 사주가 하는 방식</th></tr>'+
    '<tr><td class="k">처음 만날 때</td><td>'+S.DM_DEEP[R.dStem].out+'</td></tr>'+
    '<tr><td class="k">가까워질 때</td><td>'+S.BR_INNER[R.dBranch]+'</td></tr>'+
    '<tr><td class="k">부딪힐 때</td><td>'+S.CONFLICT_BY_EL[R.dayEl]+'</td></tr>'+
    '<tr><td class="k">회복할 때</td><td>'+(S.GOD_GROUP[c.topGodInGrp]==='인성'?'시간을 두고 스스로 정리한 뒤, 조용히 다시 말을 겁니다.':'행동으로 먼저 다가갑니다. 말보다 밥과 일정으로 마음을 보여줍니다.')+'</td></tr></table>'+
    '<h3>이 사주가 사람에게 주는 것</h3><p>'+S.ENV_BY_EL[R.dayEl]+'에서 이 사람은 가장 자연스러워집니다. 사람들은 이 사주 곁에서 <b>자기 속도를 인정받는 느낌</b>을 받습니다.</p>'+
    '<h3>이 사주가 사람에게 바라는 것</h3><p>'+S.GOD_KEY[c.topGodInGrp]+'의 방식을 <b>당연하게 여겨주는 것</b>입니다. 이 부분이 무시당하면 조용히 거리를 둡니다.</p>',{spread:true}));
  push(page('09 / RELATIONS',secLabel('09','RELATIONS · 관계 2')+'<h1>오래 가는 관계의<br><span class="accent">조건</span></h1>'+
    '<p class="lead">이 사주는 사람이 많은 자리보다 <b>한두 명의 깊은 관계</b>에서 힘을 얻습니다. 일지 '+brS(R.dBranch)+'가 그 이유를 보여줍니다.</p>'+
    '<ul><li><b>말의 속도</b>가 맞는 사람 — 이 사주는 결론을 서두르는 사람에게 지칩니다.</li>'+
    '<li><b>기억해주는 사람</b> — 사소한 것을 기억했다가 꺼내는 사람에게 마음이 열립니다.</li>'+
    '<li><b>자기 자리가 있는 사람</b> — 이 사주는 상대가 자기 생활을 가진 사람을 편하게 여깁니다.</li></ul>'+
    '<h3>피해야 할 관계</h3><p>'+S.LOVE_MISTAKE_GOD[c.topGodInGrp]+' 이 패턴은 연애뿐 아니라 친구·동료 관계에서도 반복됩니다.</p>'+
    '<h3>관계를 정리하는 방식</h3><p>이 사주는 싸워서 정리하지 않습니다. 조용히 연락을 줄이고, 상대는 이유를 모릅니다. 정리해야 한다면 <b>한 문장</b>은 남기세요. 그것이 이 사주 자신을 위한 일입니다.</p>',{spread:true}));
  push(page('09 / BENEFACTOR',secLabel('09','BENEFACTOR · 귀인')+'<h1>이 사람을<br><span class="accent">도와주는 사람</span></h1>'+
    '<p class="lead">귀인은 돈을 주는 사람이 아니라, <b>나를 쓸 자리에 데려다주는 사람</b>입니다. 이 사주에게 필요한 기운은 '+elK(c.yongEl)+'입니다.</p>'+
    '<table><tr><th>귀인의 결</th><th>어떤 사람인가</th></tr>'+
    '<tr><td class="k">기운</td><td>'+S.EL_KO[c.yongEl]+' — '+S.EL_PERSON[c.yongEl]+'</td></tr>'+
    '<tr><td class="k">만나는 자리</td><td>'+S.EL_DEEP[c.yongEl].dir+' 방향의 모임, '+S.EL_DEEP[c.yongEl].color+' 계열의 공간</td></tr>'+
    '<tr><td class="k">계절</td><td>'+S.EL_DEEP[c.yongEl].season+'에 시작된 인연</td></tr>'+
    '<tr><td class="k">나이</td><td>'+(S.GOD_GROUP[c.topGodInGrp]==='인성'?'나보다 위인 사람':'나와 비슷하거나 아래인 사람')+'</td></tr></table>'+
    '<h3>귀인을 만나는 조건</h3><p>이 사주는 <b>설명해야 하는 자리</b>에서 귀인을 만납니다. 내 일을 말로 정리해 누군가에게 설명할 때, 그 사람이 “그거면 되겠네”라고 말해줍니다. 그래서 이 사주에게 가장 중요한 습관은 <b>기록과 설명</b>입니다.</p>'+
    callout('귀인을 기다리지 마세요','<p>귀인은 찾는 것이 아니라 <b>내가 준비된 자리</b>에 나타납니다. '+S.EL_DEEP[c.yongEl].habit+' — 이 습관이 귀인을 만나는 조건입니다.</p>'),{spread:true}));
}

/* ---------------- 6장 재물 ---------------- */
function moneyPages(){
  chapter('wealth','10','재물과 자산','그릇·새는 곳·10년');
  var R=B.R,c=B.c;
  var jeong=c.gc['정재'],pyeon=c.gc['편재'];
  push(page('10 / WEALTH',secLabel('10','WEALTH · 재물')+'<h1>돈의 그릇과<br><span class="accent">들어오는 문</span></h1>'+
    '<p class="lead">재성은 <b>'+(jeong+pyeon)+'개</b>(정재 '+jeong+' · 편재 '+pyeon+')입니다. '+(pyeon>jeong?'변동형 수입에 강하고 큰 판을 보는 눈이 있습니다.':(jeong>pyeon?'고정형 수입에 강하고 관리에 능합니다.':'고정과 변동이 반반이라 균형 잡힌 운영이 맞습니다.'))+'</p>'+
    '<table><tr><th>구분</th><th>이 사주의 결</th></tr>'+
    '<tr><td class="k">그릇</td><td>'+(S.WEALTH_VESSEL_GOD[c.topGodInGrp]||'성실함이 그대로 재산이 되는 구조')+'</td></tr>'+
    '<tr><td class="k">일간의 힘</td><td>'+R.strength+' — '+S.STRENGTH_TXT[R.strength].adv+'</td></tr>'+
    '<tr><td class="k">새는 곳</td><td>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'사람을 통한 지출에서 계산이 흐려집니다.')+'</td></tr>'+
    '<tr><td class="k">맞는 일</td><td>'+S.WORK_BY_GRP[c.topGrp]+'</td></tr></table>'+
    '<h3>돈을 보는 눈</h3><p>'+(c.grp['재성']>=3?'이 사주는 현실적인 계산이 빠릅니다. 다만 사람이 앞서면 계산이 흐려지니, 큰 결정은 혼자 숫자로 확인하는 시간을 두세요.':(c.grp['식상']>=3?'아이디어가 돈이 되는 구조입니다. 검증 없이 뛰어들지 말고 작은 금액으로 먼저 확인하세요.':(c.grp['인성']>=3?'공부하고 확신이 생겨야 움직입니다. 확신이 늦어 기회를 놓치지 않도록 기한을 정하세요.':(c.grp['관성']>=3?'안정형입니다. 원금과 절차를 중요하게 보고, 급한 제안에 흔들리지 않습니다.':'내 판단을 믿는 편입니다. 손실 한도를 먼저 정하는 것이 가장 중요합니다.'))))+'</p>',{spread:true}));
  push(page('10 / WEALTH',secLabel('10','WEALTH · 재물 2')+'<h1>돈이 새는<br><span class="accent">세 개의 구멍</span></h1>'+
    '<p class="lead">돈은 벌이의 크기보다 <b>새는 곳</b>에서 갈립니다. 이 사주는 특히 사람과 감정에 연결된 지출에서 새기 쉽습니다.</p>'+
    '<h3>1. 사람에게 쓰는 돈</h3><p>이 사주의 중심 기운은 '+c.topGrp+'입니다. '+S.GROUP_MEAN[c.topGrp]+' 그래서 관계를 위해 계산을 포기하는 순간이 있습니다. 빌려준 돈, 함께 쓴 비용, 내가 더 낸 자리 — 이 사주는 기억은 하지만 말은 못 합니다.</p>'+
    '<h3>2. 기분 전환으로 쓰는 돈</h3><p>'+S.EL_DEEP[c.leastI].under+' 가장 얇은 기운이 비면 작은 소비로 채우려 합니다. 그 소비는 한 달 뒤에 남지 않습니다.</p>'+
    '<h3>3. 미루는 돈</h3><p>이 사주는 결제·청구·정산을 미루는 습관이 있습니다. 미룬 돈은 커지지 않지만, 미룬 결정은 손실이 됩니다.</p>'+
    callout('막는 방법','<p>큰 결심보다 구조가 낫습니다. 통장을 셋으로 — 쓰는 통장, 쌓는 통장, 비상 통장. 수입이 들어온 날 <b>절반</b>을 먼저 옮기세요. '+S.EL_DEEP[c.yongEl].color+' 계열의 이름을 붙이면 의식이 유지됩니다.</p>'),{spread:true}));
  // 10년 재물 흐름
  var rows='';
  R.daeun.forEach(function(d,i){
    var g=S.tenGod(R.dStem,d.idx%10), grp=S.GOD_GROUP[g];
    var note=({'정재':'쌓이는 돈의 구간. 저축·계약·자격처럼 남는 일이 재산이 됩니다.','편재':'큰 돈이 도는 구간. 판이 넓어지지만 씀씀이도 함께 커집니다.','비견':'내 힘으로 버는 구간. 동업은 몫을 먼저 정하세요.','겁재':'사람을 통해 버는 구간. 장부가 없으면 남지 않습니다.','식신':'좋아하는 일이 수입이 되는 구간.','상관':'재능이 돈이 되는 구간. 구설을 조심하세요.','편관':'압박이 커지는 구간. 자리를 지키는 것이 곧 돈입니다.','정관':'자리가 돈을 만드는 구간. 조직·자격이 곧 재산입니다.','편인':'혼자 깊어지는 구간. 준비에 돈을 씁니다.','정인':'배움에 돈을 쓰는 구간. 큰 투자보다 실력을 사는 쪽이 남습니다.'})[g]||'';
    rows+='<tr><td class="k">'+d.from+'~'+d.to+'</td><td>'+S.STEM_HAN[d.idx%10]+S.BR_HAN[d.idx%12]+' · '+g+'</td><td style="font-size:12px">'+note+'</td></tr>';
  });
  push(page('10 / WEALTH',secLabel('10','WEALTH · 재물 3')+'<h1>10년마다 바뀌는<br><span class="accent">돈의 그릇</span></h1>'+
    '<p class="lead">같은 노력도 대운의 결에 따라 결과가 달라집니다. 이 사주의 재물은 아래 구간에서 크기가 달라집니다.</p>'+
    '<table><tr><th>나이</th><th>대운</th><th>재물의 결</th></tr>'+rows+'</table>'+
    '<p>이 사주에게 가장 중요한 것은 <b>들어오는 구간에 무엇을 남기느냐</b>입니다. 재성이 오는 10년에 벌어도, 인성의 10년에 지키지 못하면 남지 않습니다.</p>'+
    callout('10년의 규칙','<p>재성이 오는 10년에는 <b>벌이는 크게, 지출은 작게</b>. 인성이 오는 10년에는 <b>실력에 투자</b>. 비겁이 오는 10년에는 <b>내 이름을 걸되 몫을 문서로</b>.</p>'),{spread:true}));
  push(page('10 / WEALTH',secLabel('10','WEALTH · 재물 4')+'<h1>한 달의<br><span class="accent">금전 루틴</span></h1>'+
    '<p class="lead">'+(S.WEALTH_ROUTINE[c.topGrp]||'수입이 들어온 날 바로 떼어두는 습관 하나가 10년을 바꿉니다.')+'</p>'+
    '<table><tr><th>때</th><th>할 일</th><th>왜</th></tr>'+
    '<tr><td class="k">수입일</td><td>절반을 쌓는 통장으로 이동</td><td>이 사주는 손에 있으면 씁니다</td></tr>'+
    '<tr><td class="k">주 1회</td><td>지출 10분 점검</td><td>작은 지출이 새는 곳입니다</td></tr>'+
    '<tr><td class="k">월 1회</td><td>고정 지출 하나 줄이기</td><td>구조를 바꾸는 유일한 방법</td></tr>'+
    '<tr><td class="k">분기 1회</td><td>큰 지출 계획 세우기</td><td>충동과 분리하기</td></tr>'+
    '<tr><td class="k">연 1회</td><td>보험·연금·세금 점검</td><td>이 사주가 가장 미루는 일</td></tr></table>'+
    '<h3>공간의 처방</h3><p>'+S.EL_DEEP[c.yongEl].space+'. '+S.EL_DEEP[c.yongEl].item+' — 이 사주는 눈에 보이는 것으로 의식을 유지합니다.</p>'+
    callout('한 줄','<p>돈은 <b>한 달의 순서</b>로 지켜집니다. 많이 버는 사람이 아니라, 순서를 지키는 사람이 남깁니다.</p>'),{spread:true}));
}

/* ---------------- 7장 커리어 ---------------- */
function careerPages(){
  chapter('career','11','일과 커리어','천직·이직·조건');
  var R=B.R,c=B.c;
  push(page('11 / CAREER',secLabel('11','CAREER · 일')+'<h1>천직의<br><span class="accent">방향</span></h1>'+
    '<p class="lead">이 사주가 오래 해도 기운이 돌아오는 일은 <b>'+S.WORK_BY_GRP[c.topGrp]+'</b>입니다. '+S.GOD_DEEP[c.topGodInGrp]+'</p>'+
    '<table><tr><th>일간</th><th>결이 맞는 분야</th></tr><tr><td class="k">'+stemS(R.dStem)+'</td><td>'+S.CAREER[R.dayEl].join(' · ')+'</td></tr></table>'+
    '<h3>일하는 방식</h3><p>'+(S.WORK_MODE[c.topGrp]||'역할이 분명할 때 가장 오래 갑니다.')+'</p>'+
    '<h3>이 사주가 일에서 지치는 순간</h3><p>'+S.DM_DEEP[R.dStem].drain+' 이 감각이 2주 이상 이어지면 그것은 게으름이 아니라 <b>자리의 문제</b>입니다.</p>'+
    '<h3>인정받는 시기</h3><p>관성이 대운으로 들어오는 10년에 조직에서의 평가가 달라집니다. 아래 대운 표에서 <b>관성</b>이 걸린 구간을 먼저 보세요.</p>',{spread:true}));
  var gy=[];
  for(var i=0;i<R.seun.length;i++){ var g=S.tenGod(R.dStem,R.seun[i].idx%10); if(S.GOD_GROUP[g]==='관성') gy.push(R.seun[i].year+'년('+g+')'); }
  push(page('11 / CAREER',secLabel('11','CAREER · 일 2')+'<h1>옮길까,<br><span class="accent">남을까</span></h1>'+
    '<p class="lead">이 사주는 관성 '+c.grp['관성']+'개, 비겁 '+c.grp['비겁']+'개입니다. '+(c.grp['관성']>=3?'조직에서 자리를 올리는 방식이 맞습니다.':'조직과 독립이 반반이라, 소속은 있되 전문 영역은 내 것으로 가져야 합니다.')+'</p>'+
    '<p>이직의 문은 <b>관성</b>이 세운으로 들어오는 해에 열립니다. '+(gy.length?('앞으로 5년 중 <b>'+gy.join(', ')+'</b>이 그 해입니다.'):'앞으로 5년에는 그 문이 뚜렷하지 않아, 지금은 준비의 시기입니다.')+'</p>'+
    '<h3>퇴사 판단 기준</h3><ol><li>생활비 6개월이 확보되었는가</li><li>그만두는 이유가 <b>사람</b>인가 <b>일</b>인가 — 사람 때문이라면 옮겨도 반복될 수 있습니다</li><li>다음 자리에서 내 '+S.GOD_KEY[c.topGodInGrp]+'이 쓰이는가</li></ol>'+
    '<h3>남기로 했다면</h3><p>6개월 안에 <b>하나</b>를 바꾸세요. 업무 범위, 보고 방식, 근무 시간 중 하나입니다. 아무것도 바뀌지 않으면 1년 뒤 같은 자리에서 같은 고민을 합니다.</p>'+
    callout('한 줄','<p>퇴사는 <b>감정</b>이 아니라 <b>숫자</b>로 결정하세요. 이 사주는 감정이 앞서면 6개월 계산을 건너뜁니다.</p>'),{spread:true}));
  push(page('11 / CAREER',secLabel('11','CAREER · 일 3')+'<h1>일의<br><span class="accent">조건</span></h1>'+
    '<p class="lead">이 사주는 연봉만 보고 자리를 고르면 1년 안에 지칩니다. 시간과 관계가 맞아야 오래 갑니다.</p>'+
    '<table><tr><th>조건</th><th>이 사주에게</th></tr>'+
    '<tr><td class="k">시간</td><td>'+(c.grp['인성']>=3?'혼자 정리하는 시간이 보장되어야 합니다. 회의가 많은 자리는 소모가 큽니다.':'속도가 분명한 자리가 맞습니다. 마감이 흐릿한 조직에서는 에너지가 새어 나갑니다.')+'</td></tr>'+
    '<tr><td class="k">관계</td><td>'+(c.grp['관성']>=3?'위계가 분명한 곳에서 안정됩니다.':'수평적인 곳에서 힘이 납니다.')+'</td></tr>'+
    '<tr><td class="k">평가</td><td>결과보다 <b>과정의 기록</b>이 인정되는 곳</td></tr>'+
    '<tr><td class="k">역할</td><td>'+S.WORK_BY_GRP[c.topGrp]+'</td></tr></table>'+
    '<h3>협상의 순서</h3><ol><li>원하는 숫자를 먼저 말하기</li><li>근거는 시장가와 내가 만든 결과 두 가지로만</li><li>양보는 한 번만</li></ol>'+
    '<p>이 사주는 조건을 말할 때 감정이 섞입니다. 협상 전에 <b>세 줄</b>로 적어가세요. 적은 사람은 흔들리지 않습니다.</p>',{spread:true}));
  push(page('11 / CAREER',secLabel('11','CAREER · 일 4')+'<h1>5년의<br><span class="accent">자리</span></h1>'+
    '<table><tr><th>해</th><th>간지</th><th>십성</th><th>일의 결</th></tr>'+
    (function(){var h='';for(var i=0;i<R.seun.length;i++){var sn=R.seun[i],g=S.tenGod(R.dStem,sn.idx%10);h+='<tr><td class="k">'+sn.year+'</td><td>'+S.STEM_HAN[sn.idx%10]+S.BR_HAN[sn.idx%12]+'</td><td>'+g+'</td><td style="font-size:12px">'+S.SEUN_DEEP[g]+'</td></tr>';}return h;})()+'</table>'+
    '<h3>이 5년의 순서</h3><ul><li><b>1년차</b> — 실력을 정리하고 기록으로 남기기</li><li><b>2~3년차</b> — 자리 또는 이름을 하나 얻기</li><li><b>4~5년차</b> — 얻은 자리에서 사람을 만들기</li></ul>'+
    '<p>이 사주는 <b>기록</b>이 남을 때 다음 자리로 이어집니다. 머릿속에 있는 것을 문서와 말로 꺼내는 습관이 커리어의 속도를 바꿉니다.</p>'+
    callout('한 줄','<p>커리어는 재능이 아니라 <b>남긴 기록</b>으로 이어집니다.</p>'),{spread:true}));
}

/* ---------------- 8장 사랑·결혼 ---------------- */
function lovePages(){
  var married=C_marry();
  chapter('love','12',married?'사랑과 결혼생활':'사랑과 결혼','사랑의 결·배우자·유지');
  var R=B.R,c=B.c;
  push(page('12 / LOVE',secLabel('12','LOVE · 사랑')+'<h1>사랑할 때의<br><span class="accent">결</span></h1>'+
    '<p class="lead">이 사주는 좋아할 때 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>의 방식으로 다가갑니다. '+S.loveSignal(R,c)+'</p>'+
    '<h3>사랑의 언어</h3><p>'+S.LOVE_LANG[R.dayEl]+'</p>'+
    '<h3>끌리는 사람</h3><p>'+S.LOVE_ATTRACT[R.dayEl]+'</p>'+
    '<h3>오래 가는 사람</h3><p>'+S.LOVE_FIT[R.dayEl]+'</p>'+
    '<p>이 두 사람이 다를 수 있습니다. 이 사주는 <b>끌림</b>으로 시작해 <b>맞음</b>으로 결정해야 오래 갑니다.</p>',{spread:true}));
  push(page('12 / LOVE',secLabel('12','LOVE · 사랑 2')+'<h1>반복되는<br><span class="accent">장면</span></h1>'+
    '<p class="lead">연애 패턴은 취향이 아니라 구조입니다. 이 사주는 일지 '+brS(R.dBranch)+'에서 그 이유를 찾습니다.</p>'+
    '<p>'+S.BR_INNER[R.dBranch]+'</p>'+
    '<h3>반복하는 실수</h3><p>'+S.LOVE_MISTAKE_GOD[c.topGodInGrp]+'</p>'+
    '<h3>무너지는 지점</h3><p>'+S.LOVE_SHADOW[R.dayEl]+'</p>'+
    '<h3>끊는 세 가지</h3><ul><li><b>사흘 규칙</b> — 흔들린 일은 사흘 뒤에 결론</li><li><b>한 문장</b> — 하고 싶은 말을 한 문장으로 적기</li><li><b>한 번</b> — 연락은 한 번만</li></ul>'+
    '<p>이 사주에게 사랑은 <b>표현의 연습</b>입니다. 마음이 커질수록 표현이 줄어드는 습관을 알아차리는 것만으로 절반이 달라집니다.</p>',{spread:true}));
  // 결혼 (context-aware)
  var head=married?secLabel('12','MARRIAGE · 결혼생활')+'<h1>부부 사이의<br><span class="accent">결</span></h1>':secLabel('12','MARRIAGE · 결혼')+'<h1>결혼의 문과<br><span class="accent">조건</span></h1>';
  var lead=married?'<p class="lead">이미 결혼생활 안에 있는 사주입니다. 이 장은 배우자를 고르는 법이 아니라 <b>오래 가는 방식</b>을 다룹니다.</p>':'<p class="lead">아직 결혼 전이라면 이 장은 배우자를 고르는 기준과 시기를 다룹니다.</p>';
  var star=(B.input.gender==='f')?'관성':'재성';
  var ys=[]; for(var i2=0;i2<R.seun.length;i2++){ var g2=S.tenGod(R.dStem,R.seun[i2].idx%10); if(S.GOD_GROUP[g2]===star) ys.push(R.seun[i2].year+'년('+g2+')'); }
  push(page('12 / MARRIAGE',head+lead+
    '<h3>배우자궁</h3><p>일지 '+brS(R.dBranch)+'는 <b>'+S.SPOUSE[R.dBranch]+'</b>을 가리킵니다. '+S.BR_INNER[R.dBranch]+'</p>'+
    '<h3>결혼의 문</h3><p>이 사주에서 결혼의 문은 <b>'+star+'</b>이 열어요. '+(ys.length?('앞으로 5년 중 <b>'+ys.join(', ')+'</b>이 그 문이 열리는 해입니다.'):'앞으로 5년에는 그 문이 뚜렷하지 않아, 해보다 사람을 만나는 자리의 밀도가 중요합니다.')+'</p>'+
    '<h3>생활 리듬</h3><p>'+S.MARR_HABIT_BR[R.dBranch]+'</p>'+
    '<h3>정서 온도</h3><p>'+S.MARR_TEMP[R.dayEl]+'</p>'+
    callout('결혼 전 점검','<p>생활비·거주지·역할 — 세 가지가 정리되지 않으면 마음이 커도 결정이 흔들립니다. '+S.MARR_MONEY_GRP[c.topGrp]+'</p>'),{spread:true}));
  push(page('12 / MARRIAGE',secLabel('12','MARRIAGE · 관계의 유지')+'<h1>오래 가는<br><span class="accent">방식</span></h1>'+
    '<p class="lead">'+S.BR_INNER[R.dBranch]+'</p>'+
    '<h3>부딪히는 지점</h3><p>'+S.CONFLICT_BY_EL[R.dayEl]+'</p>'+
    '<h3>화해의 순서</h3><ol><li>24시간은 중요한 말을 미루기</li><li>먼저 한 문장만 꺼내기</li><li>상대의 말을 끝까지 듣고 되풀이해 확인하기</li></ol>'+
    '<h3>위기의 신호</h3><p>'+S.MARR_CRISIS_BR[R.dBranch]+'</p>'+
    '<h3>회복의 처방</h3><p>'+(S.MARR_SOLUTION[c.topGrp]||'각자의 시간을 보장하고, 함께하는 시간을 정기적으로 두세요.')+'</p>',{spread:true}));
}
function C_marry(){ return (B.input.ctx&&B.input.ctx.marry)==='married'; }

/* ---------------- 9장 가족·자녀 ---------------- */
function familyPages(){
  chapter('family','13','가족과 자녀','자녀성·관계·10년');
  var R=B.R,c=B.c;
  var hasKid=(B.input.ctx&&B.input.ctx.kid)==='have';
  var cc=null; try{ cc=S.childChart(B.input); }catch(e){}
  push(page('13 / FAMILY',secLabel('13','FAMILY · 가족')+'<h1>가족 안에서의<br><span class="accent">자리</span></h1>'+
    '<p class="lead">'+(hasKid?'이미 아이가 있는 사주입니다. 이 장은 아이와의 관계와 부모로서의 결을 다룹니다.':'이 장은 앞으로 맞이할 가족의 결을 미리 보는 내용입니다.')+'</p>'+
    '<h3>자녀성</h3><p>이 사주의 자녀성은 '+elK(S.mod(R.dayEl+1,5))+'입니다. '+S.CHILD_NATURE_EL[S.mod(R.dayEl+1,5)]+'</p>'+
    (cc?'<h3>아이의 결</h3><p>아이의 사주는 '+S.STEM_HAN[cc.R.dStem]+S.BR_HAN[cc.R.dBranch]+'일주입니다. '+S.CHILD_NATURE_EL[cc.R.dayEl]+'</p>':'')+
    '<h3>가족 안에서 이 사주가 맡는 것</h3><p>'+S.GROUP_MEAN[c.topGrp].split('.')[0]+'을 맡기 쉽습니다. '+S.STRENGTH_TXT[R.strength].adv+'</p>'+
    '<h3>가족과의 거리</h3><p>이 사주는 가까운 사람에게 다정하지만 문을 여는 데 시간이 걸립니다. '+S.BR_INNER[R.dBranch]+'</p>',{spread:true}));
  // 임신·자녀 (context)
  var preg=(B.input.ctx&&B.input.ctx.kid)==='plan'||(B.input.ctx&&B.input.ctx.kid)==='none';
  if(preg){
    var x={w:R.count[4],f:R.count[1]};
    push(page('13 / FAMILY',secLabel('13','PREGNANCY · 임신 준비')+'<h1>아이를 맞는<br><span class="accent">때와 몸</span></h1>'+
      '<p class="lead">이 사주는 화(火) '+x.f+' · 수(水) '+x.w+'의 구조입니다. '+(x.f>=x.w+2?'열이 먼저 오르는 사주라 <b>몸을 식히는 시간</b>이 중요합니다.':(x.w>=x.f+2?'물이 강해 몸이 차기 쉬운 사주라 <b>몸을 데우는 시간</b>이 중요합니다.':'물과 불이 고른 편이라 계절에 따라 흔들립니다.'))+'</p>'+
      '<ul><li>잠드는 시간을 먼저 고정하기 — 이 사주는 수면이 흐트러지면 열이 먼저 오릅니다</li><li>'+S.EL_DEEP[c.yongEl].food+' 쪽으로 식사 한 끼 바꾸기</li><li>'+S.EL_DEEP[c.yongEl].habit+'</li></ul>'+
      '<h3>시기의 문</h3><p>임신의 문은 자녀성이 세운으로 들어오는 해에 열립니다. 이 책 10장(대운)과 11장(세운)에서 <b>'+((B.input.gender==='f')?'식상':'관성')+'</b>이 걸린 해를 확인하세요.</p>'+
      '<h3>명리와 의학의 경계</h3><p>사주는 몸의 리듬과 시기를 보여줄 뿐 임신 가능성이나 건강을 진단하지 않습니다. 실제 계획은 산부인과 상담과 검사 결과를 먼저 두세요.</p>'+
      callout('준비의 순서','<p>잠 → 식사 → 움직임 → 마음. 이 순서를 바꾸면 같은 노력이 두 배로 남습니다. 특히 이 사주는 <b>혼자 다 감당하려는 습관</b>이 있어, 한 가지는 반드시 배우자에게 맡기세요.</p>'),{spread:true}));
  } else {
    push(page('13 / FAMILY',secLabel('13','CHILD · 자녀와의 관계')+'<h1>아이와의<br><span class="accent">거리</span></h1>'+
      '<p class="lead">'+(cc?'아이의 일주는 '+S.STEM_HAN[cc.R.dStem]+S.BR_HAN[cc.R.dBranch]+'입니다. ':'')+'이 사주는 아이에게 <b>'+S.EL_PERSON[R.dayEl]+'</b> 같은 인상을 줍니다.</p>'+
      '<h3>아이에게 해야 할 말</h3><ul><li>“너는 네 속도로 자라도 괜찮아.”</li><li>“오늘 끝까지 해본 것이 제일 좋았어.”</li><li>“네가 말해줘서 고마워.”</li></ul>'+
      '<h3>조심할 것</h3><p>이 사주는 '+S.GOD_KEY[c.topGodInGrp]+'이 강해 아이를 가르치려는 마음이 앞섭니다. 가르침이 길어지면 아이는 닫힙니다. <b>질문 하나</b>로 끝내세요.</p>'+
      '<h3>부부의 역할</h3><p>역할을 반으로 나누되, 한 달에 한 번은 서로 바꿔보세요. 아이가 두 사람을 다르게 보지 않습니다.</p>',{spread:true}));
  }
  push(page('13 / FAMILY',secLabel('13','FAMILY · 가족의 시간')+'<h1>가족의<br><span class="accent">10년</span></h1>'+
    '<p class="lead">가족의 흐름도 대운을 탑니다. 이 사주는 아래 구간에서 가족의 역할이 달라집니다.</p>'+
    '<table><tr><th>나이</th><th>대운</th><th>가족의 결</th></tr>'+
    (function(){var h='';R.daeun.forEach(function(d){var g=S.tenGod(R.dStem,d.idx%10),grp=S.GOD_GROUP[g];
      var note={'인성':'부모·자녀와의 정이 깊어지고 돌봄이 늘어납니다.','관성':'가족의 책임과 역할이 무거워집니다.','식상':'자녀가 자기 색을 드러내고, 부모는 기다리는 법을 배웁니다.','재성':'살림의 현실(돈·집)이 중심이 됩니다.','비겁':'가족 안에서 각자의 자리를 확인하는 시기입니다.'}[grp];
      h+='<tr><td class="k">'+d.from+'~'+d.to+'</td><td>'+g+'</td><td style="font-size:12px">'+note+'</td></tr>';});return h;})()+'</table>'+
    '<p>가족은 <b>역할</b>로 유지되고 <b>감정</b>으로 깊어집니다. 이 사주는 역할을 잘하지만 감정을 말로 옮기는 데 서툽니다. 한 달에 한 번, 가족에게 고마운 일을 한 가지씩 말해보세요.</p>',{spread:true}));
}

/* ---------------- 10장 건강 ---------------- */
function healthPages(){
  chapter('health','14','건강과 체질','체질·계절·처방');
  var R=B.R,c=B.c;
  push(page('14 / HEALTH',secLabel('14','HEALTH · 건강')+'<h1>몸의<br><span class="accent">체질</span></h1>'+
    '<p class="lead">이 사주의 일간은 '+stemS(R.dStem)+'이고, 가장 얇은 기운은 '+elK(c.leastI)+'입니다. '+S.EL_DEEP[c.leastI].under+'</p>'+
    '<table><tr><th>오행</th><th>장부</th><th>먼저 신호가 오는 곳</th></tr>'+
    '<tr><td class="k">'+S.EL_KO[c.leastI]+'</td><td>'+S.EL_DEEP[c.leastI].organ+'</td><td>'+S.EL_DEEP[c.leastI].part+'</td></tr>'+
    '<tr><td class="k">'+S.EL_KO[c.mostI]+'</td><td>'+S.EL_DEEP[c.mostI].organ+'</td><td>'+S.EL_DEEP[c.mostI].part+' (넘치는 쪽)</td></tr></table>'+
    '<h3>체질의 결</h3><p>'+S.EL_DEEP[R.dayEl].over+'</p>'+
    '<p>'+S.SEASON_RHYTHM[c.leastI][0]+'에 특히 조심하세요. '+S.SEASON_RHYTHM[c.leastI][1]+'</p>',{spread:true}));
  push(page('14 / HEALTH',secLabel('14','HEALTH · 건강 2')+'<h1>계절과<br><span class="accent">몸의 달력</span></h1>'+
    '<p class="lead">오행의 계절은 몸의 계절이기도 합니다. 이 사주는 아래 시기에 먼저 피로가 옵니다.</p>'+
    '<table><tr><th>계절</th><th>몸의 결</th><th>이 사주에게</th></tr>'+
    '<tr><td class="k">봄 2~4월</td><td>간·눈·근육</td><td>'+(c.leastI===0?'가장 조심할 계절 — 결단이 늦고 눈이 피로합니다':'새 일을 시작하기 좋은 계절')+'</td></tr>'+
    '<tr><td class="k">여름 5~7월</td><td>심장·수면·혈압</td><td>'+(c.leastI===1?'가장 조심할 계절 — 잠이 얕고 얼굴이 붉어집니다':'열을 식히는 습관이 필요합니다')+'</td></tr>'+
    '<tr><td class="k">환절기 8~9월</td><td>소화·피부</td><td>'+(c.leastI===2?'가장 조심할 계절 — 소화와 피부가 예민해집니다':'식사 시간을 고정하세요')+'</td></tr>'+
    '<tr><td class="k">가을 10~11월</td><td>코·기관지·피부</td><td>'+(c.leastI===3?'가장 조심할 계절 — 기관지가 건조해집니다':'정리와 결단에 좋은 계절')+'</td></tr>'+
    '<tr><td class="k">겨울 12~1월</td><td>허리·골반·방광</td><td>'+(c.leastI===4?'가장 조심할 계절 — 허리와 손발이 시립니다':'몸을 데우고 안으로 모으는 계절')+'</td></tr></table>'+
    '<p>'+S.EL_DEEP[c.yongEl].habit+' — 이 습관이 계절의 흔들림을 줄여줍니다.</p>',{spread:true}));
  push(page('14 / HEALTH',secLabel('14','HEALTH · 건강 3')+'<h1>매일의<br><span class="accent">처방</span></h1>'+
    '<p class="lead">건강은 큰 결심이 아니라 매일의 순서로 지켜집니다. 이 사주에게 맞는 순서는 아래와 같습니다.</p>'+
    '<table><tr><th>때</th><th>할 일</th></tr>'+
    '<tr><td class="k">아침</td><td>'+S.EL_DEEP[c.yongEl].habit+'</td></tr>'+
    '<tr><td class="k">식사</td><td>'+S.EL_DEEP[c.yongEl].food+' · '+S.EL_DEEP[c.yongEl].taste+'</td></tr>'+
    '<tr><td class="k">저녁</td><td>잠드는 시간 고정 — 이 사주는 수면이 가장 약한 고리입니다</td></tr>'+
    '<tr><td class="k">공간</td><td>'+S.EL_DEEP[c.yongEl].space+'</td></tr>'+
    '<tr><td class="k">계절</td><td>'+S.SEASON_RHYTHM[c.leastI][0]+'에는 일정을 20% 비워두기</td></tr></table>'+
    callout('한 줄','<p>이 사주의 몸은 <b>'+S.EL_DEEP[c.leastI].part+'</b>에서 먼저 신호를 보냅니다. 그 부위가 불편하면 다른 것을 미루고 잠부터 챙기세요.</p>')+
    '<p class="note">※ 본 장은 명리 상징을 생활 습관으로 옮긴 참고 내용입니다. 진단과 치료는 의료기관의 몫입니다.</p>',{spread:true}));
}

B.coreSections=[summaryPage,introPage,tocPages,chartPage,elPage,godPage,salsPage,strengthPage,pillarPages,personalityPages,relationPages,moneyPages,careerPages,lovePages,familyPages,healthPages];

/* ---------------- 모바일 가독성 : A4 한 장에 맞춰 본문 크기 미세 조정 ---------------- */
function fitPages(host){
  if(!host) return;
  var pages=host.querySelectorAll('.pg');
  for(var i=0;i<pages.length;i++){
    var p=pages[i];
    if(p.classList.contains('cover')) continue;
    /* 폰에서 미리보기·인쇄해도 A4 조판이 같아지도록, 잠깐 인쇄 지면(210mm × 295mm)으로 재어 본다 */
    p.style.width='210mm';p.style.height='295mm';p.style.maxHeight='295mm';p.style.minHeight='295mm';
    p.style.padding='15mm 14.5mm 18mm';
    p.style.removeProperty('--fs');
    var fs=17, guard=0;
    while(p.scrollHeight>p.clientHeight+1 && guard<20){
      fs-=0.3; guard++;
      p.style.setProperty('--fs',fs.toFixed(2)+'px');
    }
    p.style.removeProperty('width');p.style.removeProperty('height');
    p.style.removeProperty('max-height');p.style.removeProperty('min-height');
    p.style.removeProperty('padding');
  }
}

/* ---------------- build ---------------- */
B.build=function(R,input,name){
  B.pages=[];B.chapters=[];B.R=R;B.c=S.chartCtx(R);B.input=input;B.name=name||'고객';
  B.pages.push(coverPage());
  introPage();
  var tocStart=B.pages.length;
  B.pages.push('__TOC1__');B.pages.push('__TOC2__');
  summaryPage();chartPage();elPage();godPage();salsPage();strengthPage();
  pillarPages();personalityPages();relationPages();moneyPages();careerPages();lovePages();familyPages();healthPages();
  if(window.BOOKM&&window.BOOKM.sections) window.BOOKM.sections();
  var html=B.pages.join('');
  var total=B.pages.length;
  html=html.replace('__TOT__',String(total));
  /* 목차 */
  var rows=B.chapters.map(function(ch){
    return '<div class="toc-r"><span class="n">'+ch.no+'</span><span class="t">'+ch.title+'</span><span class="d"></span><span class="p">'+n2(ch.page)+'</span></div>';
  });
  var half=Math.ceil(rows.length/2);
  var t1=page('CONTENTS 01','<div class="sec-label"><span>00</span>목차 · CONTENTS</div><h1>이 책의 지도</h1><div class="toc-list">'+rows.slice(0,half).join('')+'</div>',{spread:true});
  var t2=page('CONTENTS 02','<div class="sec-label"><span>00</span>목차 · CONTENTS</div><h1>이어서</h1><div class="toc-list">'+rows.slice(half).join('')+'</div><p class="note">쪽수는 인쇄 기준입니다.</p>',{spread:true});
  html=html.replace('__TOC1__',t1).replace('__TOC2__',t2);
  /* 쪽번호 — 표지 다음부터 순서대로 */
  var pn=1;
  html=html.replace(/<span class="pn">[^<]*<\/span>/g,function(){ pn++; return '<span class="pn">'+n2(pn)+' / '+total+'</span>'; });
  return {html:html,pages:total};
};
B.fit=fitPages;
})();
