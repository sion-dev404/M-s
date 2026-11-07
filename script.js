/* ===== 괴물 설정: 여기 대사를 마음대로 고치세요 =====
   {name} 은 아이 이름으로 바뀌어요.
   ask: [[아이가 누를 버튼 글, 괴물의 대답], ...]                       */
const MONSTERS = [
  { id:'mungchi', name:'뭉치', color:'#8e5cff', dark:'#6a3be0', pitch:1.7,
    lines:[
      { say:'안녕, {name}! 나는 뭉치 괴물이야! 전화 받아 줘서 고마워!' },
      { say:'{name}, 오늘 이는 닦았니?',
        ask:[['응, 닦았어!','우와, 반짝반짝하겠다! 최고야!'],
             ['아직 안 닦았어','그럼 나랑 같이 닦자! 치카치카 쓱싹쓱싹!']] },
      { say:'충치 괴물은 깨끗한 이가 제일 싫대. 도망가라, 충치 괴물!' },
      { say:'{name}, 내일 또 전화할게. 안녕, 안녕!' } ] },
  { id:'pikjuk', name:'삐죽이', color:'#33c27a', dark:'#1f9a5c', pitch:1.3,
    lines:[
      { say:'어흥! 아니, 안녕! 나는 삐죽이 괴물이야!' },
      { say:'{name}, 오늘 하루 재미있었어?',
        ask:[['엄청 재미있었어!','와, 정말 신나는 하루였구나!'],
             ['조금 힘들었어','괜찮아, 괜찮아. 내가 토닥토닥 해 줄게.']] },
      { say:'졸린 괴물들이 모두 이불 속으로 들어가고 있어. {name}도 곧 잘 시간이야.' },
      { say:'좋은 꿈 꿔. 꿈속에서 만나자! 잘 자, {name}!' } ] },
  { id:'mallang', name:'말랑이', color:'#ff9a3d', dark:'#e07a1a', pitch:1.9,
    lines:[
      { say:'말랑말랑! 나는 말랑이 괴물이야! 만나서 반가워!' },
      { say:'{name}, 나는 맛있는 게 좋아. 너는 뭘 제일 좋아해?',
        ask:[['과자!','과자! 바삭바삭 맛있겠다! 나도 먹고 싶어!'],
             ['과일!','과일! 달콤하고 시원하겠다! 말랑말랑 좋아!']] },
      { say:'그런데 장난감이 바닥에서 울고 있대. 집에 가고 싶다고! {name}, 같이 정리해 줄래?' },
      { say:'고마워, {name}! 최고야! 또 전화할게. 말랑말랑 안녕!' } ] }
];

/* ===== 괴물 그림 ===== */
function monsterSVG(m){
  const C = m.color, D = m.dark;
  const eye = (x,y,r) => `<g class="eye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x+3}" cy="${y+2}" r="${r*.48}" fill="#2b1458"/><circle cx="${x+5}" cy="${y-1}" r="${r*.16}" fill="#fff"/></g>`;
  const cheeks = (y) => `<circle cx="64" cy="${y}" r="9" fill="#ff7aa8" opacity=".55"/><circle cx="136" cy="${y}" r="9" fill="#ff7aa8" opacity=".55"/>`;
  let body = '';
  if (m.id === 'mungchi') {
    body = `<ellipse cx="72" cy="178" rx="18" ry="9" fill="${D}"/><ellipse cx="128" cy="178" rx="18" ry="9" fill="${D}"/>
      <ellipse cx="100" cy="112" rx="72" ry="66" fill="${C}"/>
      <path d="M58 60 L46 26 L80 46Z" fill="${D}"/><path d="M142 60 L154 26 L120 46Z" fill="${D}"/>
      ${eye(100,96,26)}
      <g class="mouth"><path d="M70 136 Q100 170 130 136Z" fill="#4a1a2e"/><rect x="84" y="136" width="9" height="11" rx="2" fill="#fff"/><rect x="107" y="136" width="9" height="11" rx="2" fill="#fff"/></g>${cheeks(130)}`;
  } else if (m.id === 'pikjuk') {
    body = `<ellipse cx="76" cy="182" rx="18" ry="8" fill="${D}"/><ellipse cx="124" cy="182" rx="18" ry="8" fill="${D}"/>
      <rect x="46" y="44" width="108" height="136" rx="54" fill="${C}"/>
      <path d="M60 58 L70 22 L90 52Z" fill="${D}"/><path d="M90 50 L100 12 L110 50Z" fill="${D}"/><path d="M110 52 L130 22 L140 58Z" fill="${D}"/>
      ${eye(80,98,17)}${eye(120,98,17)}
      <g class="mouth"><path d="M68 132 Q100 166 132 132Z" fill="#3b1530"/><rect x="80" y="132" width="8" height="10" rx="2" fill="#fff"/><rect x="112" y="132" width="8" height="10" rx="2" fill="#fff"/></g>${cheeks(126)}`;
  } else {
    body = `<circle cx="46" cy="70" r="17" fill="${D}"/><circle cx="154" cy="70" r="17" fill="${D}"/>
      <path d="M28 150 Q18 80 70 56 Q100 44 130 56 Q182 80 172 150 Q170 182 100 182 Q30 182 28 150Z" fill="${C}"/>
      ${eye(64,98,14)}${eye(100,84,14)}${eye(136,98,14)}
      <g class="mouth"><path d="M68 132 Q100 164 132 132Z" fill="#4a1a2e"/><ellipse cx="100" cy="148" rx="13" ry="7" fill="#ff6b8a"/></g>${cheeks(128)}`;
  }
  return `<svg viewBox="0 0 200 200" aria-hidden="true">${body}</svg>`;
}

/* ===== 기본 도구 ===== */
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
function show(id){ document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id)); }

let sel = MONSTERS[0], delay = 0, kidName = '친구';
let ctx = null, wakeLock = null;
let ringTimer = null, declineTimer = null, waitTimer = null, callTimer = null;
let callId = 0;

try { const n = localStorage.getItem('monsterKid'); if (n) $('#name').value = n; } catch (e) {}

/* ===== 설정 화면 ===== */
const picker = $('#picker');
MONSTERS.forEach((m, i) => {
  const b = document.createElement('button');
  b.className = 'pick'; b.setAttribute('aria-pressed', i === 0);
  b.innerHTML = monsterSVG(m) + '<span>' + m.name + '</span>';
  b.addEventListener('click', () => {
    sel = m;
    picker.querySelectorAll('.pick').forEach(x => x.setAttribute('aria-pressed', x === b));
  });
  picker.appendChild(b);
});
$('#chips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  delay = Number(c.dataset.s);
  document.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === c));
});

/* ===== 소리 ===== */
function unlockAudio(){
  try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); ctx.resume(); } catch (e) {}
  try { if ('speechSynthesis' in window) speechSynthesis.speak(new SpeechSynthesisUtterance('')); } catch (e) {}
}
function beep(){
  if (!ctx) return;
  const t0 = ctx.currentTime;
  [660, 880, 660, 880].forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = t0 + i * .18;
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.2, t + .02); g.gain.linearRampToValueAtTime(0, t + .16);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .18);
  });
}
function vib(p){ try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
function speak(text){
  return new Promise(res => {
    let done = false, to;
    const fin = () => { if (!done) { done = true; clearTimeout(to); res(); } };
    const est = Math.max(2200, text.length * 230);
    if (!('speechSynthesis' in window)) { to = setTimeout(fin, est); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR'; u.pitch = sel.pitch; u.rate = .95;
      const v = speechSynthesis.getVoices().find(x => x.lang && x.lang.replace('_','-').startsWith('ko'));
      if (v) u.voice = v;
      u.onend = fin; u.onerror = fin;
      speechSynthesis.speak(u);
    } catch (e) { to = setTimeout(fin, est); return; }
    to = setTimeout(fin, est + 4000);
  });
}
async function lockScreen(){ try { if (navigator.wakeLock) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {} }
function unlockScreen(){ try { wakeLock && wakeLock.release(); } catch (e) {} wakeLock = null; }

/* ===== 전화 시작 / 벨 ===== */
$('#start').addEventListener('click', () => {
  kidName = $('#name').value.trim() || '친구';
  try { localStorage.setItem('monsterKid', $('#name').value.trim()); } catch (e) {}
  unlockAudio(); lockScreen();
  if (delay === 0) return ring();
  let left = delay;
  const tick = () => { $('#waitText').textContent = '곧 전화가 와요 (' + left + ')'; };
  tick(); show('waiting');
  clearInterval(waitTimer);
  waitTimer = setInterval(() => { left--; if (left <= 0) { clearInterval(waitTimer); ring(); } else tick(); }, 1000);
});
$('#cancel').addEventListener('click', () => { clearInterval(waitTimer); unlockScreen(); show('setup'); });

function setTheme(){ document.documentElement.style.setProperty('--mc', sel.color); }

function ring(){
  setTheme();
  $('#ringName').textContent = sel.name + ' 괴물';
  $('#ringState').textContent = '전화가 왔어요!';
  const av = $('#ringAvatar'); av.innerHTML = monsterSVG(sel); av.classList.remove('sad'); av.classList.add('ringing');
  show('ring'); startRing();
}
function startRing(){
  stopRing(); beep(); vib([400, 200, 400]);
  ringTimer = setInterval(() => { beep(); vib([400, 200, 400]); }, 1800);
}
function stopRing(){ clearInterval(ringTimer); vib(0); }

$('#decline').addEventListener('click', () => {
  stopRing(); clearTimeout(declineTimer);
  const av = $('#ringAvatar'); av.classList.remove('ringing'); av.classList.add('sad');
  $('#ringState').textContent = '앙~ 받아 줘!';
  speak('앙, 왜 안 받아? 다시 걸게!');
  declineTimer = setTimeout(() => {
    av.classList.remove('sad'); av.classList.add('ringing');
    $('#ringState').textContent = '전화가 왔어요!'; startRing();
  }, 3800);
});

/* ===== 통화 ===== */
$('#answer').addEventListener('click', () => {
  stopRing(); clearTimeout(declineTimer);
  try { speechSynthesis.cancel(); } catch (e) {}
  const id = ++callId;
  $('#callName').textContent = sel.name + ' 괴물';
  $('#callAvatar').innerHTML = monsterSVG(sel);
  $('#subtitle').textContent = ''; $('#choices').innerHTML = '';
  show('call');
  const t0 = Date.now(); clearInterval(callTimer);
  const upd = () => { const s = Math.floor((Date.now() - t0) / 1000);
    $('#time').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  upd(); callTimer = setInterval(upd, 1000);
  runScript(id);
});

const fmt = t => t.split('{name}').join(kidName);

async function say(text){
  const av = $('#callAvatar');
  $('#subtitle').textContent = text; av.classList.add('talking');
  await speak(text);
  av.classList.remove('talking');
  await sleep(350);
}
function askChoices(opts){
  return new Promise(res => {
    const box = $('#choices'); box.innerHTML = '';
    opts.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'choice'; b.textContent = o;
      b.addEventListener('click', () => { box.innerHTML = ''; res(i); });
      box.appendChild(b);
    });
  });
}
async function runScript(id){
  for (const step of sel.lines) {
    if (id !== callId) return;
    await say(fmt(step.say));
    if (step.ask) {
      const i = await askChoices(step.ask.map(a => a[0]));
      if (id !== callId) return;
      await say(fmt(step.ask[i][1]));
    }
  }
  await sleep(700);
  if (id === callId) hangup();
}

$('#hangup').addEventListener('click', hangup);
function hangup(){
  callId++;
  try { speechSynthesis.cancel(); } catch (e) {}
  clearInterval(callTimer); unlockScreen();
  $('#choices').innerHTML = '';
  $('#endAvatar').innerHTML = monsterSVG(sel);
  $('#endMsg').textContent = sel.name + ' 괴물이랑 통화했어요!';
  $('#endTime').textContent = '통화 시간 ' + $('#time').textContent;
  show('end');
}
$('#again').addEventListener('click', () => show('setup'));
