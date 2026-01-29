import { motion } from "framer-motion";
import avator from "../assets/avator.png";

export default function About() {
  const stats = [
    { label: "Projects", value: "15+" },
    { label: "Speciality", value: "Full Stack" },
    { label: "Expertise", value: "High-Performance Web Apps" },
  ];

  const glows = [
    "top-10 left-10 w-[360px] h-[360px] opacity-20 blur-[120px]",
    "bottom-0 right-10 w-[420px] h-[420px] opacity-15 blur-[140px] delay-300",
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] opacity-10 blur-[100px]",
  ];

  return (
    <section
      id="about"
      className="min-h-screen w-full flex items-center justify-center relative bg-black text-white overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        {glows.map((g, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-r from-[#302b63] via-[#00b8f8] to-[#1c8dd2] animate-pulse ${g}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 md:px-10 lg:px-12 py-20 flex flex-col gap-12">
        {/* Top section */}
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-stretch gap-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <motion.div
            className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1c8dd2]/20 to-[#302b63]/20"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src={Avator} alt="Avatar" />
          </motion.div>

          <div className="flex-1 flex flex-col justify-center text-center md:text-left">
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent
              bg-gradient-to-r from-[#1cd8a2] via-[#1cd8a2] to-[#1cd8a2] mb-6"
            >
              Ansh Rathore
            </h2>

            <p className="mt-2 text-lg sm:text-xl text-white font-semibold">
              Full Stack Developer
            </p>

            <p className="mt-4 text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl md:max-w-3xl">
              I build scalable MERN stack applications with a strong focus on
              clean architecture, responsive UI, and performance. My toolkit
              includes MongoDB, Express, React, and Node.js—turning ideas into
              production-ready products with robust APIs and smooth user
              experiences.
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
              {stats.map((item, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="text-sm text-gray-400">{item.label}</div>
                  <div className="text-base font-semibold">{item.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-lg bg-white text-black font-semibold px-5 py-3 hover:bg-gray-200 transition"
              >
                View Projects
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 text-white px-5 py-3 hover:bg-white/20 transition"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>

        {/* About Me section */}
        <div className="mt-6 max-w-3xl">
          <h3 className="text-2xl font-bold mb-4">About Me</h3>
          <p className="text-gray-300 mb-2">
            I’m a software and web developer who enjoys building fast, reliable
            applications and sharing what I learn along the way.
          </p>
          <p className="text-gray-300">
            I focus on building scalable, user-centric products that create real
            impact.
          </p>
        </div>
      </div>
    </section>
  );
}
