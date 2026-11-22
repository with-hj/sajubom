/* =====================================================================
   천령당(天靈堂) — 콘텐츠 코어 : 공통 조각 + 5대 테마 · 16개 세부 탭 정의
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
function facts(R){
  var d=S.deep(R), c=d.c;
  var rel=d.branchRels.length?d.branchRels.map(function(r){return r.type+'('+r.pair+')';}).join(' · '):'없음';
  var sal=d.sals.length?d.sals.map(function(s){return s.name;}).join(' · '):'없음';
  var gm=d.gmHits.length?d.gmHits.map(function(x){return x.pos;}).join('·')+' 공망':'공망 없음';
  return '<div class="ch-key" style="margin:2px 0 12px"><b>원국 증거</b><span>'+
    S.STEM_KO[R.dStem]+S.BR_KO[R.dBranch]+'('+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+')일주 · '+(R.strength==='강'?'신강':(R.strength==='약'?'신약':'중화'))+
    ' · 용신 '+S.EL_KO[d.yong]+' · 기신 '+S.EL_KO[d.gisin]+'<br>합충 '+rel+' · '+gm+' · 신살 '+sal+'</span></div>';
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
    tabs:['newyear','life','daeunflow']},
  love:{name:'썸 · 연애 · 재회',short:'썸·연애\n재회',img:'love',tagline:'마음이 오가는 속도를 여덟 글자로 읽어요',
    tabs:['sseom','reunion','pattern'],ctx:'partner'},
  marriage:{name:'궁합 · 결혼 · 이혼',short:'궁합·결혼\n이혼',img:'marriage',tagline:'함께 앉을 사람인지, 언제 앉을 시기인지',
    tabs:['couple','wedding','divorce'],ctx:'partner'},
  baby:{name:'임신 · 자녀',short:'임신·자녀',img:'baby',tagline:'아이를 맞는 때와 그 아이의 결을',
    tabs:['birth','child','parent'],ctx:'baby',
    warn:'사주 명리 기반의 참고 해석이며 의학적 진단이 아닙니다.'},
  wealth:{name:'재물 · 직업',short:'재물·직업',img:'wealth',tagline:'돈이 들어오는 문과 일이 맞는 자리',
    tabs:['money','job','startup'],ctx:'work'}
};

var TABS={
  newyear:{theme:'general',name:'신년운세',tag:'다가오는 한 해, 어디로 문이 열리는지',
    note:'다가오는 한 해의 세운을 중심으로 상반기·하반기의 방향을 먼저 짚어요.',
    video:'./assets/videos/newyear.mp4'},   /* v46 · 탭별 인트로 영상 (있으면 입력창 앞에 9:16 카드로 재생) */
  life:{theme:'general',name:'평생사주',tag:'타고난 그릇과 평생의 결',
    note:'한 해의 운이 아니라 평생 따라다니는 바탕을 읽어요.'},
  daeunflow:{theme:'general',name:'대운 흐름',tag:'10년마다 바뀌는 판의 방향',
    note:'지금 대운과 다음 대운을 나란히 놓고 전환의 시기를 봐요.'},

  sseom:{theme:'love',name:'썸 속마음',tag:'그 사람이 나를 어떻게 보고 있는지',
    note:'상대의 생년월일을 넣으면 두 사람의 일간·일지까지 함께 읽어요.'},
  reunion:{theme:'love',name:'재회·연락운',tag:'끊긴 연락이 다시 이어질 수 있는지',
    note:'상대의 생년월일이 있으면 일지가 부딪히는지 어울리는지까지 봐요.'},
  pattern:{theme:'love',name:'내 연애 패턴',tag:'왜 같은 사람에게 반복해서 끌리는지',
    note:'끌림과 이별의 이유를 여덟 글자에서 찾아요.'},

  couple:{theme:'marriage',name:'커플 궁합',tag:'두 사람의 사주가 만나는 자리',
    note:'상대방 생년월일을 넣으면 일간·일지·오행 궁합을 계산해 드려요.'},
  wedding:{theme:'marriage',name:'결혼 시기',tag:'결혼의 문이 열리는 해와 조건',
    note:'배우자성이 들어오는 해와 결혼 전 점검할 조건을 봐요.'},
  divorce:{theme:'marriage',name:'이혼·위기',tag:'갈등이 커지는 시기와 결정 기준',
    note:'위기의 신호와 흔들리는 해를 짚고, 결정 전 세 질문을 드려요.'},

  birth:{theme:'baby',name:'임신·출산운',tag:'임신이 열리는 때부터 산후까지',
    note:'자녀성이 들어오는 해와 달, 몸의 물·불 균형, 부부의 합, 태교와 출산·산후의 흐름을 한 번에 봐요.',
    formTitle:'임신·출산운 — 내 사주 입력'},
  child:{theme:'baby',name:'자녀 사주',tag:'아이의 기질·재능·공부 방식',
    note:'부모의 사주로 아이와의 관계를, 아이의 생년월일로 그 아이의 결을 읽어요.',
    formTitle:'자녀 사주 — 부모 사주 입력'},
  parent:{theme:'baby',name:'엄마·아빠 궁합',tag:'부모와 아이가 만나는 자리',
    note:'배우자의 생년월일과 결혼 상태를 넣으면 두 사람의 결, 아이의 자리까지 함께 봐요.',
    formTitle:'엄마·아빠 궁합 — 내 사주 입력'},

  money:{theme:'wealth',name:'재물·횡재',tag:'돈이 들어오는 문과 새는 곳',
    note:'재물의 그릇, 새는 지점, 큰돈이 들어오는 해를 봐요.'},
  job:{theme:'wealth',name:'직업·이직',tag:'천직과 옮겨야 할 시기',
    note:'맞는 일, 이직의 문, 남을지 옮길지를 봐요.'},
  startup:{theme:'wealth',name:'창업·부업',tag:'시작해도 되는지, 무엇으로',
    note:'창업 적성, 아이템의 방향, 시작 시기를 봐요.'}
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
