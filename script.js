// ===== Config =====
const BIRTHDAY_TARGET = new Date('2025-11-03T00:00:00'); // 3 Kasım 2025
document.getElementById('recipientName').textContent = 'Şükran’ım';
document.getElementById('yourName').textContent = 'Bekir Can';

// ===== Music controls =====
const bgMusic = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
playBtn.addEventListener('click', async () => {
  try{
    if(bgMusic.paused){ await bgMusic.play(); playBtn.textContent = 'Durdur 🎵'; }
    else{ bgMusic.pause(); playBtn.textContent = 'Şarkımızı Çal 🎵'; }
  }catch(e){ alert('Tarayıcı, otomatik çalmaya izin vermiyor olabilir. Tekrar dener misin?'); }
});

// ===== Countdown =====
const el = {
  d: document.getElementById('days'),
  h: document.getElementById('hours'),
  m: document.getElementById('minutes'),
  s: document.getElementById('seconds')
};
function updateCountdown(){
  const now = new Date();
  let diff = BIRTHDAY_TARGET - now;
  if(diff < 0) diff = 0;
  const sec = Math.floor(diff/1000);
  const days = Math.floor(sec / (3600*24));
  const hours = Math.floor((sec % (3600*24))/3600);
  const minutes = Math.floor((sec % 3600)/60);
  const seconds = sec % 60;
  el.d.textContent = String(days).padStart(2,'0');
  el.h.textContent = String(hours).padStart(2,'0');
  el.m.textContent = String(minutes).padStart(2,'0');
  el.s.textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== 

// ===== Lightbox =====
const thumbs   = document.querySelectorAll('.thumb');
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');

function hideLb(){
  lightbox.setAttribute('hidden','');
  lbImg.removeAttribute('src');
}

thumbs.forEach(img => img.addEventListener('click', () => {
  lbImg.src = img.src;
  lightbox.removeAttribute('hidden');
}));

lbClose.addEventListener('click', hideLb);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) hideLb(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') hideLb(); });
// ===== Surprise reveal =====
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseBox = document.getElementById('surpriseBox');
surpriseBtn.addEventListener('click', ()=>{
  surpriseBox.hidden = !surpriseBox.hidden;
  surpriseBtn.textContent = surpriseBox.hidden ? 'Sürprizi Göster ✨' : 'Sürprizi Gizle 💫';
});

// ===== Cute floating hearts =====
const canvas = document.getElementById('hearts');
const ctx = canvas.getContext('2d');
let W, H, hearts;
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  hearts = hearts || [];
}
window.addEventListener('resize', resize);
resize();
function newHeart(){
  return { x: Math.random()*W, y: H + 20 + Math.random()*60, size: 8 + Math.random()*14, alpha: .4 + Math.random()*.6, speedY: 0.5 + Math.random()*1.2, drift: (Math.random()-.5)*0.6 };
}
const MAX = 60;
hearts = [];
for(let i=0;i<MAX;i++) hearts.push(newHeart());
function drawHeart(x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s/20, s/20);
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.bezierCurveTo(6, -12, 16, -10, 16, 0);
  ctx.bezierCurveTo(16, 10, 0, 18, 0, 24);
  ctx.bezierCurveTo(0, 18, -16, 10, -16, 0);
  ctx.bezierCurveTo(-16, -10, -6, -12, 0, -6);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,150,197,0.7)';
  ctx.fill(); ctx.restore();
}
function tick(){
  ctx.clearRect(0,0,W,H);
  if(hearts.length < MAX && Math.random() < 0.05) hearts.push(newHeart());
  hearts.forEach(h => { h.y -= h.speedY; h.x += h.drift; drawHeart(h.x, h.y, h.size); });
  hearts = hearts.filter(h => h.y > -40);
  requestAnimationFrame(tick);
}
tick();

// ===== Letters (Envelope Modals) =====
document.querySelectorAll('.envelope').forEach(env => {
  env.addEventListener('click', () => {
    const target = env.getAttribute('data-target');
    const modal = document.getElementById(target);
    if(modal){ modal.hidden = false; }
  });
});
document.querySelectorAll('.letter-modal .close-letter').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.letter-modal');
    if(modal){ modal.hidden = true; }
  });
});
document.querySelectorAll('.letter-modal').forEach(modal => {
  modal.addEventListener('click', (e) => { if(e.target === modal){ modal.hidden = true; } });
});
\n
// ===== Official Stream Modal =====
const streamBtn = document.getElementById('streamBtn');
const streamModal = document.getElementById('streamModal');
const streamInput = document.getElementById('streamUrlInput');
const streamFrame = document.getElementById('streamFrame');
const streamOpen = document.getElementById('openStream');
const streamClear = document.getElementById('clearStream');

function toEmbed(url){
  if(!url) return '';
  try{
    const u = new URL(url);
    // YouTube: convert watch?v= to embed/
    if(u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')){
      let vid = '';
      if(u.hostname.includes('youtu.be')){
        vid = u.pathname.slice(1);
      }else{
        vid = u.searchParams.get('v') || '';
      }
      return vid ? `https://www.youtube.com/embed/${vid}` : '';
    }
    // Spotify track
    if(u.hostname.includes('spotify.com')){
      // e.g., https://open.spotify.com/track/xyz
      return url.replace('open.spotify.com', 'open.spotify.com/embed');
    }
    return url; // fallback
  }catch(e){ return ''; }
}

function loadSaved(){
  const saved = localStorage.getItem('STREAM_URL') || '';
  streamInput.value = saved;
  const emb = toEmbed(saved);
  if(emb){ streamFrame.src = emb; }
}

if(streamBtn){
  streamBtn.addEventListener('click', () => {
    streamModal.hidden = false;
    setTimeout(loadSaved, 0);
  });
}

streamOpen?.addEventListener('click', () => {
  const val = streamInput.value.trim();
  localStorage.setItem('STREAM_URL', val);
  const emb = toEmbed(val);
  if(emb){ streamFrame.src = emb; }
});

streamClear?.addEventListener('click', () => {
  localStorage.removeItem('STREAM_URL');
  streamInput.value = '';
  streamFrame.src = '';
});

// close handler (reuse .close-letter listener defined earlier)
