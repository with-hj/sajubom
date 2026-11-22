/* 천령당 — 종합운세 : 신년운세 · 평생사주 · 대운 흐름 (v31 정밀판) */
(function(){
'use strict';
var C=window.CH, S=C.S;
var EL_KO=S.EL_KO;
var P=C.P,H=C.H,UL=C.UL,K=C.K,elB=C.elB,stemB=C.stemB,brB=C.brB,bj=C.bj,sj=C.sj,bp=C.bp,sp=C.sp;
var pillars=C.pillars, elMeter=C.elMeter, godTable=C.godTable, seunTable=C.seunTable;
var monthsBlock=C.monthsBlock, daeunTable=C.daeunTable, gaewunBlock=C.gaewunBlock;
var risky=C.riskyMonthsText, yearOfStar=C.yearOfStar, pillarDetail=C.pillarDetail, facts=C.facts;
window.CTP=window.CTP||{};

function D(R){ return S.deep(R); }
function elK(i){ return S.EL_KO[i]+'('+S.EL_HAN[i]+')'; }
function elKj(i,p){ return elK(i)+S.josaP(S.EL_KO[i],p||'이가'); }
function n2(n){ return n<10?'0'+n:''+n; }

/* 대운 하나를 정밀하게 읽기 */
function dRead(R,i){
  var dd=D(R), dn=R.daeun[i], s=dn.idx%10, b=dn.idx%12;
  var g=S.tenGod(R.dStem,s), grp=S.GOD_GROUP[g];
  var rels=[];
  dd.live.forEach(function(p){ var t=S.relType(p.branch,b); if(t&&t!=='동일') rels.push({pos:p.pos,type:t}); });
  var el=S.STEM_EL[s], bel=S.BR_EL[b];
  return {dn:dn,g:g,grp:grp,el:el,bel:bel,rels:rels,gz:S.ganzhiOf(dn.idx),
    yong:(el===dd.yong||bel===dd.yong), hee:(el===dd.heesin||bel===dd.heesin),
    gi:(el===dd.gisin||bel===dd.gisin)};
}
function relWords(rels){
  if(!rels.length) return '네 기둥과 크게 부딪히지도 묶이지도 않습니다';
  return rels.map(function(r){ return r.pos+'와 '+r.type; }).join(', ') + '으로 만납니다';
}

/* ---------------- 신년운세 ---------------- */
function ny(R,c,input,name){
  var dd=D(R), y=new Date().getFullYear()+1, r=S.yearRead(R,y);
  var cur=dRead(R,R.curDaeun);
  var h=facts(R);
  var toneLine=(r.tone==='open'
    ? '미뤄둔 것을 꺼내고 문을 두드리기 좋은 해입니다. 이 해에 시작한 일은 다음 해의 재료가 됩니다.'
    : (r.tone==='hold'?'벌이기보다 지키는 해입니다. 새 계약·새 대출·새 판은 다음 해로 미루세요.':'되는 일과 막히는 일이 번갈아 오는 해입니다. 한 번에 하나만 잡으세요.'));
  h+='<p>'+r.why+'</p>';
  h+='<p>그래서 '+y+'년은 <b>'+r.short+'</b>입니다. '+toneLine+'</p>';
  h+=H('이 해를 받치는 10년');
  h+='<p>한 해의 날씨는 <b>대운</b>이라는 기후 위에 얹힙니다. 지금은 <b>'+cur.dn.from+'~'+cur.dn.to+'세 · '+cur.gz+' · '+cur.g+'</b>의 10년, 그중 <b>'+(R.age-cur.dn.from+1)+'년 차</b>입니다. '+(S.GOD_DAEUN[cur.g]||'')+'</p>';
  h+='<p>이 대운의 지지는 '+relWords(cur.rels)+'. '+(cur.yong?'용신 '+EL_KO[dd.yong]+S.josaP(EL_KO[dd.yong],'이가')+' 걸린 10년이라 <b>막힌 것이 풀리는</b> 구간입니다.':(cur.gi?'기신 '+EL_KO[dd.gisin]+S.josaP(EL_KO[dd.gisin],'이가')+' 걸린 10년이라 <b>버티는 힘</b>이 결과를 만듭니다.':'용신도 기신도 걸리지 않아, 세운의 날씨가 그대로 드러나는 10년입니다.'))+'</p>';
  h+=H('상반기와 하반기 — 달로 본 순서');
  var ms=C.luckMonths(R,12), first=ms.slice(0,6), second=ms.slice(6,12);
  function avg(a){ var s=0; a.forEach(function(x){s+=x.score;}); return s/a.length; }
  h+='<p>앞으로 6개월은 <b>'+(avg(first)>=avg(second)?'상반기가 더 무겁습니다':'하반기가 더 무겁습니다')+'</b>. '+
    (avg(first)>=avg(second)?'1~6월에 결정을 몰고, 7~12월은 정리와 수확에 쓰세요.':'1~6월은 준비와 정리, 7~12월에 결정을 몰아넣으세요.')+'</p>';
  h+='<table class="tbl"><tr><th>달</th><th>간지 · 십성</th><th>이 달에 할 일</th></tr>';
  ms.slice(0,6).forEach(function(m){
    h+='<tr><td><b>'+m.y+'.'+n2(m.m)+'</b></td><td>'+m.gz+' · '+m.g+'</td><td style="font-size:13px">'+
      (m.tone==='open'?'밀어도 되는 달 — 계약·제안·면접':(m.tone==='hold'?'미루는 달 — 결제·큰 결정 금지':'오르내리는 달 — 하나만 잡기'))+
      (m.rels.length?' ('+m.rels.map(function(x){return x.pos+' '+x.type;}).join('·')+')':'')+'</td></tr>';
  });
  h+='</table>';
  h+=H('올해의 문이 열리는 영역');
  var reads=[]; for(var i=0;i<R.seun.length;i++) reads.push(S.yearRead(R,R.seun[i].year));
  function line(grp,label){
    var hit=reads.filter(function(x){return x.grp===grp;});
    if(!hit.length) return '앞으로 다섯 해에는 뚜렷하게 들어오지 않습니다. 사람과 자리의 밀도가 중요합니다.';
    return hit.map(function(x){return '<b>'+x.y+'년 '+x.gz+'</b>';}).join(', ')+' — '+label+'입니다.';
  }
  h+='<table class="tbl"><tr><th>영역</th><th>열리는 해</th></tr>'+
     '<tr><td>돈</td><td>'+line('재성','수입의 문이 열리는 해')+'</td></tr>'+
     '<tr><td>일·자리</td><td>'+line('관성','자리가 정해지는 해')+'</td></tr>'+
     '<tr><td>표현·재능</td><td>'+line('식상','재능이 밖으로 나가는 해')+'</td></tr>'+
     '<tr><td>문서·부동산</td><td>'+line('인성','계약·등기의 문이 열리는 해')+'</td></tr></table>';
  h+=K('올해의 한 줄','이 해는 <b>'+S.SEUN_KEY[r.g]+'</b>의 해입니다. '+S.EL_KO[dd.yong]+'의 결을 매일 조금씩 채우는 쪽이 오래 남습니다.');
  return h;
}

/* ---------------- 평생사주 ---------------- */
function life1(R,c,input,name){
  var dd=D(R);
  var h=facts(R);
  h+='<p>'+name+' 님의 여덟 글자는 <b>'+C.gzP(R.dStem,R.dBranch)+'일주</b>입니다. '+S.lineup(R)+'. '+S.STRENGTH_TXT[R.strength].out+'</p>';
  h+=pillarDetail(R);
  h+=H('일간이 말하는 삶의 태도');
  h+='<p>'+S.DAY_MASTER[R.dStem][0]+' — 이것이 이 사주의 바탕입니다. '+S.ILJU[R.dIdx][1]+'</p>';
  h+='<p>가장 두터운 기운은 <b>'+c.topGrp+'</b>('+c.grp[c.topGrp]+'개)이고, 그 안의 중심 별은 <b>'+c.topGodInGrp+'</b>입니다. '+S.GROUP_MEAN[c.topGrp]+' '+S.GOD_DEEP[c.topGodInGrp]+'</p>';
  h+=H('기둥이 서로 만나는 자리');
  h+='<p>여덟 글자를 따로 보면 반쪽입니다. 이 사주는 '+S.interHTML(R)+'</p>';
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
  var h=H('겉으로 보이는 나')+'<p>'+dm.out;
  if(c.grp['관성']>=3) h+=' 관성의 기운이 '+c.grp['관성']+'개라 처음에는 선을 넘지 않고 규칙을 지키는 사람처럼 보입니다.';
  else if(c.grp['식상']>=3) h+=' 식상이 두터워 좋은 것도 싫은 것도 금방 드러납니다.';
  else if(c.grp['인성']>=3) h+=' 인성이 두터워 말수가 적고 대답이 한 박자 늦습니다.';
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
  var dd=D(R);
  var h=facts(R);
  h+=H('오행의 무게')+'<p>여덟 글자(시간을 모르면 여섯 글자)의 오행을 세어보면 이렇게 나뉩니다. 가장 두터운 기운은 '+elB(c.mostI)+' '+R.pct[c.mostI].toFixed(1)+'%, 가장 얇은 기운은 '+elB(c.leastI)+' '+R.pct[c.leastI].toFixed(1)+'%입니다.</p>';
  h+=elMeter(R);
  h+=H('가장 강한 기운 — '+S.EL_KO[c.mostI])+'<p>'+S.EL_DEEP[c.mostI].over+'</p>';
  h+=H('가장 약한 기운 — '+S.EL_KO[c.leastI])+'<p>'+S.EL_DEEP[c.leastI].under+'</p>';
  h+=H('신강·신약 — 왜 그렇게 판정되는가');
  h+='<p>'+S.strengthText(R)+'</p>';
  h+=H('용신·희신·기신 — 이 사주에 필요한 것과 피할 것');
  h+='<p>'+S.yongText(R)+'</p>';
  h+=gaewunBlock(R,c);
  return h;
}
function life4(R,c,input,name){
  var dd=D(R);
  var h=H('십성의 구조')+'<p>여덟 글자가 어떤 재료로 이루어졌는지 묶음으로 보면 이렇습니다.</p>'+godTable(c);
  h+='<p>가장 두터운 묶음은 <b>'+c.topGrp+'</b>입니다. '+S.GROUP_MEAN[c.topGrp]+' 그래서 인생의 과제는 이 기운을 <b>쓰는 법</b>을 배우는 일입니다.</p>';
  h+=H('지장간 — 겉으로 드러나지 않은 재료');
  var rows='<table class="tbl"><tr><th>지지</th><th>지장간</th><th>이 사주에서</th></tr>';
  dd.live.forEach(function(p){
    rows+='<tr><td><b>'+p.pos+' '+S.BR_KO[p.branch]+'('+S.BR_HAN[p.branch]+')</b></td><td>'+p.hidden.map(function(x){return S.STEM_KO[x.stem]+'('+x.god+')';}).join(' · ')+'</td><td style="font-size:12.5px">'+p.hidden[0].label+' '+S.STEM_KO[p.hidden[0].stem]+S.josaP(S.STEM_KO[p.hidden[0].stem],'이가')+' '+(p.bGod===p.hidden[0].god?'그대로':'다른 결로')+' 작동합니다</td></tr>';
  });
  h+=rows+'</table>';
  h+='<p>지장간은 <b>“말하지 않은 마음”</b>입니다. 이 사주는 '+dd.live.map(function(p){ return S.BR_KO[p.branch]+'('+S.BR_HAN[p.branch]+')에 '+p.hidden.map(function(x){return x.god;}).join('·'); }).join(', ')+'이 숨어 있어, 겉으로 보이는 성격과 실제 계산이 다를 수 있습니다.</p>';
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
  var h=H('평생의 재물 구조');
  h+='<p>재성은 <b>'+(jc+pc)+'개</b>(정재 '+jc+' · 편재 '+pc+')이고, 일간의 힘은 <b>'+R.strength+'</b>입니다. '+(pc>jc?'변동형 수입에 강하고 큰 판을 보는 눈이 있습니다.':(jc>pc?'고정형 수입에 강하고 관리에 능합니다.':'고정과 변동이 반반이라 균형 잡힌 운영이 맞습니다.'))+'</p>';
  h+='<p>'+S.strengthText(R)+'</p>';
  h+=H('돈이 새는 지점')+'<p>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'사람을 통한 지출에서 계산이 흐려집니다.')+' 기신 '+elKj(dd.gisin)+' 도는 달에 특히 커집니다.</p>';
  h+=H('부르는 방식')+'<p>'+(S.WEALTH_VESSEL_GOD[c.topGodInGrp]||'성실함이 그대로 재산이 되는 구조입니다.')+'</p>';
  h+=H('문서·부동산')+'<p>문서·부동산 취득 지수는 <b>'+w.score+'/100('+w.grade+')</b>입니다. 가장 잘 맞는 방식은 <b>'+w.types[0].label+'</b>이고, 첫 번째 창은 <b>'+(w.bestClean?w.bestClean.y+'년 '+w.bestClean.gz:w.best.y+'년 '+w.best.gz)+'</b>입니다. '+(w.gmIn.length?'인성이 공망이라 계약서·등기를 직접 확인해야 합니다.':'인성·관성이 받쳐줘 등기와 계약에서 손해가 적은 구조입니다.')+'</p>';
  h+=H('평생의 루틴')+'<p>'+(S.WEALTH_ROUTINE[c.topGrp]||'수입이 들어온 날 바로 떼어두는 습관 하나가 10년을 바꿉니다.')+' '+d.habit+'.</p>';
  h+=K('한 줄','평생의 재물은 <b>'+S.careerMap(R).roles[0]+'</b> 같은 자리에서 만들어집니다.');
  return h;
}
function life6(R,c,input,name){
  var dd=D(R);
  var dohwa=dd.sals.filter(function(s){return s.key==='dohwa'||s.key==='hongyeom';});
  var h=H('평생의 인연');
  h+='<p>배우자궁인 일지 '+bj(R.dBranch,'은는')+' <b>'+S.SPOUSE[R.dBranch]+'</b>을 가리킵니다. '+S.BR_INNER[R.dBranch]+'</p>';
  h+='<p>일지의 십이운성은 <b>'+S.stage12(R.dStem,R.dBranch)+'</b>입니다. '+S.STAGE_MEAN[S.stage12(R.dStem,R.dBranch)]+'</p>';
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
  var dd=D(R), cm=S.careerMap(R);
  var h=H('일의 방향 — 2026년 직군으로');
  h+='<p>'+cm.why+'</p>';
  h+='<ul>'+cm.roles.map(function(x,i){ return '<li>'+(i===0?'<b>'+x+'</b>':x)+'</li>'; }).join('')+'</ul>';
  h+='<p>부업·사업으로는 '+cm.biz[0]+' 같은 형태가 맞습니다.</p>';
  h+=H('일하는 방식')+'<p>'+(S.WORK_MODE[c.topGrp]||'역할이 분명할 때 가장 오래 갑니다.')+'</p>';
  h+=H('평생의 대운 지도')+'<p>아홉 번의 10년을 한눈에 놓았습니다. 지금 구간을 기준으로 앞뒤를 함께 보세요.</p>';
  h+=daeunTable(R,c);
  var best=S.bestDaeun(R,c), br=dRead(R,best.i);
  h+='<p>가장 힘이 실리는 구간은 <b>'+br.dn.from+'~'+br.dn.to+'세 · '+br.gz+' · '+br.g+'</b>입니다. '+(S.GOD_DAEUN[br.g]||'')+' 이때 '+relWords(br.rels)+'.</p>';
  return h+K('가장 힘이 실리는 구간', '<b>'+br.dn.from+'~'+br.dn.to+'세 · '+br.g+'</b> — '+(S.GOD_DAEUN[br.g]||''));
}

/* ---------------- 대운 흐름 ---------------- */
function dn1(R,c,input,name){
  var d=R.daeun[R.curDaeun], r=dRead(R,R.curDaeun);
  var h=facts(R);
  h+='<p><b>'+d.from+'~'+d.to+'세</b>, '+r.gz+' 대운입니다. 십성은 <b>'+r.g+'</b>, 묶음은 <b>'+r.grp+'</b>. '+(S.GOD_DAEUN[r.g]||'')+'</p>';
  h+='<p>이 대운의 천간은 '+elK(r.el)+', 지지 '+bj(d.idx%12,'은는')+' '+elK(r.bel)+'입니다. '+S.EL_DEEP[r.el].over+'</p>';
  h+='<p>지지가 '+relWords(r.rels)+'. '+(r.rels.some(function(x){return x.type==='충';})?'충이 걸린 10년이라 <b>생활의 판이 한 번 바뀝니다</b>. 이사·이직·관계 변화가 겹칠 수 있으니 큰 결정을 한꺼번에 몰지 마세요.':(r.rels.some(function(x){return x.type==='육합'||x.type==='삼합';})?'합이 걸린 10년이라 <b>사람을 통해 일이 풀립니다</b>. 혼자 밀지 말고 한 사람을 거치세요.':'기둥과 크게 얽히지 않아 <b>세운의 날씨가 그대로 드러나는</b> 10년입니다.'))+'</p>';
  h+='<p>'+(r.yong?'용신 '+EL_KO[D(R).yong]+'이 걸린 10년입니다. 막힌 것이 풀리고 미뤄둔 일이 결실을 봅니다.':(r.gi?'기신 '+EL_KO[D(R).gisin]+'이 걸린 10년입니다. 벌이기보다 <b>지키고 다지는</b> 쪽이 남습니다.':'용신도 기신도 걸리지 않아, 무엇을 심느냐가 그대로 결과가 되는 10년입니다.'))+'</p>';
  h+=H('지금의 위치')+'<p>올해 '+R.age+'세, 이 대운의 <b>'+(R.age-d.from)+'년 차</b>입니다. '+((R.age-d.from)<=2?'아직 새 판에 자리를 잡는 초반입니다. 크게 벌이기보다 기반을 만드세요.':((R.age-d.from)>=7?'후반부입니다. 다음 판을 준비하면서 마무리를 정리할 시기입니다.':'중반입니다. 이 대운의 재료를 가장 잘 쓸 수 있는 구간입니다.'))+'</p>';
  h+=K('이 10년의 키워드', S.DAEUN_KEY[r.g]+' — '+S.EL_DEEP[r.el].habit);
  return h;
}
function dn2(R,c,input,name){
  var i=R.curDaeun;
  if(i<=0) return '<p>이 사주는 첫 대운을 지나고 있습니다. 아직 이전 10년이 쌓이지 않았으니 지금 쌓는 것이 곧 바탕이 됩니다.</p>'+K('한 줄','첫 대운은 <b>재료를 모으는 시간</b>입니다. 크게 벌이기보다 배우고 시도하는 쪽이 남습니다.');
  var r=dRead(R,i-1);
  var h='<p>지난 10년은 <b>'+r.dn.from+'~'+r.dn.to+'세 · '+r.gz+' · '+r.g+'</b>의 구간이었습니다. '+(S.GOD_DAEUN[r.g]||'')+'</p>';
  h+='<p>'+S.GROUP_MEAN[r.grp]+' 그래서 그 10년 동안 '+name+' 님은 <b>'+S.GROUP_MEAN[r.grp].split('.')[0]+'</b>을 중심으로 자라왔습니다. 지지는 '+relWords(r.rels)+'.</p>';
  h+=H('아직 남은 숙제')+'<p>'+S.REL_NOTE[r.grp]+' 이 재료는 아직 다 쓰이지 않았습니다. 지금의 대운에서 이 재료를 어떻게 쓰느냐가 다음 10년의 출발점을 바꿉니다.</p>';
  h+=K('한 줄','지난 10년의 결은 <b>버릴 것이 아니라 옮겨 담을 것</b>입니다. 무엇을 가져갈지 지금 정하세요.');
  return h;
}
function dn3(R,c,input,name){
  var nx=R.daeun[R.curDaeun+1];
  if(!nx) return '<p>지금 대운이 마지막 구간입니다. 이후는 세운과 일상의 선택으로 읽습니다.</p>';
  var r=dRead(R,R.curDaeun+1);
  var h='<p>다음은 <b>'+nx.from+'~'+nx.to+'세 · '+r.gz+' · '+r.g+'</b> 대운입니다. '+(S.GOD_DAEUN[r.g]||'')+'</p>';
  h+='<p>'+S.GROUP_MEAN[r.grp]+' 지지는 '+relWords(r.rels)+'. '+(r.rels.some(function(x){return x.type==='충';})?'충이 걸려 <b>판이 바뀌는</b> 10년입니다. 그 전에 정리할 것을 정리하세요.':'')+'</p>';
  h+=H('지금 준비할 세 가지');
  var grp=r.grp;
  h+=UL([
    '<b>자리</b> — '+(grp==='관성'?'책임과 자리를 요구하는 흐름입니다. 자격·직함을 하나 쌓아두세요.':(grp==='재성'?'돈이 구체적으로 움직이는 흐름입니다. 통장과 장부를 미리 나눠두세요.':(grp==='식상'?'만든 것을 밖으로 내는 흐름입니다. 취미를 수입 구조로 연결해보세요.':(grp==='인성'?'배우고 정리하는 흐름입니다. 공부에 기한을 두고 하나를 끝내세요.':'내 이름을 거는 흐름입니다. 혼자 할 수 있는 일을 하나 만들어두세요.')))),
    '<b>사람</b> — 다음 대운에 함께할 사람을 지금의 자리에서 미리 만나두세요.',
    '<b>몸</b> — 전환기 2년은 일정을 조금 비우고 잠과 식사를 먼저 안정시키세요.'
  ]);
  h+=K('다음 대운의 문', '실제 변화는 <b>'+(nx.from-2)+'~'+(nx.from+2)+'세</b>에 걸쳐 옵니다.');
  return h;
}
function dn4(R,c,input,name){
  var h='<p>대운이 바뀌는 실제 변화는 달력처럼 딱 끊기지 않습니다. 대개 <b>그 전후 2년</b>에 걸쳐 생활과 관계가 함께 움직입니다.</p>';
  h+=H('전환기에 나타나는 신호');
  h+=UL(['갑자기 이사·이직·계약처럼 되돌리기 어려운 일이 겹칩니다.','오래된 관계가 정리되고 새 사람이 들어옵니다.','몸이 먼저 피곤해집니다. 잠이 얕고 소화가 흔들립니다.']);
  h+=H('전환기를 쓰는 순서');
  h+=UL(['<b>하나씩</b> — 되돌리기 어려운 일을 한꺼번에 몰지 마세요.','<b>기록</b> — 지금 결정한 이유를 적어두세요. 전환기에는 판단이 흔들립니다.','<b>몸</b> — 잠과 식사를 먼저 고정하세요. 몸이 버티면 결정도 버팁니다.']);
  h+=K('한 줄', '전환기는 <b>비우는 시간</b>입니다. 채우려 하면 다음 판이 무거워집니다.');
  return h;
}
function dn5(R,c,input,name){
  var r=dRead(R,R.curDaeun), dd=D(R);
  var h=H('대운으로 보는 선택의 시기');
  h+='<p>같은 노력도 대운의 결에 맞추면 결과가 달라집니다. 지금 대운의 묶음은 <b>'+r.grp+'</b>이고, 지지는 '+relWords(r.rels)+'.</p>';
  h+='<table class="tbl"><tr><th>선택</th><th>지금 해도 되는가</th></tr>'+optRow(R,c,'이직·자리 이동','관성')+optRow(R,c,'창업·새 판','비겁')+optRow(R,c,'투자·큰 지출','재성')+optRow(R,c,'배움·자격','인성')+optRow(R,c,'문서·부동산','인성')+'</table>';
  h+=H('시기를 재는 법')+'<p>대운이 문을 열어도 세운이 잠그고 있으면 실제로는 움직이지 않습니다. 대운과 세운이 같은 방향일 때가 가장 빠른 시기입니다.</p>';
  h+='<p>이 사주는 '+S.yearRead(R,R.seun[0].year).why+'</p>';
  h+=K('한 줄','지금 대운이 <b>'+S.DAEUN_KEY[r.g]+'</b>이므로, 이 방향에 얹히는 선택이 힘을 받습니다.');
  return h;
}
function optRow(R,c,label,grp){
  var cur=S.GOD_GROUP[S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)];
  var ys=yearOfStar(R,grp);
  var verdict;
  if(cur===grp) verdict='<b>지금이 맞습니다.</b> 대운이 이 방향으로 열려 있어요.';
  else if(ys.length) verdict='세운이 열리는 <b>'+ys[0].y+'년</b>이 더 좋습니다.';
  else verdict='지금은 서두르지 않는 편이 낫습니다.';
  return '<tr><td>'+label+'</td><td style="font-size:13.5px">'+verdict+'</td></tr>';
}
function dn6(R,c,input,name){
  var y=S.STEM_EL[R.daeun[R.curDaeun].idx%10], dd=D(R);
  var h=H('대운이 몸에 오는 방식');
  h+='<p>이 10년의 천간은 '+elB(y)+' 기운입니다. '+S.EL_DEEP[y].over+'</p>';
  h+='<p>그래서 이 시기에 특히 <b>'+S.EL_DEEP[y].part+'</b> 쪽이 먼저 피로를 알립니다. '+S.EL_DEEP[y].habit+' — 이 습관 하나가 10년의 컨디션을 좌우합니다.</p>';
  h+=H('계절 리듬')+'<p>'+S.SEASON_RHYTHM[y][0]+' — '+S.SEASON_RHYTHM[y][1]+' 이때는 일정을 조금 비워두세요.</p>';
  h+='<p>가장 얇은 기운 '+elK(dd.c.leastI)+'은 계속 신경 써야 합니다. '+S.EL_DEEP[dd.c.leastI].part+' 쪽이 이 사주의 <b>먼저 무너지는 자리</b>입니다.</p>';
  h+=H('전환기 건강')+'<p>대운이 바뀌는 해에는 몸도 새 환경에 적응하느라 유난히 피곤합니다. 전환기 2년은 잠과 식사를 먼저 안정시키는 것이 좋습니다.</p>';
  h+=K('한 줄', S.EL_DEEP[y].habit+' — 이 한 가지만 10년 지켜도 절반은 달라집니다.');
  return h;
}
function dn7(R,c,input,name){
  var best=S.bestDaeun(R,c), br=dRead(R,best.i);
  var h=H('아홉 구간 지도')+'<p>지금 구간을 기준으로 앞뒤를 함께 보세요.</p>'+daeunTable(R,c);
  h+=H('가장 힘이 실리는 구간')+'<p><b>'+br.dn.from+'~'+br.dn.to+'세 · '+br.gz+' · '+br.g+'</b> — '+(S.GOD_DAEUN[br.g]||'')+' 지지는 '+relWords(br.rels)+'.</p>';
  h+=H('구간별로 남는 것')+UL(R.daeun.slice(0,9).map(function(d){
    var g=S.tenGod(R.dStem,d.idx%10);
    return '<b>'+d.from+'~'+d.to+'세</b> — '+S.DAEUN_KEY[g]+': '+S.GOD_DAEUN[g].split('.')[0]+'.';
  }));
  h+=K('한 줄','대운은 문이 열리는 시기를 알려줄 뿐, 그 문을 지나가는 것은 매일의 선택입니다.');
  return h;
}

window.CTP.general={
  newyear:[
    {title:'다가오는 한 해의 문',sub:'세운·대운·상하반기',body:ny},
    {title:'이 해를 받치는 10년',sub:'지금 대운의 몇 년 차인가',body:dn1},
    {title:'12개월 월별 흐름',sub:'달마다 밀 것과 미룰 것',body:function(R,c,input,name){return monthsBlock(R,c,'general',12,'앞으로 12개월, 이 사주에게 들어오는 달의 결입니다.')+K('한 줄','합의 달에 사람을 만나고, 충의 달에 정리하세요.');}},
    {title:'올해의 돈',sub:'들어오는 달과 새는 달',body:function(R,c,input,name){
      var dd=D(R);
      var h=H('재물의 흐름')+'<p>이 사주는 재성이 '+dd.docu.jaeCnt+'개, 문서·부동산 지수는 '+dd.docu.score+'점입니다.</p>';
      h+='<p>올해 세운은 <b>'+S.tenGod(R.dStem,R.seun[0].idx%10)+'</b>이며, '+S.yearRead(R,R.seun[0].year).why+'</p>';
      h+=H('새는 지점')+'<p>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'')+'</p>';
      h+=monthsBlock(R,c,'wealth',6,'돈이 구체적으로 움직이는 달만 골랐습니다.');
      return h+K('한 줄','들어온 날 바로 <b>절반</b>을 떼어두는 규칙 하나면 충분합니다.');}},
    {title:'올해의 인연',sub:'만남의 문이 열리는 해와 달',body:function(R,c,input,name){
      var dd=D(R);
      var reads=[]; for(var i=0;i<R.seun.length;i++) reads.push(S.yearRead(R,R.seun[i].year));
      var ys=reads.filter(function(r){return r.grp==='관성'||r.grp==='재성';});
      var h=H('인연의 문')+'<p>'+(ys.length?ys.map(function(r){return '<b>'+r.y+'년 '+r.gz+'</b>';}).join(', ')+'이 관계가 구체적으로 움직이는 해입니다. '+ys[0].why:'앞으로 다섯 해에는 관계성이 세운으로 크게 들어오지 않아, 해보다 만남의 밀도가 중요합니다.')+'</p>';
      h+='<p>'+S.gongmangText(R)+'</p>';
      h+=H('만남의 달')+monthsBlock(R,c,'love',6,'사람을 만나기 좋은 달을 짚었습니다.');
      h+=H('올해 조심할 것')+'<p>'+risky(R,c,12)+'</p>';
      return h;}},
    {title:'올해의 몸',sub:'주의할 달과 회복 루틴',body:function(R,c,input,name){
      var dd=D(R);
      var h=H('올해 몸의 신호')+'<p>가장 얇은 기운은 '+elB(c.leastI)+'입니다. '+S.EL_DEEP[c.leastI].under+'</p>';
      h+='<p>올해 세운의 오행은 '+elB(S.BR_EL[R.seun[0].idx%12])+'입니다. '+S.SEUN_EL[S.BR_EL[R.seun[0].idx%12]]+'</p>';
      h+=H('조심할 달')+'<p>'+risky(R,c,12)+'</p>';
      h+=H('회복 루틴')+'<p>'+S.EL_DEEP[dd.yong].habit+' · '+S.EL_DEEP[dd.yong].food+'.</p>';
      return h+K('한 줄','잠드는 시간만 고정해도 올해의 절반은 지킨 것입니다.');}},
    {title:'새해 준비',sub:'비울 것과 들일 것',body:function(R,c,input,name){
      var dd=D(R);
      var h=H('먼저 비울 것')+'<p>'+name+' 님은 '+S.ILJU[R.dIdx][0]+'의 결이라, 새해를 열 때 “무엇을 새로 벌일까”보다 <b>무엇을 비울까</b>를 먼저 정하면 그해가 훨씬 가벼워집니다.</p>';
      h+='<ul><li>1월에 책상과 일정을 한 번 비우기</li><li>구독·약속 중 쓰지 않는 것 세 개 정리</li><li>지난해 미뤄둔 결정 하나를 끝내기</li></ul>';
      h+=H('들일 것')+'<p>'+S.EL_KO[dd.yong]+' 색 소품 하나, '+S.EL_DEEP[dd.yong].dir+' 방향으로의 산책. '+S.EL_DEEP[dd.yong].habit+'.</p>';
      h+='<p>올해 첫 번째 창은 <b>'+dd.docu.best.y+'년</b>입니다. 계약·등기·이직 중 하나를 그 해에 맞춰 준비하세요.</p>';
      return h;}}
  ],
  life:[
    {title:'원국의 바탕',sub:'일간·일지·강약·합충',body:life1},
    {title:'겉과 속',sub:'보이는 나와 아는 나',body:life2},
    {title:'타고난 그릇',sub:'오행의 무게와 필요한 기운',body:life3},
    {title:'십성의 구조',sub:'무엇으로 이루어진 사람인가',body:life4},
    {title:'평생의 재물',sub:'벌이의 구조와 새는 곳',body:life5},
    {title:'평생의 인연',sub:'배우자궁과 사랑의 언어',body:life6},
    {title:'평생의 일과 대운',sub:'천직과 아홉 번의 10년',body:life7}
  ],
  daeunflow:[
    {title:'지금 대운',sub:'이 10년의 재료와 위치',body:dn1},
    {title:'지난 10년',sub:'무엇이 쌓였는가',body:dn2},
    {title:'다음 대운',sub:'무엇을 준비할 것인가',body:dn3},
    {title:'전환기',sub:'바뀌는 2년을 쓰는 법',body:dn4},
    {title:'대운으로 보는 선택',sub:'이직·창업·투자·배움',body:dn5},
    {title:'대운과 몸',sub:'10년의 건강 리듬',body:dn6},
    {title:'아홉 구간 지도',sub:'평생을 한눈에',body:dn7}
  ]
};
})();
