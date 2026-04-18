"use client";

import { useState } from "react";
import BloomNode from "@/components/BloomNode";

export default function BloomTestPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <main
      id="main"
      style={{
        minHeight: "100vh",
        padding: "120px clamp(24px, 8vw, 80px)",
        display: "flex",
        flexDirection: "column",
        gap: 80,
      }}
    >
      {/* Section 1: Side-by-side inactive vs active */}
      <section>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
            display: "block",
            marginBottom: 32,
          }}
        >
          Inactive vs Active
        </span>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <BloomNode active={false} style={{ padding: 32, width: 200 }}>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "var(--ink-muted)",
              }}
            >
              Inactive
            </span>
          </BloomNode>

          <BloomNode active={true} style={{ padding: 32, width: 200 }}>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "var(--ink-primary)",
              }}
            >
              Active
            </span>
          </BloomNode>
        </div>
      </section>

      {/* Section 2: Hover-activated nodes */}
      <section>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
            display: "block",
            marginBottom: 32,
          }}
        >
          Hover to Activate
        </span>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {["Gyeol: 결", "Sift", "Pane", "Clouds at Sea"].map(
            (name, i) => (
              <BloomNode
                key={name}
                active={activeId === name}
                onMouseEnter={() => setActiveId(name)}
                onMouseLeave={() => setActiveId(null)}
                style={{
                  padding: "24px 32px",
                  cursor: "pointer",
                  minWidth: 180,
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color:
                      activeId === name
                        ? "var(--ink-primary)"
                        : "var(--ink-muted)",
                    display: "block",
                    marginBottom: 8,
                    transition: "color 200ms",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: 18,
                    fontStyle: "italic",
                    color:
                      activeId === name
                        ? "var(--ink-full)"
                        : "var(--ink-secondary)",
                    transition: "color 200ms",
                  }}
                >
                  {name}
                </span>
              </BloomNode>
            )
          )}
        </div>
      </section>

      {/* Section 3: Navigation node simulation */}
      <section>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
            display: "block",
            marginBottom: 32,
          }}
        >
          Navigation Nodes (Vertical)
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 140,
          }}
        >
          {["Work", "About", "Archive"].map((label) => (
            <BloomNode
              key={label}
              active={activeId === label}
              onMouseEnter={() => setActiveId(label)}
              onMouseLeave={() => setActiveId(null)}
              cornerSize={8}
              noParticles
              style={{
                padding: "12px 16px",
                cursor: "pointer",
              }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color:
                    activeId === label
                      ? "var(--ink-primary)"
                      : "var(--ink-muted)",
                  transition: "color 200ms",
                }}
              >
                {label}
              </span>
            </BloomNode>
          ))}
        </div>
      </section>

      {/* Section 4: Large format — case study card */}
      <section>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
            display: "block",
            marginBottom: 32,
          }}
        >
          Large Format — Project Card
        </span>
        <BloomNode
          active={activeId === "card"}
          onMouseEnter={() => setActiveId("card")}
          onMouseLeave={() => setActiveId(null)}
          cornerSize={20}
          style={{
            padding: 40,
            maxWidth: 480,
            cursor: "pointer",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "var(--ink-ghost)",
              display: "block",
              marginBottom: 16,
            }}
          >
            01 · Material Science · 2026
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: 32,
              fontStyle: "italic",
              fontWeight: 400,
              color:
                activeId === "card"
                  ? "var(--ink-full)"
                  : "var(--ink-primary)",
              lineHeight: 1.2,
              marginBottom: 12,
              transition: "color 300ms",
            }}
          >
            Gyeol: 결
          </h2>
          <p
            className="font-body"
            style={{
              fontSize: 15,
              color: "var(--ink-secondary)",
              lineHeight: 1.6,
              maxWidth: "42ch",
            }}
          >
            Conceptual fragrance and e-commerce brand rooted in Korean
            craft traditions.
          </p>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.06em",
              color:
                activeId === "card"
                  ? "var(--gold)"
                  : "var(--ink-ghost)",
              display: "block",
              marginTop: 24,
              transition: "color 300ms",
            }}
          >
            [ View Case Study ]
          </span>
        </BloomNode>
      </section>

      {/* Section 5: Tiny node — icon scale */}
      <section>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
            display: "block",
            marginBottom: 32,
          }}
        >
          Tiny Node (Icon Scale)
        </span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {[false, true].map((isActive, i) => (
            <BloomNode
              key={i}
              active={isActive}
              cornerSize={4}
              noParticles
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: isActive
                    ? "var(--gold)"
                    : "var(--ink-muted)",
                }}
              >
                ◆
              </span>
            </BloomNode>
          ))}
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: "var(--ink-ghost)",
              marginLeft: 8,
            }}
          >
            ← inactive / active →
          </span>
        </div>
      </section>
    </main>
  );
}
