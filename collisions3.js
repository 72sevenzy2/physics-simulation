/* @type {HTMLCanvasElement} **/
const canvas = document.querySelector("canvas"); const context = canvas.getContext("2d");
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
window.addEventListener("resize", () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight })
let mousec = { x: undefined, y: undefined }; canvas.addEventListener("mousemove", (event) => {
    mousec.x = event.clientX; mousec.y = event.clientY;
});
class partials {
    constructor(radius, x, y) {
        this.radius = radius; this.positionX = x; this.positionY = y; this.startA = 0; this.mass = 1; this.linew = 1;
        this.initialcolor = `hsl(${Math.random() * 360}, 0%, 70%)`; this.defaultcolor = this.initialcolor;
        const speed = 10; const angelS = Math.random() * Math.PI * 2;
        this.velocityX = Math.cos(angelS) * speed; this.velocityY = Math.sin(angelS) * speed;
    }
    configpositions() {
        if (this.positionX + this.radius > canvas.width) { this.positionX = canvas.width - this.radius; this.velocityX *= -1 };
        if (this.positionX - this.radius < 0) { this.positionX = this.radius; this.velocityX *= -1 };
        if (this.positionY + this.radius > canvas.height) { this.positionY = canvas.height - this.radius; this.velocityY *= -1 };
        if (this.positionY - this.radius < 0) { this.positionY = this.radius; this.velocityY *= -1 };
        this.positionX += this.velocityX; this.positionY += this.velocityY; this.creating();
        if (mousec.x !== undefined && mousec.y !== undefined) {
            const displacementX = mousec.x - this.positionX; const displacementY = mousec.y - this.positionY;
            const dist = Math.sqrt(displacementX ** 2 + displacementY ** 2);
            if (dist < 50) { this.initialcolor = `hsl(${Math.random() * 360}, 70%, 80%)` };
            if (dist > 50) { this.initialcolor = this.defaultcolor };
        }
    }
    creating() {
        context.beginPath(); context.lineWidth = this.linew; context.fillStyle = this.initialcolor;
        context.strokeStyle = `hsl(${Math.random() * 360}, 0%, 70%)`;
        context.arc(this.positionX, this.positionY, this.radius, this.startA, Math.PI * 2, false);
        context.fill(); context.stroke(); context.closePath();
    }
} let partial = []; for (let j = 0; j < 20; j++) { partial.push(new partials(40, 70, 30)) };
export default function resolveCollision(p1, p2) {
    const d1x = p2.positionX - p1.positionX; const d1y = p2.positionY - p1.positionY;
    const hyp = Math.hypot(d1x, d1y); if (hyp === 0) { return null }; const overlap = 0.5 * (p1.radius + p2.radius - hyp);
    const sock = (d1x / hyp) * overlap; const rock = (d1y / hyp) * overlap;
    p1.positionX -= sock; p1.positionY -= rock; p2.positionX += sock; p2.positionY += rock;
    const dx = p2.positionX - p1.positionX; const dy = p2.positionY - p1.positionY;
    const phi = Math.atan2(dy, dx); const v1 = Math.sqrt(p1.velocityX ** 2 + p1.velocityY ** 2);
    const v2 = Math.sqrt(p2.velocityX ** 2 + p2.velocityY ** 2);
    const theta1 = Math.atan2(p1.velocityY, p1.velocityX); const theta2 = Math.atan2(p2.velocityY, p2.velocityX);
    const m1 = p1.mass; const m2 = p2.mass;
    const v1x = (
        ((v1 * Math.cos(theta1 - phi)) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2)
    ) * Math.cos(phi) + v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
    const v1y = (
        ((v1 * Math.cos(theta1 - phi)) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2)
    ) * Math.sin(phi) + v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
    const v2x = (
        ((v2 * Math.cos(theta2 - phi)) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2)
    ) * Math.cos(phi) + v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
    const v2y = (
        ((v2 * Math.cos(theta2 - phi)) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2)
    ) * Math.sin(phi) + v1 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);
    p1.velocityX = v1x; p1.velocityY = v1y; p2.velocityX = v2x; p2.velocityY = v2y;
}
function detection() {
    for (let i = 0; i < partial.length; i++) {
        for (let j = i + 1; j < partial.length; j++) {
            const p1 = partial[i]; const p2 = partial[j];
            const dx = p1.positionX - p2.positionX; const dy = p1.positionY - p2.positionY;
            const distance = Math.hypot(dx, dy);
            if (distance < p1.radius + p2.radius) {
                resolveCollision(p1, p2);
            }
        }
    }
}
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height); detection();
    for (const j of partial) { j.configpositions(); } requestAnimationFrame(animate);
} animate();