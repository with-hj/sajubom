/* 사주봄 — 임신·자녀 : 임신운 · 자녀 성장운 · 부모·자녀 궁합 (v51) */
(function(){
'use strict';
var C=window.CH, S=C.S;
var P=C.P,H=C.H,UL=C.UL,K=C.K,elB=C.elB,stemB=C.stemB,brB=C.brB;
var monthsBlock=C.monthsBlock, risky=C.riskyMonthsText, yearOfStar=C.yearOfStar, partnerChart=C.partnerChart;
window.CTP=window.CTP||{};

function starOf(input){ return (input.gender==='f')?'식상':'관성'; }
function starName(input){ return (input.gender==='f')?'자녀성(식상)':'자녀성(관성)'; }
function childStarYears(R,input){
  var grp=starOf(input), out=[];
  for(var i=0;i<R.seun.length;i++){
    var g=S.tenGod(R.dStem,R.seun[i].idx%10);
    if(S.GOD_GROUP[g]===grp) out.push({y:R.seun[i].year,g:g});
  }
  return out;
}
/* 자녀성이 걸린 달 (앞으로 n개월) */
function starMonths(R,input,n){
  var grp=starOf(input), out=[], now=new Date(), y=now.getFullYear(), m=now.getMonth()+1;
  for(var i=0;i<(n||12);i++){
    var mp=S.monthPillarOf(y,m), g=S.tenGod(R.dStem,mp.stem);
    if(S.GOD_GROUP[g]===grp) out.push({y:y,m:m,g:g});
    m++; if(m>12){m=1;y++;}
  }
  return out;
}
function waterFire(R){
  var w=R.count[4], f=R.count[1], t=R.total||8;
  return {w:w,f:f,wp:Math.round(w/t*100),fp:Math.round(f/t*100)};
}
function wfText(R){
  var x=waterFire(R);
  if(x.f>=x.w+2) return '이 사주는 <b>불(火)이 물(水)보다 강한 구조</b>입니다. 몸에 열이 먼저 오르고, 잠이 얕아지며 입이 마르는 쪽으로 나타납니다. 임신을 준비하는 동안에는 <b>몸을 식히는 시간</b>이 가장 중요합니다 — 늦은 밤 활동을 줄이고, 미지근한 물을 자주, 저녁에는 발을 따뜻하게.';
  if(x.w>=x.f+2) return '이 사주는 <b>물(水)이 불(火)보다 강한 구조</b>입니다. 몸이 차고 손발이 쉬워지며 기운이 가라앉는 쪽으로 나타납니다. 임신을 준비하는 동안에는 <b>몸을 데우는 시간</b>이 중요합니다 — 아랫배와 발을 따뜻하게, 아침 햇빛 10분, 따뜻한 식사.';
  return '이 사주는 <b>물(水)과 불(火)이 비교적 고른 구조</b>입니다. 다만 계절에 따라 흔들리므로, 여름에는 열을 식히고 겨울에는 몸을 데우는 방식으로 계절을 타는 것이 좋습니다.';
}

/* ---------------- 임신운 ---------------- */
function pg1(R,c,input,name){
  var dd=S.deep(R), star=starOf(input);
  var hits=[]; for(var i=0;i<R.seun.length;i++){ var r=S.yearRead(R,R.seun[i].year); if(r.grp===star) hits.push(r); }
  var where=[];
  dd.live.forEach(function(p){
    if(S.GOD_GROUP[p.bGod]===star) where.push(p.pos+' 지지 '+S.BR_KO[p.branch]+'('+S.BR_HAN[p.branch]+')');
    if(S.GOD_GROUP[p.sGod]===star) where.push(p.pos+' 천간');
  });
  var h=window.CH.facts(R);
  h+='<p>임신의 시기는 <b>'+starName(input)+'이 들어오는 해</b>와 <b>몸의 리듬</b>을 함께 봅니다. '+(hits.length
    ? '앞으로 다섯 해 중 '+hits.map(function(r){return '<b>'+r.y+'년 '+r.gz+'</b>';}).join(', ')+'이 그 문에 해당합니다. '+hits[0].why
    : '앞으로 다섯 해에는 자녀성이 세운으로 뚜렷하게 들어오지 않습니다. 이때는 해보다 <b>몸과 생활의 조건</b>이 중요합니다.')+'</p>';
  h+='<p>원국에서 자녀성이 놓인 자리는 '+(where.length?where.join(', '):'뚜렷하지 않음')+'입니다. '+(where.length?'자녀성이 원국에 있어 <b>아이의 자리가 이미 열려 있는</b> 사주입니다.':'자녀성이 원국에 얇아, 아이의 일은 <b>세운·대운이 데려오는</b> 구조입니다.')+'</p>';
  if(dd.gmHits.length) h+='<p>다만 '+dd.gmHits.map(function(x){return x.pos;}).join('·')+'가 공망이라, <b>일정·서류·검사 기록</b>을 직접 챙기는 습관이 필요합니다. 맡기면 빠지는 자리입니다.</p>';
  h+=H('해마다의 문');
  h+='<table class="tbl"><tr><th>해</th><th>간지</th><th>십성</th><th>임신·출산의 문</th></tr>';
  for(var k=0;k<R.seun.length;k++){
    var sn=R.seun[k], g=S.tenGod(R.dStem,sn.idx%10), r=S.yearRead(R,sn.year);
    var isStar=(S.GOD_GROUP[g]===star);
    h+='<tr><td><b>'+sn.year+'</b></td><td>'+C.gzP(sn.idx%10,sn.idx%12)+'</td><td>'+g+'</td><td style="font-size:13px">'+(isStar?'<b style="color:#c94228">문이 열리는 해</b> — '+(r.rels.length?r.rels.map(function(x){return x.pos+' '+x.type;}).join('·')+', ':'')+'몸을 세워두세요.':'준비의 해 — '+S.SEUN_KEY[g])+'</td></tr>';
  }
  h+='</table>';
  h+=H('달로 보는 창');
  var ms=starMonths(R,input,12);
  h+='<p>'+(ms.length?('앞으로 12개월 중 <b>'+ms.map(function(o){return o.y+'.'+C.n2(o.m);}).join(', ')+'</b>이 '+starName(input)+'이 도는 달입니다. 이 달들은 몸의 컨디션을 가장 잘 만들어두면 좋습니다.'):'앞으로 12개월에는 자녀성이 도는 달이 뚜렷하지 않습니다. 이때는 달보다 몸의 주기를 먼저 안정시키세요.')+'</p>';
  h+='<p>지금 대운은 <b>'+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세 · '+S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)+'</b>입니다. '+(S.GOD_GROUP[S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)]===star?'대운이 자녀성을 데리고 있는 10년이라 세운이 두드리는 해가 더 또렷합니다.':'대운에는 자녀성이 없어, 세운이 오는 해에 몸을 미리 세워두는 쪽이 효율적입니다.')+'</p>';
  return h+K('한 줄','시기는 <b>문</b>이고, 준비는 <b>몸</b>입니다. 문이 열리는 해에 몸이 준비되어 있어야 합니다.');
}
function pg2(R,c,input,name){
  var x=waterFire(R);
  var h='<p>'+wfText(R)+'</p>';
  h+='<div class="elbar"><i style="width:'+Math.max(8,x.fp)+'%;background:'+S.EL_COLOR[1]+'"></i><i style="width:'+Math.max(8,x.wp)+'%;background:'+S.EL_COLOR[4]+'"></i></div>';
  h+='<div class="el5"><span><i style="background:'+S.EL_COLOR[1]+'"></i>화(火) '+x.f+'</span><span><i style="background:'+S.EL_COLOR[4]+'"></i>수(水) '+x.w+'</span></div>';
  h+=H('몸에서 먼저 나타나는 신호')+'<p>'+S.EL_DEEP[c.leastI].under+' 가장 얇은 기운은 '+elB(c.leastI)+'입니다. '+S.EL_DEEP[c.leastI].part+' 쪽이 먼저 피로를 알립니다.</p>';
  h+=H('지금 할 수 있는 것')+UL([
    '잠드는 시간을 먼저 고정하기 — 이 사주는 수면이 흐트러지면 열이 먼저 오릅니다.',
    S.EL_DEEP[c.yongEl].food+' 쪽으로 식사 한 끼 바꾸기.',
    S.EL_DEEP[c.yongEl].habit
  ]);
  return h+K('한 줄','물과 불의 균형은 <b>잠과 식사</b>에서 먼저 잡힙니다. 약보다 순서가 먼저입니다.');
}
function pg3(R,c,input,name){
  var pc=partnerChart(input),h='';
  if(pc){
    var x=waterFire(R), y=waterFire(pc.R);
    h+='<p>부부의 물·불 균형을 나란히 놓았습니다. 이 사주는 화 '+x.f+' · 수 '+x.w+', 상대는 화 '+y.f+' · 수 '+y.w+'입니다.</p>';
    h+='<p>'+(x.f>y.f?'이 사주가 상대보다 <b>열이 많은 쪽</b>입니다. 준비 기간에는 이 사주가 먼저 몸을 식히고, 상대가 생활의 리듬을 받쳐주는 쪽이 좋습니다.':(y.f>x.f?'상대가 이 사주보다 <b>열이 많은 쪽</b>입니다. 상대의 일정이 과열되면 두 사람 모두 지칩니다. 상대가 쉬는 시간을 먼저 확보하세요.':'두 사람의 열이 비슷합니다. 함께 과열되거나 함께 가라앉기 쉬우니, <b>한 사람이 리듬을 잡는 역할</b>을 정해두세요.'))+'</p>';
    h+=H('부부의 합')+'<p>두 사람의 일지 관계는 <b>'+S.branchRel(R.dBranch,pc.R.dBranch).k+'</b>입니다. '+S.branchRel(R.dBranch,pc.R.dBranch).t+'</p>';
    h+=H('역할을 나누는 법')+'<p>이 사주는 <b>'+c.topGrp+'</b>이 중심이라 준비 과정에서 혼자 다 감당하려는 습관이 나옵니다. 검사·일정·식사 중 하나는 상대에게 맡기세요. 맡기는 것이 이 사주에게는 가장 어려운 준비입니다.</p>';
  } else {
    h+='<p>상대의 생년월일을 넣으면 두 사람의 물·불 균형과 일지 관계까지 함께 볼 수 있습니다. 지금은 이 사주 혼자서 준비할 때의 결을 정리합니다.</p>';
    h+=H('이 사주가 준비 과정에서 무너지는 지점')+'<p>'+S.DM_DEEP[R.dStem].drain+' 그래서 준비 기간에는 <b>혼자 결정하지 않는 규칙</b>이 필요합니다.</p>';
    h+=H('파트너에게 부탁할 것')+UL(['검사 일정 함께 다니기','잠드는 시간 함께 맞추기','식사 한 끼는 함께 먹기']);
  }
  return h+K('한 줄','임신 준비는 <b>두 사람의 생활</b>을 먼저 맞추는 일입니다.');
}
function pg4(R,c,input,name){
  var h=H('비워두면 좋은 달')+'<p>'+risky(R,c,12)+'</p>';
  h+='<p>특히 이 사주는 '+elB(c.leastI)+'이 얇아, '+S.SEASON_RHYTHM[c.leastI][0]+'에 몸이 먼저 지칩니다. '+S.SEASON_RHYTHM[c.leastI][1]+' 이 시기에는 일정을 비워두세요.</p>';
  h+=H('그 달에 할 일')+UL(['큰 일정·이사·여행을 잡지 않기','잠과 식사를 먼저 고정하기','몸의 신호를 기록하기 — 이 사주는 참다가 한 번에 지칩니다']);
  h+=H('피하면 좋은 것')+'<p>일지와 충하는 달의 <b>무리한 일정</b>입니다. 충은 사건이 아니라 <b>변동</b>을 뜻합니다. 변동이 큰 달에 몸의 계획까지 겹치면 회복이 늦어집니다.</p>';
  return h+K('한 줄','몸의 달력은 <b>비워두는 것</b>으로 만들어집니다.');
}
function pg5(R,c,input,name){
  var h=H('몸이 먼저 하는 일')+'<p>이 사주는 무엇을 먼저 해야 하는지 정해두면 지킬 힘이 있습니다. 순서는 <b>잠 → 식사 → 움직임 → 마음</b>입니다.</p>';
  h+='<table class="tbl"><tr><th>단계</th><th>무엇을</th><th>왜</th></tr>'+
     '<tr><td>1</td><td>잠드는 시간 고정</td><td>열이 먼저 오르는 사주라 수면이 기본</td></tr>'+
     '<tr><td>2</td><td>'+S.EL_DEEP[c.yongEl].food+'</td><td>'+S.EL_KO[c.yongEl]+' 기운을 채우는 식사</td></tr>'+
     '<tr><td>3</td><td>'+S.EL_DEEP[c.yongEl].habit+'</td><td>몸의 순환을 만드는 움직임</td></tr>'+
     '<tr><td>4</td><td>한 달에 한 번 정리</td><td>이 사주는 생각이 쌓이면 몸이 먼저 굳습니다</td></tr></table>';
  h+=H('이 사주가 놓치는 것')+'<p>영양제와 검사는 잘 챙기면서 <b>잠과 마음</b>은 뒤로 미룹니다. 순서를 바꾸면 같은 노력이 두 배로 남습니다.</p>';
  return h+K('한 줄','준비는 <b>한 달</b>이면 충분합니다. 대신 매일 같은 시간에 하세요.');
}
function pg6(R,c,input,name){
  var h=H('명리와 의학의 경계')+'<p>사주는 <b>몸의 리듬과 시기</b>를 보여줄 뿐, 임신 가능성이나 건강을 진단하지 않습니다. 실제 계획은 산부인과 상담과 검사 결과를 먼저 두세요.</p>';
  h+=H('사주가 도울 수 있는 것')+UL(['준비 기간의 생활 순서를 정하는 일','부부의 역할을 나누는 일','불안이 커지는 달을 미리 알고 일정을 비워두는 일']);
  h+=H('이 사주에게 특히')+'<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 혼자 결론을 내리려는 경향이 있습니다. 검사 결과를 혼자 해석하지 말고, 반드시 의료진에게 확인하세요.</p>';
  return h+K('한 줄','사주는 <b>준비의 순서</b>를 알려주고, 의학은 <b>사실</b>을 알려줍니다.');
}
function pg7(R,c,input,name){
  return monthsBlock(R,c,'general',12,'앞으로 12개월, 몸과 생활의 흐름입니다.')+
    K('한 줄','몸의 계획은 합의 달에, 결정은 충의 달을 피해서.');
}

/* ---------------- 태교 · 출산 ---------------- */
function tg1(R,c,input,name){
  var sik=S.mod(R.dayEl+1,5);
  var h=H('배 속 아이의 결')+'<p>이 사주에서 아이의 자리는 '+elB(sik)+'입니다. '+S.CHILD_NATURE_EL[sik]+'</p>';
  h+=H('태교의 방향')+'<p>이 사주는 <b>'+S.EL_KO[sik]+'</b>의 결을 배 속에서 먼저 받습니다. '+S.EL_DEEP[sik].color+' 계열, '+S.EL_DEEP[sik].dir+' 방향, '+S.EL_DEEP[sik].food+' 쪽이 태교의 재료가 됩니다.</p>';
  h+=H('엄마의 마음')+'<p>'+S.EL_DEEP[c.leastI].under+' 이 사주는 특히 '+S.SEASON_RHYTHM[c.leastI][0]+'에 마음이 가라앉기 쉽습니다. 그때는 결정을 미루고 몸을 먼저 데우세요.</p>';
  return h+K('한 줄','태교는 <b>엄마의 리듬</b>입니다. 완벽한 것보다 같은 시간에 같은 것을 반복하세요.');
}
function tg2(R,c,input,name){
  var h=H('몸이 문을 여는 달')+'<p>출산 시기는 아이의 사주가 정합니다. 엄마 사주에서는 <b>몸이 문을 여는 달</b>을 봅니다. '+(starMonths(R,input,12).length?('앞으로 12개월 중 <b>'+starMonths(R,input,12).map(function(o){return o.y+'.'+C.n2(o.m);}).join(', ')+'</b>이 그 문에 가깝습니다.'):'앞으로 12개월에는 그 문이 뚜렷하지 않아, 아이의 사주와 병원 일정을 먼저 보세요.')+'</p>';
  h+=H('이 사주가 출산에서 조심할 것')+'<p>이 사주는 <b>'+S.EL_KO[c.leastI]+'</b>이 얇아 회복이 느린 쪽입니다. '+S.EL_DEEP[c.leastI].part+' 쪽이 먼저 피로를 알립니다. 출산 전에 <b>회복 계획</b>을 먼저 세우세요.</p>';
  h+=H('준비물보다 중요한 것')+UL(['조리된 식사 한 끼를 도와줄 사람','산후 2주 동안의 수면 확보','아이와 엄마의 일정을 대신 기억해줄 사람']);
  return h+K('한 줄','출산은 <b>한나절</b>이지만 회복은 <b>한 달</b>입니다.');
}
function tg3(R,c,input,name){
  var h=H('산후 회복의 결')+'<p>산후에는 '+elB(c.leastI)+'이 더 얇아집니다. 이 기운은 타고난 것이 아니라 <b>재료가 적게 들어온 것</b>이라, 일부러 채워주면 회복이 빨라집니다.</p>';
  h+=H('회복의 순서')+UL(['<b>1~2주</b> — 몸을 데우고 움직임을 최소로. '+S.EL_DEEP[c.yongEl].food,'<b>3~4주</b> — 짧은 산책부터. '+S.EL_DEEP[c.yongEl].habit,'<b>2개월</b> — 잠의 리듬을 되찾기. 이 사주는 수면이 회복의 핵심입니다.']);
  h+=H('마음의 회복')+'<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 혼자 감당하려 합니다. “도와주세요”를 말하는 연습이 회복의 절반입니다.</p>';
  return h+K('한 줄','산후 회복은 <b>잠</b>과 <b>온기</b>에서 옵니다.');
}
function tg4(R,c,input,name){
  var h=H('다시 짜이는 분담')+'<p>아이가 오면 집안의 역할이 다시 짜입니다. 이 사주는 <b>'+c.topGrp+'</b>이 중심이라 '+S.GROUP_MEAN[c.topGrp].split('.')[0]+'을 맡기 쉽습니다.</p>';
  h+=H('나눠야 하는 것')+UL(['밤 수유와 낮 돌봄을 나누기','집안일의 기준을 하나로 정하기','양가의 도움을 받을 범위를 정하기']);
  h+=H('이 사주가 놓치는 것')+'<p>배우자와의 대화가 아이 이야기로만 채워집니다. 한 주에 한 번은 <b>아이가 아닌 이야기</b>로 30분을 쓰세요.</p>';
  return h+K('한 줄','역할은 <b>반</b>으로, 마음은 <b>두 배</b>로.');
}
function tg5(R,c,input,name){
  var h=H('이름과 기운')+'<p>이름은 사주를 보완하는 오래된 방법 중 하나입니다. 이 사주에게 필요한 기운은 '+elB(c.yongEl)+'이고, 아이에게는 '+elB(S.mod(R.dayEl+1,5))+'이 자리입니다.</p>';
  h+=H('참고할 것')+UL(['발음보다 <b>뜻</b>이 오래 남습니다','부모 두 사람이 부를 때 어색하지 않은 이름','한자보다 아이가 스스로 쓸 때의 모양']);
  h+=H('이 사주에게')+'<p>이름을 정할 때 조언이 많아집니다. 이 사주는 <b>기준을 정해두면</b> 흔들리지 않습니다. “우리는 이 세 가지만 본다”를 먼저 정하세요.</p>';
  return h+K('한 줄','좋은 이름은 <b>부모가 부를 때 편한 이름</b>입니다.');
}
function tg6(R,c,input,name){
  return monthsBlock(R,c,'general',6,'앞으로 6개월, 가족의 흐름입니다.')+
    K('한 줄','충의 달에는 큰 일정을 피하고, 합의 달에 가족 행사를 잡으세요.');
}

/* ---------------- 자녀 사주 ---------------- */
function chChart(input){ return S.childChart(input); }
function ch1(R,c,input,name){
  var cc=chChart(input),h='';
  if(cc){
    h+='<p>아이의 사주는 <b>'+C.gzP(cc.R.dStem,cc.R.dBranch)+'일주</b>입니다. 일간은 '+stemB(cc.R.dStem)+', 가장 두터운 기운은 '+elB(cc.c.mostI)+'입니다.</p>';
    h+='<p>'+S.CHILD_NATURE_EL[cc.R.dayEl]+'</p>';
    h+=H('아이의 중심 별')+'<p><b>'+cc.c.topGodInGrp+'</b> — '+S.GOD_DEEP[cc.c.topGodInGrp]+'</p>';
    h+=H('아이의 속도')+'<p>'+S.STRENGTH_TXT[cc.R.strength].out+' '+S.STRENGTH_TXT[cc.R.strength].adv+'</p>';
  } else {
    var el=S.mod(R.dayEl+1,5);
    h+='<p>아이의 생년월일이 비어 있어, 이 사주의 자녀성 '+elB(el)+'으로 아이의 결을 읽습니다. 생년월일을 넣으면 그 아이의 원국으로 정확히 풀어드립니다.</p>';
    h+='<p>'+S.CHILD_NATURE_EL[el]+'</p>';
    h+=H('부모가 먼저 알 것')+'<p>이 사주는 아이에게 <b>'+S.EL_PERSON[el]+'</b> 같은 인상을 줍니다. '+S.CHILD_PARENT_REL['give']+'</p>';
  }
  return h+K('한 줄','아이는 부모의 방식으로 빚어지는 존재가 아니라, 자기 결을 가지고 오는 존재입니다.');
}
function ch2(R,c,input,name){
  var cc=chChart(input),h='';
  var el=cc?cc.R.dayEl:S.mod(R.dayEl+1,5);
  var god=cc?cc.c.topGodInGrp:c.topGodInGrp;
  h+=H('재능의 방향')+'<p>'+S.CHILD_TALENT_EL[el]+'</p>';
  h+=H('힘이 나는 상황')+'<p>'+(cc?S.ENV_BY_EL[el]:S.ENV_BY_EL[el])+' — 이 아이는 이 환경에서 가장 오래 집중합니다.</p>';
  h+=H('재능을 키우는 법')+UL(['잘하는 것을 먼저 알아봐 주기','결과보다 <b>과정</b>을 말로 인정하기','한 가지를 오래 하도록 기다리기']);
  h+=H('부모가 조심할 것')+'<p>이 사주는 아이의 재능을 <b>부모의 기준</b>으로 재려는 순간이 있습니다. 아이가 좋아하는 것과 잘하는 것이 다를 수 있습니다.</p>';
  return h+K('한 줄','재능은 <b>반복해서 즐거운 것</b>에서 자랍니다.');
}
function ch3(R,c,input,name){
  var cc=chChart(input);
  var god=cc?cc.c.topGodInGrp:c.topGodInGrp;
  var h=H('공부의 방식')+'<p>'+S.CHILD_STUDY_GOD[god]+'</p>';
  h+=H('집중이 오래 가는 조건')+UL(['앉는 자리와 시간을 고정하기','한 번에 25분, 쉬는 시간을 확실히','설명하게 하기 — 이 아이는 말로 정리할 때 이해가 굳습니다']);
  h+=H('부모가 조심할 것')+'<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 아이를 가르치려는 마음이 앞섭니다. 가르침이 길어지면 아이는 닫힙니다. <b>질문 하나</b>로 끝내세요.</p>';
  return h+K('한 줄','공부는 <b>방식</b>이 맞으면 시간이 줄어듭니다.');
}
function ch4(R,c,input,name){
  var cc=chChart(input);
  var br=cc?cc.R.dBranch:R.dBranch;
  var h=H('사회성의 결')+'<p>'+S.CHILD_SOCIAL_BR[br]+'</p>';
  h+=H('친구 관계')+'<p>이 아이는 '+S.BR_INNER[br].split('.')[0]+' 쪽이라, 친구를 많이 사귀기보다 <b>한두 명과 깊게</b> 지내는 편이 편합니다.</p>';
  h+=H('사춘기의 신호')+UL(['말수가 갑자기 줄어들 때','방문을 닫고 혼자 있는 시간이 길어질 때','친구 이야기를 하지 않을 때']);
  h+=H('부모가 할 일')+'<p>이 시기에는 조언보다 <b>같은 자리에 있어주는 것</b>이 힘이 됩니다. 질문은 하루에 하나로 줄이세요.</p>';
  return h+K('한 줄','사춘기는 <b>문을 닫는 것</b>이 아니라 <b>자기 방을 만드는 것</b>입니다.');
}
function ch5(R,c,input,name){
  var cc=chChart(input),h='';
  if(cc){
    var Rc=cc.R, key;
    if(Rc.dayEl===R.dayEl) key='me';
    else if(S.generates(R.dayEl,Rc.dayEl)) key='give';
    else if(S.generates(Rc.dayEl,R.dayEl)) key='take';
    else if(S.controls(R.dayEl,Rc.dayEl)) key='push';
    else key='pull';
    h+='<p>부모인 '+name+' 님은 '+stemB(R.dStem)+', 아이는 '+stemB(Rc.dStem)+'로 만납니다. '+S.CHILD_PARENT_REL[key]+'</p>';
    var rel=S.branchRel(R.dBranch,Rc.dBranch);
    h+='<p>일지끼리는 <b>'+rel.k+'</b> — '+rel.t+'</p>';
    h+='<p>아이에게 가장 얇은 기운은 '+elB(cc.c.leastI)+'입니다. '+S.EL_DEEP[cc.c.leastI].under+' 부모가 이 결의 환경('+S.EL_DEEP[cc.c.leastI].color+', '+S.EL_DEEP[cc.c.leastI].dir+')을 만들어주는 것이 가장 큰 도움이 됩니다.</p>';
  } else {
    h+='<p>아이의 생년월일을 넣으면 엄마·아빠와의 궁합을 실제 글자로 계산합니다. 지금은 이 사주가 아이와 만나는 자리부터 봅니다.</p>';
    h+='<p>자녀성은 '+elB(S.mod(R.dayEl+1,5))+'이고, 이 사주는 아이에게 <b>'+S.EL_PERSON[S.mod(R.dayEl+1,5)]+'</b> 같은 인상을 줍니다. '+S.CHILD_PARENT_REL['give']+'</p>';
  }
  h+=H('부모-아이 사이의 규칙')+UL(['아이의 말을 <b>끝까지</b> 듣고 조언은 한 번만','하루 15분은 아이가 정하는 시간','아이의 기질을 고치려는 말 대신 그 기질이 살아날 자리 만들기']);
  return h+K('한 줄','아이에게 가장 좋은 것은 <b>부모의 일관된 태도</b>입니다.');
}
function ch6(R,c,input,name){
  var h=H('양육의 원칙')+'<p>이 사주는 <b>'+c.topGrp+'</b>이 중심이라 양육에서도 그 방식이 나옵니다. '+S.GROUP_MEAN[c.topGrp]+'</p>';
  h+=H('규칙은 셋 이내')+'<p>규칙이 많아지면 아이는 지키는 데 에너지를 다 씁니다. 이 사주는 규칙을 <b>정확하게</b> 만드는 편이라, 아이에게는 셋이면 충분합니다.</p>';
  h+=H('칭찬의 방식')+'<p>결과가 아니라 <b>과정</b>을 칭찬하세요. 이 사주가 “잘했어”만 말하면 아이는 결과가 없을 때 시도하지 않습니다. “오늘 끝까지 해봤네.”</p>';
  h+=H('혼내는 방식')+'<p>이 사주는 화가 나면 말이 날카로워집니다. 아이에게는 <b>한 문장</b>이면 충분합니다. 길어지면 아이는 내용이 아니라 표정을 기억합니다.</p>';
  return h+K('한 줄','양육은 <b>기다림</b>입니다. 이 사주에게 가장 어려운 일이자 가장 큰 선물입니다.');
}
function ch7(R,c,input,name){
  return monthsBlock(R,c,'child',12,'앞으로 12개월, 아이의 흐름입니다.')+
    K('한 줄','아이의 일정은 합의 달에, 큰 결정은 충의 달을 피해서.');
}

/* ---------------- 부모·자녀 궁합 (v51 · 엄마·아빠·아이 세 사람) ---------------- */
function pairKey(A,B){
  if(!A||!B) return null;
  if(A.dayEl===B.dayEl) return 'me';
  if(S.generates(A.dayEl,B.dayEl)) return 'give';
  if(S.generates(B.dayEl,A.dayEl)) return 'take';
  if(S.controls(A.dayEl,B.dayEl)) return 'push';
  return 'pull';
}
function paChartTable(R,c,pc,cc){
  var h='<table class="tbl"><tr><th>자리</th><th>일주</th><th>중심 기운</th><th>이 사람의 결</th></tr>';
  h+='<tr><td><b>엄마</b></td><td>'+C.gzP(R.dStem,R.dBranch)+'</td><td>'+c.topGrp+'</td><td style="font-size:13px">'+S.ILJU[R.dIdx][0]+'</td></tr>';
  if(pc) h+='<tr><td><b>아빠</b></td><td>'+C.gzP(pc.R.dStem,pc.R.dBranch)+'</td><td>'+pc.c.topGrp+'</td><td style="font-size:13px">'+S.ILJU[pc.R.dIdx][0]+'</td></tr>';
  if(cc) h+='<tr><td><b>아이</b></td><td>'+C.gzP(cc.R.dStem,cc.R.dBranch)+'</td><td>'+cc.c.topGrp+'</td><td style="font-size:13px">'+S.ILJU[cc.R.dIdx][0]+'</td></tr>';
  h+='</table>';
  return h;
}
function pa1(R,c,input,name){
  var pc=partnerChart(input), cc=chChart(input);
  var h='<p>부모·자녀 궁합은 부부 궁합과 다릅니다. 부부는 <b>같이 사는 관계</b>지만, 부모와 아이는 <b>한쪽이 기르고 한쪽이 자라는 관계</b>입니다. 그래서 세 사람의 사주를 나란히 놓고 <b>누가 무엇을 채워주고, 어디서 부딪히는지</b>를 봅니다.</p>';
  h+=paChartTable(R,c,pc,cc);
  h+='<p>이 사주(엄마)는 <b>'+c.topGrp+'</b>이 중심이라 '+S.GROUP_MEAN[c.topGrp].split('.')[0]+' 역할을 맡기 쉽습니다. '+S.GROUP_MEAN[c.topGrp]+'</p>';
  if(pc) h+='<p>아빠는 <b>'+pc.c.topGrp+'</b>이 중심입니다. '+(pc.c.topGrp===c.topGrp?'두 사람이 같은 결이라 양육의 방향을 정하기는 쉬운 대신, <b>같은 약점이 같이 드러납니다.</b>':'두 사람의 중심이 달라서, 같은 아이를 보면서도 <b>중요하게 여기는 것</b>이 다릅니다. 이 차이가 양육 갈등의 대부분입니다.')+'</p>';
  else h+='<p>아빠의 생년월일을 넣으면 두 사람의 결과 아이의 자리까지 함께 놓고 볼 수 있습니다. 지금은 엄마와 아이의 자리부터 읽습니다.</p>';
  if(cc) h+='<p>아이는 <b>'+cc.c.topGrp+'</b>이 중심입니다. '+S.GROUP_MEAN[cc.c.topGrp]+' 부모의 결과 다른 이 별이, 아이가 <b>혼자서도 서는 힘</b>입니다.</p>';
  else h+='<p>아이의 생년월일을 넣으면 아이의 원국을 세 번째로 놓고 함께 읽습니다. 지금은 부모 두 사람의 결이 아이에게 닿는 방식부터 봅니다.</p>';
  h+=H('세 사람을 읽는 순서');
  h+='<p>먼저 <b>부모 두 사람의 결</b>을 봅니다. 그다음 <b>엄마와 아이</b>, <b>아빠와 아이</b>를 따로 봅니다. 마지막으로 세 사람이 함께 있을 때 <b>누가 무엇을 맡아야 하는지</b>를 정합니다. 순서를 바꾸면 결론이 흔들립니다.</p>';
  return h+K('한 줄','세 사람이 모두 같은 방향을 볼 필요는 없습니다. <b>역할이 다르면 같은 편</b>이 됩니다.');
}
function pa2(R,c,input,name){
  var cc=chChart(input);
  var h=H('엄마와 아이 — 여덟 글자로 보는 사이');
  if(cc){
    var Rc=cc.R, key=pairKey(R,Rc);
    h+='<p>엄마는 '+stemB(R.dStem)+', 아이는 '+stemB(Rc.dStem)+'로 만납니다. '+S.CHILD_PARENT_REL[key]+'</p>';
    var rel=S.branchRel(R.dBranch,Rc.dBranch);
    h+='<p>생활의 자리(일지)끼리는 <b>'+rel.k+'</b> — '+rel.t+' 이 관계는 말보다 <b>하루의 리듬</b>에서 드러납니다. 같이 밥을 먹고, 같이 잠드는 시간에서 갈리거나 붙습니다.</p>';
    h+='<p>아이에게 가장 얇은 기운은 '+elB(cc.c.leastI)+'입니다. '+S.EL_DEEP[cc.c.leastI].under+' 엄마가 이 결의 환경('+S.EL_DEEP[cc.c.leastI].color+', '+S.EL_DEEP[cc.c.leastI].dir+')을 만들어주는 것이 가장 큰 도움이 됩니다.</p>';
    h+=H('이 아이에게 엄마가 하는 말');
    h+='<p>'+S.EL_KO[cc.R.dayEl]+'의 결을 가진 아이에게는 <b>'+S.EL_PERSON[cc.R.dayEl]+'</b> 같은 인상이 남습니다. 그래서 같은 말도 <b>어떤 톤으로</b> 하느냐가 오래 남습니다. 이 아이는 '+S.CHILD_NATURE_EL[cc.R.dayEl].split('.')[0]+' 쪽이라, 지적보다 <b>인정하는 한 문장</b>이 오래 갑니다.</p>';
  } else {
    var el=S.mod(R.dayEl+1,5);
    h+='<p>아이의 생년월일을 넣으면 엄마와 아이의 일간·일지까지 실제 글자로 계산합니다. 지금은 이 사주의 자녀성 '+elB(el)+'으로 아이의 결을 읽습니다.</p>';
    h+='<p>'+S.CHILD_NATURE_EL[el]+' 이 사주는 아이에게 <b>'+S.EL_PERSON[el]+'</b> 같은 인상을 줍니다. '+S.CHILD_PARENT_REL['give']+'</p>';
  }
  h+=H('엄마가 놓치기 쉬운 것');
  h+='<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 '+S.GROUP_MEAN[c.topGrp].split('.')[0]+' 쪽으로 먼저 나섭니다. 그래서 아이가 <b>조용히 다른 방향</b>을 택할 때 알아채기 늦습니다. 하루에 한 번, 아이가 정한 것을 그대로 따라가 보세요.</p>';
  return h+K('한 줄','엄마와 아이의 궁합은 <b>설명보다 반복</b>으로 만들어집니다.');
}
function pa3(R,c,input,name){
  var pc=partnerChart(input), cc=chChart(input);
  var h=H('아빠와 아이 — 여덟 글자로 보는 사이');
  if(pc&&cc){
    var key=pairKey(pc.R,cc.R), rel=S.branchRel(pc.R.dBranch,cc.R.dBranch);
    h+='<p>아빠는 '+stemB(pc.R.dStem)+', 아이는 '+stemB(cc.R.dStem)+'로 만납니다. '+S.CHILD_PARENT_REL[key]+'</p>';
    h+='<p>일지끼리는 <b>'+rel.k+'</b> — '+rel.t+'</p>';
    h+='<p>아빠의 중심 기운은 <b>'+pc.c.topGrp+'</b>, 아이의 중심은 <b>'+cc.c.topGrp+'</b>입니다. '+(pc.c.topGrp===cc.c.topGrp?'같은 결이라 통하는 대화가 빠르고, 대신 <b>둘만 있으면 같은 방식으로 막히기도</b> 합니다.':'다른 결이라 아빠가 당연하게 여기는 것을 아이는 낯설어할 수 있습니다. 아빠가 <b>설명을 한 번 더</b> 붙이면 아이가 훨씬 편해집니다.')+'</p>';
    h+=H('아빠가 힘을 실어주는 자리');
    h+='<p>아이에게 가장 얇은 기운은 '+elB(cc.c.leastI)+'입니다. 아빠의 강한 기운이 '+elB(pc.c.mostI)+'이라면, 아이는 그 기운을 <b>가끔은 버겁게</b> 느낍니다. 같이 있는 시간에 아빠가 '+S.EL_DEEP[cc.c.leastI].habit+' 같은 <b>아이 쪽 결의 행동</b>을 먼저 해보세요. 아이는 말보다 그 장면을 기억합니다.</p>';
  } else if(pc){
    h+='<p>아이의 생년월일을 넣으면 아빠와 아이의 일간·일지까지 실제 글자로 계산합니다. 지금은 아빠의 결이 아이에게 닿을 자리부터 봅니다. 아빠의 중심은 <b>'+pc.c.topGrp+'</b>입니다.</p>';
  } else {
    h+='<p>아빠의 생년월일을 넣으면 아빠와 아이의 궁합을 계산합니다. 지금은 엄마의 사주로 보는 아빠의 자리입니다. 이 사주에게 아빠는 <b>'+(c.grp['관성']>=3?'기준을 세우는 사람':(c.grp['재성']>=3?'생활을 책임지는 사람':'같이 놀아주는 사람'))+'</b>으로 기억되기 쉽습니다.</p>';
  }
  h+=H('아빠와 아이 사이의 규칙')+UL([
    '아이 앞에서 엄마의 방식을 평가하지 않기 — 아이는 두 사람을 다르게 보지 않습니다',
    '하루 15분은 아이가 정하는 시간으로 — 무엇을 할지 아이가 고르게',
    '아빠가 정한 규칙은 셋을 넘기지 않기 — 넘으면 아이는 규칙이 아니라 표정을 기억합니다'
  ]);
  return h+K('한 줄','아빠의 궁합은 <b>같이 있는 시간의 밀도</b>로 결정됩니다.');
}
function pa4(R,c,input,name){
  var pc=partnerChart(input);
  var h=H('부모 두 사람 사이의 결');
  if(pc){
    var key=pairKey(R,pc.R), rel=S.branchRel(R.dBranch,pc.R.dBranch);
    h+='<p>엄마 '+stemB(R.dStem)+', 아빠 '+stemB(pc.R.dStem)+' — '+ (key==='me'?'같은 오행이라 설명하지 않아도 통합니다. 대신 <b>같은 약점</b>이 같이 올라옵니다.':(key==='give'?'엄마의 기운이 아빠를 살리는 구조입니다. 엄마가 챙기는 만큼 아빠가 안정됩니다.':(key==='take'?'아빠의 기운이 엄마를 살리는 구조입니다. 아빠 곁에서 엄마가 회복됩니다.':(key==='push'?'엄마의 기운이 아빠를 누르는 구조입니다. 엄마가 방향을 정하기 쉽고, 아빠는 말수가 줄어듭니다.':'아빠의 기운이 엄마를 누르는 구조입니다. 엄마가 맞추는 쪽이 되기 쉽습니다.'))))+'</p>';
    h+='<p>일지끼리는 <b>'+rel.k+'</b> — '+rel.t+' 부부의 일지 관계는 아이 앞에서 드러나는 <b>분위기</b>를 만듭니다. 아이는 내용을 이해하지 못해도 이 분위기를 먼저 기억합니다.</p>';
  } else {
    h+='<p>아빠의 생년월일을 넣으면 두 사람의 궁합을 실제 글자로 계산합니다. 지금은 이 사주가 배우자에게 기대는 방식부터 봅니다. '+S.GROUP_MEAN[c.topGrp]+'</p>';
  }
  h+=H('아이 앞에서의 다툼');
  h+='<p>이 사주는 화가 나면 말이 날카로워집니다('+S.CONFLICT_BY_EL[R.dayEl].split('.')[0]+'). 아이 앞에서의 다툼은 <b>내용보다 분위기</b>가 오래 남습니다. 싸움이 길어질 것 같으면 자리를 옮기세요. 아이는 “엄마 아빠가 싸웠다”가 아니라 <b>“우리 집이 불안하다”</b>로 기억합니다.</p>';
  h+=H('같은 편이 되는 법')+UL([
    '<b>결론 전에 말하기</b> — 이 사주는 혼자 정리한 뒤에 말하는 편이라, 배우자는 늘 뒤늦게 압니다',
    '아이 앞에서 “다시 이야기해볼게”라고 말하기 — 이 한 문장이 아이를 안심시킵니다',
    '한 달에 한 번, 아이가 아닌 이야기로 30분'
  ]);
  return h+K('한 줄','아이는 부모가 <b>서로를 대하는 방식</b>을 배웁니다.');
}
function pa5(R,c,input,name){
  var pc=partnerChart(input), cc=chChart(input);
  var h=H('아이에게 필요한 기운 — 세 사람을 겹쳐서');
  var need=[];
  if(cc) need.push({who:'아이', el:cc.c.leastI, cnt:cc.R.count[cc.c.leastI]});
  if(pc) need.push({who:'아빠', el:pc.c.leastI, cnt:pc.R.count[pc.c.leastI]});
  need.push({who:'엄마', el:c.leastI, cnt:R.count[c.leastI]});
  h+='<p>부모·자녀 궁합에서 가장 쓸모 있는 계산은 <b>세 사람의 얇은 기운</b>을 겹쳐 보는 것입니다. 가족 안에서 한 기운이 비면, 그 자리는 대개 <b>누군가의 소모</b>로 채워집니다.</p>';
  h+='<table class="tbl"><tr><th>자리</th><th>얇은 기운</th><th>가족 안에서</th></tr>';
  need.forEach(function(n){
    h+='<tr><td><b>'+n.who+'</b></td><td>'+elB(n.el)+'</td><td style="font-size:13px">'+S.EL_DEEP[n.el].under+'</td></tr>';
  });
  h+='</table>';
  var same=need.length>1&&need.every(function(n){return n.el===need[0].el;});
  h+='<p>'+(same?'세 사람의 얇은 기운이 <b>같은 '+S.EL_KO[need[0].el]+'</b>입니다. 이 가족에게 '+S.EL_DEEP[need[0].el].habit+' 같은 습관 하나가 세 사람을 동시에 채웁니다. ':'얇은 기운이 서로 다릅니다. 그래서 한 사람이 다른 사람의 빈자리를 대신 채우기 쉽습니다. <b>대신 채우는 것은 오래 가지 못합니다.</b> ')+'가족 전체의 환경으로 채우는 쪽이 훨씬 오래 갑니다 — '+S.EL_DEEP[need[0].el].color+', '+S.EL_DEEP[need[0].el].dir+', '+S.EL_DEEP[need[0].el].space+'.</p>';
  h+=H('집 안에서 바로 바꿀 수 있는 것')+UL([
    '아이 방의 방향과 조명을 '+S.EL_DEEP[need[0].el].dir+' 쪽으로',
    '주말 한 끼는 '+S.EL_DEEP[need[0].el].food+' 쪽으로',
    '가족이 같이 걷는 시간 — '+S.EL_KO[need[0].el]+'은 움직임에서 채워집니다'
  ]);
  return h+K('한 줄','가족의 빈 기운은 <b>한 사람의 희생</b>이 아니라 <b>집의 환경</b>으로 채우세요.');
}
function pa6(R,c,input,name){
  var pc=partnerChart(input), cc=chChart(input);
  var h=H('역할을 나누는 법 — 누가 무엇을 맡으면 좋은가');
  var rows=[];
  function pick(label, fn){ rows.push({label:label, who:fn()}); }
  var momStrong=(c.grp['관성']+c.grp['인성'])>=2;
  pick('생활·규칙', function(){ return momStrong?'엄마':'아빠'; });
  pick('공부·대화', function(){ return (c.grp['식상']>=c.grp['인성'])?'엄마':'아빠'; });
  pick('놀이·감정', function(){ if(cc) return (S.generates(cc.R.dayEl,R.dayEl)?'엄마':(S.generates(cc.R.dayEl,pc?pc.R.dayEl:R.dayEl)?'아빠':'아이의 속도를 기다릴 수 있는 쪽')); return '아이의 속도를 기다릴 수 있는 쪽'; });
  pick('큰 결정', function(){ return '두 사람이 함께, 하루 쉬고'; });
  h+='<table class="tbl"><tr><th>역할</th><th>맡기면 좋은 쪽</th></tr>';
  rows.forEach(function(r){ h+='<tr><td><b>'+r.label+'</b></td><td>'+r.who+'</td></tr>'; });
  h+='</table>';
  h+='<p>이 표는 <b>잘하는 쪽</b>을 적은 것이지, <b>못하는 쪽</b>을 뺀 것이 아닙니다. 이 사주는 '+S.GROUP_MEAN[topGrpOf(c)].split('.')[0]+' 역할을 계속 맡는 편이라, 반대 역할을 <b>한 달에 한 번</b> 바꿔보면 아이가 두 사람을 다르게 보지 않습니다.</p>';
  if(pc&&cc){
    var gap=Math.abs(pc.c.grp['관성']-c.grp['관성']);
    h+='<p>두 사람의 관성 차이는 <b>'+gap+'</b>입니다. '+(gap>=2?'한쪽이 기준을 세우고 다른 쪽이 풀어주는 구조가 자연스럽습니다. 다만 <b>기준이 한 사람에게만 몰리면</b> 그 사람이 먼저 지칩니다.':'관성 차이가 작아 규칙을 만드는 힘이 비슷합니다. 규칙을 만드는 일은 <b>한 사람이 정해서 알려주는</b> 쪽이 낫습니다.')+'</p>';
  }
  h+='<p>역할을 정할 때는 <b>“무엇을 맡을지”보다 “언제 쉴지”</b>를 같이 정하세요. 이 가족은 쉬는 날을 정해두지 않으면 한 사람이 계속 서 있게 됩니다.</p>';
  return h+K('한 줄','역할은 고정하지 말고 <b>돌아가며</b> 맡으세요. 아이는 그걸 보고 배웁니다.');
}
function topGrpOf(c){ return c.topGrp; }
function pa7(R,c,input,name){
  return monthsBlock(R,c,'child',6,'앞으로 6개월, 이 가족의 리듬입니다.')+
    K('한 줄','가족 행사는 합의 달에, 아이의 큰 일정은 충의 달을 피하세요.');
}

window.CTP.baby={
  /* 임신운 + 태교·출산 → 임신·출산운 (한 탭으로 합침) */
  birth:[
    {title:'임신이 열리는 해',sub:'자녀성이 들어오는 때',lead:'아이는 계획대로 오지 않습니다. 다만 몸과 생활이 준비된 해에 더 자연스럽게 옵니다.',body:pg1},
    {title:'물과 불의 균형',sub:'몸이 먼저 알리는 신호',lead:'몸은 온도로 말합니다. 이 사주가 차가운 쪽인지 뜨거운 쪽인지 먼저 알아야 합니다.',body:pg2},
    {title:'부부의 합',sub:'준비는 두 사람의 생활',lead:'임신은 한 사람의 일이 아닙니다. 두 사람의 생활이 먼저 맞아야 몸도 따라옵니다.',body:pg3},
    {title:'조심할 달',sub:'비워두어야 하는 시기',lead:'비워두어야 하는 달이 있습니다. 그 달에 무리하면 몸이 먼저 신호를 보냅니다.',body:pg4},
    {title:'준비의 순서',sub:'잠 → 식사 → 움직임',lead:'잠 → 식사 → 움직임 → 마음. 이 순서를 바꾸면 같은 노력이 두 배로 듭니다.',body:pg5},
    {title:'태교의 결',sub:'배 속 아이의 기운',lead:'태교는 음악을 듣는 일이 아니라, 엄마의 하루를 정돈하는 일입니다.',body:tg1},
    {title:'출산의 흐름',sub:'문이 열리는 달',lead:'출산의 달은 아이가 정한다고들 합니다. 그래도 흐름을 알면 마음이 덜 급해집니다.',body:tg2},
    {title:'산후 회복',sub:'잠과 온기',lead:'산후 100일은 회복이 아니라 재건입니다. 이 사주가 먼저 지치는 부위가 정해져 있습니다.',body:tg3},
    {title:'가족의 역할',sub:'다시 짜이는 분담',lead:'아이가 오면 가족의 역할이 다시 짜입니다. 미리 말해두지 않으면 서운함으로 쌓입니다.',body:tg4},
    {title:'12개월의 몸',sub:'달별 흐름',lead:'올해 몸이 흔들리는 달과 회복되는 달을 한눈에.',body:pg7}
  ],
  child:[
    {title:'아이의 기질',sub:'타고난 결',lead:'아이는 부모의 복사본이 아닙니다. 태어난 날의 여덟 글자가 그 아이만의 속도를 정합니다.',body:ch1},
    {title:'재능의 방향',sub:'힘이 나는 상황',lead:'재능은 잘하는 것이 아니라, 지치지 않고 오래 하는 것입니다.',body:ch2},
    {title:'공부의 방식',sub:'집중이 오래 가는 조건',lead:'같은 1시간이라도 어떤 아이는 앉아서, 어떤 아이는 움직이며 배웁니다.',body:ch3},
    {title:'사회성과 사춘기',sub:'친구와 방문',lead:'사춘기는 반항이 아니라 자기 자리를 찾는 과정입니다.',body:ch4},
    {title:'부모와의 합',sub:'두 사람이 만나는 자리',lead:'부모와 아이의 사주가 만나는 자리를 보면, 어디서 부딪히는지 미리 알 수 있습니다.',body:ch5},
    {title:'양육의 원칙',sub:'규칙 셋, 칭찬은 과정',lead:'규칙 셋, 칭찬은 과정. 이 두 가지만 지켜도 아이는 흔들리지 않습니다.',body:ch6},
    {title:'12개월의 아이',sub:'달별 흐름',lead:'올해 아이가 유난히 예민해지는 달, 마음이 열리는 달.',body:ch7}
  ],
  parent:[
    {title:'세 사람의 원국',sub:'엄마·아빠·아이가 만나는 자리',lead:'엄마·아빠·아이는 세 개의 사주가 한 지붕에서 만나는 일입니다.',body:pa1},
    {title:'엄마와 아이',sub:'일간·일지로 보는 사이',lead:'엄마와 아이의 사주가 만나는 자리가 관계의 온도를 정합니다.',body:pa2},
    {title:'아빠와 아이',sub:'힘을 실어주는 자리',lead:'아빠가 힘을 실어주는 자리와, 아빠가 조심해야 할 자리가 따로 있습니다.',body:pa3},
    {title:'부모 두 사람 사이',sub:'아이 앞에서의 분위기',lead:'아이는 두 사람 사이의 공기를 그대로 마십니다.',body:pa4},
    {title:'아이에게 필요한 기운',sub:'세 사람을 겹쳐서',lead:'세 사람의 사주를 겹쳐보면 아이에게 모자란 기운이 보입니다.',body:pa5},
    {title:'역할을 나누는 법',sub:'고정하지 말고 돌아가며',lead:'역할은 고정하지 말고 돌아가며 맡는 편이 오래 갑니다.',body:pa6},
    {title:'6개월의 가족',sub:'달별 흐름',lead:'지금부터 6개월, 가족의 공기가 바뀌는 달.',body:pa7}
  ]
};
})();
