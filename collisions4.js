import resolveCollision from "./collisions3";
/* @type {HTMLCanvasElement} **/
const canvas = document.querySelector("canvas"); const context = canvas.getContext("2d");
canvas.height = window.innerHeight; canvas.width = window.innerWidth;
window.addEventListener("resize", () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight });
const clientm = { x: undefined, y: undefined }; canvas.addEventListener("mousemove", (event) => {
    clientm.x = event.clientX; clientm.y = event.clientY;
}); class partial {
    constructor(radius, x, y) {
        this.radius = radius; this.positionX = x; this.positionY = y; this.startA = 0; this.mass = 1; this.lineWidth = 1;
        this.initialcolor = `hsl(${Math.random() * 360}, 0%, 72%)`; this.defaultcolor = this.initialcolor;
        const initialspeed = 1; const angleS = Math.random() * Math.PI * 2;
        this.velocityX = Math.cos(angleS) * initialspeed; this.velocityY = Math.sin(angleS) * initialspeed;
    }
    configpositions() {
        if (this.positionX + this.radius > canvas.width) { this.positionX = canvas.width - this.radius; this.velocityX *= -1 };
        if (this.positionY + this.radius > canvas.height) { this.positionY = canvas.height - this.radius; this.velocityY *= -1 };
        if (this.positionX - this.radius < 0) { this.positionX = this.radius; this.velocityX *= -1 };
        if (this.positionY - this.radius < 0) { this.positionY = this.radius; this.velocityY *= -1 };
        this.positionX += this.velocityX; this.positionY += this.velocityY; this.creating();
        if (clientm.x !== undefined && clientm.y !== undefined) {
            const dx = clientm.x - this.positionX; const dy = clientm.y - this.positionY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.radius) { this.initialcolor = `hsl(0, 0%, 0%)` };
            if (dist > this.radius) { this.initialcolor = this.defaultcolor };
        }
    }
    creating() {
        context.beginPath(); context.lineWidth = this.lineWidth; context.fillStyle = this.initialcolor;
        context.strokeStyle = `hsl(0, 0%, 0%)`;
        context.arc(this.positionX, this.positionY, this.radius, this.startA, Math.PI * 2, false);
        context.fill(); context.stroke(); context.closePath();
    }
} const partials = []; for (let j = 0; j < 10; j++) { partials.push(new partial(30, 70, 52)) };
// using 2nd dimensional collisions cs it resembles more realism unlike 1d collisions
function detectCollisions() {
    for (let i = 0; i < partials.length; i++) {
        for (let j = i + 1; j < partials.length; j++) {
            const p1 = partials[i]; const p2 = partials[j];
            const dx = p1.positionX - p2.positionX; const dy = p1.positionY - p2.positionY;
            const displacement = Math.hypot(dx, dy); if (displacement < p1.radius + p2.radius) { resolveCollision(p1, p2) };
        }
    }
}
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height); detectCollisions();
    for (const j of partials) { j.configpositions(); } requestAnimationFrame(animate);
} animate();