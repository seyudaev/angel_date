let musicPlaying = false

window.addEventListener('load', () => {
  launchConfetti()

  const music = document.getElementById('bg-music')
  if (music) {
    music.volume = 0.25
    // Здесь пользователь уже кликнул «Да», поэтому автоплей обычно разрешён
    music
      .play()
      .then(() => {
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
      })
      .catch(() => {})
  }
})

function launchConfetti() {
  const colors = ['#111111', '#f5f5f5', '#ff6b81', '#ffd6e0']
  const duration = 5000
  const end = Date.now() + duration

  confetti({
    particleCount: 140,
    spread: 90,
    origin: { x: 0.5, y: 0.35 },
    colors,
  })

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval)
      return
    }
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
    })
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
    })
  }, 320)
}

function toggleMusic() {
  const music = document.getElementById('bg-music')
  if (!music) return

  if (musicPlaying) {
    music.pause()
    musicPlaying = false
    document.getElementById('music-toggle').textContent = '🔇'
  } else {
    music.play().catch(() => {})
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'
  }
}

