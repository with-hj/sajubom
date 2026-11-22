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
     — 관리자 화면은 주소에 ?admin=1 이 있을 때만 열린다. 고객 화면에는 관리자 UI가 없다. */
  ADMIN_OK=/[?&]admin=1/.test(location.search);
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

  /* URL 파라미터 */
  try{
    if(/[?&]admin=1/.test(location.search)) openAdmin();
    if(/[?&]admin=1/.test(location.search)&&/[?&]book=sample/.test(location.search)) openBook(sampleEntry(),'admin');
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

/* ---------------- 트랙 ---------------- */
function setTrack(t){
  $$('.track-btn').forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-track')===t); });
  ['read','life'].forEach(function(k){
    var el=$('#track-'+k); if(el) el.classList.toggle('on',k===t);
  });
  try{
    var sec=$('#track-'+t);
    var ty=sec?sec.getBoundingClientRect().top+window.pageYOffset-122:0;
    window.scrollTo({top:ty<0?0:ty,behavior:'smooth'});
  }catch(e){}
}

/* ---------------- 테마 · 탭 ---------------- */
function renderThemes(){
  var box=$('#themeList'), h='';
  for(var k in CT.THEMES){
    var th=CT.THEMES[k];
    var on=(state.theme||'general')===k;
    h+='<button type="button" class="tp-card'+(on?' on':'')+'" data-theme="'+k+'" role="tab" aria-selected="'+(on?'true':'false')+'">'+
      '<span class="thumb"><img src="./assets/themes-web/t-'+(th.img||k)+'.jpg" alt="'+esc(th.name)+' 일러스트" width="240" height="240" loading="lazy"></span>'+
      '<span class="tx"><b>'+esc(th.short||th.name).replace(/\n/g,'<br>')+'</b><i>'+th.han+'</i></span></button>';
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
  h+='<div class="rh-meta">'+meta+'<br>'+R.y+'년 '+R.m+'월 '+R.d+'일 '+(input.cal==='lunar'?'음력':'양력')+' · '+(R.hasTime?solarNote(R,input):'시간 모름(시주 제외)')+'</div>';
  h+='</div>';

  h+='<div class="res-sum fade-in"><p><b>'+esc(name)+'</b> 님의 여덟 글자는 '+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주, 일간 '+S.STEM_HAN[R.dStem]+'('+S.STEM_KO[R.dStem]+')입니다. 오행은 <b>'+S.EL_KO[c.mostI]+'</b>이 가장 두텁고 <b>'+S.EL_KO[c.leastI]+'</b>이 가장 얇으며, 필요한 기운은 <b>'+S.EL_KO[c.yongEl]+'('+S.EL_HAN[c.yongEl]+')</b>입니다.</p>';
  h+='<p>'+S.DAY_MASTER[R.dStem][0]+'의 결로 태어나 '+S.GROUP_MEAN[c.topGrp]+' 이 사주의 중심 별은 <b>'+c.topGodInGrp+'</b>입니다. '+S.GOD_KEY[c.topGodInGrp]+'의 방식으로 살 때 가장 편안해집니다.</p>';
  if(input.ctx&&input.ctx.partnerErr) h+='<p style="color:#c94228">'+esc(input.ctx.partnerErr)+' — 내 사주만 읽었습니다.</p>';
  h+='</div>';

  /* ---------- 2장 무료 + 3장부터 흐림 결제 게이트 ---------- */
  var FREE=2, freeH='', lockH='', lockChars=0;
  for(var i=0;i<chapters.length;i++){
    var ch=chapters[i], body='';
    try{ body=ch.body(R,c,input,name); }catch(ex){ body='<p class="hint">이 장은 준비 중입니다.</p>'; if(window.console) console.error(ch.title,ex); }
    var sec='<section class="ch fade-in"><div class="ch-hd"><span class="ch-no">'+pad2(i+1)+'</span>'+
       '<div class="ch-t"><h3>'+ch.title+'</h3><div class="ch-s">'+ch.sub+'</div></div></div>'+
       '<div class="ch-bd">'+body+'</div></section>';
    if(i<FREE) freeH+=sec;
    else { lockH+=sec; lockChars+=body.replace(/<[^>]*>/g,'').replace(/\s+/g,'').length; }
  }
  if(freeH) h+='<div class="free-flag"><b>무료로 읽는 '+FREE+'장</b> · 사주 원국과 첫 풀이</div>'+freeH;
  if(lockH){
    var pwInfo={total:chapters.length,chars:lockChars,tab:T.name};
    h+='<div class="pw-wrap" id="pwWrap">'+
       '<div class="pw-locked" id="pwLocked">'+lockH+'</div>'+
       '<div class="pw-veil" id="pwVeil"><div class="pw-card" id="pwCard"></div></div></div>';
    window.__pwInfo=pwInfo;
  }
  h+='<div class="panel" style="margin-top:18px;text-align:center">'+
     '<h3 style="font-size:17px">'+(lockH?'평생의 흐름까지 이어서 보시겠어요':'여기까지가 '+esc(T.name)+'의 결입니다')+'</h3>'+
     '<p class="ph" style="margin-bottom:6px">테마별 풀이는 <b>9,900원</b> · 인생사주 리포트는 <b>69,900원</b>입니다.</p>'+
     '<p class="ph" style="margin-bottom:14px">같은 주제를 평생의 큰 흐름과 앞으로 10년·노후까지 풀어내면 <b>인생사주 리포트</b>로 이어서 보실 수 있습니다.</p>'+
     '<button type="button" class="btn btn-gold btn-block" data-goto-pdf>📜 인생사주 리포트 받아보기</button></div>';
  h=h.replace(/당신 님/g,'당신');
  $('#resultView').innerHTML=h;
  if($('#pwWrap')&&window.__pwInfo) bindPaywall(window.__pwInfo);
  $$('[data-goto-pdf]').forEach(function(b){ b.addEventListener('click',function(){ setTrack('life'); }); });
  try{ var rv=$('#resultView'); var y=rv.getBoundingClientRect().top+window.pageYOffset-146; window.scrollTo({top:y,behavior:'smooth'}); }catch(e){}
}
/* ---------- 결제 게이트(테스트) : 2장까지 무료, 3장부터 흐림 ---------- */
function pwBuyMarkup(info){
  return '<div class="pw-price">9,900원 · 전체 풀이</div>'+
    '<h3>여기서부터 전체 풀이가<br>펼쳐집니다</h3>'+
    '<p>이어지는 전체 풀이에서<br>'+esc(info.tab)+'의 나머지 결을 더 깊이 읽어보세요.</p>'+
    '<button type="button" class="btn btn-gold btn-block" id="pwBuy">9,900원 결제하고 전체 풀이 보기</button>'+
    '<p class="pw-note">테스트 사이트 — 결제 없이 전체 풀이가 열립니다</p>';
}
function pwConfirmMarkup(){
  return '<div class="pw-price">테스트 결제 · 9,900원</div>'+
    '<h3>결제 없이 열어볼까요?</h3>'+
    '<p>지금은 PG 연동 전 테스트 사이트입니다. <b>실제 결제는 이루어지지 않습니다.</b> 확인을 누르면 나머지 풀이가 바로 열립니다.</p>'+
    '<button type="button" class="btn btn-gold btn-block" id="pwDo">결제 없이 전체 풀이 열기</button>'+
    '<button type="button" class="pw-x" id="pwCancel">취소</button>';
}
function bindPaywall(info){
  var card=$('#pwCard'); if(!card) return;
  card.innerHTML=pwBuyMarkup(info);
  card.addEventListener('click',function(e){
    var t=e.target.closest('button'); if(!t) return;
    if(t.id==='pwBuy'){
      card.innerHTML=pwConfirmMarkup();
    } else if(t.id==='pwDo'){
      unlockReading();
    } else if(t.id==='pwCancel'){
      card.innerHTML=pwBuyMarkup(info);
    }
  });
}
function unlockReading(){
  var locked=$('#pwLocked'), veil=$('#pwVeil'), wrap=$('#pwWrap');
  if(locked) locked.classList.add('open');
  if(veil&&veil.parentNode) veil.parentNode.removeChild(veil);
  if(wrap&&!$('.pw-open-flag')){
    var flag=document.createElement('div');
    flag.className='pw-open-flag';
    flag.innerHTML='<b>전체 풀이가 열렸습니다</b> · 테스트 결제 9,900원';
    wrap.parentNode.insertBefore(flag,wrap);
  }
  try{ if(wrap) wrap.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){}
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
  lastOrder=order;
  d.innerHTML='<div class="done-box fade-in"><div class="ok">✓</div><h3>접수가 완료되었습니다</h3>'+
    '<div class="num">접수번호 '+order.id+'</div>'+
    '<p>'+esc(b.name)+' 님의 원국을 검수한 뒤, 영업일 2~3일 안에 책자형 PDF를 '+esc(email)+'으로 보내드립니다.</p>'+
    '<p>지금 바로 리포트를 펼쳐보고 PDF 파일로 저장하실 수 있습니다.</p>'+
    '<button type="button" class="btn btn-gold btn-block" style="margin-top:14px" data-cust-view>내 인생사주 리포트 보기</button>'+
    '<button type="button" class="btn btn-verm btn-block" style="margin-top:8px" data-cust-pdf>PDF 파일 다운로드</button>'+
    '<p class="pdf-note">PDF는 이 기기의 다운로드 폴더로 저장됩니다. 인앱 브라우저에서 저장이 안 될 경우 Safari/Chrome으로 열어주세요.</p>'+
    '<button type="button" class="btn btn-line btn-block" style="margin-top:10px" data-goto-top>처음으로</button></div>';
  $$('[data-cust-view]').forEach(function(x){ x.addEventListener('click',function(){ openCustomerReport(); }); });
  $$('[data-cust-pdf]').forEach(function(x){ x.addEventListener('click',function(){ openCustomerReport(function(){ downloadBookPdf(); }); }); });
  $$('[data-goto-top]').forEach(function(x){ x.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); }); });
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
  if(t) t.textContent=(mode==='admin')?'管理 · 관리자 검수함':'천령당 · 내 인생사주 리포트';
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
        'A4 '+res.pages+'장 · 원국 '+S.STEM_HAN[R.dStem]+S.BR_HAN[R.dBranch]+'일주';
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
    prog('PDF를 만들지 못했습니다',0,'네트워크가 막혔거나 인앱 브라우저일 수 있습니다. Safari/Chrome으로 열어 다시 시도하시거나 인쇄하기를 이용해 주세요.');
    setTimeout(progOff,4200);
  });
}
function makePdf(host,name){
  return new Promise(function(resolve,reject){
    var pages=[].slice.call(host.querySelectorAll('.pg'));
    var total=pages.length;
    if(!total){ reject(new Error('empty book')); return; }
    var jsPDF=window.jspdf.jsPDF;
    var doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    var scale=(window.innerWidth<560)?1.45:1.75;
    var i=0;
    host.classList.add('pdf-shot');
    function finish(){
      try{ host.classList.remove('pdf-shot'); }catch(e){}
      prog('파일을 저장하고 있어요…',0.99,'');
      setTimeout(function(){
        try{ doc.save('천령당-인생사주-'+safeName(name)+'.pdf'); }
        catch(e){ reject(e); return; }
        prog('PDF가 저장되었습니다',1,'다운로드 폴더에서 확인해 주세요. 인앱 브라우저에서는 저장 위치가 다를 수 있습니다.');
        setTimeout(progOff,1500);
        resolve(true);
      },140);
    }
    function step(){
      if(i>=total){ finish(); return; }
      prog('PDF 생성 중 ('+(i+1)+'/'+total+')…', i/total, '이 화면을 닫지 마세요. 보통 1~2분 걸립니다.');
      window.html2canvas(pages[i],{scale:scale,backgroundColor:'#F6F1E7',useCORS:true,logging:false,removeContainer:true}).then(function(cv){
        var img=cv.toDataURL('image/jpeg',0.86);
        if(i>0) doc.addPage('a4','portrait');
        doc.addImage(img,'JPEG',0,0,210,295);
        try{ cv.width=0; cv.height=0; }catch(e){}
        i++;
        setTimeout(step,16);
      }).catch(function(e){
        host.classList.remove('pdf-shot');
        reject(e);
      });
    }
    var go=function(){ setTimeout(step,60); };
    if(document.fonts&&document.fonts.ready){ document.fonts.ready.then(go); } else { go(); }
  });
}

window.APP={init:init,state:state};
document.addEventListener('DOMContentLoaded',function(){
  try{ init(); }catch(e){ if(window.console) console.error('init',e); }
});
})();
