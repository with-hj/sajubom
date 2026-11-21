/* 천령당 — 재물·직업 : 재물/횡재 · 직업/이직 · 창업/부업 */
(function(){
'use strict';
var C=window.CH, S=C.S;
var P=C.P,H=C.H,UL=C.UL,K=C.K,elB=C.elB,stemB=C.stemB,brB=C.brB;
var monthsBlock=C.monthsBlock, seunTable=C.seunTable, risky=C.riskyMonthsText, yearOfStar=C.yearOfStar;
window.CTP=window.CTP||{};

function jaCount(c){ return c.gc['정재']+c.gc['편재']; }

/* ---------------- 재물 · 횡재 ---------------- */
function mo1(R,c,input,name){
  var jeong=c.gc['정재'], pyeon=c.gc['편재'];
  var h='<p>재성은 <b>'+(jeong+pyeon)+'개</b>(정재 '+jeong+' · 편재 '+pyeon+')입니다. '+(pyeon>jeong?'변동형 수입에 강하고 큰 판을 보는 눈이 있습니다.':(jeong>pyeon?'고정형 수입에 강하고 관리에 능합니다.':'고정과 변동이 반반이라 균형 잡힌 운영이 맞습니다.'))+'</p>';
  h+=H('그릇의 크기')+'<p>'+(S.WEALTH_VESSEL_GOD[c.topGodInGrp]||'성실함이 그대로 재산이 되는 구조입니다.')+'</p>';
  h+='<p>일간의 힘은 <b>'+R.strength+'</b>입니다. '+S.STRENGTH_TXT[R.strength].adv+'</p>';
  h+=H('십성으로 보는 돈의 재료')+C.godTable(c);
  return h+K('한 줄','이 사주는 <b>'+S.WORK_BY_GRP[c.topGrp]+'</b> 쪽에서 돈이 만들어집니다.');
}
function mo2(R,c,input,name){
  var h=H('새는 지점')+'<p>'+(S.WEALTH_LEAK_GOD[c.topGodInGrp]||'사람을 통한 지출에서 계산이 흐려집니다.')+'</p>';
  h+=H('이 사주가 반복하는 지출')+UL([
    '기분이 좋아지면 사는 작은 것 — 한 달에 모으면 꽤 큽니다',
    '사람과의 자리에서 내가 더 내는 습관',
    '구독·멤버십을 해지하지 못하는 것'
  ]);
  h+=H('막는 방법')+'<p>큰 결심보다 <b>구조</b>가 낫습니다. 통장을 셋으로 나누세요 — 쓰는 통장, 쌓는 통장, 비상 통장. '+S.EL_KO[c.yongEl]+'의 결이 필요한 사주라, 쌓는 통장의 이름에 '+S.EL_DEEP[c.yongEl].color+' 계열을 쓰면 의식이 유지됩니다.</p>';
  return h+K('한 줄','들어오는 것보다 <b>새는 곳</b>을 먼저 막으세요.');
}
function mo3(R,c,input,name){
  var ys=yearOfStar(R,'재성');
  var h=H('돈이 들어오는 해')+'<p>'+(ys.length?('앞으로 5년 중 <b>'+ys.map(function(o){return o.y+'년('+o.g+')';}).join(', ')+'</b>이 재성이 들어오는 해입니다.'):'앞으로 5년에는 재성이 세운으로 뚜렷하게 들어오지 않습니다. 이때는 벌이를 키우기보다 새는 곳을 막는 시기입니다.')+'</p>';
  h+=seunTable(R,c,5);
  h+=H('달 단위')+monthsBlock(R,c,'wealth',12,'앞으로 12개월, 돈이 움직이는 달입니다.');
  return h+K('한 줄','재성이 들어오는 해에는 <b>계약과 정산</b>을 그해 안에 끝내세요.');
}
function mo4(R,c,input,name){
  var pyeon=c.gc['편재'];
  var h=H('횡재의 결')+'<p>편재는 <b>큰 돈, 예상하지 못한 돈</b>을 뜻합니다. 이 사주는 편재가 <b>'+pyeon+'개</b>입니다. '+(pyeon>=2?'큰 돈이 들어올 문이 여럿 있습니다. 다만 들어온 만큼 나가는 구조도 함께 있어, 지키는 규칙이 없으면 남지 않습니다.':(pyeon===1?'한 번의 큰 기회가 올 수 있습니다. 그때를 위해 평소에 <b>담을 그릇</b>을 준비해두세요.':'큰돈보다 쌓이는 돈에 강한 구조입니다. 무리한 한 방보다 매달 남기는 쪽이 맞습니다.'))+'</p>';
  h+=H('큰돈이 오는 방식')+'<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해, 사람을 통해 기회가 옵니다. 다만 사람이 권하는 것에 계산이 흐려지므로 <b>서류</b>로 확인하는 습관이 필요합니다.</p>';
  h+=H('들어왔을 때의 규칙')+UL(['절반은 바로 떼어두기','빌려준 돈은 잊기','새는 곳을 먼저 막고 나서 쓰기']);
  return h+K('한 줄','횡재는 <b>그릇</b>이 준비된 사람에게만 남습니다.');
}
function mo5(R,c,input,name){
  var h=H('한 달의 순서')+'<p>'+(S.WEALTH_ROUTINE[c.topGrp]||'수입이 들어온 날 바로 떼어두는 습관 하나가 10년을 바꿉니다.')+'</p>';
  h+=H('금전 루틴')+'<table class="tbl"><tr><th>때</th><th>할 일</th></tr>'+
     '<tr><td>수입이 들어온 날</td><td>절반을 쌓는 통장으로 이동</td></tr>'+
     '<tr><td>주 1회</td><td>지출 10분 점검 — 구독·약속 확인</td></tr>'+
     '<tr><td>월 1회</td><td>고정 지출 재확인, 하나 줄이기</td></tr>'+
     '<tr><td>분기 1회</td><td>큰 지출 계획 세우기 — 충동과 분리</td></tr></table>';
  h+=H('공간의 처방')+'<p>'+S.EL_DEEP[c.yongEl].space+'. '+S.EL_DEEP[c.yongEl].item+' — 이 사주는 눈에 보이는 것으로 의식을 유지합니다.</p>';
  return h+K('한 줄','돈은 <b>한 달의 순서</b>로 지켜집니다.');
}
function mo6(R,c,input,name){
  var h=H('투자 성향')+'<p>'+(c.grp['식상']>=3?'아이디어에 끌려 들어가기 쉽습니다. 검증 없이 뛰어들지 말고 작은 금액으로 먼저 확인하세요.':(c.grp['인성']>=3?'공부하고 확신이 생겨야 움직입니다. 다만 확신이 늦어 기회를 놓치니 기한을 정해두세요.':(c.grp['비겁']>=3?'내 판단을 믿는 편이라 남의 말을 잘 듣지 않습니다. 손실 한도를 먼저 정하세요.':(c.grp['관성']>=3?'안정형입니다. 원금 보장과 절차를 중요하게 봅니다.':'현실적인 계산이 빠릅니다. 다만 사람을 통한 투자에서 계산이 흐려집니다.'))))+'</p>';
  h+=H('지켜야 할 원칙')+UL(['잃어도 되는 금액의 <b>한도</b>를 먼저 정하기','사람이 권하는 상품은 <b>서류</b>로 확인하기','수입이 늘어난 달에는 늘어난 절반을 먼저 떼어두기']);
  h+=H('이 사주가 특히 조심할 것')+'<p>일지와 충하는 달의 큰 결제입니다. '+risky(R,c,6)+'</p>';
  return h+K('한 줄','투자에서 이 사주가 이기는 방식은 <b>한도</b>를 정하는 것입니다.');
}
function mo7(R,c,input,name){
  return monthsBlock(R,c,'wealth',12,'앞으로 12개월, 재물의 흐름입니다.')+
    K('한 줄','합의 달에 계약하고, 충의 달에는 결제를 미루세요.');
}

/* ---------------- 직업 · 이직 ---------------- */
function jb1(R,c,input,name){
  var h=H('천직의 방향')+'<p>이 사주가 오래 해도 기운이 돌아오는 일은 <b>'+S.WORK_BY_GRP[c.topGrp]+'</b>입니다. '+S.GOD_DEEP[c.topGodInGrp]+'</p>';
  h+='<p>일간의 결이 맞는 분야는 '+S.CAREER[R.dayEl].join(' · ')+' 쪽입니다.</p>';
  h+=H('일하는 방식')+'<p>'+(S.WORK_MODE[c.topGrp]||'역할이 분명할 때 가장 오래 갑니다.')+'</p>';
  h+=H('이 사주가 일에서 지치는 순간')+'<p>'+S.DM_DEEP[R.dStem].drain+' 이 감각이 2주 이상 이어지면 자리를 점검하세요.</p>';
  return h+K('한 줄','천직은 <b>잘하는 일</b>이 아니라 <b>오래 해도 힘이 돌아오는 일</b>입니다.');
}
function jb2(R,c,input,name){
  var gy=yearOfStar(R,'관성');
  var h=H('이직의 문')+'<p>이직의 문은 <b>관성(자리)</b>이 세운으로 들어오는 해에 열립니다. '+(gy.length?('앞으로 5년 중 <b>'+gy.map(function(o){return o.y+'년('+o.g+')';}).join(', ')+'</b>이 그 해입니다.'):'앞으로 5년에는 그 문이 뚜렷하지 않습니다. 지금은 <b>준비의 시기</b>로 보는 편이 맞습니다.')+'</p>';
  h+=seunTable(R,c,5);
  h+=H('달로 보는 창')+monthsBlock(R,c,'wealth',6,'이직·면접에 힘이 실리는 달입니다.');
  return h+K('한 줄','옮기는 <b>해</b>를 기다리되, 준비는 <b>지금</b> 시작하세요.');
}
function jb3(R,c,input,name){
  var guan=c.grp['관성'], bi=c.grp['비겁'];
  var h=H('지금 자리에 남을까')+'<p>이 사주는 관성 <b>'+guan+'개</b>, 비겁 <b>'+bi+'개</b>입니다. '+(guan>=3?'조직에서 자리를 올리는 방식이 맞습니다.':'조직과 독립이 반반이라, 소속은 있되 전문 영역은 내 것으로 가져야 합니다.')+'</p>';
  h+=H('옮길까')+'<p>'+(S.WORK_MODE[c.topGrp]||'')+'</p>';
  h+=H('퇴사 판단 기준')+UL(['<b>생활비 6개월</b>이 확보되었는가','그만두는 이유가 <b>사람</b>인가 <b>일</b>인가 — 사람 때문이라면 옮겨도 반복될 수 있습니다','다음 자리에서 내 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 쓰이는가']);
  h+=H('남는 경우의 조건')+'<p>남기로 했다면 <b>6개월 안에 하나</b>를 바꾸세요. 업무 범위, 보고 방식, 근무 시간 중 하나입니다. 아무것도 바뀌지 않으면 1년 뒤 같은 자리에서 같은 고민을 합니다.</p>';
  return h+K('한 줄','퇴사는 <b>감정</b>이 아니라 <b>숫자</b>로 결정하세요.');
}
function jb4(R,c,input,name){
  var h=H('이 사주의 귀인')+'<p>귀인은 돕는 사람이 아니라 <b>나를 쓰는 자리에 데려다주는 사람</b>입니다. 이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 '+S.GROUP_MEAN[c.topGrp].split('.')[0]+'을 알아봐 주는 사람에게서 기회가 옵니다.</p>';
  h+=H('귀인의 결')+'<p>이 사주에게 필요한 기운은 '+elB(c.yongEl)+'입니다. 그래서 '+S.EL_KO[c.yongEl]+'의 결을 가진 사람 — '+S.EL_PERSON[c.yongEl]+' — 이 귀인입니다. '+S.EL_DEEP[c.yongEl].dir+' 방향의 모임, '+S.EL_DEEP[c.yongEl].color+' 계열의 자리에서 만나기 쉽습니다.</p>';
  h+=H('귀인을 만나는 자리')+UL(['내가 <b>설명해야 하는</b> 자리 — 말로 정리할 때 사람이 알아봅니다','한 사람이 소개하는 자리 — 이 사주는 소개로 이어지는 인연이 오래 갑니다','배우는 자리 — 자격·강의·스터디']);
  return h+K('한 줄','귀인은 찾는 것이 아니라 <b>내가 설명할 수 있는 자리</b>에서 만납니다.');
}
function jb5(R,c,input,name){
  var h=H('연봉·조건 협상')+'<p>이 사주는 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 강해 조건을 말할 때 감정이 섞입니다. 협상은 <b>숫자 → 근거 → 양보 순서</b>로 하세요.</p>';
  h+=H('협상의 순서')+UL(['원하는 숫자를 <b>먼저</b> 말하기','근거는 시장가와 내가 만든 결과 두 가지로만','양보는 <b>한 번</b>만. 그 뒤에는 조건을 바꾸기']);
  h+=H('이 사주가 놓치는 것')+'<p>연봉만 보고 <b>근무 조건</b>을 놓칩니다. 시간, 재택, 휴가 — 이 사주는 시간이 보장될 때 오래 갑니다.</p>';
  return h+K('한 줄','협상은 <b>한 번에 하나</b>만 요구할 때 성공합니다.');
}
function mo6b(R,c,input,name){
  return monthsBlock(R,c,'wealth',6,'앞으로 6개월, 일과 자리의 흐름입니다.')+
    K('한 줄','자리를 옮기는 결정은 합의 달에, 면접은 충의 달을 피해서.');
}
function jb7(R,c,input,name){
  var h=H('앞으로 5년의 커리어')+seunTable(R,c,5);
  h+=H('대운의 방향')+'<p>지금 대운은 <b>'+S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)+'</b> — '+(S.GOD_DAEUN[S.tenGod(R.dStem,R.daeun[R.curDaeun].idx%10)]||'')+'</p>';
  h+=H('이 5년의 순서')+UL(['<b>1년차</b> — 실력을 정리하고 기록으로 남기기','<b>2~3년차</b> — 자리 또는 이름을 하나 얻기','<b>4~5년차</b> — 얻은 자리에서 사람을 만들기']);
  return h+K('한 줄','커리어는 <b>기록</b>이 남을 때 다음 자리로 이어집니다.');
}

/* ---------------- 창업 · 부업 ---------------- */
function st1(R,c,input,name){
  var bi=c.grp['비겁'], sik=c.grp['식상'], jae=c.grp['재성'];
  var h='<p>창업 적성은 <b>비겁(내 힘) · 식상(만들 것) · 재성(돈의 흐름)</b>의 조합으로 봅니다. 이 사주는 비겁 <b>'+bi+'</b> · 식상 <b>'+sik+'</b> · 재성 <b>'+jae+'</b>입니다.</p>';
  h+='<p>'+(bi>=3&&sik>=2?'내 이름을 걸고 시작하는 힘이 있습니다. 다만 크게 시작하면 초반에 무너지기 쉬우니 6개월 안에 검증할 크기로 여세요.':(sik>=3?'만들어서 파는 구조가 잘 맞습니다. 부업으로 반응을 확인한 뒤 키우는 방식이 안전합니다.':(jae>=3?'돈의 흐름을 보는 눈이 사업 감각으로 이어집니다. 다만 사람을 쓰는 일에서 계산이 흐려지니 장부를 먼저 만드세요.':'혼자 시작하기보다 검증된 구조에 들어가 역할을 맡는 쪽이 안정적입니다. 창업은 준비 기간을 길게 두세요.')))+'</p>';
  h+=H('이 사주가 빛나는 지점')+'<p><b>'+S.GOD_KEY[c.topGodInGrp]+'</b> — '+S.GOD_DEEP[c.topGodInGrp]+'</p>';
  return h+K('한 줄','창업은 <b>6개월 검증</b>이 먼저입니다. 손익분기보다 “돈을 내는 사람이 있는가”를 보세요.');
}
function st2(R,c,input,name){
  var h=H('무엇으로 시작할까')+'<p>이 사주가 오래 할 수 있는 것은 <b>'+S.WORK_BY_GRP[c.topGrp]+'</b>입니다. '+S.CAREER[R.dayEl].join(' · ')+' 쪽에서 시작하면 힘이 덜 듭니다.</p>';
  h+=H('아이템을 고르는 기준')+UL(['내가 <b>설명하지 않아도</b> 좋아하는 것','3개월 안에 첫 손님을 만들 수 있는 것','혼자 시작할 수 있고, 키울 때 사람을 쓸 수 있는 것']);
  h+=H('이 사주에게 맞는 형태')+'<p>'+(c.grp['비겁']>=3?'1인 사업 — 내 이름을 걸고 전문성을 파는 형태':'작게 시작해 반응을 보는 부업 형태')+'가 맞습니다. 처음부터 큰 자리를 잡으려 하면 이 사주의 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>이 오히려 부담이 됩니다.</p>';
  return h+K('한 줄','좋은 아이템은 <b>내가 오래 말할 수 있는 것</b>입니다.');
}
function st3(R,c,input,name){
  var ys=yearOfStar(R,'비겁').concat(yearOfStar(R,'식상'));
  var h=H('시작의 문')+'<p>창업은 <b>비겁(내 힘)</b> 또는 <b>식상(만들 것)</b>이 세운으로 들어오는 해에 시작하는 것이 좋습니다. '+(ys.length?('앞으로 5년 중 <b>'+ys.map(function(o){return o.y+'년('+o.g+')';}).join(', ')+'</b>이 그 해입니다.'):'앞으로 5년에는 그 문이 뚜렷하지 않습니다. 이때는 준비와 검증에 쓰세요.')+'</p>';
  h+=seunTable(R,c,5);
  h+=H('달로 보는 창')+monthsBlock(R,c,'wealth',6,'첫 손님을 만나기 좋은 달입니다.');
  return h+K('한 줄','시작은 <b>작게, 빨리</b>. 이 사주는 준비가 길어지면 시작하지 못합니다.');
}
function st4(R,c,input,name){
  var h=H('실패하는 지점')+'<p>이 사주가 사업에서 무너지는 방식은 <b>'+S.GOD_KEY[c.topGodInGrp]+'</b>에서 옵니다. '+S.STRENGTH_TXT[R.strength].adv+'</p>';
  h+=H('특히 조심할 것')+UL(['<b>동업</b> — 이 사주는 정이 앞서 서류 없이 시작합니다. 몫과 역할을 글로 남기세요.','<b>확장</b> — 첫 반응이 좋으면 바로 키우려 합니다. 6개월은 같은 크기로 버티세요.','<b>비상금</b> — 생활비 6개월은 사업 자금과 분리하세요.']);
  h+=H('위기가 오는 달')+'<p>'+risky(R,c,12)+'</p>';
  return h+K('한 줄','사업의 실패는 대개 <b>사람과 돈을 같이</b> 관리하지 못할 때 옵니다.');
}
function st5(R,c,input,name){
  var h=H('동업과 파트너')+'<p>이 사주는 <b>'+c.topGrp+'</b>이 중심이라 '+S.GROUP_MEAN[c.topGrp].split('.')[0]+' 역할을 맡기 쉽습니다. 파트너는 그 반대를 채워주는 사람이 좋습니다.</p>';
  h+=H('파트너를 고르는 기준')+UL(['내가 못 하는 것을 <b>실제로 해본</b> 사람','돈 이야기를 <b>불편해하지 않는</b> 사람','결정이 늦을 때 <b>기한</b>을 정해줄 수 있는 사람']);
  h+=H('시작 전 서류')+'<p>몫, 역할, 결정권, 나가는 조건 — 네 가지를 한 장으로 적으세요. 이 사주는 이 한 장이 없으면 3년 뒤에 사람을 잃습니다.</p>';
  return h+K('한 줄','동업은 <b>서류</b>가 우정을 지킵니다.');
}
function st6(R,c,input,name){
  return monthsBlock(R,c,'wealth',6,'앞으로 6개월, 사업의 흐름입니다.')+
    K('한 줄','첫 결제·계약은 합의 달에, 확장은 충의 달을 피해서.');
}

window.CTP.wealth={
  money:[
    {han:'器',title:'재물의 그릇',sub:'재성과 일간의 힘',body:mo1},
    {han:'漏',title:'새는 곳',sub:'반복되는 지출과 막는 법',body:mo2},
    {han:'時',title:'돈이 들어오는 해',sub:'재성이 오는 때',body:mo3},
    {han:'橫',title:'횡재의 결',sub:'큰돈이 오는 방식',body:mo4},
    {han:'法',title:'금전 루틴',sub:'한 달의 순서',body:mo5},
    {han:'險',title:'투자 주의',sub:'이기는 방식은 한도',body:mo6},
    {han:'月',title:'12개월의 재물',sub:'달별 흐름',body:mo7}
  ],
  job:[
    {han:'職',title:'천직의 방향',sub:'오래 해도 힘이 돌아오는 일',body:jb1},
    {han:'轉',title:'이직의 문',sub:'자리가 열리는 해와 달',body:jb2},
    {han:'擇',title:'남을까 옮길까',sub:'퇴사 판단 기준',body:jb3},
    {han:'貴',title:'귀인',sub:'기회를 데려오는 사람',body:jb4},
    {han:'價',title:'조건 협상',sub:'연봉과 근무 조건',body:jb5},
    {han:'月',title:'6개월의 자리',sub:'달별 흐름',body:mo6b},
    {han:'五',title:'5년의 커리어',sub:'해마다의 자리',body:jb7}
  ],
  startup:[
    {han:'始',title:'창업 적성',sub:'비겁·식상·재성의 조합',body:st1},
    {han:'品',title:'무엇으로 시작할까',sub:'아이템을 고르는 기준',body:st2},
    {han:'時',title:'시작의 문',sub:'언제 여는가',body:st3},
    {han:'險',title:'실패하는 지점',sub:'무너지는 방식',body:st4},
    {han:'伴',title:'동업과 파트너',sub:'서류가 우정을 지킨다',body:st5},
    {han:'月',title:'6개월의 사업',sub:'달별 흐름',body:st6}
  ]
};
})();
