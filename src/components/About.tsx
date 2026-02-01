"use client";

import MaskReveal from "./MaskReveal";

export default function About() {
    return (
        <section id="about" className="border-b border-foreground/10 pb-32">
            <div className="grid md:grid-cols-2 gap-16">
                {/* Section header */}
                <div>
                    <MaskReveal delay={0.1}>
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-8 block font-heading">
                            01. Essence
                        </span>
                        <h3 className="text-4xl font-bold uppercase font-heading">Organic<br />Logic.</h3>
                    </MaskReveal>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    <MaskReveal delay={0.2}>
                        <p className="text-lg font-serif leading-relaxed opacity-90">
                            I specialize in digital experiences that blend precision engineering
                            with biological motion. My work is not just about pixels—it's about
                            the feeling of the space in between them.
                        </p>
                    </MaskReveal>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-foreground/10">
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50">Core</h4>
                            <ul className="space-y-2 text-sm font-medium">
                                <li>Creative Development</li>
                                <li>Interface Design</li>
                                <li>System Architecture</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50">Stack</h4>
                            <ul className="space-y-2 text-sm font-medium">
                                <li>Next.js / React</li>
                                <li>WebGL / Three.js</li>
                                <li>Tailwind / Framer</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
