/* =====================================================================
   사주봄 인생사주 리포트 — 책자 생성기
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
function stemS(s){return S.STEM_KO[s]+'('+S.STEM_HAN[s]+')';}
function brS(b){return S.BR_KO[b]+'('+S.BR_HAN[b]+')';}
function josa(s,pair){var c=s.charCodeAt(s.length-1);var has=(c>=0xAC00&&c<=0xD7A3)&&((c-0xAC00)%28)!==0;return has?pair[0]:pair[1];}
function elKj(i,p){ return elK(i)+josa(S.EL_KO[i],p||'이가'); }
function bj(b,pair){ return brS(b)+josa(S.BR_KO[b],pair); }
function sj(s,pair){ return stemS(s)+josa(S.STEM_KO[s],pair); }
function DD(){ return S.deep(B.R); }
/* 사주 용어를 생활의 말로 — 책 안 어디서나 같은 이름을 쓴다 */
function plainGrp(g){
  return ({'비겁':'나와 동료의 기운','식상':'표현과 재능의 기운','재성':'돈과 성과의 기운',
           '관성':'자리와 책임의 기운','인성':'배움과 보호의 기운'})[g]||g;
}
function strengthWord(R){ return R.strength==='강'?'강한 편':(R.strength==='약'?'약한 편':'고른 편'); }
function salsAt(d,pos){
  return d.sals.filter(function(x){ return x.pos===pos; }).map(function(x){ return x.name; });
}
function relsAt(d,pos){
  return d.branchRels.filter(function(r){ return r.a===pos||r.b===pos; })
    .map(function(r){ return (r.a===pos?r.b:r.a)+' '+r.type+'('+r.pair+')'; });
}

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
  var h=S.BR_KO[b];   /* 한자 글자로 비교하면 늘 실패해 늘 3이 되던 자리 */
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
  if(cheonul){ for(var k2 in branches){ if(cheonul.indexOf(branches[k2])>=0) out.push({n:'천을귀인',b:k2,t:'막힐 때 사람이 나타나는 힘. 어려운 자리에서 도움을 받는 복이 있습니다.'}); } }
  var munchang=[5,6,8,9,8,9,11,0,2,3][R.dStem];
  for(var k3 in branches){ if(branches[k3]===munchang) out.push({n:'문창귀인',b:k3,t:'배움과 글의 재능. 기록하고 설명하는 일에서 힘이 납니다.'}); }
  return out;
}

/* ---------------- 페이지 조립 ---------------- */
function page(label,body,opt){
  opt=opt||{};
  return '<section class="pg"><div class="pg-hd"><span class="l">사주봄 · LIFE SAJU REPORT</span><span class="r">'+label+'</span></div>'+
    '<div class="pg-bd'+(opt.spread?' spread':'')+'">'+body+'</div>'+
    '<div class="pg-ft"><span>사주봄 · 인생사주 리포트</span><span class="pn">__PN__</span></div></section>';
}
function push(html){ B.pages.push(html); }
function chapter(key,no,title,sub){
  B.chapters.push({key:key,no:no,title:title,sub:sub,page:B.pages.length+1});
}
function secLabel(no,label){ return '<div class="sec-label"><span>'+no+'</span>'+label+'</div>'; }
function callout(title,body){ return '<div class="callout"><div class="ct">'+title+'</div>'+body+'</div>'; }

/* ---------------- 시기 계산 : 특정 십성이 세운·대운·달로 들어오는 자리 ---------------- */
function seunStarsOf(R,grp,n){
  var out=[], y0=(R.seun&&R.seun[0])?R.seun[0].year:new Date().getFullYear();
  for(var i=0;i<(n||6);i++){
    var y=y0+i, idx=S.mod(y-4,60), g=S.tenGod(R.dStem,idx%10);
    if(S.GOD_GROUP[g]===grp) out.push({y:y,g:g,s:idx%10,b:idx%12,age:y-R.y,rel:S.monthTag(S.branchRel(R.dBranch,idx%12))});
  }
  return out;
}
function monthStarsOf(R,grp,n){
  var out=[], now=new Date(), y=now.getFullYear(), m=now.getMonth()+1;
  for(var i=0;i<(n||14);i++){
    var mp=S.monthPillarOf(y,m), g=S.tenGod(R.dStem,mp.stem), tag=S.monthTag(S.branchRel(R.dBranch,mp.branch));
    if(S.GOD_GROUP[g]===grp||tag==='합') out.push({y:y,m:m,g:g,s:mp.stem,b:mp.branch,tag:tag,star:S.GOD_GROUP[g]===grp});
    m++; if(m>12){m=1;y++;}
  }
  return out;
}
function daeunStarsOf(R,grp){
  var out=[];
  R.daeun.forEach(function(d,i){ var g=S.tenGod(R.dStem,d.idx%10); if(S.GOD_GROUP[g]===grp) out.push({i:i,from:d.from,to:d.to,g:g,s:d.idx%10,b:d.idx%12,cur:i===R.curDaeun}); });
  return out;
}
/* v47 · 60갑자를 한글(한자)로 — 정미(丁未) */
function gzP(st,br){ return S.STEM_KO[st%10]+S.BR_KO[br%12]+'('+S.STEM_HAN[st%10]+S.BR_HAN[br%12]+')'; }
/* v64 · 표 안의 ‘수(水)·갑인(甲寅)’처럼 한자 괄호가 괄호 안에서 쪼개지지 않게 감싼다 */
function tw_(s){ return '<span class="tw">'+s+'</span>'; }
B.gzP=gzP;
function seunTxt(o){ return '<b>'+o.y+'년('+S.STEM_KO[o.s]+S.BR_KO[o.b]+' · '+o.g+', '+o.age+'세)</b>'; }
function monthTxt(o){ return '<b>'+o.y+'년 '+o.m+'월('+S.STEM_KO[o.s]+S.BR_KO[o.b]+' · '+o.g+(o.tag==='합'?' · 일지와 합':'')+')</b>'; }

/* ---------------- 표지 ---------------- */
function coverPage(){
  var R=B.R;
  return '<section class="pg cover"><div class="art" style="background-image:url(./assets/cover-art.jpg)"></div><div class="veil"></div><div class="frame"><i></i></div>'+
    '<div class="inner"><div><div class="cover-brand">사주봄</div>'+
    '<div class="han">인생사주 리포트</div><div class="rule"></div><div class="sub">PREMIUM LIFE REPORT</div></div>'+
    '<div class="epi"><span class="orn"></span><p>여덟 글자에 새겨진 하늘의 뜻을<br>한 사람의 설계도로 옮겼습니다</p></div>'+
    '<div class="box"><div class="nm">'+esc(B.name)+'</div>'+
    '<div class="d">'+R.y+'.'+n2(R.m)+'.'+n2(R.d)+(R.hasTime?' · '+hourText(R):' · 시간 모름')+'<br>'+
    gzP(R.dStem,R.dBranch)+'일주 · '+S.ILJU[R.dIdx][0]+'</div></div>'+
    '<div class="cover-ft">2026 · CHEONRYEONGDANG · SEOUL · __TOT__ PAGES</div></div></section>';
}
function hourText(R){
  if(R.hIdxP==null) return '시간 모름';
  return S.BR_KO[R.hIdxP%12]+'시 무렵';
}

/* ---------------- 서문 ---------------- */
function introPage(){
  var R=B.R,c=B.c;
  var body=secLabel('PROLOGUE','발간에 부쳐')+
   '<h1>당신의 여덟 글자를<br><span class="accent">한 사람의 설계도로</span></h1>'+
   '<p class="lead">이 책을 덮을 때쯤, 당신은 자기 자신에 대해 남에게 설명하지 못했던 것 하나를 알게 됩니다. 그것이 이 책의 목적입니다.</p>'+
   '<p>사주는 미래를 정해둔 예언이 아닙니다. 태어난 순간의 하늘을 여덟 글자로 적어둔 <b>기록</b>이고, 그 기록은 “이 사람이 어떤 조건에서 잘 자라고, 어디서 먼저 지치는가”를 알려줍니다.</p>'+
   '<p>'+esc(B.name)+' 님의 여덟 글자는 <b>'+S.eightChars(R)+'</b>입니다. 그중 나를 대표하는 중심 글자는 '+stemS(R.dStem)+'이고, 그 위에 '+brS(R.dBranch)+'가 앉아 <b>'+S.ILJU[R.dIdx][0]+'</b>의 결을 만듭니다. 가장 넉넉한 기운은 '+elS(c.mostI)+', 가장 적은 기운은 '+elS(c.leastI)+'입니다.</p>'+
   '<p class="lead" style="font-size:15px">이 책은 사주를 한 번도 배운 적 없는 분을 위해 썼습니다. 어려운 용어는 쓰지 않았고, 쓰더라도 바로 옆에 생활의 말로 풀어 두었습니다.</p>'+
   '<p>읽는 순서는 이렇습니다. <b>1장 총평</b>에서 이 사람의 요약을 먼저 보고, <b>7장(네 기둥)</b>에서 초년·청년·나·말년을 한 칸씩 읽으세요. 8장부터 14장은 성격·관계·돈·직업·사랑·가족·건강이고, 15장부터는 시간의 지도입니다. 급하면 <b>15장(평생 대운)</b>과 <b>17장(2027년 12개월)</b>부터 펼치셔도 좋습니다.</p>'+
   '<p>읽는 동안 세 가지 질문을 마음에 두시면 좋습니다. “나는 어떤 조건에서 힘이 나는가”, “나는 어떤 상황에서 먼저 지치는가”, “지금 내가 미루고 있는 결정은 무엇인가”. 이 책의 모든 장은 이 세 질문에 서로 다른 각도에서 답하는 글입니다. 그래서 한 번에 다 읽지 않아도 괜찮습니다.</p>'+
   callout('이 책을 읽는 방법','<p>여기 적힌 문장은 정답이 아니라 <b>질문</b>입니다. “내가 왜 이 자리에서 지치는지”, “왜 같은 관계를 반복하는지”에 대한 하나의 설명으로 읽어주세요. 맞지 않는 문장은 넘기시면 됩니다. 마음에 걸리는 장부터 펼치는 것이 가장 좋은 읽기입니다.</p>')+
   '<p class="small">※ 본 책자는 사주명리 상징을 생활의 언어로 옮긴 참고 해석입니다. 의학적 진단, 법률·투자 판단을 대신하지 않습니다.</p>';
  push(page('PROLOGUE',body,{spread:true}));
}

/* ---------------- 목차 ---------------- */
/* 목차 위에는 제목 대신 한 줄 안내만 — ‘이 책의 지도’ 같은 큰 제목은 두지 않는다 */
function tocIntro(){
  return '<p class="toc-lede">스물두 개의 장이 네 부분으로 이어집니다. 관심 있는 장부터 펼쳐 보세요.</p>';
}
/* 목차 1쪽에 재물의 마지막 장인 '10-4 문서와 부동산'까지 담아, 문서운이 빠졌다고
   오해하지 않게 한다(2쪽에는 나머지 장이 들어간다). */
function tocHalf(rows){
  var half=Math.ceil(rows.length/2);
  var at=-1;
  for(var i=0;i<B.chapters.length;i++){ if(B.chapters[i].key==='docu'){ at=i; break; } }
  if(at>=half && at<=15) half=at+1;
  return half;
}
function tocPages(){
  var rows=B.chapters.map(function(ch){
    return '<div class="toc-r" data-goto="'+ch.page+'" role="link" tabindex="0"><span class="n">'+ch.no+'</span><span class="t">'+ch.title+'</span><span class="d"></span><span class="p">__TOC_'+ch.key+'__</span></div>';
  });
  var half=tocHalf(rows);
  push(page('CONTENTS 01','<div class="sec-label"><span>00</span>목차 · CONTENTS</div>'+tocIntro()+'<div class="toc-list">'+rows.slice(0,half).join('')+'</div>',{spread:true}));
  push(page('CONTENTS 02','<div class="sec-label"><span>00</span>목차 · CONTENTS</div><h2 class="toc-more">목차 이어서</h2><div class="toc-list">'+rows.slice(half).join('')+'</div>',{spread:true}));
}

/* ---------------- 1장 요약 ---------------- */
function summaryPage(){
  var R=B.R,c=B.c;
  var best=S.bestDaeun(R,c);
  var bestG=S.tenGod(R.dStem,R.daeun[best.i].idx%10);
  var tags='<div style="margin:2mm 0 5mm"><span class="tag">'+gzP(R.dStem,R.dBranch)+'일주</span><span class="tag navy">기운은 '+strengthWord(R)+'</span><span class="tag">채울 기운 '+elK(c.yongEl)+'</span><span class="tag soft">'+plainGrp(c.topGrp)+'</span><span class="tag soft">'+S.GOD_KEY[c.topGodInGrp]+'</span></div>';
  var body=secLabel('01','EXECUTIVE SUMMARY · 총평')+
   '<h1>한 장으로 보는<br><span class="accent">'+esc(B.name)+' 님의 설계도</span></h1>'+tags+
   '<p class="lead">“잘하고 있는데 왜 이렇게 지치지?” — 이 사람의 인생에서 가장 자주 반복되는 장면입니다. 그 이유가 여덟 글자 안에 있습니다.</p>'+
   '<p>여덟 글자는 <b>'+S.eightChars(R)+'</b>이고, 그중 나를 대표하는 중심은 <b>'+gzP(R.dStem,R.dBranch)+'일주</b>입니다. '+S.STRENGTH_TXT[R.strength].out+'</p>'+
   '<table><tr><th>항목</th><th>이 사주의 결</th></tr>'+
   '<tr><td class="k">가장 두터운 힘</td><td>'+plainGrp(c.topGrp)+' — '+S.GROUP_MEAN[c.topGrp]+'</td></tr>'+
   '<tr><td class="k">타고난 성향</td><td>'+S.GOD_DEEP[c.topGodInGrp]+'</td></tr>'+
   '<tr><td class="k">채우면 좋은 기운</td><td>'+S.EL_KO[c.yongEl]+' — '+S.EL_DEEP[c.yongEl].color+', '+S.EL_DEEP[c.yongEl].dir+', '+S.EL_DEEP[c.yongEl].habit+'.</td></tr>'+
   '<tr><td class="k">가장 지치는 순간</td><td>'+S.STRENGTH_TXT[R.strength].adv+'</td></tr>'+
   '<tr><td class="k">가장 힘이 실리는 때</td><td>'+R.daeun[best.i].from+'~'+R.daeun[best.i].to+'세 · '+bestG+' — '+(S.GOD_DAEUN[bestG]||'')+'</td></tr>'+
   '<tr><td class="k">지금 서 있는 자리</td><td>'+R.age+'세 · '+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세의 10년 가운데 '+(R.age-R.daeun[R.curDaeun].from+1)+'년 차</td></tr></table>'+
   callout('이 책의 결론 세 줄','<p>1. 이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>로 살 때 가장 편안합니다. 그 힘이 쓰이지 않는 자리에서는 능력과 별개로 먼저 지칩니다.</p><p>2. 필요한 기운은 '+elK(c.yongEl)+'입니다. 큰 사건보다 매일의 작은 선택이 균형을 만듭니다.</p><p>3. <b>대운</b>은 <b>'+R.daeun[best.i].from+'~'+R.daeun[best.i].to+'세</b>에 가장 크게 열립니다. 그 전에 무엇을 심어두는지가 결과를 바꿉니다.</p>');
  chapter('summary','01','총평 · 한 장 요약','여덟 글자·타고난 성향·채울 기운·대운');
  push(page('01 / SUMMARY',body,{spread:true}));
}

/* ---------------- 2장 원국 ---------------- */
function chartPage(){
  var R=B.R,c=B.c;
  var cells=[['년주',R.yIdx,'조상 · 초년'],['월주',R.mIdx,'부모 · 청년'],['일주',R.dIdx,'나 · 배우자'],['시주',R.hIdxP,'자식 · 말년']];
  var h='<div class="chart4">';
  cells.forEach(function(x,i){
    var ix=x[1];
    if(ix==null){ h+='<div class="c"><div class="lab">'+x[0]+'</div><div class="god">시간 미상</div><div class="st" style="color:#7C6E58">—</div><div class="ko">시간 모름</div><div class="st" style="color:#7C6E58">—</div><div class="ko">&nbsp;</div></div>'; return; }
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
  h+=row('지지 오행',function(ix){ return tw_(S.EL_KO[S.BR_EL[ix%12]]+'('+S.EL_HAN[S.BR_EL[ix%12]]+')'); });
  h+=row('십이운성',function(ix){ return unsung(R.dStem,ix%12); });
  /* v64 · 지장간은 한 글자씩 줄을 바꿔 세로로 쌓는다 (병(丙)·무(戊)·경(庚) → 세 줄) */
  h+=row('지장간',function(ix){ return S.deep(R).pillars.filter(function(p){return p.ix===ix;})[0].hidden.map(function(x){return tw_(S.STEM_KO[x.stem]+'('+S.STEM_HAN[x.stem]+')');}).join('<br>'); });
  /* v64 · ‘일주 충(巳亥)’ → ‘일주’ 다음 줄에 ‘충(巳亥)’ (괄호 안에서 끊기지 않게) */
  h+=row('기둥 관계',function(ix){ var p=cells.filter(function(y){return y[1]===ix;})[0]; var rel=relsAt(S.deep(R),p[0]);
    return rel.length?rel.map(function(s){ var i=s.indexOf(' '); return i<0?tw_(s):tw_(s.slice(0,i))+'<br>'+tw_(s.slice(i+1)); }).join('<br>'):'—'; });
  h+=row('공망·신살',function(ix){ var p=cells.filter(function(y){return y[1]===ix;})[0]; var g=(S.deep(R).gmHits.filter(function(x){return x.pos===p[0];}).length?'공망':'')+(salsAt(S.deep(R),p[0]).length?(S.deep(R).gmHits.filter(function(x){return x.pos===p[0];}).length?'·':'')+salsAt(S.deep(R),p[0]).join('·'):''); return g||'—'; });
  h+='</table>';
  var body=secLabel('02','ORIGINAL CHART · 원국')+
   '<h1>여덟 글자의 <span class="accent">지도</span></h1>'+
   '<p class="lead">여덟 글자는 여덟 개의 방입니다. 어느 방에 누가 살고 있는지 알면, 왜 이 사람이 그런 선택을 하는지가 보입니다.</p>'+
   '<p>'+R.y+'년 '+n2(R.m)+'월 '+n2(R.d)+'일'+(R.hasTime?' · 시주 기록':' · 시간 미상(여섯 글자)')+'에 태어났습니다. 여덟 글자는 <b>'+S.eightChars(R)+'</b>이고, 나를 대표하는 중심 글자는 '+stemS(R.dStem)+'입니다. 나머지 글자는 이 중심에서 각각 어떤 역할을 맡고 있는지로 읽습니다.</p>'+h+
   '<p>년주는 조상과 초년'+tw_('(0~15세)')+', 월주는 부모와 청년'+tw_('(16~30세)')+', 일주는 나와 배우자'+tw_('(31~45세)')+', 시주는 자녀와 말년'+tw_('(46세 이후)')+'을 상징합니다. 네 기둥 중 <b>일간</b>이 이 사주의 주인이고, <b>일지</b>는 배우자궁이자 내가 앉는 자리입니다.</p>'+
   callout('원국을 읽는 첫 문장','<p>이 사주는 <b>'+S.STEM_KO[R.dStem]+'('+S.STEM_HAN[R.dStem]+')</b> 일간이 '+brS(R.dBranch)+' 위에 앉아 <b>'+S.ILJU[R.dIdx][0]+'</b>의 결을 만들었습니다. '+S.ILJU[R.dIdx][1]+'</p>');
  chapter('chart','02','원국 · 여덟 글자','사주 원국표와 십성·운성');
  push(page('02 / CHART',body,{spread:true}));
}

function elPage(){
  var R=B.R,c=B.c;
  var h='';
  for(var i=0;i<5;i++){
    h+='<div class="elrow"><span class="n">'+S.EL_KO[i]+'('+S.EL_HAN[i]+')</span><span class="bar"><i style="width:'+Math.max(2,R.pct[i])+'%;background:'+S.EL_COLOR[i]+'"></i></span><span class="v">'+R.pct[i].toFixed(1)+'% · '+R.count[i]+'</span></div>';
  }
  var body=secLabel('03','FIVE ELEMENTS · 오행')+
   '<h1>다섯 기운의 <span class="accent">무게</span></h1>'+
   '<p class="lead">사람은 타고난 온도가 있습니다. 어떤 사람은 뜨겁게 타오르고, 어떤 사람은 오래 데운 뒤에 움직입니다. 이 장은 그 온도의 재료를 재는 일입니다.</p>'+
   '<p>여덟 글자(시간을 모르면 여섯 글자)를 다섯 기운으로 환산했습니다. 합계 '+R.total+'개 중에서 가장 넉넉한 기운은 '+elS(c.mostI)+' '+R.pct[c.mostI].toFixed(1)+'%, 가장 적은 기운은 '+elS(c.leastI)+' '+R.pct[c.leastI].toFixed(1)+'%입니다.</p>'+h+
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
   '<p class="lead">같은 재료로 만든 사람이라도, 무엇을 많이 넣었는지에 따라 전혀 다른 사람이 됩니다. 이 장은 이 사람의 재료 비율표입니다.</p>'+
   '<p>여덟 글자의 관계를 열 가지로 나눈 것이 <b>기운의 결</b>입니다. 어려운 이름 대신 “이 사람이 어떤 상황에서 힘을 내고 어디서 지치는지”로 읽으시면 됩니다.</p>'+h+
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

function relationPage(){
  var R=B.R,d=S.deep(R),c=B.c;
  var rows='';
  d.branchRels.forEach(function(r){
    rows+='<tr><td class="k">'+tw_(r.a)+' '+tw_(brS(r.aBr))+'<br>'+tw_(r.b)+' '+tw_(brS(r.bBr))+'</td><td>'+r.type+'</td><td style="font-size:12px">'+r.mean+'</td></tr>';
  });
  d.stemRels.forEach(function(r){
    rows+='<tr><td class="k">'+r.a+' · '+r.b+' 천간</td><td>'+r.type+'</td><td style="font-size:12px">'+r.mean+'</td></tr>';
  });
  var body=secLabel('02-1','INTERACTION · 어울림과 부딪힘')+
   '<h1>여덟 글자가<br><span class="accent">서로 만나는 자리</span></h1>'+
   '<p class="lead">여덟 글자는 혼자 있지 않습니다. 서로 손을 잡기도 하고 어깨를 부딪히기도 합니다. 그래서 같은 글자라도 옆에 무엇이 있느냐가 결과를 바꿉니다.</p>'+
   (rows?'<table><tr><th>만나는 자리</th><th>관계</th><th>이 사주에서</th></tr>'+rows+'</table>'
        :'<p>네 기둥 사이에 뚜렷한 합·충·형·파·해가 없습니다. 글자들이 서로 간섭하지 않고 <b>각자 제 몫</b>을 하는 구조라, 운의 변화는 세운·대운이 어느 자리에 들어오는지로 읽습니다.</p>')+
   '<h3>공망 — 비어 있는 두 글자</h3><p>'+S.gongmangText(R)+'</p>'+
   '<h3>신살 — 타고난 표시</h3>'+(d.sals.length?'<p>'+d.sals.map(function(s){return '<b>'+s.name+'</b>('+s.pos+')';}).join(' · ')+(d.sals.filter(function(s){return s.strong;}).length?' — 그중 '+d.sals.filter(function(s){return s.strong;}).map(function(s){return s.pos;}).join('·')+'에 걸린 것이 삶에서 가장 크게 작동합니다.':' — 이 자리들은 대개 초년과 사회 초기의 성향으로 나타납니다.')+'</p>':'<p>대표적인 신살이 뚜렷하지 않습니다. 대신 치우친 글자가 적어 어느 자리에서든 평균 이상을 합니다.</p>')+
   '<h3>이 구조를 쓰는 법</h3><p>글자끼리 <b>어울리면 사람을 거치는 일</b>에 힘이 실리고, <b>부딪히면 판을 바꾸는 일</b>에 힘이 실립니다. 그래서 이 사주는 '+(d.branchRels.some(function(r){return r.type==='충';})?'큰 결정을 혼자 밀지 말고, 충이 걸린 자리의 일은 3개월 단위로 나눠 확인해야 합니다.':(d.branchRels.some(function(r){return r.type==='육합'||r.type==='삼합';})?'중개·소개·동업처럼 사람을 거치는 구조에서 빨라집니다.':'결정의 속도를 스스로 정하는 편이 좋습니다.'))+'</p>'+
   callout('한 줄','<p>사주의 합충은 길흉이 아니라 <b>일에 힘이 실리는 방향</b>입니다.</p>');
  chapter('interaction','02-2','합과 충 · 여덟 글자의 관계','기둥 사이의 합·충·공망·신살');
  push(page('02 / INTERACTION',body,{spread:true}));
}

/* 신살·귀인은 ‘네 자리 전부’를 보여준다.
   같은 표시라도 어느 기둥에 앉았는지에 따라 삶에서 드러나는 장면이 다르기 때문이다. */
var POS_EFFECT={
  '년주':'집안과 초년(0~15세)의 분위기로 나타납니다. 자라온 환경, 집안 어른의 성향, 어릴 때의 동네 기운에 이 표시가 배어 있습니다.',
  '월주':'부모와 사회 초년(16~30세)에 나타납니다. 사회에 처음 나갈 때 사람들이 이 사람에게 먼저 반응하는 방식입니다.',
  '일지':'나와 배우자 자리입니다. 가장 가까운 관계와 혼자 있을 때의 습관으로 드러납니다.',
  '시지':'자녀와 말년(46세 이후)에 나타납니다. 늦게 피는 재능과 내가 남기는 것으로 드러납니다.'
};
var SAL_ADD={
  '천을귀인':{'년주':'집안 어른이나 오래된 인연이 결정적인 순간에 손을 내밉니다.','월주':'직장·일에서 나를 끌어주는 사람이 생깁니다.','일지':'배우자나 가장 가까운 사람이 나의 방패가 됩니다.','시지':'후배·자녀·제자가 나를 살립니다.'},
  '문창귀인':{'년주':'어릴 때부터 책과 기록에 재능이 있었습니다.','월주':'직장에서 문서·기획·설명으로 인정받습니다.','일지':'혼자 쓰고 정리하는 시간이 재산이 됩니다.','시지':'늦게 시작한 공부가 이름이 됩니다.'},
  '도화':{'년주':'어릴 때부터 눈에 띄는 아이였습니다.','월주':'직장·모임에서 먼저 기억되는 사람입니다.','일지':'가까운 관계에서 매력이 크게 작동합니다. 다만 호감과 인연을 구분해야 합니다.','시지':'나이가 들어서도 사람을 끄는 힘이 남습니다.'},
  '역마':{'년주':'어릴 때 이사·전학이 잦았거나 집안이 움직였습니다.','월주':'사회 초년에 자리를 자주 옮깁니다.','일지':'생활 자체가 자주 바뀝니다. 한곳에 묶는 계획이 오히려 어색합니다.','시지':'말년에 여행·이주가 늘고, 자녀가 먼 곳에 삽니다.'},
  '화개':{'년주':'집안에 종교·예술·학문의 분위기가 있었습니다.','월주':'직업에서 몰입과 전문성이 무기가 됩니다.','일지':'혼자 있는 시간이 없으면 병이 납니다.','시지':'말년에 예술·수행·연구로 돌아갑니다.'},
  '홍염':{'년주':'어릴 때부터 분위기가 남달랐습니다.','월주':'사람을 끄는 힘이 일에서도 작동합니다.','일지':'가까운 관계의 온도가 높고, 감정 소모도 큽니다.','시지':'늦은 인연이 오히려 깊습니다.'},
  '금여':{'년주':'집안이 재산을 남겨주는 자리입니다.','월주':'직장에서 돈이 되는 자리를 먼저 받습니다.','일지':'배우자나 내 손으로 재산이 남습니다.','시지':'말년에 집·땅이 남습니다.'},
  '양인':{'년주':'집안 분위기가 강단이 있습니다.','월주':'직장에서 밀어붙이는 힘이 평가받습니다. 다만 계약에서 강하게 나가면 다툼이 남습니다.','일지':'가까운 관계에서 고집이 드러납니다.','시지':'말년에도 물러서지 않는 힘이 있습니다.'},
  '백호':{'일지':'몸과 생활에 큰 변화가 한 번 옵니다. 그때 정리해 둔 것이 남습니다.'},
  '괴강':{'일지':'결단이 빠르고 책임을 지는 자리입니다. 혼자 결정하는 습관을 조심하세요.'}
};
function salsPage(){
  var R=B.R,c=B.c,d=S.deep(R);
  var marks=[];
  /* ① 계산된 표시를 자리별로 모두 모은다 */
  if(d.sals&&d.sals.length){
    d.sals.forEach(function(x){ marks.push({name:x.name,han:x.han||'',pos:x.pos,br:x.br,txt:x.txt,key:x.key}); });
  } else {
    salsOf(R).forEach(function(x){ marks.push({name:x.n,han:'',pos:x.b,br:null,txt:x.t,key:x.n}); });
  }
  var cols=[['년주',R.yIdx],['월주',R.mIdx],['일주',R.dIdx],['시주',R.hIdxP]];
  var POSK={'년주':'년주','월주':'월주','일주':'일지','시주':'시지'};
  function marksAt(posKey){
    var k=POSK[posKey];
    return marks.filter(function(m){ return m.pos===posKey||m.pos===k; });
  }
  var h='<table><tr><th>자리</th><th>글자</th><th>기운의 흐름</th><th>타고난 표시</th></tr>';
  cols.forEach(function(x){
    var ix=x[1];
    if(ix==null){ h+='<tr><td class="k">'+x[0]+'</td><td colspan="3">시간을 몰라 이 자리는 비워 두었습니다.</td></tr>'; return; }
    var ms=marksAt(x[0]);
    h+='<tr><td class="k">'+x[0]+'<br><span style="font-size:11px">'+POS_EFFECT[POSK[x[0]]].split('(')[0]+'</span></td>'+
      '<td>'+gzP(ix%10,ix%12)+'</td>'+
      '<td>'+unsung(R.dStem,ix%12)+'</td>'+
      '<td style="font-size:11.5px">'+(ms.length?ms.map(function(m){return m.name+(m.han?'('+m.han+')':'');}).join(' · '):'없음')+'</td></tr>';
  });
  h+='</table>';

  var detail='';
  if(marks.length){
    detail='<h3>표시마다, 이 자리에서 하는 일</h3>';
    marks.forEach(function(m){
      var posKey=(m.pos==='년지'?'년주':(m.pos==='월지'?'월주':m.pos));
      var eff=(SAL_ADD[m.name]&&SAL_ADD[m.name][posKey])?SAL_ADD[m.name][posKey]:(POS_EFFECT[posKey]||POS_EFFECT[m.pos]||'');
      detail+='<p><b>'+m.name+(m.han?'('+m.han+')':'')+' · '+m.pos+'</b> — '+m.txt+' <b>이 자리에서는</b> '+eff+'</p>';
    });
  } else {
    detail='<p>대표적인 표시가 뚜렷하게 걸리지 않았습니다. 이것은 흠이 아니라, 이 사람의 결이 <b>사주 본연의 구조</b>로 더 또렷하게 드러난다는 뜻입니다. 대신 4장과 8장에서 성격과 재능을 더 자세히 읽어 보세요.</p>';
  }

  var body=secLabel('05','FOUR PILLARS · 기운이 머무는 자리와 표시')+
   '<h1>네 자리에 찍힌<br><span class="accent">작은 표식들</span></h1>'+
   '<p class="lead">사람에게도 저마다 손버릇이 있듯, 사주에는 네 자리에 작은 표식이 찍힙니다. 귀인은 도와주는 사람, 도화는 사람을 끄는 힘, 역마는 움직이는 힘입니다.</p>'+
   '<p>이 표식들은 “좋다·나쁘다”가 아니라 <b>어디서 힘이 나고 어디서 부딪히는지</b>를 알려주는 표지판입니다. 같은 표식이라도 <b>어느 자리에 앉았는지</b>에 따라 삶에 나타나는 장면이 달라집니다.</p>'+h+detail+
   '<p>'+S.gongmangText(R)+'</p>'+
   callout('표식을 읽는 태도','<p>도화는 매력, 역마는 이동, 화개는 몰입, 천을귀인은 사람의 도움입니다. 쓰는 방식에 따라 재능이 되고 부담이 됩니다. 없는 표식은 아쉬운 것이 아니라 다른 방식으로 채워지는 자리입니다.</p>');
  chapter('stages','05','기운이 머무는 자리와 타고난 표시','네 자리 · 귀인과 표식');
  push(page('05 / STAGES',body,{spread:true}));
  /* 두 번째 지면 — 열두 단계 전체 표 + 이 사주가 앉은 자리 */
  var mine={};
  cols.forEach(function(x){ if(x[1]!=null) mine[unsung(R.dStem,x[1]%12)]=x[0]; });
  var stageRows=UNSUNG.map(function(st){
    var where=mine[st];
    return '<tr'+(where?' style="background:#F6F1E7"':'')+'><td class="k">'+st+'</td><td style="font-size:12px">'+UNSUNG_MEAN[st]+'</td><td style="font-size:11.5px">'+(where?'<b>'+where+'</b>':'')+'</td></tr>';
  }).join('');
  var body2=secLabel('05','TWELVE STAGES · 기운의 열두 단계')+'<h2>기운은 자리마다<br><span class="accent">세기가 다릅니다</span></h2>'+
   '<p>같은 사람이라도 자리에 따라 기운이 세거나 약합니다. 아래 표는 기운이 흐르는 열두 자리에 붙인 이름과, 이 사주가 실제로 앉아 있는 자리(진하게 표시)를 함께 놓은 것입니다.</p>'+
   '<table><tr><th>단계</th><th>생활에서 이렇게 보입니다</th><th>이 사주</th></tr>'+stageRows+'</table>'+
   '<p>진하게 표시된 자리가 이 사람이 실제로 앉은 자리입니다. 같은 단계가 두 번 나오면 그 성향이 삶에서 두 번 되풀이됩니다.</p>'+
   '<p class="note">※ 단계의 이름(장생·목욕·관대…)은 기운이 흐르는 열두 자리에 붙인 이름입니다. 뜻은 오른쪽 설명 그대로 읽으시면 됩니다.</p>';
  push(page('05 / STAGES',body2,{spread:true}));
}

function strengthPage(){
  var R=B.R,c=B.c;
  var yongWhy=(R.strength==='약')?'중심 글자가 얇은 편이라, 나를 낳아주는 '+elK(c.yongEl)+'의 기운으로 뿌리를 보강하는 것이 먼저입니다.':(R.strength==='강'?'중심 글자가 강한 편이라, 넘치는 힘을 밖으로 풀어내는 '+elK(c.yongEl)+'의 기운이 약이 됩니다.':'전체 균형이 크게 기울지 않아, 가장 적은 '+elK(c.yongEl)+' 기운을 채우는 것이 가장 효율적입니다.');
  var d=S.EL_DEEP[c.yongEl];
  var body=secLabel('06','필요한 기운')+
   '<h1>이 사주에 필요한<br><span class="accent">한 가지 기운</span></h1>'+
   '<p class="lead">사람마다 부족한 것이 하나씩 있습니다. 이 사주는 그것을 채울 때 마음이 편해지고, 채우지 못하면 같은 자리에서 자꾸 지칩니다.</p>'+
   '<p>'+S.strengthText(R)+'</p>'+
   '<p>'+S.yongText(R)+'</p>'+
   '<p>'+yongWhy+'</p>'+
   '<table><tr><th>채울 기운</th><th>'+elK(c.yongEl)+'</th></tr>'+
   '<tr><td class="k">색</td><td>'+d.color+'</td></tr>'+
   '<tr><td class="k">방위</td><td>'+d.dir+'</td></tr>'+
   '<tr><td class="k">계절</td><td>'+d.season+'</td></tr>'+
   '<tr><td class="k">공간</td><td>'+d.space+'</td></tr>'+
   '<tr><td class="k">생활</td><td>'+d.habit+'</td></tr>'+
   '<tr><td class="k">음식</td><td>'+d.food+' · '+d.taste+'</td></tr>'+
   '<tr><td class="k">소품</td><td>'+d.item+'</td></tr></table>'+
   '<p>'+S.EL_DEEP[c.mostI].over+' 가장 넉넉한 기운이 곧 필요한 기운이라면, 억지로 덜어내기보다 <b>잘 쓰는 법</b>을 익히는 쪽이 맞습니다. 반대라면 넘치는 기운을 더 밀어붙이지 않도록 주의하세요.</p>'+
   callout('채우는 법','<p>개운은 큰 의식이 아닙니다. 매일 '+S.EL_KO[c.yongEl]+' 쪽으로 조금씩 기울여두면, 일 년 뒤 사주의 균형이 눈에 띄게 달라집니다. '+d.habit+' — 이것 하나부터.</p>');
  chapter('yong','06','사주의 틀과 필요한 기운','채우면 좋은 기운과 보완');
  push(page('06 / YONGSIN',body,{spread:true}));
}

/* ---------------- 07 · 네 기둥 ---------------- */
function pillarPages(){
  var R=B.R,c=B.c,d=S.deep(R);
  var defs=[
    {name:'년주',ix:R.yIdx,range:'0~15세 · 뿌리',desc:'조상과 집안의 분위기, 그리고 초년의 환경입니다. 이 자리는 “내가 태어난 조건”입니다.',key:'year'},
    {name:'월주',ix:R.mIdx,range:'16~30세 · 사회 초년',desc:'부모와 형제, 그리고 사회에 처음 나갈 때의 자리입니다. 직업의 재료가 여기서 나옵니다.',key:'month'},
    {name:'일주',ix:R.dIdx,range:'31~45세 · 나와 배우자',desc:'중심 글자는 나, 나의 자리는 내가 앉는 곳이자 배우자 자리입니다. 가장 중요한 기둥입니다.',key:'day'},
    {name:'시주',ix:R.hIdxP,range:'46세 이후 · 결실',desc:'자녀와 말년, 그리고 내가 남기는 것을 상징합니다.',key:'hour'}
  ];
  defs.forEach(function(df,i){
    var ix=df.ix;
    var body=secLabel('07','FOUR PILLARS · '+df.name);
    if(ix==null){
      body+='<h1>'+df.name+' — <span class="accent">시간 미상</span></h1>'+
        '<p class="lead">태어난 시간을 모르면 시주를 세우지 않습니다. 여섯 글자로도 충분히 읽을 수 있지만, 시주가 있으면 자녀·말년·숨은 재능까지 정확해집니다.</p>'+
        '<p>시주는 하루 중 태어난 시각을 뜻합니다. 출생신고서나 어머니의 기억, 병원 기록에서 확인할 수 있다면 9~11장이 더 정밀해집니다.</p>'+
        callout('시간을 모른 채 읽는 법','<p>시주가 없으면 나의 자리와 부모 자리의 관계로 말년의 결을 대신 봅니다. 이 사주는 '+brS(R.dBranch)+'가 그 역할을 합니다. '+S.BR_INNER[R.dBranch]+'</p>');
      chapter(df.key,'07-'+(i+1),df.name+' · '+df.range,'시간 미상');
      push(page('07 / PILLARS',body,{spread:true}));
      return;
    }
    var s=ix%10,b=ix%12,g=S.tenGod(R.dStem,s);
    body+=(i===0?'<p class="lead">인생을 네 칸으로 나누면 초년·청년·나·말년입니다. 지금의 습관은 그 네 칸에서 배운 것이 이어지고 있는 것입니다.</p>':'')+
      '<h1>'+df.name+' — <span class="accent">'+gzP(s,b)+'</span></h1>'+
      '<p class="lead">'+df.desc+'</p>'+
      '<div class="chart4"><div class="c"><div class="lab">천간</div><div class="god">'+g+'</div><div class="st">'+S.STEM_HAN[s]+'</div><div class="ko">'+S.STEM_KO[s]+' · '+S.EL_KO[S.STEM_EL[s]]+'</div></div>'+
      '<div class="c"><div class="lab">지지</div><div class="god">'+unsung(R.dStem,b)+'</div><div class="st">'+S.BR_HAN[b]+'</div><div class="ko">'+S.BR_KO[b]+' · '+S.EL_KO[S.BR_EL[b]]+'</div></div>'+
      '<div class="c"><div class="lab">기운의 갈래</div><div class="god">'+plainGrp(S.GOD_GROUP[g])+'</div><div class="st" style="font-size:18px">'+g+'</div><div class="ko">'+S.GOD_KEY[g]+'</div></div>'+
      '<div class="c"><div class="lab">단계</div><div class="god">'+df.range.split(' · ')[0]+'</div><div class="st" style="font-size:17px">'+df.range.split(' · ')[1]+'</div><div class="ko">'+unsung(R.dStem,b)+'</div></div></div>'+
      '<h3>이 기둥의 결</h3><p>'+S.GOD_DEEP[g]+'</p>'+
      '<p>이 기둥이 품고 있는 기운은 '+d.pillars.filter(function(p){return p.key===df.key;})[0].hidden.map(function(x){return '<b>'+S.STEM_KO[x.stem]+'('+S.STEM_HAN[x.stem]+')</b> '+x.god;}).join(' · ')+'입니다. 품고 있는 기운은 겉으로 드러나는 성격과 다른 결을 만듭니다.</p>'+
      '<p>다른 기둥과의 관계 — '+(function(){ var rr=relsAt(d,df.name); return rr.length?rr.join(', ')+'입니다. '+REL_MEAN_BOOK(rr):'두드러지게 어울리거나 부딪히는 자리가 없습니다. 이 기둥은 다른 자리에 간섭하지 않고 제 몫을 합니다.'; })()+'</p>'+
      (function(){ var gm=d.gmHits.filter(function(x){return x.pos===df.name;}); return gm.length?'<p>이 기둥은 <b>비어 있는 자리</b>입니다 — 이 자리의 것은 늦게 채워지거나 마음처럼 남지 않습니다. 그래서 '+df.range.split(' · ')[1]+'의 일은 구두 약속보다 <b>기록</b>이 남아야 합니다.</p>':''; })()+
      '<p>'+S.BR_INNER[b]+' 이 글자가 놓인 자리는 '+df.range.split(' · ')[1]+'의 시기입니다. 그래서 이 시기에 '+S.GOD_KEY[g]+'의 성향이 삶의 방식으로 굳어집니다.</p>'+
      '<p>'+UNSUNG_MEAN[unsung(R.dStem,b)]+'</p>'+
      callout('이 기둥을 쓰는 법','<p>'+df.name+'는 '+S.GOD_KEY[g]+'의 자리입니다. '+S.STRENGTH_TXT[R.strength].out+' 이 재료를 '+df.range.split(' · ')[1]+'에 어떻게 썼는지가 지금의 습관이 되었습니다.</p>');
    chapter(df.key,'07-'+(i+1),df.name+' · '+df.range,gzP(s,b)+' · '+g);
    push(page('07 / PILLARS',body,{spread:true}));
  });
}

/* ---------------- 07-5 · 기둥이 겹치는 사주 ---------------- */
/* 연·월·일·시에 같은 글자가 두 번 이상 오면, 같은 주제가 인생의 두 시기에 되풀이된다.
   표만 같고 설명이 비어 보이지 않도록, 겹침의 뜻을 따로 한 장 써 준다. */
var REPEAT_NOTE={
  '년주+월주':'집안의 분위기와 사회에 나갈 때의 방식이 같습니다. 그래서 이 사람은 회사에서도 집에서 배운 태도를 그대로 씁니다. 좋게 쓰면 “일관된 사람”, 나쁘게 쓰면 “집에서 하던 방식을 직장에서도 하는 사람”이 됩니다.',
  '월주+일주':'일과 가까운 관계의 경계가 흐려지기 쉽습니다. 일로 만난 사람이 가족처럼 가까워지거나, 가족 같은 사람과 일을 하게 됩니다. 경계를 긋는 연습이 이 사주의 숙제입니다.',
  '일주+시주':'나와 자녀(또는 후배)가 닮습니다. 내가 싫어했던 습관을 아이에게서 발견하게 되고, 반대로 내 장점이 아이에게 그대로 나타납니다. 말년에도 지금의 방식이 그대로 이어집니다.',
  '년주+일주':'어릴 때의 환경이 성격의 바탕에 깔려 있습니다. 집안에서 배운 것이 지금의 선택 기준이 되어, 중요한 순간마다 “어릴 때 그랬던 것처럼” 움직입니다.',
  '월주+시주':'부모에게서 받은 것과 자녀에게 주는 것이 같습니다. 이 사람의 가족은 세대를 건너 같은 주제를 반복합니다. 그 고리를 끊고 싶다면, 지금 한 번 다르게 말해보는 것으로 시작하세요.',
  '년주+시주':'초년과 말년이 같은 결로 돌아옵니다. 젊을 때 미뤄둔 것이 늦게 다시 올라오고, 말년에 그때의 취미나 재능이 다시 살아납니다.',
  '세 자리 이상':'같은 글자가 세 자리 이상 겹치는 사주는 드물고 강합니다. 한 가지 주제가 인생 전체를 관통합니다. 장점은 한 우물을 깊게 판다는 것이고, 약점은 다른 방식으로 사는 법을 늦게 배운다는 것입니다.'
};
function pillarRepeatPage(){
  var R=B.R,c=B.c;
  var cols=[['년주',R.yIdx],['월주',R.mIdx],['일주',R.dIdx],['시주',R.hIdxP]];
  var groups={};
  cols.forEach(function(x){ if(x[1]==null) return; var k=x[1]; (groups[k]=groups[k]||[]).push(x[0]); });
  var reps=[]; for(var k in groups){ if(groups[k].length>1) reps.push({ix:parseInt(k,10),pos:groups[k]}); }
  if(!reps.length) return;
  var h='<p class="lead">같은 글자가 두 번 오면 그 기운이 두 배로 세진다기보다, <b>같은 주제가 인생의 두 시기에 되풀이된다</b>는 뜻입니다. 이 사주는 같은 장면을 다른 무대에서 다시 만납니다.</p>';
  reps.sort(function(a,b){ return b.pos.length-a.pos.length; });
  var anyLong=false;
  reps.forEach(function(r){
    var note=REPEAT_NOTE[r.pos.join('+')]||(r.pos.length>=3?REPEAT_NOTE['세 자리 이상']:'같은 글자가 겹쳐 그 주제가 삶에서 여러 번 되풀이됩니다.');
    if(r.pos.length>=3) anyLong=true;
    h+='<h3>'+r.pos.join(' · ')+' — 모두 '+gzP(r.ix%10,r.ix%12)+'</h3>'+
       '<p>'+note+'</p>'+
       '<p>이 글자의 결은 '+S.GOD_KEY[S.tenGod(R.dStem,r.ix%10)]+'입니다. 그래서 겹친 자리마다 같은 방식이 다시 나옵니다. <b>잘 쓰는 법</b>은 그 방식을 한 번 더 밀어붙이는 것이 아니라, 한 번은 일부러 다르게 해보는 것입니다.</p>';
  });
  var rp=reps[0], rpEl=S.STEM_EL[rp.ix%10], rpBrEl=S.BR_EL[rp.ix%12];
  h+='<h3>이 글자가 두 번 오는 이유</h3><p>겹친 글자 '+gzP(rp.ix%10,rp.ix%12)+'의 천간은 '+elK(rpEl)+', 지지는 '+elK(rpBrEl)+'입니다. '+S.EL_DEEP[rpEl].over+' 그리고 '+S.EL_DEEP[rpBrEl].under+' 이 두 결이 같은 자리에 두 번 놓이면, 한 번은 타고난 성향으로, 다른 한 번은 환경이 시키는 역할로 나타납니다.</p>'+
     '<p>그래서 이 사주는 <b>같은 실수를 반복할 수 있는 대신, 같은 재능도 두 번 살릴 수 있습니다.</b> 대개 한 번은 젊을 때 서툴게 쓰고, 두 번째에는 훨씬 정확하게 씁니다.</p>';
  h+='<h3>겹칠 때 조심할 것</h3>'+UL([
    '같은 갈등이 다시 올라오면 <b>이번에는 다르게 말해보기</b> — 이 한 가지만 기억하세요.',
    '같은 글자가 반복되면 <b>선택의 폭이 좁아 보입니다</b>. 일부러 반대 방향의 사람을 한 명 곁에 두세요.',
    '겹친 자리의 시기(초년·청년·말년)에 <b>같은 주제의 결정</b>이 다시 옵니다. 두 번째에는 첫 번째보다 빨리 결정할 수 있습니다.'
  ]);
  h+='<p>같은 글자가 많으면 표는 단순해 보이지만 삶은 오히려 한 곳에 머물기 쉽습니다. 반복되는 장면을 알아차리는 것만으로도 절반은 달라집니다.</p>';
  h+=callout('겹침을 읽는 태도','<p>겹친 기둥은 흠이 아닙니다. 같은 주제를 두 번 겪을 수 있는 사람은, 그 주제를 남보다 깊게 이해합니다. 문제는 이해한 것을 말로 옮기지 않을 때 생깁니다.</p>');
  chapter('pillarRepeat','07-5','네 기둥이 겹칠 때','같은 글자가 만드는 반복');
  push(page('07 / PILLARS',secLabel('07','FOUR PILLARS · 겹치는 자리')+'<h1>같은 글자가<br><span class="accent">두 번 올 때</span></h1>'+h,{spread:true}));
}

/* ---------------- 4장 성격 ---------------- */
function personalityPages(){
  var R=B.R,c=B.c;
  var dm=S.DM_DEEP[R.dStem];
  var pages=[
   {t:'겉으로 보이는 나',body:'<p class="lead">사람은 자기 얼굴을 직접 보지 못합니다. 대신 남의 반응으로 얼굴을 짐작합니다. 이 장은 그 반응의 이유를 여덟 글자에서 찾습니다.</p>'+
     '<p>'+dm.out+'</p>'+
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
    '<p class="lead">관계는 운이 아니라 습관입니다. 그리고 그 습관은 대부분 어릴 때 배운 방식입니다. 이 장은 이 사람이 사람에게 다가가는 순서를 풉니다.</p>'+
    '<p>이 사주의 대인관계는 <b>'+plainGrp(c.topGrp)+'</b>으로 만들어집니다. '+S.GROUP_MEAN[c.topGrp]+'</p>'+
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
  chapter('wealth','10','재물과 자산','그릇·새는 곳·문서·10년');
  var R=B.R,c=B.c,d=S.deep(R),w=d.docu;
  var jeong=c.gc['정재'],pyeon=c.gc['편재'];
  var jaeWhere=[];
  d.live.forEach(function(p){
    if(S.GOD_GROUP[p.sGod]==='재성') jaeWhere.push(p.pos+' 천간 '+stemS(p.stem)+' '+p.sGod);
    if(S.GOD_GROUP[p.bGod]==='재성') jaeWhere.push(p.pos+' 지지 '+brS(p.branch)+' '+p.bGod);
  });
  push(page('10 / WEALTH',secLabel('10','(1) 돈의 그릇과 들어오는 문')+'<h1>돈의 그릇과<br><span class="accent">들어오는 문</span></h1>'+
    '<p class="lead">돈 이야기는 늘 두 갈래입니다. 얼마를 버느냐, 그리고 얼마를 남기느냐. 이 사주는 후자에서 갈립니다.</p>'+
    '<p>돈의 기운은 <b>'+(jeong+pyeon)+'개</b>(쌓는 돈 '+jeong+' · 도는 돈 '+pyeon+')입니다. '+(pyeon>jeong?'변동형 수입에 강하고 큰 판을 보는 눈이 있습니다.':(jeong>pyeon?'고정형 수입에 강하고 관리에 능합니다.':'고정과 변동이 반반이라 균형 잡힌 운영이 맞습니다.'))+'</p>'+
    '<p>재성이 놓인 자리는 '+(jaeWhere.length?jaeWhere.join(', '):'천간·지지 본기에 뚜렷하지 않음')+'입니다. 어느 기둥에 있느냐가 돈의 성질을 정합니다 — 년주면 자라온 환경, 월주면 직업, 일주면 내 손, 시주면 말년과 자녀입니다.</p>'+
    '<p>'+S.strengthText(R)+'</p>'+
    '<p>'+S.yongText(R)+'</p>'+
    '<table><tr><th>구분</th><th>이 사주의 결</th></tr>'+
    '<tr><td class="k">그릇</td><td>'+(S.WEALTH_VESSEL_GOD[c.topGodInGrp]||'성실함이 그대로 재산이 되는 구조')+'</td></tr>'+
    '<tr><td class="k">새는 곳</td><td>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'사람을 통한 지출에서 계산이 흐려집니다.')+'</td></tr>'+
    '<tr><td class="k">맞는 일</td><td>'+S.careerMap(R).roles[0]+' · '+S.careerMap(R).roles[1]+'</td></tr>'+
    '<tr><td class="k">공망</td><td>'+(d.gmHits.length?d.gmHits.map(function(x){return x.pos;}).join('·')+' — 들어온 돈이 늦게 정산됩니다':(w.gmIn.length?'인성 공망 — 서류·등기에서 한 번 더 확인':'걸린 자리 없음'))+'</td></tr></table>'+
    '<p>'+(c.grp['재성']>=3?'이 사주는 현실적인 계산이 빠릅니다. 다만 사람이 앞서면 계산이 흐려지니, 큰 결정은 혼자 숫자로 확인하는 시간을 두세요.':(c.grp['식상']>=3?'아이디어가 돈이 되는 구조입니다. 검증 없이 뛰어들지 말고 작은 금액으로 먼저 확인하세요.':(c.grp['인성']>=3?'공부하고 확신이 생겨야 움직입니다. 확신이 늦어 기회를 놓치지 않도록 기한을 정하세요.':(c.grp['관성']>=3?'안정형입니다. 원금과 절차를 중요하게 보고, 급한 제안에 흔들리지 않습니다.':'내 판단을 믿는 편입니다. 손실 한도를 먼저 정하는 것이 가장 중요합니다.'))))+'</p>',{spread:true}));
  push(page('10 / WEALTH',secLabel('10','(2) 돈이 새는 세 구멍')+'<h1>돈이 새는<br><span class="accent">세 개의 구멍</span></h1>'+
    '<p class="lead">돈은 벌이의 크기보다 <b>새는 곳</b>에서 갈립니다. 이 사주는 특히 사람과 감정에 연결된 지출에서 새기 쉽습니다.</p>'+
    '<h3>(1) 사람에게 쓰는 돈</h3><p>이 사주의 중심 기운은 '+c.topGrp+'입니다. '+S.GROUP_MEAN[c.topGrp]+' 그래서 관계를 위해 계산을 포기하는 순간이 있습니다. 빌려준 돈, 함께 쓴 비용, 내가 더 낸 자리 — 이 사주는 기억은 하지만 말은 못 합니다.</p>'+
    '<h3>(2) 기분 전환으로 쓰는 돈</h3><p>'+S.EL_DEEP[c.leastI].under+' 가장 얇은 기운이 비면 작은 소비로 채우려 합니다. 그 소비는 한 달 뒤에 남지 않습니다.</p>'+
    '<h3>(3) 미루는 돈</h3><p>이 사주는 결제·청구·정산을 미루는 습관이 있습니다. 미룬 돈은 커지지 않지만, 미룬 결정은 손실이 됩니다. 기신 '+elKj(d.gisin)+' 도는 달에는 이 구멍이 두 배로 커집니다.</p>'+
    '<p>'+S.gongmangText(R)+'</p>'+
    callout('막는 방법','<p>큰 결심보다 구조가 낫습니다. 통장을 셋으로 — 쓰는 통장, 쌓는 통장, 비상 통장. 수입이 들어온 날 <b>절반</b>을 먼저 옮기세요. '+S.EL_DEEP[d.yong].color+' 계열의 이름을 붙이면 의식이 유지됩니다.</p>'),{spread:true}));
  /* 문서·부동산은 재물 (4) 뒤에 붙인다 — 순서가 섞이지 않게 build에서 호출 */
  // 10년 재물 흐름
  var rows='';
  R.daeun.forEach(function(dn,i){
    var g=S.tenGod(R.dStem,dn.idx%10), grp=S.GOD_GROUP[g];
    var note=({'정재':'쌓이는 돈의 구간. 저축·계약·자격처럼 남는 일이 재산이 됩니다.','편재':'큰 돈이 도는 구간. 판이 넓어지지만 씀씀이도 함께 커집니다.','비견':'내 힘으로 버는 구간. 동업은 몫을 먼저 정하세요.','겁재':'사람을 통해 버는 구간. 장부가 없으면 남지 않습니다.','식신':'좋아하는 일이 수입이 되는 구간.','상관':'재능이 돈이 되는 구간. 구설을 조심하세요.','편관':'압박이 커지는 구간. 자리를 지키는 것이 곧 돈입니다.','정관':'자리가 돈을 만드는 구간. 조직·자격이 곧 재산입니다.','편인':'혼자 깊어지는 구간. 준비에 돈을 씁니다.','정인':'배움에 돈을 쓰는 구간. 큰 투자보다 실력을 사는 쪽이 남습니다.'})[g]||'';
    var rel=S.relType(R.dBranch,dn.idx%12);
    rows+='<tr><td class="k">'+dn.from+'~'+dn.to+'</td><td>'+tw_(gzP(dn.idx%10,dn.idx%12))+'<br>'+g+(rel&&rel!=='동일'?'<br><span style="font-size:11px">일지와 '+rel+'</span>':'')+'</td><td style="font-size:12px">'+note+'</td></tr>';
  });
  push(page('10 / WEALTH',secLabel('10','(3) 10년마다 바뀌는 돈의 크기')+'<h1>10년마다 바뀌는<br><span class="accent">돈의 그릇</span></h1>'+
    '<p class="lead">같은 노력도 대운의 결에 따라 결과가 달라집니다. 이 사주의 재물은 아래 구간에서 크기가 달라집니다.</p>'+
    '<table><tr><th>나이</th><th>대운</th><th>재물의 결</th></tr>'+rows+'</table>'+
    '<p>이 사주에게 가장 중요한 것은 <b>들어오는 구간에 무엇을 남기느냐</b>입니다. 재성이 오는 10년에 벌어도, 인성의 10년에 지키지 못하면 남지 않습니다.</p>'+
    callout('10년의 규칙','<p>재성이 오는 10년에는 <b>벌이는 크게, 지출은 작게</b>. 인성이 오는 10년에는 <b>실력과 문서에 투자</b>. 비겁이 오는 10년에는 <b>내 이름을 걸되 몫을 문서로</b>.</p>'),{spread:true}));
  push(page('10 / WEALTH',secLabel('10','(4) 한 달의 금전 루틴')+'<h1>한 달의<br><span class="accent">금전 루틴</span></h1>'+
    '<p class="lead">'+(S.WEALTH_ROUTINE[c.topGrp]||'수입이 들어온 날 바로 떼어두는 습관 하나가 10년을 바꿉니다.')+'</p>'+
    '<table><tr><th>때</th><th>할 일</th><th>왜</th></tr>'+
    '<tr><td class="k">수입일</td><td>절반을 쌓는 통장으로 이동</td><td>이 사주는 손에 있으면 씁니다</td></tr>'+
    '<tr><td class="k">주 1회</td><td>지출 10분 점검</td><td>작은 지출이 새는 곳입니다</td></tr>'+
    '<tr><td class="k">기신의 달</td><td>큰 결제 2주 미루기</td><td>2주면 절반은 사지 않습니다</td></tr>'+
    '<tr><td class="k">월 1회</td><td>고정 지출 하나 줄이기</td><td>구조를 바꾸는 유일한 방법</td></tr>'+
    '<tr><td class="k">분기 1회</td><td>큰 지출 계획 세우기</td><td>충동과 분리하기</td></tr>'+
    '<tr><td class="k">연 1회</td><td>보험·연금·세금 점검</td><td>이 사주가 가장 미루는 일</td></tr></table>'+
    '<h3>공간의 처방</h3><p>'+S.EL_DEEP[d.yong].space+'. '+S.EL_DEEP[d.yong].item+' — 이 사주는 눈에 보이는 것으로 의식을 유지합니다.</p>'+
    callout('한 줄','<p>돈은 <b>한 달의 순서</b>로 지켜집니다. 많이 버는 사람이 아니라, 순서를 지키는 사람이 남깁니다.</p>'),{spread:true}));
}

/* ---------------- 7장 커리어 ---------------- */
function docuPages(){
  var R=B.R,c=B.c,w=S.docu(R),d=S.deep(R);
  chapter('docu','10-1','문서와 부동산','계약·등기·매매의 문');
  push(page('10 / DOCUMENT',secLabel('10','(5) 문서와 부동산 — 취득의 문')+'<h1>문서와 부동산<br><span class="accent">취득의 문</span></h1>'+
    '<p class="lead">집과 계약은 인생에서 몇 번뿐인 큰 결정입니다. 그 몇 번을 어디서 결정하느냐가 10년의 재산을 바꿉니다.</p>'+
    '<p>문서는 돈의 크기와 다른 축입니다. <b>문서·계약</b>, <b>명의·절차</b>, <b>실물·자금</b> 세 가지가 서로 받쳐주는지, 그중 하나가 비어 있는지로 봅니다.</p>'+
    '<p><b>취득 지수 '+w.score+'/100 · '+w.grade+'</b> — 인성 '+w.inCnt+' · 관성 '+w.gwanCnt+' · 재성 '+w.jaeCnt+' · 토(土) '+w.toCnt+'</p>'+
    '<table><tr><th>축</th><th>이 사주의 구조</th></tr>'+
    '<tr><td class="k">인성 '+w.inCnt+'</td><td>'+(w.inCnt===0?'문서를 “나중에” 보는 구조입니다. 계약서·등기부를 읽는 습관 자체를 만들어야 합니다.':(w.inCnt<=2?'문서를 읽고 남기는 힘이 적당합니다. 확인 목록만 정해두면 충분합니다.':'문서가 많은 사주입니다. 검토가 길어져 타이밍을 놓치는 쪽이 위험합니다.'))+'</td></tr>'+
    '<tr><td class="k">관성 '+w.gwanCnt+'</td><td>'+(w.gwanCnt===0?'명의·등기·관청 절차에 약합니다. 매수는 되지만 명의를 넘기는 순서에서 실수가 생깁니다.':(w.gwanCnt<=2?'명의와 절차를 지키는 힘이 있습니다. 등기·확정일자 같은 공적 기록이 힘이 됩니다.':'절차가 강해 형식에 매달릴 수 있습니다. 실익(잔금·대출·세금)을 먼저 계산하세요.'))+'</td></tr>'+
    '<tr><td class="k">재성 '+w.jaeCnt+'</td><td>'+(w.jaeCnt===0?'실물 자산보다 현금·사람 쪽에 가까운 사주입니다. 부동산은 작게 한 채가 맞습니다.':(w.jaeCnt<=2?'실물을 쥐는 힘이 있습니다. 판단이 늦지 않으면 남습니다.':'자산이 여러 개로 흩어지기 쉽습니다. 명의와 관리 주체를 하나로 모으세요.'))+'</td></tr>'+
    '<tr><td class="k">토(土) '+w.toCnt+'</td><td>'+(w.toCnt>=2?'토가 넉넉해 땅·집과 인연이 있습니다.':(w.toCnt===1?'토가 하나 있어 부동산과 한 번은 인연이 됩니다.':'토가 얇아 부동산보다 금융·사람 쪽이 이 사주에 맞습니다.'))+'</td></tr></table>'+
    '<p>'+S.gongmangText(R)+'</p>'+
    '<table><tr><th>취득 방식</th><th>적합도</th></tr>'+w.types.map(function(t){ return '<tr><td class="k">'+t.label+'</td><td>'+t.s+'점 — '+t.why+'</td></tr>'; }).join('')+'</table>'+
    callout('결론','<p>이 사주는 <b>'+w.types[0].label+'</b>'+S.josaP(w.types[0].label.slice(-1),'이가')+' 가장 잘 맞고, 그다음이 <b>'+w.types[1].label+'</b>입니다. '+(w.types[0].k==='jeonse'?'큰 빚을 지는 매수보다 안전한 계약에서 힘을 냅니다.':(w.types[0].k==='live'?'사는 순간 명의와 생활이 함께 정리되는 구조입니다.':(w.types[0].k==='cheong'?'공적 절차와 서류에서 이기는 구조입니다.':'돌아가는 현금을 다루는 감각이 있는 구조입니다.')))+'</p>'),{spread:true}));
  push(page('10 / DOCUMENT',secLabel('10','(6) 시기와 함정')+'<h1>언제,<br><span class="accent">무엇을 조심할까</span></h1>'+
    '<p class="lead">시기는 <b>인성(문서)·관성(명의)·재성(자금)</b>이 세운으로 들어오는 해와, <b>지지가 내 기둥과 합·충</b>을 이루는 해로 좁힙니다.</p>'+
    '<ul>'+(function(){ var L=w.years.slice(0,3); if(w.bestClean&&L.indexOf(w.bestClean)<0) L.push(w.bestClean); return L.map(function(y){
      return '<li><b>'+y.y+'년 '+y.gz+' · '+y.g+'</b> — '+(y.why.length?y.why.join(' · '):'특별한 자극 없음')+(w.bestClean&&y.y===w.bestClean.y?' → <b>첫 번째 창</b>':'')+'</li>';
    }).join(''); })()+'</ul>'+
    '<p>계약을 잡을 첫 번째 창은 <b>'+(w.bestClean?w.bestClean.y+'년 '+w.bestClean.gz:'기신·공망이 겹치지 않는 해가 없어 가장 점수가 높은 해')+'</b>입니다. 기신·공망이 겹치는 해는 계약이 되어도 이자·세금·보수에서 지출이 늘어납니다.</p>'+
    '<p>달까지 좁히면 '+w.goodMonths.map(function(m){ return '<b>'+m.y+'.'+n2(m.m)+' '+m.gz+'</b>'+(m.why.length?'('+m.why.join('·')+')':''); }).join(', ')+'입니다. 가계약·잔금·등기 접수 중 하나를 여기에 잡으세요.</p>'+
    '<p>피할 달은 '+w.badMonths.map(function(m){ return '<b>'+m.y+'.'+n2(m.m)+'</b>'; }).join(', ')+'입니다. '+(w.badMonths[0].why.length?w.badMonths[0].why.join('·')+'이라 그 달의 계약은 뒤에서 흔들립니다.':'')+'</p>',
    {spread:true}));
  /* v51 · 확인 목록과 실행 순서는 따로 한 장 — 한 지면에 몰아넣어 글씨를 줄이던 자리 */
  push(page('10 / DOCUMENT',secLabel('10','(7) 계약 전 확인 목록')+'<h1>계약 전<br><span class="accent">확인 목록</span></h1>'+
    '<p class="lead">서명하기 전에 이 목록을 소리 내어읽으세요. 이 사주에게 계약은 <b>기억</b>이 아니라 <b>종이</b>로 남겨야 하는 일입니다.</p>'+
    '<h3>계약·대출에서 조심할 것</h3><ul>'+w.traps.map(function(t){ return '<li>'+t+'</li>'; }).join('')+'</ul>'+
    '<h3>실행 순서</h3><ol><li>자금과 대출 한도를 먼저 숫자로 확정 — 상환액이 월 소득의 30%를 넘기지 않기</li><li>명의(단독·공동)와 등기 순서를 종이에 적기</li><li>잔금일·접수일·특약을 한 사람이 아닌 두 사람이 확인</li><li>이사와 계약을 같은 달에 몰지 않기</li></ol>'+
    callout('한 줄','<p>이 사주의 문서운은 <b>'+w.grade+'</b>입니다. '+(w.score>=60?'확인 목록만 지키면 자산이 남습니다.':'먼저 명의·등기·자금 순서를 정리하고 움직이세요.')+'</p>'),{spread:true}));
}

function careerWindow(R){
  var ds=daeunStarsOf(R,'관성');
  if(!ds.length) return '이 사주는 관성이 대운으로 뚜렷하게 들어오지 않아, 자리보다 결과로 평가받는 곳에서 빨리 인정받습니다. 직함을 기다리기보다 남길 수 있는 결과를 먼저 만드세요.';
  var cur=null;
  for(var i=0;i<ds.length;i++){ if(ds[i].to>=R.age){ cur=ds[i]; break; } }
  var h='관성이 대운으로 들어오는 10년에 조직에서의 평가가 달라집니다. 이 사주는 '+ds.map(function(d){return '<b>'+d.from+'~'+d.to+'세('+d.g+')</b>';}).join(', ')+'이 그 구간입니다. ';
  h+=cur?('그중 가장 가까운 문은 <b>'+cur.from+'~'+cur.to+'세</b>'+(cur.cur?' — 지금 지나는 중입니다. 이 10년 안에 직함·자격·계약 중 하나를 확보해두면 다음 대운에 그것이 자리가 됩니다.':'입니다. 그 전에 결과를 문서로 남겨두면 문이 열릴 때 바로 쓰입니다.')):'지금 이후로는 그 구간이 뚜렷하지 않아, 자격과 기록으로 실력을 대신 쌓는 편이 낫습니다.';
  return h;
}

function careerPages(){
  chapter('career','11','직업과 커리어','천직·직군·이직·조건');
  var R=B.R,c=B.c,cm=S.careerMap(R),d=S.deep(R);
  push(page('11 / CAREER',secLabel('11','CAREER · 직업')+'<h1>천직의<br><span class="accent">방향</span></h1>'+
    '<p class="lead">일은 두 번 고릅니다. 처음은 먹고살기 위해, 두 번째는 나답게 살기 위해. 이 장은 두 번째 선택을 위한 글입니다.</p>'+
    '<p>'+cm.why+'</p>'+
    '<table><tr><th>일간</th><th>결이 맞는 영역</th></tr><tr><td class="k">'+stemS(R.dStem)+'</td><td>'+cm.domain+'</td></tr></table>'+
    '<h3>이 사주에 맞는 직업 — 열 가지</h3><ul class="ul2">'+cm.roles.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'+
    '<p>이 중 하나를 그대로 하라는 뜻은 아닙니다. <b>일의 방식</b>이 비슷한 것들을 모아둔 것이니, 지금 하는 일과 가장 닮은 것을 표시해 보세요.</p>'+
    '<h3>두 번째 수입의 줄</h3><p>두 번째 기운은 <b>'+plainGrp(cm.secondGrp)+'</b>입니다 — '+cm.sub.join(' · ')+'. 이 사주는 수입이 한 줄로만 들어오면 금방 지칩니다. 작게라도 두 번째 줄을 만드는 편이 오래 갑니다.</p>'+
    '<h3>일하는 방식</h3><p>'+(S.WORK_MODE[c.topGrp]||'역할이 분명할 때 가장 오래 갑니다.')+'</p>'+
    '<h3>이 사주가 일에서 지치는 순간</h3><p>'+S.DM_DEEP[R.dStem].drain+' 이 감각이 2주 이상 이어지면 그것은 게으름이 아니라 <b>자리의 문제</b>입니다.</p>'+
    '<h3>인정받는 시기</h3><p>'+careerWindow(R)+'</p>',{spread:true}));
  var gy=[];
  for(var i=0;i<R.seun.length;i++){ var g=S.tenGod(R.dStem,R.seun[i].idx%10); if(S.GOD_GROUP[g]==='관성') gy.push(R.seun[i].year+'년('+g+')'); }
  push(page('11 / CAREER',secLabel('11','CAREER · 직업 (2)')+'<h1>옮길까,<br><span class="accent">남을까</span></h1>'+
    '<p class="lead">이 사주는 관성 '+c.grp['관성']+'개, 비겁 '+c.grp['비겁']+'개입니다. '+(c.grp['관성']>=3?'조직에서 자리를 올리는 방식이 맞습니다.':((c.grp['관성']===0&&c.grp['비겁']===0)?'조직과 독립 어느 쪽도 뿌리가 얇습니다. 그래서 직함보다 <b>결과로 평가받는 자리</b>에서 빨리 인정받습니다.':'조직과 독립이 반반이라, 소속은 있되 전문 영역은 내 것으로 가져야 합니다.'))+'</p>'+
    '<p>이직의 문은 <b>자리와 책임의 기운</b>이 그해로 들어오는 때 열립니다. '+(gy.length?('앞으로 5년 중 <b>'+gy.join(', ')+'</b>이 그 해입니다.'):'앞으로 5년에는 그 문이 뚜렷하지 않아, 지금은 준비의 시기입니다.')+'</p>'+
    '<h3>퇴사 판단 기준</h3><ol><li>생활비 6개월이 확보되었는가</li><li>그만두는 이유가 <b>사람</b>인가 <b>일</b>인가 — 사람 때문이라면 옮겨도 반복될 수 있습니다</li><li>다음 자리에서 내 '+S.GOD_KEY[c.topGodInGrp]+'이 쓰이는가</li></ol>'+
    '<h3>남기로 했다면</h3><p>6개월 안에 <b>하나</b>를 바꾸세요. 업무 범위, 보고 방식, 근무 시간 중 하나입니다. 아무것도 바뀌지 않으면 1년 뒤 같은 자리에서 같은 고민을 합니다.</p>'+
    callout('한 줄','<p>퇴사는 <b>감정</b>이 아니라 <b>숫자</b>로 결정하세요. 이 사주는 감정이 앞서면 6개월 계산을 건너뜁니다.</p>'),{spread:true}));
  push(page('11 / CAREER',secLabel('11','CAREER · 직업 (3)')+'<h1>일의<br><span class="accent">조건</span></h1>'+
    '<p class="lead">이 사주는 연봉만 보고 자리를 고르면 1년 안에 지칩니다. 시간과 관계가 맞아야 오래 갑니다.</p>'+
    '<table><tr><th>조건</th><th>이 사주에게</th></tr>'+
    '<tr><td class="k">시간</td><td>'+(c.grp['인성']>=3?'혼자 정리하는 시간이 보장되어야 합니다. 회의가 많은 자리는 소모가 큽니다.':'속도가 분명한 자리가 맞습니다. 마감이 흐릿한 조직에서는 에너지가 새어 나갑니다.')+'</td></tr>'+
    '<tr><td class="k">관계</td><td>'+(c.grp['관성']>=3?'위계가 분명한 곳에서 안정됩니다.':'수평적인 곳에서 힘이 납니다.')+'</td></tr>'+
    '<tr><td class="k">평가</td><td>결과보다 <b>과정의 기록</b>이 인정되는 곳</td></tr>'+
    '<tr><td class="k">역할</td><td>'+S.WORK_BY_GRP[c.topGrp]+'</td></tr></table>'+
    '<h3>협상의 순서</h3><ol><li>원하는 숫자를 먼저 말하기</li><li>근거는 시장가와 내가 만든 결과 두 가지로만</li><li>양보는 한 번만</li></ol>'+
    '<p>이 사주는 조건을 말할 때 감정이 섞입니다. 협상 전에 <b>세 줄</b>로 적어가세요. 적은 사람은 흔들리지 않습니다.</p>',{spread:true}));
  push(page('11 / CAREER',secLabel('11','CAREER · 직업 (4)')+'<h1>5년의<br><span class="accent">자리</span></h1>'+
    '<table><tr><th>해</th><th>간지</th><th>십성</th><th>일의 결</th></tr>'+
    (function(){var h='';for(var i=0;i<R.seun.length;i++){var sn=R.seun[i],g=S.tenGod(R.dStem,sn.idx%10);h+='<tr><td class="k">'+sn.year+'</td><td>'+gzP(sn.idx%10,sn.idx%12)+'</td><td>'+g+'</td><td style="font-size:12px">'+S.SEUN_DEEP[g]+'</td></tr>';}return h;})()+'</table>'+
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
    '<p class="lead">좋아하는 마음에도 모양이 있습니다. 어떤 사람은 먼저 다가가고, 어떤 사람은 상대가 다가올 때까지 기다립니다. 이 사주는 어느 쪽인지 봅니다.</p>'+
    '<p>이 사주는 좋아할 때 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>의 방식으로 다가갑니다. '+S.loveSignal(R,c)+'</p>'+
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
function relWordsR(rr){ return rr.join(', '); }
function C_marry(){ return (B.input.ctx&&B.input.ctx.marry)==='married'; }
function REL_MEAN_BOOK(rr){
  var s=rr.join(' ');
  if(s.indexOf('충')>=0) return '충이 있어 이 자리의 일은 <b>한 번에 정해지지 않고</b> 흔들리며 진행됩니다.';
  if(s.indexOf('형')>=0||s.indexOf('파')>=0) return '형·파가 있어 서류와 일정이 꼬이기 쉽습니다.';
  if(s.indexOf('육합')>=0||s.indexOf('삼합')>=0) return '합이 있어 사람을 거치면 일이 풀립니다.';
  return '서로 부딪히지 않는 자리입니다.';
}

/* ---------------- 시기 계산 : 자녀성(임신의 문)을 실제 연·월로 ---------------- */
function pregWindow(R,c){
  var female=(B.input.gender!=='m');
  var grp=female?'식상':'관성';
  var ys=seunStarsOf(R,grp,6), ms=monthStarsOf(R,grp,14), ds=daeunStarsOf(R,grp);
  var cur=R.daeun[R.curDaeun], curG=S.tenGod(R.dStem,cur.idx%10), curGrp=S.GOD_GROUP[curG];
  var cy=new Date().getFullYear(), nextY=null;
  for(var i=0;i<ys.length;i++){ if(ys[i].y>cy){ nextY=ys[i]; break; } }
  var h='<h3>시기의 문</h3>';
  h+='<p>아이를 부르는 별은 <b>'+grp+'</b>입니다. '+(female?'여성 사주에서 자녀성인 식상은 내 몸에서 만들어 밖으로 내보내는 기운이라, 이 별이 세운에 서는 해에 임신과 출산의 리듬이 가장 자연스러워집니다.':'남성 사주에서 자녀성인 관성은 내가 맡아 책임지는 기운이라, 이 별이 세운에 서는 해에 아이를 맞을 자리가 정돈됩니다.')+'</p>';
  if(ys.length){
    h+='<p>이 원국에서 '+grp+'이 세운으로 다시 서는 해는 '+ys.slice(0,3).map(seunTxt).join(', ')+'입니다. '+
      (nextY?('그중 <b>'+nextY.y+'년</b>이 실제로 준비를 맞춰볼 수 있는 문입니다.'):('앞으로 6년 중에서는 <b>'+ys[ys.length-1].y+'년</b>이 문이 열리는 때입니다.'))+
      ' 지금 대운은 <b>'+cur.from+'~'+cur.to+'세 · '+curG+'</b>이라 '+(curGrp===grp?'이 10년이 이미 자녀성을 데리고 있습니다. 그래서 세운이 그 문을 두드리는 해가 더 또렷하게 느껴집니다.':'아이의 일이 생활의 중심으로 올라오기까지 한 박자 걸립니다. 그래서 '+(nextY?(nextY.y+'년을 기준으로'):'다음 대운을 기준으로')+' 6개월 전부터 몸을 세워두는 쪽이 효율적입니다.')+'</p>';
  } else {
    h+='<p>앞으로 6년(2026~2031)에는 '+grp+'이 세운으로 직접 서지 않습니다. 이럴 때는 대운이 문을 엽니다. '+
      (ds.length?('이 사주에서 '+grp+'이 걸린 대운은 '+ds.map(function(d){return '<b>'+d.from+'~'+d.to+'세('+d.g+')</b>';}).join(', ')+'이고, 지금은 '+cur.from+'~'+cur.to+'세 · '+curG+'입니다.'):'이 사주는 '+grp+'이 대운에도 뚜렷하게 걸리지 않아, 몸과 생활의 리듬으로 시기를 만드는 편이 맞습니다.')+'</p>';
  }
  if(ms.length){
    h+='<p>달까지 좁히면 '+ms.slice(0,4).map(monthTxt).join(', ')+'입니다. '+
      (ms.some(function(o){return o.tag==='합';})?'일지와 합이 걸리는 달은 배우자궁의 문도 함께 열리는 때라, 부부의 일정을 비워두기 좋습니다.':'자녀성이 걸린 달은 몸이 밖으로 향하는 때라, 검사와 상담을 이 달에 맞춰 잡아두면 좋습니다.')+
      ' 검사와 상담은 '+(nextY?(nextY.y+'년 문을 기준으로'):'문이 열리는 해를 기준으로')+' 6개월 전에 마치고, 그 3개월은 일정을 20% 비워두세요. 이 사주는 몸보다 <b>일정</b>에서 먼저 지치기 때문입니다.</p>';
  }
  return h;
}

/* ---------------- 9장 가족·자녀 ---------------- */
function familyPages(){
  chapter('family','13','가족과 자녀','자녀성·관계·10년');
  var R=B.R,c=B.c;
  var hasKid=(B.input.ctx&&B.input.ctx.kid)==='have';
  var cc=null; try{ cc=S.childChart(B.input); }catch(e){}
  push(page('13 / FAMILY',secLabel('13','FAMILY · 가족')+'<h1>가족 안에서의<br><span class="accent">자리</span></h1>'+
    '<p class="lead">가족은 고르지 못하는 관계입니다. 그래서 오히려 더 정확하게 읽어야 합니다. 이 장은 아이와 부모 사이의 자리를 다룹니다.</p>'+
    '<p>'+(hasKid?'이미 아이가 있는 사주입니다. 아이와의 관계, 부모로서의 결을 다룹니다.':'앞으로 맞이할 가족의 결을 미리 보는 내용입니다.')+'</p>'+
    '<h3>자녀성</h3><p>이 사주의 자녀성은 '+elK(S.mod(R.dayEl+1,5))+'입니다. '+S.CHILD_NATURE_EL[S.mod(R.dayEl+1,5)]+'</p>'+
    (cc?'<h3>아이의 결</h3><p>아이의 사주는 '+gzP(cc.R.dStem,cc.R.dBranch)+'일주입니다. '+S.CHILD_NATURE_EL[cc.R.dayEl]+'</p>':'')+
    '<h3>가족 안에서 이 사주가 맡는 것</h3><p>이 사주는 가족 안에서 <b>'+c.topGrp+'</b>의 자리를 맡기 쉽습니다. '+S.GROUP_MEAN[c.topGrp]+' '+S.STRENGTH_TXT[R.strength].adv+'</p>'+
    '<h3>가족과의 거리</h3><p>이 사주는 가까운 사람에게 다정하지만 문을 여는 데 시간이 걸립니다. '+S.BR_INNER[R.dBranch]+'</p>',{spread:true}));
  // 임신·자녀 (context)
  var preg=(B.input.ctx&&B.input.ctx.kid)==='plan'||(B.input.ctx&&B.input.ctx.kid)==='none';
  if(preg){
    var x={w:R.count[4],f:R.count[1]};
    push(page('13 / FAMILY',secLabel('13','PREGNANCY · 임신 준비')+'<h1>아이를 맞는<br><span class="accent">때와 몸</span></h1>'+
      '<p class="lead">이 사주는 화(火) '+x.f+' · 수(水) '+x.w+'의 구조입니다. '+(x.f>=x.w+2?'열이 먼저 오르는 사주라 <b>몸을 식히는 시간</b>이 중요합니다.':(x.w>=x.f+2?'물이 강해 몸이 차기 쉬운 사주라 <b>몸을 데우는 시간</b>이 중요합니다.':'물과 불이 고른 편이라 계절에 따라 흔들립니다.'))+'</p>'+
      '<ul><li>잠드는 시간을 먼저 고정하기 — 이 사주는 수면이 흐트러지면 열이 먼저 오릅니다</li><li>'+S.EL_DEEP[c.yongEl].food+' 쪽으로 식사 한 끼 바꾸기</li><li>'+S.EL_DEEP[c.yongEl].habit+'</li></ul>'+
      pregWindow(R,c)+
      '<h3>명리와 의학의 경계</h3><p>사주는 몸의 리듬과 시기를 보여줄 뿐 임신 가능성이나 건강을 진단하지 않습니다. 실제 계획은 산부인과 상담과 검사 결과를 먼저 두세요.</p>'+
      callout('준비의 순서','<p>잠 → 식사 → 움직임 → 마음. 이 순서를 바꾸면 같은 노력이 두 배로 남습니다. 특히 이 사주는 <b>혼자 다 감당하려는 습관</b>이 있어, 한 가지는 반드시 배우자에게 맡기세요.</p>'),{spread:true}));
  } else {
    push(page('13 / FAMILY',secLabel('13','CHILD · 자녀와의 관계')+'<h1>아이와의<br><span class="accent">거리</span></h1>'+
      '<p class="lead">'+(cc?'아이의 일주는 '+gzP(cc.R.dStem,cc.R.dBranch)+'입니다. ':'')+'이 사주는 아이에게 <b>'+S.EL_PERSON[R.dayEl]+'</b> 같은 인상을 줍니다.</p>'+
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
    '<p class="lead">몸은 거짓말을 하지 않습니다. 다만 늘 조용히 말하다가, 어느 날 크게 말합니다. 이 장은 그 조용한 신호를 먼저 읽는 법입니다.</p>'+
    '<p>이 사주의 중심 글자는 '+stemS(R.dStem)+'이고, 가장 적은 기운은 '+elK(c.leastI)+'입니다. '+S.EL_DEEP[c.leastI].under+'</p>'+
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
    /* 인쇄·PDF 지면과 같은 여백으로 재어야 폰 미리보기 여백(20px 18px) 때문에 글씨를 과하게 키우지 않는다 */
    p.style.padding='14mm 14.5mm 11mm';
    p.style.removeProperty('--fs');
    var bd=p.querySelector('.pg-bd');
    /* scrollHeight는 flex 안에서 늘어난 높이를 반영하지 못하므로, 마지막 자식의 아래끝으로 넘침을 잰다 */
    var over=function(){
      if(!bd) return 0;
      var br=bd.getBoundingClientRect(), bottom=0;
      for(var q=0;q<bd.children.length;q++){
        var r=bd.children[q].getBoundingClientRect();
        if(r.height>0 && r.bottom>bottom) bottom=r.bottom;
      }
      return bottom-br.bottom;
    };
    var fs=15.5, guard=0;
    /* v51 · 지면마다 글씨를 키웠다 줄였다 하던 계산을 걷어냈다.
       키우는 단계(17.4px까지)가 있어서 같은 책 안에서 어떤 장은 크고 어떤 장은 작아 보였다.
       이제 본문은 어디서나 15.5px로 같다. 넘치는 지면은 ① 문단·표 여백을 먼저 좁히고(.tight)
       ② 그래도 넘칠 때만 조금씩 줄인다(최대 13.2px). */
    if(bd && over()>1){
      p.classList.add('tight');
      while(over()>1 && fs>15.4 && guard<10){ fs-=0.25; guard++; p.style.setProperty('--fs',fs.toFixed(2)+'px'); }
      guard=0;
      while(over()>1 && fs>13.5 && guard<40){
        fs-=0.25; guard++;
        p.style.setProperty('--fs',fs.toFixed(2)+'px');
      }
    }
    /* 남는 여백이 지면의 1/4 이하일 때만 문단 사이에 나눠 채운다.
       목차처럼 여백이 크게 남는 지면은 위에서부터 쌓아 사이가 벌어지지 않게 한다. */
    if(bd){
      var kids=[].slice.call(bd.children).filter(function(k){ return k.offsetHeight>0; });
      var last=kids[kids.length-1], used=0;
      for(var ci=0;ci<kids.length;ci++){
        var cs=window.getComputedStyle(kids[ci]);
        used+=kids[ci].offsetHeight+(parseFloat(cs.marginTop)||0)+(parseFloat(cs.marginBottom)||0);
      }
      var slack=bd.clientHeight-used, gaps=Math.max(1,kids.length-1), per=slack/gaps;
      /* 남는 여백을 나눠도 문단 사이가 24px을 넘지 않을 때만 고르게 채운다.
         목차처럼 여백이 크게 남는 지면은 위에서부터 쌓아 사이가 벌어지지 않게 한다. */
      bd.classList.toggle('fill', !!last && slack>0 && per<=24);
    }
    /* 본문이 아무리 줄여도 한 장을 넘으면 잘라내지 않고 클립 영역을 푼다 */
    if(bd && bd.scrollHeight>bd.clientHeight+1) bd.style.overflow='visible';
    else if(bd) bd.style.removeProperty('overflow');
    p.style.removeProperty('width');p.style.removeProperty('height');
    p.style.removeProperty('max-height');p.style.removeProperty('min-height');p.style.removeProperty('padding');
  }
}

/* ---------------- build ---------------- */
B.build=function(R,input,name){
  B.pages=[];B.chapters=[];B.R=R;B.c=S.chartCtx(R);B.input=input;B.name=name||'고객';
  B.pages.push(coverPage());
  introPage();
  var tocStart=B.pages.length;
  B.pages.push('__TOC1__');B.pages.push('__TOC2__');
  summaryPage();chartPage();relationPage();elPage();godPage();salsPage();strengthPage();
  pillarPages();pillarRepeatPage();personalityPages();relationPages();moneyPages();docuPages();careerPages();lovePages();familyPages();healthPages();
  if(window.BOOKM&&window.BOOKM.sections) window.BOOKM.sections();
  var html=B.pages.join('');
  var total=B.pages.length;
  html=html.replace('__TOT__',String(total));
  /* 목차 — 줄을 누르면 그 장으로 이동(웹·모달 미리보기). 인쇄 지면에는 영향 없음 */
  var rows=B.chapters.map(function(ch){
    return '<div class="toc-r" data-goto="'+ch.page+'" role="link" tabindex="0"><span class="n">'+ch.no+'</span><span class="t">'+ch.title+'</span><span class="d"></span><span class="p">'+n2(ch.page)+'</span></div>';
  });
  var half=tocHalf(rows);
  var t1=page('CONTENTS 01','<div class="sec-label"><span>00</span>목차 · CONTENTS</div>'+tocIntro()+'<div class="toc-list">'+rows.slice(0,half).join('')+'</div>',{spread:true});
  var t2=page('CONTENTS 02','<div class="sec-label"><span>00</span>목차 · CONTENTS</div><h2 class="toc-more">목차 이어서</h2><div class="toc-list">'+rows.slice(half).join('')+'</div>',{spread:true});
  html=html.replace('__TOC1__',t1).replace('__TOC2__',t2);
  /* 각 지면에 목차 이동용 앵커 id 부여 (순서 = B.pages 순서) */
  var pi=0;
  html=html.replace(/<section class="pg/g,function(m){ pi++; return '<section id="book-p'+pi+'" class="pg'; });
  /* 쪽번호 — 표지 다음부터 순서대로 */
  var pn=1;
  html=html.replace(/<span class="pn">[^<]*<\/span>/g,function(){ pn++; return '<span class="pn">'+n2(pn)+' / '+total+'</span>'; });
  if(S.fixPost) html=S.fixPost(html);
  /* 이름이 비어 '고객'·'당신'으로 부르는 경우 ' 님'이 겹치지 않게 */
  html=html.replace(/(<b[^>]*>)?(고객|당신)(<\/b>)?\s*님/g,function(m,a,nm,b){ return (a||'')+nm+(b||''); });
  return {html:html,pages:total};
};
B.fit=fitPages;
})();
