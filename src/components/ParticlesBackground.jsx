import { useEffect, useRef } from "react";

export default function ParticlesBackground() {
  const canvasref = useRef(null);

  useEffect(() => {
    const canvas = canvasref.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    const particlecount = 50;
    const colors = ["rgba(255,255,255,0.7)"];

    class particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedx = (Math.random() - 1) * 0.5;
        this.speedy = (Math.random() - 1) * 0.5;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.speedx;
        this.y += this.speedy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
        this.draw();
      }
    }

    function createparticles() {
      particles = [];
      for (let i = 0; i < particlecount; i++) {
        particles.push(new particle());
      }
    }

    function handleresize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createparticles();
    }

    handleresize();
    window.addEventListener("resize", handleresize);

    let animationid;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => p.update());
      animationid = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationid);
      window.removeEventListener("resize", handleresize);
    };
  }, []);

  return (
    <canvas
      ref={canvasref}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    ></canvas>
  );
}
