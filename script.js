// --------------------
// Grundwerte
// --------------------
let score = 0;
let timeLeft = 30;
let level = 1;
let gameRunning = true;

let autoMove;
let timer;
let starSpeed = 1500;

let bossLife = 3;
let highscore = 0;
let soundOn = true;

// --------------------
// Elemente
// --------------------
const star = document.getElementById("star");
const bomb = document.getElementById("bomb");
const bonus = document.getElementById("bonus");
const slow = document.getElementById("slow");
const timePlus = document.getElementById("timePlus");
const boss = document.getElementById("boss");

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const levelText = document.getElementById("levelText");
const gameArea = document.getElementById("gameArea");
const gameOverText = document.getElementById("gameOver");
const winMessage = document.getElementById("winMessage");

const soundBtn = document.getElementById("soundBtn");
const restartBtn = document.getElementById("restartBtn");

const level1Btn = document.getElementById("level1Btn");
const level2Btn = document.getElementById("level2Btn");
const level3Btn = document.getElementById("level3Btn");

const levelPopup = document.getElementById("levelPopup");
const popupText = document.getElementById("popupText");
const popupYes = document.getElementById("popupYes");
const popupNo = document.getElementById("popupNo");

const confettiContainer = document.getElementById("confetti");

const clickSound = document.getElementById("clickSound");
const bonusSound = document.getElementById("bonusSound");
const bombSound = document.getElementById("bombSound");
const gameOverSound = document.getElementById("gameOverSound");
const winSound = document.getElementById("winSound");

// --------------------
// Highscore laden
// --------------------
highscore = localStorage.getItem("highscore") || 0;
document.getElementById("highscore").textContent = highscore;

// --------------------
// Sound
// --------------------
function playSound(sound) {
  if (!soundOn) return;
  if (!sound) return;
  sound.currentTime = 0;
  sound.play();
}

// --------------------
// Confetti zeigen
// --------------------
function showConfetti() {
  const confetti = document.getElementById("confetti");
  confetti.innerHTML = "";

  const colors = ["#00ff00", "#ffff00", "#0000ff", "#ff00ff", "#ff66cc"]; // grün, gelb, blau, lila, rosa

  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");

    // zufällige Farbe
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Startposition oben zufällig
    piece.style.left = Math.random() * 100 + "%";
    piece.style.top = "-20px";

    // zufällige Größe
    const size = Math.random() * 10 + 5;
    piece.style.width = size + "px";
    piece.style.height = size + "px";

    // zufällige Geschwindigkeit (damit es wie Regen aussieht)
    const duration = Math.random() * 2 + 2;
    piece.style.animationDuration = duration + "s";

    confetti.appendChild(piece);
  }

  // Konfetti nach 3 Sekunden entfernen
  setTimeout(() => {
    confetti.innerHTML = "";
  }, 3000);
}


// --------------------
// Bewegung
// --------------------
function moveObjects() {
  if (!gameRunning) return;

  const maxX = gameArea.clientWidth - 50;
  const maxY = gameArea.clientHeight - 50;

  [star, bomb, bonus, slow, timePlus, boss].forEach(el => {
    if (el.style.display !== "none") {
      el.style.left = Math.random() * maxX + "px";
      el.style.top = Math.random() * maxY + "px";
    }
  });
}

// --------------------
// Timer
// --------------------
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!gameRunning) return;
    timeLeft--;
    timeText.textContent = timeLeft;
    if (timeLeft <= 0) endGame(false);
  }, 1000);
}

// --------------------
// Spielende
// --------------------
function endGame(win) {
  gameRunning = false;
  clearInterval(timer);
  clearInterval(autoMove);

  star.style.display =
  bomb.style.display =
  bonus.style.display =
  slow.style.display =
  timePlus.style.display =
  boss.style.display = "none";

  if (win) {
    winMessage.style.display = "block";
    showConfetti();
    playSound(winSound);
  } else {
    gameOverText.style.display = "block";
    gameOverText.textContent = "💔 Game Over 😢";
    playSound(gameOverSound);
  }

  // Highscore speichern
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("highscore", highscore);
    document.getElementById("highscore").textContent = highscore;
  }
}

// --------------------
// Popup zeigen
// --------------------
function showPopup(text) {
  popupText.textContent = text;
  levelPopup.style.display = "flex";
  gameRunning = false;
  clearInterval(autoMove);
  clearInterval(timer);
}

// --------------------
// Level setzen
// --------------------
function setLevel(lvl) {
  clearInterval(autoMove);
  clearInterval(timer);

  level = lvl;
  gameRunning = true;

  levelPopup.style.display = "none";
  gameOverText.style.display = "none";
  winMessage.style.display = "none";

  star.style.display = "block";
  bomb.style.display = "none";
  bonus.style.display = "none";
  slow.style.display = "none";
  timePlus.style.display = "none";
  boss.style.display = "none";

  if (level === 1) {
    levelText.textContent = "Leicht";
    timeLeft = 30;
    starSpeed = 1500;
  }
  if (level === 2) {
    levelText.textContent = "Medium";
    timeLeft = 45;
    starSpeed = 1000;
  }
  if (level === 3) {
    levelText.textContent = "Hart";
    timeLeft = 60;
    starSpeed = 800;
    boss.style.display = "block";
    bossLife = 3;
  }

  autoMove = setInterval(moveObjects, starSpeed);
  timeText.textContent = timeLeft;
  startTimer();
  moveObjects();
}

// --------------------
// Level geschafft prüfen
// --------------------
function checkLevelSuccess() {
  if (level === 1 && score >= 20) {
    showPopup("🎉 Level Leicht geschafft! Weiter zu Medium?");
    playSound(winSound);
    showConfetti();
  } else if (level === 2 && score >= 40) {
    showPopup("🔥 Level Medium geschafft! Weiter zu Hart?");
    playSound(winSound);
    showConfetti();
  } else if (level === 3 && score >= 60) {
    winMessage.style.display = "block";
    showConfetti();
    playSound(winSound);
  }
}


// --------------------
// Klicks
// --------------------
star.onclick = () => {
  if (!gameRunning) return;

  score++;
  scoreText.textContent = score;

  // Objekte anzeigen
  if (score >= 5) bomb.style.display = "block";
  if (score >= 10) bonus.style.display = "block";
  if (score >= 15) slow.style.display = "block";
  if (score >= 20) timePlus.style.display = "block";

  playSound(clickSound);
  moveObjects();
   // ✔️ Level prüfen
  checkLevelSuccess();

};

// Bonus
bonus.onclick = () => {
  if (!gameRunning) return;
  score += 2;
  scoreText.textContent = score;
  bonus.style.display = "none";
  playSound(bonusSound);

  // ✔️ Level prüfen
  checkLevelSuccess();
};

// Slow Powerup
slow.onclick = () => {
  if (!gameRunning) return;
  slow.style.display = "none";

  clearInterval(autoMove);
  autoMove = setInterval(moveObjects, 2500);

  setTimeout(() => {
    clearInterval(autoMove);
    autoMove = setInterval(moveObjects, starSpeed);
  }, 5000);
};

// Time Plus
timePlus.onclick = () => {
  if (!gameRunning) return;
  timeLeft += 5;
  timeText.textContent = timeLeft;
  timePlus.style.display = "none";
};

// Boss
boss.onclick = () => {
  if (!gameRunning) return;
  if (level !== 3) return;

  bossLife--;
  if (bossLife <= 0) endGame(true);
};

// Bombe klicken = Game Over
bomb.onclick = () => {
  if (!gameRunning) return;

  playSound(bombSound);
  endGame(false);
};

// --------------------
// BUTTONS 
// --------------------
soundBtn.onclick = () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔊 Sound: AN" : "🔇 Sound: AUS";
};

restartBtn.onclick = () => {
  location.reload();
};

level1Btn.onclick = () => setLevel(1);
level2Btn.onclick = () => setLevel(2);
level3Btn.onclick = () => setLevel(3);

// Popup Buttons
popupYes.onclick = () => {
  levelPopup.style.display = "none";
  if (level === 1) setLevel(2);
  else if (level === 2) setLevel(3);
};

popupNo.onclick = () => {
  levelPopup.style.display = "none";
  endGame(false);
};

// --------------------
// Start
// --------------------
setLevel(1);
