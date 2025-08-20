/* @type {HTMLCanvasElement} **/
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Partial {
    constructor() {
        this.radius = 20;
        this.mass = 1; // assuming unit mass for all
        this.positionX = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.positionY = Math.random() * (canvas.height - this.radius * 2) + this.radius;
        this.velocityX = (Math.random() - 0.5) * 10;
        this.velocityY = (Math.random() - 0.5) * 10;
        this.initialcolor = `hsl(${Math.random() * 360}, 0%, 40%)`;
    }

    updatePosition() {
        // wall collision
        if (this.positionX + this.radius > canvas.width || this.positionX - this.radius < 0) {
            this.velocityX *= -1;
        }
        if (this.positionY + this.radius > canvas.height || this.positionY - this.radius < 0) {
            this.velocityY *= -1;
        }

        this.positionX += this.velocityX;
        this.positionY += this.velocityY;
        this.draw();
    }

    draw() {
        context.beginPath();
        context.lineWidth = 1;
        context.fillStyle = this.initialcolor;
        context.strokeStyle = `hsl(${Math.random() * 360}, 0%, 50%)`;
        context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.fill();
        context.closePath();
    }
}

let particles = [];
for (let i = 0; i < 10; i++) {
    particles.push(new Partial());
}

// Elastic collision formula between two particles
function resolveCollision(p1, p2) {
    const dx = p2.positionX - p1.positionX;
    const dy = p2.positionY - p1.positionY;

    const phi = Math.atan2(dy, dx);

    const v1 = Math.sqrt(p1.velocityX ** 2 + p1.velocityY ** 2);
    const v2 = Math.sqrt(p2.velocityX ** 2 + p2.velocityY ** 2);

    const theta1 = Math.atan2(p1.velocityY, p1.velocityX);
    const theta2 = Math.atan2(p2.velocityY, p2.velocityX);

    const m1 = p1.mass;
    const m2 = p2.mass;

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
    ) * Math.sin(phi) + v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

    p1.velocityX = v1x;
    p1.velocityY = v1y;     
    p2.velocityX = v2x;
    p2.velocityY = v2y;
}

function detectCollisions() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            const dx = p2.positionX - p1.positionX;
            const dy = p2.positionY - p1.positionY;
            const distance = Math.hypot(dx, dy);

            if (distance < p1.radius + p2.radius) {
                resolveCollision(p1, p2);
            }
        }
    }
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    detectCollisions();

    for (const p of particles) {
        p.updatePosition();
    }
    requestAnimationFrame(animate);
}

animate();
        