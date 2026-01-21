let score = 0;
let timeLeft = 30;
let gameRunning = true;

let level = 1;
let autoMove;

const star = document.getElementById("star");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const gameArea = document.getElementById("gameArea");
const gameOverText = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");
const highscoreText = document.getElementById("highscore");
const levelText = document.getElementById("levelText");
const soundBtn = document.getElementById("soundBtn");

const level1Btn = document.getElementById("level1Btn");
const level2Btn = document.getElementById("level2Btn");
const level3Btn = document.getElementById("level3Btn");

const levelPopup = document.getElementById("levelPopup");
const popupText = document.getElementById("popupText");
const popupYes = document.getElementById("popupYes");
const popupNo = document.getElementById("popupNo");

const clickSound = document.getElementById("clickSound");
const bonusSound = document.getElementById("bonusSound");
const gameOverSound = document.getElementById("gameOverSound");

let soundOn = true;
soundBtn.onclick = () => {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? "🔊 Sound: AN" : "🔇 Sound: AUS";
};

let highscore = localStorage.getItem("highscore") || 0;
highscoreText.textContent = highscore;

function playSound(sound) {
    if (!soundOn) return;
    sound.currentTime = 0;
    sound.play();
}

function moveStar() {
    if (!gameRunning) return;

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    star.style.left = x + "px";
    star.style.top = y + "px";
}

function setActiveButton(level) {
  level1Btn.classList.remove("active");
  level2Btn.classList.remove("active");
  level3Btn.classList.remove("active");

  if (level === 1) level1Btn.classList.add("active");
  if (level === 2) level2Btn.classList.add("active");
  if (level === 3) level3Btn.classList.add("active");
}

function setLevel(newLevel) {
    level = newLevel;
    setActiveButton(level);
    clearInterval(autoMove);

    if (level === 1) {
        levelText.textContent = "Leicht";
        timeLeft = 30;
        autoMove = setInterval(moveStar, 1500);
    } else if (level === 2) {
        levelText.textContent = "Medium";
        timeLeft = 45;
        autoMove = setInterval(moveStar, 1000);
    } else if (level === 3) {
        levelText.textContent = "Hart";
        timeLeft = 60;
        autoMove = setInterval(moveStar, 700);
    }

    timeText.textContent = timeLeft;
}

level1Btn.onclick = () => setLevel(1);
level2Btn.onclick = () => setLevel(2);
level3Btn.onclick = () => setLevel(3);

function showPopup(text) {
    popupText.textContent = text;
    levelPopup.style.display = "flex";
    gameRunning = false;
    clearInterval(autoMove);
}

popupYes.onclick = () => {
    levelPopup.style.display = "none";
    gameRunning = true;

    if (level === 1) setLevel(2);
    else if (level === 2) setLevel(3);

    moveStar();
};

popupNo.onclick = () => {
    levelPopup.style.display = "none";
    gameRunning = false;
    star.style.display = "none";
    gameOverText.textContent = "Spiel beendet. Punkte: " + score;
};

star.onclick = () => {
    if (!gameRunning) return;

    score++;
    scoreText.textContent = score;

    if (score % 5 === 0) playSound(bonusSound);
    else playSound(clickSound);

    if (score === 20 && level === 1) {
        showPopup("🎉 Level Leicht geschafft! Weiter zu Medium?");
    }
    if (score === 40 && level === 2) {
        showPopup("🔥 Level Medium geschafft! Weiter zu Hart?");
    }

    moveStar();
};

const timer = setInterval(() => {
    if (!gameRunning) return;

    timeLeft--;
    timeText.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        clearInterval(autoMove);
        gameRunning = false;
        star.style.display = "none";
        gameOverText.textContent = "⏰ Game Over! Punkte: " + score;

        playSound(gameOverSound);

        if (score > highscore) {
            localStorage.setItem("highscore", score);
            highscoreText.textContent = score;
        }
    }
}, 1000);

restartBtn.onclick = () => {
    location.reload();
};

setLevel(level);
moveStar();
