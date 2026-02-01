"use client";

import { ReactNode } from "react";
import MaskReveal from "./MaskReveal";

interface SectionProps {
    id: string;
    title?: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

export default function Section({ id, title, subtitle, children, className = "" }: SectionProps) {
    return (
        <section id={id} className={`py-24 md:py-32 relative ${className}`}>
            <div className="container relative z-10">
                {(title || subtitle) && (
                    <div className="mb-16 md:mb-24">
                        {subtitle && (
                            <MaskReveal delay={0.1}>
                                <span className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4 block font-heading">
                                    {subtitle}
                                </span>
                            </MaskReveal>
                        )}
                        {title && (
                            <MaskReveal direction="up" duration={1.2}>
                                <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-foreground font-heading">
                                    {title}
                                </h2>
                            </MaskReveal>
                        )}
                    </div>
                )}
                {children}
            </div>

            {/* Subtle divider line for structure */}
            <div className="container absolute bottom-0 left-1/2 -translate-x-1/2 w-full px-8 opacity-10">
                <div className="w-full h-px bg-foreground" />
            </div>
        </section>
    );
}
