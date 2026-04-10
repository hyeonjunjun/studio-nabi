"use client";

import { useState, useRef, useEffect } from "react";
import BloomNode from "@/components/BloomNode";
import BloomBar from "@/components/BloomBar";
import BloomPath from "@/components/BloomPath";

export default function BloomTestPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("work");
  const navRef = useRef<HTMLDivElement>(null);
  const [navWidth, setNavWidth] = useState(400);
  const [navPositions, setNavPositions] = useState<Record<string, { center: number; width: number }>>({});

  const navItems = ["work", "about", "archive"];

  useEffect(() => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setNavWidth(rect.width);

    const positions: Record<string, { center: number; width: number }> = {};
    navRef.current.querySelectorAll("[data-nav-item]").forEach((el) => {
      const itemRect = (el as HTMLElement).getBoundingClientRect();
      const id = (el as HTMLElement).dataset.navItem!;
      positions[id] = {
        center: (itemRect.left - rect.left + itemRect.width / 2) / rect.width,
        width: itemRect.width / rect.width,
      };
    });
    setNavPositions(positions);
  }, []);

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
      {/* Section 0: BloomBar Navigation */}
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
          Navigation Bar — WuWa Active Section Treatment
        </span>

        <div
          ref={navRef}
          style={{
            display: "inline-flex",
            gap: 40,
            paddingBottom: 0,
            position: "relative",
          }}
        >
          {navItems.map((item) => (
            <button
              key={item}
              data-nav-item={item}
              onClick={() => setActiveNav(item)}
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                color: activeNav === item ? "var(--ink-primary)" : "var(--ink-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 0",
                transition: "color 200ms",
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <BloomBar
          activePosition={navPositions[activeNav]?.center ?? 0.2}
          activeWidth={navPositions[activeNav]?.width ? navPositions[activeNav].width + 0.06 : 0.15}
          isActive={true}
          width={navWidth}
        />

        <p
          className="font-body"
          style={{
            fontSize: 14,
            color: "var(--ink-ghost)",
            marginTop: 24,
            maxWidth: "50ch",
          }}
        >
          Click the nav items above. The bloom bar tracks the active section with a flowing, undulating line. Particles rise from the active zone.
        </p>
      </section>

      {/* Section: BloomPath — Vertical Navigation */}
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
          Vertical Path — WuWa Menu Treatment
        </span>

        <div style={{ display: "flex", gap: 80 }}>
          {/* Path with text labels */}
          <div>
            <BloomPath
              nodes={[
                { id: "work", label: "Work", icon: "◆" },
                { id: "about", label: "About", icon: "◇" },
                { id: "archive", label: "Archive", icon: "○" },
              ]}
              activeId={activeNav}
              onSelect={setActiveNav}
            />
          </div>

          {/* Path with just icons — more WuWa-like */}
          <div>
            <span
              className="font-mono"
              style={{ fontSize: 11, color: "var(--ink-ghost)", display: "block", marginBottom: 16 }}
            >
              Icons only
            </span>
            <BloomPath
              nodes={[
                { id: "work", label: "", icon: "◆" },
                { id: "about", label: "", icon: "◇" },
                { id: "archive", label: "", icon: "○" },
              ]}
              activeId={activeNav}
              onSelect={setActiveNav}
            />
          </div>
        </div>

        <p
          className="font-body"
          style={{
            fontSize: 14,
            color: "var(--ink-ghost)",
            marginTop: 24,
            maxWidth: "50ch",
          }}
        >
          Click any node. The glow radiates from the active icon center. The connecting line brightens near the active node and fades to dim elsewhere. Particles float along the path.
        </p>
      </section>

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
          {["Gyeol: 결", "Sift", "Promptineer", "Clouds at Sea"].map(
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
