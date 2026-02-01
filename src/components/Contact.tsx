"use client";

import MaskReveal from "./MaskReveal";
import { ArrowUpRight } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="pb-24">
            <div className="grid md:grid-cols-2 gap-16 items-end">
                <div>
                    <MaskReveal delay={0.1}>
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-8 block font-heading">
                            03. Presence
                        </span>
                        <h3 className="text-5xl md:text-7xl font-bold uppercase font-heading leading-none">
                            Let's<br />Build.
                        </h3>
                    </MaskReveal>
                </div>

                <div className="space-y-8">
                    <MaskReveal delay={0.2}>
                        <p className="text-lg font-serif opacity-80 max-w-sm">
                            Currently available for select projects and collaborations.
                            Let's create something structurally sound.
                        </p>
                    </MaskReveal>

                    <MaskReveal delay={0.3}>
                        <a href="mailto:hello@hyeonjun.space" className="inline-flex items-center gap-4 text-xl font-bold uppercase tracking-widest hover:text-accent transition-colors group">
                            hello@hyeonjun.space
                            <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </MaskReveal>
                </div>
            </div>

            <div className="mt-32 pt-8 border-t border-foreground/10 flex justify-between text-[10px] uppercase tracking-widest opacity-40">
                <span>© 2026 Hyeonjun Jun</span>
                <span>All Rights Reserved</span>
            </div>
        </section>
    );
}
