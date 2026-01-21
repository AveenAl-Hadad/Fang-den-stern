// --------------------
// 1) Grundwerte
// --------------------
let score = 0;          // Punkte des Spielers
let timeLeft = 30;      // Zeit in Sekunden
let gameRunning = true; // true = Spiel läuft, false = Spiel gestoppt

let level = 1;          // Startlevel
let autoMove;           // Variable für das automatische Bewegen (setInterval)


// --------------------
// 2) HTML Elemente holen
// --------------------
const star = document.getElementById("star");
const bomb = document.getElementById("bomb");

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
const bombSound = document.getElementById("bombSound");



// --------------------
// 3) Sound ein/aus
// --------------------
let soundOn = true; // Standard: Sound an

soundBtn.onclick = () => {
    soundOn = !soundOn; // Toggle: an -> aus / aus -> an
    soundBtn.textContent = soundOn ? "🔊 Sound: AN" : "🔇 Sound: AUS";
};


// --------------------
// 4) Highscore laden
// --------------------
let highscore = localStorage.getItem("highscore") || 0; // wenn kein Highscore: 0
highscoreText.textContent = highscore;


// --------------------
// 5) Funktion um Sound zu spielen
// --------------------
function playSound(sound) {
    if (!soundOn) return; // wenn Sound aus, dann nicht spielen
    sound.currentTime = 0; // Sound von Anfang starten
    sound.play();
}


// --------------------
// 6) Stern + Bombe bewegen
// --------------------
function moveObjects() {
    if (!gameRunning) return; // wenn Spiel gestoppt ist, nicht bewegen

    const maxX = gameArea.clientWidth - 50; // Rand rechts
    const maxY = gameArea.clientHeight - 50; // Rand unten

    // Stern zufällig positionieren
    const xStar = Math.random() * maxX;
    const yStar = Math.random() * maxY;
    star.style.left = xStar + "px";
    star.style.top = yStar + "px";

    // Bombe zufällig positionieren
    const xBomb = Math.random() * maxX;
    const yBomb = Math.random() * maxY;
    bomb.style.left = xBomb + "px";
    bomb.style.top = yBomb + "px";
}


// --------------------
// 7) Level Buttons aktiv machen
// --------------------
function setActiveButton(level) {
  level1Btn.classList.remove("active");
  level2Btn.classList.remove("active");
  level3Btn.classList.remove("active");

  if (level === 1) level1Btn.classList.add("active");
  if (level === 2) level2Btn.classList.add("active");
  if (level === 3) level3Btn.classList.add("active");
}


// --------------------
// 8) Level setzen (leicht/medium/hart)
// --------------------
function setLevel(newLevel) {
    level = newLevel;
    setActiveButton(level);
    clearInterval(autoMove); // alte Bewegung stoppen

    if (level === 1) {
        bomb.style.display = "none";  // Bombe aus (Level 1)
        levelText.textContent = "Leicht";
        timeLeft = 30;
        autoMove = setInterval(moveObjects, 1500); // langsam
    } else if (level === 2) {
        bomb.style.display = "block"; // Bombe an
        levelText.textContent = "Medium";
        timeLeft = 45;
        autoMove = setInterval(moveObjects, 1000); // schneller
    } else if (level === 3) {
        levelText.textContent = "Hart";
        timeLeft = 60;
        autoMove = setInterval(moveObjects, 700); // am schnellsten
    }

    timeText.textContent = timeLeft;
}


// --------------------
// 9) Level Buttons Click
// --------------------
level1Btn.onclick = () => setLevel(1);
level2Btn.onclick = () => setLevel(2);
level3Btn.onclick = () => setLevel(3);


// --------------------
// 10) Popup zeigen (Level geschafft)
// --------------------
function showPopup(text) {
    popupText.textContent = text;
    levelPopup.style.display = "flex";
    gameRunning = false;
    clearInterval(autoMove); // Bewegung stoppen
}


// --------------------
// 11) Popup Buttons
// --------------------
popupYes.onclick = () => {
    levelPopup.style.display = "none";
    gameRunning = true;

    if (level === 1) setLevel(2); // Level 1 -> 2
    else if (level === 2) setLevel(3); // Level 2 -> 3

    moveObjects();
};

popupNo.onclick = () => {
    levelPopup.style.display = "none";
    gameRunning = false;
    star.style.display = "none";
    bomb.style.display = "none";
    gameOverText.textContent = "Spiel beendet. Punkte: " + score;
};


// --------------------
// 12) Stern klicken
// --------------------
star.onclick = () => {
    if (!gameRunning) return; // wenn Spiel stop, nix passiert

    score++; // Punkt
    scoreText.textContent = score; // Punkt anzeigen

    if (score >= 10) {
        bomb.style.display = "block"; // Bombe ab 10 Punkten anzeigen
    }

    // Bonus Sound alle 5 Punkte
    if (score % 5 === 0) playSound(bonusSound);
    else playSound(clickSound);

    // Level fertig Popup
    if (score === 20 && level === 1) {
        showPopup("🎉 Level Leicht geschafft! Weiter zu Medium?");
    }
    if (score === 40 && level === 2) {
        showPopup("🔥 Level Medium geschafft! Weiter zu Hart?");
    }

    moveObjects(); // nach Klick sofort bewegen
};


// --------------------
// 13) Bombe klicken (Game Over)
// --------------------
bomb.onclick = () => {
    if (!gameRunning) return;

    gameRunning = false;
    clearInterval(autoMove);

    star.style.display = "none";
    bomb.style.display = "none";
    gameOverText.style.display = "block";
   
    gameOverText.textContent = "💥 Game Over! Du hast die Bombe getroffen!";
   // 1️⃣ Bomben-Sound
    playSound(bombSound);

    // 2️⃣ Game-Over-Sound leicht verzögert
    setTimeout(() => {
        playSound(gameOverSound);
    }, 400);

    // Highscore speichern
    if (score > highscore) {
        localStorage.setItem("highscore", score);
        highscoreText.textContent = score;
    }
};


// --------------------
// 14) Timer (Zeit runterzählen)
// --------------------
const timer = setInterval(() => {
    if (!gameRunning) return;

    timeLeft--;
    timeText.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        clearInterval(autoMove);
        gameRunning = false;

        star.style.display = "none";
        bomb.style.display = "none";

        gameOverText.style.display = "block";
        gameOverText.textContent = "⏰ Game Over! Punkte: " + score;
        playSound(gameOverSound);

        // Highscore speichern
        if (score > highscore) {
            localStorage.setItem("highscore", score);
            highscoreText.textContent = score;
        }
    }
}, 1000);


// --------------------
// 15) Neustart
// --------------------
restartBtn.onclick = () => {
    location.reload(); // Seite neu laden
};


// --------------------
// 16) Spiel starten
// --------------------
setLevel(level);

// Bombe nach 10 Sekunden anzeigen
setTimeout(() => {
  bomb.style.display = "block";
}, 10000);

moveObjects();
