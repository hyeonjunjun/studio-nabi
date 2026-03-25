"use client";

import { useCallback, type ReactNode, type CSSProperties } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  [key: string]: unknown;
}

export default function TransitionLink({
  href,
  children,
  className,
  style,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const transitioning = useStudioStore((s) => s.transitioning);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (transitioning) return;
      if (pathname === href) return;
      if (onClick) onClick();

      // Dispatch a custom event that the layout's PageTransition listens for
      const event = new CustomEvent("page-transition", { detail: { href } });
      window.dispatchEvent(event);
    },
    [href, pathname, transitioning, onClick]
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
}
