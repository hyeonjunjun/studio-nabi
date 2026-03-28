"use client";

import { useRouter } from "next/navigation";
import { usePageTransition } from "@/lib/transition-context";
import { ReactNode, MouseEvent } from "react";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export default function TransitionLink({
  href,
  children,
  className,
  style,
  "aria-label": ariaLabel,
}: TransitionLinkProps) {
  const router = useRouter();
  const { triggerTransition, isTransitioning } = usePageTransition();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (isTransitioning) return;

    // External / anchor / mailto links open in new tab
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    triggerTransition(() => {
      router.push(href);
    });
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
