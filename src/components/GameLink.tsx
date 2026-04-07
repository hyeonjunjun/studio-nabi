"use client";

import { useCallback, type ReactNode, type CSSProperties } from "react";
import { useTransitionRouter } from "./TransitionProvider";

interface GameLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  "data-cursor"?: string;
}

/**
 * Link that uses the cinematic page transition system.
 * Use this instead of Next.js <Link> for inter-page navigation.
 */
export default function GameLink({
  href,
  children,
  className,
  style,
  onClick,
  ...rest
}: GameLinkProps) {
  const { navigateTo } = useTransitionRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClick?.();
      navigateTo(href);
    },
    [href, navigateTo, onClick]
  );

  return (
    <a href={href} onClick={handleClick} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}
