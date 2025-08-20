import { shouldUseFlatConfig } from "eslint/use-at-your-own-risk";
import resolveCollision from "./collisions3";
const canvas = document.querySelector("canvas"); const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight; canvas.width = window.innerWidth;

class partial {
    constructor(positionX, positionY, radius) {
        this.initialcolor = `hsl(${Math.random() * 360}, 10%, 70%)`; this.defaultcolor = this.initialcolor;
        this.positionX = positionX; this.positionY = positionY; this.radius = radius;
        const speed = 10; const Sangle = Math.random() * Math.PI * 2; this.startA = 0; this.linew = 2;
        this.velocityX = Math.cos(Sangle) * speed; this.velocityY = Math.sin(Sangle) * speed;
    }
    configpositions() {
        if (this.positionX + this.radius > canvas.width) { this.positionX = canvas.width - this.radius; this.velocityX *= -1 };
        if (this.positionX - this.radius < 0) { this.positionX = this.radius; this.velocityX *= -1 };
        if (this.positionY + this.radius > canvas.height) { this.positionY = canvas.height - this.radius; this.velocityY *= -1 };
        if (this.positionY - this.radius < 0) { this.positionY = this.radius; this.velocityY *= -1 };
        this.positionX += this.velocityX; this.positionY += this.velocityY; this.creation();
    }
    creation() {
        ctx.beginPath(); ctx.lineWidth = this.linew; ctx.strokeStyle = this.initialcolor;
        ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 60%)`;
        ctx.arc(this.positionX, this.positionY, this.radius, this.startA, Math.PI * 2, false);
        ctx.fill(); ctx.stroke(); ctx.closePath();
    }
} let partials = []; for (let j = 0; j < 20; j++) {
    const randomX = Math.random() * 50; const randomY = Math.random() * 50;
    partials.push(new partial(randomX, randomY, 20))
};
function detection() {
    for (let j = 0; j < partials.length; j++) {
        for (let i = j + 1; i < partials.length; i++) {
            const p1 = partials[j]; const p2 = partials[i];
            const dx = p1.positionX - p2.positionX; const dy = p1.positionY - p2.positionY;
            const distance = Math.hypot(dx, dy);
            if (distance < p1.radius + p2.radius) { resolveCollision(p1, p2) }
        }
    }
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); detection();
    for (const j of partials) { j.configpositions(); }; requestAnimationFrame(animate);
} animate();