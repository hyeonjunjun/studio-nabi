"use client";

import { useState, useCallback, useRef } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * useTextScramble
 * ───────────────
 * A hook that scrambles text into a target string.
 * Common in high-end Awwwards portfolios (Studio Dialect, etc.).
 */
export function useTextScramble(text: string) {
    const [displayText, setDisplayText] = useState(text);
    const iterationRef = useRef(0);
    const frameRef = useRef<number>(0);

    const scramble = useCallback(() => {
        iterationRef.current = 0;

        const update = () => {
            setDisplayText(prev =>
                text.split("")
                    .map((char, index) => {
                        if (index < iterationRef.current) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iterationRef.current < text.length) {
                iterationRef.current += 1 / 3;
                frameRef.current = requestAnimationFrame(update);
            }
        };

        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(update);
    }, [text]);

    return { displayText, scramble };
}
