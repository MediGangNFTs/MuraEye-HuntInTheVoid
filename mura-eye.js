
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("voidEye");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  let eyeX = canvas.width / (2 * dpr);
  let eyeY = canvas.height - 100;
  let targetX = eyeX, targetY = eyeY;
  let mouseX = eyeX, mouseY = eyeY;
  let blink = false, blinkTimer = 0;
  let scareOffset = 0, idleTime = 0;
  let mood = "idle", moodTimer = 0;
  let offScreen = false, offTimer = 0;
  let sonarRings = [];

  function setMood(newMood) {
    mood = newMood;
    moodTimer = 0;
    if (newMood === "scan") {
      for (let i = 0; i < 5; i++) {
        sonarRings.push({ radius: 0, alpha: 1 });
      }
    }
  }

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    idleTime = 0;
  });

  document.addEventListener("touchmove", e => {
    if (e.touches[0]) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      idleTime = 0;
    }
  }, { passive: true });

  document.addEventListener("scroll", () => {
    idleTime = 0;
  });

  document.addEventListener("click", () => {
    scareOffset = 10;
    setMood("startled");
    targetX = mouseX;
    targetY = mouseY;
    if (offScreen) returnEye();
  });

  document.addEventListener("touchstart", e => {
    if (e.touches[0]) {
      scareOffset = 10;
      setMood("startled");
      targetX = e.touches[0].clientX;
      targetY = e.touches[0].clientY;
      if (offScreen) returnEye();
    }
  });

  function sendOffScreen() {
    offScreen = true;
    targetX = canvas.width / dpr + 100;
    targetY = Math.random() * canvas.height / dpr;
    offTimer = 300 + Math.random() * 200;
  }

  function returnEye() {
    offScreen = false;
    targetX = Math.random() * canvas.width / dpr;
    targetY = Math.random() * canvas.height / dpr;
    setMood("patrol");
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    idleTime++;
    moodTimer++;
    if (mood === "idle" && idleTime > 300) setMood("patrol");
    if (!offScreen && idleTime > 800) setMood("scan");
    if (!offScreen && idleTime > 1200) sendOffScreen();
    if (offScreen && --offTimer <= 0) returnEye();
    if (mood === "patrol") {
      targetX += Math.sin(Date.now() / 800) * 0.5;
      targetY += Math.cos(Date.now() / 1000) * 0.5;
    }
    if (mood === "scan") {
      targetX = canvas.width / (2 * dpr);
      targetY = canvas.height / (2 * dpr);
    }
    eyeX += (targetX - eyeX) * 0.004;
    eyeY += (targetY - eyeY) * 0.004;
    const dx = mouseX - eyeX;
    const dy = mouseY - eyeY;
    const angle = Math.atan2(dy, dx);
    const pupilDist = blink ? 0 : 10;
    const pupilX = eyeX + Math.cos(angle) * pupilDist + scareOffset;
    const pupilY = eyeY + Math.sin(angle) * pupilDist + scareOffset;
    const radius = 30;

    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur = 15;
    const gradient = ctx.createRadialGradient(eyeX - 10, eyeY - 15, 5, eyeX, eyeY, radius);
    gradient.addColorStop(0, "#222");
    gradient.addColorStop(1, "#000");
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(eyeX, eyeY, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,0,0,0.3)";
    ctx.lineWidth = 3;
    ctx.stroke();

    const gloss = ctx.createRadialGradient(eyeX - 15, eyeY - 18, 0, eyeX - 15, eyeY - 18, 10);
    gloss.addColorStop(0, "rgba(255,255,255,0.8)");
    gloss.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(eyeX - 10, eyeY - 12, 10, 0, Math.PI * 2);
    ctx.fillStyle = gloss;
    ctx.fill();

    if (!blink) {
      ctx.beginPath();
      const s = 6;
      ctx.moveTo(pupilX, pupilY - s);
      ctx.lineTo(pupilX + s, pupilY);
      ctx.lineTo(pupilX, pupilY + s);
      ctx.lineTo(pupilX - s, pupilY);
      ctx.closePath();
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(eyeX - 15, eyeY);
      ctx.lineTo(eyeX + 15, eyeY);
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (mood === "scan") {
      sonarRings.forEach((ring, i) => {
        ring.radius += 1.5;
        ring.alpha *= 0.97;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,0,0,${ring.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      sonarRings = sonarRings.filter(r => r.alpha > 0.05);
    }

    blinkTimer++;
    if (blinkTimer > 240 + Math.random() * 240) {
      blink = true;
      setTimeout(() => blink = false, 100 + Math.random() * 100);
      blinkTimer = 0;
    }
    scareOffset *= 0.9;
    requestAnimationFrame(draw);
  }
  draw();
});
