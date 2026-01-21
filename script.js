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

// Klick auf Stern
star.onclick = () => {
    if (!gameRunning) return;

    score++;
    scoreText.textContent = score;
    moveStar();
};

// Stern bewegt sich automatisch
const autoMove = setInterval(() => {
    moveStar();
}, 1000);

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
