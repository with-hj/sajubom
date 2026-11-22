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
 {k:'abroad',name:'해외(현지 표준시 그대로)',off:0},
 {k:'unknown',name:'출생지 모름',off:0,unknown:true}
];
var HOURS=['자시','축시','인시','묘시','진시','사시','오시','미시','신시','유시','술시','해시'];
function hourLabel(i){
  var st=(i*2+23)%24, en=(i*2+1)%24;
  return pad2(st)+':30~'+pad2(en)+':29 ('+HOURS[i]+')';
}

var state={
  theme:null, tab:null, gender:'f', cal:'solar', leap:false,
  ctx:false, pg:'m', pcal:'solar', stage:'', marry:'single', kid:'none',
  R:null, input:null, email:'',
  introDone:{}            /* 영상 인트로를 이미 연 탭 (탭별로 기억) */
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
  sel.innerHTML=REGIONS.map(function(r){return '<option value="'+r.k+'">'+r.name+'</option>';}).join('');
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
  [['by','bm','bd'],['py','pm','pd'],['lz-y','lz-m','lz-d']].forEach(function(ids){
    var ys=$('#'+ids[0]),ms=$('#'+ids[1]),ds=$('#'+ids[2]);
    if(!ys) return;
    fillYears(ys,1920,'연도'); fillMonths(ms,true); fillDays(ds,true);
    ys.addEventListener('change',function(){syncDays(ys,ms,ds);});
    ms.addEventListener('change',function(){syncDays(ys,ms,ds);});
  });
  /* 시간 */
  [['hour',true],['phour',true],['lz-hour',true]].forEach(function(a){
    var el=$('#'+a[0]); if(el) fillHours(el,a[1]);
  });
  /* 지역 */
  ['region','pregion','lz-region'].forEach(function(id){ var el=$('#'+id); if(el) fillRegions(el); });

  /* 히어로 배경 */
  var art=$('.hero-art'); if(art) art.style.backgroundImage='url(./assets/hero-art.jpg)';

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
  bindChips('#pGenderChips',function(b){return {p:b.getAttribute('data-pg')};},function(v){ state.pg=v.p; });
  bindIntro();

  /* 상대 정보 스위치 */
  var sw=$('#ctxSwitch');
  if(sw) sw.addEventListener('click',function(){
    state.ctx=!state.ctx;
    sw.classList.toggle('on',state.ctx);
    $('#ctxBody').classList.toggle('on',state.ctx);
  });
  /* 모름 체크 */
  [['notime','hour'],['pnotime','phour'],['lz-notime','lz-hour']].forEach(function(a){
    var c=$('#'+a[0]),s=$('#'+a[1]);
    if(!c||!s) return;
    c.addEventListener('change',function(){ s.disabled=c.checked; if(c.checked) s.value=''; });
  });
  /* v48 · 지역 모름 — 체크하면 출생 지역을 '출생지 모름'으로 맞추고 잠그며, 풀면 직전 지역으로 돌린다 */
  var nrg=$('#noregion'), rg=$('#region');
  if(nrg&&rg){
    var prevReg=rg.value||'seoul';
    nrg.addEventListener('change',function(){
      if(nrg.checked){
        if(rg.value&&rg.value!=='unknown') prevReg=rg.value;
        rg.value='unknown'; rg.disabled=true;
      }else{
        rg.disabled=false;
        rg.value=(prevReg&&prevReg!=='unknown')?prevReg:'seoul';
      }
    });
  }
  /* 트랙 */
  $$('.track-btn').forEach(function(b){
    b.addEventListener('click',function(){ setTrack(b.getAttribute('data-track')); });
  });
  $$('[data-goto-track]').forEach(function(a){
    a.addEventListener('click',function(){ setTimeout(function(){ setTrack(a.getAttribute('data-goto-track')); },60); });
  });
  /* 인생사주 리포트 표지 → 구매 안내 */
  $$('[data-life-cta]').forEach(function(b){
    b.addEventListener('click',function(){
      var el=$('#life-buy');
      if(!el) return;
      var y=el.getBoundingClientRect().top+window.pageYOffset-110;
      window.scrollTo({top:y<0?0:y,behavior:'smooth'});
    });
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
  /* 관리자 · 고객 리포트 뷰어
     — 관리자 화면은 푸터 [관리자] 또는 ?admin=1 로 열리며, 반드시 비밀번호를 받는다.
       한 번 열면 그 탭 세션 동안은 다시 묻지 않는다(sessionStorage). 고객 화면에는 관리자 UI가 없다. */
  ADMIN_OK=false;
  if($('#ftAdmin')) $('#ftAdmin').addEventListener('click',function(){ askAdminPassword('list'); });
  if($('#pwCancel')) $('#pwCancel').addEventListener('click',closePwModal);
  if($('#pwForm')) $('#pwForm').addEventListener('submit',onPwSubmit);
  if($('#pwModal')) $('#pwModal').addEventListener('click',function(e){ if(e.target&&e.target.id==='pwModal') closePwModal(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ var m=$('#pwModal'); if(m&&m.classList.contains('on')) closePwModal(); } });
  if($('#admClose')) $('#admClose').addEventListener('click',closeBookSheet);
  if($('#admBack')) $('#admBack').addEventListener('click',function(){
    $('#admBookView').style.display='none'; $('#admListView').style.display='block';
  });
  $$('.adm-tab').forEach(function(b){
    b.addEventListener('click',function(){
      $$('.adm-tab').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');
      if(b.getAttribute('data-adm')==='sample') openBook(sampleEntry(),'admin');
      else { $('#admBookView').style.display='none'; $('#admListView').style.display='block'; }
    });
  });
  if($('#pdfPrint')) $('#pdfPrint').addEventListener('click',function(){ window.print(); });
  if($('#pdfDl')) $('#pdfDl').addEventListener('click',downloadBookPdf);
  /* 미리보기 3장 — 클릭하면 원본 크기로 크게 보기 */
  initLightbox();

  /* URL 파라미터 */
  try{
    if(/[?&]admin=1/.test(location.search)) askAdminPassword(/[?&]book=sample/.test(location.search)?'sample':'list');
    else if(adminUnlocked()) ADMIN_OK=true;
    if(/[?&]track=life/.test(location.search)) setTrack('life');
  }catch(e){}
}
/* ---------------- 미리보기 크게 보기(라이트박스) ---------------- */
function initLightbox(){
  var lb=$('#lightbox'); if(!lb) return;
  var img=$('#lbImg'), cap=$('#lbCap');
  function open(src,text){
    if(img) img.setAttribute('src',src);
    if(cap) cap.textContent=text||'';
    lb.classList.add('on'); lb.setAttribute('aria-hidden','false');
    document.body.classList.add('lock');
    var x=$('#lbClose'); if(x){ try{ x.focus(); }catch(e){} }
  }
  function close(){
    lb.classList.remove('on'); lb.setAttribute('aria-hidden','true');
    document.body.classList.remove('lock');
  }
  $$('.lr-prev figure').forEach(function(f){
    var im=f.querySelector('img'); if(!im) return;
    var fig=f.querySelector('figcaption');
    function go(e){
      if(e&&e.preventDefault) e.preventDefault();
      open(im.getAttribute('src'),fig?fig.textContent.replace(/\s+/g,' ').trim():'');
    }
    f.addEventListener('click',go);
    f.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ go(e); } });
  });
  lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
  if($('#lbClose')) $('#lbClose').addEventListener('click',close);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&lb.classList.contains('on')) close(); });
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
  /* 화면에 이미 켜져 있는 알약이 있으면 그것을 기준으로 삼는다 (v48: 남/여 순서가 바뀌어도 기본값이 흘러가지 않게) */
  var cur=btns.filter(function(b){ return b.classList.contains('on'); })[0]||btns[0];
  if(cur) on(get(cur));
}

/* ---------------- 트랙 ---------------- */
function setTrack(t){
  $$('.track-btn').forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-track')===t); });
  if(t==='life') markThemeCredit();
  ['read','life'].forEach(function(k){
    var el=$('#track-'+k); if(el) el.classList.toggle('on',k===t);
  });
  try{
    var sec=$('#track-'+t);
    var ty=sec?sec.getBoundingClientRect().top+window.pageYOffset-122:0;
    window.scrollTo({top:ty<0?0:ty,behavior:'smooth'});
  }catch(e){}
}

/* 생년월일 입력 전에도 보이는 가격: 테마 결제 이력이 있으면 차감가를 함께 안내 */
function lifePriceHTML(credit){
  if(credit) return '<s>119,000원</s><em>75%</em><b>29,900원</b><span>테마 결제 9,900원 차감 적용</span>';
  return '<s>119,000원</s><em>67%</em><b>39,800원</b><span>1부 · 프리미엄 소장본 PDF</span>';
}
function markThemeCredit(){
  var old=document.getElementById('lrCreditNote');
  if(old&&old.parentNode) old.parentNode.removeChild(old);
  var box=document.querySelector('#track-life .lr-price');
  if(!box) return;
  box.innerHTML=lifePriceHTML(themeCredit());
}
/* ---------------- 테마 · 탭 ---------------- */
/* v48 · 테마 카드 아래 표식을 01~05 숫자에서 원래의 한자로 되돌린다 */
var THEME_HA={general:'總',love:'緣',marriage:'婚',baby:'孕',wealth:'財'};
function renderThemes(){
  var box=$('#themeList'), h='', i=0;
  for(var k in CT.THEMES){
    var th=CT.THEMES[k];
    i++;
    var on=(state.theme||'general')===k;
    h+='<button type="button" class="tp-card'+(on?' on':'')+'" data-theme="'+k+'" role="tab" aria-selected="'+(on?'true':'false')+'">'+
      '<span class="thumb"><img src="./assets/themes-web/t-'+(th.img||k)+'.jpg" alt="'+esc(th.name)+' 일러스트" width="240" height="240" loading="lazy"></span>'+
      '<span class="tx"><b>'+esc(th.short||th.name).replace(/\n/g,'<br>')+'</b>'+
      '<i class="ha">'+THEME_HA[k]+'</i></span></button>';
  }
  box.innerHTML=h;
  $$('.tp-card',box).forEach(function(b){
    b.addEventListener('click',function(){ openTheme(b.getAttribute('data-theme')); });
  });
}
function openTheme(key,silent){
  var th=CT.THEMES[key]; if(!th) return;
  state.theme=key; state.tab=th.tabs[0];
  $$('.tp-card').forEach(function(b){
    var on=b.getAttribute('data-theme')===key;
    b.classList.toggle('on',on);
    b.setAttribute('aria-selected',on?'true':'false');
  });
  var c=!!fieldsFor(key,state.tab).ctx;
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
    return '<button type="button" class="subtab'+(k===state.tab?' on':'')+'" role="tab" data-tab="'+k+'">'+(k===state.tab?'<span class="dot"></span>':'')+'<span class="tx">'+T.name+'</span></button>';
  }).join('');
  $$('.subtab',box).forEach(function(b){
    b.addEventListener('click',function(){
      state.tab=b.getAttribute('data-tab');
      renderTabs(); updatePanelCopy(); $('#resultView').innerHTML='';
    });
  });
  updatePanelCopy();
}
/* 탭마다 실제로 의미 있는 입력만 보여줍니다 */
var THEME_FIELDS={
  general:{stage:1,marry:1,kid:1,ctx:0},
  love:{stage:0,marry:1,kid:0,ctx:'partner'},
  marriage:{stage:0,marry:1,kid:0,ctx:'partner'},
  wealth:{stage:1,marry:0,kid:0,ctx:0}
};
function fieldsFor(theme,tab){
  if(theme==='baby'){
    if(tab==='child') return {stage:0,marry:0,kid:0,ctx:'child'};
    if(tab==='parent') return {stage:0,marry:1,kid:0,ctx:'partner'};
    return {stage:0,marry:1,kid:1,ctx:0};
  }
  return THEME_FIELDS[theme]||THEME_FIELDS.general;
}
function setCtxLabel(t,s){
  var tt=$('#ctxSwitch').parentNode.querySelector('.ct-t');
  var ts=$('#ctxSwitch').parentNode.querySelector('.ct-s');
  if(tt) tt.textContent=t; if(ts) ts.textContent=s;
}
function applyFields(){
  var f=fieldsFor(state.theme,state.tab);
  state.fields=f;
  var st=$('#stageField'), mf=$('#marryField'), kf=$('#kidField');
  if(st) st.style.display=f.stage?'block':'none';
  if(mf) mf.style.display=f.marry?'block':'none';
  if(kf) kf.style.display=f.kid?'block':'none';
  var cb=$('#ctxBlock');
  if(cb) cb.style.display=f.ctx?'block':'none';
  var gf=$('#pGenderField');
  if(gf) gf.style.display=(f.ctx==='child')?'block':'none';
  var lb=$('#pBirthLabel');
  if(lb) lb.textContent=(f.ctx==='child')?'아이 생년월일':'상대방 생년월일';
  if(f.ctx==='child') setCtxLabel('아이 정보','아이의 생년월일을 넣으면 그 아이의 원국으로 읽습니다');
  else if(f.ctx==='partner'&&state.theme==='baby') setCtxLabel('배우자 정보','배우자의 생년월일을 넣으면 두 사람 결과 아이의 자리를 함께 봅니다');
  else setCtxLabel('상대방 정보','상대의 생년월일을 넣으면 두 사람 글자를 함께 읽습니다');
}
function updatePanelCopy(){
  var T=CT.TABS[state.tab];
  $('#pf-title').textContent=T.formTitle||(T.name+' — 내 사주 입력');
  $('#pf-note').textContent=T.note||'';
  var tn=$('#v-tab-note');
  if(tn) tn.innerHTML='<b>'+esc(T.name)+'</b> · '+esc(T.tag||'');
  applyFields();
  syncIntro();
}

/* ---------------- v46 · 신년운세 영상 인트로 ----------------
   영상이 있는 탭(지금은 종합운세 → 신년운세)에서만 9:16 인트로 카드를 보여주고
   사주 입력창을 잠시 감춘다. 영상이 끝나거나 CTA를 누르면 입력창을 부드럽게 연다.
   다른 탭에 영상을 붙일 때는 content.js의 TABS[탭].video 에 mp4 경로만 넣으면 된다. */
function introSrc(){
  var T=CT.TABS[state.tab];
  return (T&&T.video)?T.video:null;
}
/* v47 · 영상이 끝나면 입력창이 '툭' 올라오지 않고, 높이·투명도·이동을 함께 부드럽게 펼친다.
   v48 · 브라우저 기본 smooth 스크롤(0.3~0.5초)이 여전히 빨라 보인다는 지적에 따라,
   입력창으로 가는 이동을 1.5초짜리 직접 그린 감속 곡선(requestAnimationFrame + cubic ease-in-out)으로 바꾸고,
   펼침은 1.2초 ease-out으로 늘려 영상에서 입력창으로 천천히 흘러가듯 잇는다. */
var SCROLL_MS=1500, REVEAL_MS=1200;
function reducedMotion(){
  try{ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; }
}
function easeInOutCubic(t){ return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
var glideRAF=0, glideTok=0;
function endGlide(tok){
  if(tok===glideTok){
    try{ document.documentElement.classList.remove('gliding'); }catch(e){}
  }
}
function stopGlide(){
  glideTok++;
  try{ if(glideRAF) cancelAnimationFrame(glideRAF); }catch(e){}
  glideRAF=0;
  try{ document.documentElement.classList.remove('gliding'); }catch(e){}
}
function glideTo(y,dur){
  y=Math.max(0,Math.round(y));
  if(reducedMotion()){ try{ window.scrollTo(0,y); }catch(e){} return; }
  try{ if(glideRAF) cancelAnimationFrame(glideRAF); }catch(e){}
  var start=window.pageYOffset||document.documentElement.scrollTop||0;
  var dist=y-start;
  dur=(dur==null)?SCROLL_MS:dur;
  if(Math.abs(dist)<2||!dur){ try{ window.scrollTo(0,y); }catch(e){} return; }
  var tok=++glideTok;
  document.documentElement.classList.add('gliding');   /* html의 기본 smooth와 겹치지 않게 */
  function userTakeover(){ stopGlide(); }               /* 손으로 먼저 끌면 그리로 넘긴다 */
  try{
    window.addEventListener('touchstart',userTakeover,{passive:true,once:true});
    window.addEventListener('wheel',userTakeover,{passive:true,once:true});
  }catch(e){}
  var t0=null;
  function step(ts){
    if(tok!==glideTok) return;
    if(t0===null) t0=ts;
    var p=Math.min(1,(ts-t0)/dur);
    try{ window.scrollTo(0, start+dist*easeInOutCubic(p)); }catch(e){}
    if(p<1){ glideRAF=requestAnimationFrame(step); }
    else { glideRAF=0; endGlide(tok); }
  }
  glideRAF=requestAnimationFrame(step);
}
function scrollToPanel(p,dur){
  try{
    var top=p.getBoundingClientRect().top+window.pageYOffset-124;  /* 상단 헤더+트랙 바 아래로 */
    glideTo(top,dur);
  }catch(e){}
}
function revealForm(scroll){
  var p=$('#panelForm'); if(!p) return;
  if(!p.hasAttribute('hidden')){          /* 이미 열려 있으면 스크롤만 */
    if(scroll) scrollToPanel(p);
    return;
  }
  p.removeAttribute('hidden');
  if(reducedMotion()){
    p.classList.add('reveal-settled');
    if(scroll) scrollToPanel(p,0);
    return;
  }
  var h=p.offsetHeight;                   /* 다 펼쳤을 때의 높이 */
  p.classList.add('reveal-in');
  p.style.height='0px';
  p.style.opacity='0';
  p.style.transform='translateY(12px)';
  void p.offsetWidth;                     /* 0 높이를 먼저 그려 두고 */
  /* 입력창을 펼치기 전에는 문서가 짧아 목표 위치까지 스크롤할 수 없다.
     잠시 같은 높이의 아래 여백을 두어 목표를 확보한 뒤, 다 펼치면 걷어낸다. */
  var padBase=document.body.style.paddingBottom;
  if(scroll){ document.body.style.paddingBottom=h+'px'; scrollToPanel(p,SCROLL_MS); }
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      p.style.height=h+'px';
      p.style.opacity='1';
      p.style.transform='translateY(0)';
    });
  });
  setTimeout(function(){
    p.style.height=''; p.style.opacity=''; p.style.transform='';
    p.classList.remove('reveal-in');
    p.classList.add('reveal-settled');
    if(scroll){
      document.body.style.paddingBottom=padBase;
      var t=p.getBoundingClientRect().top;   /* 상단 바 바로 아래(124px)에 와 있어야 한다 */
      if(t>150||t<90) scrollToPanel(p,700);  /* 어긋났으면 한 번 더 천천히 */
    }
  },REVEAL_MS+120);
}
function syncIntro(){
  var card=$('#introCard'), vid=$('#introVideo'), panel=$('#panelForm');
  if(!card||!vid||!panel) return;
  var src=introSrc();
  if(!src){
    card.hidden=true;
    try{ vid.pause(); }catch(e){}
    if(panel.hasAttribute('hidden')){ panel.removeAttribute('hidden'); panel.classList.add('reveal-settled'); }
    return;
  }
  card.hidden=false;
  if(vid.getAttribute('data-src')!==src){
    vid.setAttribute('data-src',src);
    vid.setAttribute('src',src);
    try{ vid.load(); }catch(e){}
  }
  if(state.introDone[state.tab]){         /* 한 번 연 탭은 입력창을 계속 열어 둔다 */
    if(panel.hasAttribute('hidden')){ panel.removeAttribute('hidden'); panel.classList.add('reveal-settled'); }
    return;
  }
  panel.setAttribute('hidden','');
  try{ vid.currentTime=0; }catch(e){}
  var pr=vid.play(); if(pr&&pr.catch) pr.catch(function(){ /* 자동재생 차단 시 첫 프레임 유지, CTA로 진행 가능 */ });
}
function bindIntro(){
  var vid=$('#introVideo');
  if(!vid) return;
  vid.addEventListener('ended',function(){
    if(!introSrc()) return;
    state.introDone[state.tab]=true;
    revealForm(true);
  });
  vid.addEventListener('click',function(){
    try{ if(vid.paused) vid.play(); else vid.pause(); }catch(e){}
  });
  var cta=$('#introCta');
  if(cta) cta.addEventListener('click',function(){
    state.introDone[state.tab]=true;
    try{ vid.pause(); }catch(e){}
    revealForm(true);
  });
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
  var f=state.fields||fieldsFor(state.theme,state.tab);
  if(f.ctx&&state.ctx){
    var py=parseInt($('#py').value,10),pm=parseInt($('#pm').value,10),pd=parseInt($('#pd').value,10);
    if(py&&pm&&pd){
      var preg=regionOf($('#pregion').value), pNo=$('#pnotime').checked, pHv=$('#phour').value;
      var pgEl=$('#pGenderChips .chip.on');
      c.partner={y:py,m:pm,d:pd,hasTime:!pNo&&pHv!=='',hourIndex:(!pNo&&pHv!=='')?parseInt(pHv,10):0,
        gender:pgEl?pgEl.getAttribute('data-pg'):(state.pg||'m'),tsoff:(!pNo&&pHv!=='')?preg.off:0,regionName:preg.name};
    } else if(py||pm||pd){
      c.partnerErr=(f.ctx==='child'?'아이 생년월일을 모두 골라주세요':'상대방 생년월일을 모두 골라주세요');
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
    if(ix==null){ h+='<div class="pillar"><div class="pl">시주</div><div class="pg">시간 미상</div><div class="pc" style="color:#6b6255">—</div><div class="pk">시간 모름</div><div class="pc" style="color:#6b6255">—</div><div class="pk">&nbsp;</div><div class="pe">미상</div></div>'; continue; }
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
  h+='<div class="rh-t">'+esc(T.name)+'</div>';
  h+='<h2>'+esc(name)+' 님의 '+S.STEM_KO[R.dStem]+S.BR_KO[R.dBranch]+'일주</h2>';
  h+='<div class="rh-s">'+S.ILJU[R.dIdx][0]+' — '+S.ILJU[R.dIdx][2]+'</div>';
  h+='<div class="pillars">'+pillarCells(R)+'</div>';
  var meta=S.STEM_KO[R.dStem]+'('+S.STEM_HAN[R.dStem]+') 일간 · '+(R.strength==='강'?'신강':(R.strength==='약'?'신약':'중화'))+' · 용신 '+S.EL_KO[c.yongEl]+'('+S.EL_HAN[c.yongEl]+') · 대운 '+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세';
  h+='<div class="rh-meta">'+meta+'<br>'+R.y+'년 '+R.m+'월 '+R.d+'일 '+(input.cal==='lunar'?'음력':'양력')+' · '+(R.hasTime?solarNote(R,input):'시간 모름(시주 제외)')+'</div>';
  h+='</div>';

  h+='<div class="res-sum fade-in"><p><b>'+esc(name)+'</b> 님의 여덟 글자는 '+S.STEM_KO[R.dStem]+S.BR_KO[R.dBranch]+'일주, 일간 '+S.STEM_KO[R.dStem]+'('+S.STEM_HAN[R.dStem]+')입니다. 오행은 <b>'+S.EL_KO[c.mostI]+'</b>'+S.josaP(S.EL_KO[c.mostI],'이가')+' 가장 두텁고 <b>'+S.EL_KO[c.leastI]+'</b>'+S.josaP(S.EL_KO[c.leastI],'이가')+' 가장 얇으며, 필요한 기운은 <b>'+S.EL_KO[c.yongEl]+'('+S.EL_HAN[c.yongEl]+')</b>입니다.</p>';
  h+='<p>'+S.DAY_MASTER[R.dStem][0]+'의 결로 태어나 '+S.GROUP_MEAN[c.topGrp]+' 이 사주의 중심 별은 <b>'+c.topGodInGrp+'</b>입니다. '+S.GOD_KEY[c.topGodInGrp]+'의 방식으로 살 때 가장 편안해집니다.</p>';
  if(input.ctx&&input.ctx.partnerErr) h+='<p style="color:#c94228">'+esc(input.ctx.partnerErr)+' — 내 사주만 읽었습니다.</p>';
  h+='</div>';

  /* ---------- v45 : 장 목차 탭 · 1~2장 무료 · 3장부터 첫 문장 + 핵심 가림 ---------- */
  var FREE=FREE_CH, bodies=[], i, total=chapters.length, lockedTotal=0;
  for(i=0;i<total;i++){
    var body='';
    try{ body=chapters[i].body(R,c,input,name); }
    catch(ex){ body='<p class="hint">이 장은 준비 중입니다.</p>'; if(window.console) console.error(chapters[i].title,ex); }
    bodies.push(body);
  }
  window.__chBodies=bodies;
  lockedTotal=Math.max(0,total-FREE);
  h+=chapterTabs(chapters,FREE);
  if(FREE>0) h+='<div class="free-flag"><b>무료로 읽는 '+Math.min(FREE,total)+'장</b> · 사주 원국과 첫 풀이</div>';
  for(i=0;i<Math.min(FREE,total);i++) h+=chapterSection(chapters,i,bodies[i],false,total);
  if(lockedTotal>0){
    window.__pwInfo={total:total,tab:T.name};
    h+='<div class="lock-note" id="lockNote">'+ICON_LOCK+'<span><b>남은 '+lockedTotal+'장</b>은 결제 후에 열립니다 · 지금은 장마다 첫 문장과 결론만 가려 두었습니다</span></div>';
    for(i=FREE;i<total;i++) h+=chapterSection(chapters,i,bodies[i],true,total);
  }
  h+='<div class="panel" id="rdMore" style="margin-top:18px;text-align:center">'+
     '<h3 style="font-size:17px">'+(lockedTotal?'평생의 흐름까지 이어서 보시겠어요':'여기까지가 '+esc(T.name)+'의 결입니다')+'</h3>'+
     '<p class="ph" style="margin-bottom:6px">테마별 풀이는 <b>9,900원</b> · 인생사주 리포트는 <s style="color:#8A93A4">119,000원</s> <b>39,800원</b>(67% 할인)입니다.</p>'+
     '<p class="ph" style="margin-bottom:14px">같은 주제를 평생의 큰 흐름과 앞으로 10년·노후까지 풀어내면 <b>인생사주 리포트</b>로 이어서 보실 수 있습니다.</p>'+
     '<button type="button" class="btn btn-gold btn-block" data-goto-pdf>📜 인생사주 리포트 받아보기</button></div>';
  /* 이름을 비워 두면 '당신'으로 부르는데, '당신 님'처럼 겹치지 않게 ' 님'을 덜어낸다 (굵게 감싼 경우 포함) */
  h=h.replace(/(<b[^>]*>)?당신(<\/b>)?\s*님/g,function(m,a,b){ return (a||'')+'당신'+(b||''); });
  if(S.fixPost) h=S.fixPost(h);
  $('#resultView').innerHTML=h;
  bindChapterUI(total);
  $$('[data-goto-pdf]').forEach(function(b){ b.addEventListener('click',function(){ setTrack('life'); }); });
  try{ var rv=$('#resultView'); var y=rv.getBoundingClientRect().top+window.pageYOffset-146; window.scrollTo({top:y,behavior:'smooth'}); }catch(e){}
}
/* ---------- v45 : 장 탭 · 첫 문장 미리보기 · 핵심 가림 결제 게이트 ---------- */
var FREE_CH=2;
var ICON_LOCK='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6.5A2.5 2.5 0 0 0 4 12.5v7A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 17.5 10H17V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"/></svg>';

function shortTitle(t){
  var s=String(t||'').split('—')[0].replace(/\s+/g,' ').trim();
  if(s.length>11) s=s.slice(0,11);
  return s;
}
/* 결과 상단 : 장 목차 탭 (3장부터 자물쇠) */
function chapterTabs(chapters,free){
  var h='<div class="ch-tabs" id="chTabs" role="tablist" aria-label="장 바로가기">';
  for(var i=0;i<chapters.length;i++){
    var n=i+1, locked=i>=free;
    h+='<button type="button" class="ch-tab'+(n===1?' on':'')+(locked?' lk':'')+'" role="tab" data-chtab="'+n+'"'+
       ' aria-selected="'+(n===1?'true':'false')+'"><b>'+n+'</b><span>'+esc(shortTitle(chapters[i].title))+'</span>'+
       (locked?ICON_LOCK:'')+'</button>';
  }
  return h+'</div>';
}
function chapterSection(chapters,i,body,locked,total){
  var ch=chapters[i], n=i+1;
  var h='<section class="ch fade-in'+(locked?' ch-off':'')+'" id="ch'+n+'" data-ch="'+i+'"'+(locked?' data-lock="1"':'')+'>';
  h+='<div class="ch-hd"><span class="ch-no">'+pad2(n)+'</span>'+
     '<div class="ch-t"><h3>'+ch.title+'</h3><div class="ch-s">'+ch.sub+'</div></div>'+
     (locked?'<span class="ch-lk" aria-label="결제 후 공개">'+ICON_LOCK+'</span>':'')+'</div>';
  if(locked) h+='<div class="ch-bd ch-teaser">'+teaserHTML(body)+'</div>'+gateHTML(i===FREE_CH);
  else h+='<div class="ch-bd">'+body+'</div>';
  return h+chapterNav(chapters,n,total)+'</section>';
}
function chapterNav(chapters,n,total){
  var h='<div class="ch-nav">';
  if(n>1) h+='<button type="button" class="chnav" data-goto="'+(n-1)+'"><i>←</i><span>'+(n-1)+'. '+esc(shortTitle(chapters[n-2].title))+'</span></button>';
  else h+='<span class="chnav-void"></span>';
  if(n<total) h+='<button type="button" class="chnav" data-goto="'+(n+1)+'"><span>'+(n+1)+'. '+esc(shortTitle(chapters[n].title))+'</span><i>→</i></button>';
  return h+'</div>';
}
function gateHTML(lead){
  var hk=PW_HOOK[state.theme]||PW_HOOK.general;
  if(lead){
    return '<div class="ch-gate lead">'+
      '<p class="gate-hook">'+hk.t+'</p>'+
      '<p class="gate-kicker">전체 풀이를 열면 정확한 시기와 구체적 이유, 피해야 할 함정까지 모두 확인됩니다.</p>'+
      '<div class="gate-price">9,900원 · 전체 풀이</div>'+
      '<button type="button" class="btn btn-gold btn-block gate-btn" data-pw-open>결제 후 전체 보기</button>'+
      '<p class="gate-note">테스트 사이트 — 결제 없이 전체 풀이가 열립니다</p></div>';
  }
  return '<div class="ch-gate mini">'+
    '<div class="gm-tx"><b>이 장의 결론과 시기</b><span>9,900원 · 전체 풀이</span></div>'+
    '<button type="button" class="btn-gate" data-pw-open>결제 후 전체 보기</button></div>';
}
/* ---------- 첫 문장만 보여주고, 결론이 되는 대목은 가린다 ---------- */
function teaserText(html){
  var box=document.createElement('div'); box.innerHTML=html||'';
  var nodes=box.querySelectorAll('p,li'), out='';
  for(var i=0;i<nodes.length;i++){
    var el=nodes[i];
    if(el.closest('table')) continue;
    var t=(el.textContent||'').replace(/\s+/g,' ').trim();
    if(t.length<12) continue;
    out+=(out?' ':'')+t;
    if(out.length>=95) break;
  }
  if(!out) out=(box.textContent||'').replace(/\s+/g,' ').trim();
  var sents=out.match(/[^.?!。]*[.?!。]+/g)||[], keep='';
  for(var j=0;j<sents.length&&j<3;j++){
    if(keep&&keep.length+sents[j].length>150) break;
    keep+=sents[j];
    if(keep.length>=60) break;
  }
  keep=(keep||out).replace(/\s+/g,' ').trim();
  if(keep.length>165){ keep=keep.slice(0,165).replace(/\s+\S*$/,'')+'…'; }
  return keep;
}
/* 가릴 것은 시기와 결론이다. 주제어(부동산·계약)는 문장이 깨져 보이므로 가리지 않는다 */
var MASK_RE=/(\d{1,2}개월|\d{4}년|\d{1,2}월|\d{1,2}일|\d{1,2}세|\d{1,2}살|\d+년|\d+번째|상반기|하반기|연말|연초|봄|여름|가을|겨울)/g;
function barHTML(len){
  var w=Math.min(5.4,Math.max(1.7,len*0.62+0.7));
  return '<span class="redact" style="width:'+w.toFixed(2)+'em" aria-label="결제 후 공개"></span>';
}
function maskTail(s){
  var marks=[', ','— ','· ','고 ','며 ','지만 ','는데 ','면서 ','이 ','가 ','을 ','를 ','은 ','는 ','도 ','면 ','로 ','서 '];
  var best=-1, bestLen=0;
  for(var i=0;i<marks.length;i++){
    var p=s.lastIndexOf(marks[i]);
    if(p<=s.length*0.2) continue;
    var st=p+marks[i].length, tl=s.slice(st).replace(/[.!?。\s]+$/,'');
    if(tl.length<4||tl.length>16) continue;
    if(tl.length>bestLen){ bestLen=tl.length; best=st; }
  }
  var sp=s.lastIndexOf(' ');
  if(best<0&&sp>0){
    var t2=s.slice(sp+1).replace(/[.!?。\s]+$/,'');
    if(t2.length>=3){ best=sp+1; bestLen=t2.length; }
  }
  if(best<0) return null;
  return {head:s.slice(0,best),tail:s.slice(best).replace(/[.!?。\s]+$/,'')};
}
function teaserHTML(body){
  var text=teaserText(body);
  if(!text) return '';
  var sents=(text.match(/[^.?!。]*[.?!。]+/g)||[text]).map(function(x){ return x.trim(); });
  var last=sents.length?sents.pop():'';
  var head=sents.join(' ');
  var out='', lastIdx=0, m, nBar=0;
  MASK_RE.lastIndex=0;
  while((m=MASK_RE.exec(head))!==null){
    if(nBar>=3) break;
    out+=esc(head.slice(lastIdx,m.index))+barHTML(m[0].length);
    lastIdx=m.index+m[0].length; nBar++;
  }
  out+=esc(head.slice(lastIdx));
  if(last){
    var mk=maskTail(last);
    if(mk) out+=(out?' ':'')+esc(mk.head)+barHTML(mk.tail.length)+'.';
    else out+=(out?' ':'')+esc(last);
  }
  return '<p class="teaser-p">'+out+'</p>';
}
/* ---------- 장 이동 · 스크롤 위치에 따라 탭 강조 ---------- */
function chapterOffset(){
  var hd=$('.hd'), tr=$('.tracks'), tabs=$('#chTabs');
  return ((hd&&hd.offsetHeight)||60)+((tr&&tr.offsetHeight)||0)+((tabs&&tabs.offsetHeight)||0)+8;
}
function centerTab(n){
  var wrap=$('#chTabs'), tab=wrap&&wrap.querySelector('[data-chtab="'+n+'"]');
  if(!wrap||!tab) return;
  var t=tab.offsetLeft-(wrap.clientWidth-tab.offsetWidth)/2;
  try{ wrap.scrollTo({left:Math.max(0,t),behavior:'smooth'}); }catch(e){ wrap.scrollLeft=Math.max(0,t); }
}
function setActiveTab(n){
  var tabs=$$('#chTabs .ch-tab'), changed=false;
  for(var i=0;i<tabs.length;i++){
    var on=parseInt(tabs[i].getAttribute('data-chtab'),10)===n;
    if(on!==tabs[i].classList.contains('on')) changed=true;
    tabs[i].classList.toggle('on',on);
    tabs[i].setAttribute('aria-selected',on?'true':'false');
  }
  if(changed) centerTab(n);
}
function goChapter(n,smooth){
  var el=document.getElementById('ch'+n); if(!el) return;
  var y=el.getBoundingClientRect().top+window.pageYOffset-chapterOffset();
  if(y<0) y=0;
  try{ window.scrollTo({top:y,behavior:(smooth===false?'auto':'smooth')}); }
  catch(e){ window.scrollTo(0,y); }
  setActiveTab(n);
}
function updateChapterTab(){
  var secs=$$('#resultView .ch'); if(!secs.length) return;
  var line=chapterOffset()+16, cur=1;
  for(var i=0;i<secs.length;i++){ if(secs[i].getBoundingClientRect().top<=line) cur=i+1; }
  setActiveTab(cur);
}
var __chSpyOn=false;
function bindChapterUI(total){
  var rv=$('#resultView'); if(!rv) return;
  if(!__chSpyOn){
    window.addEventListener('scroll',function(){
      if(window.__chSpyTick) return;
      window.__chSpyTick=1;
      (window.requestAnimationFrame||function(f){ return setTimeout(f,50); })(function(){ window.__chSpyTick=0; updateChapterTab(); });
    },{passive:true});
    __chSpyOn=true;
  }
  rv.addEventListener('click',function(e){
    var tab=e.target.closest('[data-chtab]');
    if(tab){ goChapter(parseInt(tab.getAttribute('data-chtab'),10)); return; }
    var nav=e.target.closest('[data-goto]');
    if(nav){ goChapter(parseInt(nav.getAttribute('data-goto'),10)); return; }
    if(e.target.closest('[data-pw-open]')) openPayGate();
  });
  var tabs=$('#chTabs'), hd=$('.hd'), tr=$('.tracks');
  if(tabs&&hd) tabs.style.top=((hd.offsetHeight||60)+((tr&&tr.offsetHeight)||0))+'px';
  updateChapterTab();
}
/* ---------- 테스트 결제 확인 창 ---------- */
function payCardMarkup(){
  var info=window.__pwInfo||{total:0,tab:''};
  var rest=info.total>FREE_CH?info.total-FREE_CH:6;
  return '<div class="pw-price">9,900원 · 전체 풀이</div>'+
    '<h3>결제 없이 열어볼까요?</h3>'+
    '<p>지금은 PG 연동 전 테스트 사이트입니다. <b>실제 결제는 이루어지지 않습니다.</b><br>확인을 누르면 남은 '+rest+'장이 바로 열립니다.</p>'+
    '<button type="button" class="btn btn-gold btn-block" id="pwDo">테스트로 전체 풀이 열기</button>'+
    '<button type="button" class="pw-x" id="pwCancel">취소</button>';
}
function openPayGate(){
  var el=$('#payGate');
  if(!el){
    el=document.createElement('div');
    el.id='payGate'; el.className='paygate';
    el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-label','전체 풀이 열기');
    el.innerHTML='<div class="pw-card pay-card">'+payCardMarkup()+'</div>';
    el.addEventListener('click',function(e){
      if(e.target===el){ closePayGate(); return; }
      var t=e.target.closest('button'); if(!t) return;
      if(t.id==='pwDo'){ closePayGate(); unlockReading(); }
      else if(t.id==='pwCancel'){ closePayGate(); }
    });
    document.body.appendChild(el);
  }
  el.classList.add('on'); document.body.classList.add('lock');
  var b=$('#pwDo',el); if(b&&b.focus){ try{ b.focus(); }catch(e){} }
}
function closePayGate(){
  var el=$('#payGate'); if(el) el.classList.remove('on');
  document.body.classList.remove('lock');
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closePayGate(); });
/* 테마별 페이월 문구 — 무엇이 남아 있는지 궁금하게 만드는 한 줄 */
var PW_HOOK={
  general:{t:'올해 터지는 달과<br>피해야 할 달이 남아 있습니다',
           p:'지금까지는 타고난 결이었고,<br>남은 장에는 <b>언제</b> 그 일이 오는지가 있습니다.'},
  love:{t:'재회가 열리는 시기와<br>끌리는 사람의 결이 남아 있습니다',
        p:'그 사람이 마음을 여는 달,<br>연락이 끊기는 달까지 짚어드립니다.'},
  marriage:{t:'결혼이 열리는 해와<br>흔들리는 해가 남아 있습니다',
            p:'배우자의 결, 시댁·처가와의 자리,<br>결정을 미뤄야 하는 달까지 있습니다.'},
  baby:{t:'아이와의 인연이 열리는 시기가<br>남아 있습니다',
        p:'임신·출산에 유리한 달,<br>몸을 먼저 돌봐야 하는 달까지 짚어드립니다.'},
  wealth:{t:'돈이 모이는 시기와<br>새는 구멍이 남아 있습니다',
          p:'문서·부동산 취득 타이밍,<br>계약을 피해야 할 달까지 있습니다.'}
};
/* ---------------- 테마 결제 → 인생사주 리포트 업셀 ---------------- */
function themeCredit(){
  try{ return localStorage.getItem('wlh_theme_paid')==='1'; }catch(e){ return false; }
}
function setThemeCredit(v){
  try{ if(v) localStorage.setItem('wlh_theme_paid','1'); else localStorage.removeItem('wlh_theme_paid'); }catch(e){}
}
function upsellMarkup(){
  return '<p class="up-tag">테마 결제 9,900원 차감 적용</p>'+
    '<p class="tt">여기서 멈추면<br>내 인생의 큰 흐름은 못 봅니다</p>'+
    '<p class="pp">타고난 기질부터 평생 대운·앞으로 10년·문서와 부동산까지 한 권에 담았습니다.<br>정가 <b>119,000원</b>인 리포트를 지금 <b>39,800원</b>에, 방금 결제한 <b>9,900원</b>을 빼면 이 가격입니다.</p>'+
    '<div class="up-price"><s>119,000원</s><b>29,900원</b><em>75% 할인</em></div>'+
    '<div class="up-list"><span>평생 대운 9구간</span><span>앞으로 10년</span><span>문서·부동산</span><span>맞춤 질문 답변</span></div>'+
    '<button type="button" class="btn btn-gold btn-block" data-theme-upgrade>+29,900원으로 인생사주 리포트 받기</button>'+
    '<p class="small">방금 입력한 사주 정보 그대로 이어집니다</p>';
}
function addUpsellCard(host){
  if(!host||document.getElementById('rdUpsell')) return;
  var up=document.createElement('div');
  up.className='upsell fade-in'; up.id='rdUpsell';
  up.innerHTML=upsellMarkup();
  up.addEventListener('click',function(e){
    if(e.target.closest('[data-theme-upgrade]')) themeUpgradeToLife();
  });
  host.appendChild(up);
}
/* 테마 결제 정보를 인생사주 리포트 신청서로 옮기고, 29,900원 차감가로 넘긴다 */
function themeUpgradeToLife(){
  var inp=state.input;
  setThemeCredit(true);
  if(inp){
    if($('#lz-y')) $('#lz-y').value=inp.y;
    if($('#lz-m')) $('#lz-m').value=inp.m;
    if($('#lz-d')) $('#lz-d').value=inp.d;
    if($('#lz-name')&&!$('#lz-name').value&&inp.name&&inp.name!=='당신') $('#lz-name').value=inp.name;
    if($('#lz-hour')) $('#lz-hour').value=inp.hasTime?String(inp.hourIndex):'';
    if($('#lz-notime')) $('#lz-notime').checked=!inp.hasTime;
    if($('#lz-region')&&inp.regionKey){
      var ok=false;
      for(var i=0;i<$('#lz-region').options.length;i++){ if($('#lz-region').options[i].value===inp.regionKey) ok=true; }
      if(ok) $('#lz-region').value=inp.regionKey;
    }
    var gc=$('#lzGender .chip[data-g="'+(inp.gender||'f')+'"]');
    if(gc){ $$('#lzGender .chip').forEach(function(c){ c.classList.remove('on'); }); gc.classList.add('on'); }
    var cal=(inp.cal==='lunar')?'lunar':'solar';
    var cc=$('#lzCal .chip[data-cal="'+cal+'"]');
    if(cc){ $$('#lzCal .chip').forEach(function(c){ c.classList.remove('on'); }); cc.classList.add('on'); state.pcal=cal; }
    if(inp.ctx){
      [['#lzMarry','data-m',inp.ctx.marry],['#lzChild','data-c',inp.ctx.kid],['#lzStage','data-s',inp.ctx.stage]].forEach(function(x){
        if(!x[2]) return;
        var el=$(x[0]+' .chip['+x[1]+'="'+x[2]+'"]');
        if(el){ $$(x[0]+' .chip').forEach(function(c){ c.classList.remove('on'); }); el.classList.add('on'); }
      });
    }
  }
  setTrack('life');
  openFastConfirm();
}

/* 테마 결제 후 업셀 : 4단계 신청서를 건너뛰고 이메일만 확인해 29,900원 결제(#pdfPay)로 직행 */
var fastPay=false;
function savedEmail(){ try{ return localStorage.getItem('wlh_email_v1')||''; }catch(e){ return ''; } }
function savedPhone(){ try{ return localStorage.getItem('wlh_phone_v1')||''; }catch(e){ return ''; } }
function saveContact(email,phone){
  try{ if(email) localStorage.setItem('wlh_email_v1',email); if(phone) localStorage.setItem('wlh_phone_v1',phone); }catch(e){}
}
function fastSummaryHTML(){
  var b=readPdfBase();
  if(b.err) return '<span class="fs-warn">'+b.err+'</span>';
  var marryMap={single:'미혼',dating:'연애 중',married:'기혼',etc:'말하지 않음'};
  var kidMap={none:'자녀 없음',plan:'자녀 계획 중',have:'자녀 있음'};
  var stageMap={'':'상황 미선택',student:'학생',job:'취업 준비',work:'직장 생활',own:'사업·프리랜서',home:'가정·육아',rest:'쉬는 중'};
  var q=($('#lz-q')&&$('#lz-q').value||'').trim();
  var chips=[];
  var st=chipLabel('#lzStage','data-s',stageMap); if(st&&st!=='상황 미선택') chips.push(st);
  chips.push(chipLabel('#lzMarry','data-m',marryMap));
  chips.push(chipLabel('#lzChild','data-c',kidMap));
  return '<div class="fs-line"><b>'+esc(b.name)+'</b> · '+b.y+'.'+pad2(b.m)+'.'+pad2(b.d)+' '+(b.hasTime?hourLabel(b.hourIndex):'시간 모름')+'</div>'+
    '<div class="fs-line">'+(b.gender==='f'?'여성':'남성')+' · '+esc(b.regionName)+'</div>'+
    '<div class="fs-chips">'+chips.map(function(c){ return '<span>'+c+'</span>'; }).join('')+'</div>'+
    (q?'<div class="fs-q">질문 — '+esc(q)+'</div>':'');
}
function openFastConfirm(){
  var box=$('#lzFast');
  if(!box) return;
  fastPay=true;
  try{ $('#pdfSteps').style.display='none'; }catch(e){}
  var f=$('#pdfForm'); if(f) f.style.display='none';
  var done=$('#pdfDone'); if(done){ done.classList.remove('on'); done.innerHTML=''; }
  var sum=$('#lzFastSum'); if(sum) sum.innerHTML=fastSummaryHTML();
  var err=$('#lz-fast-err'); if(err){ err.hidden=true; err.textContent=''; }
  var em=$('#lz-fast-email'); if(em) em.value=(state.email||savedEmail()||'');
  box.classList.add('on');
  var go=$('#lzFastGo'), edit=$('#lzFastEdit');
  if(go&&!go.__b){ go.__b=1; go.addEventListener('click',fastSubmit); }
  if(edit&&!edit.__b){ edit.__b=1; edit.addEventListener('click',backToWizard); }
  if(em&&!em.__b){ em.__b=1; em.addEventListener('input',function(){ state.email=em.value.trim(); }); }
  setTimeout(function(){
    try{ var y=box.getBoundingClientRect().top+window.pageYOffset-140; window.scrollTo({top:y<0?0:y,behavior:'smooth'}); }catch(e){}
  },120);
}
function backToWizard(){
  fastPay=false;
  var box=$('#lzFast'); if(box) box.classList.remove('on');
  var f=$('#pdfForm'); if(f) f.style.display='';
  var st=$('#pdfSteps'); if(st) st.style.display='';
  var em=$('#lz-fast-email'); if(em&&em.value.trim()) state.email=em.value.trim();
  if($('#lz-email')&&!$('#lz-email').value&&state.email) $('#lz-email').value=state.email;
  gotoPdf(1);
  try{ $('#pdfForm').scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){}
}
function fastSubmit(){
  var err=$('#lz-fast-err');
  function fail(m){ if(err){ err.textContent=m; err.hidden=false; } }
  if(err){ err.hidden=true; err.textContent=''; }
  var b=readPdfBase();
  if(b.err){ fail(b.err); return; }
  var ag=$('#lz-fast-agree');
  if(ag&&!ag.checked){ fail('동의에 체크해 주세요'); return; }
  var em=$('#lz-fast-email');
  var email=(em?em.value:'').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){ fail('이메일 주소를 확인해 주세요'); return; }
  state.email=email; saveContact(email,'');
  showPayStep(makeOrder(b,email,savedPhone(),'fast'));
}

/* v45 : 가려 둔 장을 실제 본문으로 바꾸고 잠금 표시를 걷어낸다 */
function unlockReading(){
  var fulls=window.__chBodies||[];
  var lockSecs=$$('#resultView .ch[data-lock="1"]');
  var first=null;
  for(var i=0;i<lockSecs.length;i++){
    var sec=lockSecs[i], idx=parseInt(sec.getAttribute('data-ch'),10);
    if(!first) first=sec;
    var teaser=sec.querySelector('.ch-teaser');
    if(teaser){
      var bd=document.createElement('div');
      bd.className='ch-bd';
      bd.innerHTML=fulls[idx]||'<p class="hint">이 장은 준비 중입니다.</p>';
      teaser.parentNode.replaceChild(bd,teaser);
    }
    var gate=sec.querySelector('.ch-gate'); if(gate) gate.parentNode.removeChild(gate);
    var lk=sec.querySelector('.ch-lk'); if(lk) lk.parentNode.removeChild(lk);
    sec.removeAttribute('data-lock');
    sec.classList.remove('ch-off');
  }
  $$('#resultView .ch-tab.lk').forEach(function(b){
    b.classList.remove('lk');
    var s=b.querySelector('svg'); if(s) s.parentNode.removeChild(s);
  });
  var note=$('#lockNote'); if(note) note.parentNode.removeChild(note);
  if(first&&!$('.pw-open-flag')){
    var flag=document.createElement('div');
    flag.className='pw-open-flag';
    flag.innerHTML='<b>전체 풀이가 열렸습니다</b> · 테스트 결제 9,900원';
    first.insertBefore(flag,first.firstChild);
  }
  var more=$('#rdMore'); if(more){ more.style.display='none'; }
  addUpsellCard($('#resultView'));
  if(first) goChapter(parseInt(first.id.replace('ch',''),10));
}

function solarNote(R,input){
  var nm=(input&&input.regionName)||'';
  if(nm==='출생지 모름') return '출생지 미상 — 보정 없이 계산했습니다';
  var a=R.solarAdj;
  if(!a) return nm?(nm+' 출생 — 보정 없이 계산했습니다'):'보정 없이 계산했습니다';
  if(a.off===0) return (a.region||nm||'현지')+' 출생 — 보정 없이 계산했습니다';
  return (a.region||nm)+' 출생 기준으로 시주를 보정했습니다';
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
function chipLabel(box,attr,map){
  var b=$(box+' .chip.on');
  if(!b) return '-';
  var k=b.getAttribute(attr);
  return map[k]||b.textContent.trim();
}
function buildPdfSummary(){
  var b=readPdfBase();
  if(b.err){ $('#lz-err4').textContent=b.err; $('#lz-err4').hidden=false; return false; }
  var q=($('#lz-q').value||'').trim();
  var marryMap={single:'미혼',dating:'연애 중',married:'기혼',etc:'말하고 싶지 않음'};
  var kidMap={none:'없음',plan:'계획 중',have:'있음'};
  var stageMap={'':'선택 안 함',student:'학생',job:'취업 준비',work:'직장 생활',own:'사업·프리랜서',home:'가정·육아',rest:'쉬는 중'};
  var h='<b>'+esc(b.name)+'</b> · '+b.y+'.'+pad2(b.m)+'.'+pad2(b.d)+' '+(b.hasTime?hourLabel(b.hourIndex):'시간 모름')+' · '+(b.gender==='f'?'여성':'남성')+' · '+b.regionName+
    '<br>현재 상황 '+chipLabel('#lzStage','data-s',stageMap)+' · 결혼 '+chipLabel('#lzMarry','data-m',marryMap)+' · 자녀 '+chipLabel('#lzChild','data-c',kidMap)+
    (q?'<br>질문 — '+esc(q):'<br>질문 — 없음(기본 구성)');
  $('#lz-summary').innerHTML=h;
  return true;
}
function makeOrder(b,email,phone,from){
  var marry=$('#lzMarry .chip.on'), kid=$('#lzChild .chip.on'), stage=$('#lzStage .chip.on');
  return {id:'CL'+Date.now().toString(36).toUpperCase().slice(-6),at:new Date().toISOString(),
    name:b.name,date:b.y+'-'+pad2(b.m)+'-'+pad2(b.d),hasTime:b.hasTime,hourIndex:b.hourIndex,
    gender:b.gender,tsoff:b.tsoff,regionName:b.regionName,regionKey:b.regionKey,cal:state.pcal,
    stage:stage?stage.getAttribute('data-s'):'',marry:marry?marry.getAttribute('data-m'):'single',
    kid:kid?kid.getAttribute('data-c'):'none',q:($('#lz-q').value||'').trim(),email:email,phone:phone||'',
    product:'천령당 인생사주 리포트',priceRegular:119000,price:themeCredit()?29900:39800,
    themePaid:themeCredit(),status:'결제대기',from:from||'form'};
}
function submitPdf(){
  var b=readPdfBase();
  if(b.err){ $('#lz-err4').textContent=b.err; $('#lz-err4').hidden=false; return; }
  if(!$('#lz-agree').checked){ $('#lz-err4').textContent='동의에 체크해 주세요'; $('#lz-err4').hidden=false; return; }
  var email=($('#lz-email').value||'').trim();
  var phone=($('#lz-phone').value||'').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){ gotoPdf(3); $('#lz-err3').textContent='이메일 주소를 확인해 주세요'; $('#lz-err3').hidden=false; return; }
  state.email=email; saveContact(email,phone);
  /* 정보 입력 → 결제 → 보기/다운로드. 접수 저장은 결제를 마친 뒤에 한다. */
  showPayStep(makeOrder(b,email,phone,'form'));
}

/* ---------------- 결제 단계 ---------------- */
var pendingOrder=null;
function won(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',')+'원'; }
function payRowsHTML(o){
  var h='';
  function row(k,v,cls){ return '<div class="pay-row'+(cls?' '+cls:'')+'"><span>'+k+'</span><b>'+v+'</b></div>'; }
  h+=row('신청자',esc(o.name)+' · '+(o.gender==='f'?'여성':'남성'));
  h+=row('생년월일',String(o.date).replace(/-/g,'.')+(o.hasTime?' '+hourLabel(o.hourIndex):' 시간 모름'));
  h+=row('받는 곳',esc(o.email||'-'));
  h+=row('상품','인생사주 리포트 · A4 책자형 PDF');
  var reg=o.priceRegular||119000, base=39800, price=o.price||base;
  if(o.themePaid){
    h+='<div class="pay-row"><span>정가</span><b><s style="color:#8A93A4">'+won(reg)+'</s></b></div>';
    h+='<div class="pay-row"><span>특가</span><b>'+won(base)+' <em style="font-style:normal;font-size:11px;font-weight:800;color:#0A1421;background:#E4B96A;border-radius:5px;padding:2px 6px">67% 할인</em></b></div>';
    h+=row('테마 결제 차감','-'+won(9900),'discount');
    h+='<div class="pay-row total"><span>결제 금액</span><b>'+won(price)+'<span class="sub">정가 '+won(reg)+' 대비 75% 할인 · 특가 '+won(base)+' - 테마 결제 차감 '+won(9900)+'</span></b></div>';
  } else {
    h+='<div class="pay-row"><span>정가</span><b><s style="color:#8A93A4">'+won(reg)+'</s> <em style="font-style:normal;font-size:11px;font-weight:800;color:#0A1421;background:#E4B96A;border-radius:5px;padding:2px 6px">67% 할인</em></b></div>';
    h+='<div class="pay-row total"><span>결제 금액</span><b>'+won(price)+'<span class="sub">정가 '+won(reg)+'에서 67% 할인</span></b></div>';
  }
  return h;
}
function showPayStep(o){
  pendingOrder=o;
  $$('.step-body').forEach(function(x){ x.classList.remove('on'); });
  try{ $('#pdfSteps').style.display='none'; }catch(e){}
  var fb=$('#lzFast'); if(fb) fb.classList.remove('on');
  var p=$('#pdfPay'); if(!p) return;
  p.classList.add('on');
  p.innerHTML='<div class="pay-box fade-in">'+
    '<div class="pay-tag">주문 확인</div>'+
    '<h3>천령당 인생사주 리포트</h3>'+
    '<p class="pay-sub">검수 후 이메일로 보내드리는 A4 책자형 PDF입니다.</p>'+
    '<div class="pay-rows">'+payRowsHTML(o)+'</div>'+
    '<p class="pay-test">테스트 모드 · 실제 결제는 청구되지 않습니다</p>'+
    '<button type="button" class="btn btn-verm btn-block" id="payGo">결제하기 (테스트)</button>'+
    '<button type="button" class="btn btn-line btn-block" id="payBack" style="margin-top:8px">이전으로</button>'+
    '<p class="pay-note">결제를 마치면 리포트를 바로 펼쳐보고 PDF로 저장하실 수 있습니다.</p>'+
    '</div>';
  var go=$('#payGo'), back=$('#payBack');
  if(go) go.addEventListener('click',function(){ completePayment(); });
  if(back) back.addEventListener('click',function(){
    p.classList.remove('on'); p.innerHTML='';
    var from=o.from||'form'; pendingOrder=null;
    if(from==='fast'){ openFastConfirm(); return; }
    fastPay=false;
    var f=$('#pdfForm'); if(f) f.style.display='';
    gotoPdf(4);
  });
  try{ var py=p.getBoundingClientRect().top+window.pageYOffset-130; window.scrollTo({top:py<0?0:py,behavior:'smooth'}); }catch(e){}
}
function completePayment(){
  var o=pendingOrder; if(!o) return;
  o.status='결제완료'; o.paidAt=new Date().toISOString();
  try{
    var list=JSON.parse(localStorage.getItem('cl_orders')||'[]');
    list.unshift(o); localStorage.setItem('cl_orders',JSON.stringify(list));
  }catch(e){}
  pendingOrder=null;
  showDone(o);
}
function showDone(order){
  var b={name:order.name};
  $$('.step-body').forEach(function(x){ x.classList.remove('on'); });
  try{ $('#pdfSteps').style.display='none'; }catch(e){}
  var p=$('#pdfPay'); if(p){ p.classList.remove('on'); p.innerHTML=''; }
  var d=$('#pdfDone');
  if(!d) return;
  d.classList.add('on');
  lastOrder=order;
  d.innerHTML='<div class="done-box fade-in"><div class="ok">✓</div><h3>결제 및 접수가 완료되었습니다</h3>'+
    '<div class="num">접수번호 '+order.id+' · 테스트 결제 '+won(order.price||39800)+'</div>'+
    '<p>'+esc(b.name)+' 님의 원국을 검수한 뒤, 영업일 2~3일 안에 책자형 PDF를 '+esc(order.email||'신청하신 이메일')+'으로 보내드립니다.</p>'+
    '<p>지금 바로 리포트를 펼쳐보고 PDF 파일로 저장하실 수 있습니다.</p>'+
    '<button type="button" class="btn btn-gold btn-block" style="margin-top:14px" data-cust-view>내 인생사주 리포트 보기</button>'+
    '<button type="button" class="btn btn-verm btn-block" style="margin-top:8px" data-cust-pdf>PDF 파일 다운로드</button>'+
    '<p class="pdf-note">PDF는 이 기기의 다운로드 폴더로 저장됩니다. 인앱 브라우저에서 저장이 안 될 경우 Safari/Chrome으로 열어주세요.</p>'+
    '<button type="button" class="btn btn-line btn-block" style="margin-top:10px" data-goto-top>처음으로</button></div>';
  $$('[data-cust-view]').forEach(function(x){ x.addEventListener('click',function(){ openCustomerReport(); }); });
  $$('[data-cust-pdf]').forEach(function(x){ x.addEventListener('click',function(){ openCustomerReport(function(){ downloadBookPdf(); }); }); });
  $$('[data-goto-top]').forEach(function(x){ x.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); }); });
  try{ d.scrollIntoView({behavior:'smooth',block:'center'}); }catch(e){}
}

/* ---------------- 관리자 · 고객 리포트 뷰어 ---------------- */
var ADMIN_OK=false, lastOrder=null, curBookName='';
function orders(){
  try{ return JSON.parse(localStorage.getItem('cl_orders')||'[]'); }catch(e){ return []; }
}
function sampleEntry(){
  return {id:'SAMPLE-01',name:'김서연',date:'1993-05-14',hasTime:true,hourIndex:4,gender:'f',
    tsoff:-32,regionName:'서울 · 인천 · 경기',cal:'solar',stage:'work',marry:'married',kid:'plan',
    q:'올해 안에 둘째를 준비해도 될까요? 시기와 몸의 리듬이 궁금합니다.',email:'sample@cheonryeongdang.kr',phone:'010-0000-0000',status:'샘플'};
}
function setSheetMode(mode){
  var sh=$('#adminSheet'); if(!sh) return;
  mode=(mode==='admin')?'admin':'cust';
  sh.setAttribute('data-mode',mode);
  var t=$('#sheetTitle');
  if(t) t.textContent=(mode==='admin')?'관리자 검수함':'천령당 · 내 인생사주 리포트';
  var lv=$('#admListView'); if(lv) lv.style.display=(mode==='admin')?'block':'none';
  var bk=$('#admBack'); if(bk) bk.style.display=(mode==='admin')?'':'none';
}
function openSheet(){
  var sh=$('#adminSheet'); if(!sh) return;
  sh.classList.add('on'); sh.setAttribute('aria-hidden','false');
  document.body.classList.add('lock');
}
function closeBookSheet(){
  var sh=$('#adminSheet'); if(!sh) return;
  sh.classList.remove('on'); sh.setAttribute('aria-hidden','true');
  document.body.classList.remove('lock');
}
function openAdmin(){
  if(!ADMIN_OK) return;
  setSheetMode('admin'); openSheet(); renderAdminList();
}

/* ---------------- 관리자 비밀번호 ---------------- */
var ADMIN_PW='0808', pendingAdmin='list';
function adminUnlocked(){
  try{ return sessionStorage.getItem('wlh_admin_ok')==='1'; }catch(e){ return ADMIN_OK; }
}
function askAdminPassword(after){
  pendingAdmin=after||'list';
  if(adminUnlocked()){ ADMIN_OK=true; unlockAdmin(); return; }
  var m=$('#pwModal'); if(!m){ return; }
  m.classList.add('on'); m.setAttribute('aria-hidden','false');
  document.body.classList.add('lock');
  var box=$('#pwBox'); if(box) box.classList.remove('shake');
  var err=$('#pwErr'); if(err) err.hidden=true;
  var inp=$('#pwInput'); if(inp) inp.value='';
  setTimeout(function(){ try{ if(inp) inp.focus(); }catch(e){} },120);
}
function closePwModal(){
  var m=$('#pwModal'); if(!m) return;
  m.classList.remove('on'); m.setAttribute('aria-hidden','true');
  var box=$('#pwBox'); if(box) box.classList.remove('shake');
  var sh=$('#adminSheet');
  if(!(sh&&sh.classList.contains('on'))) document.body.classList.remove('lock');
}
function unlockAdmin(){
  ADMIN_OK=true;
  try{ sessionStorage.setItem('wlh_admin_ok','1'); }catch(e){}
  closePwModal();
  openAdmin();
  if(pendingAdmin==='sample') openBook(sampleEntry(),'admin');
  pendingAdmin='list';
}
function onPwSubmit(e){
  if(e&&e.preventDefault) e.preventDefault();
  var inp=$('#pwInput');
  var v=inp?String(inp.value||'').replace(/\s+/g,''):'';
  if(v&&v===ADMIN_PW){ unlockAdmin(); return; }
  var err=$('#pwErr'); if(err) err.hidden=false;
  var box=$('#pwBox');
  if(box){ box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); }
  if(inp){ inp.value=''; try{ inp.focus(); }catch(e2){} }
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
      openBook(k==='sample'?sampleEntry():orders()[parseInt(k,10)],'admin');
    });
  });
}
function entryToInput(o){
  return {name:o.name,y:parseInt(String(o.date).slice(0,4),10),m:parseInt(String(o.date).slice(5,7),10),d:parseInt(String(o.date).slice(8,10),10),
    hasTime:!!o.hasTime,hourIndex:o.hourIndex||0,gender:o.gender||'f',tsoff:o.tsoff||0,regionName:o.regionName||'',
    theme:'general',tab:'life',ctx:{marry:o.marry||'single',kid:o.kid||'none',stage:o.stage||'',question:o.q||''}};
}
function bindToc(host){
  $$('.toc-r[data-goto]',host).forEach(function(row){
    var go=function(e){
      if(e&&e.preventDefault) e.preventDefault();
      var t=host.querySelector('#book-p'+row.getAttribute('data-goto'));
      if(!t) return;
      var sc=row.closest('.sheet')||null;
      if(sc&&sc.scrollHeight>sc.clientHeight+2){
        var hd=sc.querySelector('.sheet-hd');
        var off=(hd?hd.getBoundingClientRect().height:0)+8;
        var top=t.getBoundingClientRect().top-sc.getBoundingClientRect().top+sc.scrollTop-off;
        try{ sc.scrollTo({top:Math.max(0,top),behavior:'smooth'}); }catch(e2){ sc.scrollTop=Math.max(0,top); }
      } else {
        try{ t.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e2){ t.scrollIntoView(); }
      }
    };
    row.addEventListener('click',go);
    row.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ go(e); } });
  });
}
function openBook(o,mode,after){
  if(!o) return;
  mode=(mode==='admin'&&ADMIN_OK)?'admin':'cust';
  setSheetMode(mode);
  openSheet();
  var inp=entryToInput(o);
  var R;
  try{ R=S.computeSaju(inp); }catch(e){ alert('원국을 계산하지 못했습니다.'); return; }
  inp.ctx.R=R;
  curBookName=o.name||'고객';
  $('#admListView').style.display=(mode==='admin')?'block':'none';
  $('#admBookView').style.display='block';
  var host=$('#wl2-book');
  host.innerHTML='<p style="color:#c9bda6">책자를 조판하는 중입니다…</p>';
  var sh=$('#adminSheet'); sh.scrollTop=0;
  setTimeout(function(){
    try{
      var res=window.BOOK.build(R,inp,o.name);
      host.innerHTML=res.html;
      bindToc(host);
      if(window.BOOK&&window.BOOK.fit){
        window.BOOK.fit(host);
        if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){ window.BOOK.fit(host); });
        setTimeout(function(){ window.BOOK.fit(host); },900);
      }
      $('#admBookMeta').innerHTML='<b style="color:#ecd6a6">'+esc(o.name)+'</b> · '+o.date+' · '+(o.hasTime?hourLabel(o.hourIndex):'시간 모름')+' · '+
        'A4 '+res.pages+'장 · 원국 '+S.STEM_KO[R.dStem]+S.BR_KO[R.dBranch]+'일주';
      if(typeof after==='function') setTimeout(after,60);
    }catch(ex){
      host.innerHTML='<p style="color:#e79a72">책자를 만들지 못했습니다: '+esc(ex.message)+'</p>';
      if(window.console) console.error(ex);
    }
  },40);
}
function openCustomerReport(after){
  var o=lastOrder||orders()[0];
  if(!o){ alert('신청 내역을 찾지 못했습니다. 신청 완료 화면에서 다시 열어주세요.'); return; }
  openBook(o,'cust',after);
}

/* ---------------- PDF 파일 다운로드 ---------------- */
/* html2canvas 글자 처짐 보정 -------------------------------------------------
   html2canvas는 알약(배지)·표 칸처럼 상자 높이가 글줄보다 큰 곳에서 글자를 상자
   아래쪽에 붙여서 그린다(아이폰·안드로이드·PC 모두). 어긋나는 정도가 기기·글꼴마다
   달라서, PDF를 만들기 직전에 이 기기에서 한 번 재어 보고 그만큼 글자만 위로 올린다.
   화면(미리보기)의 DOM은 건드리지 않고, html2canvas가 복사한 지면에만 적용한다. */
var PDF_FX={pill:0,cell:0};
function fxTextRows(cv,box,scale){
  try{
    var x=Math.max(0,Math.round(box.x*scale)), y=Math.max(0,Math.round(box.y*scale));
    var w=Math.max(1,Math.round(box.w*scale)), h=Math.max(1,Math.round(box.h*scale));
    var ctx=cv.getContext('2d');
    if(!ctx) return null;
    var d=ctx.getImageData(x,y,w,h).data, top=-1, bot=-1;
    for(var j=0;j<h;j++){
      var dark=false;
      for(var i=0;i<w;i++){
        var p=(j*w+i)*4;
        if((d[p]+d[p+1]+d[p+2])/3<150){ dark=true; break; }
      }
      if(dark){ if(top<0) top=j; bot=j; }
    }
    if(top<0) return null;
    return {top:top, bot:h-1-bot};
  }catch(e){ return null; }
}
function fxShift(m,scale){
  if(!m) return 0;
  var s=(m.bot-m.top)/(2*scale);           /* 글자를 s(음수)만큼 올리면 위·아래 여백이 같아진다 */
  s=Math.round(s*10)/10;
  return Math.max(-24,Math.min(0,s));
}
function calibratePdfText(scale){
  return new Promise(function(res){
    var host=$('#wl2-book');
    if(!host||!window.html2canvas||!host.querySelector('.pg')){ res(PDF_FX); return; }
    var probe=document.createElement('div');
    probe.className='pg';
    probe.style.cssText='position:absolute;left:-4000px;top:0;width:210mm;height:295mm;z-index:-1;';
    probe.innerHTML='<div class="pg-bd">'+
      '<div style="margin:4mm 0 6mm"><span class="tag">가나다</span><span class="tag navy">라마바</span></div>'+
      '<table style="width:90mm;margin:0"><tr><td style="height:13mm">가나다라</td><td style="height:13mm">마바사</td></tr></table>'+
      '</div>';
    host.appendChild(probe);
    function done(){ try{ if(probe.parentNode) probe.parentNode.removeChild(probe); }catch(e){} res(PDF_FX); }
    fontsReady(1200).then(function(){
      var pr, pillBox, cellBox;
      try{
        pr=probe.getBoundingClientRect();
        var tag=probe.querySelector('.tag'), cell=probe.querySelector('td');
        if(!tag||!cell){ done(); return; }
        var tr=tag.getBoundingClientRect(), cr=cell.getBoundingClientRect();
        pillBox={x:tr.x-pr.x,y:tr.y-pr.y,w:tr.width,h:tr.height};
        cellBox={x:cr.x-pr.x,y:cr.y-pr.y,w:cr.width,h:cr.height};
      }catch(e){ done(); return; }
      window.html2canvas(probe,{scale:scale,backgroundColor:'#F6F1E7',useCORS:true,allowTaint:false,
        logging:false,removeContainer:true,imageTimeout:3500}).then(function(cv){
        var a=fxShift(fxTextRows(cv,pillBox,scale),scale);
        var b=fxShift(fxTextRows(cv,cellBox,scale),scale);
        if(a) PDF_FX.pill=a;
        if(b) PDF_FX.cell=b;
        done();
      }).catch(function(){ done(); });
    });
  });
}
function fxWrapText(el,shift){
  if(!el||!shift) return;
  try{
    if(!el.firstChild) return;
    if(el.querySelector(':scope > .fx')) return;
    if(el.querySelector('table,div,p,ul,ol,h1,h2,h3')) return;   /* 표 안의 표·블록은 건드리지 않는다 */
    var s=document.createElement('span');
    s.className='fx';
    s.style.cssText='position:relative;top:'+shift+'px';
    while(el.firstChild) s.appendChild(el.firstChild);
    el.appendChild(s);
  }catch(e){}
}
function fxApplyClone(doc){
  try{
    var root=doc.getElementById('wl2-book'); if(!root) return;
    var tags=root.querySelectorAll('.pg .tag'), cells=root.querySelectorAll('.pg th, .pg td'), i;
    for(i=0;i<tags.length;i++) fxWrapText(tags[i],PDF_FX.pill);
    for(i=0;i<cells.length;i++) fxWrapText(cells[i],PDF_FX.cell);
  }catch(e){}
}
var pdfLibsReady=null;
function loadFirst(urls){
  return new Promise(function(res,rej){
    var i=0;
    function next(){
      if(i>=urls.length){ rej(new Error('load fail')); return; }
      var s=document.createElement('script');
      s.src=urls[i++]; s.async=true;
      s.onload=function(){ res(true); };
      s.onerror=function(){ try{ s.parentNode.removeChild(s); }catch(e){} next(); };
      document.head.appendChild(s);
    }
    next();
  });
}
function loadPdfLibs(){
  if(pdfLibsReady) return pdfLibsReady;
  pdfLibsReady=new Promise(function(res,rej){
    var h2c=window.html2canvas?Promise.resolve(true):loadFirst([
      'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js']);
    h2c.then(function(){
      if(window.jspdf) return true;
      return loadFirst([
        'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js']);
    }).then(function(){
      if(!window.html2canvas||!window.jspdf) throw new Error('pdf lib');
      res(true);
    }).catch(rej);
  });
  return pdfLibsReady;
}
function progOn(t,s){
  var el=$('#pdfProg'); if(!el) return;
  el.classList.add('on'); el.setAttribute('aria-hidden','false');
  prog(t,0,s);
}
function prog(t,p,s){
  if($('#pdfProgT')&&t!=null) $('#pdfProgT').textContent=t;
  if(typeof p==='number'&&$('#pdfProgBar')) $('#pdfProgBar').style.width=Math.round(Math.max(0,Math.min(1,p))*100)+'%';
  if(s!=null&&$('#pdfProgS')) $('#pdfProgS').textContent=s;
}
function progOff(){
  var el=$('#pdfProg'); if(!el) return;
  el.classList.remove('on'); el.setAttribute('aria-hidden','true');
}
function safeName(n){
  return String(n||'고객').replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,'').slice(0,24)||'고객';
}
function downloadBookPdf(){
  var host=$('#wl2-book');
  if(!host||!host.querySelector('.pg')){ alert('리포트를 먼저 열어주세요.'); return; }
  if(host.getAttribute('data-busy')==='1') return;
  host.setAttribute('data-busy','1');
  progOn('PDF 준비 중…','A4 지면을 한 장씩 그립니다. 잠시만 기다려 주세요.');
  loadPdfLibs().then(function(){
    return makePdf(host,curBookName);
  }).then(function(){
    host.removeAttribute('data-busy');
  }).catch(function(e){
    host.removeAttribute('data-busy');
    if(window.console) console.error('pdf',e);
    var at=(e&&e.pdfPage)?(' · '+(e.pdfPage)+'/'+(e.pdfTotal||'?')+'쪽에서 멈췄습니다'):'';
    prog('PDF를 만들지 못했습니다'+at,0,'휴대폰 메모리가 부족했을 수 있습니다. 잠시 뒤 다시 시도하시거나, 위의 [인쇄하기]로 저장해 주세요.');
    var tb=document.querySelector('#admBookView .pdf-toolbar');
    if(tb&&tb.scrollIntoView){ try{ tb.scrollIntoView({block:'center'}); }catch(e2){ tb.scrollIntoView(); } }
    setTimeout(progOff,6000);
  });
}
function fontsReady(ms){
  return new Promise(function(res){
    var done=false, t=setTimeout(function(){ if(!done){ done=true; res(false); } },ms||1500);
    function fin(){ if(done) return; done=true; clearTimeout(t); res(true); }
    try{
      if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fin,fin);
      else fin();
    }catch(e){ fin(); }
  });
}
/* 한 장을 그린다. 8초 안에 끝나지 않으면 멈춘 것으로 보고 PDF를 중단한다. */
function renderPageOnce(page,scale){
  return new Promise(function(res,rej){
    var done=false;
    var tmr=setTimeout(function(){
      if(done) return; done=true;
      var e=new Error('page timeout'); e.pdfTimeout=true; rej(e);
    },8000);
    function ok(cv){ if(done) return; done=true; clearTimeout(tmr); res(cv); }
    function bad(e){ if(done) return; done=true; clearTimeout(tmr); rej(e||new Error('page render')); }
    var opts={
      scale:scale,
      backgroundColor:'#F6F1E7',
      useCORS:true,
      allowTaint:false,
      logging:false,
      removeContainer:true,
      imageTimeout:3500,
      /* 이 지면 밖(랜딩 화면·다른 쪽·진행 카드)은 복제하지 않는다 — 아이폰이 여기서 멈춘다.
         단 head의 스타일·폰트 링크는 반드시 남긴다(지우면 지면이 CSS 없이 조판된다). */
      ignoreElements:function(el){
        if(!el||el===page) return false;
        try{
          if(!document.body||!document.body.contains(el)) return false;
          if(page.contains&&page.contains(el)) return false;
          if(el.contains&&el.contains(page)) return false;
        }catch(e){ return false; }
        return true;
      },
      onclone:function(doc){ fxApplyClone(doc); }
    };
    try{ window.html2canvas(page,opts).then(ok).catch(bad); }catch(e){ bad(e); }
  });
}
function makePdf(host,name){
  return new Promise(function(resolve,reject){
    var pages=[].slice.call(host.querySelectorAll('.pg'));
    var total=pages.length;
    if(!total){ reject(new Error('empty book')); return; }
    var jsPDF=window.jspdf.jsPDF;
    var doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    var scale=(window.innerWidth<560)?1.15:1.5;
    var i=0, restored=false, k;
    host.classList.add('pdf-shot');
    /* 지금 그리는 한 장만 문서에 남긴다. 나머지는 떼어 두었다가 끝나면 제자리로 되돌린다. */
    var parked=document.createDocumentFragment();
    var parkedNow=false;
    function parkPages(){
      if(parkedNow) return; parkedNow=true;
      for(k=0;k<pages.length;k++){ parked.appendChild(pages[k]); }
    }
    function restoreDom(){
      if(restored) return; restored=true;
      for(var j=0;j<pages.length;j++){ try{ host.appendChild(pages[j]); }catch(e){} }
      try{ host.classList.remove('pdf-shot'); }catch(e){}
    }
    function finish(){
      restoreDom();
      prog('파일을 저장하고 있어요…',0.99,'');
      setTimeout(function(){
        try{ doc.save('천령당-인생사주-'+safeName(name)+'.pdf'); }
        catch(e){ reject(e); return; }
        prog('PDF가 저장되었습니다',1,'다운로드 폴더에서 확인해 주세요. 인앱 브라우저에서는 저장 위치가 다를 수 있습니다.');
        setTimeout(progOff,1500);
        resolve(true);
      },140);
    }
    function fail(e){
      restoreDom();
      e=e||new Error('pdf');
      e.pdfPage=i+1; e.pdfTotal=total;
      reject(e);
    }
    function step(){
      if(i>=total){ finish(); return; }
      var sh=$('#adminSheet');
      if(sh&&!sh.classList.contains('on')){ fail(new Error('sheet closed')); return; }
      prog('PDF 생성 중 ('+(i+1)+'/'+total+')…', i/total, '이 화면을 닫지 마세요. 1분 안팎 걸립니다.');
      var page=pages[i];
      try{ host.appendChild(page); }catch(e){ fail(e); return; }
      renderPageOnce(page,scale).then(function(cv){
        var img;
        try{ img=cv.toDataURL('image/jpeg',0.86); }catch(e){ fail(e); return; }
        try{
          if(i>0) doc.addPage('a4','portrait');
          doc.addImage(img,'JPEG',0,0,210,295);
        }catch(e){ fail(e); return; }
        try{ cv.width=0; cv.height=0; }catch(e){}
        try{ parked.appendChild(page); }catch(e){}
        i++;
        setTimeout(step,10);
      }).catch(fail);
    }
    fontsReady(1500).then(function(){ return calibratePdfText(scale); }).then(function(){ parkPages(); setTimeout(step,60); });
  });
}
window.APP={init:init,state:state};
document.addEventListener('DOMContentLoaded',function(){
  try{ init(); }catch(e){ if(window.console) console.error('init',e); }
});
})();
