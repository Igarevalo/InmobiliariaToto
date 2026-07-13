"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ from, to, duration = 2, suffix = "" }: { from: number, to: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing out function
        const easeOutQuad = progress * (2 - progress);
        setCount(Math.floor(easeOutQuad * (to - from) + from));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [from, to, duration, isInView]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold font-display text-[#1a365d]">
      {count}{suffix}
    </span>
  );
}

export function StatsCounter() {
  return (
    <section className="py-16 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center space-y-2 px-4"
          >
            <Counter from={0} to={1500} suffix="+" />
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Propiedades Vendidas</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center space-y-2 px-4"
          >
            <Counter from={0} to={15} suffix="+" />
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Años de Experiencia</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center space-y-2 px-4"
          >
            <Counter from={0} to={98} suffix="%" />
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Clientes Satisfechos</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center justify-center space-y-2 px-4"
          >
            <Counter from={0} to={45} />
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Agentes Expertos</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
