/* =====================================================================
   천령당 인생설계서 — 시간의 지도 (30년 대운 · 5년 세운 · 2027 월력)
   + 개운 처방 · 맞춤 질문 · 검수 서명 · 부록
   ===================================================================== */
(function(){
'use strict';
var S=window.SJ, B=window.BOOK;
var M={};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function n2(n){return n<10?'0'+n:''+n;}
function elK(i){return S.EL_KO[i]+'('+S.EL_HAN[i]+')';}
function elS(i){return '<b>'+S.EL_KO[i]+'</b>('+S.EL_HAN[i]+')';}
function stemS(s){return S.STEM_HAN[s]+'('+S.STEM_KO[s]+')';}
function brS(b){return S.BR_HAN[b]+'('+S.BR_KO[b]+')';}
function page(label,body,opt){
  opt=opt||{};
  return '<section class="pg"><div class="pg-hd"><span class="l">天靈堂 · LIFE DESIGN REPORT</span><span class="r">'+label+'</span></div>'+
    '<div class="pg-bd'+(opt.spread?' spread':'')+'">'+body+'</div>'+
    '<div class="pg-ft"><span>天靈堂 · 인생설계서</span><span class="pn">__PN__</span></div></section>';
}
function push(h){ B.pages.push(h); }
function chapter(key,no,title,sub){ B.chapters.push({key:key,no:no,title:title,sub:sub,page:B.pages.length+1}); }
function secLabel(no,label){ return '<div class="sec-label"><span>'+no+'</span>'+label+'</div>'; }
function callout(t,b){ return '<div class="callout"><div class="ct">'+t+'</div>'+b+'</div>'; }

var DAEUN_GROUP={
 '비겁':'내 힘을 쓰는 10년입니다. 자존심과 독립심이 앞에 서고, 동료·경쟁자와의 관계가 삶의 중심이 됩니다. 이 10년에 남는 것은 <b>내 이름으로 만든 것</b>입니다.',
 '식상':'내가 만든 것이 밖으로 나가는 10년입니다. 재능·표현·기술이 평가받고, 만들고 가르치고 파는 일이 힘을 받습니다. 이 10년에 남는 것은 <b>작품과 기록</b>입니다.',
 '재성':'돈과 현실이 구체적으로 움직이는 10년입니다. 수입의 구조가 바뀌고, 계약·정산·투자가 일상이 됩니다. 이 10년에 남는 것은 <b>현금흐름과 자산</b>입니다.',
 '관성':'책임과 자리가 따라오는 10년입니다. 조직·자격·계약이 중요해지고, 나를 규율하는 것이 오히려 나를 키웁니다. 이 10년에 남는 것은 <b>직함과 신뢰</b>입니다.',
 '인성':'배우고 보호받는 10년입니다. 공부·휴식·사람의 도움이 힘이 되고, 결정이 늦어지기 쉽습니다. 이 10년에 남는 것은 <b>실력과 사람</b>입니다.'
};
var DAEUN_FIELD={
 '비겁':{money:'수입이 내 이름과 함께 움직입니다. 동업·공동 작업은 몫을 문서로 남기세요.',work:'내 일을 세우기 좋습니다. 다만 혼자 다 하려는 습관이 나오면 사람을 잃습니다.',love:'각자의 자리를 확인하는 10년입니다. 가까울수록 예의를 지키세요.',health:'힘이 넘치는데 풀 곳이 없으면 고집과 불면으로 나타납니다. 몸을 쓰는 운동이 필요합니다.'},
 '식상':{money:'기술·콘텐츠가 돈이 됩니다. 만든 것을 밖으로 꺼낼수록 유리합니다.',work:'표현과 창작의 10년입니다. 규칙이 강한 조직보다 결과로 평가받는 곳이 맞습니다.',love:'말과 표현이 늘어 관계가 가벼워지고 즐거워집니다. 다만 말이 앞서 오해가 생깁니다.',health:'에너지 소모가 큽니다. 잠과 식사를 고정하지 않으면 3년 뒤에 체력이 꺾입니다.'},
 '재성':{money:'수입의 그릇이 커지는 10년입니다. 벌이를 키우되 새는 곳을 먼저 막으세요.',work:'영업·구매·유통·금융처럼 돈이 도는 일이 맞습니다. 성과가 숫자로 보이는 자리가 좋습니다.',love:'현실적인 조건이 관계의 중심이 됩니다. 데이트보다 생활이 중요해집니다.',health:'일과 돈에 몰두하면 허리와 소화가 먼저 상합니다. 하루 한 끼는 꼭 따뜻하게.'},
 '관성':{money:'자리가 돈을 만듭니다. 안정된 수입이 늘고, 큰 지출은 신중해집니다.',work:'승진·자격·책임이 따라옵니다. 압박을 버티면 단단해지고, 안고 있으면 병이 됩니다.',love:'관계의 이름이 정해지고 책임이 커집니다. 결혼·양가 일정이 중심에 옵니다.',health:'압박이 몸으로 옵니다. 어깨·목·혈압을 먼저 보세요. 이 10년은 휴가를 일정에 먼저 넣어야 합니다.'},
 '인성':{money:'큰 투자보다 실력을 사는 쪽이 남습니다. 배움에 쓴 돈이 10년 뒤 자산이 됩니다.',work:'연구·교육·상담·기획처럼 배운 것이 곧 일이 되는 자리가 맞습니다. 결정이 늦어지는 것이 유일한 약점입니다.',love:'마음이 안으로 깊어집니다. 혼자 생각이 길어지니 결론 전에 한 번은 물어보세요.',health:'몸이 예민해지고 잠이 많아집니다. 움직임을 일부러 넣지 않으면 기운이 가라앉습니다.'}
};
var SEUN_FIELD={
 '비겁':{money:'내 이름으로 돈이 움직입니다. 동업은 몫을 먼저 정하세요.',work:'새 일을 시작하기 좋습니다. 다만 기존 업무를 정리하지 않으면 겹칩니다.',love:'모임에서 사람이 늘어납니다. 친구와 겹치는 인연은 순서를 지키세요.',health:'에너지가 넘쳐 무리하기 쉽습니다. 수면 시간만은 지키세요.'},
 '겁재':{money:'사람을 통해 돈이 오가지만 계산이 흐려지기 쉽습니다. 장부를 쓰세요.',work:'함께하는 일이 커집니다. 역할을 글로 남기지 않으면 3개월 뒤에 다툽니다.',love:'소개·모임이 늘어납니다. 다만 경쟁과 질투가 생기기 쉬운 해입니다.',health:'술자리와 모임이 늘면 간과 수면이 먼저 지칩니다.'},
 '식신':{money:'좋아하는 일이 밥벌이가 되는 해입니다. 취미를 수입 구조로 연결해보세요.',work:'배우고 익힌 것을 밖으로 꺼내기 좋습니다. 결과물을 남기세요.',love:'편안함이 매력이 되는 해입니다. 다만 설렘을 표현하지 않으면 친구로 남습니다.',health:'식사와 수면이 좋아지는 해입니다. 이때 만든 리듬을 다음 해로 가져가세요.'},
 '상관':{money:'재능이 돈이 되지만 말로 인한 지출도 늘어납니다. 구설을 조심하세요.',work:'표현·기획·강의가 빛나는 해입니다. 윗사람과의 말이 부딪히기 쉬우니 속도를 늦추세요.',love:'말과 매력이 살아나는 해입니다. 다만 시험하는 말은 관계를 식힙니다.',health:'잠이 얕고 목이 먼저 상합니다. 말을 많이 하는 시기라 목 관리가 필요합니다.'},
 '편재':{money:'큰 돈의 흐름이 보이는 해입니다. 기회가 오지만 씀씀이도 함께 커집니다.',work:'판이 넓어지는 해입니다. 새 시장·새 사람을 만나되 검증을 먼저 하세요.',love:'만남이 구체적으로 잡히는 해입니다. 계획이 많은 사람과 잘 맞습니다.',health:'일정이 과열되면 소화와 허리가 먼저 신호를 보냅니다.'},
 '정재':{money:'차곡차곡 쌓이는 해입니다. 저축·계약·자격처럼 남는 일에 힘을 쓰세요.',work:'성실함이 평가받는 해입니다. 큰 변화보다 한 우물을 깊게 파세요.',love:'관계가 안정되고 현실적인 이야기가 오갑니다. 조건을 솔직하게 말해도 좋은 해입니다.',health:'규칙적인 생활이 몸을 살립니다. 이 해에 만든 루틴이 10년을 지탱합니다.'},
 '편관':{money:'돈이 압박으로 느껴지는 해입니다. 큰 지출과 보증을 피하세요.',work:'책임이 커지고 위기 대응이 필요한 해입니다. 버티면 단단해집니다.',love:'관계에 긴장이 생깁니다. 상대를 몰아붙이면 닫힙니다.',health:'가장 조심해야 하는 해입니다. 혈압·수면·어깨를 먼저 보세요.'},
 '정관':{money:'안정된 수입이 늘고 자리가 돈을 만듭니다. 공적인 절차가 유리합니다.',work:'시험·승진·계약에 좋은 해입니다. 서류를 준비하세요.',love:'관계의 이름이 정해지는 해입니다. 결혼·약속 이야기가 오갑니다.',health:'규칙이 몸을 지켜줍니다. 다만 긴장이 목과 어깨에 쌓입니다.'},
 '편인':{money:'큰 지출보다 준비의 해입니다. 공부·자격에 쓴 돈이 남습니다.',work:'혼자 깊어지는 해입니다. 새 일보다 정리와 연구에 쓰세요.',love:'생각이 길어지는 해입니다. 결론을 미루되 연락은 끊지 마세요.',health:'잠이 많아지고 기운이 가라앉습니다. 햇빛과 걷기가 약입니다.'},
 '정인':{money:'도움과 지원이 따르는 해입니다. 사람의 제안을 받아들이세요.',work:'배움과 보호의 해입니다. 자격·연수·멘토링이 좋습니다.',love:'돌봄이 사랑으로 느껴지는 해입니다. 다만 참기만 하면 서운함이 쌓입니다.',health:'회복에 좋은 해입니다. 충분히 자고 잘 먹으면 10년의 체력이 달라집니다.'}
};

/* ---------------- 9장 대운 ---------------- */
function daeunIntro(){
  var R=B.R,c=B.c;
  push(page('15 / DAEWOON',secLabel('15','DAEWOON · 30년 대운')+'<h1>10년마다 바뀌는<br><span class="accent">판의 방향</span></h1>'+
    '<p class="lead">대운은 10년 단위로 바뀌는 큰 흐름입니다. 사주의 그릇은 타고나는 것이고, 언제 그 그릇을 쓰게 되는지는 대운이 정합니다.</p>'+
    '<p>이 사주는 '+R.daeunSu+'세에 첫 대운을 시작으로 아홉 구간을 지납니다. 지금은 <b>'+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세</b> 구간, 그중 '+(R.age-R.daeun[R.curDaeun].from+1)+'년 차입니다.</p>'+
    '<table><tr><th>나이</th><th>간지</th><th>십성</th><th>이 10년에 남는 것</th></tr>'+
    (function(){var h='';R.daeun.forEach(function(d){
      var g=S.tenGod(R.dStem,d.idx%10);
      var keep={'비겁':'내 이름으로 만든 것','식상':'작품과 기록','재성':'현금흐름과 자산','관성':'직함과 신뢰','인성':'실력과 사람'}[S.GOD_GROUP[g]];
      h+='<tr><td class="k">'+d.from+'~'+d.to+'</td><td>'+S.STEM_HAN[d.idx%10]+S.BR_HAN[d.idx%12]+'</td><td>'+g+'</td><td>'+keep+'</td></tr>';});return h;})()+'</table>'+
    '<p>대운이 바뀌는 실제 변화는 <b>그 전후 2년</b>에 걸쳐 옵니다. 그래서 표의 나이는 “몇 살에 딱 바뀐다”기보다 “그 무렵부터 판이 달라진다”로 읽으세요.</p>'+
    callout('대운을 읽는 순서','<p>1. 지금 구간의 십성을 확인한다. 2. 그 십성이 내 사주에서 어떤 재료인지 본다. 3. 다음 구간의 재료를 미리 준비한다. 이 세 단계면 충분합니다.</p>'),{spread:true}));
  chapter('daeun','15','30년 대운','9구간 · 10년마다');
}
function daeunCycle(i){
  var R=B.R,c=B.c,d=R.daeun[i],g=S.tenGod(R.dStem,d.idx%10),grp=S.GOD_GROUP[g];
  var el=S.STEM_EL[d.idx%10], brEl=S.BR_EL[d.idx%12];
  var F=DAEUN_FIELD[grp];
  var rel=S.branchRel(R.dBranch,d.idx%12);
  var label='15 / DAEWOON';
  /* A */
  push(page(label,secLabel('15','DAEWOON · '+(i+1)+' / 9')+
    '<h1><span class="accent">'+d.from+'~'+d.to+'세</span><br>'+S.STEM_HAN[d.idx%10]+S.BR_HAN[d.idx%12]+' · '+g+'</h1>'+
    '<p class="lead">'+(S.GOD_DAEUN[g]||'')+'</p>'+
    '<div style="margin:2mm 0 4mm"><span class="tag">'+grp+'</span><span class="tag navy">'+elK(el)+'</span><span class="tag navy">지지 '+elK(brEl)+'</span><span class="tag soft">일지와 '+rel.k+'</span>'+(i===R.curDaeun?'<span class="tag">지금</span>':'')+'</div>'+
    '<h3>이 10년의 재료</h3><p>'+DAEUN_GROUP[grp]+'</p>'+
    '<p>'+S.GROUP_MEAN[grp]+' 천간 '+stemS(d.idx%10)+'은 '+S.EL_DEEP[el].over+'</p>'+
    '<p>'+S.BR_INNER[d.idx%12]+'</p>'+
    '<h3>일지와의 관계</h3><p>이 대운의 지지는 내 일지 '+brS(R.dBranch)+'와 <b>'+rel.k+'</b>입니다. '+rel.t+'</p>'+
    callout('이 10년의 한 줄','<p>'+S.GOD_KEY[g]+'의 10년 — '+({비겁:'내 이름으로 만든 것',식상:'작품과 기록',재성:'현금흐름과 자산',관성:'직함과 신뢰',인성:'실력과 사람'}[grp])+'이 남습니다.</p>'),{spread:true}));
  /* B */
  var years='';
  for(var y=R.y+d.from;y<=R.y+d.to;y++){
    var idx=S.mod(y-4,60), gg=S.tenGod(R.dStem,idx%10);
    var diff=S.mod(idx%12-R.dBranch,12);
    var tag=(diff===6?'충':(diff===0?'동일':((diff===4||diff===8)?'합':'무난')));
    years+='<tr><td class="k">'+y+'</td><td>'+(y-R.y)+'세</td><td>'+S.STEM_HAN[idx%10]+S.BR_HAN[idx%12]+' · '+gg+'</td><td>'+tag+'</td><td style="font-size:11.5px">'+S.SEUN_KEY[gg]+'</td></tr>';
  }
  push(page(label,secLabel('15','DAEWOON · 네 영역')+'<h2>이 10년, 영역별로</h2>'+
    '<table><tr><th>영역</th><th>이 10년의 결</th></tr>'+
    '<tr><td class="k">돈</td><td>'+F.money+'</td></tr>'+
    '<tr><td class="k">일</td><td>'+F.work+'</td></tr>'+
    '<tr><td class="k">사랑</td><td>'+F.love+'</td></tr>'+
    '<tr><td class="k">건강</td><td>'+F.health+'</td></tr></table>'+
    '<h3>해마다의 결</h3>'+
    '<table><tr><th>해</th><th>나이</th><th>간지 · 십성</th><th>일지</th><th>키워드</th></tr>'+years+'</table>'+
    '<p>같은 10년이라도 해마다 날씨가 다릅니다. <b>충</b>이 붙은 해는 판이 바뀌고, <b>합</b>이 붙은 해는 사람을 통해 일이 풀립니다.</p>',{spread:true}));
  /* C */
  push(page(label,secLabel('15','DAEWOON · 사용법')+'<h2>이 10년을 쓰는 법</h2>'+
    '<h3>먼저 할 세 가지</h3><ol>'+
    '<li>'+({비겁:'내 이름을 걸 수 있는 일 하나를 정하기',식상:'만든 것을 밖으로 꺼내는 창구 만들기',재성:'수입과 지출의 구조를 문서로 정리하기',관성:'자격·직함·계약 중 하나를 확보하기',인성:'배움에 기한을 정해 하나를 끝내기'}[grp])+'</li>'+
    '<li>'+({비겁:'동료와의 몫을 글로 남기기',식상:'결과물을 기록으로 남기기',재성:'통장을 셋으로 나누기',관성:'보고와 절차를 문서화하기',인성:'배운 것을 가르치거나 정리하기'}[grp])+'</li>'+
    '<li>'+({비겁:'혼자 결정하는 습관을 하나 줄이기',식상:'말의 속도를 반 박자 늦추기',재성:'큰 지출 전 하루 쉬기',관성:'압박을 혼자 안고 있지 않기',인성:'결정을 사흘 안에 내리기'}[grp])+'</li></ol>'+
    '<h3>조심할 해</h3><p>'+riskYears(R,d)+'</p>'+
    '<h3>이 10년의 건강</h3><p>'+S.EL_DEEP[el].over+' 그래서 '+S.EL_DEEP[el].part+' 쪽이 먼저 피로를 알립니다. '+S.EL_DEEP[el].habit+'</p>'+
    callout('이 10년을 남기는 법','<p>대운은 지나가지만 <b>남긴 것</b>은 남습니다. 이 10년에 남길 것은 '+({비겁:'내 이름으로 만든 일',식상:'작품과 기록',재성:'현금흐름과 자산',관성:'직함과 신뢰',인성:'실력과 사람'}[grp])+'입니다.</p>'),{spread:true}));
}
function riskYears(R,d){
  var out=[];
  for(var y=R.y+d.from;y<=R.y+d.to;y++){
    var idx=S.mod(y-4,60);
    if(S.mod(idx%12-R.dBranch,12)===6) out.push(y+'년');
  }
  return out.length?out.join(', ')+' — 일지와 충하는 해입니다. 이사·이직·계약을 한꺼번에 몰지 마세요.':'이 10년에는 일지와 정면으로 충하는 해가 없습니다. 대신 판이 급하게 바뀌지 않으니 쌓는 흐름으로 쓰세요.';
}

/* ---------------- 10장 세운 (2027~2031) ---------------- */
function seunIntro(){
  var R=B.R;
  var start=2027;
  push(page('16 / SEWOON',secLabel('16','SEWOON · 향후 5년')+'<h1>2027~2031<br><span class="accent">다섯 해의 문</span></h1>'+
    '<p class="lead">세운은 한 해의 날씨입니다. 대운이라는 기후 위에 얹혀, 그해에 무엇을 하고 무엇을 미룰지를 정합니다.</p>'+
    '<table><tr><th>해</th><th>간지</th><th>십성</th><th>일지</th><th>한 줄</th></tr>'+
    (function(){var h='';for(var y=start;y<start+5;y++){var idx=S.mod(y-4,60),g=S.tenGod(R.dStem,idx%10),diff=S.mod(idx%12-R.dBranch,12);
      var tag=(diff===6?'충':(diff===0?'동일':((diff===4||diff===8)?'합':'무난')));
      h+='<tr><td class="k">'+y+'</td><td>'+S.STEM_HAN[idx%10]+S.BR_HAN[idx%12]+'</td><td>'+g+'</td><td>'+tag+'</td><td style="font-size:12px">'+S.SEUN_DEEP[g]+'</td></tr>';}return h;})()+'</table>'+
    '<p>이 다섯 해는 지금 대운(<b>'+S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)+'</b>)의 재료 위에서 읽어야 정확합니다. 다음 장부터 해마다 두 장씩 펼칩니다.</p>'+
    callout('5년을 쓰는 순서','<p>1년차는 <b>정리</b>, 2~3년차는 <b>실행</b>, 4~5년차는 <b>수확</b>입니다. 이 사주는 실행에 강하고 정리에 약하니, 첫 해를 정리에 쓰는 것이 전체 속도를 올립니다.</p>'),{spread:true}));
  chapter('sewoon','16','향후 5년 세운','2027~2031');
}
function seunPages(){
  var R=B.R,c=B.c;
  for(var k=0;k<5;k++){
    var y=2027+k, idx=S.mod(y-4,60), s=idx%10, b=idx%12, g=S.tenGod(R.dStem,s), grp=S.GOD_GROUP[g];
    var diff=S.mod(b-R.dBranch,12), rel=(diff===6?'충(沖)':(diff===0?'동일':((diff===4||diff===8)?'합(合)':'무난')));
    var F=SEUN_FIELD[g];
    push(page('16 / SEWOON',secLabel('16','SEWOON · '+y)+'<h1><span class="accent">'+y+'년</span> · '+S.STEM_HAN[s]+S.BR_HAN[b]+'</h1>'+
      '<p class="lead">'+S.SEUN_DEEP[g]+'</p>'+
      '<div style="margin:2mm 0 4mm"><span class="tag">'+g+'</span><span class="tag navy">'+grp+'</span><span class="tag navy">일지 '+rel+'</span><span class="tag soft">'+S.SEUN_KEY[g]+'</span></div>'+
      '<h3>이 해의 기운</h3><p>'+S.SEUN_EL[b]+'</p>'+
      '<p>'+S.GROUP_MEAN[grp]+' 이 해는 그 재료가 <b>세운</b>으로 한 번 더 들어오는 때입니다. 그래서 평소보다 그 영역의 일이 눈에 띄게 많아집니다.</p>'+
      '<h3>일지와의 관계</h3><p>이 해의 지지 '+brS(b)+'는 내 일지 '+brS(R.dBranch)+'와 <b>'+rel+'</b>입니다. '+
        (diff===6?'판이 바뀌는 해입니다. 이사·이직·관계 변화가 겹치기 쉬우니 큰 결정은 3개월 단위로 나눠 확인하세요.':(diff===0?'같은 기운이 다시 도는 해입니다. 미뤄둔 일이 다시 올라오고, 같은 선택을 반복할 기회도 옵니다.':((diff===4||diff===8)?'사람을 통해 일이 풀리는 해입니다. 혼자 밀기보다 누군가를 거치면 빨라집니다.':'크게 부딪히지 않는 해입니다. 정한 방향으로 쌓아가기 좋습니다.')))+'</p>',{spread:true}));
    /* B: 영역 + 월 */
    var mrows='';
    for(var m=1;m<=12;m+=1){
      var mp=S.monthPillarOf(y,m), mg=S.tenGod(R.dStem,mp.stem);
      var mrel=S.branchRel(R.dBranch,mp.branch), mtag=S.monthTag(mrel);
      if(mtag==='합'||mtag==='충'){
        mrows+='<tr><td class="k">'+m+'월</td><td>'+S.STEM_HAN[mp.stem]+S.BR_HAN[mp.branch]+' · '+mg+'</td><td>'+mtag+'</td><td style="font-size:11.5px">'+(S.MONTH_TIP.general[S.GOD_GROUP[mg]]||'')+'</td></tr>';
      }
    }
    push(page('16 / SEWOON',secLabel('16','SEWOON · '+y+' 네 영역')+'<h2>'+y+'년, 영역별로</h2>'+
      '<table><tr><th>영역</th><th>이 해의 결</th></tr>'+
      '<tr><td class="k">돈</td><td>'+F.money+'</td></tr>'+
      '<tr><td class="k">일</td><td>'+F.work+'</td></tr>'+
      '<tr><td class="k">사랑</td><td>'+F.love+'</td></tr>'+
      '<tr><td class="k">건강</td><td>'+F.health+'</td></tr></table>'+
      '<h3>이 해에 눈여겨볼 달</h3>'+
      (mrows?'<table><tr><th>달</th><th>월주 · 십성</th><th>관계</th><th>할 일</th></tr>'+mrows+'</table>':'<p>이 해에는 일지와 크게 부딪히거나 어울리는 달이 뚜렷하지 않습니다. 달보다 분기의 흐름으로 보세요.</p>')+
      '<h3>이 해의 세 가지</h3><ul>'+
      '<li><b>할 일</b> — '+({비겁:'내 이름을 걸 일 하나 시작',겁재:'함께하는 일의 몫을 문서로',식신:'만든 것을 밖으로 내놓기',상관:'말을 다듬어 발표하기',편재:'큰 지출의 한도 정하기',정재:'저축·계약 하나 끝내기',편관:'압박의 원인을 문서로 정리',정관:'자격·절차 하나 준비',편인:'배움 하나를 끝내기',정인:'도움을 받아들이기'}[g])+'</li>'+
      '<li><b>피할 일</b> — '+({비겁:'자존심 싸움',겁재:'서류 없는 동업',식신:'편한 것만 하기',상관:'윗사람과의 감정 대화',편재:'충동 결제',정재:'큰 모험',편관:'혼자 안고 버티기',정관:'형식만 갖추기',편인:'결정 미루기',정인:'참기만 하기'}[g])+'</li>'+
      '<li><b>남길 것</b> — 기록 한 줄. 이 사주는 기록이 다음 해의 문을 엽니다.</li></ul>'+
      callout(y+'년의 한 줄','<p>'+S.SEUN_KEY[g]+'의 해 — '+S.GOD_DEEP[g].split('.')[0]+'. 이 방향에 얹히는 선택이 힘을 받습니다.</p>'),{spread:true}));
  }
}

/* ---------------- 11장 2027 월력 ---------------- */
var WEEK={
 '비겁':['준비 — 내 일의 우선순위 정하기','실행 — 미뤄둔 일 먼저 시작','조정 — 사람과의 몫 확인','정리 — 다음 달 계획'],
 '겁재':['정리 — 약속과 지출 점검','실행 — 함께할 사람 만나기','조정 — 역할과 몫 다시 말하기','마감 — 빌린 것 갚기'],
 '식신':['준비 — 재료와 아이디어 모으기','실행 — 만들고 쓰기','조정 — 반응 확인하고 고치기','정리 — 결과물 남기기'],
 '상관':['준비 — 할 말 정리하기','실행 — 발표·기록·표현','조정 — 말의 속도 늦추기','정리 — 구설 정리'],
 '편재':['준비 — 큰 지출의 한도','실행 — 기회에 답하기','조정 — 씀씀이 점검','정리 — 정산'],
 '정재':['준비 — 통장과 장부','실행 — 계약·저축','조정 — 고정 지출 줄이기','정리 — 결산'],
 '편관':['준비 — 책임의 범위 확인','실행 — 어려운 일 먼저','조정 — 압박 나누기','정리 — 회복 시간'],
 '정관':['준비 — 서류와 절차','실행 — 시험·보고·계약','조정 — 관계 정리','정리 — 다음 단계'],
 '편인':['준비 — 혼자 정리하는 시간','실행 — 공부·연구','조정 — 사람 만나기','정리 — 배운 것 기록'],
 '정인':['준비 — 쉬고 채우기','실행 — 배움에 집중','조정 — 도움 받기','정리 — 가르치기']
};
function monthPages(){
  chapter('calendar','17','2027년 월별 달력','12개월 · 달마다의 결');
  var R=B.R,c=B.c;
  for(var m=1;m<=12;m++){
    var mp=S.monthPillarOf(2027,m), g=S.tenGod(R.dStem,mp.stem), grp=S.GOD_GROUP[g];
    var rel=S.branchRel(R.dBranch,mp.branch), tag=S.monthTag(rel);
    var tip=(S.MONTH_TIP.general[grp]||''), rt=S.MONTH_REL_TIP[tag]||'';
    var F=SEUN_FIELD[g]||SEUN_FIELD['비겁'];
    var wk=WEEK[g]||WEEK['비겁'];
    push(page('17 / 2027',secLabel('17','2027 MONTHLY · '+m+'월')+'<h1><span class="accent">2027년 '+m+'월</span><br>'+S.STEM_HAN[mp.stem]+S.BR_HAN[mp.branch]+' · '+g+'</h1>'+
      '<p class="lead">이 달은 '+S.STEM_HAN[mp.stem]+S.BR_HAN[mp.branch]+'월, '+name_of_month(m)+'입니다. 십성은 <b>'+g+'</b>, 일지와의 관계는 <b>'+tag+'</b>입니다.</p>'+
      '<p>'+tip+' '+(tag==='무난'?'':rt)+'</p>'+
      '<h3>이 달의 네 영역</h3>'+
      '<table><tr><th>영역</th><th>이 달의 결</th></tr>'+
      '<tr><td class="k">돈</td><td>'+F.money+'</td></tr>'+
      '<tr><td class="k">일</td><td>'+F.work+'</td></tr>'+
      '<tr><td class="k">관계</td><td>'+F.love+'</td></tr>'+
      '<tr><td class="k">건강</td><td>'+F.health+'</td></tr></table>'+
      '<h3>주별로</h3><ul>'+wk.map(function(w,i){return '<li><b>'+(i+1)+'주</b> — '+w+'</li>';}).join('')+'</ul>'+
      callout(m+'월의 한 줄','<p>'+tip.split('.')[0]+'. '+rt+'</p>'),{spread:true}));
  }
}
function name_of_month(m){
  var names=['한겨울의 문','입춘의 문','봄을 깨우는 달','싹이 트는 달','꽃이 피는 달','초여름의 달','한낮의 달','더위가 익는 달','서늘해지는 달','결실의 달','거두는 달','겨울의 문'];
  return names[(m-1)%12];
}

/* ---------------- 12장 개운 ---------------- */
function remedyPages(){
  chapter('remedy','18','개운 처방','색·생활·사람·1년');
  var R=B.R,c=B.c,d=S.EL_DEEP[c.yongEl];
  push(page('18 / REMEDY',secLabel('18','REMEDY · 개운 처방')+'<h1>색과 방위로<br><span class="accent">균형 잡기</span></h1>'+
    '<p class="lead">이 사주에 필요한 기운은 '+elK(c.yongEl)+'입니다. 개운은 큰 의식이 아니라 매일의 작은 기울기입니다.</p>'+
    '<table><tr><th>항목</th><th>처방</th><th>왜</th></tr>'+
    '<tr><td class="k">색</td><td>'+d.color+'</td><td>눈에 자주 닿는 것부터</td></tr>'+
    '<tr><td class="k">방위</td><td>'+d.dir+'</td><td>책상·침대 머리·자주 앉는 자리</td></tr>'+
    '<tr><td class="k">계절</td><td>'+d.season+'</td><td>새 일과 큰 결정에 힘이 실립니다</td></tr>'+
    '<tr><td class="k">소품</td><td>'+d.item+'</td><td>의식을 유지하는 눈에 보이는 표시</td></tr></table>'+
    '<p>이 사주가 이미 넘치게 가진 기운은 '+elK(c.mostI)+'입니다. '+S.EL_KO[c.mostI]+' 색과 소품을 더 늘리면 처음엔 좋아 보이지만, 한 달이 지나면 피로로 돌아옵니다.</p>'+
    callout('한 달의 시작','<p>달력이 바뀌는 날, '+d.color+' 소품 하나를 새로 들이고 '+d.dir+' 방향으로 창을 여세요. 작은 의식이 한 달의 방향을 정합니다.</p>'),{spread:true}));
  push(page('18 / REMEDY',secLabel('18','REMEDY · 생활')+'<h1>생활과 음식의<br><span class="accent">처방</span></h1>'+
    '<table><tr><th>때</th><th>할 일</th></tr>'+
    '<tr><td class="k">아침</td><td>'+d.habit+'</td></tr>'+
    '<tr><td class="k">식사</td><td>'+d.food+' · '+d.taste+'</td></tr>'+
    '<tr><td class="k">공간</td><td>'+d.space+'</td></tr>'+
    '<tr><td class="k">저녁</td><td>잠드는 시간 고정 — 이 사주는 수면이 가장 약한 고리</td></tr>'+
    '<tr><td class="k">주 1회</td><td>버리기와 정리 — 미련을 줄이는 의식</td></tr></table>'+
    '<h3>이 사주가 피하면 좋은 것</h3><ul>'+
    '<li>'+S.EL_KO[c.mostI]+' 기운을 더 밀어붙이는 습관 — '+S.EL_DEEP[c.mostI].part+' 쪽이 먼저 지칩니다</li>'+
    '<li>늦은 밤의 화면 — 이 사주는 밤에 생각이 깊어져 잠을 잃습니다</li>'+
    '<li>혼자 결정하는 습관 — 필요한 기운이 사람에게서 오는 사주입니다</li></ul>'+
    callout('한 줄','<p>개운의 핵심은 <b>'+d.habit+'</b>입니다. 이것 하나를 3개월 지키면 나머지는 따라옵니다.</p>'),{spread:true}));
  push(page('18 / REMEDY',secLabel('18','REMEDY · 사람')+'<h1>사람과 환경의<br><span class="accent">처방</span></h1>'+
    '<p class="lead">이 사주에게 필요한 기운은 '+elK(c.yongEl)+'입니다. 그래서 '+S.EL_KO[c.yongEl]+'의 결을 가진 사람 곁에서 편안해집니다.</p>'+
    '<table><tr><th>구분</th><th>어떤 사람·환경</th></tr>'+
    '<tr><td class="k">귀인</td><td>'+S.EL_PERSON[c.yongEl]+'</td></tr>'+
    '<tr><td class="k">만나는 자리</td><td>'+d.dir+' 방향의 모임, '+d.color+' 계열의 공간</td></tr>'+
    '<tr><td class="k">피할 사람</td><td>'+S.EL_PERSON[c.mostI]+' — 나와 같은 기운이 넘치는 사람과 오래 경쟁하면 지칩니다</td></tr>'+
    '<tr><td class="k">집</td><td>'+d.space+'</td></tr></table>'+
    '<p>사람의 처방은 “좋은 사람을 만나라”가 아니라 <b>어떤 자리에서 만나는가</b>입니다. 이 사주는 설명해야 하는 자리에서 귀인을 만납니다.</p>'+
    callout('3개월 처방','<p>1개월 — '+d.habit+'. 2개월 — '+d.food+' 쪽으로 식사 바꾸기. 3개월 — '+d.space+'. 한 달에 하나씩만 쌓으세요.</p>'),{spread:true}));
  push(page('18 / REMEDY',secLabel('18','REMEDY · 1년')+'<h1>1년의<br><span class="accent">처방 달력</span></h1>'+
    '<table><tr><th>분기</th><th>할 일</th></tr>'+
    '<tr><td class="k">1~3월</td><td>비우기 — 책상·일정·구독 정리. 새 일은 4월부터</td></tr>'+
    '<tr><td class="k">4~6월</td><td>심기 — '+d.habit+'를 매일. 새 프로젝트 시작</td></tr>'+
    '<tr><td class="k">7~9월</td><td>지키기 — 수입·건강·관계의 균형 점검. 큰 지출 금지</td></tr>'+
    '<tr><td class="k">10~12월</td><td>거두기 — 계약·정산·검진 마무리. 다음 해 계획</td></tr></table>'+
    '<p>이 사주는 <b>시작보다 마무리</b>에서 힘이 납니다. 그래서 1분기에 비우고 4분기에 거두는 순서가 맞습니다.</p>'+
    callout('1년의 한 줄','<p>'+d.habit+' — 이 문장을 냉장고에 붙여두세요.</p>'),{spread:true}));
}

/* ---------------- 13장 맞춤 질문 ---------------- */
function qaPages(){
  chapter('qa','19','맞춤 질문 답변','300자 질문 · 네 개의 답');
  var R=B.R,c=B.c,q=(B.input.ctx&&B.input.ctx.question)||'';
  var qs=[
    {q:q||'지금 이직해도 될까요? 시기는 언제가 좋을까요?',kind:'job'},
    {q:'돈은 언제 들어오나요? 무엇을 조심해야 할까요?',kind:'money'},
    {q:'인연은 언제, 어떤 사람으로 올까요?',kind:'love'},
    {q:'건강에서 조심해야 할 때는 언제인가요?',kind:'health'}
  ];
  qs.forEach(function(x,i){
    var body=secLabel('19','Q&A · 맞춤 답변 '+(i+1));
    body+='<h1>“'+esc(x.q)+'”</h1>';
    body+=answerFor(x.kind,R,c);
    push(page('19 / Q&A',body,{spread:true}));
  });
}
function answerFor(kind,R,c){
  var h='';
  if(kind==='job'){
    var gy=[];for(var i=0;i<R.seun.length;i++){var g=S.tenGod(R.dStem,R.seun[i].idx%10);if(S.GOD_GROUP[g]==='관성')gy.push(R.seun[i].year+'년');}
    h+='<p class="lead">결론부터 말하면, 이 사주는 <b>'+(gy.length?gy[0]+' 무렵':'준비 기간을 거친 뒤')+'</b>에 자리가 움직입니다. 다만 시기보다 조건이 먼저입니다.</p>';
    h+='<p>이 사주의 중심은 <b>'+c.topGrp+'</b>이고, 그 재료는 '+S.GROUP_MEAN[c.topGrp]+' 직장에서 이 재료가 쓰이지 않는다고 느낀다면 그것이 이직의 이유가 됩니다. 반대로 사람 때문에 힘든 것이라면 옮겨도 반복됩니다.</p>';
    h+='<h3>지금 확인할 세 가지</h3><ol><li>생활비 6개월이 확보되었는가</li><li>다음 자리에서 '+S.GOD_KEY[c.topGodInGrp]+'이 쓰이는가</li><li>옮기는 이유를 세 줄로 적을 수 있는가</li></ol>';
    h+='<p>세 가지가 모두 “예”라면 시기는 세운이 정해줍니다. '+riskyText(R,c,12)+'</p>';
    h+=callout('권하는 순서','<p>1) 지금 자리에서 6개월 안에 하나를 바꿔보기 → 2) 그래도 안 되면 서류와 기록 준비 → 3) 관성이 오는 해에 지원. 이 순서를 지키면 후회가 적습니다.</p>');
  } else if(kind==='money'){
    var jae=[];for(var i2=0;i2<R.seun.length;i2++){var g2=S.tenGod(R.dStem,R.seun[i2].idx%10);if(S.GOD_GROUP[g2]==='재성')jae.push(R.seun[i2].year+'년');}
    h+='<p class="lead">이 사주는 <b>'+(jae.length?jae.join(', ')+'</b>에 돈의 문이 열립니다.':'큰 문보다 매달 쌓는 구조가 맞습니다.</b>')+'</p>';
    h+='<p>'+(S.WEALTH_VESSEL_GOD[c.topGodInGrp]||'성실함이 재산이 되는 구조입니다.')+'</p>';
    h+='<h3>조심할 것</h3><ul><li>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'사람을 통한 지출')+'</li><li>사람이 권하는 상품 — 서류로 확인하기</li><li>일지와 충하는 달의 큰 결제</li></ul>';
    h+='<p>'+riskyText(R,c,12)+'</p>';
    h+=callout('한 줄','<p>이 사주는 <b>버는 힘</b>보다 <b>남기는 구조</b>가 약합니다. 수입일 절반을 먼저 떼어두는 것 하나로 10년이 달라집니다.</p>');
  } else if(kind==='love'){
    var ys=[];for(var i3=0;i3<R.seun.length;i3++){var g3=S.tenGod(R.dStem,R.seun[i3].idx%10);var grp=S.GOD_GROUP[g3];if(grp==='관성'||grp==='재성')ys.push(R.seun[i3].year+'년');}
    h+='<p class="lead">인연의 문은 <b>'+(ys.length?ys.join(', '):'뚜렷한 해가 오지 않으면 만남의 밀도')+'</b>에서 열립니다. 이 사주는 먼저 다가가는 쪽이 유리합니다.</p>';
    h+='<p>'+S.LOVE_ATTRACT[R.dayEl]+'</p>';
    h+='<p>다만 오래 가는 사람은 다릅니다. '+S.LOVE_FIT[R.dayEl]+'</p>';
    h+='<h3>조심할 패턴</h3><p>'+S.LOVE_MISTAKE_GOD[c.topGodInGrp]+'</p>';
    h+=callout('한 줄','<p>이 사주는 <b>표현이 늦어</b> 마음을 놓칩니다. 좋으면 좋다고, 서운하면 서운하다고 그날 말하는 것 — 이것이 인연의 속도를 바꿉니다.</p>');
  } else {
    var li=R.count[4], fi=R.count[1];
    h+='<p class="lead">이 사주는 '+elK(c.leastI)+'이 가장 얇아, <b>'+S.EL_DEEP[c.leastI].part+'</b> 쪽이 먼저 신호를 보냅니다.</p>';
    h+='<p>'+S.EL_DEEP[c.leastI].under+' 특히 '+S.SEASON_RHYTHM[c.leastI][0]+'에 주의하세요. '+S.SEASON_RHYTHM[c.leastI][1]+'</p>';
    h+='<p>물(水) '+li+' · 불(火) '+fi+' — '+(fi>=li+2?'열이 먼저 오르는 구조라 잠과 수분이 핵심입니다.':(li>=fi+2?'몸이 차기 쉬운 구조라 온기와 아침 햇빛이 핵심입니다.':'고른 구조라 계절의 흔들림을 관리하면 충분합니다.'))+'</p>';
    h+='<h3>조심할 때</h3><p>'+riskyText(R,c,12)+'</p>';
    h+=callout('한 줄','<p>큰 결심보다 <b>잠드는 시간</b>입니다. 이 사주는 수면이 무너지면 모든 것이 함께 무너집니다.</p>');
  }
  return h;
}
function riskyText(R,c,n){
  var out=[],now=new Date(),y=now.getFullYear(),m=now.getMonth()+1;
  for(var i=0;i<(n||12);i++){
    var mp=S.monthPillarOf(y,m), rel=S.branchRel(R.dBranch,mp.branch), tag=S.monthTag(rel);
    if(tag==='충'||tag==='원진') out.push(y+'.'+n2(m));
    m++; if(m>12){m=1;y++;}
  }
  return out.length?('조심할 달은 '+out.join(', ')+'입니다. 이 달에는 결정을 미루고 몸을 먼저 챙기세요.'):'앞으로 '+(n||12)+'개월 안에는 일지와 정면으로 부딪히는 달이 없습니다.';
}

/* ---------------- 14장 검수 ---------------- */
function signPages(){
  chapter('review','20','검수 확인서 · 맺음말','원국 확인과 발행');
  var R=B.R,c=B.c;
  var today=new Date();
  push(page('20 / REVIEW',secLabel('20','MASTER REVIEW · 검수')+'<h1>원국 검수<br><span class="accent">확인서</span></h1>'+
    '<table><tr><th>항목</th><th>확인</th></tr>'+
    '<tr><td class="k">이름</td><td>'+esc(B.name)+'</td></tr>'+
    '<tr><td class="k">생년월일</td><td>'+R.y+'.'+n2(R.m)+'.'+n2(R.d)+' ('+(B.input.cal==='lunar'?'음력':'양력')+')</td></tr>'+
    '<tr><td class="k">태어난 시간</td><td>'+(R.hIdxP!=null?S.BR_HAN[R.hIdxP%12]+'시 무렵':'시간 미상')+'</td></tr>'+
    '<tr><td class="k">출생 지역</td><td>'+(R.solarAdj?(R.solarAdj.region+' · 진태양시 '+(R.solarAdj.off>0?'+':'')+R.solarAdj.off+'분 보정'):(B.input.regionName||'보정 없음'))+'</td></tr>'+
    '<tr><td class="k">원국</td><td>'+S.STEM_HAN[R.yIdx%10]+S.BR_HAN[R.yIdx%12]+' · '+S.STEM_HAN[R.mIdx%10]+S.BR_HAN[R.mIdx%12]+' · '+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+(R.hIdxP!=null?' · '+S.STEM_HAN[R.hIdxP%10]+S.BR_HAN[R.hIdxP%12]:'')+'</td></tr>'+
    '<tr><td class="k">일간</td><td>'+stemS(R.dStem)+' · '+(R.strength==='강'?'신강':(R.strength==='약'?'신약':'중화'))+'</td></tr>'+
    '<tr><td class="k">용신</td><td>'+elK(c.yongEl)+'</td></tr>'+
    '<tr><td class="k">현재 대운</td><td>'+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세 · '+S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)+'</td></tr>'+
    '<tr><td class="k">발행일</td><td>'+today.getFullYear()+'.'+n2(today.getMonth()+1)+'.'+n2(today.getDate())+'</td></tr></table>'+
    '<p>위 원국과 대운은 입력된 생년월일·시간·지역을 기준으로 계산되었습니다. 생년월일이 다르거나 시간이 추정이라면 책자의 1장과 9장을 우선 확인하시고, 필요한 경우 재발행을 요청하세요.</p>'+
    '<div class="sign"><div class="row"><span>검수</span><span class="sig">天靈堂</span></div><div class="row"><span>판독</span><span>사주명리 기반 참고 해석</span></div><div class="row"><span>문의</span><span>with-hj@users.noreply.github.com</span></div></div>',{spread:true}));
  push(page('20 / REVIEW',secLabel('20','CLOSING · 맺음말')+'<h1>이 책을 덮으며</h1>'+
    '<p class="lead">사주는 바꿀 수 없지만, 어느 쪽으로 기울여 살지는 매일 정할 수 있습니다.</p>'+
    '<p>'+esc(B.name)+' 님의 여덟 글자는 '+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주입니다. 이 책에서 가장 중요한 문장은 아마 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>에 대한 설명일 것입니다. 그 힘이 쓰이는 자리에서 이 사주는 오래 갑니다.</p>'+
    '<p>두 번째로 중요한 것은 '+elK(c.yongEl)+'입니다. '+S.EL_DEEP[c.yongEl].habit+' — 이 한 가지를 3개월 지켜보세요. 사주는 큰 사건으로 바뀌지 않고, 매일의 작은 기울기로 바뀝니다.</p>'+
    '<p>세 번째는 시간입니다. 가장 힘이 실리는 10년은 <b>'+R.daeun[S.bestDaeun(R,c).i].from+'~'+R.daeun[S.bestDaeun(R,c).i].to+'세</b>입니다. 그때까지 무엇을 심어두는지가 결과를 바꿉니다.</p>'+
    callout('마지막 한 줄','<p>좋은 삶은 좋은 운에서 오지 않습니다. 좋은 <b>순서</b>에서 옵니다. 이 책이 그 순서를 정하는 데 쓰이길 바랍니다.</p>')+
    '<p style="text-align:right;margin-top:8mm;color:#6E6353">天靈堂 드림</p>',{spread:true}));
}

/* ---------------- 부록 ---------------- */
function appendPages(){
  chapter('appendix','21','부록 · 이용 안내','운성 표와 발행 정보');
  var R=B.R,c=B.c;
  push(page('21 / APPENDIX',secLabel('21','APPENDIX · 부록')+'<h1>십이운성<br><span class="accent">한눈에</span></h1>'+
    '<table><tr><th>단계</th><th>의미</th></tr>'+
    '<tr><td class="k">장생</td><td>새로 시작하는 힘. 배우고 자라는 자리</td></tr>'+
    '<tr><td class="k">목욕</td><td>감정이 많고 인연이 잦은 자리</td></tr>'+
    '<tr><td class="k">관대</td><td>사회성이 좋고 사람 앞에 서는 힘</td></tr>'+
    '<tr><td class="k">임관</td><td>책임과 권한이 함께 오는 자리</td></tr>'+
    '<tr><td class="k">제왕</td><td>가장 강한 자리. 고집이 함께 옵니다</td></tr>'+
    '<tr><td class="k">쇠</td><td>경험으로 사람을 살피는 눈</td></tr>'+
    '<tr><td class="k">병</td><td>예민해지고 배려가 깊어지는 자리</td></tr>'+
    '<tr><td class="k">사</td><td>결단이 빠르고 미련이 적은 자리</td></tr>'+
    '<tr><td class="k">묘</td><td>생각이 깊고 혼자 있는 시간이 필요한 자리</td></tr>'+
    '<tr><td class="k">절</td><td>변화가 잦고 새 판을 여는 힘</td></tr>'+
    '<tr><td class="k">태</td><td>아직 드러나지 않은 가능성</td></tr>'+
    '<tr><td class="k">양</td><td>받아들이고 돌보는 힘</td></tr></table>'+
    '<h3>오행의 상생과 상극</h3><p>목생화 · 화생토 · 토생금 · 금생수 · 수생목 — 이 순서로 기운이 흐릅니다. 반대로 목극토 · 토극수 · 수극화 · 화극금 · 금극목은 서로를 누르는 관계입니다.</p>',{spread:true}));
  push(page('21 / APPENDIX',secLabel('21','APPENDIX · 이용 안내')+'<h1>이 책에 대하여</h1>'+
    '<p class="lead">이 책자는 천령당(天靈堂)이 사주명리 상징을 생활의 언어로 옮겨 만든 참고 해석입니다.</p>'+
    '<ul><li>수록 범위 — 원국·오행·십성·십이운성·신살·격국, 8개 삶의 영역, 30년 대운 9구간, 2027~2031 세운, 2027년 월력, 개운 처방, 맞춤 질문 답변</li>'+
    '<li>계산 방식 — 년주는 입춘, 월주는 절기, 일주는 1900년 1월 1일 갑술일 기준, 시주는 오자둔법. 출생 지역의 경도 차이는 진태양시로 보정했습니다.</li>'+
    '<li>주의 — 의학적 진단, 법률·투자 판단, 결혼·이혼 등 중대한 결정의 근거로 사용할 수 없습니다.</li>'+
    '<li>재발행 — 생년월일·시간·지역이 달라지면 같은 책을 다시 만들 수 있습니다.</li></ul>'+
    '<p class="note">天靈堂 · 천령당 · 2026 · with-hj@users.noreply.github.com</p>'+
    callout('기록','<p>이 책의 원국은 '+R.y+'.'+n2(R.m)+'.'+n2(R.d)+' '+(R.hIdxP!=null?S.BR_HAN[R.hIdxP%12]+'시':'시간 미상')+' · '+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주 기준입니다.</p>'),{spread:true}));
}

M.sections=function(){
  daeunIntro();
  for(var i=0;i<B.R.daeun.length;i++) daeunCycle(i);
  seunIntro();
  seunPages();
  monthPages();
  remedyPages();
  qaPages();
  signPages();
  appendPages();
};
window.BOOKM=M;
})();
