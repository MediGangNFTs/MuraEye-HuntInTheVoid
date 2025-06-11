
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let orb = { x: canvas.width / 2, y: canvas.height / 2, r: 20 };
let eye = { x: canvas.width / 4, y: canvas.height / 4, r: 40, tracking: true };
let touch = { x: orb.x, y: orb.y };

canvas.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    touch.x = t.clientX;
    touch.y = t.clientY;
}, false);

canvas.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    orb.x = t.clientX;
    orb.y = t.clientY;
}, false);

function drawOrb() {
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    ctx.fillStyle = "#88ccff";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
}

function drawEye() {
    ctx.beginPath();
    ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.shadowColor = "red";
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(eye.x, eye.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}

function updateEye() {
    const dx = orb.x - eye.x;
    const dy = orb.y - eye.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (eye.tracking && dist > 1) {
        eye.x += dx * 0.01;
        eye.y += dy * 0.01;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateEye();
    drawOrb();
    drawEye();
    requestAnimationFrame(animate);
}

animate();
