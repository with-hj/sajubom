/* =====================================================================
   사주봄 — 화면 (홈·무료운세·타로·5대 테마·PDF 신청·관리자)
   ===================================================================== */
(function(){
'use strict';
var S=window.SJ, CT=window.CT;
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function pad2(n){return n<10?'0'+n:''+n;}
/* 사주 용어 대신 생활의 말 — 첫 화면에서 쓰는 다섯 갈래 기운의 이름 */
function plainGroup(g){
  return ({'비겁':'나와 동료의 기운','식상':'표현과 재능의 기운','재성':'돈과 성과의 기운',
           '관성':'자리와 책임의 기운','인성':'배움과 보호의 기운'})[g]||g;
}

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
  introDone:{},           /* 영상 인트로를 이미 연 탭 (탭별로 기억) */
  deferIntro:false        /* v60 · ?track=life 로 바로 들어온 경우, 운세 트랙을 열기 전에는 인트로 영상을 받지 않는다 */
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
  /* v49 · ‘모름’은 옆 체크박스가 맡는다. 휠에는 시간만 두고, 처음엔 잠긴 ‘시간 선택’ 안내 칸 하나 */
  var h=withEmpty?'<option value="" disabled selected>시간 선택</option>':'';
  for(var i=0;i<12;i++) h+='<option value="'+i+'">'+hourLabel(i)+'</option>';
  sel.innerHTML=h;
}
function fillRegions(sel,hideUnknown){
  /* v49 · ‘지역 모름’ 체크박스가 있는 폼에서는 목록에서 감춘다(체크했을 때만 잠깐 끼워 표시) */
  sel.innerHTML=REGIONS.filter(function(r){ return !(hideUnknown&&r.unknown); }).map(function(r){
    return '<option value="'+r.k+'">'+r.name+'</option>';
  }).join('');
}
function syncUnknown(c,s){
  if(!c||!s) return;
  s.disabled=c.checked;
  s.classList.toggle('is-off',c.checked);
  /* 첫 칸(안내 칸)은 체크했을 때만 ‘시간 모름’으로 바꿔 보여준다 */
  var ph=(s.options[0]&&s.options[0].value==='')?s.options[0]:null;
  if(ph) ph.textContent=c.checked?'시간 모름':'시간 선택';
  if(c.checked) s.value='';
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
  [['by','bm','bd'],['py','pm','pd'],['cy','cm','cd'],['lz-y','lz-m','lz-d']].forEach(function(ids){
    var ys=$('#'+ids[0]),ms=$('#'+ids[1]),ds=$('#'+ids[2]);
    if(!ys) return;
    fillYears(ys,1920,'연도'); fillMonths(ms,true); fillDays(ds,true);
    ys.addEventListener('change',function(){syncDays(ys,ms,ds);});
    ms.addEventListener('change',function(){syncDays(ys,ms,ds);});
  });
  /* 시간 */
  [['hour',true],['phour',true],['chour',true],['lz-hour',true]].forEach(function(a){
    var el=$('#'+a[0]); if(el) fillHours(el,a[1]);
  });
  /* 지역 */
  ['region','pregion','cregion','lz-region'].forEach(function(id){ var el=$('#'+id); if(el) fillRegions(el,id==='region'); });

  /* 히어로 배경 */
  var art=$('.hero-art'); if(art) art.style.backgroundImage='url(./assets/hero-art.jpg)';

  bindChips('#calChips',function(b){return {cal:b.getAttribute('data-cal')};},function(v){
    state.cal=v.cal; $('#leapRow').style.display=(v.cal==='lunar')?'flex':'none';
  });
  bindChips('#genderChips',function(b){return {g:b.getAttribute('data-g')};},function(v){ state.gender=v.g; if(state.tab==='parent') syncParentLabels(); });
  bindChips('#stageChips',function(b){return {s:b.getAttribute('data-s')};},function(v){ state.stage=v.s; },{deselect:true,empty:{s:''}});
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
  bindChips('#cxGenderChips',function(b){return {p:b.getAttribute('data-cg')};},function(v){ state.cg=v.p; });
  bindIntro();

  /* 상대 정보 스위치 */
  var sw=$('#ctxSwitch');
  if(sw) sw.addEventListener('click',function(){ setCtxOpen(!state.ctx); });
  /* 모름 체크 — v49 · 고른 시간을 비우고 잠근다. 표시는 숨겨둔 ‘시간 모름’ 자리가 맡는다 */
  [['notime','hour'],['pnotime','phour'],['cnotime','chour'],['lz-notime','lz-hour']].forEach(function(a){
    var c=$('#'+a[0]),s=$('#'+a[1]);
    if(!c||!s) return;
    c.addEventListener('change',function(){ syncUnknown(c,s); });
  });
  /* v48 · 지역 모름 — 체크하면 출생 지역을 '출생지 모름'으로 맞추고 잠그며, 풀면 직전 지역으로 돌린다 */
  var nrg=$('#noregion'), rg=$('#region');
  if(nrg&&rg){
    var prevReg=rg.value||'seoul';
    nrg.addEventListener('change',function(){
      if(nrg.checked){
        if(rg.value&&rg.value!=='unknown') prevReg=rg.value;
        /* v49 · 잠긴 동안에만 ‘출생지 모름’ 칸을 끼워 표시한다 (목록에는 원래 없다) */
        if(!rg.querySelector('option[data-unknown]')){
          var o=document.createElement('option'); o.value='unknown'; o.textContent='출생지 모름';
          o.setAttribute('data-unknown','1'); rg.appendChild(o);
        }
        rg.value='unknown'; rg.disabled=true; rg.classList.add('is-off');
      }else{
        rg.disabled=false; rg.classList.remove('is-off');
        var tmp=rg.querySelector('option[data-unknown]'); if(tmp) tmp.parentNode.removeChild(tmp);
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
  /* 인생사주 리포트 신청 CTA → 신청서를 열고 그 자리로 내려간다 (v49) */
  $$('[data-life-cta]').forEach(function(b){
    b.addEventListener('click',function(){ openLifeForm(); });
  });
  /* 테마 */
  renderThemes();
  /* v60 · ?track=life 로 바로 들어오면 운세 트랙 인트로 영상은 받지 않는다 (인생사주 소개 영상만) */
  try{ state.deferIntro=/[?&]track=life/.test(location.search); }catch(e){}
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

  /* v53 · 우측 서랍 메뉴(≡) */
  initDrawer();

  /* v73 · 이용약관 · 개인정보처리방침 · 환불규정 */
  initLegal();

  /* v54 · 첫 대문(게이트) */
  initGate();

  /* URL 파라미터 */
  try{
    if(/[?&]admin=1/.test(location.search)) askAdminPassword(/[?&]book=sample/.test(location.search)?'sample':'list');
    else if(adminUnlocked()) ADMIN_OK=true;
    if(/[?&]track=life/.test(location.search)) setTrack('life');
  }catch(e){}

  /* v75 · 휴대폰에서 결제하고 돌아온 경우 */
  try{ handlePayReturn(); }catch(e){ if(window.console) console.error('payReturn',e); }
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

function bindChips(sel,get,on,opt){
  var box=$(sel); if(!box) return;
  var btns=$$('.chip',box);
  var deselect=!!(opt&&opt.deselect), empty=(opt&&opt.empty)||{};
  btns.forEach(function(b){
    b.addEventListener('click',function(){
      /* v49 · 켜진 알약을 다시 누르면 해제 (현재 상황) */
      if(deselect&&b.classList.contains('on')){
        b.classList.remove('on'); on(empty); return;
      }
      btns.forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');
      on(get(b));
    });
  });
  /* 화면에 이미 켜져 있는 알약이 있으면 그것을 기준으로 삼는다 (v48: 남/여 순서가 바뀌어도 기본값이 흘러가지 않게) */
  var cur=btns.filter(function(b){ return b.classList.contains('on'); })[0];
  if(cur) on(get(cur));
  else if(deselect) on(empty);
}

/* ---------------- 트랙 ---------------- */
/* v60 · 인생사주 리포트 소개 영상은 이 트랙을 열 때 그때 받아 재생한다.
   첫 화면에서 대문·인트로 영상과 함께 3편이 한꺼번에 내려받지 않게 하기 위함이다. */
function loadLrVideo(){
  var v=$('#lrVideo'); if(!v) return;
  var s=v.getAttribute('data-src')||'./assets/videos/report.mp4';
  if(v.getAttribute('src')!==s){
    v.setAttribute('src',s);
    v.setAttribute('preload','auto');
    try{ v.load(); }catch(e){}
  }
  try{ var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){}); }catch(e){}
}
function setTrack(t){
  $$('.track-btn').forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-track')===t); });
  if(t==='life'){ markThemeCredit(); loadLrVideo(); }
  else { var lv=$('#lrVideo'); if(lv){ try{ lv.pause(); }catch(e){} } }
  ['read','life'].forEach(function(k){
    var el=$('#track-'+k); if(el) el.classList.toggle('on',k===t);
  });
  /* 대문을 ‘인생사주 리포트’로 닫았거나 다른 트랙에 있다가 운세 트랙으로 돌아오면, 아직 받지 않은 영상을 그때 받는다 */
  if(t==='read'){
    state.deferIntro=false;
    var iv=$('#introVideo');
    if(iv&&!iv.getAttribute('src')){ try{ syncIntro(); }catch(e){} }
  }
  try{
    var sec=$('#track-'+t);
    var ty=sec?sec.getBoundingClientRect().top+window.pageYOffset-122:0;
    window.scrollTo({top:ty<0?0:ty,behavior:'smooth'});
  }catch(e){}
}

/* 생년월일 입력 전에도 보이는 가격: 테마 결제 이력이 있으면 차감가를 함께 안내 */
function lifePriceHTML(credit){
  if(credit) return '<s>119,000원</s><b>35,900원</b><span>테마 결제 3,900원 할인 적용</span>';
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
      /* v55 · 배너를 걷어낸 뒤에는 5대 테마 탭이 상단 바에 가리지 않도록 탭 줄을 기준으로 앉힌다 */
      var tv=$('.v8-pick')||$('.v8-tpanel')||$('#themeView');
      var ty=tv.getBoundingClientRect().top+window.pageYOffset-128;
      window.scrollTo({top:ty,behavior:'smooth'});
    }catch(e){}
  }
}
function renderTabs(){
  var th=CT.THEMES[state.theme], box=$('#subtabs');
  box.className='v8-tabs'+(th.tabs.length>=4?' tabs-4':'');
  box.innerHTML=th.tabs.map(function(k){
    var T=CT.TABS[k];
    return '<button type="button" class="subtab'+(k===state.tab?' on':'')+'" role="tab" data-tab="'+k+'">'+(k===state.tab?'<span class="dot"></span>':'')+'<span class="tx">'+(T.pill||T.name)+'</span></button>';
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
  /* v68 · 결혼운은 “내가 누구와 결혼하는가”를 내 사주만으로 읽는다 — 상대방 칸을 두지 않는다 */
  marriage:{stage:0,marry:1,kid:0,ctx:'partner'},
  wealth:{stage:1,marry:0,kid:0,ctx:0}
};
var NO_CTX_TABS={wedding:1};
function fieldsFor(theme,tab){
  if(NO_CTX_TABS[tab]){ var f0=Object.assign({},THEME_FIELDS[theme]||THEME_FIELDS.general); f0.ctx=0; return f0; }
  if(theme==='baby'){
    if(tab==='child') return {stage:0,marry:0,kid:0,ctx:'child'};
    if(tab==='parent') return {stage:0,marry:0,kid:0,ctx:'family'};
    return {stage:0,marry:1,kid:1,ctx:'partner'};
  }
  return THEME_FIELDS[theme]||THEME_FIELDS.general;
}
/* v51 · 상대방(배우자) 정보는 궁합·결혼·이혼·임신·자녀 탭에서 처음부터 펼쳐 둔다 */
var CTX_OPEN={couple:1,divorce:1,birth:1,child:1,parent:1};
function setCtxOpen(v){
  state.ctx=!!v;
  var sw=$('#ctxSwitch'); if(sw) sw.classList.toggle('on',state.ctx);
  var b=$('#ctxBody'); if(b) b.classList.toggle('on',state.ctx);
}
function setCtxLabel(t,s){
  var tt=$('#ctxSwitch').parentNode.querySelector('.ct-t');
  var ts=$('#ctxSwitch').parentNode.querySelector('.ct-s');
  if(tt) tt.textContent=t; if(ts) ts.textContent=s;
}
function syncParentLabels(){
  /* 부모·자녀 궁합 — 내가 엄마인지 아빠인지에 따라 세 칸의 이름을 바꾼다 */
  var g=$('#genderChips .chip.on'); var gv=g?g.getAttribute('data-g'):'f';
  var me=(gv==='m')?'아빠':'엄마', other=(gv==='m')?'엄마':'아빠';
  var dt=$('#momLabelTx'); if(dt) dt.textContent=me+' 정보';
  var ml=$('#momLabel'); if(ml) ml.style.display=(state.tab==='parent')?'flex':'none';
  if(state.tab==='parent'){
    setCtxLabel(other+' 정보',other+'의 생년월일을 넣으면 세 사람의 원국을 함께 읽습니다');
    var pl=$('#pBirthLabel'); if(pl) pl.textContent=other+' 생년월일';
  }
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
  var kb=$('#kidBlock');
  if(kb) kb.style.display=(f.ctx==='family')?'block':'none';
  var gf=$('#pGenderField');
  if(gf) gf.style.display=(f.ctx==='child')?'block':'none';
  var kg=$('#cxGenderField');
  if(kg) kg.style.display=(f.ctx==='family')?'block':'none';
  var lb=$('#pBirthLabel');
  if(lb) lb.textContent=(f.ctx==='child')?'아이 생년월일':'상대방 생년월일';
  if(f.ctx==='child') setCtxLabel('아이 정보','아이의 생년월일을 넣으면 그 아이의 원국으로 읽습니다');
  else if(f.ctx==='partner'&&state.theme==='baby') setCtxLabel('배우자 정보','배우자의 생년월일을 넣으면 두 사람 결과 아이의 자리를 함께 봅니다');
  else if(f.ctx!=='family') setCtxLabel('상대방 정보','상대의 생년월일을 넣으면 두 사람 글자를 함께 읽습니다');
  /* v51 · 궁합·결혼·이혼·임신·자녀는 상대방 칸을 닫아두지 않고 처음부터 펼친다 */
  if(f.ctx) setCtxOpen(!!CTX_OPEN[state.tab]);
  var ml=$('#momLabel'); if(ml) ml.style.display=(state.tab==='parent')?'flex':'none';
  if(state.tab==='parent') syncParentLabels();
}
function updatePanelCopy(){
  var T=CT.TABS[state.tab];
  $('#pf-title').textContent=T.formTitle||(T.name+' — 내 정보 입력');
  $('#pf-note').textContent=T.note||'';
  /* v50 · 알약 아래 한 줄 — 탭이 정한 문장(sub)이 있으면 그것만, 없으면 ‘이름 · 설명’ */
  var tn=$('#v-tab-note');
  if(tn) tn.innerHTML=T.sub?esc(T.sub):('<b>'+esc(T.name)+'</b> · '+esc(T.tag||''));
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
/* v50 · 영상 카드의 문구·포스터를 탭에 맞춘다 (예전에는 신년운세 문구로 고정돼 있었음) */
function setIntroCopy(T){
  var IQ=T&&T.intro;
  var b=$('#introBadge'), hk=$('#introHook'), ct=$('#introCta'), vd=$('#introVideo');
  if(b) b.textContent=IQ?IQ.badge:'2027 정미년 신년운세';
  if(hk) hk.innerHTML=IQ?IQ.hook:'다가오는 한 해,<br>어느 달에 문이 열리고<br><b>무엇을 피해야 할지</b> 보고 가세요';
  if(ct) ct.innerHTML=(IQ?IQ.cta:('내 '+(T?T.name:'')+' · 사주 정보 입력하기'))+' <span aria-hidden="true">→</span>';
  if(vd){
    var pos=(T&&T.poster)?T.poster:'./assets/themes-web/t-general.jpg';
    if(vd.getAttribute('poster')!==pos) vd.setAttribute('poster',pos);
    vd.setAttribute('aria-label',(T?T.name:'신년운세')+' 인트로 영상');
  }
}
/* v68 · 탭이 바뀌면 이전 탭의 영상을 즉시 멈추고 비운다.
   그대로 두면 새 영상이 준비되는 동안 이전 화면의 마지막 프레임이 남아 겹쳐 보인다. */
function clearIntroVideo(vid){
  if(!vid) return;
  try{ vid.pause(); }catch(e){}
  vid.classList.remove('ready');
  vid.setAttribute('data-empty','1');
  if(vid.getAttribute('src')){ vid.removeAttribute('src'); try{ vid.load(); }catch(e){} }
}
function introPosterOf(T){
  return (T&&T.poster)?T.poster:'./assets/themes-web/t-general.jpg';
}
function paintIntroPoster(T){
  var fr=$('.intro-frame');
  if(fr) fr.style.backgroundImage='url("'+introPosterOf(T)+'")';
}
function syncIntro(){
  var card=$('#introCard'), vid=$('#introVideo'), panel=$('#panelForm');
  if(!card||!vid||!panel) return;
  lrArmTab();   /* v62 · 탭이 바뀌면 ‘한 바퀴 끝에 한 번’을 새로 준비한다 */
  var T=CT.TABS[state.tab];
  var src=introSrc();
  setIntroCopy(T);
  paintIntroPoster(T);
  if(!src){
    card.hidden=true;
    clearIntroVideo(vid);
    if(panel.hasAttribute('hidden')){ panel.removeAttribute('hidden'); panel.classList.add('reveal-settled'); }
    return;
  }
  card.hidden=false;
  /* 새 탭의 영상이 이전 탭과 다르면, 새 파일을 받기 전에 이전 프레임을 지운다 */
  if(vid.getAttribute('src')&&vid.getAttribute('src')!==src) clearIntroVideo(vid);
  /* v60 · 첫 대문이 떠 있는 동안, 또는 ?track=life 로 바로 들어온 동안에는 인트로 영상을 내려받지 않는다.
     받아야 할 주소만 data-src에 적어 두고, 대문을 닫을 때 resumeIntro()가 실제로 받아 재생한다.
     그래야 첫 화면의 대역폭이 전부 대문 영상(gate.mp4)으로 간다. */
  if(document.documentElement.classList.contains('gate-on')||state.deferIntro){
    if(vid.getAttribute('src')){ try{ vid.pause(); }catch(e){} vid.removeAttribute('src'); try{ vid.load(); }catch(e){} }
    vid.setAttribute('data-src',src);
    if(panel.hasAttribute('hidden')){ panel.removeAttribute('hidden'); panel.classList.add('reveal-settled'); }
    return;
  }
  if(vid.getAttribute('data-src')!==src||!vid.getAttribute('src')){
    vid.setAttribute('data-src',src);
    vid.setAttribute('src',src);
    vid.removeAttribute('data-empty');
    try{ vid.load(); }catch(e){}
  }
  /* v57 · 영상은 끝나도 멈추지 않고 계속 반복 재생한다(loop).
     그래서 입력창을 영상이 끝날 때까지 감춰두지 않고, 영상 카드 아래에 늘 열어 둔다. */
  if(panel.hasAttribute('hidden')){ panel.removeAttribute('hidden'); panel.classList.add('reveal-settled'); }
  if(state.introDone[state.tab]) return;
  try{ vid.currentTime=0; }catch(e){}
  var pr=vid.play(); if(pr&&pr.catch) pr.catch(function(){ /* 자동재생 차단 시 첫 프레임 유지, CTA로 진행 가능 */ });
}
/* v60 · 대문을 닫은 뒤에야 인트로 영상을 실제로 받아 재생한다.
   지금 보고 있는 트랙이 ‘운세 보기’가 아니면(대문에서 인생사주 리포트로 바로 갔을 때) 건너뛰고,
   나중에 운세 트랙을 열 때 setTrack이 다시 불러 받는다. */
function resumeIntro(){
  var tr=$('#track-read');
  if(tr&&!tr.classList.contains('on')) return;
  syncIntro();
}
/* ---------------- v62 · 영상 한 바퀴가 끝나는 순간 입력창이 스르륵 올라온다 ----------------
   영상은 loop로 계속 도니까 ended 이벤트가 오지 않는다. 그래서 timeupdate에서
   재생 위치가 0:00으로 되감기는 순간(직전보다 0.5초 이상 뒤로 점프)을 ‘한 바퀴 끝’으로 본다.
   탭에 들어와 한 번만, 사용자가 이미 입력창으로 내려갔거나(CTA·스크롤·입력) 인생사주 리포트
   트랙을 보는 중이거나 대문이 떠 있으면 움직이지 않는다. 다른 탭에 갔다 돌아오면 다시 한 번. */
var lrLastSec=-1, lrLastTab=null, lrPulled={}, lrEngaged=false;
function lrArmTab(){
  if(lrLastTab===state.tab) return;
  lrLastTab=state.tab;
  lrPulled[state.tab]=false;
  lrLastSec=-1;
}
function lrCanPull(){
  if(lrEngaged) return false;
  if(document.documentElement.classList.contains('gate-on')) return false;
  var tr=$('#track-read');
  if(!tr||!tr.classList.contains('on')) return false;
  if(!introSrc()) return false;
  if(state.introDone[state.tab]) return false;
  if(lrPulled[state.tab]) return false;
  return true;
}
function bindLoopPull(){
  var vid=$('#introVideo');
  if(!vid||vid.__loopPull) return;
  vid.__loopPull=true;
  /* 손으로 조금이라도 움직였거나 입력창을 건드렸으면 영상이 끝나도 끌어내리지 않는다 */
  var engage=function(){ lrEngaged=true; };
  try{
    window.addEventListener('wheel',engage,{passive:true});
    window.addEventListener('touchmove',engage,{passive:true});
    /* 키보드로 내려간 경우도 ‘손으로 움직인 것’으로 본다 */
    window.addEventListener('keydown',function(e){
      var k=e.key;
      if(k===' '||k==='PageDown'||k==='PageUp'||k==='ArrowDown'||k==='ArrowUp'||k==='End'||k==='Home') lrEngaged=true;
    });
  }catch(e){}
  var panel=$('#panelForm');
  if(panel){
    panel.addEventListener('focusin',engage);
    panel.addEventListener('input',engage);
    panel.addEventListener('change',engage);
  }
  vid.addEventListener('timeupdate',function(){
    var t=vid.currentTime||0;
    if(lrLastSec<0){ lrLastSec=t; return; }
    if(lrLastSec>0.8&&t<lrLastSec-0.5){        /* 0:00으로 되감김 = 첫 바퀴가 끝난 지점 */
      lrLastSec=t;
      lrArmTab();
      if(!lrCanPull()) return;
      lrPulled[state.tab]=true;
      try{ revealForm(true); }catch(e){}
      return;
    }
    lrLastSec=t;
  });
  /* 영상이 다시 0:00부터 시작할 때(탭 전환·재생) 기준점을 맞춘다 */
  vid.addEventListener('playing',function(){ if(vid.currentTime<0.8) lrLastSec=-1; });
}
function bindIntro(){
  var vid=$('#introVideo');
  if(!vid) return;
  /* v68 · 새 영상의 첫 프레임이 준비된 순간에만 부드럽게 나타나게 (이전 탭 잔상 방지) */
  ['loadeddata','playing'].forEach(function(ev){
    vid.addEventListener(ev,function(){ if(vid.getAttribute('src')) vid.classList.add('ready'); });
  });
  bindLoopPull();
  vid.addEventListener('ended',function(){
    if(!introSrc()) return;
    state.introDone[state.tab]=true;
    /* v53 · 서랍으로 인생사주 리포트 등 다른 트랙을 보는 중에 영상이 끝나면,
       보고 있는 화면을 입력창 위치로 끌고 내려가지 않는다 */
    var tr=$('#track-read');
    if(tr&&!tr.classList.contains('on')) return;
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
  var c={stage:state.stage,marry:state.marry,kid:state.kid,partner:null,partnerErr:null,child:null,childErr:null};
  var f=state.fields||fieldsFor(state.theme,state.tab);
  if(f.ctx&&state.ctx){
    var py=parseInt($('#py').value,10),pm=parseInt($('#pm').value,10),pd=parseInt($('#pd').value,10);
    if(py&&pm&&pd){
      var preg=regionOf($('#pregion').value), pNo=$('#pnotime').checked, pHv=$('#phour').value;
      var pgEl=$('#pGenderChips .chip.on');
      c.partner={y:py,m:pm,d:pd,hasTime:!pNo&&pHv!=='',hourIndex:(!pNo&&pHv!=='')?parseInt(pHv,10):0,
        gender:pgEl?pgEl.getAttribute('data-pg'):(state.pg||'m'),tsoff:(!pNo&&pHv!=='')?preg.off:0,regionName:preg.name};
    } else if(py||pm||pd){
      c.partnerErr=(f.ctx==='child'?'아이 생년월일을 모두 골라주세요':(f.ctx==='family'?'상대 부모 생년월일을 모두 골라주세요':'상대방 생년월일을 모두 골라주세요'));
    }
  }
  /* v51 · 부모·자녀 궁합 — 아이 정보(세 번째 사람) */
  if(f.ctx==='family'){
    var ky=parseInt($('#cy').value,10), km=parseInt($('#cm').value,10), kd=parseInt($('#cd').value,10);
    if(ky&&km&&kd){
      var kreg=regionOf($('#cregion').value), kNo=$('#cnotime').checked, kHv=$('#chour').value;
      var kgEl=$('#cxGenderChips .chip.on');
      c.child={y:ky,m:km,d:kd,hasTime:!kNo&&kHv!=='',hourIndex:(!kNo&&kHv!=='')?parseInt(kHv,10):0,
        gender:kgEl?kgEl.getAttribute('data-cg'):'m',tsoff:(!kNo&&kHv!=='')?kreg.off:0,regionName:kreg.name};
    } else if(ky||km||kd){
      c.childErr='아이 생년월일을 모두 골라주세요';
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
      '<div class="pg">'+(i===2?'나':S.SEUN_KEY[S.tenGod(R.dStem,s)])+'</div>'+
      '<div class="pc" style="color:'+S.EL_COLOR[S.STEM_EL[s]]+'">'+S.STEM_HAN[s]+'</div>'+
      '<div class="pk">'+S.STEM_KO[s]+'</div>'+
      '<div class="pc" style="color:'+S.EL_COLOR[S.BR_EL[b]]+'">'+S.BR_HAN[b]+'</div>'+
      '<div class="pk">'+S.BR_KO[b]+'</div>'+
      '<div class="pe" style="color:'+S.EL_COLOR[S.BR_EL[b]]+'">'+S.EL_KO[S.BR_EL[b]]+'</div></div>';
  }
  return h;
}
/* v75 · 결제 후 돌아왔을 때 결과를 다시 그리기 위해 마지막 입력을 세션에 남긴다 */
function saveLastInput(inp){
  try{
    if(!inp||inp.err) return;
    var c={};
    if(inp.ctx){ for(var k in inp.ctx){ if(k!=='R') c[k]=inp.ctx[k]; } }
    sessionStorage.setItem('wlh_last_input',JSON.stringify({
      inp:{y:inp.y,m:inp.m,d:inp.d,hasTime:inp.hasTime,hourIndex:inp.hourIndex,gender:inp.gender,
        tsoff:inp.tsoff,regionName:inp.regionName,regionKey:inp.regionKey,name:inp.name,
        theme:inp.theme,tab:inp.tab,cal:inp.cal,lunar:inp.lunar,ctx:c},
      theme:state.theme,tab:state.tab
    }));
  }catch(e){}
}
function renderResult(R,input){
  saveLastInput(input);
  var c=S.chartCtx(R);
  var T=CT.TABS[input.tab], th=CT.THEMES[input.theme];
  var chapters=CT.chaptersOf(input.tab);
  var name=input.name;
  var h='<div class="res-head fade-in">';
  h+='<div class="rh-t">'+esc(T.name)+'</div>';
  h+='<h2>'+esc(name)+' 님의 '+S.STEM_KO[R.dStem]+S.BR_KO[R.dBranch]+'일주</h2>';
  h+='<div class="rh-s">'+S.ILJU[R.dIdx][0]+' — '+S.ILJU[R.dIdx][2]+'</div>';
  h+='<div class="pillars">'+pillarCells(R)+'</div>';
  /* v68 · 첫 화면에서 사주 용어를 쓰지 않는다. 여덟 글자를 통째로 보여 주고, 그중 ‘나를 대표하는 글자’만 짚는다. */
  var meta=S.STEM_KO[R.dStem]+'('+S.STEM_HAN[R.dStem]+')'+S.josaP(S.STEM_KO[R.dStem],'이가')+' 나를 대표하는 글자 · 기운은 '+(R.strength==='강'?'강한 편':(R.strength==='약'?'약한 편':'고른 편'))
    +' · 채우면 편해지는 기운 '+S.EL_KO[c.yongEl]+'('+S.EL_HAN[c.yongEl]+') · 지금은 '+R.daeun[R.curDaeun].from+'~'+R.daeun[R.curDaeun].to+'세의 10년';
  h+='<div class="rh-meta">'+meta+'<br>'+R.y+'년 '+R.m+'월 '+R.d+'일 '+(input.cal==='lunar'?'음력':'양력')+' · '+(R.hasTime?solarNote(R,input):'시간 모름(시주 제외)')+'</div>';
  h+='</div>';

  h+='<div class="res-sum fade-in"><p><b>'+esc(name)+'</b> 님의 사주 여덟 글자는 <b>'+S.eightChars(R)+'</b>입니다. 그중 나를 대표하는 글자는 <b>'+S.STEM_KO[R.dStem]+'('+S.STEM_HAN[R.dStem]+')</b>, 곧 <b>'+S.STEM_KO[R.dStem]+S.BR_KO[R.dBranch]+'('+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+')일주</b>입니다.</p>';
  h+='<p>다섯 기운 가운데 <b>'+S.EL_KO[c.mostI]+'</b>'+S.josaP(S.EL_KO[c.mostI],'이가')+' 가장 넉넉하고 <b>'+S.EL_KO[c.leastI]+'</b>'+S.josaP(S.EL_KO[c.leastI],'이가')+' 가장 적습니다. 그래서 <b>'+S.EL_KO[c.yongEl]+'</b>의 기운을 생활에서 조금씩 채우면 마음이 편해집니다.</p>';
  h+='<p>타고난 성향은 <b>'+S.DAY_MASTER[R.dStem][0]+'</b>이고, 여덟 글자에서 가장 두터운 힘은 <b>'+plainGroup(c.topGrp)+'</b>입니다. 그 힘은 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>로 드러납니다.</p>';
  if(input.ctx&&input.ctx.partnerErr) h+='<p style="color:#c94228">'+esc(input.ctx.partnerErr)+' — 내 사주만 읽었습니다.</p>';
  if(input.ctx&&input.ctx.childErr) h+='<p style="color:#c94228">'+esc(input.ctx.childErr)+' — 아이의 사주는 비워 두었습니다.</p>';
  h+='</div>';

  /* ---------- v45 : 장 목차 탭 · 1~2장 무료 · 3장부터 첫 문장 + 핵심 가림 ---------- */
  var FREE=(FREE_BY_TAB[input.tab]!=null?FREE_BY_TAB[input.tab]:FREE_CH);
  FREE_CUR=FREE;
  var bodies=[], i, total=chapters.length, lockedTotal=0;
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
     '<p class="ph" style="margin-bottom:6px">테마별 풀이는 <b>3,900원</b> · 인생사주 리포트는 <s style="color:#A99A86">119,000원</s> <b>39,800원</b>(67% 할인)입니다.</p>'+
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
/* v68 · 신년운세는 ‘나의 오행 → 인간 관계 → 평생의 큰 흐름 → 다가오는 한 해의 문’ 네 장을 무료로 연다 */
var FREE_BY_TAB={newyear:4};
var FREE_CUR=FREE_CH;   /* 이번 결과에서 무료로 여는 장 수 (chapterSection이 참조) */
var ICON_LOCK='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6.5A2.5 2.5 0 0 0 4 12.5v7A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 17.5 10H17V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"/></svg>';

function shortTitle(t){
  var s=String(t||'').split('—')[0].replace(/\s+/g,' ').trim();
  /* v68 · 단어 중간에서 잘리지 않게 — 15자까지 두고, 넘치면 마지막 띄어쓰기에서 자른다 */
  if(s.length>15){
    var cut=s.slice(0,15), sp=cut.lastIndexOf(' ');
    s=(sp>6?cut.slice(0,sp):cut).replace(/[·,\s]+$/,'');
  }
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
  var lead=ch.lead?('<p class="ch-lead">'+ch.lead+'</p>'):'';
  if(locked) h+='<div class="ch-bd ch-teaser">'+lead+teaserHTML(body)+'</div>'+gateHTML(i===FREE_CUR);
  else h+='<div class="ch-bd">'+lead+body+'</div>';
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
      '<div class="gate-price">3,900원 · 전체 풀이</div>'+
      '<button type="button" class="btn btn-gold btn-block gate-btn" data-pw-open>결제 후 전체 보기</button>'+
      '<p class="gate-note">결제가 끝나면 남은 장이 바로 열립니다</p></div>';
  }
  return '<div class="ch-gate mini">'+
    '<div class="gm-tx"><b>이 장의 결론과 시기</b><span>3,900원 · 전체 풀이</span></div>'+
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
/* =====================================================================
   v75 · 포트원(PortOne) V2 테스트 결제
   — 테마별 풀이 3,900원 / 인생사주 리포트 39,800원(테마 결제 시 35,900원)
   — KG이니시스 V2 테스트 채널(inicis_v2 · MID INIpayTest)
   ===================================================================== */
var PG_STORE='store-c8e476ea-fb1d-4f0e-8a47-ede1b790ffe2';
var PG_CHANNEL='channel-key-bbb6cc64-49e6-4757-bd6d-688b835898c4';
var PG_VER='75';
function pgReady(){ return !!(window.PortOne&&typeof window.PortOne.requestPayment==='function'); }
function pgPayId(kind){ return 'sajubom-'+kind+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7); }
/* 모바일 리디렉션으로 돌아올 주소 — 대문(gate)은 건너뛰고 바로 결과를 다시 그린다 */
function pgReturnURL(){
  try{ return location.origin+location.pathname+'?v='+PG_VER+'&gate=0'; }catch(e){ return location.href; }
}
function pgPhone(v){
  var d=String(v||'').replace(/[^0-9]/g,'');
  if(d.length===11) return d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7);
  if(d.length===10) return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6);
  return '';
}
/* KG이니시스는 fullName 필수, PC에서는 이메일·연락처도 필요하다 */
function pgCustomer(name,email,phone){
  var n=String(name||'').trim();
  var c={fullName:(n&&n!=='당신')?n:'사주봄 이용자'};
  if(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email||'').trim())) c.email=String(email).trim();
  var p=pgPhone(phone); if(p) c.phoneNumber=p;
  return c;
}
function pgErrMsg(r){
  if(!r) return '결제가 완료되지 않았습니다. 다시 시도해 주세요.';
  var m=r.pgMessage||r.message||'';
  if(/취소/.test(m)) return '결제를 취소하셨습니다. 바로 열어야 하면 다시 시도해 주세요.';
  var base=/CANCEL/i.test(String(r.code||''))?'결제를 취소하셨습니다.':'결제가 완료되지 않았습니다.';
  return base+(m?' ('+m+')':'');
}
/* ---------- 결제 공통 UI : 동의 · 오류 ---------- */
/* 이니시스 V2 테스트 채널은 카드 결제창 하나로 연다 — 결제창 안에서 카카오페이·네이버페이·토스페이도 고를 수 있다 */
function payMethodOf(){ return 'CARD'; }
function payConsentHTML(){
  return '<label class="pc-consent"><input type="checkbox" data-pay-consent>'+
    '<span>이용약관, 개인정보처리방침 및 디지털 콘텐츠 열람·제작 개시 후 청약철회(환불) 제한에 동의합니다.</span></label>'+
    '<div class="pc-docs"><button type="button" data-pay-doc="terms">이용약관</button><i aria-hidden="true">·</i>'+
    '<button type="button" data-pay-doc="privacy">개인정보처리방침</button><i aria-hidden="true">·</i>'+
    '<button type="button" data-pay-doc="refund">환불규정</button></div>';
}
function payErrHTML(){ return '<p class="pc-err" data-pay-err hidden></p>'; }
/* 이니시스 V2는 구매자 이메일·휴대폰이 필수 — 결제 창에서 함께 받는다 */
function payContactHTML(email,phone,cap){
  return '<div class="pc-contact">'+
    (cap?'<p class="pc-cap">'+cap+'</p>':'')+
    '<input type="email" class="pc-in" data-pay-email inputmode="email" autocomplete="email" aria-label="이메일" placeholder="이메일 you@example.com" value="'+esc(email||'')+'">'+
    '<input type="tel" class="pc-in" data-pay-phone inputmode="tel" autocomplete="tel" aria-label="휴대폰 번호" placeholder="휴대폰 010-0000-0000" value="'+esc(phone||'')+'">'+
    '</div>';
}
function payContactOf(host,fallback){
  var e=$('[data-pay-email]',host), p=$('[data-pay-phone]',host);
  var email=String((e?e.value:(fallback&&fallback.email))||'').trim();
  var phone=String((p?p.value:(fallback&&fallback.phone))||'').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return {err:'결제 확인서를 받으실 이메일을 확인해 주세요.',focus:e};
  if(!pgPhone(phone)) return {err:'결제 확인서를 받으실 휴대폰 번호를 확인해 주세요.',focus:p};
  return {email:email,phone:phone};
}
function payErr(host,msg){
  var el=host?$('[data-pay-err]',host):null;
  if(!el){ if(msg) alert(msg); return; }
  if(msg){ el.textContent=msg; el.hidden=false; }
  else { el.textContent=''; el.hidden=true; }
}
function syncPayBtn(host){
  var go=$('[data-pay-go]',host); if(!go) return;
  var ck=$('[data-pay-consent]',host);
  var ok=ADMIN_OK||!!(ck&&ck.checked);
  go.disabled=!ok;
  go.setAttribute('aria-disabled',ok?'false':'true');
}
function bindPayUI(host,onPay){
  if(!host||host.__pg) return;
  host.__pg=1;
  host.addEventListener('click',function(e){
    var doc=e.target.closest?e.target.closest('[data-pay-doc]'):null;
    if(doc){ e.preventDefault(); openLegal(doc.getAttribute('data-pay-doc')); return; }
    var m=e.target.closest?e.target.closest('[data-pay-method]'):null;
    if(m){
      $$('[data-pay-method]',host).forEach(function(b){
        var on=(b===m); b.classList.toggle('on',on); b.setAttribute('aria-pressed',on?'true':'false');
      });
      return;
    }
    if(e.target.closest&&e.target.closest('[data-pay-go]')) onPay();
  });
  host.addEventListener('change',function(e){
    if(e.target&&e.target.hasAttribute&&e.target.hasAttribute('data-pay-consent')) syncPayBtn(host);
  });
  syncPayBtn(host);
}
/* 실제 결제 요청 — 성공하면 onSuccess, 아니면 창 안에 사유를 남긴다 */
function startPay(cfg){
  var host=cfg.host;
  payErr(host,'');
  var go=host?$('[data-pay-go]',host):null;
  var label=go?go.textContent:'';
  if(!pgReady()){ payErr(host,'결제 모듈을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.'); return; }
  var paymentId=pgPayId(cfg.kind);
  var req={
    storeId:PG_STORE, channelKey:PG_CHANNEL, paymentId:paymentId,
    orderName:cfg.orderName, totalAmount:cfg.amount, currency:'CURRENCY_KRW',
    payMethod:payMethodOf(), customer:cfg.customer||{fullName:'사주봄 이용자'},
    redirectUrl:pgReturnURL()
  };
  try{ sessionStorage.setItem('wlh_pay_pending',JSON.stringify({paymentId:paymentId,kind:cfg.kind,amount:cfg.amount,order:cfg.order||null,at:Date.now()})); }catch(e){}
  if(go){ go.disabled=true; go.textContent='결제창을 여는 중…'; }
  function restore(){ if(go){ go.textContent=label; syncPayBtn(host); } }
  var pr;
  try{ pr=window.PortOne.requestPayment(req); }
  catch(ex){ restore(); payErr(host,'결제를 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.'); if(window.console) console.error(ex); return; }
  Promise.resolve(pr).then(function(r){
    restore();
    if(!r||r.code){
      payErr(host,pgErrMsg(r));
      try{ sessionStorage.removeItem('wlh_pay_pending'); }catch(e){}
      return;
    }
    try{ sessionStorage.removeItem('wlh_pay_pending'); }catch(e){}
    try{ cfg.onSuccess(r); }catch(ex){ if(window.console) console.error(ex); }
  }).catch(function(ex){
    restore();
    var m=(ex&&ex.message)?String(ex.message).replace(/^결제 창 호출에 실패하였습니다\.?\s*/,''):'';
    payErr(host,m?('결제를 진행하지 못했습니다. '+m):'결제를 진행하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    if(window.console) console.error(ex);
  });
}
/* ---------- 테마별 풀이 3,900원 결제 창 ---------- */
function payCardMarkup(){
  var info=window.__pwInfo||{total:0,tab:''};
  var rest=info.total>FREE_CUR?info.total-FREE_CUR:6;
  var admin=ADMIN_OK;
  return '<div class="pw-price">3,900원 · 전체 풀이</div>'+
    '<h3>남은 '+rest+'장을<br>지금 열어볼까요?</h3>'+
    '<p>결제가 끝나면 <b>'+esc(info.tab||'테마별 풀이')+'</b>의 남은 '+rest+'장이<br>바로 열립니다.</p>'+
    (admin?'<p class="pc-admin">관리자 모드 · 결제 없이 열람합니다</p>':(payContactHTML(savedEmail(),savedPhone())+payConsentHTML()+payErrHTML()))+
    '<button type="button" class="btn btn-gold btn-block" data-pay-go>'+(admin?'결제 없이 전체 풀이 열기':'3,900원 결제하고 전체 보기')+'</button>'+
    '<button type="button" class="pw-x" data-pay-cancel>취소</button>'+
    '<p class="pc-test">테스트 결제 모드 · 실제 금액은 청구되지 않습니다</p>';
}
function onThemePay(el){
  var ck=$('[data-pay-consent]',el);
  if(!ADMIN_OK&&!(ck&&ck.checked)){ payErr(el,'약관과 환불 제한 동의에 체크해 주세요.'); return; }
  if(ADMIN_OK){ closePayGate(); unlockReading('admin'); return; }
  var c=payContactOf(el);
  if(c.err){ payErr(el,c.err); if(c.focus){ try{ c.focus(); }catch(e){} } return; }
  saveContact(c.email,c.phone);
  var inp=state.input||{};
  startPay({
    kind:'theme', host:el, amount:3900, orderName:'사주봄 테마별 풀이',
    customer:pgCustomer(inp.name,c.email,c.phone),
    onSuccess:function(r){
      closePayGate();
      setThemeCredit(true);
      try{ localStorage.setItem('wlh_theme_paid_pid',String(r.paymentId||'')); }catch(e){}
      unlockReading('pay');
    }
  });
}
function openPayGate(){
  var el=$('#payGate');
  if(!el){
    el=document.createElement('div');
    el.id='payGate'; el.className='paygate';
    el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-label','전체 풀이 결제');
    document.body.appendChild(el);
    bindPayUI(el,function(){ onThemePay(el); });
    el.addEventListener('click',function(e){
      if(e.target===el){ closePayGate(); return; }
      if(e.target.closest&&e.target.closest('[data-pay-cancel]')) closePayGate();
    });
  }
  el.innerHTML='<div class="pw-card pay-card">'+payCardMarkup()+'</div>';
  syncPayBtn(el);
  el.classList.add('on'); document.body.classList.add('lock');
  var b=$('[data-pay-go]',el); if(b&&b.focus){ try{ b.focus(); }catch(e){} }
}
function closePayGate(){
  var el=$('#payGate'); if(el) el.classList.remove('on');
  document.body.classList.remove('lock');
}
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape') return;
  var lg=$('#lgModal'); if(lg&&lg.classList.contains('on')) return;   /* 약관 창이 위에 떠 있으면 그것만 닫는다 */
  closePayGate();
});
/* 모바일은 결제 후 페이지로 되돌아온다 — 주소의 결과를 읽어 바로 열어준다 */
function handlePayReturn(){
  var q='';
  try{ q=location.search||''; }catch(e){ return; }
  if(!/[?&](paymentId|txId)=/.test(q)) return;
  var p={};
  q.replace(/^[?]/,'').split('&').forEach(function(kv){
    if(!kv) return;
    var i=kv.indexOf('='); if(i<0) return;
    try{ p[decodeURIComponent(kv.slice(0,i))]=decodeURIComponent(kv.slice(i+1).replace(/\+/g,' ')); }catch(e){}
  });
  var pid=p.paymentId||'', code=p.code||'';
  var pend=null;
  try{ pend=JSON.parse(sessionStorage.getItem('wlh_pay_pending')||'null'); }catch(e){}
  var kind=(pend&&pend.paymentId&&pend.paymentId===pid)?pend.kind:(/^sajubom-theme-/.test(pid)?'theme':(/^sajubom-life-/.test(pid)?'life':''));
  try{ history.replaceState(null,'',location.pathname); }catch(e){}
  if(code){ setTimeout(function(){ alert('결제가 완료되지 않았습니다. 다시 시도해 주세요.'); },200); return; }
  if(!kind) return;
  try{ sessionStorage.removeItem('wlh_pay_pending'); }catch(e){}
  if(kind==='theme'){
    setThemeCredit(true);
    var restored=false, raw=null;
    try{ raw=sessionStorage.getItem('wlh_last_input'); }catch(e){}
    if(raw){
      try{
        var o=JSON.parse(raw), inp=o.inp;
        inp.ctx=inp.ctx||{};
        var R=S.computeSaju(inp); inp.ctx.R=R;
        state.R=R; state.input=inp; state.theme=o.theme||inp.theme; state.tab=o.tab||inp.tab;
        renderResult(R,inp); unlockReading('pay'); restored=true;
      }catch(e){ restored=false; }
    }
    if(!restored) setTimeout(function(){ alert('결제가 완료되었습니다. 보시던 테마의 생년월일을 다시 넣으시면 전체 풀이가 열립니다.'); },200);
    return;
  }
  if(kind==='life'){
    var ord=(pend&&pend.order)?pend.order:null;
    if(ord){
      ord.payMode='pg'; if(pid) ord.paymentId=pid; if(p.txId) ord.txId=p.txId;
      pendingOrder=ord; completePayment();
    }else{
      setTimeout(function(){ alert('결제가 완료되었습니다. 신청 내역은 마이페이지에서 확인하실 수 있습니다.'); },200);
    }
  }
}
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
  return '<p class="up-tag">테마 결제 3,900원 할인 적용</p>'+
    '<p class="tt">여기서 멈추면<br>내 인생의 큰 흐름은 못 봅니다</p>'+
    '<p class="pp">타고난 기질부터 평생 대운·앞으로 10년·문서와 부동산까지 한 권에 담았습니다.<br>정가 <b>119,000원</b>인 리포트를 지금 <b>39,800원</b>에, 방금 결제한 <b>3,900원</b>을 빼면 이 가격입니다.</p>'+
    '<div class="up-price"><s>119,000원</s><b>35,900원</b></div>'+
    '<div class="up-list"><span>평생 대운 9구간</span><span>앞으로 10년</span><span>문서·부동산</span><span>맞춤 질문 답변</span></div>'+
    '<button type="button" class="btn btn-gold btn-block" data-theme-upgrade>+35,900원으로 인생사주 리포트 받기</button>'+
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
/* 테마 결제 정보를 인생사주 리포트 신청서로 옮기고, 35,900원 할인가로 넘긴다 */
function themeUpgradeToLife(){
  var inp=state.input;
  setThemeCredit(true);
  if(inp){
    if($('#lz-y')) $('#lz-y').value=inp.y;
    if($('#lz-m')) $('#lz-m').value=inp.m;
    if($('#lz-d')) $('#lz-d').value=inp.d;
    if($('#lz-name')&&!$('#lz-name').value&&inp.name&&inp.name!=='당신') $('#lz-name').value=inp.name;
    if($('#lz-hour')) $('#lz-hour').value=inp.hasTime?String(inp.hourIndex):'';
    if($('#lz-notime')){ $('#lz-notime').checked=!inp.hasTime; syncUnknown($('#lz-notime'),$('#lz-hour')); }
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

/* 테마 결제 후 업셀 : 4단계 신청서를 건너뛰고 이메일만 확인해 35,900원 결제(#pdfPay)로 직행 */
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
/* v49 · 인생사주 신청서는 CTA를 눌렀을 때 열린다 (랜딩을 먼저 보여주기 위해) */
function revealLifePanel(){
  var p=$('#lifeFormPanel'); if(p) p.classList.add('on');
  var cta=$('#lifeApplyCta'); if(cta) cta.classList.add('opened');
}
function openLifeForm(){
  revealLifePanel();
  var fast=$('#lzFast'), pay=$('#pdfPay'), done=$('#pdfDone');
  var busy=(fast&&fast.classList.contains('on'))||(pay&&pay.classList.contains('on'))||(done&&done.classList.contains('on'));
  if(!busy){
    var f=$('#pdfForm'); if(f) f.style.display='';
    var st=$('#pdfSteps'); if(st) st.style.display='';
  }
  setTimeout(function(){
    var el=$('#lifeFormPanel'); if(!el) return;
    try{ var y=el.getBoundingClientRect().top+window.pageYOffset-104; window.scrollTo({top:y<0?0:y,behavior:'smooth'}); }catch(e){}
  },80);
}
function openFastConfirm(){
  revealLifePanel();
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
  revealLifePanel();
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

/* v45 : 가려 둔 장을 실제 본문으로 바꾸고 잠금 표시를 걷어낸다
   mode — 'pay'(포트원 결제 완료) · 'admin'(관리자 미리보기) · 없음 */
function unlockReading(mode){
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
    var ft=(mode==='admin')?'관리자 모드 · 결제 없이 열렸습니다':(mode==='pay'?'결제 완료 · 3,900원':'테스트 결제 3,900원');
    flag.innerHTML='<b>전체 풀이가 열렸습니다</b> · '+ft;
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
    product:'사주봄 인생사주 리포트',priceRegular:119000,price:themeCredit()?35900:39800,
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
    h+='<div class="pay-row"><span>정가</span><b><s style="color:#A99A86">'+won(reg)+'</s></b></div>';
    h+='<div class="pay-row"><span>특가</span><b>'+won(base)+' <em style="font-style:normal;font-size:11px;font-weight:800;color:#0A1421;background:#E4B96A;border-radius:5px;padding:2px 6px">67% 할인</em></b></div>';
    h+=row('테마 결제 할인','-'+won(3900),'discount');
    h+='<div class="pay-row total"><span>결제 금액</span><b>'+won(price)+'<span class="sub">정가 '+won(reg)+' · 특가 '+won(base)+' - 테마 결제 할인 '+won(3900)+'</span></b></div>';
  } else {
    h+='<div class="pay-row"><span>정가</span><b><s style="color:#A99A86">'+won(reg)+'</s> <em style="font-style:normal;font-size:11px;font-weight:800;color:#0A1421;background:#E4B96A;border-radius:5px;padding:2px 6px">67% 할인</em></b></div>';
    h+='<div class="pay-row total"><span>결제 금액</span><b>'+won(price)+'<span class="sub">정가 '+won(reg)+'에서 67% 할인</span></b></div>';
  }
  return h;
}
function showPayStep(o){
  revealLifePanel();
  pendingOrder=o;
  $$('.step-body').forEach(function(x){ x.classList.remove('on'); });
  try{ $('#pdfSteps').style.display='none'; }catch(e){}
  var fb=$('#lzFast'); if(fb) fb.classList.remove('on');
  var p=$('#pdfPay'); if(!p) return;
  var needContact=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(o.email||''))||!pgPhone(o.phone);
  p.classList.add('on');
  p.innerHTML='<div class="pay-box fade-in">'+
    '<div class="pay-tag">주문 확인</div>'+
    '<h3>사주봄 인생사주 리포트</h3>'+
    '<p class="pay-sub">검수 후 이메일로 보내드리는 책자형 PDF입니다.</p>'+
    '<div class="pay-rows">'+payRowsHTML(o)+'</div>'+
    '<p class="pay-test">테스트 결제 모드 · 실제 금액은 청구되지 않습니다</p>'+
    (ADMIN_OK?'<p class="pc-admin">관리자 모드 · 결제 없이 접수합니다</p>':((needContact?'<p class="pc-cap">결제 확인서를 받으실 이메일과 휴대폰</p>':'')+(needContact?payContactHTML(o.email,o.phone):'')+payConsentHTML()))+
    payErrHTML()+
    '<button type="button" class="btn btn-verm btn-block" data-pay-go>'+won(o.price||39800)+' 결제하기</button>'+
    '<button type="button" class="btn btn-line btn-block" id="payBack" style="margin-top:8px">이전으로</button>'+
    '<p class="pay-note">결제를 마치면 리포트를 바로 펼쳐보고 PDF로 저장하실 수 있습니다.</p>'+
    '</div>';
  bindPayUI(p,function(){ onLifePay(p); });
  syncPayBtn(p);
  var back=$('#payBack');
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
function onLifePay(host){
  var o=pendingOrder; if(!o) return;
  var ck=$('[data-pay-consent]',host);
  if(!ADMIN_OK&&!(ck&&ck.checked)){ payErr(host,'약관과 환불 제한 동의에 체크해 주세요.'); return; }
  if(ADMIN_OK){ o.payMode='admin'; completePayment(); return; }
  var c=payContactOf(host,o);
  if(c.err){ payErr(host,c.err); if(c.focus){ try{ c.focus(); }catch(e){} } return; }
  o.email=c.email; o.phone=c.phone; saveContact(c.email,c.phone);
  startPay({
    kind:'life', host:host, amount:o.price||39800, orderName:'사주봄 인생사주 리포트', order:o,
    customer:pgCustomer(o.name,c.email,c.phone),
    onSuccess:function(r){
      o.paymentId=r.paymentId||''; o.txId=r.txId||''; o.payMode='pg';
      completePayment();
    }
  });
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
  revealLifePanel();
  var b={name:order.name};
  $$('.step-body').forEach(function(x){ x.classList.remove('on'); });
  try{ $('#pdfSteps').style.display='none'; }catch(e){}
  var p=$('#pdfPay'); if(p){ p.classList.remove('on'); p.innerHTML=''; }
  var d=$('#pdfDone');
  if(!d) return;
  d.classList.add('on');
  lastOrder=order;
  d.innerHTML='<div class="done-box fade-in"><div class="ok">✓</div><h3>결제 및 접수가 완료되었습니다</h3>'+
    '<div class="num">접수번호 '+order.id+' · '+(order.payMode==='admin'?'관리자 접수':'결제 완료 '+won(order.price||39800))+'</div>'+
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
  if(t) t.textContent=(mode==='admin')?'관리자 검수함':'사주봄 · 내 인생사주 리포트';
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
        try{ doc.save('사주봄-인생사주-'+safeName(name)+'.pdf'); }
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
/* =====================================================================
   v53 · 우측 서랍 메뉴(≡)
   홈 · 인생사주 리포트 · 5대 테마 아코디언 · 마이페이지 · 문의하기
   ===================================================================== */
var drFocus=null;
function drSyncLock(){
  var any=false;
  ['#drawer','#mpModal','#ctModal','#lgModal'].forEach(function(s){ var e=$(s); if(e&&e.classList.contains('on')) any=true; });
  document.body.classList.toggle('dr-open',any);
}
/* 5대 테마 아코디언 — content.js의 테마·탭 순서를 그대로 따른다 */
function buildDrawerAcc(){
  var box=$('#drAcc');
  if(!box||!window.CT) return;
  var h='';
  for(var k in CT.THEMES){
    var th=CT.THEMES[k];
    h+='<li class="dr-item" data-theme="'+k+'">'+
         '<button type="button" class="dr-theme" aria-expanded="false" aria-controls="drSub-'+k+'">'+
           '<span class="th"><i class="ha" aria-hidden="true">'+(THEME_HA[k]||'')+'</i>'+(th.short||th.name)+'</span>'+
           '<span class="car" aria-hidden="true"></span>'+
         '</button>'+
         '<ul class="dr-subs" id="drSub-'+k+'">'+
           th.tabs.map(function(t){
             return '<li><button type="button" class="dr-sub" data-theme="'+k+'" data-tab="'+t+'" data-dr-sub="1">'+esc(CT.TABS[t].pill||CT.TABS[t].name)+'</button></li>';
           }).join('')+
         '</ul></li>';
  }
  box.innerHTML=h;
}
function drSetAcc(li,open){
  var subs=li.querySelector('.dr-subs'), btn=li.querySelector('.dr-theme');
  if(!subs||!btn) return;
  var was=li.classList.contains('open');
  li.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',open?'true':'false');
  if(open===was) return;
  if(open){
    subs.style.height=subs.scrollHeight+'px';
    var done=function(e){
      if(e&&e.target!==subs) return;
      subs.removeEventListener('transitionend',done);
      if(li.classList.contains('open')) subs.style.height='auto';
    };
    subs.addEventListener('transitionend',done);
  }else{
    subs.style.height=subs.scrollHeight+'px';
    void subs.offsetHeight;
    subs.style.height='0px';
  }
}
function openDrawer(){
  var dr=$('#drawer'), veil=$('#drVeil'), mb=$('#menuBtn');
  if(!dr) return;
  drFocus=document.activeElement;
  if(veil){ veil.classList.add('on'); veil.setAttribute('aria-hidden','false'); }
  dr.classList.add('on'); dr.setAttribute('aria-hidden','false');
  if(mb) mb.setAttribute('aria-expanded','true');
  drSyncLock();
  try{ $('#drClose').focus({preventScroll:true}); }catch(e){}
}
function closeDrawer(focusBack){
  var dr=$('#drawer'), veil=$('#drVeil'), mb=$('#menuBtn');
  if(!dr||!dr.classList.contains('on')) return;
  dr.classList.remove('on'); dr.setAttribute('aria-hidden','true');
  if(veil){ veil.classList.remove('on'); veil.setAttribute('aria-hidden','true'); }
  if(mb) mb.setAttribute('aria-expanded','false');
  drSyncLock();
  if(focusBack!==false){
   var to=(drFocus&&drFocus.focus)?drFocus:mb;
   try{ to.focus({preventScroll:true}); }catch(e){}
  }
}
/* 서랍에서 고른 탭으로 바로 이동 — 테마를 세우고 그 탭을 연 뒤 탭 카드로 스크롤 */
function drJump(themeKey,tabKey){
  var th=CT.THEMES[themeKey]; if(!th) return;
  state.theme=themeKey;
  state.tab=(tabKey&&th.tabs.indexOf(tabKey)>=0)?tabKey:th.tabs[0];
  $$('.tp-card').forEach(function(b){
    var on=b.getAttribute('data-theme')===state.theme;
    b.classList.toggle('on',on); b.setAttribute('aria-selected',on?'true':'false');
  });
  var cb=$('#ctxBlock');
  if(cb) cb.style.display=fieldsFor(state.theme,state.tab).ctx?'block':'none';
  renderTabs();
  var rv=$('#resultView'); if(rv) rv.innerHTML='';
  setTrack('read');
  setTimeout(function(){
    try{
      /* v55 · 배너를 걷어낸 뒤에는 5대 테마 탭이 상단 바에 가리지 않도록 탭 줄을 기준으로 앉힌다 */
      var tv=$('.v8-pick')||$('.v8-tpanel')||$('#themeView');
      var ty=tv.getBoundingClientRect().top+window.pageYOffset-128;
      window.scrollTo({top:ty<0?0:ty,behavior:'smooth'});
    }catch(e){}
  },90);
}
function drGo(what){
  closeDrawer(false);
  if(what==='home'){
    /* v56d · ‘홈’은 맨 위로 스크롤이 아니라 첫 대문(인트로 영상) 화면을 다시 연다 */
    setTrack('read');
    if(window.GATE&&window.GATE.open){ window.GATE.open(); return; }
    try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){ window.scrollTo(0,0); }
  }else if(what==='life'){
    setTrack('life');
  }else if(what==='mypage'){
    openMyPage();
  }else if(what==='contact'){
    openContact();
  }
}
/* ---------------- 마이페이지 ---------------- */
function fmtDay(iso){
  if(!iso) return '-';
  var d=new Date(iso);
  if(isNaN(d.getTime())) return String(iso).replace(/-/g,'.');
  return d.getFullYear()+'.'+pad2(d.getMonth()+1)+'.'+pad2(d.getDate());
}
function myPageHTML(){
  var os=orders(), paid=themeCredit(), em=savedEmail(), ph=savedPhone();
  var h='';
  h+='<div class="mp-sec"><h4>인생사주 리포트</h4>';
  if(os.length){
    h+=os.map(function(o){
      return '<div class="mp-ord">'+
        '<div class="n"><b>'+esc(o.name||'이름 없음')+'</b><span class="st">'+esc(o.status||'접수')+'</span></div>'+
        '<span class="m">'+esc(o.id||'-')+' · '+esc(fmtDay(o.at||o.paidAt||o.date))+'</span>'+
        '<div class="row"><span class="pr">'+won(o.price||39800)+'</span>'+
        '<button type="button" class="go" data-mp-open="'+esc(o.id||'')+'">리포트 열람</button></div>'+
      '</div>';
    }).join('');
  }else{
    h+='<p class="mp-empty">아직 신청한 리포트가 없습니다.</p>';
  }
  h+='</div>';

  h+='<div class="mp-sec"><h4>테마 풀이</h4>'+
     '<p class="mp-line"><span>테마 풀이 이용권</span><b class="'+(paid?'gold':'')+'">'+(paid?'보유 중':'없음')+'</b></p>'+
     (paid?'<p class="mp-line"><span>인생사주 리포트 결제가</span><b class="gold">35,900원</b></p>':'')+
     '</div>';

  h+='<div class="mp-sec"><h4>저장된 연락처</h4>';
  if(em||ph){
    if(em) h+='<p class="mp-line"><span>이메일</span><b>'+esc(em)+'</b></p>';
    if(ph) h+='<p class="mp-line"><span>연락처</span><b>'+esc(ph)+'</b></p>';
  }else{
    h+='<p class="mp-empty">리포트를 신청할 때 입력한 연락처가 여기에 저장됩니다.</p>';
  }
  h+='</div>';
  return h;
}
function bindMyPage(){
  $$('#mpBody [data-mp-open]').forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-mp-open'), list=orders(), o=null;
      for(var i=0;i<list.length;i++){ if(list[i].id===id){ o=list[i]; break; } }
      if(!o) return;
      lastOrder=o;
      closeMyPage(false);
      try{ openCustomerReport(); }catch(e){}
    });
  });
}
function openMyPage(){
  var m=$('#mpModal'), body=$('#mpBody');
  if(!m) return;
  if(body) body.innerHTML=myPageHTML();
  m.classList.add('on'); m.setAttribute('aria-hidden','false');
  drSyncLock(); bindMyPage();
  try{ $('#mpClose').focus({preventScroll:true}); }catch(e){}
}
function closeMyPage(focusBack){
  var m=$('#mpModal'); if(!m||!m.classList.contains('on')) return;
  m.classList.remove('on'); m.setAttribute('aria-hidden','true');
  drSyncLock();
  if(focusBack!==false){ try{ $('#menuBtn').focus({preventScroll:true}); }catch(e){} }
}
/* ---------------- 문의하기 ---------------- */
function openContact(){
  var m=$('#ctModal'); if(!m) return;
  m.classList.add('on'); m.setAttribute('aria-hidden','false');
  drSyncLock();
  try{ $('#ctClose').focus({preventScroll:true}); }catch(e){}
}
function closeContact(focusBack){
  var m=$('#ctModal'); if(!m||!m.classList.contains('on')) return;
  m.classList.remove('on'); m.setAttribute('aria-hidden','true');
  drSyncLock();
  if(focusBack!==false){ try{ $('#menuBtn').focus({preventScroll:true}); }catch(e){} }
}
/* ---------------- v73 · 이용약관 · 개인정보처리방침 · 환불규정 ---------------- */
var LG_DOCS={
  terms:{cap:'TERMS OF SERVICE',title:'이용약관',tpl:'lgTerms'},
  privacy:{cap:'PRIVACY POLICY',title:'개인정보처리방침',tpl:'lgPrivacy'},
  refund:{cap:'REFUND POLICY',title:'환불규정',tpl:'lgRefund'}
};
var lgReturnFocus=null;
function openLegal(key){
  var d=LG_DOCS[key]; if(!d) return;
  var m=$('#lgModal'), body=$('#lgBody'), tpl=document.getElementById(d.tpl);
  if(!m||!body||!tpl) return;
  body.innerHTML=tpl.innerHTML;
  body.scrollTop=0;
  if($('#lgCap')) $('#lgCap').textContent=d.cap;
  if($('#lgTitle')) $('#lgTitle').textContent=d.title;
  m.classList.add('on'); m.setAttribute('aria-hidden','false');
  drSyncLock();
  try{ $('#lgClose').focus({preventScroll:true}); }catch(e){}
}
function closeLegal(focusBack){
  var m=$('#lgModal'); if(!m||!m.classList.contains('on')) return;
  m.classList.remove('on'); m.setAttribute('aria-hidden','true');
  drSyncLock();
  if(focusBack!==false&&lgReturnFocus&&lgReturnFocus.focus){
    try{ lgReturnFocus.focus({preventScroll:true}); }catch(e){}
  }
}
function initLegal(){
  var m=$('#lgModal'); if(!m) return;
  $$('.ft-lk').forEach(function(b){
    b.addEventListener('click',function(){ lgReturnFocus=b; openLegal(b.getAttribute('data-doc')); });
  });
  if($('#lgClose')) $('#lgClose').addEventListener('click',function(){ closeLegal(); });
  m.addEventListener('click',function(e){ if(e.target&&e.target.id==='lgModal') closeLegal(); });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    if(m.classList.contains('on')) closeLegal();
  });
  /* ?doc=terms|privacy|refund — 심사·공유용 직렬 링크 */
  try{
    var mt=(location.search||'').match(/[?&]doc=(terms|privacy|refund)/);
    if(mt) setTimeout(function(){ openLegal(mt[1]); },80);
  }catch(e){}
}
function initDrawer(){
  var dr=$('#drawer'), mb=$('#menuBtn'), veil=$('#drVeil');
  if(!dr||!mb) return;
  buildDrawerAcc();
  mb.addEventListener('click',function(){ openDrawer(); });
  if($('#drClose')) $('#drClose').addEventListener('click',function(){ closeDrawer(); });
  if(veil) veil.addEventListener('click',function(){ closeDrawer(); });
  $$('.dr-link').forEach(function(b){
    b.addEventListener('click',function(){ drGo(b.getAttribute('data-dr')); });
  });
  var acc=$('#drAcc');
  if(acc) acc.addEventListener('click',function(e){
    var t=e.target;
    var th=t.closest?t.closest('.dr-theme'):null;
    if(th){
      var li=th.parentNode, open=!li.classList.contains('open');
      /* 한 번에 하나만 펼친다 */
      $$('.dr-item.open',acc).forEach(function(x){ if(x!==li) drSetAcc(x,false); });
      drSetAcc(li,open);
      return;
    }
    var sb=t.closest?t.closest('.dr-sub'):null;
    if(sb){
      closeDrawer(false);
      drJump(sb.getAttribute('data-theme'),sb.getAttribute('data-tab'));
    }
  });
  if($('#mpClose')) $('#mpClose').addEventListener('click',function(){ closeMyPage(); });
  if($('#mpModal')) $('#mpModal').addEventListener('click',function(e){ if(e.target&&e.target.id==='mpModal') closeMyPage(); });
  if($('#ctClose')) $('#ctClose').addEventListener('click',function(){ closeContact(); });
  if($('#ctModal')) $('#ctModal').addEventListener('click',function(e){ if(e.target&&e.target.id==='ctModal') closeContact(); });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    if(dr.classList.contains('on')) closeDrawer();
    else if($('#mpModal').classList.contains('on')) closeMyPage();
    else if($('#ctModal').classList.contains('on')) closeContact();
  });
}

/* ---------------- v54 · 첫 대문(게이트) ----------------
   들어오면 9:16 영상이 먼저 펼쳐지고, 버튼을 눌러 홈으로 들어간다.
   ?admin=1 · ?gate=0 · #life · 이미 본 세션에서는 머리의 인라인 스크립트가 no-gate 를 붙여 아예 뜨지 않는다. */
function initGate(){
  var g=$('#gate'), html=document.documentElement;
  if(!g) return;
  var vid=$('#gateVideo');
  var closed=true, hideTimer=0;

  /* v56d · 서랍의 ‘홈’에서도 이 대문을 다시 연다 — 열기/닫기를 함수로 나눠 둔다 */
  function open(){
    if(!closed) return;
    closed=false;
    if(hideTimer){ clearTimeout(hideTimer); hideTimer=0; }
    g.style.display='';
    g.style.animation='';
    g.classList.remove('gate-out');
    g.setAttribute('aria-hidden','false');
    html.classList.remove('no-gate');
    html.classList.add('gate-on');
    document.body.classList.add('lock');
    try{
      if(vid){
        /* v60 · 대문 영상은 대문이 실제로 열릴 때만 받는다 (돌아온 손님이 보지도 않을 1MB를 미리 받지 않게) */
        if(!vid.getAttribute('src')){
          var gs=vid.getAttribute('data-src')||'./assets/videos/gate.mp4';
          vid.setAttribute('src',gs);
          vid.setAttribute('preload','auto');
          try{ vid.load(); }catch(e){}
        }
        try{ vid.currentTime=0; }catch(e){}
        var pr=vid.play(); if(pr&&pr.catch) pr.catch(function(){});
      }
    }catch(e){}
    try{ g.focus({preventScroll:true}); }catch(e){}
  }
  function close(opt){
    if(closed) return; closed=true;
    opt=opt||{};
    if(opt.never){ try{ localStorage.setItem('cl_gate','off'); }catch(e){} }
    try{ sessionStorage.setItem('cl_gate_seen','1'); }catch(e){}
    try{ if(vid) vid.pause(); }catch(e){}
    html.classList.remove('gate-on');
    document.body.classList.remove('lock');
    g.style.animation='none';
    g.classList.add('gate-out');
    g.setAttribute('aria-hidden','true');
    if(hideTimer) clearTimeout(hideTimer);
    hideTimer=setTimeout(function(){ g.style.display='none'; html.classList.add('no-gate'); hideTimer=0; },600);
    if(opt.track==='life'){
      /* 인생사주 리포트로 바로 가면 인트로 영상은 받지 않는다 — 그쪽 소개 영상만 받는다 */
      setTimeout(function(){ setTrack('life'); },90);
    }else{
      try{ window.scrollTo(0,0); }catch(e){}
      /* v60 · 이제서야 인트로 영상에 대역폭을 준다 (게이트 클래스가 빠진 뒤에 불러야 실제로 받는다) */
      try{ resumeIntro(); }catch(e){}
    }
  }
  var bEnter=$('#gateEnter'), bLife=$('#gateLife'), bSkip=$('#gateSkip'), bNever=$('#gateNever');
  if(bEnter) bEnter.addEventListener('click',function(){ close(); });
  if(bLife) bLife.addEventListener('click',function(){ close({track:'life'}); });
  if(bSkip) bSkip.addEventListener('click',function(){ close(); });
  if(bNever) bNever.addEventListener('click',function(){ close({never:true}); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
  g.addEventListener('click',function(e){ if(e.target===g) close(); });   /* 영상 바깥(좌우 여백)을 누르면 닫기 */
  window.GATE={open:open,close:close};
  /* 첫 방문(대문을 아직 안 본 경우)에만 자동으로 펼친다 */
  if(!html.classList.contains('no-gate')) open();
}

window.APP={init:init,state:state};
document.addEventListener('DOMContentLoaded',function(){
  try{ init(); }catch(e){ if(window.console) console.error('init',e); }
});
})();
