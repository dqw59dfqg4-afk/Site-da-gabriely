const audio = document.getElementById('bg-audio');
const playBtn = document.getElementById('playBtn');

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(()=>{
      // Autoplay may be blocked; toggle UI
      alert('Navegador bloqueou autoplay. Use o botão para tocar.');
    });
    playBtn.textContent = 'Pausar música';
  } else {
    audio.pause();
    playBtn.textContent = 'Tocar música';
  }
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
window.setAudio = function(url){
  audio.src = url;
  audio.load();
}

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
