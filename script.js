// Мультяшные собачки (прямые ссылки на GIF/WebP с Tenor),
// плавно идём от более нейтральных к грустным.
const gifStages = [
  // 0 
  'https://media1.tenor.com/m/LKY7hRX8ek8AAAAC/tonton-friends.gif',
  // 1 
  'https://media1.tenor.com/m/dg9eYbBBU7gAAAAd/tonton-friends-yuta.gif',
  // 2
  'https://media1.tenor.com/m/78Dbc8aZSMkAAAAd/tonton-friends-yuta.gif',
  // 3
  'https://media1.tenor.com/m/-dLG1V2QMJMAAAAd/tonton-friends.gif',
  // 4
  'https://media1.tenor.com/m/_f7SYReqeRkAAAAd/puglie-pug.gif',
  // 5 
  'https://media1.tenor.com/m/vH6FjUFyBPgAAAAd/cry-sad.gif',
  // 6
  'https://media1.tenor.com/m/UiDAuObXq8gAAAAC/ayamai.gif',
  // 7
  'https://media.tenor.com/HCTvxdNX6YkAAAAj/pig-dog.gif'
]

const noMessages = [
  'Нет',
  'Ты уверена? 🤔',
  'Ангел, ну пожалуйста... 🥺',
  'Если скажешь «нет», мне будет очень грустно...',
  'Мне правда станет очень-очень грустно 😢',
  'Может всё‑таки «да»? 💔',
  'Последний шанс перед тем, как я растаю 😭',
  'Ну всё, я убегаю 😜',
]

// Реплики после нажатия «Да»
const yesTeasePokes = [
  'Что-то ты быстро согласилась, попробуй нажать на «Нет» :)',
  'Давай, кликни «Нет» ещё разок',
  'Кликни ещё на «Нет»',
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = false

const dogGif = document.getElementById('dog-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Пробуем запустить музыку сразу (как в оригинальном проекте),
// если браузер не даёт — включаем по первому клику.
if (music) {
  music.muted = true
  music.volume = 0.25
  music
    .play()
    .then(() => {
      music.muted = false
      musicPlaying = true
      const toggle = document.getElementById('music-toggle')
      if (toggle) toggle.textContent = '🔊'
    })
    .catch(() => {
      document.addEventListener(
        'click',
        () => {
          music.muted = false
          music
            .play()
            .then(() => {
              musicPlaying = true
              const toggle = document.getElementById('music-toggle')
              if (toggle) toggle.textContent = '🔊'
            })
            .catch(() => {})
        },
        { once: true },
      )
    })
}

function toggleMusic() {
  if (!music) return
  if (musicPlaying) {
    music.pause()
    musicPlaying = false
    document.getElementById('music-toggle').textContent = '🔇'
  } else {
    music.muted = false
    music.play().catch(() => {})
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'
  }
}

function handleYesClick() {
  if (!runawayEnabled) {
    const index = Math.min(yesTeasedCount, yesTeasePokes.length - 1)
    const msg = yesTeasePokes[index]
    yesTeasedCount++
    showTeaseMessage(msg)
    return
  }
  window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
  const toast = document.getElementById('tease-toast')
  if (!toast) return
  toast.textContent = msg
  toast.classList.add('show')
  clearTimeout(toast._timer)
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600)
}

function handleNoClick() {
  noClickCount++

  const msgIndex = Math.min(noClickCount, noMessages.length - 1)
  noBtn.textContent = noMessages[msgIndex]

  // Увеличиваем кнопку «Да»
  const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
  yesBtn.style.fontSize = `${currentSize * 1.3}px`
  const padY = Math.min(13 + noClickCount * 4.5, 52)
  const padX = Math.min(34 + noClickCount * 10, 140)
  yesBtn.style.padding = `${padY}px ${padX}px`

  // Уменьшаем кнопку «Нет»
  if (noClickCount >= 2) {
    const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
    noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
  }

  // Меняем гифку
  const gifIndex = Math.min(noClickCount, gifStages.length - 1)
  swapGif(gifStages[gifIndex])

  // Включаем «убегающую» кнопку ТОЛЬКО на последней фразе
  if (!runawayEnabled && msgIndex === noMessages.length - 1) {
    enableRunaway()
    runawayEnabled = true
  }
}

function swapGif(src) {
  if (!dogGif) return
  dogGif.classList.add('fade-out')
  setTimeout(() => {
    dogGif.src = src
    dogGif.classList.remove('fade-out')
  }, 200)
}

function enableRunaway() {
  noBtn.addEventListener('mouseover', runAway)
  noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
  const margin = 20
  const btnW = noBtn.offsetWidth
  const btnH = noBtn.offsetHeight
  const maxX = window.innerWidth - btnW - margin
  const maxY = window.innerHeight - btnH - margin

  const randomX = Math.random() * maxX + margin / 2
  const randomY = Math.random() * maxY + margin / 2

  noBtn.style.position = 'fixed'
  noBtn.style.left = `${randomX}px`
  noBtn.style.top = `${randomY}px`
  noBtn.style.zIndex = '50'
}

yesBtn.addEventListener('click', handleYesClick)
noBtn.addEventListener('click', handleNoClick)

