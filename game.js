
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let timeLeft = 45;
let gameInterval, timerInterval;

document.getElementById('start-game').onclick = () => {
  score = 0;
  timeLeft = 45;
  document.getElementById('score').textContent = 'Score: 0';
  document.getElementById('timer').textContent = 'Time: 45';
  clearInterval(timerInterval);
  clearInterval(gameInterval);
  startGame();
};

function startGame() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = 'Time: ' + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(gameInterval);
      alert('Game Over! Score: ' + score);
    }
  }, 1000);

  gameInterval = setInterval(() => {
    drawGame();
  }, 1000 / 60);
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Placeholder for drawing Mura Eye and diamonds
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
  ctx.fill();
}
