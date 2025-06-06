const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let time = 45;
let gameInterval;

const muraEye = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 40,
    draw() {
        // Outer Ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#800000';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();

        // Eye
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.closePath();

        // Inner Shine
        ctx.beginPath();
        ctx.arc(this.x - 10, this.y - 10, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        ctx.closePath();

        // Pupil (Diamond shape)
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-10, -10, 20, 20);
        ctx.restore();
    }
};

function startGame() {
    score = 0;
    time = 45;
    document.getElementById('score').innerText = score;
    document.getElementById('time').innerText = time;
    gameInterval = setInterval(() => {
        time--;
        document.getElementById('time').innerText = time;
        if (time <= 0) clearInterval(gameInterval);
    }, 1000);
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    muraEye.draw();
    requestAnimationFrame(animate);
}

document.getElementById('startButton').addEventListener('click', startGame);
