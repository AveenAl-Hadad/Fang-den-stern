console.log("Script läuft");

let score = 0;
const star = document.getElementById("star");
const scoreText = document.getElementById("score");
const gameArea = document.getElementById("gameArea");

function moveStar() {
    const x = Math.random() * (gameArea.clientWidth - 40);
    const y = Math.random() * (gameArea.clientHeight - 40);
    star.style.left = x + "px";
    star.style.top = y + "px";
}

star.addEventListener("click", () => {
    score++;
    scoreText.textContent = score;
    moveStar();
});

moveStar();
