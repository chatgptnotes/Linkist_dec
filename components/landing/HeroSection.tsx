import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-[#050505] overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E02424]/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E02424]/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-[#E1E1E1]"
        >
          The Worlds First <br />
          <span className="text-[#A0A0A0]">Personal Relationship</span> <br />
          <span className="text-[#E1E1E1]">Management Tool</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto mb-12"
        >
          Linkist gives you the tools to strategically track, nurture, and leverage every key relationship.
        </motion.p>

        {/* Hero Visual - Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative mx-auto w-full max-w-4xl mt-12"
        >
          <div className="relative z-10">
            <img
              src="/hero_dashboard_hand.png"
              alt="Linkist Dashboard"
              className="w-full h-auto drop-shadow-2xl"
            />

            {/* Floating Badge - AI Powered */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-4 md:right-10 bg-[#1C1C22]/80 backdrop-blur-md border border-[#333] p-4 rounded-2xl flex items-center gap-3 shadow-2xl"
            >
              <div className="w-10 h-10 rounded-full bg-[#E02424]/20 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">AI-Powered</div>
                <div className="text-xs text-[#888]">Context Recall</div>
              </div>
            </motion.div>
          </div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#E02424]/10 blur-[120px] rounded-full -z-10" />
        </motion.div>
      </div>
    </section>
  );
}