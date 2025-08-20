/* @type {HTMLCanvasElement} **/
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
})
class circle {
    constructor() {
        this.radius = 50; this.initialcolor = `hsl(${Math.random() * 360}, 40%, 70%)`;
        this.positionX = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        if (this.positionX > canvas.width) { this.positionX - canvas.width };
        this.positionY = Math.random() * (canvas.height - this.radius * 2) + this.radius;
        if (this.positionY > canvas.height) { this.positionY - canvas.height };
        this.velocityX = (Math.random() * 1) * (Math.random() * 10); // unclear if will be used
        this.velocityY = (Math.random() * 1) * (Math.random() * 2);
        this.gravity = 1; this.friction = 1;
    }
    configpositions() {
        this.velocityY += this.gravity; this.positionY += this.velocityY; this.positionX += this.velocityX;
        if (this.positionX + this.radius > canvas.width || this.positionX - this.radius < 0) { this.velocityX *= -1; };
        if (this.positionY + this.radius > canvas.height) { // simulation of gravity in code..........
            this.positionY = (canvas.height - this.radius); this.velocityY *= -this.friction;
        }; if (Math.abs(this.velocityY) < 1) { this.velocityY = 0 };
    }
    creationings() {
        context.beginPath(); context.lineWidth = 4; context.fillStyle = this.initialcolor;
        context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
        context.stroke(); context.fill(); context.closePath();
    }
} let partials = []; for (let j = 0; j < 100; j++) { partials.push(new circle()); }
function reqframe() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const j of partials) { j.configpositions(); j.creationings(); } requestAnimationFrame(reqframe);
} reqframe();