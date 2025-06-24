const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let eyeImage = new Image();
eyeImage.src = "../public/assets/void_eye.png"; // Replace with real image later

const eye = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 80,
  height: 80,
  speed: 5
};

// Starfield background
function initStars() {
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 1.5 + 0.5
    });
  }
}

function updateStars() {
  for (let star of stars) {
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  }
}

function drawStars() {
  ctx.fillStyle = "white";
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Eye drawing
function drawEye() {
  ctx.drawImage(eyeImage, eye.x - eye.width / 2, eye.y - eye.height / 2, eye.width, eye.height);
}

// Input
let mouseX = canvas.width / 2;

canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
});

// Game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateStars();
  drawStars();

  // Move eye toward mouse
  eye.x += (mouseX - eye.x) * 0.1;
  drawEye();

  requestAnimationFrame(animate);
}

initStars();
animate();
