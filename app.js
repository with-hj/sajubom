/* =====================================================================
   천령당(天靈堂) — 화면 (홈·무료운세·타로·5대 테마·PDF 신청·관리자)
   ===================================================================== */
(function(){
'use strict';
var S=window.SJ, CT=window.CT;
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function pad2(n){return n<10?'0'+n:''+n;}

var REGIONS=[
 {k:'seoul',name:'서울 · 인천 · 경기',off:-32},
 {k:'daejeon',name:'대전 · 세종 · 충청',off:-30},
 {k:'gwangju',name:'광주 · 전라',off:-32},
 {k:'gangwon',name:'강원',off:-28},
 {k:'daegu',name:'대구 · 경북',off:-26},
 {k:'busan',name:'부산 · 울산 · 경남',off:-24},
 {k:'jeju',name:'제주',off:-34},
 {k:'tokyo',name:'일본(도쿄)',off:0},
 {k:'beijing',name:'중국(베이징)',off:-14},
 {k:'abroad',name:'해외(현지 표준시 그대로)',off:0}
];
var HOURS=['자시','축시','인시','묘시','진시','사시','오시','미시','신시','유시','술시','해시'];
function hourLabel(i){ var h=i*2; return pad2(h)+':30 ('+HOURS[i]+')'; }

var state={
  theme:null, tab:null, gender:'f', cal:'solar', leap:false,
  ctx:false, pg:'m', pcal:'solar', stage:'', marry:'single', kid:'none',
  R:null, input:null
};

/* ---------------- 셀렉트 채우기 ---------------- */
function fillYears(sel,from,placeholder){
  var h=placeholder?'<option value="">'+placeholder+'</option>':'';
  var now=new Date().getFullYear();
  for(var y=now;y>=(from||1920);y--) h+='<option value="'+y+'">'+y+'년</option>';
  sel.innerHTML=h;
}
function fillMonths(sel,ph){
  var h=ph?'<option value="">월</option>':'';
  for(var m=1;m<=12;m++) h+='<option value="'+m+'">'+pad2(m)+'월</option>';
  sel.innerHTML=h;
}
function fillDays(sel,ph){
  var h=ph?'<option value="">일</option>':'';
  for(var d=1;d<=31;d++) h+='<option value="'+d+'">'+pad2(d)+'일</option>';
  sel.innerHTML=h;
}
function fillHours(sel,withEmpty){
  var h=withEmpty?'<option value="">시간 모름</option>':'';
  for(var i=0;i<12;i++) h+='<option value="'+i+'">'+hourLabel(i)+'</option>';
  sel.innerHTML=h;
}
function fillRegions(sel){
  sel.innerHTML=REGIONS.map(function(r){return '<option value="'+r.k+'">'+r.name+(r.off?' ('+(r.off>0?'+':'')+r.off+'분)':' (보정 없음)')+'</option>';}).join('');
}
function regionOf(k){
  for(var i=0;i<REGIONS.length;i++) if(REGIONS[i].k===k) return REGIONS[i];
  return REGIONS[0];
}
/* 일수 조정 */
function syncDays(ys,ms,ds){
  var y=parseInt(ys.value,10), m=parseInt(ms.value,10);
  if(!y||!m) return;
  var dim=new Date(y,m,0).getDate(), cur=parseInt(ds.value,10)||1;
  if(cur>dim) ds.value=dim;
}

/* ---------------- 초기화 ---------------- */
function init(){
  /* 연·월·일 */
  [['ff-y','ff-m','ff-d'],['by','bm','bd'],['py','pm','pd'],['lz-y','lz-m','lz-d']].forEach(function(ids){
    var ys=$('#'+ids[0]),ms=$('#'+ids[1]),ds=$('#'+ids[2]);
    if(!ys) return;
    fillYears(ys,1920,'연도'); fillMonths(ms,true); fillDays(ds,true);
    ys.addEventListener('change',function(){syncDays(ys,ms,ds);});
    ms.addEventListener('change',function(){syncDays(ys,ms,ds);});
  });
  /* 시간 */
  [['ff-hour',true],['hour',true],['phour',true],['lz-hour',true]].forEach(function(a){
    var el=$('#'+a[0]); if(el) fillHours(el,a[1]);
  });
  /* 지역 */
  ['ff-region','region','pregion','lz-region'].forEach(function(id){ var el=$('#'+id); if(el) fillRegions(el); });

  /* 히어로 배경 */
  var art=$('.hero-art'); if(art) art.style.backgroundImage='url(./assets/hero-art.jpg)';

  bindChips('#ff-gender',function(b){ return {g:b.getAttribute('data-g')}; },function(v){ });
  bindChips('#calChips',function(b){return {cal:b.getAttribute('data-cal')};},function(v){
    state.cal=v.cal; $('#leapRow').style.display=(v.cal==='lunar')?'flex':'none';
  });
  bindChips('#genderChips',function(b){return {g:b.getAttribute('data-g')};},function(v){ state.gender=v.g; });
  bindChips('#stageChips',function(b){return {s:b.getAttribute('data-s')};},function(v){ state.stage=v.s; });
  bindChips('#marryChips',function(b){return {m:b.getAttribute('data-m')};},function(v){ state.marry=v.m; });
  bindChips('#kidChips',function(b){return {c:b.getAttribute('data-c')};},function(v){ state.kid=v.c; });
  bindChips('#lzGender',function(b){return {g:b.getAttribute('data-g')};},function(v){ state.pg=v.g; });
  bindChips('#lzCal',function(b){return {cal:b.getAttribute('data-cal')};},function(v){
    state.pcal=v.cal; var lr=$('#lzLeapRow'); if(lr) lr.style.display=(v.cal==='lunar')?'flex':'none';
  });
  bindChips('#lzStage',function(b){return {s:b.getAttribute('data-s')};},function(v){ state.stage=v.s; });
  bindChips('#lzMarry',function(b){return {m:b.getAttribute('data-m')};},function(v){ state.marry=v.m; });
  bindChips('#lzChild',function(b){return {c:b.getAttribute('data-c')};},function(v){ state.kid=v.c; });

  /* 상대 정보 스위치 */
  var sw=$('#ctxSwitch');
  if(sw) sw.addEventListener('click',function(){
    state.ctx=!state.ctx;
    sw.classList.toggle('on',state.ctx);
    $('#ctxBody').classList.toggle('on',state.ctx);
  });
  /* 모름 체크 */
  [['ff-notime','ff-hour'],['notime','hour'],['pnotime','phour'],['lz-notime','lz-hour']].forEach(function(a){
    var c=$('#'+a[0]),s=$('#'+a[1]);
    if(!c||!s) return;
    c.addEventListener('change',function(){ s.disabled=c.checked; if(c.checked) s.value=''; });
  });
  /* 무료 운세 */
  $('#ff-go').addEventListener('click',freeFortune);
  /* 트랙 */
  $$('.track-btn').forEach(function(b){
    b.addEventListener('click',function(){ setTrack(b.getAttribute('data-track')); });
  });
  $$('[data-goto-track]').forEach(function(a){
    a.addEventListener('click',function(){ setTimeout(function(){ setTrack(a.getAttribute('data-goto-track')); },60); });
  });
  /* 테마 */
  renderThemes();
  var bk=$('#backThemes');
  if(bk) bk.addEventListener('click',function(){
    $('#themeView').classList.remove('on'); $('#themeListView').classList.add('on');
  });
  openTheme('general',true);
  $('#sajuForm').addEventListener('submit',onSubmit);
  /* PDF 신청 */
  initPdf();
  /* 관리자 */
  $('#btn-admin').addEventListener('click',openAdmin);
  $$('[data-admin-open]').forEach(function(b){ b.addEventListener('click',openAdmin); });
  $('#admClose').addEventListener('click',closeAdmin);
  $('#admBack').addEventListener('click',function(){ $('#admBookView').style.display='none'; $('#admListView').style.display='block'; });
  $$('.adm-tab').forEach(function(b){
    b.addEventListener('click',function(){
      $$('.adm-tab').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');
      if(b.getAttribute('data-adm')==='sample') openBook(sampleEntry());
      else { $('#admBookView').style.display='none'; $('#admListView').style.display='block'; }
    });
  });
  $('#pdfPrint').addEventListener('click',function(){ window.print(); });

  renderTarot();

  /* URL 파라미터 */
  try{
    if(/[?&]admin=1/.test(location.search)) openAdmin();
    if(/[?&]book=sample/.test(location.search)){ openAdmin(); openBook(sampleEntry()); }
    if(/[?&]track=life/.test(location.search)) setTrack('life');
  }catch(e){}
}
function bindChips(sel,get,on){
  var box=$(sel); if(!box) return;
  var btns=$$('.chip',box);
  btns.forEach(function(b){
    b.addEventListener('click',function(){
      btns.forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');
      on(get(b));
    });
  });
  if(btns.length) on(get(btns[0]));
}

/* ---------------- 무료 : 오늘의 운세 ---------------- */
function readFree(){
  var y=parseInt($('#ff-y').value,10), m=parseInt($('#ff-m').value,10), d=parseInt($('#ff-d').value,10);
  if(!y||!m||!d) return {err:'생년월일을 골라주세요'};
  var noTime=$('#ff-notime').checked, hv=$('#ff-hour').value;
  if(!noTime&&hv==='') return {err:'태어난 시간을 고르거나 ‘모름’을 체크해 주세요'};
  var reg=regionOf($('#ff-region').value);
  var g=$('#ff-gender .chip.on'); g=g?g.getAttribute('data-g'):'f';
  return {y:y,m:m,d:d,hasTime:!noTime,hourIndex:noTime?0:parseInt(hv,10),gender:g,
    tsoff:noTime?0:reg.off,regionName:reg.name,regionKey:reg.k,name:'',theme:'general',tab:'today',ctx:{}};
}
function freeFortune(){
  var inp=readFree();
  if(inp.err){ $('#ff-result').innerHTML='<p class="err">'+inp.err+'</p>'; return; }
  var R=S.computeSaju(inp), c=S.chartCtx(R);
  var now=new Date();
  var tIdx=S.mod(10+(S.jdn(now.getFullYear(),now.getMonth()+1,now.getDate())-S.jdn(1900,1,1)),60);
  var ts=tIdx%10, tb=tIdx%12, g=S.tenGod(R.dStem,ts), grp=S.GOD_GROUP[g];
  var diff=S.mod(tb-R.dBranch,12);
  var rel = diff===6?'내 일지와 부딪히는 날입니다. 말이 날카로워지기 쉬우니 중요한 대화는 오전으로 미루세요.'
    : diff===0?'내 일지와 같은 기운이 도는 날입니다. 평소의 습관이 그대로 드러나니, 반복하고 싶지 않은 행동을 한 번만 참아보세요.'
    : (diff===4||diff===8)?'내 일지와 어울리는 날입니다. 사람을 통한 일이 잘 풀리니 미뤄둔 연락을 오늘 해보세요.'
    : '내 일지와 크게 부딪히지 않는 날입니다. 무난하게 흐르니 하던 일을 이어가세요.';
  var tip=S.TODAY_TIP[grp]||S.TODAY_TIP['비겁'], d=S.EL_DEEP[c.yongEl];
  var h='<div class="f-card fade-in">';
  h+='<div class="f-date">'+(now.getMonth()+1)+'월 '+now.getDate()+'일 · '+S.STEM_HAN[ts]+S.BR_HAN[tb]+'일</div>';
  h+='<div class="f-big"><div class="g">'+g+'</div><div class="t">오늘 내게 지나가는 기운<b>'+S.SEUN_KEY[g]+' — '+S.EL_KO[S.BR_EL[tb]]+'('+S.EL_HAN[S.BR_EL[tb]]+')의 기운</b></div></div>';
  h+='<div class="f-line"><span class="fk">오늘의 결</span><span class="fv">'+rel+'</span></div>';
  h+='<div class="f-line"><span class="fk">하면 좋은 일</span><span class="fv">'+tip[0]+'</span></div>';
  h+='<div class="f-line"><span class="fk">피할 일</span><span class="fv">'+tip[1]+'</span></div>';
  h+='<div class="f-line"><span class="fk">행운</span><span class="fv">'+d.color+' · '+d.dir+' · 숫자 '+(S.EL_NUM?S.EL_NUM[c.yongEl]:'')+'</span></div>';
  h+='<div class="f-line"><span class="fk">한 줄</span><span class="fv">'+(S.EL_DEEP[c.yongEl].habit)+' — 오늘의 균형은 여기서 옵니다.</span></div>';
  h+='</div>';
  $('#ff-result').innerHTML=h;
}

/* ---------------- 무료 : 오늘의 타로 ---------------- */
var TAROT=[
 {no:'00',mk:'☼',name:'바보',kw:['시작','자유','가벼움'],msg:'오늘은 계획을 조금 내려놓아도 좋은 날입니다. 완벽하게 준비된 다음은 오지 않습니다. 작은 한 걸음을 먼저 떼어보세요.',tip:'익숙한 길 대신 한 블록 돌아가 보기'},
 {no:'01',mk:'✦',name:'마법사',kw:['의지','표현','시작'],msg:'말과 손이 함께 움직이면 오늘의 일은 풀립니다. 하고 싶은 것을 한 문장으로 적어 누군가에게 말해보세요.',tip:'미뤄둔 제안 하나 보내기'},
 {no:'02',mk:'☾',name:'여사제',kw:['직관','침묵','기다림'],msg:'답이 보이지 않을 때는 더 보지 않아도 됩니다. 오늘은 판단보다 관찰이 낫습니다. 조용히 듣는 자리를 먼저 만드세요.',tip:'질문 하나를 열어두고 하루 뒤에 결론'},
 {no:'03',mk:'❀',name:'여황제',kw:['풍요','돌봄','몸'],msg:'오늘은 몸을 먼저 챙기는 날입니다. 잘 먹고 잘 쉬는 것이 그대로 운이 됩니다. 누군가를 돌보기 전에 나부터.',tip:'따뜻한 한 끼와 20분 산책'},
 {no:'04',mk:'♜',name:'황제',kw:['질서','기준','책임'],msg:'오늘은 규칙을 세우면 힘이 생깁니다. 미뤄둔 결정을 하나 정하고, 그 기준을 글로 남기세요.',tip:'할 일 셋만 적어 순서 정하기'},
 {no:'05',mk:'✧',name:'교황',kw:['배움','조언','전통'],msg:'오늘은 물어보는 쪽이 이깁니다. 혼자 결론 내리지 말고 이미 해본 사람의 말을 들으세요.',tip:'한 사람에게 조언 구하기'},
 {no:'06',mk:'♡',name:'연인',kw:['선택','끌림','관계'],msg:'오늘은 마음이 가는 쪽을 인정하는 날입니다. 머리로 계산한 답보다 마음이 먼저 움직이는 쪽을 보세요.',tip:'좋아하는 것을 한 가지 말로 표현'},
 {no:'07',mk:'⚔',name:'전차',kw:['전진','의지','속도'],msg:'오늘은 미루던 일에 시동을 걸기 좋습니다. 방향이 반쯤 맞다면 일단 움직이고, 가면서 고치세요.',tip:'가장 미룬 일을 15분만 시작'},
 {no:'08',mk:'⛨',name:'힘',kw:['인내','부드러움','용기'],msg:'오늘은 세게 밀지 말고 오래 버티는 쪽이 이깁니다. 감정이 올라오면 한 박자 늦춰 말하세요.',tip:'화가 나면 30분 뒤에 답하기'},
 {no:'09',mk:'☖',name:'은둔자',kw:['고요','정리','혼자'],msg:'오늘은 혼자 있는 시간이 약입니다. 사람을 만나는 약속을 하나 줄이고, 생각을 정리하는 데 쓰세요.',tip:'저녁 30분 화면 없이 있기'},
 {no:'10',mk:'◎',name:'운명의 수레',kw:['전환','흐름','기회'],msg:'오늘은 흐름이 바뀌는 날입니다. 갑자기 생긴 일이 오히려 문이 될 수 있으니, 계획이 틀어져도 화내지 마세요.',tip:'예정에 없던 제안에 한 번 답해보기'},
 {no:'11',mk:'⚖',name:'정의',kw:['균형','공정','판단'],msg:'오늘은 미뤄둔 판단을 내리기 좋습니다. 감정과 사실을 나눠 적으면 답이 보입니다.',tip:'결정의 이유를 세 줄로 적기'},
 {no:'12',mk:'⏳',name:'매달린 사람',kw:['멈춤','관점','기다림'],msg:'오늘은 결정을 미루는 것이 답입니다. 같은 문제를 다른 각도에서 보면 보이지 않던 것이 보입니다.',tip:'문제를 한 문장으로 바꿔보기'},
 {no:'13',mk:'☠',name:'죽음',kw:['끝','정리','새로움'],msg:'오늘은 정리하는 날입니다. 끝내야 할 것을 끝내면 새 것이 들어올 자리가 생깁니다.',tip:'버릴 것 세 가지 정리'},
 {no:'14',mk:'♒',name:'절제',kw:['조율','중용','회복'],msg:'오늘은 과하지 않게가 답입니다. 먹고 마시고 말하는 것 모두 한 걸음씩 줄이면 몸이 편해집니다.',tip:'오늘 한 번은 “괜찮아요”라고 말하기'},
 {no:'15',mk:'⛧',name:'악마',kw:['집착','유혹','패턴'],msg:'오늘은 끊고 싶은 습관이 올라오는 날입니다. 참는 것보다 자리를 피하는 쪽이 쉽습니다.',tip:'유혹이 오는 자리를 미리 피하기'},
 {no:'16',mk:'⚡',name:'탑',kw:['변화','충격','해방'],msg:'오늘은 예상 밖의 일이 생길 수 있습니다. 무너진 것이 잘못된 것이 아니라, 오래된 것이었다는 신호입니다.',tip:'계획이 틀어지면 10분 멈추기'},
 {no:'17',mk:'☄',name:'별',kw:['희망','회복','치유'],msg:'오늘은 마음이 조금 밝아지는 날입니다. 작은 기대를 하나 정해두면 하루가 그것을 향해 흐릅니다.',tip:'올해 이루고 싶은 것 한 가지 적기'},
 {no:'18',mk:'☽',name:'달',kw:['불안','상상','무의식'],msg:'오늘은 이유 없이 기분이 가라앉을 수 있습니다. 그 감정을 사실로 믿지 말고, 잠을 먼저 챙기세요.',tip:'잠들기 전 오늘 좋았던 일 하나'},
 {no:'19',mk:'☀',name:'태양',kw:['기쁨','성취','드러남'],msg:'오늘은 잘 풀리는 날입니다. 숨기지 말고 드러내세요. 인정받을 일이 있다면 먼저 말해도 좋습니다.',tip:'잘한 일을 한 사람에게 알리기'},
 {no:'20',mk:'⚱',name:'심판',kw:['부름','재회','결산'],msg:'오늘은 오래된 것이 다시 떠오르는 날입니다. 연락이 오거나 생각이 나면, 답은 짧게 하세요.',tip:'미뤄둔 답장 하나 보내기'},
 {no:'21',mk:'✺',name:'세계',kw:['완성','마무리','확장'],msg:'오늘은 마무리에 좋은 날입니다. 끝내면 다음 판이 열립니다. 미완성으로 둔 하나를 오늘 끝내세요.',tip:'99% 남은 일 하나 끝내기'}
];
function tarotRng(seed){
  var x=Math.sin(seed)*10000; return x-Math.floor(x);
}
function renderTarot(){
  var stage=$('#tt-stage'); if(!stage) return;
  var now=new Date();
  var dayKey=now.getFullYear()*10000+(now.getMonth()+1)*100+now.getDate();
  var idxs=[];
  for(var i=0;i<3;i++){
    var n=Math.floor(tarotRng(dayKey+i*37)*TAROT.length)%TAROT.length;
    while(idxs.indexOf(n)>=0) n=(n+1)%TAROT.length;
    idxs.push(n);
  }
  stage.innerHTML=idxs.map(function(n,i){
    var t=TAROT[n];
    return '<button type="button" class="tcard" data-pick="'+i+'" aria-label="카드 '+(i+1)+'">'+
      '<span class="inner"><span class="face back"><span class="bk">天</span><span class="bl">天靈堂</span></span>'+
      '<span class="face front"><span class="no">'+t.no+'</span><span class="mk">'+t.mk+'</span><span class="nm">'+t.name+'</span></span></span></button>';
  }).join('');
  $$('.tcard',stage).forEach(function(b){
    b.addEventListener('click',function(){ pickTarot(idxs,parseInt(b.getAttribute('data-pick'),10),b,dayKey); });
  });
  $('#tt-result').innerHTML='';
  $('#tt-hint').style.display='block';
  /* 오늘 이미 뽑았으면 복원 */
  try{
    var saved=JSON.parse(localStorage.getItem('cl_tarot_'+dayKey)||'null');
    if(saved!=null&&saved>=0){
      var btn=$$('.tcard',stage)[saved];
      if(btn) pickTarot(idxs,saved,btn,dayKey,true);
    }
  }catch(e){}
}
function pickTarot(idxs,pick,btn,dayKey,restore){
  var t=TAROT[idxs[pick]];
  $$('.tcard').forEach(function(x){ x.classList.remove('picked'); });
  btn.classList.add('flip','picked');
  var msg=t.msg;
  if(!restore){ try{ localStorage.setItem('cl_tarot_'+dayKey,String(pick)); }catch(e){} }
  $('#tt-hint').style.display='none';
  $('#tt-result').innerHTML='<div class="tarot-read fade-in"><div class="tr-h"><span class="no">CARD '+t.no+'</span><h4>'+t.name+'</h4></div>'+
    '<div class="kw">'+t.kw.map(function(k){return '<span>'+k+'</span>';}).join('')+'</div>'+
    '<p>'+msg+'</p>'+
    '<div class="ch-key"><b>오늘의 행운 팁</b><span>'+t.tip+'</span></div>'+
    '<p class="hint" style="margin-top:10px">카드는 하루에 한 번. 내일 자정에 다시 섞입니다.</p></div>';
}

/* ---------------- 트랙 ---------------- */
function setTrack(t){
  $$('.track-btn').forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-track')===t); });
  ['read','today','life'].forEach(function(k){
    var el=$('#track-'+k); if(el) el.classList.toggle('on',k===t);
  });
  try{ $('#tracks').scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){}
}

/* ---------------- 테마 · 탭 ---------------- */
function renderThemes(){
  var box=$('#themeList'), h='';
  for(var k in CT.THEMES){
    var th=CT.THEMES[k];
    var on=(state.theme||'general')===k;
    h+='<button type="button" class="tp-card'+(on?' on':'')+'" data-theme="'+k+'" role="tab" aria-selected="'+(on?'true':'false')+'">'+
      '<span class="thumb"><img src="./assets/themes-web/t-'+(th.img||k)+'.jpg" alt="'+esc(th.name)+' 일러스트" width="240" height="240" loading="lazy"></span>'+
      '<span class="tx"><b>'+esc(th.short||th.name)+'</b><i>'+th.han+'</i></span></button>';
  }
  box.innerHTML=h;
  $$('.tp-card',box).forEach(function(b){
    b.addEventListener('click',function(){ openTheme(b.getAttribute('data-theme')); });
  });
}
function openTheme(key,silent){
  var th=CT.THEMES[key]; if(!th) return;
  state.theme=key; state.tab=th.tabs[0];
  $('#v-theme-han').textContent=th.han;
  $('#v-theme-name').textContent=th.name;
  $('#v-theme-tag').textContent=th.tagline;
  var bi=$('#v-banner-img');
  if(bi){ bi.setAttribute('src','./assets/themes-web/'+(th.img||key)+'.jpg'); bi.setAttribute('alt',th.name+' 일러스트'); }
  $$('.tp-card').forEach(function(b){
    var on=b.getAttribute('data-theme')===key;
    b.classList.toggle('on',on);
    b.setAttribute('aria-selected',on?'true':'false');
  });
  var c=th.ctx==='partner'||th.ctx==='baby';
  $('#ctxDivider').style.display=c?'block':'none';
  $('#ctxBlock').style.display=c?'block':'none';
  renderTabs();
  if(!silent){
    try{
      var tv=$('.v8-tpanel')||$('#themeView');
      var ty=tv.getBoundingClientRect().top+window.pageYOffset-140;
      window.scrollTo({top:ty,behavior:'smooth'});
    }catch(e){}
  }
}
function renderTabs(){
  var th=CT.THEMES[state.theme], box=$('#subtabs');
  box.innerHTML=th.tabs.map(function(k){
    var T=CT.TABS[k];
    return '<button type="button" class="subtab'+(k===state.tab?' on':'')+'" role="tab" data-tab="'+k+'">'+(k===state.tab?'<span class="dot"></span>':'')+T.name+'</button>';
  }).join('');
  $$('.subtab',box).forEach(function(b){
    b.addEventListener('click',function(){
      state.tab=b.getAttribute('data-tab');
      renderTabs(); updatePanelCopy(); $('#resultView').innerHTML='';
    });
  });
  updatePanelCopy();
}
function updatePanelCopy(){
  var T=CT.TABS[state.tab];
  $('#pf-title').textContent=T.name+' — 내 사주 입력';
  $('#pf-note').textContent=T.note||'';
  var tn=$('#v-tab-note');
  if(tn) tn.innerHTML='<b>'+esc(T.name)+'</b> · '+esc(T.tag||'');
  if(state.theme==='baby'&&state.tab!=='pregnancy'&&state.tab!=='taegyo'){
    $('#ctxSwitch').parentNode.querySelector('.ct-t').textContent='아이 정보';
    $('#ctxSwitch').parentNode.querySelector('.ct-s').textContent='아이의 생년월일을 넣으면 그 아이의 원국으로 읽습니다';
  } else {
    $('#ctxSwitch').parentNode.querySelector('.ct-t').textContent='상대방 정보';
    $('#ctxSwitch').parentNode.querySelector('.ct-s').textContent='상대의 생년월일을 넣으면 두 사람 글자를 함께 읽습니다';
  }
}

/* ---------------- 폼 읽기 ---------------- */
function readForm(){
  var y=parseInt($('#by').value,10), m=parseInt($('#bm').value,10), d=parseInt($('#bd').value,10);
  if(!y||!m||!d) return {err:'생년월일을 골라주세요',focus:'by'};
  var solar={y:y,m:m,d:d};
  if(state.cal==='lunar'){
    var ls=S.lunarToSolar(y,m,d,$('#leap').checked);
    if(!ls) return {err:'음력 날짜를 다시 확인해 주세요. 그 달이 없거나 윤달이 아닐 수 있어요.',focus:'bm'};
    solar=ls;
  }
  if(solar.y<1900||solar.y>2099) return {err:'1900~2099년 사이로 골라주세요',focus:'by'};
  var dim=new Date(solar.y,solar.m,0).getDate();
  if(solar.d>dim) return {err:solar.y+'년 '+solar.m+'월은 '+dim+'일까지 있습니다',focus:'bd'};
  var noTime=$('#notime').checked, hv=$('#hour').value;
  if(!noTime&&hv==='') return {err:'태어난 시간을 고르거나 ‘시간 모름’을 체크해 주세요',focus:'hour'};
  var reg=regionOf($('#region').value);
  var gender=$('#genderChips .chip.on'); gender=gender?gender.getAttribute('data-g'):'f';
  var c={stage:state.stage,marry:state.marry,kid:state.kid,partner:null,partnerErr:null};
  var th=CT.THEMES[state.theme];
  if((th.ctx==='partner'||th.ctx==='baby')&&state.ctx){
    var py=parseInt($('#py').value,10),pm=parseInt($('#pm').value,10),pd=parseInt($('#pd').value,10);
    if(py&&pm&&pd){
      var preg=regionOf($('#pregion').value), pNo=$('#pnotime').checked, pHv=$('#phour').value;
      c.partner={y:py,m:pm,d:pd,hasTime:!pNo&&pHv!=='',hourIndex:(!pNo&&pHv!=='')?parseInt(pHv,10):0,
        gender:th.ctx==='baby'?'m':'m',tsoff:(!pNo&&pHv!=='')?preg.off:0,regionName:preg.name};
    } else if(py||pm||pd){
      c.partnerErr='상대방 생년월일을 모두 골라주세요';
    }
  }
  return {y:solar.y,m:solar.m,d:solar.d,hasTime:!noTime,hourIndex:noTime?0:parseInt(hv,10),
    gender:gender,tsoff:noTime?0:reg.off,regionName:reg.name,regionKey:reg.k,
    name:($('#nm').value||'').trim()||'당신',theme:state.theme,tab:state.tab,ctx:c,
    cal:state.cal, lunar:(state.cal==='lunar')?{y:y,m:m,d:d,leap:$('#leap').checked}:null};
}

/* ---------------- 결과 ---------------- */
function onSubmit(e){
  e.preventDefault();
  var err=$('#formErr');
  var inp=readForm();
  if(inp.err){ err.textContent=inp.err; err.hidden=false; if($('#'+inp.focus)) $('#'+inp.focus).focus(); return; }
  err.hidden=true;
  showLoading();
  setTimeout(function(){
    try{
      var R=S.computeSaju(inp);
      inp.ctx.R=R;
      state.R=R; state.input=inp;
      renderResult(R,inp);
    }catch(ex){
      $('#resultView').innerHTML='<p class="err">사주를 계산하는 중 문제가 생겼습니다. 생년월일을 확인해 주세요.</p>';
      if(window.console) console.error(ex);
    }
    hideLoading();
  },700);
}
function showLoading(){ var l=$('#loading'); if(l) l.classList.add('on'); }
function hideLoading(){ var l=$('#loading'); if(l) l.classList.remove('on'); }

function pillarCells(R){
  var cols=[['년주',R.yIdx],['월주',R.mIdx],['일주',R.dIdx],['시주',R.hIdxP]];
  var h='';
  for(var i=0;i<4;i++){
    var ix=cols[i][1];
    if(ix==null){ h+='<div class="pillar"><div class="pl">시주</div><div class="pg">時未知</div><div class="pc" style="color:#6b6255">—</div><div class="pk">시간 모름</div><div class="pc" style="color:#6b6255">—</div><div class="pk">&nbsp;</div><div class="pe">미상</div></div>'; continue; }
    var s=ix%10,b=ix%12;
    h+='<div class="pillar'+(i===2?' me':'')+'">'+
      '<div class="pl">'+cols[i][0]+'</div>'+
      '<div class="pg">'+(i===2?'일간':S.tenGod(R.dStem,s))+'</div>'+
      '<div class="pc" style="color:'+S.EL_COLOR[S.STEM_EL[s]]+'">'+S.STEM_HAN[s]+'</div>'+
      '<div class="pk">'+S.STEM_KO[s]+'</div>'+
      '<div class="pc" style="color:'+S.EL_COLOR[S.BR_EL[b]]+'">'+S.BR_HAN[b]+'</div>'+
      '<div class="pk">'+S.BR_KO[b]+'</div>'+
      '<div class="pe" style="color:'+S.EL_COLOR[S.BR_EL[b]]+'">'+S.EL_KO[S.BR_EL[b]]+'</div></div>';
  }
  return h;
}
function renderResult(R,input){
  var c=S.chartCtx(R);
  var T=CT.TABS[input.tab], th=CT.THEMES[input.theme];
  var chapters=CT.chaptersOf(input.tab);
  var name=input.name;
  var h='<div class="res-head fade-in">';
  h+='<div class="rh-t">'+th.han+' · '+esc(T.name)+'</div>';
  h+='<h2>'+esc(name)+' 님의 '+(R.dStem%2?'':'')+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주</h2>';
  h+='<div class="rh-s">'+S.ILJU[R.dIdx][0]+' — '+S.ILJU[R.dIdx][2]+'</div>';
  h+='<div class="pillars">'+pillarCells(R)+'</div>';
  var meta=S.STEM_HAN[R.dStem]+'('+S.STEM_KO[R.dStem]+') 일간 · '+(R.strength==='강'?'신강':(R.strength==='약'?'신약':'중화'))+' · 용신 '+S.EL_KO[c.yongEl]+'('+S.EL_HAN[c.yongEl]+') · 대운 '+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세';
  h+='<div class="rh-meta">'+meta+'<br>'+R.y+'년 '+R.m+'월 '+R.d+'일 '+(input.cal==='lunar'?'음력':'양력')+' · '+(R.hasTime?solarNote(R):'시간 모름(시주 제외)')+'</div>';
  h+='</div>';

  h+='<div class="res-sum fade-in"><p><b>'+esc(name)+'</b> 님의 여덟 글자는 '+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주, 일간 '+S.STEM_HAN[R.dStem]+'('+S.STEM_KO[R.dStem]+')입니다. 오행은 <b>'+S.EL_KO[c.mostI]+'</b>이 가장 두텁고 <b>'+S.EL_KO[c.leastI]+'</b>이 가장 얇으며, 필요한 기운은 <b>'+S.EL_KO[c.yongEl]+'('+S.EL_HAN[c.yongEl]+')</b>입니다.</p>';
  h+='<p>'+S.DAY_MASTER[R.dStem][0]+'의 결로 태어나 '+S.GROUP_MEAN[c.topGrp]+' 이 사주의 중심 별은 <b>'+c.topGodInGrp+'</b>입니다. '+S.GOD_KEY[c.topGodInGrp]+'의 방식으로 살 때 가장 편안해집니다.</p>';
  if(input.ctx&&input.ctx.partnerErr) h+='<p style="color:#c94228">'+esc(input.ctx.partnerErr)+' — 내 사주만 읽었습니다.</p>';
  h+='</div>';

  for(var i=0;i<chapters.length;i++){
    var ch=chapters[i], body='';
    try{ body=ch.body(R,c,input,name); }catch(ex){ body='<p class="hint">이 장은 준비 중입니다.</p>'; if(window.console) console.error(ch.title,ex); }
    h+='<section class="ch fade-in"><div class="ch-hd"><span class="ch-no">'+pad2(i+1)+'</span>'+
       '<div class="ch-t"><h3>'+ch.title+'</h3><div class="ch-s">'+ch.sub+'</div></div></div>'+
       '<div class="ch-bd">'+body+'</div></section>';
  }
  h+='<div class="panel" style="margin-top:18px;text-align:center">'+
     '<h3 style="font-size:18px">여기까지가 '+esc(T.name)+'의 결입니다</h3>'+
     '<p class="ph" style="margin-bottom:14px">같은 주제를 88장 인생설계서에서는 30년 대운과 12개월 달력까지 이어서 풉니다.</p>'+
     '<button type="button" class="btn btn-gold btn-block" data-goto-pdf>📜 인생설계서 88장 보기</button></div>';
  h=h.replace(/당신 님/g,'당신');
  $('#resultView').innerHTML=h;
  $$('[data-goto-pdf]').forEach(function(b){ b.addEventListener('click',function(){ setTrack('life'); }); });
  try{ var rv=$('#resultView'); var y=rv.getBoundingClientRect().top+window.pageYOffset-146; window.scrollTo({top:y,behavior:'smooth'}); }catch(e){}
}
function solarNote(R){
  var a=R.solarAdj;
  if(!a) return '진태양시 보정 없음';
  var from=Math.floor(a.from), fm=Math.round((a.from-from)*60);
  var to=Math.floor(a.to), tm=Math.round((a.to-to)*60);
  return a.region+' 진태양시 '+(a.off>0?'+':'')+a.off+'분 보정 적용 ('+pad2(from)+':'+pad2(fm)+' → '+pad2(to)+':'+pad2(tm)+')';
}

/* ---------------- PDF 신청 ---------------- */
var pdfStep=1;
function initPdf(){
  var form=$('#pdfForm');
  if(!form) return;
  $$('[data-next]',form).forEach(function(b){ b.addEventListener('click',function(){ gotoPdf(parseInt(b.getAttribute('data-next'),10)); }); });
  $$('[data-prev]',form).forEach(function(b){ b.addEventListener('click',function(){ gotoPdf(parseInt(b.getAttribute('data-prev'),10)); }); });
  var q=$('#lz-q');
  q.addEventListener('input',function(){ $('#lz-qcount').textContent=q.value.length; });
  form.addEventListener('submit',function(e){ e.preventDefault(); submitPdf(); });
  var lr=$('#lzLeapRow'); if(lr) lr.style.display='none';
  if($('#lz-y')) fillYears($('#lz-y'),1920,'연도');
  if($('#lz-m')) fillMonths($('#lz-m'),true);
  if($('#lz-d')) fillDays($('#lz-d'),true);
  if($('#lz-hour')) fillHours($('#lz-hour'),true);
  if($('#lz-region')) fillRegions($('#lz-region'));
}
function gotoPdf(n){
  if(n===4&&!buildPdfSummary()) return;
  pdfStep=n;
  $$('#pdfSteps .st').forEach(function(s){ s.classList.toggle('on',parseInt(s.getAttribute('data-step'),10)<=n); });
  $$('.step-body').forEach(function(b){ b.classList.toggle('on',parseInt(b.getAttribute('data-step'),10)===n); });
  try{ $('#pdfSteps').scrollIntoView({behavior:'smooth',block:'center'}); }catch(e){}
}
function readPdfBase(){
  var y=parseInt($('#lz-y').value,10), m=parseInt($('#lz-m').value,10), d=parseInt($('#lz-d').value,10);
  if(!y||!m||!d) return {err:'생년월일을 모두 골라주세요'};
  var solar={y:y,m:m,d:d};
  if(state.pcal==='lunar'){
    var ls=S.lunarToSolar(y,m,d,$('#lz-leap').checked);
    if(!ls) return {err:'음력 날짜를 다시 확인해 주세요'};
    solar=ls;
  }
  var noTime=$('#lz-notime').checked, hv=$('#lz-hour').value;
  if(!noTime&&hv==='') return {err:'태어난 시간을 고르거나 ‘모름’을 체크해 주세요'};
  var reg=regionOf($('#lz-region').value);
  var g=$('#lzGender .chip.on'); g=g?g.getAttribute('data-g'):'f';
  return {name:($('#lz-name').value||'').trim()||'고객',y:solar.y,m:solar.m,d:solar.d,
    hasTime:!noTime,hourIndex:noTime?0:parseInt(hv,10),gender:g,tsoff:noTime?0:reg.off,
    regionName:reg.name,regionKey:reg.k};
}
function buildPdfSummary(){
  var b=readPdfBase();
  if(b.err){ $('#lz-err4').textContent=b.err; $('#lz-err4').hidden=false; return false; }
  var q=($('#lz-q').value||'').trim();
  var marry=$('#lzMarry .chip.on'), kid=$('#lzChild .chip.on');
  var h='<b>'+esc(b.name)+'</b> · '+b.y+'.'+pad2(b.m)+'.'+pad2(b.d)+' '+(b.hasTime?hourLabel(b.hourIndex):'시간 모름')+' · '+(b.gender==='f'?'여성':'남성')+' · '+b.regionName+
    '<br>결혼 '+((marry&&marry.getAttribute('data-m'))||'-')+' · 자녀 '+((kid&&kid.getAttribute('data-c'))||'-')+
    (q?'<br>질문 — '+esc(q):'<br>질문 — 없음(기본 구성)');
  $('#lz-summary').innerHTML=h;
  return true;
}
function submitPdf(){
  var b=readPdfBase();
  if(b.err){ $('#lz-err4').textContent=b.err; $('#lz-err4').hidden=false; return; }
  if(!$('#lz-agree').checked){ $('#lz-err4').textContent='동의에 체크해 주세요'; $('#lz-err4').hidden=false; return; }
  var email=($('#lz-email').value||'').trim();
  var phone=($('#lz-phone').value||'').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){ gotoPdf(3); $('#lz-err3').textContent='이메일 주소를 확인해 주세요'; $('#lz-err3').hidden=false; return; }
  var marry=$('#lzMarry .chip.on'), kid=$('#lzChild .chip.on'), stage=$('#lzStage .chip.on');
  var order={id:'CL'+Date.now().toString(36).toUpperCase().slice(-6),at:new Date().toISOString(),
    name:b.name,date:b.y+'-'+pad2(b.m)+'-'+pad2(b.d),hasTime:b.hasTime,hourIndex:b.hourIndex,
    gender:b.gender,tsoff:b.tsoff,regionName:b.regionName,regionKey:b.regionKey,cal:state.pcal,
    stage:stage?stage.getAttribute('data-s'):'',marry:marry?marry.getAttribute('data-m'):'single',
    kid:kid?kid.getAttribute('data-c'):'none',q:($('#lz-q').value||'').trim(),email:email,phone:phone,status:'접수'};
  try{
    var list=JSON.parse(localStorage.getItem('cl_orders')||'[]');
    list.unshift(order); localStorage.setItem('cl_orders',JSON.stringify(list));
  }catch(e){}
  $$('.step-body').forEach(function(x){ x.classList.remove('on'); });
  $('#pdfSteps').style.display='none';
  var d=$('#pdfDone');
  d.classList.add('on');
  d.innerHTML='<div class="done-box fade-in"><div class="ok">✓</div><h3>접수가 완료되었습니다</h3>'+
    '<div class="num">접수번호 '+order.id+'</div>'+
    '<p>'+esc(b.name)+' 님의 원국을 검수한 뒤, 영업일 2~3일 안에 책자형 PDF를 '+esc(email)+'으로 보내드립니다.</p>'+
    '<p>결제와 발송 안내는 검수 완료 후 문자로 드립니다.</p>'+
    '<button type="button" class="btn btn-line btn-block" style="margin-top:16px" data-goto-top>처음으로</button></div>';
  $$('[data-goto-top]').forEach(function(x){ x.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); }); });
}

/* ---------------- 관리자 ---------------- */
function orders(){
  try{ return JSON.parse(localStorage.getItem('cl_orders')||'[]'); }catch(e){ return []; }
}
function sampleEntry(){
  return {id:'SAMPLE-01',name:'김서연',date:'1993-05-14',hasTime:true,hourIndex:4,gender:'f',
    tsoff:-32,regionName:'서울 · 인천 · 경기',cal:'solar',stage:'work',marry:'married',kid:'none',
    q:'올해 안에 아이를 준비해도 될까요? 그리고 남편과 함께 이사를 계획 중인데 시기가 궁금합니다.',email:'sample@cheonryeongdang.kr',phone:'010-0000-0000',status:'샘플'};
}
function openAdmin(){
  $('#adminSheet').classList.add('on'); $('#adminSheet').setAttribute('aria-hidden','false');
  document.body.classList.add('lock');
  renderAdminList();
}
function closeAdmin(){
  $('#adminSheet').classList.remove('on'); $('#adminSheet').setAttribute('aria-hidden','true');
  document.body.classList.remove('lock');
}
function renderAdminList(){
  var list=orders(), h='';
  h+='<button type="button" class="adm-item" data-open="sample"><b>샘플 · 김서연</b><span>1993.05.14 08:30 · 여 · 서울</span><span class="st">샘플 책자</span></button>';
  list.forEach(function(o,i){
    h+='<button type="button" class="adm-item" data-open="'+i+'"><b>'+esc(o.name)+' · '+esc(o.date)+'</b>'+
      '<span>'+(o.hasTime?hourLabel(o.hourIndex):'시간 모름')+' · '+(o.gender==='f'?'여':'남')+' · '+esc(o.regionName||'')+' · '+esc(o.email)+'</span>'+
      '<span class="st">'+esc(o.status||'접수')+' · '+esc(o.id)+'</span></button>';
  });
  if(!list.length) h+='<div class="adm-empty">아직 접수된 신청이 없습니다.<br>샘플 책자로 미리보기를 확인하세요.</div>';
  $('#admList').innerHTML=h;
  $$('#admList .adm-item').forEach(function(b){
    b.addEventListener('click',function(){
      var k=b.getAttribute('data-open');
      openBook(k==='sample'?sampleEntry():orders()[parseInt(k,10)]);
    });
  });
}
function entryToInput(o){
  return {name:o.name,y:parseInt(String(o.date).slice(0,4),10),m:parseInt(String(o.date).slice(5,7),10),d:parseInt(String(o.date).slice(8,10),10),
    hasTime:!!o.hasTime,hourIndex:o.hourIndex||0,gender:o.gender||'f',tsoff:o.tsoff||0,regionName:o.regionName||'',
    theme:'general',tab:'life',ctx:{marry:o.marry||'single',kid:o.kid||'none',stage:o.stage||'',question:o.q||''}};
}
function openBook(o){
  if(!o) return;
  var inp=entryToInput(o);
  var R;
  try{ R=S.computeSaju(inp); }catch(e){ alert('원국을 계산하지 못했습니다.'); return; }
  inp.ctx.R=R;
  $('#admListView').style.display='none';
  $('#admBookView').style.display='block';
  var host=$('#wl2-book');
  host.innerHTML='<p style="color:#c9bda6">책자를 조판하는 중입니다…</p>';
  setTimeout(function(){
    try{
      var res=window.BOOK.build(R,inp,o.name);
      host.innerHTML=res.html;
      $('#admBookMeta').innerHTML='<b style="color:#ecd6a6">'+esc(o.name)+'</b> · '+o.date+' · '+(o.hasTime?hourLabel(o.hourIndex):'시간 모름')+' · '+
        'A4 '+res.pages+'장 · 원국 '+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주';
    }catch(ex){
      host.innerHTML='<p style="color:#e79a72">책자를 만들지 못했습니다: '+esc(ex.message)+'</p>';
      if(window.console) console.error(ex);
    }
  },40);
}

window.APP={init:init,state:state};
document.addEventListener('DOMContentLoaded',function(){
  try{ init(); }catch(e){ if(window.console) console.error('init',e); }
});
})();
