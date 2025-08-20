/* @type {HTMLCanvasElement} **/
const canv = document.querySelector("canvas");
const context = canv.getContext("2d");
canv.width = window.innerWidth; canv.height = window.innerHeight;
window.addEventListener("resize", () => {
    canv.width = window.innerWidth; canv.height = window.innerHeight;
}); let clientmove = { x: undefined, y: undefined };
canv.addEventListener("mousemove", (event) => {
    clientmove.x = event.clientX; clientmove.y = event.clientY;
});
class partials {
    constructor() {
         /* size of the circles **/ this.radius = 10; this.originialradius = this.radius; this.maxradius = 20;
        this.positionX = Math.random() * (canv.width - this.radius * 2) + this.radius;
        this.positionY = Math.random() * (canv.height - this.radius * 2) + this.radius;
        this.velocityX = (Math.random() - 0.2) * (Math.random() * 1) + performance.now() * 0.001;
        this.velocityY = (Math.random() - 0.2) * (Math.random() * 1) + performance.now() * 0.001;
        this.initialcolor = `hsl(${Math.random() * 360}, 0%, 60%)`;
    }
    configposition() {
        if (this.positionX + this.radius > canv.width || this.positionX - this.radius < 0) { this.velocityX *= -1 };
        if (this.positionY + this.radius > canv.height || this.positionY - this.radius < 0) { this.velocityY *= -1 };
        this.position += this.velocityY; this.position += this.velocityX; this.creationing();
        if (clientmove.x !== undefined && clientmove.y !== undefined) {
            const distanceX = clientmove.x - this.positionX; const distanceY = clientmove.y - this.positionY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if (distance < 50) {
                if (this.radius < this.maxradius) this.radius += 1; this.initialcolor =
                    `hsl(${Math.random() * 360}, 100%, 70%)`;
            } else { if (this.radius > this.originialradius) this.radius -= 1; };
        }
    }
    creationing() {
        context.beginPath(); context.lineWidth = 1; context.fillStyle = this.initialcolor;
        context.strokeStyle = `hsl(${Math.random() * 360}, 0%, 72%)`;
        context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
        context.stroke(); context.fill(); context.closePath();
    }
} let partial = []; for (let j = 0; j < 800; j++) { partial.push(new partials()); }
function easing() {
    context.clearRect(0, 0, canv.width, canv.height); for (const s of partial) { s.configposition(); }
    requestAnimationFrame(easing);
} easing();