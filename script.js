let score = 0;
let timeLeft = 30;
let gameRunning = true;

const star = document.getElementById("star");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const gameArea = document.getElementById("gameArea");
const gameOverText = document.getElementById("gameOver");

function moveStar() {
    if (!gameRunning) return;

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    star.style.left = x + "px";
    star.style.top = y + "px";
}

star.onclick = function () {
    if (!gameRunning) return;

    score++;
    scoreText.textContent = score;
    moveStar();
};

// ⏱️ TIMER
const timer = setInterval(() => {
    timeLeft--;
    timeText.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        gameRunning = false;
        star.style.display = "none";
        gameOverText.textContent = "⏰ Game Over! Punkte: " + score;
    }
}, 1000);

moveStar();
