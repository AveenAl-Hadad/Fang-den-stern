// --------------------
// 1) Grundwerte
// --------------------
let score = 0;
let timeLeft = 30;
let gameRunning = true;
let level = 1;

let autoMove;
let timer;

// --------------------
// 2) HTML Elemente
// --------------------
const star = document.getElementById("star");
const bomb = document.getElementById("bomb");
const bonus = document.getElementById("bonus");

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const levelText = document.getElementById("levelText");
const gameArea = document.getElementById("gameArea");

const gameOverText = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

const highscoreText = document.getElementById("highscore");

const levelPopup = document.getElementById("levelPopup");
const popupText = document.getElementById("popupText");
const popupYes = document.getElementById("popupYes");
const popupNo = document.getElementById("popupNo");

const winMessage = document.getElementById("winMessage");
const confettiContainer = document.getElementById("confetti");

// Sounds
const clickSound = document.getElementById("clickSound");
const bonusSound = document.getElementById("bonusSound");
const bombSound = document.getElementById("bombSound");
const gameOverSound = document.getElementById("gameOverSound");
const winSound = document.getElementById("winSound");

// --------------------
// 3) Highscore
// --------------------
let highscore = localStorage.getItem("highscore") || 0;
highscoreText.textContent = highscore;

// --------------------
// 4) Sound Funktion
// --------------------
let soundOn = true;
function playSound(sound) {
    if (!soundOn) return;
    sound.currentTime = 0;
    sound.play();
}

// --------------------
// 5) Confetti
// --------------------
function showConfetti() {
    confettiContainer.innerHTML = "";
    for (let i = 0; i < 100; i++) {
        const c = document.createElement("div");
        c.classList.add("confetti-piece");
        c.style.left = Math.random() * 100 + "vw";
        c.style.animationDuration = 2 + Math.random() * 3 + "s";
        c.style.backgroundColor =
            ["red", "yellow", "blue", "green", "pink"][Math.floor(Math.random() * 5)];
        confettiContainer.appendChild(c);
    }
}

// --------------------
// 6) Objekte bewegen
// --------------------
function moveObjects() {
    if (!gameRunning) return;

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;

    star.style.left = Math.random() * maxX + "px";
    star.style.top = Math.random() * maxY + "px";

    bomb.style.left = Math.random() * maxX + "px";
    bomb.style.top = Math.random() * maxY + "px";

    bonus.style.left = Math.random() * maxX + "px";
    bonus.style.top = Math.random() * maxY + "px";
}

// --------------------
// 7) Timer starten
// --------------------
function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        if (!gameRunning) return;

        timeLeft--;
        timeText.textContent = timeLeft;

        if (timeLeft <= 0) endLevelByTime();
    }, 1000);
}

// --------------------
// 8) Zeit abgelaufen
// --------------------
function endLevelByTime() {
    clearInterval(timer);
    clearInterval(autoMove);
    gameRunning = false;

    star.style.display = "none";
    bomb.style.display = "none";
    bonus.style.display = "none";

    if (level === 1 && score >= 20) {
        showPopup("🎉 Level Leicht geschafft! Weiter zu Medium?");
        playSound(winSound);
    }
    else if (level === 2 && score >= 40) {
        showPopup("🔥 Level Medium geschafft! Weiter zu Hart?");
        playSound(winSound);
    }
    else if (level === 3 && score >= 60) {
        winMessage.style.display = "block";
        showConfetti();
        playSound(winSound);
    }
    else {
        gameOverText.style.display = "block";
        gameOverText.textContent = "💔 Game Over 😢 Punkte: " + score;
        playSound(gameOverSound);
    }

    if (score > highscore) {
        localStorage.setItem("highscore", score);
        highscoreText.textContent = score;
    }
}

// --------------------
// 9) Level setzen
// --------------------
function setLevel(newLevel) {
    clearInterval(autoMove);
    clearInterval(timer);

    level = newLevel;
    gameRunning = true;

    star.style.display = "block";
    bomb.style.display = "none";
    bonus.style.display = "none";

    if (level === 1) {
        levelText.textContent = "Leicht";
        timeLeft = 30;
        autoMove = setInterval(moveObjects, 1500);
    }
    else if (level === 2) {
        levelText.textContent = "Medium";
        timeLeft = 45;
        autoMove = setInterval(moveObjects, 1000);
    }
    else {
        levelText.textContent = "Hart";
        timeLeft = 60;
        autoMove = setInterval(moveObjects, 700);
    }

    timeText.textContent = timeLeft;
    startTimer();
    moveObjects();
}

// --------------------
// 10) Popup
// --------------------
function showPopup(text) {
    popupText.textContent = text;
    levelPopup.style.display = "flex";
    gameRunning = false;
}

// Popup Buttons
popupYes.onclick = () => {
    levelPopup.style.display = "none";
    if (level === 1) setLevel(2);
    else if (level === 2) setLevel(3);
};

popupNo.onclick = () => {
    levelPopup.style.display = "none";
    gameOverText.style.display = "block";
    gameOverText.textContent = "Spiel beendet. Punkte: " + score;
};

// --------------------
// 11) Klick-Events
// --------------------
star.onclick = () => {
    if (!gameRunning) return;

    score++;
    scoreText.textContent = score;

    if (score >= 10) {
        bomb.style.display = "block";
        bonus.style.display = "block";
    }

    playSound(score % 5 === 0 ? bonusSound : clickSound);

    if (score >= 20 && level === 1) {
        showPopup("🎉 Level Leicht geschafft! Weiter zu Medium?");
        playSound(winSound);
    }
    if (score >= 40 && level === 2) {
        showPopup("🔥 Level Medium geschafft! Weiter zu Hart?");
        playSound(winSound);
    }

    moveObjects();
};

bonus.onclick = () => {
    if (!gameRunning) return;

    score += 2;
    scoreText.textContent = score;
    playSound(bonusSound);
    bonus.style.display = "none";
    moveObjects();
};

bomb.onclick = () => {
    if (!gameRunning) return;

    gameRunning = false;
    clearInterval(autoMove);
    clearInterval(timer);

    star.style.display = "none";
    bomb.style.display = "none";

    gameOverText.style.display = "block";
    gameOverText.textContent = "💥 Game Over! Bombe getroffen 😢";

    playSound(bombSound);
    setTimeout(() => playSound(gameOverSound), 400);
};

// --------------------
// 12) Neustart
// --------------------
restartBtn.onclick = () => location.reload();

// --------------------
// 13) Spiel starten
// --------------------
setLevel(1);
