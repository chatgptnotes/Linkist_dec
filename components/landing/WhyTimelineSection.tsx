import { motion } from 'framer-motion';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CycloneIcon from '@mui/icons-material/Cyclone';

export default function WhyTimelineSection() {
    const timelineEvents = [
        {
            id: '01',
            icon: HandshakeIcon,
            title: 'Day 1: You meet.',
            description: 'Over Coffee and discuss what your bring to their business.'
        },
        {
            id: '02',
            icon: HelpOutlineIcon,
            title: 'Day 7: You forget what made them relevant.',
            description: 'How you had ideas that would take the business to the next level.'
        },
        {
            id: '03',
            icon: CycloneIcon,
            title: 'Day 30: The lead goes cold after a generic, low-context follow-up.',
            description: 'Lost all connection because action didnt take place at the right time in the right context.'
        }
    ];

    return (
        <section className="relative py-24 bg-[#050505] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-start">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="sticky top-24"
                >
                    {/* Badge */}
                    <div className="inline-block px-4 py-1.5 rounded-full border border-[#E02424]/30 bg-[#E02424]/10 text-[#E02424] text-xs font-semibold tracking-wider uppercase mb-8">
                        The Why
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                        The handshake is <br />
                        easy. Remembering <br />
                        is hard.
                    </h2>

                    <p className="text-[#888] leading-relaxed max-w-md">
                        You don’t lose opportunities because you run out of business cards You lose them when you lose context, timing, and recall.
                    </p>
                </motion.div>

                {/* Right Timeline Visual */}
                <div className="relative pl-8 md:pl-0">
                    <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-[#FF0000]" />

                    <div className="space-y-12">
                        {timelineEvents.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative flex items-start gap-8"
                            >
                                {/* Circle Number */}
                                <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-[#E02424] flex items-center justify-center text-white font-bold text-lg border-4 border-[#050505]">
                                    {event.id}
                                </div>

                                {/* Content */}
                                <div className="pt-2">
                                    <div className="mb-2 text-white">
                                        <event.icon className="w-8 h-8 opacity-90" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    <p className="text-[#888] leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
