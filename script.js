let score = 0;
let timeLeft = 30;
let gameRunning = true;

const star = document.getElementById("star");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const gameArea = document.getElementById("gameArea");
const gameOverText = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");
const highscoreText = document.getElementById("highscore");
const soundBtn = document.getElementById("soundBtn");

const clickSound = document.getElementById("clickSound");
const bonusSound = document.getElementById("bonusSound");
const gameOverSound = document.getElementById("gameOverSound");

// Sound an/aus
let soundOn = true;

soundBtn.onclick = () => {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? "🔊 Sound: AN" : "🔇 Sound: AUS";
};

// Highscore laden
let highscore = localStorage.getItem("highscore") || 0;
highscoreText.textContent = highscore;

function moveStar() {
    if (!gameRunning) return;

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    star.style.left = x + "px";
    star.style.top = y + "px";
}

function playSound(sound) {
    if (!soundOn) return;
    sound.currentTime = 0;
    sound.play();
}

// Klick auf Stern
star.onclick = () => {
    if (!gameRunning) return;

    score++;
    scoreText.textContent = score;

    // Verschiedene Sounds je Punkte
    if (score % 5 === 0) {
        playSound(bonusSound); // jeder 5. Punkt = Bonus Sound
    } else {
        playSound(clickSound); // normaler Sound
    }

    // Stern wird schneller je mehr Punkte (Stufen)
    clearInterval(autoMove);

    let speed = 1500; // Standard

    if (score >= 30) {
        speed = 400;
    } else if (score >= 20) {
        speed = 650;
    } else if (score >= 10) {
        speed = 900;
    }

    autoMove = setInterval(moveStar, speed);

    moveStar();
};

// Stern bewegt sich automatisch (langsamer)
let autoMove = setInterval(moveStar, 1500);

// Timer
const timer = setInterval(() => {
    timeLeft--;
    timeText.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        clearInterval(autoMove);
        gameRunning = false;
        star.style.display = "none";
        gameOverText.textContent = "⏰ Game Over! Punkte: " + score;

        // Game Over Sound
        if (soundOn) {
            gameOverSound.currentTime = 0;
            gameOverSound.play();
        }

        // Highscore speichern
        if (score > highscore) {
            localStorage.setItem("highscore", score);
            highscoreText.textContent = score;
        }
    }
}, 1000);

// Neustart
restartBtn.onclick = () => {
    location.reload();
};

moveStar();
