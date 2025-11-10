let secretNumber;
let attemptsLeft;
let score = 0;

const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");
const remaining = document.getElementById("remaining");
const scoreDisplay = document.getElementById("score");
const fireworksCanvas = document.getElementById("fireworks");
const ctx = fireworksCanvas.getContext("2d");

fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

function initGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attemptsLeft = 10;
  message.textContent = "";
  guessInput.value = "";
  remaining.textContent = attemptsLeft;
  restartBtn.classList.add("hidden");
  guessBtn.disabled = false;
  guessInput.disabled = false;
  document.body.style.background = "linear-gradient(135deg, #000000, #111111)";
  stopFireworks();
}

function checkGuess() {
  const userGuess = Number(guessInput.value);
  if (!userGuess || userGuess < 1 || userGuess > 100) {
    message.textContent = "⚠️ Enter a valid number (1–100)";
    message.className = "";
    return;
  }

  attemptsLeft--;
  remaining.textContent = attemptsLeft;

  const difference = Math.abs(userGuess - secretNumber);

  if (userGuess === secretNumber) {
    message.textContent = `🎉 Correct! The number was ${secretNumber}`;
    message.className = "correct";
    score += 10;
    scoreDisplay.textContent = score;
    document.body.style.background = "linear-gradient(135deg, #003300, #00ff99)";
    startFireworks();
    endGame();
  } else if (difference <= 5) {
    message.textContent = "🔥 Very close!";
    message.className = "veryClose";
  } else if (userGuess > secretNumber) {
    message.textContent = "📉 Too high!";
    message.className = "tooHigh";
  } else {
    message.textContent = "📈 Too low!";
    message.className = "tooLow";
  }

  if (attemptsLeft <= 0 && userGuess !== secretNumber) {
    message.textContent = `💀 You lost! The number was ${secretNumber}`;
    message.className = "lost";
    document.body.style.background = "linear-gradient(135deg, #550000, #220000)";
    endGame();
  }
}

function endGame() {
  guessBtn.disabled = true;
  guessInput.disabled = true;
  restartBtn.classList.remove("hidden");
}

/* ------------------ FIREWORKS ------------------ */
let particles = [];

function startFireworks() {
  particles = [];
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: fireworksCanvas.width / 2,
      y: fireworksCanvas.height / 2,
      radius: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: (Math.random() - 0.5) * 10,
      gravity: 0.1,
      alpha: 1
    });
  }
  animateFireworks();
}

function animateFireworks() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  particles.forEach((p) => {
    p.x += p.velocityX;
    p.y += p.velocityY;
    p.velocityY += p.gravity;
    p.alpha -= 0.01;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${p.color}`;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  if (particles.some(p => p.alpha > 0)) {
    requestAnimationFrame(animateFireworks);
  }
}

function stopFireworks() {
  ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
}

guessBtn.addEventListener("click", checkGuess);
restartBtn.addEventListener("click", initGame);
guessInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkGuess();
});

initGame();
