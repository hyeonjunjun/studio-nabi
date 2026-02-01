"use client";

import { ReactNode } from "react";
// @ts-ignore
import { ReactLenis } from "@studio-freight/react-lenis";

export default function InertialScroll({ children }: { children: ReactNode }) {
    const lenisOptions = {
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1.1,
        autoResize: true,
    };

    const LenisComponent = ReactLenis as any;

    return (
        <LenisComponent root options={lenisOptions}>
            {children}
        </LenisComponent>
    );
}
