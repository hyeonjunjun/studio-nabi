import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-[clamp(32px,5vw,48px)] font-normal text-fg mb-4 tracking-[-0.02em]">
          404
        </h1>
        <p className="text-[14px] text-fg-2 mb-6">
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 no-underline hover:text-fg transition-colors duration-300"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
