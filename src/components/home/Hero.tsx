'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Star } from 'lucide-react';
import { useRef } from 'react';

export function Hero() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // High-performance Parallax Transformers
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const floatY1 = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const floatY2 = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Cinematic Mouse Tracking (Fluid Dynamics)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 40;
    const y = ((e.clientY - top) / height - 0.5) * 40;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Matrix-like 3D rotations based on mouse
  const rotateX = useTransform(smoothMouseY, [-20, 20], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-20, 20], [-8, 8]);

  // Custom glowing radial gradient mask that follows the mouse
  const radialGradient = useMotionTemplate`radial-gradient(circle 600px at ${useTransform(smoothMouseX, [-20, 20], [0, 100])}% ${useTransform(smoothMouseY, [-20, 20], [0, 100])}%, rgba(255,255,255,0.06), transparent 60%)`;

  const heroTitle = t('heroTitle');
  const words = heroTitle.split(' ');

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] lg:h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] text-white selection:bg-rose-500/30"
    >
      {/* Immersive Cinematic Background Effects */}
      <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700"
        style={{ background: radialGradient }}
      />

      {/* Deep Glowing Orbs for Luxury 'Aura' */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-[10%] w-[40vw] h-[40vw] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-[10%] w-[35vw] h-[35vw] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
      />

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative lg:absolute lg:inset-0 z-10 w-full min-h-screen lg:min-h-0 lg:h-full grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 sm:px-12 lg:px-20 xl:px-32 max-w-[2000px] mx-auto items-center perspective-1000 pt-32 pb-24 lg:py-0"
      >

        {/* Left: Elevated Typography & Actions */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-30 col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-center"
        >
          {/* Glassmorphic Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full text-sm font-medium tracking-[0.2em] uppercase mb-10 lg:mb-12 border border-white/10 w-fit transition-colors duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-transparent to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Sparkles className="w-4 h-4 text-rose-400 group-hover:text-rose-300 transition-colors relative z-10" />
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent group-hover:to-white transition-colors duration-500 relative z-10">
              {t('badge')}
            </span>
          </motion.div>

          {/* Staggered & Masked Title Reveal with Alternate Typing */}
          <h1 className="text-[3.25rem] sm:text-2xl lg:text-3xl xl:text-4xl font-bold font-display leading-[2] tracking-tighter mb-8 z-10 relative flex flex-wrap">
            {words.map((word, i) => (
              <span key={i} className="block overflow-hidden pb-1 sm:pb-3 mr-[0.25em] rtl:mr-0 rtl:ml-[0.25em]">
                <motion.span
                  initial={{ y: "120%", rotateZ: 5 }}
                  animate={{ y: "0%", rotateZ: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.15,
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1] // Extremely smooth ease-out
                  }}
                  className={`inline-block ${i % 2 !== 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-white italic font-serif tracking-normal' : 'text-white'}`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl lg:text-2xl text-neutral-400 max-w-xl mb-12 leading-relaxed font-light"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Buttons with Magnetic-like Feel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row flex-wrap gap-6 mt-4"
          >
            <Link href="/products" className="block w-full sm:w-auto">
              <div className="group relative w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <Button size="lg" className="relative w-full sm:w-auto bg-white hover:bg-neutral-100 text-neutral-950 rounded-full text-base sm:text-lg px-12 py-7 h-auto transition-all shadow-xl font-medium">
                  <span className="flex items-center justify-center gap-3">
                    {t('shopNow')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1.5" />
                  </span>
                </Button>
              </div>
            </Link>

            <Link href="/about" className="block w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto group rounded-full text-white border-white/20 hover:bg-white/10 text-base sm:text-lg px-12 py-7 h-auto backdrop-blur-md transition-all hover:border-white/40 font-medium">
                <span className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current opacity-90" />
                  </div>
                  {t('exploreCollection')}
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Jaw-Dropping Dimensional Image Collage */}
        <motion.div
          className="relative z-20 col-span-1 lg:col-span-6 xl:col-span-7 h-[45vh] sm:h-[55vh] lg:h-[85vh] mt-10 lg:mt-0 w-full perspective-1000"
          style={{ y: imageY, opacity }}
        >
          <motion.div
            className="relative w-full h-full preserve-3d"
            style={{ rotateX, rotateY }}
          >
            {/* Main Centerpiece Image */}
            <motion.div
              className="absolute inset-0 lg:inset-y-10 lg:right-0 lg:left-12 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] lg:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] bg-neutral-900 z-10"
              initial={{ scale: 0.9, opacity: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ translateZ: 0 }}
            >
              <div className="absolute inset-0 bg-neutral-950/20 mix-blend-multiply z-10 pointer-events-none" />
              <img
                src="/hero_main.png"
                alt="Luxury Beauty Collection"
                className="w-full h-full object-cover object-[30%_50%] scale-105"
              />
              {/* Inner glow/shadow for depth */}
              <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] z-20 pointer-events-none" />
            </motion.div>

            {/* Left Overlapping Polaroid */}
            <motion.div
              className="absolute -bottom-8 -left-4 lg:-bottom-12 lg:-left-16 w-48 sm:w-64 lg:w-72 xl:w-80 aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] bg-neutral-800 z-30 hidden sm:block"
              style={{ translateZ: 100, y: floatY1 }}
              initial={{ opacity: 0, x: -60, y: 60, rotateZ: -15 }}
              animate={{ opacity: 1, x: 0, y: 0, rotateZ: -6 }}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute z-10 inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none" />
              <img src="/products_hero.png" alt="Featured Product" className="w-full h-full object-cover" />
            </motion.div>

            {/* Right Top Floating Element */}
            <motion.div
              className="absolute -top-6 -right-4 lg:-top-10 lg:-right-8 w-40 sm:w-48 lg:w-56 xl:w-64 aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] bg-neutral-800 z-0 hidden md:block"
              style={{ translateZ: -60, y: floatY2 }}
              initial={{ opacity: 0, x: 60, y: -60, rotateZ: 15 }}
              animate={{ opacity: 1, x: 0, y: 0, rotateZ: 8 }}
              transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src="/about_hero.png" alt="Showroom" className="w-full h-full object-cover opacity-90" />
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      {/* Exquisite Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 cursor-pointer flex flex-col items-center gap-3 group hidden sm:flex"
        onClick={() => {
          const nextSection = document.querySelector('section')?.nextElementSibling;
          nextSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 group-hover:text-white transition-colors duration-300">Scroll down</span>
        <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

