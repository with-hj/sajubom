/* =====================================================================
   사주봄 — 콘텐츠 코어 : 공통 조각 + 5대 테마 · 16개 세부 탭 정의
   탭별 챕터 본문은 content-*.js 에서 CTP[테마]로 채웁니다.
   ===================================================================== */
(function(){
'use strict';
var S=window.SJ;
window.CTP=window.CTP||{};

function P(t){return '<p>'+t+'</p>';}
function H(t){return '<h4>'+t+'</h4>';}
function UL(a){return '<ul>'+a.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>';}
function K(a,b){return '<div class="ch-key"><b>'+a+'</b><span>'+b+'</span></div>';}
function elB(i){return '<b style="color:'+S.EL_COLOR[i]+'">'+S.EL_KO[i]+'('+S.EL_HAN[i]+')</b>';}
function stemB(s){return '<b>'+S.STEM_KO[s]+'('+S.STEM_HAN[s]+')</b>';}
function brB(b){return '<b>'+S.BR_KO[b]+'('+S.BR_HAN[b]+')</b>';}
/* 조사까지 맞춘 글자 표기 — 자(子)가 · 축(丑)이 */
function bj(b,p){return '<b>'+S.BR_KO[b]+'('+S.BR_HAN[b]+')</b>'+S.josaP(S.BR_KO[b],p);}
function sj(s,p){return '<b>'+S.STEM_KO[s]+'('+S.STEM_HAN[s]+')</b>'+S.josaP(S.STEM_KO[s],p);}
function bp(b){return '<b>'+S.BR_KO[b]+'('+S.BR_HAN[b]+')</b>';}
function sp(s){return '<b>'+S.STEM_KO[s]+'('+S.STEM_HAN[s]+')</b>';}
function n2(n){return n<10?'0'+n:''+n;}
/* 60갑자 한 벌을 읽기 쉬운 한글(한자)로 — 정미(丁未) */
function gz(ix){var s=ix%10,b=ix%12;return S.STEM_KO[s]+S.BR_KO[b]+'('+S.STEM_HAN[s]+S.BR_HAN[b]+')';}
function gzP(st,br){var s=st%10,b=br%12;return S.STEM_KO[s]+S.BR_KO[b]+'('+S.STEM_HAN[s]+S.BR_HAN[b]+')';}
function gzS(ix){var s=ix%10,b=ix%12;return '<b>'+S.STEM_KO[s]+S.BR_KO[b]+'</b> <span style="font-size:11.5px;color:#7d7364">'+S.STEM_HAN[s]+S.BR_HAN[b]+'</span>';}
function ctx(input){return (input&&input.ctx)||{};}
function marryOf(input){return ctx(input).marry||'unknown';}
function kidOf(input){return ctx(input).kid||'unknown';}
function noKids(input){var k=kidOf(input);return k==='none'||k==='plan'||k==='unknown';}
function singleOf(input){return marryOf(input)==='single';}

/* ---------- 원국 표 ---------- */
function pillars(R){
  var cols=[['년주',R.yIdx],['월주',R.mIdx],['일주',R.dIdx],['시주',R.hIdxP]];
  var h='<table class="tbl"><tr><th></th>';
  for(var i=0;i<4;i++) h+='<th style="text-align:center">'+cols[i][0]+'</th>';
  h+='</tr><tr><th>천간</th>';
  for(var j=0;j<4;j++){ var ix=cols[j][1];
    h+='<td style="text-align:center">'+(ix==null?'<span style="color:#a99">—</span>':'<b style="color:'+S.EL_COLOR[S.STEM_EL[ix%10]]+';font-size:17px">'+S.STEM_HAN[ix%10]+'</b> <span style="font-size:12px;color:#7d7364">'+S.STEM_KO[ix%10]+'</span>')+'</td>';
  }
  h+='</tr><tr><th>지지</th>';
  for(var k=0;k<4;k++){ var iy=cols[k][1];
    h+='<td style="text-align:center">'+(iy==null?'<span style="color:#a99">—</span>':'<b style="color:'+S.EL_COLOR[S.BR_EL[iy%12]]+';font-size:17px">'+S.BR_HAN[iy%12]+'</b> <span style="font-size:12px;color:#7d7364">'+S.BR_KO[iy%12]+'</span>')+'</td>';
  }
  h+='</tr><tr><th>십성</th>';
  for(var m=0;m<4;m++){ var iz=cols[m][1];
    h+='<td style="text-align:center;font-size:12.5px;color:#4a4238">'+(iz==null?'—':(m===2?'<b>일간</b>':S.tenGod(R.dStem,iz%10)))+'</td>';
  }
  return h+'</tr></table>';
}
function elMeter(R){
  var h='<div class="elbar">';
  for(var i=0;i<5;i++) h+='<i style="width:'+Math.max(1.5,R.pct[i])+'%;background:'+S.EL_COLOR[i]+'"></i>';
  h+='</div><div class="el5">';
  for(var j=0;j<5;j++) h+='<span><i style="background:'+S.EL_COLOR[j]+'"></i>'+S.EL_KO[j]+' '+R.pct[j].toFixed(1)+'%</span>';
  return h+'</div>';
}
function godTable(c){
  var order=['비겁','식상','재성','관성','인성'];
  var role={'비겁':'나·동료·자존심','식상':'재능·표현·결과물','재성':'돈·현실·성과','관성':'자리·규칙·책임','인성':'배움·휴식·보호'};
  var h='<table class="tbl"><tr><th>묶음</th><th>개수</th><th>담당</th></tr>';
  for(var i=0;i<5;i++){ var k=order[i];
    h+='<tr><td><b>'+k+'</b></td><td>'+c.grp[k]+'</td><td style="font-size:13px;color:#5a5145">'+role[k]+'</td></tr>';
  }
  return h+'</table>';
}
function seunTable(R,c,n){
  var h='<table class="tbl"><tr><th>해</th><th>간지</th><th>십성</th><th>이 해의 결</th></tr>';
  for(var i=0;i<R.seun.length&&i<(n||5);i++){
    var sn=R.seun[i], s=sn.idx%10,b=sn.idx%12,g=S.tenGod(R.dStem,s);
    var diff=S.mod(b-R.dBranch,12);
    var tag=(diff===6?'충':(diff===0?'동일':((diff===4||diff===8)?'합':'무난')));
    h+='<tr><td><b>'+sn.year+'</b></td><td>'+gz(sn.idx)+'</td><td>'+g+' <span style="font-size:11px;color:#8a7f6d">'+tag+'</span></td><td style="font-size:13px;line-height:1.7">'+(S.SEUN_DEEP[g]||'')+'</td></tr>';
  }
  return h+'</table>';
}
function monthsBlock(R,c,kind,n,intro){ return S.monthFlow(R,c,kind,n||12,intro); }
function daeunTable(R,c){
  var h='<table class="tbl"><tr><th>나이</th><th>간지</th><th>십성</th><th>10년의 결</th></tr>';
  for(var i=0;i<R.daeun.length;i++){
    var d=R.daeun[i], g=S.tenGod(R.dStem,d.idx%10), cur=(i===R.curDaeun);
    h+='<tr'+(cur?' style="background:#f3ecdd"':'')+'><td><b>'+d.from+'~'+d.to+'</b>'+(cur?' <span style="font-size:10.5px;color:#c94228">지금</span>':'')+'</td><td>'+gz(d.idx)+'</td><td>'+g+'</td><td style="font-size:12.5px;line-height:1.65;color:#5a5145">'+(S.GOD_DAEUN[g]||'')+'</td></tr>';
  }
  return h+'</table>';
}
function gaewunBlock(R,c){
  var d=S.EL_DEEP[c.yongEl];
  return '<table class="tbl"><tr><th>항목</th><th>처방</th></tr>'+
   '<tr><td>색</td><td>'+d.color+'</td></tr><tr><td>방위</td><td>'+d.dir+'</td></tr>'+
   '<tr><td>계절</td><td>'+d.season+'</td></tr><tr><td>공간</td><td>'+d.space+'</td></tr>'+
   '<tr><td>생활</td><td>'+d.habit+'</td></tr><tr><td>음식</td><td>'+d.food+' · '+d.taste+'</td></tr>'+
   '<tr><td>소품</td><td>'+d.item+'</td></tr></table>';
}
function riskyMonths(R,c,n){
  var out=[], now=new Date(), y=now.getFullYear(), m=now.getMonth()+1;
  for(var i=0;i<(n||12);i++){
    var mp=S.monthPillarOf(y,m), rel=S.branchRel(R.dBranch,mp.branch), tag=S.monthTag(rel);
    if(tag==='충'||tag==='원진') out.push({y:y,m:m,tag:tag});
    m++; if(m>12){m=1;y++;}
  }
  return out;
}
function riskyMonthsText(R,c,n){
  var list=riskyMonths(R,c,n||12);
  if(!list.length) return '앞으로 '+(n||12)+'개월 안에는 일지와 정면으로 부딪히는 달이 없습니다. 큰 변동보다 쌓는 흐름으로 보시면 됩니다.';
  return list.map(function(o){return o.y+'.'+n2(o.m)+'('+o.tag+')';}).join(', ')+' — 이 달들은 결정을 미루고 몸을 먼저 챙기세요.';
}
function elCount(R,i){ return R.count[i]; }
function yearOfStar(R,grp){
  var out=[];
  for(var i=0;i<R.seun.length;i++){
    var g=S.tenGod(R.dStem,R.seun[i].idx%10);
    if(S.GOD_GROUP[g]===grp) out.push({y:R.seun[i].year,g:g});
  }
  return out;
}
function partnerChart(input){ return S.partnerChart(input); }

/* ---------------- 정밀 진단 블록 (전 테마 공용) ---------------- */
function pillarDetail(R){
  var d=S.deep(R), h='<table class="tbl"><tr><th>기둥</th><th>천간</th><th>지지</th><th>십이운성</th><th>지장간</th></tr>';
  d.pillars.forEach(function(p){
    if(p.ix==null){ h+='<tr><td><b>'+p.pos+'</b></td><td colspan="4" style="color:#8a7f6d">시간 미상</td></tr>'; return; }
    h+='<tr><td><b>'+p.pos+'</b><br><span style="font-size:11px;color:#8a7f6d">'+p.range.split(' ·')[0]+'</span></td>'+
      '<td style="text-align:center"><b>'+S.STEM_KO[p.stem]+'</b><span style="font-size:10.5px;color:#8a7f6d">('+S.STEM_HAN[p.stem]+')</span><br><span style="font-size:11.5px;color:#5a5145">'+(p.key==='day'?'일간':p.sGod)+'</span></td>'+
      '<td style="text-align:center"><b>'+S.BR_KO[p.branch]+'</b><span style="font-size:10.5px;color:#8a7f6d">('+S.BR_HAN[p.branch]+')</span><br><span style="font-size:11.5px;color:#5a5145">'+p.bGod+'</span></td>'+
      '<td style="text-align:center;font-size:12.5px">'+p.stage+'</td>'+
      '<td style="font-size:11.5px;line-height:1.6">'+p.hidden.map(function(x){return S.STEM_KO[x.stem]+'('+x.god+')';}).join(' · ')+'</td></tr>';
  });
  return h+'</table>';
}
/* 결과지 맨 위의 근거 상자 — 사주 용어 없이, 이 풀이가 무엇을 보고 쓴 글인지만 적는다 */
var REL_WORD2={'육합':'어울림','삼합':'큰 어울림','방합':'한쪽으로 모임','충':'부딪힘','형':'얽힘','파':'끊김','해':'어긋남','원진':'서운함','동일':'같은 글자','무난':'무난함'};
function facts(R){
  var d=S.deep(R), c=d.c;
  var rel=d.branchRels.length?d.branchRels.map(function(r){return (REL_WORD2[r.type]||r.type)+'('+r.a+'·'+r.b+')';}).join(' · '):'없음';
  var sal=d.sals.length?d.sals.map(function(s){return s.name+'('+s.pos+')';}).join(' · '):'없음';
  var gm=d.gmHits.length?d.gmHits.map(function(x){return x.pos;}).join('·')+' 자리가 비어 있음':'비어 있는 자리 없음';
  return '<div class="ch-key" style="margin:2px 0 12px"><b>이 풀이가 본 것</b><span>'+
    gzP(R.dStem,R.dBranch)+'일주 · 기운은 '+(R.strength==='강'?'강한 편':(R.strength==='약'?'약한 편':'고른 편'))+
    ' · 채우면 좋은 기운 '+S.EL_KO[d.yong]+' · 조심할 기운 '+S.EL_KO[d.gisin]+'<br>기둥 사이 '+rel+' · '+gm+' · 타고난 표시 '+sal+'</span></div>';
}
function luckYears(R,n){
  var out=[];
  for(var i=0;i<Math.min(n||3,R.seun.length);i++){
    var r=S.yearRead(R,R.seun[i].year);
    out.push({y:r.y,gz:r.gz,g:r.g,tone:r.tone,why:r.why,short:r.short});
  }
  return out;
}
function luckMonths(R,n){
  var out=[], now=new Date(), y=now.getFullYear(), m=now.getMonth()+1;
  for(var i=0;i<(n||12);i++){
    var r=S.monthRead(R,y,m);
    out.push({y:y,m:m,gz:r.gz,g:r.g,tone:r.tone,rels:r.rels,score:r.score});
    m++; if(m>12){m=1;y++;}
  }
  return out;
}

/* helpers를 다른 파일에서도 쓰도록 노출 */
window.CH={P:P,H:H,UL:UL,K:K,elB:elB,stemB:stemB,brB:brB,bj:bj,sj:sj,bp:bp,sp:sp,n2:n2,ctx:ctx,marryOf:marryOf,
  kidOf:kidOf,noKids:noKids,singleOf:singleOf,pillars:pillars,elMeter:elMeter,godTable:godTable,
  seunTable:seunTable,monthsBlock:monthsBlock,daeunTable:daeunTable,gaewunBlock:gaewunBlock,
  riskyMonths:riskyMonths,riskyMonthsText:riskyMonthsText,elCount:elCount,yearOfStar:yearOfStar,
  partnerChart:partnerChart,pillarDetail:pillarDetail,facts:facts,luckYears:luckYears,luckMonths:luckMonths,gz:gz,gzP:gzP,gzS:gzS,S:S};

/* =====================================================================
   5대 테마 · 세부 탭
   ===================================================================== */
var THEMES={
  general:{name:'종합운세',short:'종합운세',img:'general',tagline:'한 해의 흐름부터 타고난 그릇까지, 큰 그림을 먼저',
    tabs:['newyear','life']},
  /* v50 · 카드 제목을 줄인다 — 연애·재회 / 결혼·이혼 */
  love:{name:'연애 · 재회',short:'연애·재회',img:'love',tagline:'마음이 오가는 속도를 여덟 글자로 읽어요',
    tabs:['sseom','love','reunion'],ctx:'partner'},
  marriage:{name:'결혼 · 이혼',short:'결혼·이혼',img:'marriage',tagline:'함께 앉을 사람인지, 언제 앉을 시기인지',
    tabs:['couple','wedding','divorce'],ctx:'partner'},
  baby:{name:'임신 · 자녀',short:'임신·자녀',img:'baby',tagline:'아이를 맞는 때와 그 아이의 결을',
    tabs:['birth','child','parent'],ctx:'baby',
    warn:'사주 명리 기반의 참고 해석이며 의학적 진단이 아닙니다.'},
  wealth:{name:'재물 · 직업',short:'재물·직업',img:'wealth',tagline:'돈이 들어오는 문과 일이 맞는 자리',
    tabs:['money','job','startup','estate'],ctx:'work'}
};

var TABS={
  newyear:{theme:'general',name:'신년운세',tag:'2027 정미년, 어디로 문이 열리는지',
    note:'2027년 정미년 한 해의 흐름을 먼저 짚어요.',
    video:'./assets/videos/newyear.mp4?v=72',poster:'./assets/videos/newyear-poster.jpg?v=72',
    intro:{badge:'2027 정미년 신년운세',hook:'2027년 정미년,<br>어느 달에 문이 열리고<br><b>무엇을 피해야 할지</b> 보고 가세요',cta:'내 신년운세 · 사주 정보 입력하기'}},   /* v46 · 탭별 인트로 영상 (있으면 입력창 앞에 9:16 카드로 재생) */
  /* v50 · 영상 인트로를 6개 탭으로 넓힌다. intro 는 카드 문구, poster 는 영상 첫 프레임 대체 이미지 */
  life:{theme:'general',name:'평생사주',tag:'타고난 그릇과 평생의 결',
    note:'평생 따라다니는 바탕을 읽어요.',
    video:'./assets/videos/life.mp4?v=72',poster:'./assets/videos/life-poster.jpg?v=72',
    intro:{badge:'평생사주',hook:'타고난 그릇과<br>판이 바뀌는 10년,<br><b>언제인지</b> 보고 가세요',cta:'내 평생사주 · 사주 정보 입력하기'}},
  daeunflow:{theme:'general',name:'대운 흐름',tag:'10년마다 바뀌는 판의 방향',
    note:'지금과 다음 대운의 전환점을 봐요.',
    video:'./assets/videos/daeun.mp4?v=72',poster:'./assets/videos/daeun-poster.jpg?v=72',
    intro:{badge:'대운 흐름',hook:'10년마다 바뀌는<br>판의 방향을 먼저<br>보고 가세요',cta:'내 대운 흐름 · 사주 정보 입력하기'}},

  sseom:{theme:'love',name:'썸 속마음',tag:'그 사람이 나를 어떻게 보고 있는지',sub:'그 사람이 나와 잘 될지',
    note:'두 사람의 마음 온도를 함께 봐요.',
    video:'./assets/videos/crush.mp4?v=72',poster:'./assets/videos/crush-poster.jpg?v=72',
    intro:{badge:'썸 속마음',hook:'그 사람 마음의 온도,<br>먼저 연락할 시기,<br><b>선을 넘어도 되는지</b>까지',cta:'그 사람 속마음 · 사주 정보 입력하기'}},
  love:{theme:'love',name:'연애운',tag:'언제, 어떤 사람을 만나게 되는지',sub:'나는 언제 어떤 사람을 만나게 되는지',
    note:'만남이 열리는 때와 사람의 결을 봐요.',
    video:'./assets/videos/love.mp4?v=72',poster:'./assets/videos/love-poster.jpg?v=72',
    intro:{badge:'연애운',hook:'나는 언제, 어떤 사람을<br>만나게 되는지<br>시기까지 보고 가세요',cta:'내 연애운 · 사주 정보 입력하기'}},
  reunion:{theme:'love',name:'재회운',tag:'끊어진 관계가 다시 이어질 수 있는지',sub:'끊어진 우리 관계 다시 이어질 수 있는지',
    note:'다시 이어질 수 있는지 시기까지 봐요.',
    video:'./assets/videos/reunion.mp4?v=72',poster:'./assets/videos/reunion-poster.jpg?v=72',
    intro:{badge:'재회운',hook:'끊어진 우리 관계,<br>다시 이어질 수 있는지<br>연락의 문을 보고 가세요',cta:'재회운 · 사주 정보 입력하기'}},
  pattern:{theme:'love',name:'내 연애 패턴',tag:'왜 같은 사람에게 반복해서 끌리는지',
    note:'끌림과 이별의 이유를 여덟 글자에서 찾아요.'},

  couple:{theme:'marriage',name:'커플궁합',tag:'두 사람의 사주가 만나는 자리',sub:'두 사람의 사주가 만나는 자리',
    note:'두 사람의 궁합을 여덟 글자로 봐요.',
    video:'./assets/videos/couple.mp4?v=72',poster:'./assets/videos/couple-poster.jpg?v=72',
    intro:{badge:'커플궁합',hook:'두 사람의 사주가<br>어디서 만나고<br><b>어디서 부딪히는지</b>',cta:'우리 궁합 · 사주 정보 입력하기'}},
  wedding:{theme:'marriage',name:'결혼운',tag:'언제, 어떤 사람과 결혼하게 되는지',sub:'언제, 어떤 사람과 결혼하게 되는지',
    note:'결혼의 문이 열리는 때를 봐요.',
    video:'./assets/videos/marriage.mp4?v=72',poster:'./assets/videos/marriage-poster.jpg?v=72',
    intro:{badge:'결혼운',hook:'언제, 어떤 사람과<br>결혼하게 되는지<br><b>시기까지</b> 보고 가세요',cta:'내 결혼운 · 사주 정보 입력하기'}},
  divorce:{theme:'marriage',name:'이혼 위기',tag:'갈등이 커지는 시기와 결정 기준',sub:'흔들리는 시기와 결정 기준을 짚어드려요',
    note:'흔들리는 시기와 결정 기준을 봐요.',
    video:'./assets/videos/divorce.mp4?v=72',poster:'./assets/videos/divorce-poster.jpg?v=72',
    intro:{badge:'이혼 위기',hook:'흔들리는 시기와<br>결정의 기준,<br><b>버틸 수 있는 선</b>까지',cta:'지금의 위기 · 사주 정보 입력하기'}},

  birth:{theme:'baby',name:'임신운',tag:'임신이 열리는 때부터 산후까지',sub:'내게 소중한 아이가 찾아오는 시기',
    note:'아이가 찾아오는 시기를 봐요.',
    video:'./assets/videos/pregnancy.mp4?v=72',poster:'./assets/videos/pregnancy-poster.jpg?v=72',
    intro:{badge:'임신운',hook:'내게 아이가<br>찾아오는 시기를<br>미리 보고 가세요',cta:'내 임신운 · 사주 정보 입력하기'}},
  child:{theme:'baby',name:'자녀 성장운',tag:'아이의 기질·재능·공부 방식',sub:'우리 아이의 타고난 재능과 성장의 흐름',
    note:'아이의 재능과 성장의 결을 봐요.',
    video:'./assets/videos/child_growth.mp4?v=72',poster:'./assets/videos/child_growth-poster.jpg?v=72',
    intro:{badge:'자녀 성장운',hook:'우리 아이가<br>어디서 빛나고<br><b>어디서 지치는지</b>',cta:'아이의 성장운 · 사주 정보 입력하기'}},
  parent:{theme:'baby',name:'부모·자녀 궁합',tag:'부모와 아이가 만나는 자리',sub:'부모와 아이, 사주로 알아보는 특별한 인연',
    note:'엄마·아빠·아이 세 사주를 함께 봐요.',
    video:'./assets/videos/parent_child.mp4?v=72',poster:'./assets/videos/parent_child-poster.jpg?v=72',
    intro:{badge:'부모·자녀 궁합',hook:'세 사람 사이에서<br>반복되는 장면과<br><b>아이에게 힘이 되는 말</b>',cta:'우리 가족 궁합 · 사주 정보 입력하기'}},

  money:{theme:'wealth',name:'재물·금전운',pill:'금전운',tag:'돈이 들어오는 문과 새는 곳',sub:'내게 재물이 들어오는 시기와 부의 흐름',
    note:'재물이 들어오는 시기를 봐요.',
    /* v54 · 재물·금전운 인트로 영상 */
    video:'./assets/videos/money.mp4?v=72',poster:'./assets/videos/money-poster.jpg?v=72',
    intro:{badge:'재물·금전운',hook:'돈이 들어오는 문과<br>새는 곳을<br><b>먼저</b> 보고 가세요',cta:'내 재물·금전운 · 사주 정보 입력하기'}},
  /* v52 · 재물·직업 두 탭(직업·이직운, 부동산·문서운)에 인트로 영상을 붙인다 */
  job:{theme:'wealth',name:'직업·이직운',pill:'직업·이직운',tag:'천직과 옮겨야 할 시기',sub:'나에게 맞는 직업과 새로운 기회의 시기',
    note:'맞는 일과 옮길 시기를 봐요.',
    video:'./assets/videos/job.mp4?v=72',poster:'./assets/videos/job-poster.jpg?v=72',
    intro:{badge:'직업·이직운',hook:'나에게 맞는 일과<br>자리를 옮길 시기를<br><b>먼저</b> 보고 가세요',cta:'내 직업·이직운 · 사주 정보 입력하기'}},
  startup:{theme:'wealth',name:'사업·부업운',pill:'사업운',tag:'시작해도 되는지, 무엇으로',sub:'내 사업의 성공 가능성과 재물이 따르는 시기',
    note:'사업과 부업의 가능성을 봐요.',
    /* v54 · 사업·부업운 인트로 영상 */
    video:'./assets/videos/biz.mp4?v=72',poster:'./assets/videos/biz-poster.jpg?v=72',
    intro:{badge:'사업·부업운',hook:'지금 시작해도 되는지,<br>무엇으로 시작할지<br><b>사주로</b> 짚어드립니다',cta:'내 사업·부업운 · 사주 정보 입력하기'}},
  estate:{theme:'wealth',name:'부동산·문서운',pill:'문서운',tag:'집과 계약, 문서가 움직이는 때',sub:'부동산과 계약, 재산이 움직이는 시기',
    note:'집과 계약의 시기를 봐요.',
    video:'./assets/videos/estate.mp4?v=72',poster:'./assets/videos/estate-poster.jpg?v=72',
    intro:{badge:'부동산·문서운',hook:'집과 계약, 문서가<br>움직이는 때를<br><b>미리</b> 보고 가세요',cta:'내 부동산운 · 사주 정보 입력하기'}}
};

/* 챕터 조립 : 테마 본문 뒤에 심화 장(content-deep.js)을 붙입니다 */
function chaptersOf(tab){
  var th=TABS[tab].theme;
  var part=window.CTP[th]||{};
  var list=(part[tab]||[]).slice();
  var deep=(window.DEEP&&window.DEEP.chapters)?window.DEEP.chapters(tab):[];
  if(deep.length){
    var at=list.length, last=-1;
    for(var i=0;i<list.length;i++){ if(/개월/.test(list[i].title)) last=i; }
    if(last>=0&&last>=list.length-2) at=last;
    for(var j=0;j<deep.length;j++) list.splice(at+j,0,deep[j]);
  }
  return list;
}

window.CT={
  THEMES:THEMES, TABS:TABS, chaptersOf:chaptersOf,
  tabList:function(){ var out=[],k; for(k in THEMES) THEMES[k].tabs.forEach(function(t){out.push(t);}); return out; },
  count:function(){ var n=0,k; for(k in THEMES) n+=THEMES[k].tabs.length; return n; }
};
})();
