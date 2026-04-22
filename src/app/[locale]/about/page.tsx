'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, Users, Sparkles, Leaf, Lightbulb, MapPin, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { icon: Users, title: t('value1Title'), text: t('value1Text'), color: 'bg-primary-500/10 text-primary-500' },
    { icon: Leaf, title: t('value2Title'), text: t('value2Text'), color: 'bg-green-500/10 text-green-500' },
    { icon: Lightbulb, title: t('value3Title'), text: t('value3Text'), color: 'bg-accent-500/10 text-accent-500' },
    { icon: Heart, title: t('value4Title'), text: t('value4Text'), color: 'bg-red-500/10 text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/about_hero.png"
          alt="Premium Makeup"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-4 transform-gpu">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Sparkles className="w-12 h-12 text-primary-400 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6 tracking-tight">
              {t('title')}
            </h1>
            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-32">
        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center text-center lg:text-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 transform-gpu"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 dark:text-white">
              {t('storyTitle')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
              {t('storyText')}
            </p>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl"
          >
             <Image
               src="/about_story.png"
               alt="Our Evolution"
               fill
               className="object-cover"
             />
          </motion.div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative p-10 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary-500/50 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
              {t('missionTitle')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg italic">
              "{t('missionText')}"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative p-10 rounded-[2.5rem] bg-primary-600 text-white shadow-xl shadow-primary-500/20"
          >
            <h2 className="text-2xl font-bold font-display mb-4">
              {t('visionTitle')}
            </h2>
            <p className="text-primary-50 leading-relaxed text-lg">
              {t('visionText')}
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-neutral-900 dark:text-white">
              {t('valuesTitle')}
            </h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all group transform-gpu"
              >
                <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact/Location Section */}
        <section className="pt-16">
          <div className="bg-neutral-900 dark:bg-neutral-900/50 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
             
             <div className="grid lg:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-8">
                  <h2 className="text-3xl md:text-4xl font-bold font-display">
                    {t('contactTitle')}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{t('locationTitle')}</h4>
                        <p className="text-neutral-400 mt-1">{t('locationText')}</p>
                      </div>
                    </div>

                    <a 
                      href={`https://wa.me/${t('whatsappNumber').replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 group p-4 -m-4 rounded-2xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <WhatsAppIcon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="text-lg font-semibold">{t('whatsappTitle')}</h4>
                           <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-neutral-400 mt-1 font-mono tracking-wider">{t('whatsappNumber')}</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="relative aspect-video lg:aspect-auto rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                   <Image
                     src="/about_showroom.png"
                     alt="Our Showroom"
                     fill
                     className="object-cover opacity-60"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
