/* =====================================================================
   천령당(天靈堂) — 정밀 해석 코어 (v31)
   · 네 기둥 사이의 합·충·형·파·해·원진·공망을 실제 글자로 찾아 문장화
   · 지장간 · 십이운성 · 신살(도화·역마·화개·천을·문창·금여·양인·백호·괴강·홍염)
   · 신강·신약의 근거(득령·득지·득세·통근), 용신·희신·기신·구신
   · 문서운·부동산 취득운(인성·재성·관성·토의 구조, 해·월 타이밍)
   기존 KASI 만세력 계산(engine.js)은 건드리지 않고, 그 결과 위에 얹습니다.
   ===================================================================== */
(function(){
'use strict';
var S=window.SJ;
if(!S) return;
var mod=S.mod;

/* ---------------------------------------------------------------- 기본 표 */
/* engine.js 안의 옛 헬퍼(tagEl 등)가 참조하는 elColor — 없으면 보정 */
try{ if(typeof window.elColor!=='function') window.elColor=function(i){ return S.EL_COLOR[i]; }; }catch(e){}
var STEM_HAN=S.STEM_HAN, STEM_KO=S.STEM_KO, BR_HAN=S.BR_HAN, BR_KO=S.BR_KO;
var STEM_EL=S.STEM_EL, BR_EL=S.BR_EL, EL_KO=S.EL_KO, EL_HAN=S.EL_HAN;
var GOD_GROUP=S.GOD_GROUP, tenGod=S.tenGod;

var HIDDEN=[[9],[5,9,7],[0,2,4],[1],[4,1,9],[2,4,6],[3,5],[5,3,1],[6,8,4],[7],[4,7,3],[8,0]];
var HIDDEN_LABEL=['정기','중기','여기'];

var STAGE12=['장생','목욕','관대','임관','제왕','쇠','병','사','묘','절','태','양'];
var STAGE_START=[11,5,2,9,2,9,5,0,8,3];
var STAGE_MEAN={
 '장생':'새로 시작하는 자리. 배우고 자라는 힘이 있어 처음엔 느리지만 오래 갑니다.',
 '목욕':'물에 몸을 담근 자리. 감정의 기복이 크고 인연이 잦습니다.',
 '관대':'예복을 갖춰 입은 자리. 사람 앞에 서는 힘과 사회성이 살아납니다.',
 '임관':'자리를 맡은 자리. 책임과 권한이 함께 오고 조직에서 평가받습니다.',
 '제왕':'기운이 정점인 자리. 밀어붙이는 힘이 세고 고집도 함께 옵니다.',
 '쇠':'한 번 꺾인 자리. 경험으로 사람을 살피는 눈이 생깁니다.',
 '병':'기운이 얇은 자리. 예민해지고 배려가 깊어집니다.',
 '사':'끝을 정리하는 자리. 결단이 빠르고 미련이 적습니다.',
 '묘':'창고에 넣어둔 자리. 생각이 깊고 혼자 있는 시간이 필요합니다.',
 '절':'끊어진 자리. 변화가 잦고 새 판을 여는 힘이 있습니다.',
 '태':'씨앗의 자리. 아직 드러나지 않았지만 가능성이 큽니다.',
 '양':'기르는 자리. 받아들이고 돌보는 힘이 있습니다.'
};

/* 지지 관계 */
var YUK={0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6};
var CHUNG={0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
var SAMHAP=[[8,0,4],[11,3,7],[2,6,10],[5,9,1]];
var SAMHAP_EL=[4,0,1,3];          /* 신자진=수, 해묘미=목, 인오술=화, 사유축=금 */
var BANGHAP=[[2,3,4],[5,6,7],[8,9,10],[11,0,1]];
var BANGHAP_EL=[0,1,3,4];
var HYUNG=[[2,5],[5,8],[8,2],[1,7],[7,10],[10,1],[0,3],[3,0]];
var JA_HYUNG=[4,6,9,11];
var PA=[[0,9],[9,0],[3,6],[6,3],[4,1],[1,4],[7,10],[10,7],[2,11],[11,2],[5,8],[8,5]];
var HAE=[[0,7],[7,0],[1,6],[6,1],[2,5],[5,2],[3,4],[4,3],[8,11],[11,8],[9,10],[10,9]];
var WONJIN=[[0,7],[7,0],[1,6],[6,1],[2,9],[9,2],[3,8],[8,3],[4,11],[11,4],[5,10],[10,5]];
var STEM_HAP=[[0,5,2],[1,6,3],[2,7,4],[3,8,0],[4,9,1]];  /* [a,b,합화 오행] */
var STEM_CHUNG=[[0,6],[1,7],[2,8],[3,9]];

var REL_MEAN={
 '육합':'서로 묶여 생활의 리듬이 붙는 자리',
 '삼합':'같은 방향을 볼 때 힘이 커지는 자리',
 '방합':'계절이 겹쳐 한쪽 기운이 커지는 자리',
 '충':'정면으로 부딪혀 판이 흔들리는 자리',
 '형':'일이 얽히고 서류가 꼬이는 자리',
 '파':'묶여 있던 것이 끊기는 자리',
 '해':'말이 오해로 번지는 자리',
 '원진':'이유 없이 서운해지는 자리',
 '동일':'같은 기운이 겹쳐 장단점이 함께 커지는 자리'
};

/* 신살 표 */
var SAL={
 dohwa:{name:'도화',han:'桃花',by:'일지 삼합',val:{0:9,1:6,2:3,3:0},
   txt:'사람의 눈을 끄는 힘. 말하지 않아도 분위기로 먼저 기억됩니다. 인연이 잦은 대신 호감과 인연을 구분해야 합니다.'},
 yeokma:{name:'역마',han:'驛馬',by:'일지 삼합',val:{0:2,1:11,2:8,3:5},
   txt:'움직이는 힘. 이사·여행·이직이 잦고 한자리에 머무는 것이 오히려 어색합니다.'},
 hwagae:{name:'화개',han:'華蓋',by:'일지 삼합',val:{0:4,1:1,2:10,3:7},
   txt:'혼자 깊어지는 힘. 사람들 사이에 있어도 한 걸음 물러나 있는 시간이 필요하고, 그 시간에 만든 것이 자산이 됩니다.'},
 geumyeo:{name:'금여',han:'金輿',by:'일간',val:[4,5,7,8,7,8,10,11,1,2],
   txt:'재물과 문서가 따라오는 자리. 집·차·보증금처럼 형태가 남는 재산과 인연이 깊습니다.'},
 yangin:{name:'양인',han:'羊刃',by:'일간',val:[3,4,6,7,6,7,9,10,0,1],
   txt:'밀어붙이는 힘. 돈과 자산을 크게 움직이지만, 계약에서 강하게 나가면 다툼이 남습니다.'},
 munchang:{name:'문창',han:'文昌',by:'일간',val:[5,6,8,9,8,9,11,0,2,3],
   txt:'배움과 글의 재능. 기록·설명·자격에서 힘이 납니다. 문서를 직접 쓰는 일이 유리합니다.'},
 hongyeom:{name:'홍염',han:'紅艶',by:'일간',val:[6,8,2,7,4,4,10,9,0,8],
   txt:'분위기로 사람을 끄는 힘. 관계의 온도가 높아 감정 소모도 함께 큽니다.'}
};
var CHEONUL={0:[1,7],4:[1,7],6:[1,7],1:[0,8],5:[0,8],2:[11,9],3:[11,9],8:[3,5],9:[3,5],7:[2,6]};
var BAEKHO=[[0,4],[1,7],[2,10],[3,1],[4,4],[8,10],[9,1]];
var GOEGANG=[[6,4],[6,10],[8,4],[8,10],[4,10]];

/* ---------------------------------------------------------------- 도구 */
function idxOf(stem,branch){
  for(var i=0;i<60;i++) if(i%10===stem&&i%12===branch) return i;
  return null;
}
function stT(s){ return STEM_KO[s]+'('+STEM_HAN[s]+')'; }
function brT(b){ return BR_KO[b]+'('+BR_HAN[b]+')'; }
function ganzhiOf(ix){ return STEM_KO[ix%10]+BR_KO[ix%12]+'('+STEM_HAN[ix%10]+BR_HAN[ix%12]+')'; }
function j(s,pair){ return S.josaP(String(s),pair); }
function elTxt(i){ return EL_KO[i]+'('+EL_HAN[i]+')'; }
function stage12(stem,branch){
  var st=STAGE_START[stem];
  var idx=(stem%2===0)?mod(branch-st,12):mod(st-branch,12);
  return STAGE12[idx];
}
function hasPair(tbl,a,b){
  for(var i=0;i<tbl.length;i++){
    if(tbl[i].length===2&&tbl[i][0]===a&&tbl[i][1]===b) return true;
    if(tbl[i].length===3&&tbl[i].indexOf(a)>=0&&tbl[i].indexOf(b)>=0) return true;
  }
  return false;
}
/* 세 글자가 모여야 성립하는 삼합·방합 — 두 글자만으로는 '반합'이라 단정하지 않는다 */
function tripleWith(live,b){
  var hits=[];
  [['삼합',SAMHAP],['방합',BANGHAP]].forEach(function(g){
    g[1].forEach(function(set){
      if(set.indexOf(b)<0) return;
      var have=[];
      live.forEach(function(p){ if(p.branch!==b&&set.indexOf(p.branch)>=0) have.push(p.pos); });
      if(have.length>=2) hits.push({type:g[0],pos:have.join('·'),pair:set.map(function(x){return BR_HAN[x];}).join('')});
    });
  });
  return hits;
}
/* 두 지지의 관계 — 강한 것부터 하나만 */
function relType(a,b){
  if(YUK[a]===b) return '육합';
  if(CHUNG[a]===b) return '충';
  if(a===b&&JA_HYUNG.indexOf(a)>=0) return '형';
  if(hasPair(HYUNG,a,b)) return '형';
  if(hasPair(PA,a,b)) return '파';
  if(hasPair(HAE,a,b)) return '해';
  if(hasPair(WONJIN,a,b)) return '원진';
  if(a===b) return '동일';
  return '';
}
function relWeight(t){
  return t==='충'?-2.2:t==='형'?-1.4:t==='파'?-1.2:t==='해'?-0.8:t==='원진'?-0.6:
         (t==='육합'?1.6:t==='삼합'?1.8:t==='방합'?1.2:0);
}
/* 공망 — 일주(그리고 년주) 기준 旬空 두 글자 */
function gongmangBranches(ix){
  var xun=Math.floor(ix/10);
  return [mod(10+xun*10,12),mod(11+xun*10,12)];
}

/* ---------------------------------------------------------------- 기둥 목록 */
function pillarsOf(R){
  var out=[];
  var defs=[
    ['년주','year',R.yIdx,'0~15세 · 뿌리','조상과 태어난 환경'],
    ['월주','month',R.mIdx,'16~30세 · 사회 초년','부모와 직업의 재료'],
    ['일주','day',R.dIdx,'31~45세 · 나와 배우자','나와 배우자궁'],
    ['시주','hour',R.hIdxP,'46세 이후 · 결실','자녀와 말년']
  ];
  for(var i=0;i<defs.length;i++){
    var d=defs[i];
    if(d[2]==null){ out.push({pos:d[0],key:d[1],ix:null,range:d[3],role:d[4]}); continue; }
    var s=d[2]%10,b=d[2]%12;
    out.push({
      pos:d[0],key:d[1],ix:d[2],range:d[3],role:d[4],
      stem:s,branch:b,gz:ganzhiOf(d[2]),
      sGod:S.tenGod(R.dStem,s), bGod:S.tenGod(R.dStem,(S.BR_MAIN?S.BR_MAIN[b]:[9,5,0,1,4,2,3,5,6,7,4,8][b])),
      sEl:STEM_EL[s], bEl:BR_EL[b],
      stage:stage12(R.dStem,b),
      hidden:HIDDEN[b].map(function(h,hi){ return {stem:h,god:S.tenGod(R.dStem,h),label:HIDDEN_LABEL[hi]||''}; })
    });
  }
  return out;
}

/* ---------------------------------------------------------------- 정밀 객체 */
function buildDeep(R){
  var c=S.chartCtx(R);
  var ps=pillarsOf(R);
  var live=ps.filter(function(p){ return p.ix!=null; });

  /* 1. 기둥 사이 관계 */
  var branchRels=[], stemRels=[];
  for(var i=0;i<live.length;i++) for(var k=i+1;k<live.length;k++){
    var A=live[i],B=live[k];
    var t=relType(A.branch,B.branch);
    if(t) branchRels.push({a:A.pos,b:B.pos,aBr:A.branch,bBr:B.branch,type:t,
      pair:BR_HAN[A.branch]+BR_HAN[B.branch],mean:REL_MEAN[t],w:relWeight(t)});
    if(A.stem===B.stem&&A.key!=='day'&&B.key!=='day')
      stemRels.push({a:A.pos,b:B.pos,type:'동일',pair:STEM_HAN[A.stem]});
    for(var h=0;h<STEM_HAP.length;h++){
      if((A.stem===STEM_HAP[h][0]&&B.stem===STEM_HAP[h][1])||(A.stem===STEM_HAP[h][1]&&B.stem===STEM_HAP[h][0])){
        var he=STEM_HAP[h][2];
        stemRels.push({a:A.pos,b:B.pos,type:'천간합',pair:STEM_HAN[A.stem]+STEM_HAN[B.stem]+'합',
          el:he,mean:'천간이 합해 '+elTxt(he)+'으로 묶입니다. 두 자리의 일이 한 덩어리로 움직이고, 그 기운이 생활의 재료가 됩니다.'});
      }
    }
    for(var q=0;q<STEM_CHUNG.length;q++){
      if((A.stem===STEM_CHUNG[q][0]&&B.stem===STEM_CHUNG[q][1])||(A.stem===STEM_CHUNG[q][1]&&B.stem===STEM_CHUNG[q][0]))
        stemRels.push({a:A.pos,b:B.pos,type:'천간충',pair:STEM_HAN[A.stem]+STEM_HAN[B.stem]+'충',
          mean:'천간이 부딪힙니다. 겉으로 드러나는 태도와 속의 계산이 어긋나 보이는 자리입니다.'});
    }
  }

  /* 1-2. 세 글자가 모인 삼합·방합 */
  [['삼합',SAMHAP],['방합',BANGHAP]].forEach(function(g){
    g[1].forEach(function(set){
      var hits=live.filter(function(p){ return set.indexOf(p.branch)>=0; });
      var seen={}, uniq=[];
      hits.forEach(function(p){ if(!seen[p.branch]){ seen[p.branch]=1; uniq.push(p); } });
      if(uniq.length>=3){
        branchRels.push({a:uniq[0].pos,b:uniq[1].pos,aBr:uniq[0].branch,bBr:uniq[1].branch,
          type:g[0],pair:set.map(function(x){return BR_HAN[x];}).join(''),
          mean:(g[0]==='삼합'?'세 글자가 모여 한 방향의 힘이 완성됐습니다. 그 기운이 생활의 중심축이 됩니다.':'세 글자가 같은 계절로 모여 그 오행이 크게 자랍니다. 한쪽으로 기울기 쉬운 대신 추진력이 큽니다.'),
          w:g[0]==='삼합'?2.4:2.0});
      }
    });
  });

  /* 2. 공망 (일주 기준 · 년주 기준) */
  var gmDay=gongmangBranches(R.dIdx), gmYear=gongmangBranches(R.yIdx);
  var gmHits=[];
  live.forEach(function(p){
    if(gmDay.indexOf(p.branch)>=0) gmHits.push({pos:p.pos,br:p.branch,from:'일주'});
    if(p.key!=='year'&&gmYear.indexOf(p.branch)>=0) gmHits.push({pos:p.pos,br:p.branch,from:'년주'});
  });
  var gmGods=live.filter(function(p){ return gmDay.indexOf(p.branch)>=0; })
                 .map(function(p){ return {pos:p.pos,god:p.bGod,grp:GOD_GROUP[p.bGod]}; });

  /* 3. 신살 */
  var sals=[];
  var base=0, brs=[R.yIdx%12,R.mIdx%12,R.dBranch];
  if(R.hIdxP!=null) brs.push(R.hIdxP%12);
  var samBase=(function(b){
    var h=BR_HAN[b];
    if('신자진'.indexOf(h)>=0) return 0;
    if('사유축'.indexOf(h)>=0) return 1;
    if('인오술'.indexOf(h)>=0) return 2;
    return 3;
  })(R.dBranch);
  var posName={};
  posName[0]='년지'; posName[1]='월지'; posName[2]='일지'; if(brs[3]!=null) posName[3]='시지';
  for(var bi=0;bi<brs.length;bi++){
    var br=brs[bi], pn=posName[bi];
    ['dohwa','yeokma','hwagae'].forEach(function(k){
      if(SAL[k].val[samBase]===br) sals.push({key:k,name:SAL[k].name,han:SAL[k].han,pos:pn,br:br,txt:SAL[k].txt,strong:(pn==='일지'||pn==='월지')});
    });
  }
  ['geumyeo','yangin','munchang','hongyeom'].forEach(function(k){
    for(var b2=0;b2<brs.length;b2++){
      if(SAL[k].val[R.dStem]===brs[b2]){
        var ok=true;
        for(var z=0;z<sals.length;z++) if(sals[z].key===k&&sals[z].br===brs[b2]) ok=false;
        if(ok) sals.push({key:k,name:SAL[k].name,han:SAL[k].han,pos:posName[b2],br:brs[b2],txt:SAL[k].txt,strong:(posName[b2]==='일지'||posName[b2]==='월지')});
      }
    }
  });
  (CHEONUL[R.dStem]||[]).forEach(function(cb){
    for(var b3=0;b3<brs.length;b3++){
      if(brs[b3]===cb&&!sals.some(function(x){return x.key==='cheonul';}))
        sals.push({key:'cheonul',name:'천을귀인',han:'天乙貴人',pos:posName[b3],br:cb,
          txt:'막힐 때 사람이 나타나는 자리. 결정적인 순간에 예상하지 못한 사람이 손을 내밉니다.',strong:true});
    }
  });
  BAEKHO.forEach(function(p){ if(R.dStem===p[0]&&R.dBranch===p[1])
    sals.push({key:'baekho',name:'백호',han:'白虎',pos:'일주',br:R.dBranch,
      txt:'강하게 부딪히는 힘. 몸을 쓰는 일·의료·현장에서 재능이 나지만, 사고와 수술을 조심해야 합니다.',strong:true}); });
  GOEGANG.forEach(function(p){ if(R.dStem===p[0]&&R.dBranch===p[1])
    sals.push({key:'goegang',name:'괴강',han:'魁罡',pos:'일주',br:R.dBranch,
      txt:'판을 뒤집는 힘. 남이 못 하는 일을 해내지만, 관계에서 강하게 밀면 사람을 잃습니다.',strong:true}); });

  /* 4. 신강·신약 근거 */
  var resEl=mod(R.dayEl+4,5);
  var mEl=BR_EL[R.mIdx%12];
  var deukRyeong=(mEl===R.dayEl||mEl===resEl);
  var dBEl=BR_EL[R.dBranch];
  var deukJi=(dBEl===R.dayEl||dBEl===resEl);
  var supportStems=0;
  live.forEach(function(p){ if(p.key==='day') return;
    if(p.sEl===R.dayEl||p.sEl===resEl) supportStems++; });
  var deukSe=supportStems>=2;
  var roots=[];
  live.forEach(function(p){
    HIDDEN[p.branch].forEach(function(h){
      if(STEM_EL[h]===STEM_EL[R.dStem]&&roots.indexOf(p.pos)<0) roots.push(p.pos);
    });
  });
  var drain=0; /* 일간을 빼앗는 글자 수 */
  live.forEach(function(p){
    if(p.sEl!==R.dayEl&&p.sEl!==resEl) drain+=1;
    if(p.bEl!==R.dayEl&&p.bEl!==resEl) drain+=1;
  });

  /* 5. 용신 계열 */
  var yong=c.yongEl;
  var heesin=mod(yong+4,5), gisin=mod(yong+3,5), gusin=mod(yong+2,5);

  /* 6. 문서 · 부동산 — deepOf에서 deep이 R에 붙은 뒤 계산합니다(해·달 읽기가 deep을 다시 참조하므로) */
  var docu=null;

  return {c:c,pillars:ps,live:live,branchRels:branchRels,stemRels:stemRels,
    gmDay:gmDay,gmYear:gmYear,gmHits:gmHits,gmGods:gmGods,sals:sals,
    deukRyeong:deukRyeong,deukJi:deukJi,deukSe:deukSe,supportStems:supportStems,
    roots:roots,drain:drain,yong:yong,heesin:heesin,gisin:gisin,gusin:gusin,docu:docu};
}
function deepOf(R){
  if(!R) return null;
  if(R.__deep) return R.__deep;
  var d=buildDeep(R);
  R.__deep=d;
  d.docu=buildDocu(R,d.c,{ps:d.live,gmDay:d.gmDay,gmHits:d.gmHits,sals:d.sals,branchRels:d.branchRels});
  return d;
}

/* ---------------------------------------------------------------- 문장 조각 */
function lineup(R){
  var d=deepOf(R);
  return d.live.map(function(p){
    return p.pos+' '+p.gz+' · '+p.sGod+'·'+p.bGod;
  }).join(' · ');
}
function interList(R){
  var d=deepOf(R), out=[];
  d.branchRels.forEach(function(r){
    out.push(r.a+' '+brT(r.aBr)+j(BR_KO[r.aBr],'와과')+' '+r.b+' '+brT(r.bBr)+' — '+r.type+'('+r.pair+'), '+r.mean+'.');
  });
  d.stemRels.forEach(function(r){
    out.push(r.a+'·'+r.b+' 천간 — '+r.type+'('+r.pair+'), '+r.mean+'.');
  });
  return out;
}
function interHTML(R){
  var d=deepOf(R);
  if(!d.branchRels.length&&!d.stemRels.length)
    return '<p>네 기둥 사이에 뚜렷한 합·충·형·파·해가 없습니다. 이 사주의 글자들은 서로 간섭하지 않고 <b>각자 제 몫</b>을 합니다. 그래서 운의 변화는 기둥 사이의 충돌보다 <b>세운·대운이 어느 자리에 들어오는지</b>로 읽습니다.</p>';
  var h='<ul>';
  d.branchRels.slice().sort(function(a,b){ return Math.abs(b.w)-Math.abs(a.w); }).forEach(function(r){
    h+='<li>'+r.a+' '+brT(r.aBr)+j(BR_KO[r.aBr],'와과')+' '+r.b+' '+brT(r.bBr)+' — <b>'+r.type+'</b>. '+r.mean+'.</li>';
  });
  d.stemRels.forEach(function(r){
    h+='<li>'+r.a+''+r.b+'의 천간 — <b>'+r.type+'</b>. '+r.mean+'</li>';
  });
  return h+'</ul>';
}
function gongmangText(R){
  var d=deepOf(R), gm=d.gmDay;
  var head='일주 '+ganzhiOf(R.dIdx)+'의 순(旬)에서 <b>'+BR_KO[gm[0]]+'('+BR_HAN[gm[0]]+')·'+BR_KO[gm[1]]+'('+BR_HAN[gm[1]]+')</b> 두 글자가 비어 있습니다(공망).';
  if(!d.gmHits.length) return head+' 이 사주의 기둥에는 그 두 글자가 없어, 공망이 실제 생활을 흔드는 자리는 크지 않습니다.';
  var t=d.gmHits.map(function(x){ return x.pos+' '+BR_KO[x.br]+'('+BR_HAN[x.br]+')'; }).join(', ');
  var lastBr=d.gmHits[d.gmHits.length-1].br;
  var gods=d.gmGods.map(function(g){ return g.god; });
  var mean='공망은 “없다”가 아니라 <b>그 자리의 것이 늦게 채워지거나, 마음처럼 남지 않는</b> 자리입니다.';
  if(gods.indexOf('정인')>=0||gods.indexOf('편인')>=0)
    mean+=' 특히 인성이 공망이면 <b>서류·계약·등기</b>에서 한 번 더 확인해야 합니다. 구두 약속이 문서로 남지 않으면 나중에 증명하기 어렵습니다.';
  if(gods.indexOf('정재')>=0||gods.indexOf('편재')>=0)
    mean+=' 재성이 공망이면 <b>들어온 돈이 손에 오래 남지 않는</b> 자리라, 받을 것은 그 자리에서 확정해야 합니다.';
  return head+' 이 사주는 '+t+j(BR_KO[lastBr],'이가')+' 공망에 걸립니다'+(gods.length?'('+gods.join('·')+')':'')+'. '+mean;
}
function sinsalHTML(R){
  var d=deepOf(R);
  if(!d.sals.length) return '<p>대표적인 신살이 뚜렷하게 걸리지 않았습니다. 신살이 없다는 것은 흠이 아니라, 삶의 결이 <b>사주 본연의 구조</b>로 더 또렷하게 드러난다는 뜻입니다.</p>';
  var order=['cheonul','geumyeo','munchang','dohwa','yeokma','hwagae','yangin','hongyeom','baekho','goegang'];
  var out=d.sals.slice().sort(function(a,b){ return order.indexOf(a.key)-order.indexOf(b.key); });
  var h='<ul>';
  out.forEach(function(s){
    h+='<li><b>'+s.name+'('+s.han+')</b> · '+s.pos+' '+BR_KO[s.br]+'('+BR_HAN[s.br]+') — '+s.txt+'</li>';
  });
  return h+'</ul>';
}
function strengthText(R){
  var d=deepOf(R);
  var yn=(R.strength==='강'?'강한 편(신강)':(R.strength==='약'?'약한 편(신약)':'중화에 가까운 편'));
  var parts=[];
  parts.push('태어난 달 '+brT(R.mIdx%12)+j(BR_KO[R.mIdx%12],'은는')+' '+elTxt(BR_EL[R.mIdx%12])+'의 계절이라 '+(d.deukRyeong?'일간의 뿌리가 되는 계절에 태어났습니다(득령)':'일간을 돕는 계절은 아닙니다(실령)'));
  parts.push('일지 '+brT(R.dBranch)+j(BR_KO[R.dBranch],'은는')+' '+(d.deukJi?'일간을 받쳐주는 자리입니다(득지)':'일간을 소모시키는 자리입니다'));
  parts.push('천간에서 나를 돕는 글자는 '+(d.supportStems?d.supportStems+'개로 힘을 보태는 편입니다(득세)':'없어 힘을 보태기엔 적습니다'));
  parts.push(d.roots.length?'지장간에 같은 오행의 뿌리가 '+d.roots.join('·')+'에 있습니다(통근)':'지장간에도 같은 오행의 뿌리가 없어 뿌리가 얕습니다(무근)');
  return '일간의 힘은 <b>'+yn+'</b>입니다. '+parts.join('. ')+'. 그래서 '+S.STRENGTH_TXT[R.strength].adv;
}
function yongText(R){
  var d=deepOf(R), c=d.c;
  var harship={0:'목',1:'화',2:'토',3:'금',4:'수'};
  var why=(R.strength==='약')
    ? '일간이 얇아 나를 낳아주는 <b>'+elTxt(d.yong)+'</b> 인성이 뿌리를 세워줍니다.'
    : (R.strength==='강'
      ? '일간이 넉넉해 넘치는 힘을 밖으로 내보내는 <b>'+elTxt(d.yong)+'</b> 식상이 약이 됩니다.'
      : '크게 기울지 않아 가장 얇은 <b>'+elTxt(d.yong)+'</b>을 채우는 것이 가장 효율적입니다.');
  return why+' 희신은 <b>'+elTxt(d.heesin)+'</b> — 용신을 낳아주는 기운, 기신은 <b>'+elTxt(d.gisin)+'</b> — 용신을 누르는 기운, 구신은 <b>'+elTxt(d.gusin)+'</b> — 용신이 낳아주느라 소모되는 기운입니다. 기신 '+EL_KO[d.gisin]+j(EL_KO[d.gisin],'이가')+' 세운·월운으로 들어오는 해·달에는 같은 노력도 결과가 늦게 오니, 계약과 지출을 그 시기에 몰지 마세요.';
}

/* ---------------------------------------------------------------- 해·달 읽기 */
function yearRead(R,y){
  var d=deepOf(R), c=d.c;
  var ix=mod(y-4,60), s=ix%10, b=ix%12;
  var g=tenGod(R.dStem,s), grp=GOD_GROUP[g];
  var sel=STEM_EL[s], bel=BR_EL[b];
  var rels=[];
  d.live.forEach(function(p){
    var t=relType(p.branch,b);
    if(t&&t!=='동일') rels.push({pos:p.pos,type:t});
  });
  tripleWith(d.live,b).forEach(function(h){ rels.push({pos:h.pos,type:h.type}); });
  var isGong=(d.gmDay.indexOf(b)>=0);
  var yong=(sel===d.yong||bel===d.yong), hee=(sel===d.heesin||bel===d.heesin),
      gi=(sel===d.gisin||bel===d.gisin), gu=(sel===d.gusin||bel===d.gusin);
  var score=0;
  if(grp==='재성') score+=2; if(grp==='관성') score+=1.5; if(grp==='식상') score+=1.5;
  if(grp==='인성') score+=1; if(grp==='비겁') score+=(R.strength==='강'?-1:0.5);
  if(yong) score+=2; if(hee) score+=1.5; if(gi) score-=2; if(gu) score-=0.5;
  rels.forEach(function(r){ score+=relWeight(r.type); });
  if(isGong) score-=1.2;
  var tone=score>=3?'open':(score<=-1.5?'hold':'mixed');
  var bits=[];
  bits.push(y+'년 '+ganzhiOf(ix)+' — 천간 '+stT(s)+j(STEM_KO[s],'은는')+' '+elTxt(sel)+j(EL_KO[sel],'은는')+' <b>'+g+'</b>, 지지 '+brT(b)+j(BR_KO[b],'은는')+' '+elTxt(bel)+j(EL_KO[bel],'은는')+' <b>'+S.tenGod(R.dStem,(S.BR_MAIN?S.BR_MAIN[b]:[9,5,0,1,4,2,3,5,6,7,4,8][b]))+'</b>입니다.');
  if(rels.length) bits.push('네 기둥과는 '+rels.map(function(r){ return r.pos+'와 '+r.type; }).join(', ')+'으로 만납니다.');
  else bits.push('네 기둥과는 크게 부딪히지도 묶이지도 않습니다.');
  bits.push(yong?'용신 '+EL_KO[d.yong]+'이 직접 들어와 막힌 것이 풀리는 해입니다.':(hee?'희신 '+EL_KO[d.heesin]+'이 들어와 용신을 받쳐줍니다.':(gi?'기신 '+EL_KO[d.gisin]+'이 들어오는 해라 벌인 일이 늦게 정리됩니다.':(gu?'구신 '+EL_KO[d.gusin]+'이 들어와 애쓴 만큼 남지 않기 쉬운 해입니다.':'용신도 기신도 직접 들어오지 않아 평소의 구조가 그대로 이어집니다.'))));
  if(isGong) bits.push('이 해의 지지 '+brT(b)+j(BR_KO[b],'은는')+' 공망이라 약속이 미뤄지거나 문서가 늦어질 수 있습니다.');
  return {y:y,ix:ix,gz:ganzhiOf(ix),stem:s,branch:b,g:g,grp:grp,sEl:sel,bEl:bel,
    rels:rels,isGong:isGong,yong:yong,hee:hee,gi:gi,gu:gu,score:score,tone:tone,
    why:bits.join(' '),
    short:(tone==='open'?'문이 열리는 해':(tone==='hold'?'버티는 해':'오르내리는 해'))};
}
function monthRead(R,y,m){
  var d=deepOf(R);
  var mp=S.monthPillarOf(y,m), s=mp.stem, b=mp.branch;
  var g=tenGod(R.dStem,s), grp=GOD_GROUP[g];
  var sel=STEM_EL[s], bel=BR_EL[b];
  var rels=[];
  d.live.forEach(function(p){ var t=relType(p.branch,b); if(t&&t!=='동일') rels.push({pos:p.pos,type:t}); });
  tripleWith(d.live,b).forEach(function(h){ rels.push({pos:h.pos,type:h.type}); });
  var sco=0;
  if(grp==='재성') sco+=1.5; if(grp==='관성') sco+=1; if(grp==='식상') sco+=1; if(grp==='인성') sco+=0.8;
  if(sel===d.yong||bel===d.yong) sco+=1.5;
  if(sel===d.heesin||bel===d.heesin) sco+=1;
  if(sel===d.gisin||bel===d.gisin) sco-=1.5;
  rels.forEach(function(r){ sco+=relWeight(r.type); });
  return {y:y,m:m,stem:s,branch:b,gz:ganzhiOf(mp.idx),g:g,grp:grp,rels:rels,score:sco,
    tone:sco>=2?'open':(sco<=-1?'hold':'mixed'),isGong:(d.gmDay.indexOf(b)>=0)};
}
function monthWhy(R,y,m){
  var r=monthRead(R,y,m);
  var bits=[y+'.'+(m<10?'0'+m:m)+' '+r.gz+' · '+r.g];
  if(r.rels.length) bits.push(r.rels.map(function(x){ return x.pos+'와 '+x.type; }).join('·'));
  return bits.join(' · ');
}

/* ---------------------------------------------------------------- 문서 · 부동산 */
function buildDocu(R,c,ctx){
  var ps=ctx.ps;
  var inCnt=c.grp['인성'], jaeCnt=c.grp['재성'], gwanCnt=c.grp['관성'], sikCnt=c.grp['식상'], biCnt=c.grp['비겁'];
  var jeong=c.gc['정인'], pyeon=c.gc['편인'], jeongjae=c.gc['정재'], pyeonjae=c.gc['편재'];
  var toCnt=R.count[2];
  var gmIn=ps.filter(function(p){ return ctx.gmDay.indexOf(p.branch)>=0&&GOD_GROUP[p.bGod]==='인성'; });
  var gmJae=ps.filter(function(p){ return ctx.gmDay.indexOf(p.branch)>=0&&GOD_GROUP[p.bGod]==='재성'; });
  var gongHits=ctx.gmHits||[];

  var inPos=[], jaePos=[], gwanPos=[];
  ps.forEach(function(p){
    if(GOD_GROUP[p.bGod]==='인성') inPos.push(p.pos+' '+BR_HAN[p.branch]);
    if(GOD_GROUP[p.bGod]==='재성') jaePos.push(p.pos+' '+BR_HAN[p.branch]);
    if(GOD_GROUP[p.bGod]==='관성') gwanPos.push(p.pos+' '+BR_HAN[p.branch]);
  });

  var score=50;
  score+= (inCnt===0?-14:(inCnt<=2?12:inCnt===3?4:-4));
  score+= (gwanCnt===0?-10:(gwanCnt<=2?10:4));
  score+= (jaeCnt===0?-12:(jaeCnt<=2?10:jaeCnt===3?4:-2));
  score+= (toCnt>=2?8:(toCnt===1?3:-2));
  score+= (R.strength==='강'?4:(R.strength==='약'?-4:2));
  var relW=0, relTxt=[];
  (ctx.branchRels||[]).forEach(function(r){ relW+=r.w; });
  score+=Math.max(-10,Math.min(10,relW*1.4));
  if(gmIn.length) score-=8;
  if(gmJae.length) score-=5;
  if(ctx.sals.some(function(s){return s.key==='geumyeo';})) score+=10;
  if(ctx.sals.some(function(s){return s.key==='yangin';})) score+=3;
  if(jeong>=2) score+=4;
  if(pyeonjae>=2&&R.strength==='약') score-=6;
  score=Math.max(8,Math.min(96,Math.round(score)));

  var grade=score>=72?'강한 편':(score>=58?'위험 없이 진행 가능한 편':(score>=44?'조건을 갖추면 가능한 편':'구조를 먼저 세워야 하는 편'));

  /* 유형별 적합도 */
  var types=[
    {k:'live',label:'실거주 매수',why:'',s:0},
    {k:'cheong',label:'청약·분양',why:'',s:0},
    {k:'rent',label:'수익형·임대',why:'',s:0},
    {k:'jeonse',label:'전세·보증금 계약',why:'',s:0}
  ];
  function setType(k,s,why){ types.forEach(function(t){ if(t.k===k){ t.s=Math.max(0,Math.min(99,Math.round(s))); t.why=why; } }); }
  setType('live', 40+ (jaeCnt*6)+(gwanCnt*5)+(inCnt*4)+(toCnt*4)+(R.strength==='약'?-10:4)+(gmIn.length?-8:0),
    (jaeCnt&&gwanCnt&&inCnt?'재성(실물)·관성(명의)·인성(등기)이 모두 있어 <b>사서 명의를 넘기는 순서</b>가 자연스럽습니다.':'세 요소 중 하나가 비어 있어, 매수는 가능하나 명의·자금 순서를 따로 챙겨야 합니다.'));
  setType('cheong', 40+(gwanCnt*7)+(inCnt*5)+(jeong*3)+(R.strength==='약'?-6:3)+(pyeonjae>=2?-6:0),
    (gwanCnt>=1?'관성이 있어 <b>공적 절차(청약·심사·자격)</b>에서 유리합니다. 서류를 직접 챙기는 인성도 힘이 됩니다.':'관성이 얇아 청약·심사 같은 절차에서 서류 누락이 생기기 쉬운 구조입니다.'));
  setType('rent', 40+(pyeonjae*6)+(sikCnt*5)+(biCnt*3)+(R.strength==='강'?8:-6)+(inCnt?4:0),
    (pyeonjae>=1?'편재가 있어 <b>돌아가는 현금(월세·임대)</b>을 다루는 감각이 있습니다.':'편재가 얇아 임대·수익형은 관리 부담이 먼저 커집니다.'));
  setType('jeonse', 40+(inCnt*6)+(gwanCnt*4)+(jeong*4)-(gongHits.length*6)-(gmIn.length*10)+(ctx.branchRels.some(function(r){return r.type==='충';})?-8:0),
    (gmIn.length?'인성이 공망이라 <b>보증금·계약서</b>에서 확인이 한 번 더 필요합니다.'
      :(gwanCnt===0?'관성이 없어 <b>등기·확정일자 확인</b>을 남에게 맡기면 위험합니다. 보증금 계약은 직접 확인하는 쪽이 맞습니다.'
      :'인성과 관성이 받쳐줘 계약서와 등기 확인만 지키면 보증금 사고는 적은 구조입니다.')));
  types.sort(function(a,b){ return b.s-a.s; });

  /* 해·달 타이밍 */
  var years=[];
  for(var yy=(R.seun&&R.seun[0])?R.seun[0].year:new Date().getFullYear(); yy<((R.seun&&R.seun[0])?R.seun[0].year:new Date().getFullYear())+6; yy++){
    var rd=yearRead(R,yy);
    var dscore=0, why=[];
    if(rd.grp==='인성'){ dscore+=3; why.push('인성(문서·등기)이 세운으로 들어옵니다'); }
    if(rd.grp==='재성'){ dscore+=2.5; why.push('재성(실물·자금)이 들어옵니다'); }
    if(rd.grp==='관성'){ dscore+=1.5; why.push('관성(명의·관청)이 함께 옵니다'); }
    if(rd.bEl===2||rd.sEl===2){ dscore+=1.5; why.push('토(土)의 기운이 들어와 부동산과 맞닿습니다'); }
    if(rd.yong){ dscore+=2; why.push('용신이 들어옵니다'); }
    if(rd.gi){ dscore-=2; why.push('기신이 들어와 서류가 늦어집니다'); }
    rd.rels.forEach(function(r){
      if(r.type==='합'||r.type==='육합'||r.type==='삼합'){ dscore+=1.4; why.push(r.pos+'와 '+r.type); }
      if(r.type==='충'){ dscore-=2.2; why.push(r.pos+'와 충'); }
      if(r.type==='형'||r.type==='파'){ dscore-=1; why.push(r.pos+'와 '+r.type); }
    });
    if(rd.isGong){ dscore-=1.5; why.push('지지가 공망'); }
    years.push({y:yy,gz:rd.gz,g:rd.g,score:dscore,why:why});
  }
  years.sort(function(a,b){ return b.score-a.score; });
  var clean=years.filter(function(y){ return !y.why.some(function(w){ return w.indexOf('기신')>=0||w.indexOf('공망')>=0; }); });
  var bestClean=clean.length?clean[0]:null;

  var months=[];
  var now=new Date(), y0=now.getFullYear(), m0=now.getMonth()+1;
  for(var i=0;i<14;i++){
    var mr=monthRead(R,y0,m0);
    var ms=0, mw=[];
    if(mr.grp==='인성'){ ms+=3; mw.push('인성'); }
    if(mr.grp==='재성'){ ms+=2; mw.push('재성'); }
    if(mr.grp==='관성'){ ms+=1; mw.push('관성'); }
    if(mr.bEl===2||mr.sEl===2){ ms+=1; mw.push('토'); }
    mr.rels.forEach(function(r){
      if(r.type==='육합'||r.type==='합'||r.type==='삼합'){ ms+=1.2; mw.push(r.pos+' 합'); }
      if(r.type==='충'){ ms-=2; mw.push(r.pos+' 충'); }
      if(r.type==='형'||r.type==='파'||r.type==='해'){ ms-=0.8; mw.push(r.pos+' '+r.type); }
    });
    if(mr.isGong){ ms-=1; mw.push('공망'); }
    months.push({y:y0,m:m0,gz:mr.gz,g:mr.g,score:ms,why:mw});
    m0++; if(m0>12){ m0=1; y0++; }
  }
  var goodMonths=months.slice().sort(function(a,b){ return b.score-a.score; }).slice(0,3);
  var badMonths=months.slice().sort(function(a,b){ return a.score-b.score; }).slice(0,2);

  /* 조심할 것 */
  var traps=[];
  if(gmIn.length) traps.push('인성이 공망('+gmIn.map(function(p){return p.pos;}).join('·')+') — 계약서·등기·특약을 <b>내 눈으로</b> 확인하지 않으면 나중에 증명할 것이 남지 않습니다.');
  if(ctx.branchRels.some(function(r){return r.type==='형';})) traps.push('원국에 형(刑)이 있어 서류가 꼬이기 쉽습니다. 잔금일·등기 접수일을 한 사람에게만 맡기지 마세요.');
  if(pyeonjae>=2&&R.strength==='약') traps.push('편재가 많고 일간이 약해 <b>대출로 판을 키우는 방식</b>이 가장 위험합니다. 상환액이 월 소득의 30%를 넘으면 그 매수는 이 사주에 맞지 않습니다.');
  if(inCnt===0) traps.push('인성이 없어 문서를 “나중에” 보는 습관이 생깁니다. 계약 전 확인 목록 세 가지(등기부·건축물대장·선순위 보증금)를 종이에 적고 가세요.');
  if(inCnt>=4) traps.push('인성이 많아 문서를 오래 검토하다 <b>타이밍</b>을 놓칩니다. 검토 기한을 3일로 정해두세요.');
  if(!traps.length) traps.push('원국 구조가 문서와 자산에 유리하게 짜여 있습니다. 다만 계약 당일 <b>구두 약속</b>을 특약에 넣는 습관은 그대로 두세요.');

  return {score:score,grade:grade,bestClean:bestClean,inCnt:inCnt,jaeCnt:jaeCnt,gwanCnt:gwanCnt,sikCnt:sikCnt,biCnt:biCnt,
    jeong:jeong,pyeon:pyeon,jeongjae:jeongjae,pyeonjae:pyeonjae,toCnt:toCnt,
    inPos:inPos,jaePos:jaePos,gwanPos:gwanPos,gmIn:gmIn,gmJae:gmJae,gongHits:gongHits,
    types:types,years:years,goodMonths:goodMonths,badMonths:badMonths,traps:traps,
    best:years[0],second:years[1],worst:years[years.length-1]};
}

/* ---------------------------------------------------------------- 2026 직업 · 사업 지도 */
var CAREER26={
 '비겁':{
  '비견':['1인 에이전시(브랜드·마케팅·디자인 외주)','프리랜서 전문가(개발·번역·영상편집)','전문직 개인사무소(세무·노무·법무)','버티컬 커뮤니티·멤버십 운영','B2B 아웃소싱 파트너사'],
  '겁재':['파트너십 공동 창업(2~3인 스튜디오)','구독형 멤버십·클럽 비즈니스','영업 대행·총판·지사 운영','공동구매·공동 브랜드 런칭','스포츠·레저·취미 클래스 사업'],
  'default':['1인 사업(전문성 기반)','프리랜서·외주 파트너','커뮤니티·네트워크 사업']
 },
 '식상':{
  '식신':['지식콘텐츠 크리에이터(블로그·뉴스레터·유튜브)','온라인 클래스 제작·퍼블리싱','리빙·푸드 콘텐츠 커머스','핸드메이드·굿즈 브랜드','교육 콘텐츠 커리큘럼 설계'],
  '상관':['숏폼·릴스 IP 기획·운영','브랜드 스토리텔링·크리에이티브 디렉팅','광고·퍼포먼스 마케팅 AE','강의·웨비나·팟캐스트 진행','1인 브랜드 커머스 기획'],
  'default':['콘텐츠 제작·퍼블리싱','크리에이터·강연','브랜드 커머스 기획']
 },
 '재성':{
  '정재':['스마트스토어·브랜드 유통 운영','리테일 MD·상품기획','자산관리·부동산 중개·투자 분석','B2B 영업·거래처 관리','구독·정기결제 커머스'],
  '편재':['공동구매·셀렉트숍 운영','글로벌 셀링(아마존·쇼피·라쿠텐)','B2B 납품·도매 유통','부동산 임대·수익형 자산 운영','무점포 브랜드·팝업 커머스'],
  'default':['커머스·유통·영업','자산 운용·중개','B2B 거래 기획']
 },
 '관성':{
  '정관':['대기업·공공기관 PM/전략기획','인사조직·노무 관리','법률·컴플라이언스·감사','품질·인증·규제 대응','공공사업·정책 용역 PM'],
  '편관':['프로젝트 총괄(PMO)·위기관리','프랜차이즈 본사 운영·슈퍼바이저','생산·물류 운영 관리','보안·안전·리스크 관리','병원·요양 등 규제 산업 운영'],
  'default':['조직 관리·기획','자격·인증 기반 전문직','운영 시스템 총괄']
 },
 '인성':{
  '정인':['교육 플랫폼 커리큘럼 운영','에듀테크 콘텐츠 기획·운영','출판·전자책·IP 라이선싱','자격·연수 프로그램 운영','리서치·데이터 분석'],
  '편인':['AI 프롬프트·업무 자동화 컨설팅','전문 자문(세무·노무·특허·감정)','번역·감수·교정·에디팅','온라인 강의 런칭·운영','데이터 라벨링·콘텐츠 검수'],
  'default':['교육·연구·자문','콘텐츠 기획·출판','데이터·리서치']
 }
};
var BIZ26={
 'sik_jae':['숏폼·블로그로 유입 → 스마트스토어·공동구매로 전환','온라인 클래스 → 전자책 → 1:1 코칭으로 이어지는 지식 퍼널','콘텐츠 IP를 브랜드 협찬·라이선싱으로 확장'],
 'in_gwan':['기업·공공 교육 위탁(HRD·평생교육) 수주','자격·인증 과정 운영(민간자격 등록)','정책·연구 용역과 보고서 사업'],
 'jae_only':['B2B 납품·도매로 회전을 만드는 유통','리테일 MD·PB 상품 기획','수익형 부동산·임대 운영'],
 'bi_sik':['1인 브랜드(강의·전자책·굿즈)','2~3인 크리에이터 스튜디오','커뮤니티 멤버십 + 오프라인 모임'],
 'gwan_only':['프랜차이즈 본사·가맹 운영 대행','기업 운영 대행(백오피스·인사·총무)','인증·심사·컨설팅'],
 'in_only':['전자책·강의자료 퍼블리싱','자격·교육 콘텐츠 제작 대행','리서치·리포트 구독 서비스'],
 'default':['작은 검증 후 확장하는 부업','플랫폼에 얹는 형태의 판매']
};
var ELE_DOMAIN26=[
 '기획·출판·교육·콘텐츠','미디어·마케팅·뷰티·F&B','부동산·유통·행정·커머스 운영','금융·법률·IT·엔지니어링','데이터·연구·물류·심리상담'
];
function groupRank(c){
  var order=['비겁','식상','재성','관성','인성'];
  return order.slice().sort(function(a,b){ return c.grp[b]-c.grp[a]; });
}
function careerMap(R){
  var d=deepOf(R), c=d.c;
  var rank=groupRank(c);
  var mainGrp=rank[0], secondGrp=rank[1];
  var mainGod=c.topGodInGrp;
  var main=(CAREER26[mainGrp]&&(CAREER26[mainGrp][mainGod]||CAREER26[mainGrp]['default']))||CAREER26['비겁']['default'];
  var secondGod=(function(){
    var best=null,bv=-1;
    for(var g in c.gc){ if(GOD_GROUP[g]===secondGrp&&c.gc[g]>bv){ bv=c.gc[g]; best=g; } }
    return best;
  })();
  var sub=(CAREER26[secondGrp]&&(CAREER26[secondGrp][secondGod]||CAREER26[secondGrp]['default']))||[];
  var sik=c.grp['식상'], jae=c.grp['재성'], gwan=c.grp['관성'], inC=c.grp['인성'], bi=c.grp['비겁'];
  var key='default';
  if(sik>=2&&jae>=2) key='sik_jae';
  else if(inC>=2&&gwan>=2) key='in_gwan';
  else if(jae>=3&&sik<2&&inC<2) key='jae_only';
  else if(bi>=2&&sik>=2) key='bi_sik';
  else if(gwan>=3) key='gwan_only';
  else if(inC>=3) key='in_only';
  var biz=BIZ26[key]||BIZ26['default'];
  var avoid=[];
  var giGrp=(function(el){ return el===R.dayEl?'비겁':(el===mod(R.dayEl+1,5)?'식상':(el===mod(R.dayEl+2,5)?'재성':(el===mod(R.dayEl+3,5)?'관성':'인성'))); })(d.gisin);
  avoid=(CAREER26[giGrp]&&(CAREER26[giGrp]['default']||[])).slice(0,2);
  return {mainGrp:mainGrp,mainGod:mainGod,roles:main.slice(0,5),secondGrp:secondGrp,secondGod:secondGod,sub:sub.slice(0,3),
    biz:biz,avoid:avoid,domain:ELE_DOMAIN26[R.dayEl],bizKey:key,
    why:'중심 기운은 <b>'+mainGrp+'</b>('+c.grp[mainGrp]+'개)이고 그 안의 별은 <b>'+mainGod+'</b>입니다. '+
        '일간 '+elTxt(R.dayEl)+'의 결이 맞는 영역은 '+ELE_DOMAIN26[R.dayEl]+' 쪽이고, '+
        '두 번째 기운인 <b>'+secondGrp+'</b>('+c.grp[secondGrp]+'개)가 수입의 두 번째 줄이 됩니다.'};
}
S.groupRank=groupRank;
S.careerMap=careerMap;
S.CAREER26=CAREER26;

/* ---------------------------------------------------------------- 표기 교정
   오행 글자 뒤의 조사는 한글 음(목·금은 받침 있음, 화·토·수는 없음)을 따라야 한다.
   (火)이 · (土)이 처럼 괄호 뒤에 붙은 조사를 문장 단위로 바로잡는다. */
S.fixPost=function(html){
  if(!html) return html;
  var KO={'木':'목','火':'화','土':'토','金':'금','水':'수'};
  return String(html).replace(/\((木|火|土|金|水)\)(이|가|은|는|을|를|과|와)(?=[\s<.,·)\]!?]|$)/g,function(m,h,p){
    var k=KO[h], jong=('목금'.indexOf(k)>=0);
    var map={'이':jong?'이':'가','가':jong?'이':'가','은':jong?'은':'는','는':jong?'은':'는',
             '을':jong?'을':'를','를':jong?'을':'를','과':jong?'과':'와','와':jong?'과':'와'};
    return '('+h+')'+map[p];
  });
};

/* ---------------------------------------------------------------- 내보내기 */
S.deep=deepOf;
S.pillarsOf=pillarsOf;
S.lineup=lineup;
S.interList=interList;
S.interHTML=interHTML;
S.gongmangText=gongmangText;
S.sinsalHTML=sinsalHTML;
S.strengthText=strengthText;
S.yongText=yongText;
S.stage12=stage12;
S.STAGE12=STAGE12;
S.STAGE_MEAN=STAGE_MEAN;
S.relType=relType;
S.yearRead=yearRead;
S.monthRead=monthRead;
S.monthWhy=monthWhy;
S.relWeight=relWeight;
S.docu=function(R){ return deepOf(R).docu; };
S.ganzhiOf=ganzhiOf;
S.elTxt=elTxt;
})();
