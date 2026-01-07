const audio = document.getElementById('bg-audio');
const playBtn = document.getElementById('playBtn');
const loadBtn = document.getElementById('loadBtn');
const musicUrl = document.getElementById('musicUrl');
const audioStatus = document.getElementById('audioStatus');
const volume = document.getElementById('volume');
const loadDefault = document.getElementById('loadDefault');

function updatePlayState(){
  if (!audio.src) {
    playBtn.disabled = true;
    playBtn.textContent = 'Tocar música';
  } else {
    playBtn.disabled = false;
    playBtn.textContent = audio.paused ? 'Tocar música' : 'Pausar música';
  }
}

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(()=>{
      // Autoplay may be blocked; toggle UI
      alert('Navegador bloqueou autoplay. Toque manualmente usando o botão.');
    });
  } else {
    audio.pause();
  }
  updatePlayState();
});

loadBtn.addEventListener('click', () => {
  const url = musicUrl.value.trim();
  if (!url) return alert('Cole o link da música primeiro.');
  setAudio(url, true);
});

loadDefault.addEventListener('click', ()=>{
  // fallback to bundled file
  setAudio('/assets/audio/cidade_vizinha.mp3', false);
});

volume.addEventListener('input', ()=>{
  audio.volume = volume.value;
});

// Share feature (uses Web Share API if available)
function share(){
  const text = document.getElementById('message').textContent;
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({title:document.getElementById('title').textContent, text, url});
  } else {
    navigator.clipboard.writeText(`${document.getElementById('title').textContent}\n${text}\n${url}`);
    alert('Texto copiado — cole onde quiser para compartilhar.');
  }
}

// Allow setting the audio source later via JS
window.setAudio = function(url, autoplay = false){
  audio.src = url;
  audio.load();
  audio.oncanplay = () => {
    audioStatus.textContent = 'Música carregada';
    if (autoplay) audio.play().catch(()=>{});
    updatePlayState();
  }
  audio.onerror = () => {
    audioStatus.textContent = 'Erro ao carregar a música';
    updatePlayState();
  }
}

// Support ?music=URL param to pre-load music (not autoplay)
(function(){
  const params = new URLSearchParams(window.location.search);
  const m = params.get('music');
  if (m) {
    musicUrl.value = m;
    setAudio(m, false);
  } else {
    // if bundled file exists, show as available
    if (audio.src) audioStatus.textContent = 'Música padrão disponível';
  }
})();

// Simple floating hearts
function spawnHeart(){
  const h = document.createElement('div');
  h.className = 'floating-heart';
  h.innerHTML = `<div class="heart"></div>`;
  document.body.appendChild(h);
  const x = (Math.random()*60)-30;
  h.style.left = (50 + x) + '%';
  const dur = 3000 + Math.random()*2000;
  h.animate([{transform:'translateY(0) scale(0.9)', opacity:1},{transform:`translateY(-400px) scale(1.1)`, opacity:0}], {duration:dur, easing:'ease-out'});
  setTimeout(()=>h.remove(), dur);
}
setInterval(spawnHeart, 900);

// keep UI consistent
updatePlayState();
